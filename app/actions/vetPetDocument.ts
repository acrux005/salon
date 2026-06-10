"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { VET_CLINIC_ROLE, VET_OWNER_ROLE } from "@/lib/auth";
import { getPrisma } from "@/lib/db";
import { deletePetDocumentFile, savePetDocumentFile } from "@/lib/vet/petDocument";
import {
  buildPetDocumentMeta,
  normalizePetDocumentType,
  parsePetDocumentMeta,
} from "@/lib/vet/petDocumentTypes";

export type PetDocumentActionResult = { ok: true } | { ok: false; error: string };

async function requireClinicPetAccess(petId: string): Promise<
  | { ok: true; vetClinicId: string; accountId: null }
  | { ok: false; error: string }
> {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== VET_CLINIC_ROLE) {
    return { ok: false, error: "Brak uprawnień." };
  }
  const vetClinicId = (session?.user as { vetClinicId?: string })?.vetClinicId;
  if (!vetClinicId) return { ok: false, error: "Brak uprawnień." };

  const prisma = getPrisma();
  const pet = await prisma.pet.findFirst({
    where: { id: petId, owner: { vetClinicId } },
    select: { id: true },
  });
  if (!pet) return { ok: false, error: "Nie znaleziono zwierzęcia." };
  return { ok: true, vetClinicId, accountId: null };
}

async function requireOwnerPetAccess(petId: string): Promise<
  | { ok: true; vetClinicId: string; accountId: string }
  | { ok: false; error: string }
> {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== VET_OWNER_ROLE) {
    return { ok: false, error: "Brak uprawnień." };
  }
  const accountId = (session?.user as { vetOwnerAccountId?: string })?.vetOwnerAccountId;
  if (!accountId) return { ok: false, error: "Brak uprawnień." };

  const prisma = getPrisma();
  const pet = await prisma.pet.findFirst({
    where: { id: petId, accountId },
    select: { id: true, owner: { select: { vetClinicId: true } } },
  });
  if (!pet) return { ok: false, error: "Nie znaleziono zwierzęcia." };
  return { ok: true, vetClinicId: pet.owner.vetClinicId, accountId };
}

export async function uploadPetDocumentAction(formData: FormData): Promise<PetDocumentActionResult> {
  const petId = formData.get("petId")?.toString()?.trim();
  const documentType = normalizePetDocumentType(formData.get("documentType")?.toString());
  const file = formData.get("file");

  if (!petId) return { ok: false, error: "Brak identyfikatora zwierzęcia." };
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Wybierz plik (PDF, JPG lub PNG)." };
  }

  const access = await requireClinicPetAccess(petId);
  if (!access.ok) return access;

  const prisma = getPrisma();
  const doc = await prisma.vetPetDocument.create({
    data: {
      petId,
      vetClinicId: access.vetClinicId,
      documentType,
      fileName: file.name,
    },
  });

  const saved = await savePetDocumentFile(petId, doc.id, file);
  if ("error" in saved) {
    await prisma.vetPetDocument.delete({ where: { id: doc.id } });
    return { ok: false, error: saved.error };
  }

  await prisma.vetPetDocument.update({
    where: { id: doc.id },
    data: {
      extractedJson: buildPetDocumentMeta({
        fileUrl: saved.url,
        mimeType: saved.mimeType,
        sizeBytes: saved.sizeBytes,
      }),
    },
  });

  return { ok: true };
}

export async function uploadOwnerPetDocumentAction(formData: FormData): Promise<PetDocumentActionResult> {
  const petId = formData.get("petId")?.toString()?.trim();
  const documentType = normalizePetDocumentType(formData.get("documentType")?.toString());
  const file = formData.get("file");

  if (!petId) return { ok: false, error: "Brak identyfikatora zwierzęcia." };
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Wybierz plik (PDF, JPG lub PNG)." };
  }

  const access = await requireOwnerPetAccess(petId);
  if (!access.ok) return access;

  const prisma = getPrisma();
  const doc = await prisma.vetPetDocument.create({
    data: {
      petId,
      accountId: access.accountId,
      vetClinicId: access.vetClinicId,
      documentType,
      fileName: file.name,
    },
  });

  const saved = await savePetDocumentFile(petId, doc.id, file);
  if ("error" in saved) {
    await prisma.vetPetDocument.delete({ where: { id: doc.id } });
    return { ok: false, error: saved.error };
  }

  await prisma.vetPetDocument.update({
    where: { id: doc.id },
    data: {
      extractedJson: buildPetDocumentMeta({
        fileUrl: saved.url,
        mimeType: saved.mimeType,
        sizeBytes: saved.sizeBytes,
      }),
    },
  });

  return { ok: true };
}

export async function deletePetDocumentAction(documentId: string): Promise<PetDocumentActionResult> {
  if (!documentId?.trim()) return { ok: false, error: "Brak identyfikatora dokumentu." };

  const session = await getServerSession(authOptions);
  const vetClinicId = (session?.user as { vetClinicId?: string })?.vetClinicId;
  if ((session?.user as { role?: string })?.role !== VET_CLINIC_ROLE || !vetClinicId) {
    return { ok: false, error: "Brak uprawnień." };
  }

  const prisma = getPrisma();
  const doc = await prisma.vetPetDocument.findFirst({
    where: { id: documentId, vetClinicId },
  });
  if (!doc) return { ok: false, error: "Nie znaleziono dokumentu." };

  const meta = parsePetDocumentMeta(doc.extractedJson);
  if (meta.fileUrl) await deletePetDocumentFile(meta.fileUrl);

  await prisma.vetPetDocument.delete({ where: { id: documentId } });
  return { ok: true };
}
