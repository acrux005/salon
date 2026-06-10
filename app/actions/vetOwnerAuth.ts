"use server";

import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { VET_OWNER_ROLE } from "@/lib/auth";
import { getPrisma } from "@/lib/db";
import { ensurePetOwnerProfileAtClinic } from "@/lib/vet/ownerAccount";
import { buildPedigreeJson } from "@/lib/vet/petDocumentExtract";
import { normalizeSpeciesValue } from "@/lib/vet/speciesCatalog";

export type VetOwnerAuthResult = { ok: true; accountId: string } | { ok: false; error: string };

export async function registerVetOwnerAction(formData: FormData): Promise<VetOwnerAuthResult> {
  const name = formData.get("name")?.toString()?.trim();
  const phone = formData.get("phone")?.toString()?.trim();
  const email = formData.get("email")?.toString()?.trim()?.toLowerCase();
  const password = formData.get("password")?.toString() ?? "";
  const vetClinicSlug = formData.get("vetClinicSlug")?.toString()?.trim();
  const smsConsent = formData.get("smsConsent") !== "false";
  const emailConsent = formData.get("emailConsent") !== "false";
  const pushConsent = formData.get("pushConsent") === "true";
  const marketingConsent = formData.get("marketingConsent") === "true";

  if (!name || !phone || !email || !password) {
    return { ok: false, error: "Imię, telefon, e-mail i hasło są wymagane." };
  }
  if (password.length < 8) {
    return { ok: false, error: "Hasło musi mieć co najmniej 8 znaków." };
  }
  if (!vetClinicSlug) {
    return { ok: false, error: "Wybierz przychodnię." };
  }

  try {
    const prisma = getPrisma();
    const clinic = await prisma.vetClinic.findUnique({ where: { slug: vetClinicSlug } });
    if (!clinic) return { ok: false, error: "Nie znaleziono wybranej przychodni." };

    const existing = await prisma.vetOwnerAccount.findUnique({ where: { email } });
    if (existing) return { ok: false, error: "Konto z tym e-mailem już istnieje. Zaloguj się." };

    const passwordHash = await bcrypt.hash(password, 10);
    const account = await prisma.vetOwnerAccount.create({
      data: {
        email,
        passwordHash,
        name,
        phone,
        activeVetClinicId: clinic.id,
        emailVerifiedAt: new Date(),
      },
    });

    const owner = await ensurePetOwnerProfileAtClinic({
      accountId: account.id,
      vetClinicId: clinic.id,
      name,
      phone,
      email,
    });
    await prisma.petOwner.update({
      where: { id: owner.id },
      data: { smsConsent, emailConsent, pushConsent, marketingConsent },
    });

    return { ok: true, accountId: account.id };
  } catch {
    return { ok: false, error: "Nie udało się utworzyć konta." };
  }
}

export async function changeVetOwnerClinicAction(vetClinicSlug: string): Promise<VetOwnerAuthResult> {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== VET_OWNER_ROLE) {
    return { ok: false, error: "Brak uprawnień." };
  }
  const accountId = (session?.user as { vetOwnerAccountId?: string })?.vetOwnerAccountId;
  if (!accountId) return { ok: false, error: "Brak konta." };

  try {
    const prisma = getPrisma();
    const clinic = await prisma.vetClinic.findUnique({ where: { slug: vetClinicSlug.trim() } });
    if (!clinic) return { ok: false, error: "Nie znaleziono przychodni." };

    const account = await prisma.vetOwnerAccount.findUnique({ where: { id: accountId } });
    if (!account) return { ok: false, error: "Nie znaleziono konta." };

    await prisma.vetOwnerAccount.update({
      where: { id: accountId },
      data: { activeVetClinicId: clinic.id },
    });

    await ensurePetOwnerProfileAtClinic({
      accountId,
      vetClinicId: clinic.id,
      name: account.name,
      phone: account.phone,
      email: account.email,
    });

    return { ok: true, accountId };
  } catch {
    return { ok: false, error: "Nie udało się zmienić przychodni." };
  }
}

export async function addOwnerPetAction(
  formData: FormData
): Promise<{ ok: true; petId: string } | { ok: false; error: string }> {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== VET_OWNER_ROLE) {
    return { ok: false, error: "Brak uprawnień." };
  }
  const accountId = (session?.user as { vetOwnerAccountId?: string })?.vetOwnerAccountId;
  if (!accountId) return { ok: false, error: "Brak konta." };

  try {
    const prisma = getPrisma();
    const account = await prisma.vetOwnerAccount.findUnique({ where: { id: accountId } });
    if (!account?.activeVetClinicId) {
      return { ok: false, error: "Wybierz aktywną przychodnię w ustawieniach." };
    }
    const activeVetClinicId = account.activeVetClinicId;

    const name = formData.get("name")?.toString()?.trim();
    if (!name) return { ok: false, error: "Imię zwierzęcia jest wymagane." };

    const owner = await ensurePetOwnerProfileAtClinic({
      accountId,
      vetClinicId: activeVetClinicId,
      name: account.name,
      phone: account.phone,
      email: account.email,
    });

    const pedigreeNotes = formData.get("pedigreeNotes")?.toString()?.trim() || null;
    const pedigreeLinesRaw = formData.get("pedigreeLines")?.toString()?.trim();
    const pedigreeLines = pedigreeLinesRaw
      ? pedigreeLinesRaw.split("\n").map((l) => l.trim()).filter(Boolean)
      : [];

    const pet = await prisma.pet.create({
      data: {
        ownerId: owner.id,
        accountId,
        name,
        species: normalizeSpeciesValue(formData.get("species")?.toString()?.trim() || "pies"),
        breed: formData.get("breed")?.toString()?.trim() || null,
        sex: formData.get("sex")?.toString()?.trim() || null,
        coatColor: formData.get("coatColor")?.toString()?.trim() || null,
        birthDate: formData.get("birthDate")?.toString()?.trim() || null,
        chipNumber: formData.get("chipNumber")?.toString()?.trim() || null,
        chipDate: formData.get("chipDate")?.toString()?.trim() || null,
        chipManufacturer: formData.get("chipManufacturer")?.toString()?.trim() || null,
        pedigreeNotes,
        pedigreeJson: buildPedigreeJson(pedigreeLines, pedigreeNotes),
        notes: formData.get("notes")?.toString()?.trim() || null,
      },
    });

    return { ok: true, petId: pet.id };
  } catch {
    return { ok: false, error: "Nie udało się dodać zwierzęcia." };
  }
}
