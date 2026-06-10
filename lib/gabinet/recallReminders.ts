import { getPrisma } from "@/lib/db";
import { gabPatientPanelUrl as buildGabPatientPanelUrl } from "@/lib/gabinet/portalUrl";
import { visitTypeLabel } from "@/lib/gabinet/visitTypes";

const MS_DAY = 24 * 60 * 60 * 1000;

function renderRecallMessage(template: string, ctx: { patientName: string; clinicName: string; visitType: string }) {
  return template
    .replace(/\{pacjent\}/gi, ctx.patientName)
    .replace(/\{gabinet\}/gi, ctx.clinicName)
    .replace(/\{wizyta\}/gi, visitTypeLabel(ctx.visitType));
}

/** Po zakończonej wizycie — zaplanuj recall wg reguł gabinetu. */
export async function scheduleRecallAfterCompletedVisit(
  gabClinicId: string,
  patientId: string | null,
  clientId: string | null,
  visitType: string | null,
  completedDate: string
): Promise<number> {
  if (!patientId && !clientId) return 0;
  const prisma = getPrisma();
  const rules = await prisma.gabRecallRule.findMany({
    where: { gabClinicId, active: true, ...(visitType ? { visitType } : {}) },
  });
  if (rules.length === 0) return 0;

  const clinic = await prisma.gabClinic.findUnique({
    where: { id: gabClinicId },
    select: { name: true },
  });
  if (!clinic) return 0;

  let patientName = "Pacjent";
  if (patientId) {
    const p = await prisma.gabPatient.findUnique({ where: { id: patientId }, select: { name: true } });
    if (p) patientName = p.name;
  } else if (clientId) {
    const c = await prisma.gabClient.findUnique({ where: { id: clientId }, select: { name: true } });
    if (c) patientName = c.name;
  }

  const base = new Date(`${completedDate}T12:00:00`);
  let created = 0;

  for (const rule of rules) {
    const sendAt = new Date(base.getTime() + rule.intervalDays * MS_DAY);
    const existing = await prisma.gabScheduledReminder.findFirst({
      where: {
        gabClinicId,
        patientId: patientId ?? undefined,
        clientId: clientId ?? undefined,
        kind: "recall",
        sentAt: null,
        message: { contains: rule.name },
      },
    });
    if (existing) continue;

    const message =
      rule.messageTemplate.trim() ||
      `${rule.name}: zapraszamy na ${visitTypeLabel(rule.visitType)} — ${clinic.name}.`;

    await prisma.gabScheduledReminder.create({
      data: {
        gabClinicId,
        patientId,
        clientId,
        kind: "recall",
        channel: rule.channel,
        message: renderRecallMessage(message, {
          patientName,
          clinicName: clinic.name,
          visitType: rule.visitType,
        }),
        sendAt,
      },
    });
    created++;
  }

  return created;
}

/** Synchronizuje brakujące przypomnienia recall (batch). */
export async function syncGabRecallRemindersBatch(limit = 30): Promise<number> {
  const prisma = getPrisma();
  const completed = await prisma.gabAppointment.findMany({
    where: { status: "completed" },
    orderBy: { date: "desc" },
    take: limit,
    select: {
      gabClinicId: true,
      patientId: true,
      clientId: true,
      visitType: true,
      date: true,
    },
  });

  let synced = 0;
  for (const a of completed) {
    synced += await scheduleRecallAfterCompletedVisit(
      a.gabClinicId,
      a.patientId,
      a.clientId,
      a.visitType,
      a.date
    );
  }
  return synced;
}

export function gabPatientPanelUrl(verticalId?: string | null, host?: string | null): string {
  return buildGabPatientPanelUrl(verticalId, host);
}

async function resolveReminderRecipient(
  patientId: string | null,
  clientId: string | null
): Promise<{
  phone: string | null;
  email: string | null;
  smsConsent: boolean;
  emailConsent: boolean;
  name: string;
} | null> {
  const prisma = getPrisma();
  if (patientId) {
    const p = await prisma.gabPatient.findUnique({
      where: { id: patientId },
      select: { phone: true, email: true, smsConsent: true, emailConsent: true, name: true },
    });
    return p
      ? {
          phone: p.phone,
          email: p.email,
          smsConsent: p.smsConsent,
          emailConsent: p.emailConsent,
          name: p.name,
        }
      : null;
  }
  if (clientId) {
    const c = await prisma.gabClient.findUnique({
      where: { id: clientId },
      select: { phone: true, email: true, smsConsent: true, emailConsent: true, name: true },
    });
    return c
      ? {
          phone: c.phone,
          email: c.email,
          smsConsent: c.smsConsent,
          emailConsent: c.emailConsent,
          name: c.name,
        }
      : null;
  }
  return null;
}

