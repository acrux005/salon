function csvEscape(value: string | number | null | undefined): string {
  const s = value == null ? "" : String(value);
  if (/[;"\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function toCsv(headers: string[], rows: string[][]): string {
  return [headers.join(";"), ...rows.map((r) => r.map(csvEscape).join(";"))].join("\n") + "\n";
}

export function buildGabPatientsCsv(
  rows: {
    name: string;
    phone: string;
    email: string | null;
    pesel: string | null;
    birthDate: string | null;
    smsConsent: boolean;
    emailConsent: boolean;
    notes: string | null;
  }[]
): string {
  return toCsv(
    ["imie", "telefon", "email", "pesel", "data_urodzenia", "sms", "email_marketing", "uwagi"],
    rows.map((p) => [
      p.name,
      p.phone,
      p.email ?? "",
      p.pesel ?? "",
      p.birthDate ?? "",
      p.smsConsent ? "tak" : "nie",
      p.emailConsent ? "tak" : "nie",
      p.notes ?? "",
    ])
  );
}

export function buildGabClientsCsv(
  rows: {
    name: string;
    phone: string;
    email: string | null;
    smsConsent: boolean;
    emailConsent: boolean;
    notes: string | null;
  }[]
): string {
  return toCsv(
    ["imie", "telefon", "email", "sms", "email_marketing", "uwagi"],
    rows.map((c) => [
      c.name,
      c.phone,
      c.email ?? "",
      c.smsConsent ? "tak" : "nie",
      c.emailConsent ? "tak" : "nie",
      c.notes ?? "",
    ])
  );
}

export function buildGabAppointmentsCsv(
  rows: {
    date: string;
    time: string;
    status: string;
    visitType: string | null;
    patientName: string | null;
    patientPhone: string | null;
    notes: string | null;
  }[]
): string {
  return toCsv(
    ["data", "godzina", "status", "typ_wizyty", "pacjent", "telefon", "uwagi"],
    rows.map((a) => [
      a.date,
      a.time,
      a.status,
      a.visitType ?? "",
      a.patientName ?? "",
      a.patientPhone ?? "",
      a.notes ?? "",
    ])
  );
}

export function buildGabCatalogCsv(
  rows: {
    name: string;
    category: string;
    pricePln: number;
    durationMinutes: number;
    active: boolean;
  }[]
): string {
  return toCsv(
    ["nazwa", "kategoria", "cena", "minuty", "aktywny"],
    rows.map((r) => [
      r.name,
      r.category,
      String(r.pricePln),
      String(r.durationMinutes),
      r.active ? "tak" : "nie",
    ])
  );
}

export function buildGabTreatmentPlansCsv(
  rows: {
    title: string;
    patientName: string;
    status: string;
    totalPln: number;
    itemCount: number;
  }[]
): string {
  return toCsv(
    ["tytul", "pacjent", "status", "suma_pln", "liczba_etapow"],
    rows.map((p) => [p.title, p.patientName, p.status, String(p.totalPln), String(p.itemCount)])
  );
}

export function buildGabExportBundle(data: {
  patients: Parameters<typeof buildGabPatientsCsv>[0];
  clients: Parameters<typeof buildGabClientsCsv>[0];
  appointments: Parameters<typeof buildGabAppointmentsCsv>[0];
  plans: Parameters<typeof buildGabTreatmentPlansCsv>[0];
  catalog?: Parameters<typeof buildGabCatalogCsv>[0];
}) {
  const exportedAt = new Date().toISOString();
  return {
    exportedAt,
    patients: buildGabPatientsCsv(data.patients),
    clients: buildGabClientsCsv(data.clients),
    appointments: buildGabAppointmentsCsv(data.appointments),
    plans: buildGabTreatmentPlansCsv(data.plans),
    catalog: data.catalog ? buildGabCatalogCsv(data.catalog) : undefined,
  };
}
