import { getPrisma } from "@/lib/db";
import { buildPreventionChecklist } from "@/lib/vet/preventionEngine";
import { hasPreventionPlan } from "@/lib/vet/preventionPlans";
import { getWetSiteUrl } from "@/lib/wetHost";

const REMINDER_OFFSETS_DAYS = [14, 7, 0] as const;

function formatPlDate(iso: string): string {
  const d = new Date(iso.includes("T") ? iso : `${iso}T12:00:00`);
  return d.toLocaleDateString("pl-PL");
}

function buildPreventionMessage(input: {
  clinicName: string;
  petName: string;
  itemTitle: string;
  dueAt: string;
  daysBefore: number;
  status: string;
}): string {
  const due = formatPlDate(input.dueAt);
  if (input.daysBefore === 0 && input.status !== "overdue") {
    return `Dziś termin: ${input.itemTitle} dla ${input.petName} (${input.clinicName}). Termin: ${due}. Umów wizytę.`;
  }
  if (input.status === "overdue") {
    return `Zaległy termin: ${input.itemTitle} dla ${input.petName} (${input.clinicName}). Planowany termin: ${due}. Prosimy o kontakt z gabinetem.`;
  }
  const unit = input.daysBefore === 1 ? "dzień" : "dni";
  return `Za ${input.daysBefore} ${unit}: ${input.itemTitle} dla ${input.petName} (${input.clinicName}). Termin: ${due}. Umów wizytę w gabinecie.`;
}

export async function syncPreventionRemindersForPet(petId: string): Promise<number> {
  const prisma = getPrisma();
  const pet = await prisma.pet.findUnique({
    where: { id: petId },
    include: {
      owner: true,
      vaccinations: { include: { vaccineType: true }, orderBy: { administeredAt: "asc" } },
      preventionRecords: { orderBy: { doneAt: "asc" } },
    },
  });

  if (!pet || pet.preventionPlanDisabled || pet.status !== "active") return 0;
  if (!hasPreventionPlan(pet.species)) return 0;

  const clinic = await prisma.vetClinic.findUnique({
    where: { id: pet.owner.vetClinicId },
    select: { name: true },
  });
  if (!clinic) return 0;

  const checklist = buildPreventionChecklist({
    species: pet.species,
    birthDate: pet.birthDate,
    catLifestyle: pet.catLifestyle,
    planDisabled: false,
    vaccinations: pet.vaccinations.map((v) => ({
      vaccineName: v.vaccineType.name,
      administeredAt: v.administeredAt.toISOString(),
    })),
    records: pet.preventionRecords.map((r) => ({
      itemKey: r.itemKey,
      doneAt: r.doneAt.toISOString(),
    })),
  });

  await prisma.vetScheduledReminder.deleteMany({
    where: { petId, kind: "prevention", sentAt: null },
  });

  let created = 0;
  const now = Date.now();

  for (const item of checklist.items) {
    if (item.status === "done" || item.status === "skipped" || item.status === "na") continue;
    if (!item.dueAt) continue;

    const offsets = item.status === "overdue" ? ([0] as const) : REMINDER_OFFSETS_DAYS;

    for (const daysBefore of offsets) {
      const dueDate = new Date(item.dueAt.includes("T") ? item.dueAt : `${item.dueAt}T09:00:00`);
      const sendAt = new Date(dueDate);
      if (item.status !== "overdue") {
        sendAt.setDate(sendAt.getDate() - daysBefore);
      }
      if (sendAt.getTime() <= now) continue;

      const message = buildPreventionMessage({
        clinicName: clinic.name,
        petName: pet.name,
        itemTitle: item.title,
        dueAt: item.dueAt,
        daysBefore: item.status === "overdue" ? 0 : daysBefore,
        status: item.status,
      });

      const itemKey = `${item.key}:${item.status === "overdue" ? "overdue" : daysBefore}`;

      if (pet.owner.emailConsent && pet.owner.email?.trim()) {
        await prisma.vetScheduledReminder.create({
          data: {
            vetClinicId: pet.owner.vetClinicId,
            ownerId: pet.ownerId,
            petId,
            kind: "prevention",
            channel: "email",
            itemKey,
            sendAt,
            message,
          },
        });
        created += 1;
      }

      if (pet.owner.smsConsent && pet.owner.phone?.trim()) {
        await prisma.vetScheduledReminder.create({
          data: {
            vetClinicId: pet.owner.vetClinicId,
            ownerId: pet.ownerId,
            petId,
            kind: "prevention",
            channel: "sms",
            itemKey,
            sendAt,
            message,
          },
        });
        created += 1;
      }
    }
  }

  return created;
}

/** Synchronizacja przypomnień profilaktyki dla aktywnych zwierząt z planem (partia). */
export async function syncPreventionRemindersBatch(limit = 40): Promise<{ pets: number; reminders: number }> {
  const prisma = getPrisma();
  const pets = await prisma.pet.findMany({
    where: {
      status: "active",
      preventionPlanDisabled: false,
    },
    select: { id: true, species: true },
    orderBy: { updatedAt: "desc" },
    take: limit * 3,
  });

  let reminders = 0;
  let processed = 0;
  for (const p of pets) {
    if (!hasPreventionPlan(p.species)) continue;
    reminders += await syncPreventionRemindersForPet(p.id);
    processed += 1;
    if (processed >= limit) break;
  }
  return { pets: processed, reminders };
}

export function vetOwnerPanelPetUrl(petId: string): string {
  return `${getWetSiteUrl()}/wet/klient/panel/zwierzeta/${petId}`;
}
