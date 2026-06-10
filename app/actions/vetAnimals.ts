"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { VET_CLINIC_ROLE } from "@/lib/auth";
import { getPrisma } from "@/lib/db";
import { parsePetImportCsv } from "@/lib/vet/petImport";
import { normalizeSpeciesValue } from "@/lib/vet/speciesCatalog";
import { VET_PET_STATUSES } from "@/lib/vet/petStatus";
import { normalizePetSex, normalizeSafeAnimalStatus } from "@/lib/vet/safeAnimal";
import { buildPedigreeJson, type ExtractedPetVaccination, type ExtractedPetDeworming, type ExtractedPetEctoparasite } from "@/lib/vet/petDocumentExtract";
import { resolveDewormItemKey, isDewormingEntry } from "@/lib/vet/deworming";
import { resolveEctoparasiteItemKey, isEctoparasiteEntry } from "@/lib/vet/ectoparasites";
import { isTreatmentEntry } from "@/lib/vet/treatment";
import { normalizeCatLifestyle } from "@/lib/vet/catLifestyle";

export type VetAnimalActionResult = { ok: true; id?: string } | { ok: false; error: string };

export type VetPetImportResult =
  | { ok: true; imported: number; skipped: number; errors: string[] }
  | { ok: false; error: string };

async function requireVetClinicId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== VET_CLINIC_ROLE) return null;
  return (session?.user as { vetClinicId?: string })?.vetClinicId ?? null;
}

const VALID_STATUSES = new Set(VET_PET_STATUSES.map((s) => s.value));

function normalizePhone(phone: string): string {
  return phone.replace(/\s+/g, "").replace(/^\+48/, "");
}

function parsePetFormFields(formData: FormData) {
  return {
    name: formData.get("name")?.toString()?.trim() ?? "",
    species: normalizeSpeciesValue(formData.get("species")?.toString()?.trim() || "pies"),
    breed: formData.get("breed")?.toString()?.trim() || null,
    sex: normalizePetSex(formData.get("sex")?.toString()),
    coatColor: formData.get("coatColor")?.toString()?.trim() || null,
    birthDate: formData.get("birthDate")?.toString()?.trim() || null,
    chipNumber: formData.get("chipNumber")?.toString()?.trim() || null,
    chipDate: formData.get("chipDate")?.toString()?.trim() || null,
    chipManufacturer: formData.get("chipManufacturer")?.toString()?.trim() || null,
    safeAnimalStatus: normalizeSafeAnimalStatus(formData.get("safeAnimalStatus")?.toString()),
    notes: formData.get("notes")?.toString()?.trim() || null,
    herdId: formData.get("herdId")?.toString()?.trim() || null,
    status: formData.get("status")?.toString()?.trim() || "active",
    pedigreeNotes: formData.get("pedigreeNotes")?.toString()?.trim() || null,
    pedigreeLines: formData.get("pedigreeLines")?.toString()?.trim() || null,
    catLifestyle: normalizeCatLifestyle(formData.get("catLifestyle")?.toString()),
  };
}

async function findOrCreateVaccineType(vetClinicId: string, name: string) {
  const prisma = getPrisma();
  const normalized = name.trim();
  const existing = await prisma.vaccineType.findFirst({
    where: { vetClinicId, name: normalized },
  });
  if (existing) return existing;
  return prisma.vaccineType.create({
    data: { vetClinicId, category: "szczepienie", name: normalized, defaultIntervalDays: 365 },
  });
}

