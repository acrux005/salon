/** Eksport CSV z danych przychodni — backup bez ERP. */

function csvEscape(value: string | number | null | undefined): string {
  const s = value == null ? "" : String(value);
  if (/[;"\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function toCsv(headers: string[], rows: string[][]): string {
  const lines = [headers.join(";"), ...rows.map((r) => r.map(csvEscape).join(";"))];
  return lines.join("\n") + "\n";
}

export type ClinicExportBundle = {
  owners: string;
  pets: string;
  vaccinations: string;
  appointments: string;
  exportedAt: string;
};

type OwnerRow = {
  name: string;
  phone: string;
  email: string | null;
  smsConsent: boolean;
  emailConsent: boolean;
  notes: string | null;
  createdAt: Date;
};

type PetRow = {
  name: string;
  species: string;
  breed: string | null;
  birthDate: string | null;
  chipNumber: string | null;
  status: string;
  notes: string | null;
  ownerName: string;
  ownerPhone: string;
  herdName: string | null;
};

type VaccinationRow = {
  petName: string;
  ownerName: string;
  vaccineName: string;
  administeredAt: Date;
  nextDueAt: Date;
  batchNumber: string | null;
  batchExpiryDate: string | null;
  vetName: string | null;
};

type AppointmentRow = {
  date: string;
  time: string;
  status: string;
  visitType: string | null;
  petName: string | null;
  ownerName: string | null;
  ownerPhone: string | null;
  notes: string | null;
};

export function buildOwnersCsv(owners: OwnerRow[]): string {
  return toCsv(
    ["imie", "telefon", "email", "sms", "email_marketing", "uwagi", "data_dodania"],
    owners.map((o) => [
      o.name,
      o.phone,
      o.email ?? "",
      o.smsConsent ? "tak" : "nie",
      o.emailConsent ? "tak" : "nie",
      o.notes ?? "",
      o.createdAt.toISOString().slice(0, 10),
    ])
  );
}

export function buildPetsCsv(pets: PetRow[]): string {
  return toCsv(
    ["imie", "gatunek", "rasa", "data_urodzenia", "chip", "status", "wlasciciel", "telefon", "stado", "uwagi"],
    pets.map((p) => [
      p.name,
      p.species,
      p.breed ?? "",
      p.birthDate ?? "",
      p.chipNumber ?? "",
      p.status,
      p.ownerName,
      p.ownerPhone,
      p.herdName ?? "",
      p.notes ?? "",
    ])
  );
}

export function buildVaccinationsCsv(rows: VaccinationRow[]): string {
  return toCsv(
    ["zwierze", "wlasciciel", "preparat", "data_podania", "nastepny_termin", "seria", "waznosc_serii", "lekarz"],
    rows.map((v) => [
      v.petName,
      v.ownerName,
      v.vaccineName,
      v.administeredAt.toISOString().slice(0, 10),
      v.nextDueAt.toISOString().slice(0, 10),
      v.batchNumber ?? "",
      v.batchExpiryDate ?? "",
      v.vetName ?? "",
    ])
  );
}

export function buildAppointmentsCsv(rows: AppointmentRow[]): string {
  return toCsv(
    ["data", "godzina", "status", "typ_wizyty", "zwierze", "wlasciciel", "telefon", "uwagi"],
    rows.map((a) => [
      a.date,
      a.time,
      a.status,
      a.visitType ?? "",
      a.petName ?? "",
      a.ownerName ?? "",
      a.ownerPhone ?? "",
      a.notes ?? "",
    ])
  );
}

export function buildClinicExportBundle(data: {
  owners: OwnerRow[];
  pets: PetRow[];
  vaccinations: VaccinationRow[];
  appointments: AppointmentRow[];
}): ClinicExportBundle {
  const exportedAt = new Date().toISOString();
  return {
    exportedAt,
    owners: buildOwnersCsv(data.owners),
    pets: buildPetsCsv(data.pets),
    vaccinations: buildVaccinationsCsv(data.vaccinations),
    appointments: buildAppointmentsCsv(data.appointments),
  };
}

export type { OwnerRow, PetRow, VaccinationRow, AppointmentRow };
