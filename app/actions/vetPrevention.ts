"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { VET_CLINIC_ROLE } from "@/lib/auth";
import { getPrisma } from "@/lib/db";
import { buildPreventionChecklist } from "@/lib/vet/preventionEngine";
import type { PreventionChecklistSummary } from "@/lib/vet/preventionEngine";
import { syncPreventionRemindersForPet } from "@/lib/vet/preventionReminders";
import {
  dewormItemTitle,
  getDewormIntervalDays,
  resolveDewormItemKey,
} from "@/lib/vet/deworming";
import {
  ectoparasiteItemTitle,
  getEctoparasiteIntervalDays,
  resolveEctoparasiteItemKey,
} from "@/lib/vet/ectoparasites";

export type VetPreventionActionResult = { ok: true } | { ok: false; error: string };

export type RecordDewormingResult =
  | {
      ok: true;
      title: string;
      nextDueAt: string;
      itemKey: string;
    }
  | { ok: false; error: string };

export type RecordEctoparasiteResult = RecordDewormingResult;

async function requireVetClinicId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== VET_CLINIC_ROLE) return null;
  return (session?.user as { vetClinicId?: string })?.vetClinicId ?? null;
}

const SKIP_SENTINEL = new Date("1970-01-01T00:00:00.000Z");

export async function getPetPreventionChecklistAction(
  petId: string
): Promise<{ ok: true; checklist: PreventionChecklistSummary } | { ok: false; error: string }> {
  const vetClinicId = await requireVetClinicId();
  if (!vetClinicId) return { ok: false, error: "Brak uprawnień." };

  try {
    const prisma = getPrisma();
    const pet = await prisma.pet.findFirst({
      where: { id: petId, owner: { vetClinicId } },
      include: {
        vaccinations: { include: { vaccineType: true }, orderBy: { administeredAt: "asc" } },
        preventionRecords: { orderBy: { doneAt: "asc" } },
      },
    });
    if (!pet) return { ok: false, error: "Nie znaleziono zwierzęcia." };

    const checklist = buildPreventionChecklist({
      species: pet.species,
      birthDate: pet.birthDate,
      catLifestyle: pet.catLifestyle,
      planDisabled: pet.preventionPlanDisabled,
      vaccinations: pet.vaccinations.map((v) => ({
        vaccineName: v.vaccineType.name,
        administeredAt: v.administeredAt.toISOString(),
      })),
      records: pet.preventionRecords.map((r) => ({
        itemKey: r.itemKey,
        doneAt: r.doneAt.toISOString(),
      })),
    });

    return { ok: true, checklist };
  } catch {
    return { ok: false, error: "Nie udało się wczytać planu profilaktyki." };
  }
}

export async function markPreventionItemDoneAction(formData: FormData): Promise<VetPreventionActionResult> {
  const vetClinicId = await requireVetClinicId();
  if (!vetClinicId) return { ok: false, error: "Brak uprawnień." };

  const petId = formData.get("petId")?.toString()?.trim();
  const itemKey = formData.get("itemKey")?.toString()?.trim();
  const dateStr = formData.get("doneAt")?.toString()?.trim();
  const notes = formData.get("notes")?.toString()?.trim() || null;

  if (!petId || !itemKey) return { ok: false, error: "Brak danych pozycji." };

  const doneAt = dateStr ? new Date(`${dateStr}T12:00:00`) : new Date();
  if (Number.isNaN(doneAt.getTime())) return { ok: false, error: "Nieprawidłowa data." };

  try {
    const prisma = getPrisma();
    const pet = await prisma.pet.findFirst({ where: { id: petId, owner: { vetClinicId } } });
    if (!pet) return { ok: false, error: "Nie znaleziono zwierzęcia." };

    await prisma.petPreventionRecord.create({
      data: { petId, itemKey, doneAt, notes },
    });

    await syncPreventionRemindersForPet(petId);
    return { ok: true };
  } catch {
    return { ok: false, error: "Nie udało się zapisać." };
  }
}

