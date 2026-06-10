import { visitTypeLabel } from "@/lib/vet/visitTypes";

/** Wspólny kształt wizyty z API kalendarza wet */
export type WetCalendarAppointment = {
  id: string;
  date?: string;
  time: string;
  status: string;
  visitType: string | null;
  petId: string | null;
  petName: string | null;
  ownerName: string | null;
  ownerPhone: string | null;
  notes: string | null;
  doctorId: string | null;
  doctorName: string | null;
  catalogItemId: string | null;
  catalogItemName: string | null;
  /** Etykieta wiersza: właściciel + zwierzę */
  label: string;
  /** @deprecated użyj visitType */
  service: string | null;
  /** @deprecated użyj label */
  client: string;
  staff: string | null;
};

export function formatAppointmentLabel(
  ownerName: string | null,
  petName: string | null
): string {
  const owner = ownerName?.trim() || "Właściciel";
  const pet = petName?.trim();
  return pet ? `${pet} · ${owner}` : owner;
}

export function mapVetAppointmentRow(row: {
  id: string;
  date: string;
  time: string;
  status: string;
  visitType: string | null;
  petId: string | null;
  petName: string | null;
  ownerName: string | null;
  ownerPhone: string | null;
  notes: string | null;
  vetDoctorId: string | null;
  vetDoctor?: { name: string } | null;
  catalogItemId?: string | null;
  catalogItem?: { name: string } | null;
}): WetCalendarAppointment {
  const label = formatAppointmentLabel(row.ownerName, row.petName);
  return {
    id: "va-" + row.id,
    date: row.date,
    time: row.time,
    status: row.status,
    visitType: row.visitType,
    petId: row.petId,
    petName: row.petName,
    ownerName: row.ownerName,
    ownerPhone: row.ownerPhone,
    notes: row.notes,
    doctorId: row.vetDoctorId,
    doctorName: row.vetDoctor?.name ?? null,
    catalogItemId: row.catalogItemId ?? null,
    catalogItemName: row.catalogItem?.name ?? null,
    label,
    service: visitTypeLabel(row.visitType),
    client: label,
    staff: row.vetDoctor?.name ?? null,
  };
}

export function addDaysYmd(dateStr: string, delta: number): string {
  const d = new Date(`${dateStr}T12:00:00`);
  d.setDate(d.getDate() + delta);
  return d.toISOString().slice(0, 10);
}

export function todayYmd(): string {
  return new Date().toISOString().slice(0, 10);
}
