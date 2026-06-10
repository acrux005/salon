import sharp from "sharp";

const STORE_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);

const HEIC_MIME = new Set([
  "image/heic",
  "image/heif",
  "image/heic-sequence",
  "image/heif-sequence",
]);

/** Rozpoznaj MIME z File (Safari/iOS często zostawia pusty type przy .heic). */
export function resolveDatingImageMime(file: File): string | null {
  const type = file.type?.toLowerCase().trim();
  if (type && (STORE_MIME.has(type) || HEIC_MIME.has(type))) return type;
  const name = file.name?.toLowerCase() ?? "";
  if (/\.(jpe?g)$/.test(name)) return "image/jpeg";
  if (name.endsWith(".png")) return "image/png";
  if (name.endsWith(".webp")) return "image/webp";
  if (/\.heic$/.test(name)) return "image/heic";
  if (/\.heif$/.test(name)) return "image/heif";
  return null;
}

export function isHeicMime(mime: string): boolean {
  return HEIC_MIME.has(mime.toLowerCase());
}

export function isAllowedDatingImageMime(mime: string): boolean {
  const m = mime.toLowerCase();
  return STORE_MIME.has(m) || HEIC_MIME.has(m);
}

/** Konwertuje HEIC/HEIF → JPEG; pozostałe formaty bez zmian. */
export async function normalizeDatingImageBuffer(
  buffer: Buffer,
  sourceMime: string
): Promise<{ buffer: Buffer; mime: string } | { error: string }> {
  const mime = sourceMime.toLowerCase();
  if (STORE_MIME.has(mime)) {
    return { buffer, mime };
  }
  if (!isHeicMime(mime)) {
    return { error: "Dozwolone formaty: JPG, PNG, WebP, HEIC (iPhone)." };
  }
  try {
    const jpeg = await sharp(buffer, { failOn: "none" }).rotate().jpeg({ quality: 90 }).toBuffer();
    return { buffer: jpeg, mime: "image/jpeg" };
  } catch (e) {
    console.error("[normalizeDatingImage] HEIC conversion failed:", e);
    return {
      error:
        "Nie udało się odczytać zdjęcia HEIC. Zrób zdjęcie ponownie aparatem lub w Ustawieniach iPhone wybierz „Najbardziej kompatybilne” (JPG).",
    };
  }
}

export async function prepareDatingImageFile(
  file: File
): Promise<{ raw: Buffer; sourceMime: string; buffer: Buffer; mime: string } | { error: string }> {
  const sourceMime = resolveDatingImageMime(file);
  if (!sourceMime || !isAllowedDatingImageMime(sourceMime)) {
    return { error: "Dozwolone formaty: JPG, PNG, WebP, HEIC (iPhone)." };
  }
  const raw = Buffer.from(await file.arrayBuffer());
  const normalized = await normalizeDatingImageBuffer(raw, sourceMime);
  if ("error" in normalized) return normalized;
  return { raw, sourceMime, buffer: normalized.buffer, mime: normalized.mime };
}
