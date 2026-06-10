/** Odczyt daty zdjęcia z EXIF w przeglądarce (przed ewentualną konwersją HEIC). */

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

function pickCaptureDate(exif: Record<string, unknown> | null | undefined): Date | null {
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

export async function extractClientCaptureDate(file: File): Promise<Date | null> {
  try {
    const exifr = (await import("exifr")).default;
    const picked = (await exifr.parse(file, {
      pick: CAPTURE_DATE_KEYS,
      reviveValues: true,
    })) as Record<string, unknown> | null;
    const fromPick = pickCaptureDate(picked);
    if (fromPick) return fromPick;
    const full = (await exifr.parse(file, { reviveValues: true })) as Record<string, unknown> | null;
    const fromFull = pickCaptureDate(full);
    if (fromFull) return fromFull;
  } catch {
    /* Safari/iOS często blokuje EXIF w File — fallback poniżej */
  }
  return getFileModifiedCaptureDate(file);
}

/** iOS Safari po zdjęciu z `<input capture>` zwykle ustawia lastModified ≈ teraz. */
export function getFileModifiedCaptureDate(file: File): Date | null {
  if (!file.lastModified || file.lastModified <= 0) return null;
  return new Date(file.lastModified);
}
