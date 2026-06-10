import { visitTypeLabel } from "@/lib/gabinet/visitTypes";

export type GabCalendarAppointment = {
  id: string;
  date?: string;
  time: string;
  status: string;
  visitType: string | null;
  patientId: string | null;
  patientName: string | null;
  patientPhone: string | null;
  notes: string | null;
  staffId: string | null;
  staffName: string | null;
  label: string;
  client: string;
  staff: string | null;
};

export function formatGabAppointmentLabel(patientName: string | null, phone: string | null): string {
  const name = patientName?.trim() || "Pacjent";
  const ph = phone?.trim();
  return ph ? `${name} · ${ph}` : name;
}

export function mapGabAppointmentRow(row: {
  id: string;
  date: string;
  time: string;
  status: string;
  visitType: string | null;
  patientId: string | null;
  patientName: string | null;
  patientPhone: string | null;
  notes: string | null;
  gabStaffId: string | null;
  gabStaff?: { name: string } | null;
}): GabCalendarAppointment {
  const label = formatGabAppointmentLabel(row.patientName, row.patientPhone);
  return {
    id: "ga-" + row.id,
    date: row.date,
    time: row.time,
    status: row.status,
    visitType: row.visitType,
    patientId: row.patientId,
    patientName: row.patientName,
    patientPhone: row.patientPhone,
    notes: row.notes,
    staffId: row.gabStaffId,
    staffName: row.gabStaff?.name ?? null,
    label,
    client: label,
    staff: row.gabStaff?.name ?? null,
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

export const GAB_APPOINTMENT_PREFIX = "ga-";
