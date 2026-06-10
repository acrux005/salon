/** Klient: HEIC → JPEG + kompresja przed uploadem (iPhone robi 4–12 MB). */

const DEFAULT_MAX_BYTES = 1_600_000;
const DEFAULT_MAX_EDGE = 2048;

function isHeicFile(file: File): boolean {
  const type = file.type?.toLowerCase() ?? "";
  const name = file.name?.toLowerCase() ?? "";
  return (
    type.includes("heic") ||
    type.includes("heif") ||
    /\.heic$/i.test(name) ||
    /\.heif$/i.test(name)
  );
}

/** @deprecated Użyj prepareImageForUpload */
export async function prepareClientImageFile(file: File): Promise<File> {
  return prepareImageForUpload(file);
}

function canvasToJpegBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob((b) => resolve(b), "image/jpeg", quality);
  });
}

function jpegFileName(original: File): string {
  const base = (original.name || "photo").replace(/\.[^.]+$/i, "") || "photo";
  return `${base}.jpg`;
}

async function bitmapToCompressedJpegFile(
  bitmap: ImageBitmap,
  original: File,
  maxBytes: number,
  maxEdge: number
): Promise<File | null> {
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.drawImage(bitmap, 0, 0, w, h);

  let quality = 0.85;
  for (let i = 0; i < 6; i++) {
    const blob = await canvasToJpegBlob(canvas, quality);
    if (blob && blob.size <= maxBytes) {
      return new File([blob], jpegFileName(original), {
        type: "image/jpeg",
        lastModified: original.lastModified,
      });
    }
    quality -= 0.1;
  }

  const blob = await canvasToJpegBlob(canvas, 0.55);
  if (!blob) return null;
  return new File([blob], jpegFileName(original), {
    type: "image/jpeg",
    lastModified: original.lastModified,
  });
}

/** Safari/iOS często dekoduje HEIC natywnie — bez ciężkiego heic2any (mniej „loading failed”). */
async function decodeViaImageBitmap(
  file: File,
  maxBytes: number,
  maxEdge: number
): Promise<File | null> {
  if (typeof createImageBitmap === "undefined") return null;
  let bitmap: ImageBitmap | null = null;
  try {
    bitmap = await createImageBitmap(file);
    const out = await bitmapToCompressedJpegFile(bitmap, file, maxBytes, maxEdge);
    return out;
  } catch {
    return null;
  } finally {
    bitmap?.close?.();
  }
}

async function convertHeicWithHeic2any(file: File): Promise<File> {
  const heic2any = (await import("heic2any")).default;
  const converted = await heic2any({
    blob: file,
    toType: "image/jpeg",
    quality: 0.88,
  });
  const blob = Array.isArray(converted) ? converted[0] : converted;
  const baseName = file.name.replace(/\.heic$/i, "").replace(/\.heif$/i, "") || "photo";
  return new File([blob], `${baseName}.jpg`, {
    type: "image/jpeg",
    lastModified: file.lastModified,
  });
}

/**
 * Przygotuj plik z aparatu/galerii: HEIC→JPEG, skalowanie i kompresja pod limit serwera.
 */
export async function prepareImageForUpload(
  file: File,
  opts?: { maxBytes?: number; maxEdge?: number }
): Promise<File> {
  const maxBytes = opts?.maxBytes ?? DEFAULT_MAX_BYTES;
  const maxEdge = opts?.maxEdge ?? DEFAULT_MAX_EDGE;

  if (isHeicFile(file)) {
    const native = await decodeViaImageBitmap(file, maxBytes, maxEdge);
    if (native) return native;

    try {
      const fromLib = await convertHeicWithHeic2any(file);
      if (fromLib.size <= maxBytes) return fromLib;
      const compressed = await decodeViaImageBitmap(fromLib, maxBytes, maxEdge);
      if (compressed) return compressed;
      if (fromLib.size <= maxBytes * 1.5) return fromLib;
    } catch (e) {
      console.error("[prepareImageForUpload] HEIC conversion failed:", e);
      throw new Error(
        "Nie udało się odczytać zdjęcia HEIC. W iPhone: Ustawienia → Aparat → Formaty → „Najbardziej kompatybilne” (JPG)."
      );
    }
  }

  if (file.size <= maxBytes && (file.type === "image/jpeg" || file.type === "image/jpg")) {
    return file;
  }

  const compressed = await decodeViaImageBitmap(file, maxBytes, maxEdge);
  if (compressed) return compressed;

  if (file.size > maxBytes * 1.5) {
    throw new Error("Zdjęcie jest za duże do wysłania. Spróbuj ponownie z aparatu.");
  }
  return file;
}