export async function importPetVaccinationsFromScanAction(
  formData: FormData
): Promise<{ ok: true; imported: number } | { ok: false; error: string }> {
  const vetClinicId = await requireVetClinicId();
  if (!vetClinicId) return { ok: false, error: "Brak uprawnień." };

  const petId = formData.get("petId")?.toString()?.trim();
  const raw = formData.get("vaccinationsJson")?.toString()?.trim();
  if (!petId || !raw) return { ok: false, error: "Brak danych szczepień." };

  let rows: ExtractedPetVaccination[];
  try {
    rows = JSON.parse(raw) as ExtractedPetVaccination[];
    if (!Array.isArray(rows)) throw new Error("invalid");
  } catch {
    return { ok: false, error: "Nieprawidłowy format szczepień." };
  }

  try {
    const prisma = getPrisma();
    const pet = await prisma.pet.findFirst({
      where: { id: petId, owner: { vetClinicId } },
    });
    if (!pet) return { ok: false, error: "Nie znaleziono zwierzęcia." };

    let imported = 0;
    for (const row of rows) {
      if (!row.vaccineName?.trim()) continue;
      if (isDewormingEntry(row.vaccineName)) continue;
      if (isEctoparasiteEntry(row.vaccineName)) continue;
      if (isTreatmentEntry(row.vaccineName)) continue;
      const vaccineType = await findOrCreateVaccineType(vetClinicId, row.vaccineName);
      const administeredAt = row.administeredAt
        ? new Date(`${row.administeredAt}T12:00:00`)
        : new Date();
      if (Number.isNaN(administeredAt.getTime())) continue;

      let nextDueAt: Date;
      if (row.nextDueAt) {
        nextDueAt = new Date(`${row.nextDueAt}T12:00:00`);
        if (Number.isNaN(nextDueAt.getTime())) {
          nextDueAt = new Date(administeredAt);
          nextDueAt.setDate(nextDueAt.getDate() + vaccineType.defaultIntervalDays);
        }
      } else {
        nextDueAt = new Date(administeredAt);
        nextDueAt.setDate(nextDueAt.getDate() + vaccineType.defaultIntervalDays);
      }

      await prisma.vaccination.create({
        data: {
          petId,
          vaccineTypeId: vaccineType.id,
          administeredAt,
          nextDueAt,
          batchNumber: row.batchNumber?.trim() || null,
          vetName: row.vetName?.trim() || null,
          notes: "Import ze skanu dokumentu",
        },
      });
      imported += 1;
    }

    return { ok: true, imported };
  } catch {
    return { ok: false, error: "Nie udało się zapisać szczepień ze skanu." };
  }
}

export async function importPetDewormingsFromScanAction(
  formData: FormData
): Promise<{ ok: true; imported: number } | { ok: false; error: string }> {
  const vetClinicId = await requireVetClinicId();
  if (!vetClinicId) return { ok: false, error: "Brak uprawnień." };

  const petId = formData.get("petId")?.toString()?.trim();
  const raw = formData.get("dewormingsJson")?.toString()?.trim();
  if (!petId || !raw) return { ok: false, error: "Brak danych odrobaczania." };

  let rows: ExtractedPetDeworming[];
  try {
    rows = JSON.parse(raw) as ExtractedPetDeworming[];
    if (!Array.isArray(rows)) throw new Error("invalid");
  } catch {
    return { ok: false, error: "Nieprawidłowy format odrobaczania." };
  }

  try {
    const prisma = getPrisma();
    const pet = await prisma.pet.findFirst({
      where: { id: petId, owner: { vetClinicId } },
    });
    if (!pet) return { ok: false, error: "Nie znaleziono zwierzęcia." };

    const itemKey = resolveDewormItemKey(pet.species, pet.birthDate);
    if (!itemKey) return { ok: false, error: "Brak planu odrobaczania dla tego gatunku." };

    let imported = 0;
    for (const row of rows) {
      if (!row.productName?.trim()) continue;
      const doneAt = row.administeredAt
        ? new Date(`${row.administeredAt}T12:00:00`)
        : new Date();
      if (Number.isNaN(doneAt.getTime())) continue;

      const notes = [
        `Preparat: ${row.productName.trim()}`,
        row.vetName?.trim() ? `Lekarz: ${row.vetName.trim()}` : null,
        "Import ze skanu książeczki (strona odrobaczania)",
      ]
        .filter(Boolean)
        .join(" · ");

      await prisma.petPreventionRecord.create({
        data: { petId, itemKey, doneAt, notes },
      });
      imported += 1;
    }

    if (imported > 0) {
      const { syncPreventionRemindersForPet } = await import("@/lib/vet/preventionReminders");
      await syncPreventionRemindersForPet(petId);
    }

    return { ok: true, imported };
  } catch {
    return { ok: false, error: "Nie udało się zapisać odrobaczenia ze skanu." };
  }
}

