import exifr from "exifr";

export type PhotoVerifyMode = "moment" | "profile";

export type PhotoVerifyResult =
  | { ok: true; capturedAt: Date | null; source: "exif" | "client" | "none" }
  | { ok: false; error: string };

const MOMENT_MAX_AGE_MS = 12 * 60 * 1000;
const PROFILE_MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;

const CAPTURE_DATE_KEYS = [
  "DateTimeOriginal",
  "CreateDate",
  "ModifyDate",
  "DateTime",
  "CreationDate",
  "MediaCreateDate",
  "ContentCreateDate",
  "SubSecDateTimeOriginal",
  "SubSecCreateDate",
];

function pickCaptureDate(exif: Record<string, unknown> | null): Date | null {
  if (!exif) return null;
  for (const k of CAPTURE_DATE_KEYS) {
    const v = exif[k];
    if (v instanceof Date && !Number.isNaN(v.getTime())) return v;
    if (typeof v === "string") {
      const d = new Date(v.replace(/^(\d{4}):(\d{2}):(\d{2})/, "$1-$2-$3"));
      if (!Number.isNaN(d.getTime())) return d;
    }
  }
  return null;
}

async function parseExifCapture(buffer: Buffer): Promise<Record<string, unknown> | null> {
  try {
    const picked = (await exifr.parse(buffer, {
      pick: CAPTURE_DATE_KEYS,
      reviveValues: true,
    })) as Record<string, unknown> | null;
    if (pickCaptureDate(picked)) return picked;
  } catch {
    /* try full parse */
  }
  try {
    return (await exifr.parse(buffer, { reviveValues: true })) as Record<string, unknown> | null;
  } catch {
    return null;
  }
}

/** Sprawdza świeżość momentu po dacie z EXIF lub z klienta (HEIC→JPEG bez EXIF). */
export function verifyMomentCaptureTime(
  capturedAt: Date
): PhotoVerifyResult {
  const now = Date.now();
  const age = now - capturedAt.getTime();
  if (age < -2 * 60 * 1000) {
    return { ok: false, error: "Data zdjęcia w przyszłości — odrzucono." };
  }
  if (age > MOMENT_MAX_AGE_MS) {
    return {
      ok: false,
      error: "Zdjęcie starsze niż 12 min — daily moment musi być świeże z aparatu.",
    };
  }
  return { ok: true, capturedAt, source: "exif" };
}

const MOMENT_PAIR_MAX_GAP_MS = 15 * 60 * 1000;

/** Oba kadry z jednej sesji (świeże + nie za daleko od siebie w czasie). */
export function verifyMomentPairCaptureTimes(
  worldAt: Date,
  selfieAt: Date
): PhotoVerifyResult {
  const worldCheck = verifyMomentCaptureTime(worldAt);
  if (!worldCheck.ok) return worldCheck;
  const selfieCheck = verifyMomentCaptureTime(selfieAt);
  if (!selfieCheck.ok) return selfieCheck;
  const gap = Math.abs(worldAt.getTime() - selfieAt.getTime());
  if (gap > MOMENT_PAIR_MAX_GAP_MS) {
    return {
      ok: false,
      error: "Oba zdjęcia muszą być z tej samej sesji (max 15 min między otoczeniem a selfie).",
    };
  }
  return { ok: true, capturedAt: worldAt, source: "exif" };
}

/** Weryfikacja anti-spoof: EXIF timestamp + świeżość zdjęcia. */
export async function verifyDatingImageBuffer(
  buffer: Buffer,
  mime: string,
  mode: PhotoVerifyMode
): Promise<PhotoVerifyResult> {
  if (mime === "image/webp") {
    if (mode === "moment") {
      return { ok: false, error: "Daily moment wymaga JPG/PNG z aparatu (WebP bez EXIF)." };
    }
    return { ok: true, capturedAt: null, source: "none" };
  }

  const exif = await parseExifCapture(buffer);
  const capturedAt = pickCaptureDate(exif);

  if (mode === "moment") {
    if (!capturedAt) {
      return {
        ok: false,
        error: "Brak metadanych EXIF — zrób zdjęcie bezpośrednio aparatem (nie z galerii).",
      };
    }
    return verifyMomentCaptureTime(capturedAt);
  }

  const now = Date.now();
  if (capturedAt) {
    const age = now - capturedAt.getTime();
    if (age > PROFILE_MAX_AGE_MS) {
      return { ok: false, error: "Zdjęcie profilowe wygląda na bardzo stare (EXIF > 1 rok)." };
    }
    if (age < -2 * 60 * 1000) {
      return { ok: false, error: "Data zdjęcia w przyszłości — odrzucono." };
    }
    return { ok: true, capturedAt, source: "exif" };
  }

  return { ok: true, capturedAt: null, source: "none" };
}
