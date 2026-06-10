import "server-only";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";

export const MAX_PET_DOCUMENT_SIZE = 10 * 1024 * 1024; // 10 MB
export const ALLOWED_PET_DOCUMENT_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
]);
export const PET_DOCUMENTS_DIR = "uploads/vet/documents";

function extForMime(mime: string): string {
  if (mime === "application/pdf") return "pdf";
  if (mime === "image/png") return "png";
  return "jpg";
}

export async function savePetDocumentFile(
  petId: string,
  documentId: string,
  file: File
): Promise<{ url: string; mimeType: string; sizeBytes: number } | { error: string }> {
  if (!ALLOWED_PET_DOCUMENT_TYPES.has(file.type)) {
    return { error: "Dozwolone formaty: PDF, JPG, PNG." };
  }
  if (file.size > MAX_PET_DOCUMENT_SIZE) {
    return { error: "Plik może mieć maks. 10 MB." };
  }

  const ext = extForMime(file.type);
  const fileName = `${documentId}.${ext}`;
  const dir = path.join(process.cwd(), "public", PET_DOCUMENTS_DIR, petId);
  const absolutePath = path.join(dir, fileName);
  const url = `/${PET_DOCUMENTS_DIR}/${petId}/${fileName}`;

  try {
    await mkdir(dir, { recursive: true });
    const bytes = await file.arrayBuffer();
    await writeFile(absolutePath, Buffer.from(bytes));
    return { url, mimeType: file.type, sizeBytes: file.size };
  } catch (e) {
    console.error("savePetDocumentFile:", e);
    return { error: "Nie udało się zapisać pliku." };
  }
}

export async function deletePetDocumentFile(fileUrl: string | null | undefined): Promise<void> {
  if (!fileUrl || fileUrl.startsWith("http")) return;
  const relative = fileUrl.replace(/^\//, "");
  const filePath = path.join(process.cwd(), "public", relative);
  try {
    await unlink(filePath);
  } catch {
    /* plik mógł nie istnieć */
  }
}