export async function importPetEctoparasitesFromScanAction(
  formData: FormData
): Promise<{ ok: true; imported: number } | { ok: false; error: string }> {
  const vetClinicId = await requireVetClinicId();
  if (!vetClinicId) return { ok: false, error: "Brak uprawnień." };

  const petId = formData.get("petId")?.toString()?.trim();
  const raw = formData.get("ectoparasitesJson")?.toString()?.trim();
  if (!petId || !raw) return { ok: false, error: "Brak danych ektopasożytów." };

  let rows: ExtractedPetEctoparasite[];
  try {
    rows = JSON.parse(raw) as ExtractedPetEctoparasite[];
    if (!Array.isArray(rows)) throw new Error("invalid");
  } catch {
    return { ok: false, error: "Nieprawidłowy format ektopasożytów." };
  }

  try {
    const prisma = getPrisma();
    const pet = await prisma.pet.findFirst({
      where: { id: petId, owner: { vetClinicId } },
    });
    if (!pet) return { ok: false, error: "Nie znaleziono zwierzęcia." };

    const itemKey = resolveEctoparasiteItemKey(pet.species);
    if (!itemKey) return { ok: false, error: "Brak planu ektopasożytów dla tego gatunku." };

    let imported = 0;
    for (const row of rows) {
      if (!row.productName?.trim()) continue;
      const doneAt = row.administeredAt
        ? new Date(`${row.administeredAt}T12:00:00`)
        : new Date();
      if (Number.isNaN(doneAt.getTime())) continue;

      const notes = [
        `Preparat: ${row.productName.trim()}`,
        row.vetName?.trim() ? `Lekarz: ${row.vetName.trim()}` : null,
        "Import ze skanu książeczki (strona ektopasożytów)",
      ]
        .filter(Boolean)
        .join(" · ");

      await prisma.petPreventionRecord.create({
        data: { petId, itemKey, doneAt, notes },
      });
      imported += 1;
    }

    if (imported > 0) {
      const { syncPreventionRemindersForPet } = await import("@/lib/vet/preventionReminders");
      await syncPreventionRemindersForPet(petId);
    }

    return { ok: true, imported };
  } catch {
    return { ok: false, error: "Nie udało się zapisać ektopasożytów ze skanu." };
  }
}

export async function addVetPetAction(formData: FormData): Promise<VetAnimalActionResult> {
  const vetClinicId = await requireVetClinicId();
  if (!vetClinicId) return { ok: false, error: "Brak uprawnień." };

  const ownerId = formData.get("ownerId")?.toString()?.trim();
  const fields = parsePetFormFields(formData);
  const { name, species, breed, sex, coatColor, birthDate, chipNumber, chipDate, chipManufacturer, safeAnimalStatus, notes, herdId, status, pedigreeNotes, pedigreeLines, catLifestyle } = fields;

  if (!ownerId || !name) return { ok: false, error: "Właściciel i imię zwierzęcia są wymagane." };
  if (!VALID_STATUSES.has(status as "active")) {
    return { ok: false, error: "Nieprawidłowy status zwierzęcia." };
  }

  try {
    const prisma = getPrisma();
    const owner = await prisma.petOwner.findFirst({ where: { id: ownerId, vetClinicId } });
    if (!owner) return { ok: false, error: "Nie znaleziono właściciela." };

    if (herdId) {
      const herd = await prisma.vetHerd.findFirst({ where: { id: herdId, vetClinicId } });
      if (!herd) return { ok: false, error: "Nie znaleziono stada." };
    }

    const pet = await prisma.pet.create({
      data: {
        ownerId,
        herdId,
        accountId: owner.accountId,
        name,
        species,
        breed,
        sex,
        coatColor,
        birthDate,
        chipNumber,
        chipDate,
        chipManufacturer,
        safeAnimalStatus,
        notes,
        status,
        pedigreeNotes,
        catLifestyle: species === "kot" ? catLifestyle : null,
        pedigreeJson: buildPedigreeJson(
          pedigreeLines ? pedigreeLines.split("\n").map((l) => l.trim()).filter(Boolean) : [],
          pedigreeNotes
        ),
      },
    });
    return { ok: true, id: pet.id };
  } catch {
    return { ok: false, error: "Nie udało się dodać zwierzęcia." };
  }
}

