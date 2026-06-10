import "server-only";
import { getPrisma } from "@/lib/db";

export type GabNotifyLogEntry = {
  id: string;
  at: string;
  channel: string;
  kind: string;
  status: string;
  summary: string;
};

export async function getGabNotifyDeliveryLog(gabClinicId: string, limit = 40): Promise<GabNotifyLogEntry[]> {
  const db = getPrisma();
  const [reminders, messages, appointmentReminders] = await Promise.all([
    db.gabScheduledReminder.findMany({
      where: { gabClinicId },
      orderBy: [{ sentAt: "desc" }, { sendAt: "desc" }],
      take: limit,
    }),
    db.gabClientMessage.findMany({
      where: { gabClinicId },
      orderBy: { sentAt: "desc" },
      take: limit,
      include: { client: { select: { name: true } } },
    }),
    db.gabAppointment.findMany({
      where: { gabClinicId, reminderSentAt: { not: null } },
      orderBy: { reminderSentAt: "desc" },
      take: limit,
      select: {
        id: true,
        reminderSentAt: true,
        date: true,
        time: true,
        patientName: true,
        patientPhone: true,
      },
    }),
  ]);

  const entries: GabNotifyLogEntry[] = [];

  for (const r of reminders) {
    entries.push({
      id: `rem-${r.id}`,
      at: (r.sentAt ?? r.sendAt).toISOString(),
      channel: r.channel,
      kind: r.kind,
      status: r.sentAt ? "sent" : "queued",
      summary: r.message.slice(0, 120),
    });
  }

  for (const m of messages) {
    const isTest = /^test/i.test(m.subject ?? "");
    entries.push({
      id: `msg-${m.id}`,
      at: m.sentAt.toISOString(),
      channel: m.channel,
      kind: isTest ? "test" : "crm",
      status: m.status,
      summary: m.client?.name
        ? `${m.client.name}: ${m.body.slice(0, 80)}`
        : m.subject
          ? `${m.subject}: ${m.body.slice(0, 80)}`
          : m.body.slice(0, 100),
    });
  }

  for (const a of appointmentReminders) {
    if (!a.reminderSentAt) continue;
    entries.push({
      id: `appt-${a.id}`,
      at: a.reminderSentAt.toISOString(),
      channel: "sms",
      kind: "wizyta",
      status: "sent",
      summary: `Przypomnienie dzień przed: ${a.date} ${a.time} — ${a.patientName ?? "pacjent"}${a.patientPhone ? ` (${a.patientPhone})` : ""}`,
    });
  }

  entries.sort((a, b) => b.at.localeCompare(a.at));
  return entries.slice(0, limit);
}
