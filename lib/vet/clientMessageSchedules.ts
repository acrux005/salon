import { getPrisma } from "@/lib/db";
import { sendVetOwnerReminderEmail } from "@/lib/email";
import { sendVetSms } from "@/lib/vet/vetNotify";

const MS_DAY = 24 * 60 * 60 * 1000;

type ScheduleRow = {
  id: string;
  vetClinicId: string;
  name: string;
  channel: string;
  body: string;
  scheduleKind: string;
  intervalDays: number | null;
  runAt: Date | null;
  lastRunAt: Date | null;
  createdAt: Date;
  vetClinic: { name: string; phone: string | null };
};

type OwnerRow = {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  smsConsent: boolean;
  emailConsent: boolean;
};

export function isClientMessageScheduleDue(schedule: ScheduleRow, now = new Date()): boolean {
  if (schedule.scheduleKind === "once") {
    if (schedule.lastRunAt) return false;
    if (!schedule.runAt) return false;
    return schedule.runAt.getTime() <= now.getTime();
  }

  const intervalDays = schedule.intervalDays ?? 30;
  if (intervalDays < 1) return false;
  const anchor = schedule.lastRunAt ?? schedule.createdAt;
  return now.getTime() - anchor.getTime() >= intervalDays * MS_DAY;
}

export function personalizeClientMessageBody(body: string, ownerName: string): string {
  const firstName = ownerName.trim().split(/\s+/)[0] ?? ownerName;
  return body.replace(/\{imie\}/gi, firstName).replace(/\{nazwa\}/gi, ownerName.trim());
}

async function dispatchScheduledMessage(
  owner: OwnerRow,
  schedule: ScheduleRow
): Promise<boolean> {
  const message = personalizeClientMessageBody(schedule.body, owner.name);
  const clinicName = schedule.vetClinic.name;
  const clinicPhone = schedule.vetClinic.phone;

  if (schedule.channel === "email") {
    if (!owner.emailConsent || !owner.email?.trim()) return true;
    return sendVetOwnerReminderEmail(owner.email, {
      clinicName,
      clinicPhone,
      ownerName: owner.name,
      petName: "pacjent",
      subject: schedule.name,
      message,
    });
  }

  if (!owner.smsConsent || !owner.phone?.trim()) return true;
  return sendVetSms(owner.phone, message);
}

/** Uruchamia harmonogramy wiadomości cyklicznych / jednorazowych. */
export async function runDueClientMessageSchedules(limit = 10): Promise<{
  processed: number;
  ownersNotified: number;
  failed: number;
}> {
  const prisma = getPrisma();
  const now = new Date();

  const schedules = await prisma.vetClientMessageSchedule.findMany({
    where: { active: true },
    include: { vetClinic: { select: { name: true, phone: true } } },
    orderBy: { lastRunAt: "asc" },
    take: 50,
  });

  let processed = 0;
  let ownersNotified = 0;
  let failed = 0;

  for (const schedule of schedules) {
    if (processed >= limit) break;
    if (!isClientMessageScheduleDue(schedule, now)) continue;

    processed++;

    const owners = await prisma.petOwner.findMany({
      where: { vetClinicId: schedule.vetClinicId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        smsConsent: true,
        emailConsent: true,
      },
    });

    for (const owner of owners) {
      const ok = await dispatchScheduledMessage(owner, schedule);
      if (!ok) {
        failed++;
        continue;
      }

      const hasChannel =
        schedule.channel === "email"
          ? owner.emailConsent && !!owner.email?.trim()
          : owner.smsConsent && !!owner.phone?.trim();

      if (hasChannel) {
        ownersNotified++;
        await prisma.vetClientMessage.create({
          data: {
            vetClinicId: schedule.vetClinicId,
            ownerId: owner.id,
            channel: schedule.channel,
            subject: schedule.channel === "email" ? schedule.name : null,
            body: personalizeClientMessageBody(schedule.body, owner.name),
            status: "sent",
            sentAt: new Date(),
          },
        });
      }
    }

    await prisma.vetClientMessageSchedule.update({
      where: { id: schedule.id },
      data: {
        lastRunAt: new Date(),
        active: schedule.scheduleKind !== "once",
      },
    });
  }

  return { processed, ownersNotified, failed };
}
