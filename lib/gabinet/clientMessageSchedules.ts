import { getPrisma } from "@/lib/db";
import { sendGabSms } from "@/lib/gabinet/gabNotify";
import { sendGabPatientReminderEmail } from "@/lib/email";

const MS_DAY = 24 * 60 * 60 * 1000;

type ScheduleRow = {
  id: string;
  gabClinicId: string;
  name: string;
  channel: string;
  body: string;
  scheduleKind: string;
  intervalDays: number | null;
  runAt: Date | null;
  lastRunAt: Date | null;
  createdAt: Date;
  gabClinic: { name: string; phone: string | null };
};

type ClientRow = {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  smsConsent: boolean;
  emailConsent: boolean;
};

export function isGabClientMessageScheduleDue(schedule: ScheduleRow, now = new Date()): boolean {
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

export function personalizeGabClientMessageBody(body: string, clientName: string): string {
  const firstName = clientName.trim().split(/\s+/)[0] ?? clientName;
  return body.replace(/\{imie\}/gi, firstName).replace(/\{nazwa\}/gi, clientName.trim());
}

async function dispatchScheduledMessage(client: ClientRow, schedule: ScheduleRow): Promise<boolean> {
  const message = personalizeGabClientMessageBody(schedule.body, client.name);
  const clinicName = schedule.gabClinic.name;
  const clinicPhone = schedule.gabClinic.phone;
  if (schedule.channel === "email") {
    if (!client.emailConsent || !client.email?.trim()) return true;
    return sendGabPatientReminderEmail(client.email, {
      clinicName,
      clinicPhone,
      patientName: client.name,
      subject: schedule.name,
      message,
    });
  }

  if (!client.smsConsent || !client.phone?.trim()) return true;
  return sendGabSms(client.phone, message);
}

export async function runDueGabClientMessageSchedules(limit = 10): Promise<{
  processed: number;
  clientsNotified: number;
  failed: number;
}> {
  const prisma = getPrisma();
  const now = new Date();

  const schedules = await prisma.gabClientMessageSchedule.findMany({
    where: { active: true },
    include: { gabClinic: { select: { name: true, phone: true } } },
    orderBy: { lastRunAt: "asc" },
    take: 50,
  });

  let processed = 0;
  let clientsNotified = 0;
  let failed = 0;

  for (const schedule of schedules) {
    if (processed >= limit) break;
    if (!isGabClientMessageScheduleDue(schedule, now)) continue;

    processed++;

    const clients = await prisma.gabClient.findMany({
      where: { gabClinicId: schedule.gabClinicId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        smsConsent: true,
        emailConsent: true,
      },
    });

    for (const client of clients) {
      const ok = await dispatchScheduledMessage(client, schedule);
      if (!ok) {
        failed++;
        continue;
      }

      const hasChannel =
        schedule.channel === "email"
          ? client.emailConsent && !!client.email?.trim()
          : client.smsConsent && !!client.phone?.trim();

      if (hasChannel) {
        clientsNotified++;
        await prisma.gabClientMessage.create({
          data: {
            gabClinicId: schedule.gabClinicId,
            clientId: client.id,
            channel: schedule.channel,
            subject: schedule.channel === "email" ? schedule.name : null,
            body: personalizeGabClientMessageBody(schedule.body, client.name),
            status: "sent",
            sentAt: new Date(),
          },
        });
      }
    }

    await prisma.gabClientMessageSchedule.update({
      where: { id: schedule.id },
      data: {
        lastRunAt: new Date(),
        active: schedule.scheduleKind !== "once",
      },
    });
  }

  return { processed, clientsNotified, failed };
}
