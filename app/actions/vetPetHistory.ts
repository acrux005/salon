"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { VET_CLINIC_ROLE } from "@/lib/auth";
import { getPrisma } from "@/lib/db";
import { parsePetTimelineEventId } from "@/lib/vet/petHistoryDelete";
import { syncPreventionRemindersForPet } from "@/lib/vet/preventionReminders";

export type PetHistoryActionResult = { ok: true } | { ok: false; error: string };

async function requirePetAccess(petId: string): Promise<
  | { ok: true; vetClinicId: string }
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
  return { ok: true, vetClinicId };
}

export async function deletePetVaccinationAction(
  petId: string,
  vaccinationId: string
): Promise<PetHistoryActionResult> {
  const access = await requirePetAccess(petId);
  if (!access.ok) return access;

  try {
    const prisma = getPrisma();
    const row = await prisma.vaccination.findFirst({
      where: { id: vaccinationId, petId },
      select: { id: true, vaccineTypeId: true },
    });
    if (!row) return { ok: false, error: "Nie znaleziono szczepienia." };

    await prisma.vaccination.delete({ where: { id: vaccinationId } });
    await prisma.vetScheduledReminder.deleteMany({
      where: {
        petId,
        vetClinicId: access.vetClinicId,
        kind: "vaccination",
        itemKey: { startsWith: `vaccination:${row.vaccineTypeId}:` },
      },
    });
    await syncPreventionRemindersForPet(petId);
    return { ok: true };
  } catch {
    return { ok: false, error: "Nie udało się usunąć szczepienia." };
  }
}

export async function deletePetPreventionRecordAction(
  petId: string,
  recordId: string
): Promise<PetHistoryActionResult> {
  const access = await requirePetAccess(petId);
  if (!access.ok) return access;

  try {
    const prisma = getPrisma();
    const row = await prisma.petPreventionRecord.findFirst({
      where: { id: recordId, petId },
      select: { id: true, itemKey: true },
    });
    if (!row) return { ok: false, error: "Nie znaleziono wpisu profilaktyki." };

    await prisma.petPreventionRecord.delete({ where: { id: recordId } });
    await prisma.vetScheduledReminder.deleteMany({
      where: {
        petId,
        vetClinicId: access.vetClinicId,
        kind: "prevention",
        itemKey: row.itemKey,
        sentAt: null,
      },
    });
    await syncPreventionRemindersForPet(petId);
    return { ok: true };
  } catch {
    return { ok: false, error: "Nie udało się usunąć wpisu profilaktyki." };
  }
}

export async function deletePetAppointmentAction(
  petId: string,
  appointmentId: string
): Promise<PetHistoryActionResult> {
  const access = await requirePetAccess(petId);
  if (!access.ok) return access;

  try {
    const prisma = getPrisma();
    const row = await prisma.vetAppointment.findFirst({
      where: { id: appointmentId, petId, vetClinicId: access.vetClinicId },
      select: { id: true },
    });
    if (!row) return { ok: false, error: "Nie znaleziono wizyty." };

    await prisma.vetScheduledReminder.deleteMany({
      where: {
        petId,
        vetClinicId: access.vetClinicId,
        kind: "appointment",
        itemKey: `appointment:${appointmentId}`,
      },
    });
    await prisma.vetAppointment.delete({ where: { id: appointmentId } });
    return { ok: true };
  } catch {
    return { ok: false, error: "Nie udało się usunąć wizyty." };
  }
}

export async function deletePetReminderLogAction(
  petId: string,
  reminderId: string
): Promise<PetHistoryActionResult> {
  const access = await requirePetAccess(petId);
  if (!access.ok) return access;

  try {
    const prisma = getPrisma();
    const row = await prisma.vetScheduledReminder.findFirst({
      where: {
        id: reminderId,
        petId,
        vetClinicId: access.vetClinicId,
        sentAt: { not: null },
      },
      select: { id: true },
    });
    if (!row) return { ok: false, error: "Nie znaleziono wpisu przypomnienia." };

    await prisma.vetScheduledReminder.delete({ where: { id: reminderId } });
    return { ok: true };
  } catch {
    return { ok: false, error: "Nie udało się usunąć wpisu." };
  }
}

export async function deletePetHistoryEntryAction(
  petId: string,
  timelineEventId: string
): Promise<PetHistoryActionResult> {
  const parsed = parsePetTimelineEventId(timelineEventId);
  if (!parsed) return { ok: false, error: "Nieprawidłowy wpis historii." };

  switch (parsed.kind) {
    case "vaccination":
      return deletePetVaccinationAction(petId, parsed.entityId);
    case "visit":
      return deletePetAppointmentAction(petId, parsed.entityId);
    case "prevention":
      return deletePetPreventionRecordAction(petId, parsed.entityId);
    case "reminder":
      return deletePetReminderLogAction(petId, parsed.entityId);
    default:
      return { ok: false, error: "Nieobsługiwany typ wpisu." };
  }
}