export async function updateVetPetAction(formData: FormData): Promise<VetAnimalActionResult> {
  const vetClinicId = await requireVetClinicId();
  if (!vetClinicId) return { ok: false, error: "Brak uprawnień." };

  const id = formData.get("id")?.toString()?.trim();
  const fields = parsePetFormFields(formData);
  const { name, species, breed, sex, coatColor, birthDate, chipNumber, chipDate, chipManufacturer, safeAnimalStatus, notes, herdId, status, pedigreeNotes, pedigreeLines, catLifestyle } = fields;

  if (!id || !name) return { ok: false, error: "Brak wymaganych danych." };
  if (!VALID_STATUSES.has(status as "active")) {
    return { ok: false, error: "Nieprawidłowy status zwierzęcia." };
  }

  try {
    const prisma = getPrisma();
    const existing = await prisma.pet.findFirst({
      where: { id, owner: { vetClinicId } },
    });
    if (!existing) return { ok: false, error: "Nie znaleziono zwierzęcia." };

    if (herdId) {
      const herd = await prisma.vetHerd.findFirst({ where: { id: herdId, vetClinicId } });
      if (!herd) return { ok: false, error: "Nie znaleziono stada." };
    }

    await prisma.pet.update({
      where: { id },
      data: {
        name,
        species,
        breed,
        sex,
        coatColor,
        birthDate,
        chipNumber,
        chipDate,
        chipManufacturer,
        safeAnimalStatus,
        notes,
        herdId,
        status,
        pedigreeNotes,
        catLifestyle: species === "kot" ? catLifestyle : null,
        pedigreeJson: buildPedigreeJson(
          pedigreeLines ? pedigreeLines.split("\n").map((l) => l.trim()).filter(Boolean) : [],
          pedigreeNotes
        ),
      },
    });

    const { syncPreventionRemindersForPet } = await import("@/lib/vet/preventionReminders");
    await syncPreventionRemindersForPet(id);

    return { ok: true, id };
  } catch {
    return { ok: false, error: "Nie udało się zaktualizować zwierzęcia." };
  }
}

export async function importVetPetsFromCsvAction(formData: FormData): Promise<VetPetImportResult> {
  const vetClinicId = await requireVetClinicId();
  if (!vetClinicId) return { ok: false, error: "Brak uprawnień." };

  const csv = formData.get("csv")?.toString()?.trim();
  if (!csv) return { ok: false, error: "Wklej lub wczytaj plik CSV." };

  const { rows, errors: parseErrors } = parsePetImportCsv(csv);
  if (rows.length === 0) {
    return { ok: false, error: parseErrors[0] ?? "Brak poprawnych wierszy do importu." };
  }

  try {
    const prisma = getPrisma();
    const [owners, herds] = await Promise.all([
      prisma.petOwner.findMany({ where: { vetClinicId } }),
      prisma.vetHerd.findMany({ where: { vetClinicId } }),
    ]);

    const ownerByPhone = new Map(
      owners.map((o) => [normalizePhone(o.phone), o])
    );
    const herdByName = new Map(herds.map((h) => [h.name.toLowerCase(), h]));

    let imported = 0;
    let skipped = 0;
    const errors = [...parseErrors];

    for (const row of rows) {
      const owner = ownerByPhone.get(row.ownerPhone);
      if (!owner) {
        skipped++;
        errors.push(`Wiersz ${row.line} (${row.name}): nie znaleziono właściciela o telefonie ${row.ownerPhone}.`);
        continue;
      }

      let herdId: string | null = null;
      if (row.herdName) {
        const herd = herdByName.get(row.herdName.toLowerCase());
        if (!herd) {
          skipped++;
          errors.push(`Wiersz ${row.line} (${row.name}): nie znaleziono stada „${row.herdName}".`);
          continue;
        }
        herdId = herd.id;
      }

      const status = VALID_STATUSES.has(row.status as "active") ? row.status : "active";

      await prisma.pet.create({
        data: {
          ownerId: owner.id,
          herdId,
          name: row.name,
          species: normalizeSpeciesValue(row.species),
          breed: row.breed,
          sex: normalizePetSex(row.sex),
          coatColor: row.coatColor,
          birthDate: row.birthDate,
          chipNumber: row.chipNumber,
          chipDate: row.chipDate,
          chipManufacturer: row.chipManufacturer,
          notes: row.notes,
          status,
        },
      });
      imported++;
    }

    if (imported === 0) {
      return { ok: false, error: errors[0] ?? "Nie udało się zaimportować żadnego zwierzęcia." };
    }

    return { ok: true, imported, skipped, errors };
  } catch {
    return { ok: false, error: "Nie udało się wykonać importu." };
  }
}

