export const VET_VISIT_STATUSES = [
  { value: "planned", label: "Zaplanowana" },
  { value: "done", label: "Zrealizowana" },
  { value: "cancelled", label: "Anulowana" },
  { value: "no_show", label: "Nie przyszedł" },
] as const;

export type VetVisitStatusValue = (typeof VET_VISIT_STATUSES)[number]["value"];

const VALID = new Set<string>(VET_VISIT_STATUSES.map((s) => s.value));

export function normalizeVisitStatus(value: string | null | undefined): VetVisitStatusValue | null {
  const v = value?.trim();
  if (v && VALID.has(v)) return v as VetVisitStatusValue;
  return null;
}

export function visitStatusLabel(value: string | null | undefined): string {
  const v = value?.trim();
  const found = VET_VISIT_STATUSES.find((s) => s.value === v);
  if (found) return found.label;
  if (v === "archived") return "Archiwum";
  return v ?? "—";
}

export function visitStatusBadgeClass(value: string | null | undefined): string {
  switch (value) {
    case "done":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-neutral-100 text-neutral-600";
    case "no_show":
      return "bg-orange-100 text-orange-800";
    case "planned":
    default:
      return "bg-wet-teal-100 text-wet-teal-800";
  }
}

export function isValidVisitStatus(value: string): boolean {
  return VALID.has(value);
}