export async function recordDewormingAction(formData: FormData): Promise<RecordDewormingResult> {
  const vetClinicId = await requireVetClinicId();
  if (!vetClinicId) return { ok: false, error: "Brak uprawnień." };

  const petId = formData.get("petId")?.toString()?.trim();
  const dateStr = formData.get("doneAt")?.toString()?.trim();
  const productName = formData.get("productName")?.toString()?.trim() || null;
  if (!petId) return { ok: false, error: "Wybierz zwierzę." };

  const doneAt = dateStr ? new Date(`${dateStr}T12:00:00`) : new Date();
  if (Number.isNaN(doneAt.getTime())) return { ok: false, error: "Nieprawidłowa data." };

  try {
    const prisma = getPrisma();
    const pet = await prisma.pet.findFirst({
      where: { id: petId, owner: { vetClinicId } },
    });
    if (!pet) return { ok: false, error: "Nie znaleziono zwierzęcia." };

    const itemKey = resolveDewormItemKey(pet.species, pet.birthDate);
    if (!itemKey) return { ok: false, error: "Brak planu odrobaczania dla tego gatunku." };

    const notes = productName ? `Preparat: ${productName}` : null;
    await prisma.petPreventionRecord.create({
      data: { petId, itemKey, doneAt, notes },
    });

    await syncPreventionRemindersForPet(petId);

    const intervalDays = getDewormIntervalDays(pet.species, pet.birthDate);
    const nextDueAt = new Date(doneAt);
    nextDueAt.setDate(nextDueAt.getDate() + intervalDays);

    return {
      ok: true,
      title: dewormItemTitle(pet.species, pet.birthDate),
      nextDueAt: nextDueAt.toISOString(),
      itemKey,
    };
  } catch {
    return { ok: false, error: "Nie udało się zapisać odrobaczania." };
  }
}

export async function recordEctoparasiteAction(formData: FormData): Promise<RecordEctoparasiteResult> {
  const vetClinicId = await requireVetClinicId();
  if (!vetClinicId) return { ok: false, error: "Brak uprawnień." };

  const petId = formData.get("petId")?.toString()?.trim();
  const dateStr = formData.get("doneAt")?.toString()?.trim();
  const productName = formData.get("productName")?.toString()?.trim() || null;
  if (!petId) return { ok: false, error: "Wybierz zwierzę." };

  const doneAt = dateStr ? new Date(`${dateStr}T12:00:00`) : new Date();
  if (Number.isNaN(doneAt.getTime())) return { ok: false, error: "Nieprawidłowa data." };

  try {
    const prisma = getPrisma();
    const pet = await prisma.pet.findFirst({
      where: { id: petId, owner: { vetClinicId } },
    });
    if (!pet) return { ok: false, error: "Nie znaleziono zwierzęcia." };

    const itemKey = resolveEctoparasiteItemKey(pet.species);
    if (!itemKey) return { ok: false, error: "Brak planu ektopasożytów dla tego gatunku." };

    const notes = productName ? `Preparat: ${productName}` : null;
    await prisma.petPreventionRecord.create({
      data: { petId, itemKey, doneAt, notes },
    });

    await syncPreventionRemindersForPet(petId);

    const intervalDays = getEctoparasiteIntervalDays(pet.species);
    const nextDueAt = new Date(doneAt);
    nextDueAt.setDate(nextDueAt.getDate() + intervalDays);

    return {
      ok: true,
      title: ectoparasiteItemTitle(pet.species),
      nextDueAt: nextDueAt.toISOString(),
      itemKey,
    };
  } catch {
    return { ok: false, error: "Nie udało się zapisać profilaktyki ektopasożytów." };
  }
}

export async function skipPreventionItemAction(formData: FormData): Promise<VetPreventionActionResult> {
  const vetClinicId = await requireVetClinicId();
  if (!vetClinicId) return { ok: false, error: "Brak uprawnień." };

  const petId = formData.get("petId")?.toString()?.trim();
  const itemKey = formData.get("itemKey")?.toString()?.trim();
  if (!petId || !itemKey) return { ok: false, error: "Brak danych pozycji." };

  try {
    const prisma = getPrisma();
    const pet = await prisma.pet.findFirst({ where: { id: petId, owner: { vetClinicId } } });
    if (!pet) return { ok: false, error: "Nie znaleziono zwierzęcia." };

    await prisma.petPreventionRecord.create({
      data: { petId, itemKey, doneAt: SKIP_SENTINEL, notes: "Pominięte w planie profilaktyki" },
    });

    await syncPreventionRemindersForPet(petId);
    return { ok: true };
  } catch {
    return { ok: false, error: "Nie udało się zapisać." };
  }
}

export async function togglePetPreventionPlanAction(
  petId: string,
  disabled: boolean
): Promise<VetPreventionActionResult> {
  const vetClinicId = await requireVetClinicId();
  if (!vetClinicId) return { ok: false, error: "Brak uprawnień." };

  try {
    const prisma = getPrisma();
    const pet = await prisma.pet.findFirst({ where: { id: petId, owner: { vetClinicId } } });
    if (!pet) return { ok: false, error: "Nie znaleziono zwierzęcia." };

    await prisma.pet.update({
      where: { id: petId },
      data: { preventionPlanDisabled: disabled },
    });

    if (disabled) {
      await prisma.vetScheduledReminder.deleteMany({
        where: { petId, kind: "prevention", sentAt: null },
      });
    } else {
      await syncPreventionRemindersForPet(petId);
    }

    return { ok: true };
  } catch {
    return { ok: false, error: "Nie udało się zaktualizować planu." };
  }
}
