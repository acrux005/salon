export type VaccineOption = {
  id: string;
  name: string;
  manufacturer: string | null;
  defaultIntervalDays: number;
  defaultPrice: number | null;
  trackStock: boolean;
  stockDoses: number | null;
};

export function formatDatePl(isoDate: string): string {
  const d = new Date(isoDate.includes("T") ? isoDate : `${isoDate}T12:00:00`);
  return d.toLocaleDateString("pl-PL");
}

export function addDaysIso(dateStr: string, days: number): string {
  const d = new Date(`${dateStr}T12:00:00`);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export function matchesVaccineKeywords(name: string, keywords: string[]): boolean {
  const hay = name.toLowerCase();
  return keywords.some((kw) => hay.includes(kw.toLowerCase()));
}
