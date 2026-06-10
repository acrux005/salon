/** CSV import wizyt: data;godzina;telefon;imie;typ_wizyty;notatka */
export type GabAppointmentImportRow = {
  line: number;
  date: string;
  time: string;
  phone: string;
  name: string;
  visitType: string;
  notes: string | null;
};

export function parseAppointmentImportCsv(raw: string): {
  rows: GabAppointmentImportRow[];
  errors: string[];
} {
  const errors: string[] = [];
  const lines = raw.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length === 0) return { rows: [], errors: ["Pusty plik."] };

  const header = lines[0].toLowerCase();
  const startIdx = header.includes("data") || header.includes("date") ? 1 : 0;
  const sep = lines[startIdx]?.includes(";") ? ";" : ",";
  const rows: GabAppointmentImportRow[] = [];

  for (let i = startIdx; i < lines.length; i++) {
    const parts = lines[i].split(sep).map((p) => p.trim());
    if (parts.length < 3) {
      errors.push(`Wiersz ${i + 1}: za mało kolumn.`);
      continue;
    }
    const [date, time, phone, name = "Pacjent", visitType = "konsultacja", notes = ""] = parts;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      errors.push(`Wiersz ${i + 1}: nieprawidłowa data (YYYY-MM-DD).`);
      continue;
    }
    if (!/^\d{2}:\d{2}$/.test(time)) {
      errors.push(`Wiersz ${i + 1}: nieprawidłowa godzina (HH:MM).`);
      continue;
    }
    rows.push({
      line: i + 1,
      date,
      time,
      phone,
      name,
      visitType,
      notes: notes || null,
    });
  }
  return { rows, errors };
}

export function buildAppointmentImportTemplate(): string {
  return "data;godzina;telefon;imie;typ_wizyty;notatka\n2026-06-01;10:00;500600700;Jan Kowalski;konsultacja;\n";
}
