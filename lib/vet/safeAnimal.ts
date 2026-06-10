export const SAFE_ANIMAL_STATUSES = [
  { value: "not_synced", label: "Niepołączone z SAFE-ANIMAL", shortLabel: "Niepołączone", badge: "bg-slate-100 text-slate-600 ring-slate-200" },
  { value: "pending", label: "Oczekuje na synchronizację", shortLabel: "Oczekuje", badge: "bg-amber-50 text-amber-800 ring-amber-200" },
  { value: "synced", label: "Połączone z SAFE-ANIMAL", shortLabel: "Połączone", badge: "bg-emerald-50 text-emerald-800 ring-emerald-200" },
  { value: "error", label: "Błąd synchronizacji", shortLabel: "Błąd", badge: "bg-red-50 text-red-800 ring-red-200" },
] as const;

export type SafeAnimalStatus = (typeof SAFE_ANIMAL_STATUSES)[number]["value"];

export const PET_SEX_OPTIONS = [
  { value: "samiec", label: "Samiec" },
  { value: "samica", label: "Samica" },
  { value: "nieznana", label: "Nieznana" },
] as const;

export type PetSex = (typeof PET_SEX_OPTIONS)[number]["value"];

const VALID_SAFE_ANIMAL = new Set<string>(SAFE_ANIMAL_STATUSES.map((s) => s.value));
const VALID_SEX = new Set<string>(PET_SEX_OPTIONS.map((s) => s.value));

export function safeAnimalStatusLabel(value: string): string {
  return SAFE_ANIMAL_STATUSES.find((s) => s.value === value)?.label ?? value;
}

export function safeAnimalStatusBadgeClass(value: string): string {
  const badge = SAFE_ANIMAL_STATUSES.find((s) => s.value === value)?.badge ?? "bg-slate-100 text-slate-600 ring-slate-200";
  return `ring-1 ring-inset ${badge}`;
}

export function petSexLabel(value: string | null | undefined): string {
  if (!value) return "—";
  return PET_SEX_OPTIONS.find((s) => s.value === value)?.label ?? value;
}

export function normalizeSafeAnimalStatus(value: string | null | undefined): SafeAnimalStatus {
  if (value && VALID_SAFE_ANIMAL.has(value)) return value as SafeAnimalStatus;
  return "not_synced";
}

export function normalizePetSex(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  if (VALID_SEX.has(trimmed)) return trimmed;
  return null;
}

export function formatSafeAnimalSyncedAt(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("pl-PL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const SAFE_ANIMAL_CHIP_SEARCH_BASE = "https://www.safe-animal.eu/pl/szukaj/Search";

/** Cyfry z numeru chipu — format akceptowany przez wyszukiwarkę SAFE-ANIMAL. */
export function normalizeChipNumberForSearch(chipNumber: string | null | undefined): string | null {
  if (!chipNumber?.trim()) return null;
  const digits = chipNumber.replace(/\D/g, "");
  return digits.length > 0 ? digits : null;
}

/** URL wyszukiwarki SAFE-ANIMAL z wpisanym numerem chipu. */
export function safeAnimalChipSearchUrl(chipNumber: string | null | undefined): string | null {
  const normalized = normalizeChipNumberForSearch(chipNumber);
  if (!normalized) return null;
  return `${SAFE_ANIMAL_CHIP_SEARCH_BASE}?animalNr=${encodeURIComponent(normalized)}`;
}
