export const GAB_VISIT_STATUSES = [
  { value: "planned", label: "Zaplanowana" },
  { value: "confirmed", label: "Potwierdzona" },
  { value: "completed", label: "Zakończona" },
  { value: "cancelled", label: "Anulowana" },
  { value: "noshow", label: "Nieobecność" },
] as const;

export function visitStatusLabel(status: string | null | undefined): string {
  return GAB_VISIT_STATUSES.find((s) => s.value === status)?.label ?? status ?? "—";
}

export function isValidVisitStatus(status: string): boolean {
  return GAB_VISIT_STATUSES.some((s) => s.value === status);
}

export function visitStatusBadgeClass(status: string | null | undefined): string {
  switch (status) {
    case "confirmed":
      return "bg-green-100 text-green-800";
    case "completed":
      return "bg-slate-200 text-slate-700";
    case "cancelled":
      return "bg-red-50 text-red-600 line-through";
    case "noshow":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-sky-50 text-sky-800";
  }
}
