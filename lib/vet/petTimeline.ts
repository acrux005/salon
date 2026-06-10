import { visitTypeLabel } from "@/lib/vet/visitTypes";

export type PetTimelineEventType =
  | "vaccination"
  | "visit"
  | "prevention"
  | "reminder_sms"
  | "reminder_email";

export type PetTimelineEvent = {
  id: string;
  sortKey: string;
  dateLabel: string;
  timeLabel?: string;
  type: PetTimelineEventType;
  emoji: string;
  title: string;
  subtitle?: string;
  meta?: string;
};

function parseSortDate(date: string, time?: string): string {
  const t = time?.match(/^(\d{1,2}):(\d{2})/);
  const hh = t ? t[1].padStart(2, "0") : "12";
  const mm = t ? t[2] : "00";
  const iso = date.includes("T") ? date : `${date}T${hh}:${mm}:00`;
  return iso;
}

function formatDateLabel(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso.slice(0, 10);
  return d.toLocaleDateString("pl-PL", { day: "numeric", month: "long", year: "numeric" });
}

function visitTypeEmoji(type: string | null): string {
  if (!type) return "🩺";
  if (type.includes("szczep")) return "💉";
  if (type.includes("lecz")) return "💊";
  if (type.includes("odrob")) return "🪱";
  if (type.includes("kontrol")) return "📋";
  if (type.includes("piln")) return "🚨";
  return "🩺";
}

function visitStatusMeta(status: string): string | undefined {
  if (status === "done") return "Odbyta";
  if (status === "cancelled") return "Anulowana";
  if (status === "no_show") return "Nie stawił się";
  if (status === "planned") return "Zaplanowana";
  return undefined;
}

export function buildPetTimeline(input: {
  vaccinations: {
    id: string;
    vaccineName: string;
    administeredAt: string;
    vetName: string | null;
  }[];
  appointments: {
    id: string;
    date: string;
    time: string;
    visitType: string | null;
    status: string;
    doctorName: string | null;
    notes: string | null;
  }[];
  preventionRecords: {
    id: string;
    itemKey: string;
    doneAt: string;
    title: string;
  }[];
  reminders: {
    id: string;
    sentAt: string;
    channel: string;
    message: string;
  }[];
}): PetTimelineEvent[] {
  const events: PetTimelineEvent[] = [];

  for (const v of input.vaccinations) {
    const sortKey = parseSortDate(v.administeredAt);
    events.push({
      id: `vac-${v.id}`,
      sortKey,
      dateLabel: formatDateLabel(sortKey),
      type: "vaccination",
      emoji: "💉",
      title: v.vaccineName,
      subtitle: v.vetName ? `Lekarz: ${v.vetName}` : undefined,
      meta: "Szczepienie",
    });
  }

  for (const a of input.appointments) {
    const sortKey = parseSortDate(a.date, a.time);
    events.push({
      id: `appt-${a.id}`,
      sortKey,
      dateLabel: formatDateLabel(sortKey),
      timeLabel: a.time,
      type: "visit",
      emoji: visitTypeEmoji(a.visitType),
      title: a.notes?.split("\n")[0]?.trim() || visitTypeLabel(a.visitType),
      subtitle: a.doctorName ? `Lekarz: ${a.doctorName}` : undefined,
      meta: visitStatusMeta(a.status),
    });
  }

  for (const r of input.preventionRecords) {
    const sortKey = parseSortDate(r.doneAt);
    events.push({
      id: `prev-${r.id}`,
      sortKey,
      dateLabel: formatDateLabel(sortKey),
      type: "prevention",
      emoji: "✅",
      title: r.title,
      meta: "Profilaktyka",
    });
  }

  for (const r of input.reminders) {
    const sortKey = r.sentAt;
    const isEmail = r.channel === "email";
    events.push({
      id: `rem-${r.id}`,
      sortKey,
      dateLabel: formatDateLabel(sortKey),
      type: isEmail ? "reminder_email" : "reminder_sms",
      emoji: isEmail ? "📧" : "📩",
      title: isEmail ? "E-mail wysłany do właściciela" : "SMS wysłany do właściciela",
      subtitle: r.message.length > 80 ? `${r.message.slice(0, 80)}…` : r.message,
      meta: "Przypomnienie",
    });
  }

  events.sort((a, b) => b.sortKey.localeCompare(a.sortKey));
  return events;
}
