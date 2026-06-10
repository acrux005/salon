export const VET_PET_STATUSES = [
  { value: "active", label: "Aktywne", badge: "bg-green-100 text-green-800" },
  { value: "deceased", label: "Zmarłe", badge: "bg-slate-200 text-slate-700" },
  { value: "transferred", label: "Przeniesione", badge: "bg-amber-100 text-amber-800" },
] as const;

export type VetPetStatus = (typeof VET_PET_STATUSES)[number]["value"];

export function petStatusLabel(value: string): string {
  return VET_PET_STATUSES.find((s) => s.value === value)?.label ?? value;
}

export function petStatusBadgeClass(value: string): string {
  return VET_PET_STATUSES.find((s) => s.value === value)?.badge ?? "bg-slate-100 text-slate-700";
}
