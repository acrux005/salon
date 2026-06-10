"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { VET_CLINIC_ROLE, VET_OWNER_ROLE } from "@/lib/auth";
import { getPrisma } from "@/lib/db";
import { deletePetPhotoFile, savePetPhotoFile } from "@/lib/vet/petPhoto";

export type PetPhotoActionResult = { ok: true; photoUrl: string | null } | { ok: false; error: string };

async function assertPetPhotoAccess(petId: string): Promise<
  | { ok: true; pet: { id: string; photoUrl: string | null } }
  | { ok: false; error: string }
> {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role;
  const prisma = getPrisma();

  if (role === VET_CLINIC_ROLE) {
    const vetClinicId = (session?.user as { vetClinicId?: string })?.vetClinicId;
    if (!vetClinicId) return { ok: false, error: "Brak uprawnień." };
    const pet = await prisma.pet.findFirst({
      where: { id: petId, owner: { vetClinicId } },
      select: { id: true, photoUrl: true },
    });
    if (!pet) return { ok: false, error: "Nie znaleziono zwierzęcia." };
    return { ok: true, pet };
  }

  if (role === VET_OWNER_ROLE) {
    const accountId = (session?.user as { vetOwnerAccountId?: string })?.vetOwnerAccountId;
    if (!accountId) return { ok: false, error: "Brak uprawnień." };
    const pet = await prisma.pet.findFirst({
      where: { id: petId, accountId },
      select: { id: true, photoUrl: true },
    });
    if (!pet) return { ok: false, error: "Nie znaleziono zwierzęcia." };
    return { ok: true, pet };
  }

  return { ok: false, error: "Brak uprawnień." };
}

export async function uploadPetPhotoAction(formData: FormData): Promise<PetPhotoActionResult> {
  const petId = formData.get("petId")?.toString()?.trim();
  const file = formData.get("photo");
  if (!petId) return { ok: false, error: "Brak identyfikatora zwierzęcia." };
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Wybierz plik ze zdjęciem." };
  }

  const access = await assertPetPhotoAccess(petId);
  if (!access.ok) return access;

  const saved = await savePetPhotoFile(petId, file);
  if ("error" in saved) return { ok: false, error: saved.error };

  if (access.pet.photoUrl && access.pet.photoUrl !== saved.url) {
    await deletePetPhotoFile(access.pet.photoUrl);
  }

  try {
    const prisma = getPrisma();
    await prisma.pet.update({
      where: { id: petId },
      data: { photoUrl: saved.url },
    });
    return { ok: true, photoUrl: saved.url };
  } catch {
    return { ok: false, error: "Nie udało się zapisać zdjęcia w bazie." };
  }
}

export async function removePetPhotoAction(petId: string): Promise<PetPhotoActionResult> {
  if (!petId?.trim()) return { ok: false, error: "Brak identyfikatora zwierzęcia." };

  const access = await assertPetPhotoAccess(petId);
  if (!access.ok) return access;

  if (access.pet.photoUrl) {
    await deletePetPhotoFile(access.pet.photoUrl);
  }

  try {
    const prisma = getPrisma();
    await prisma.pet.update({
      where: { id: petId },
      data: { photoUrl: null },
    });
    return { ok: true, photoUrl: null };
  } catch {
    return { ok: false, error: "Nie udało się usunąć zdjęcia." };
  }
}