export async function addVetHerdAction(formData: FormData): Promise<VetAnimalActionResult> {
  const vetClinicId = await requireVetClinicId();
  if (!vetClinicId) return { ok: false, error: "Brak uprawnień." };

  const name = formData.get("name")?.toString()?.trim();
  const species = normalizeSpeciesValue(formData.get("species")?.toString()?.trim() || "owca");
  const ownerId = formData.get("ownerId")?.toString()?.trim() || null;
  const location = formData.get("location")?.toString()?.trim() || null;
  const headCountRaw = formData.get("headCount")?.toString()?.trim();
  const notes = formData.get("notes")?.toString()?.trim() || null;

  if (!name) return { ok: false, error: "Nazwa stada jest wymagana." };

  let headCount: number | null = null;
  if (headCountRaw) {
    headCount = parseInt(headCountRaw, 10);
    if (Number.isNaN(headCount) || headCount < 1) {
      return { ok: false, error: "Podaj poprawną liczbę sztuk w stadzie." };
    }
  }

  try {
    const prisma = getPrisma();
    if (ownerId) {
      const owner = await prisma.petOwner.findFirst({ where: { id: ownerId, vetClinicId } });
      if (!owner) return { ok: false, error: "Nie znaleziono właściciela." };
    }

    const herd = await prisma.vetHerd.create({
      data: { vetClinicId, ownerId, name, species, location, headCount, notes },
    });
    return { ok: true, id: herd.id };
  } catch {
    return { ok: false, error: "Nie udało się dodać stada." };
  }
}

export async function updateVetHerdAction(formData: FormData): Promise<VetAnimalActionResult> {
  const vetClinicId = await requireVetClinicId();
  if (!vetClinicId) return { ok: false, error: "Brak uprawnień." };

  const id = formData.get("id")?.toString()?.trim();
  const name = formData.get("name")?.toString()?.trim();
  const species = normalizeSpeciesValue(formData.get("species")?.toString()?.trim() || "owca");
  const ownerId = formData.get("ownerId")?.toString()?.trim() || null;
  const location = formData.get("location")?.toString()?.trim() || null;
  const headCountRaw = formData.get("headCount")?.toString()?.trim();
  const notes = formData.get("notes")?.toString()?.trim() || null;

  if (!id || !name) return { ok: false, error: "Brak wymaganych danych." };

  let headCount: number | null = null;
  if (headCountRaw) {
    headCount = parseInt(headCountRaw, 10);
    if (Number.isNaN(headCount) || headCount < 1) {
      return { ok: false, error: "Podaj poprawną liczbę sztuk w stadzie." };
    }
  }

  try {
    const prisma = getPrisma();
    const existing = await prisma.vetHerd.findFirst({ where: { id, vetClinicId } });
    if (!existing) return { ok: false, error: "Nie znaleziono stada." };

    if (ownerId) {
      const owner = await prisma.petOwner.findFirst({ where: { id: ownerId, vetClinicId } });
      if (!owner) return { ok: false, error: "Nie znaleziono właściciela." };
    }

    await prisma.vetHerd.update({
      where: { id },
      data: { name, species, ownerId, location, headCount, notes },
    });
    return { ok: true, id };
  } catch {
    return { ok: false, error: "Nie udało się zaktualizować stada." };
  }
}
