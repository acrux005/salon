import { unlink } from "fs/promises";
import path from "path";

/** Usuwa plik zdjęcia z public/uploads/randki jeśli ścieżka lokalna. */
export async function deleteDatingPhotoFile(url: string): Promise<void> {
  if (!url.startsWith("/uploads/randki/")) return;
  const filePath = path.join(process.cwd(), "public", url.replace(/^\//, ""));
  try {
    await unlink(filePath);
  } catch {
    /* plik mógł nie istnieć */
  }
}

export async function deleteDatingPhotoFiles(urls: string[]): Promise<void> {
  await Promise.all(urls.map((u) => deleteDatingPhotoFile(u)));
}
