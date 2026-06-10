import "server-only";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";

export const MAX_GAB_LOGO_SIZE = 2 * 1024 * 1024;
export const ALLOWED_GAB_LOGO_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
export const GAB_LOGOS_DIR = "uploads/gabinet/logos";

export async function saveGabClinicLogoFile(
  gabClinicId: string,
  file: File
): Promise<{ url: string } | { error: string }> {
  if (!ALLOWED_GAB_LOGO_TYPES.has(file.type)) {
    return { error: "Dozwolone formaty logo: JPG, PNG, WEBP." };
  }
  if (file.size > MAX_GAB_LOGO_SIZE) {
    return { error: "Logo może mieć maks. 2 MB." };
  }
  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const fileName = `${gabClinicId}.${ext}`;
  const dir = path.join(process.cwd(), "public", GAB_LOGOS_DIR);
  const url = `/${GAB_LOGOS_DIR}/${fileName}`;
  try {
    await mkdir(dir, { recursive: true });
    const bytes = await file.arrayBuffer();
    await writeFile(path.join(dir, fileName), Buffer.from(bytes));
    return { url };
  } catch {
    return { error: "Nie udało się zapisać logo." };
  }
}

export async function deleteGabClinicLogoFile(logoUrl: string | null | undefined): Promise<void> {
  if (!logoUrl?.startsWith(`/${GAB_LOGOS_DIR}/`)) return;
  try {
    await unlink(path.join(process.cwd(), "public", logoUrl.replace(/^\//, "")));
  } catch {
    /* ignore */
  }
}