/** Wysyła pojedyncze zaplanowane przypomnienie (recall / SMS). */
export async function dispatchGabScheduledReminder(
  reminderId: string,
  gabClinicId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const prisma = getPrisma();
  const row = await prisma.gabScheduledReminder.findFirst({
    where: { id: reminderId, gabClinicId },
    include: { gabClinic: { select: { name: true, phone: true } } },
  });
  if (!row) return { ok: false, error: "Nie znaleziono przypomnienia." };
  if (row.sentAt) return { ok: false, error: "Przypomnienie zostało już wysłane." };

  const { sendGabSms } = await import("@/lib/gabinet/gabNotify");
  const { sendGabPatientReminderEmail } = await import("@/lib/email");
  const recipient = await resolveReminderRecipient(row.patientId, row.clientId);

  let sent = false;
  if (row.channel === "email") {
    if (recipient?.emailConsent && recipient.email?.trim()) {
      sent = await sendGabPatientReminderEmail(recipient.email, {
        clinicName: row.gabClinic.name,
        clinicPhone: row.gabClinic.phone,
        patientName: recipient.name,
        subject: "Przypomnienie — " + row.gabClinic.name,
        message: row.message,
        panelUrl: gabPatientPanelUrl(),
      });
    } else {
      sent = true;
    }
  } else if (recipient?.smsConsent && recipient.phone?.trim()) {
    sent = await sendGabSms(recipient.phone, row.message);
  } else {
    sent = true;
  }

  if (!sent) return { ok: false, error: "Nie udało się wysłać (brak zgody lub błąd kanału)." };

  await prisma.gabScheduledReminder.update({
    where: { id: row.id },
    data: { sentAt: new Date() },
  });
  return { ok: true };
}

/** Wysyła wszystkie zaplanowane przypomnienia recall po terminie (cron / batch). */
export async function dispatchGabDueScheduledReminders(limit = 100): Promise<number> {
  const prisma = getPrisma();
  const due = await prisma.gabScheduledReminder.findMany({
    where: { sentAt: null, sendAt: { lte: new Date() } },
    take: limit,
    select: { id: true, gabClinicId: true },
  });

  let sent = 0;
  for (const row of due) {
    const res = await dispatchGabScheduledReminder(row.id, row.gabClinicId);
    if (res.ok) sent++;
  }
  return sent;
}

/** SMS dzień przed wizytą (cron). */
export async function dispatchGabAppointmentDayBeforeReminders(limit = 50): Promise<number> {
  const prisma = getPrisma();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().slice(0, 10);

  const appointments = await prisma.gabAppointment.findMany({
    where: {
      status: { in: ["planned", "confirmed"] },
      reminderSentAt: null,
      date: tomorrowStr,
    },
    take: limit,
    include: { gabClinic: { select: { name: true, phone: true } } },
  });

  const { sendGabSms } = await import("@/lib/gabinet/gabNotify");
  let sent = 0;

  for (const a of appointments) {
    const msg = `Przypomnienie: wizyta ${a.date} ${a.time} — ${a.patientName ?? "pacjent"} (${a.gabClinic.name}).`;
    let ok = false;

    if (a.patientPhone?.trim()) {
      ok = await sendGabSms(a.patientPhone, msg);
    } else if (a.patientId) {
      const p = await prisma.gabPatient.findUnique({
        where: { id: a.patientId },
        select: { phone: true, smsConsent: true },
      });
      if (p?.smsConsent && p.phone?.trim()) ok = await sendGabSms(p.phone, msg);
    }

    if (!a.patientPhone && !a.patientId) ok = true;

    if (ok) {
      await prisma.gabAppointment.update({
        where: { id: a.id },
        data: { reminderSentAt: new Date() },
      });
      sent++;
    }
  }

  return sent;
}
