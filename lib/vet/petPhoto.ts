import "server-only";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";

export const MAX_PET_PHOTO_SIZE = 3 * 1024 * 1024; // 3 MB
export const ALLOWED_PET_PHOTO_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
export const PET_PHOTOS_DIR = "uploads/vet/pets";

export async function savePetPhotoFile(
  petId: string,
  file: File
): Promise<{ url: string; absolutePath: string } | { error: string }> {
  if (!ALLOWED_PET_PHOTO_TYPES.has(file.type)) {
    return { error: "Dozwolone formaty: JPG, PNG, WebP." };
  }
  if (file.size > MAX_PET_PHOTO_SIZE) {
    return { error: "Zdjęcie może mieć maks. 3 MB." };
  }

  const ext = file.type === "image/jpeg" ? "jpg" : file.type === "image/png" ? "png" : "webp";
  const fileName = `${petId}.${ext}`;
  const dir = path.join(process.cwd(), "public", PET_PHOTOS_DIR);
  const absolutePath = path.join(dir, fileName);
  const url = `/${PET_PHOTOS_DIR}/${fileName}`;

  try {
    await mkdir(dir, { recursive: true });
    const bytes = await file.arrayBuffer();
    await writeFile(absolutePath, Buffer.from(bytes));
    return { url, absolutePath };
  } catch (e) {
    console.error("savePetPhotoFile:", e);
    return { error: "Nie udało się zapisać zdjęcia." };
  }
}

export async function deletePetPhotoFile(photoUrl: string | null | undefined): Promise<void> {
  if (!photoUrl || photoUrl.startsWith("http")) return;
  const relative = photoUrl.replace(/^\//, "");
  const filePath = path.join(process.cwd(), "public", relative);
  try {
    await unlink(filePath);
  } catch {
    /* plik mógł nie istnieć */
  }
}
