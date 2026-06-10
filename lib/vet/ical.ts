type IcalAppointment = {
  id: string;
  date: string;
  time: string;
  status: string;
  visitType: string | null;
  ownerName: string | null;
  petName: string | null;
  notes: string | null;
  doctorName: string | null;
};

function escapeIcalText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

function formatIcalUtc(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function appointmentStartEnd(date: string, time: string, durationMinutes: number): { start: Date; end: Date } {
  const [h, m] = time.split(":").map((v) => parseInt(v, 10));
  const start = new Date(`${date}T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`);
  const end = new Date(start.getTime() + durationMinutes * 60_000);
  return { start, end };
}

export function buildVetCalendarIcs(params: {
  clinicName: string;
  slotDurationMinutes: number;
  appointments: IcalAppointment[];
}): string {
  const now = formatIcalUtc(new Date());
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//VetHarmonogram//PL",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeIcalText(params.clinicName)} — wizyty`,
  ];

  for (const appt of params.appointments) {
    if (appt.status === "cancelled") continue;
    const { start, end } = appointmentStartEnd(appt.date, appt.time, params.slotDurationMinutes);
    const summaryParts = [appt.petName, appt.visitType].filter(Boolean);
    const summary = summaryParts.length > 0 ? summaryParts.join(" · ") : "Wizyta";
    const descriptionParts = [
      appt.ownerName ? `Właściciel: ${appt.ownerName}` : null,
      appt.doctorName ? `Lekarz: ${appt.doctorName}` : null,
      appt.notes ? `Uwagi: ${appt.notes}` : null,
    ].filter(Boolean);

    lines.push(
      "BEGIN:VEVENT",
      `UID:vet-appt-${appt.id}@vetharmonogram`,
      `DTSTAMP:${now}`,
      `DTSTART:${formatIcalUtc(start)}`,
      `DTEND:${formatIcalUtc(end)}`,
      `SUMMARY:${escapeIcalText(summary)}`,
      ...(descriptionParts.length > 0
        ? [`DESCRIPTION:${escapeIcalText(descriptionParts.join("\\n"))}`]
        : []),
      "END:VEVENT"
    );
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}
