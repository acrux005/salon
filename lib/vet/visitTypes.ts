export const VET_VISIT_TYPES = [
  { value: "szczepienie", label: "Szczepienie" },
  { value: "leczenie", label: "Leczenie" },
  { value: "kontrola", label: "Kontrola" },
  { value: "konsultacja", label: "Konsultacja" },
  { value: "zabieg", label: "Zabieg" },
  { value: "odrobaczenie", label: "Odrobaczenie" },
  { value: "pilna", label: "Pilna" },
  { value: "terenowa", label: "Terenowa" },
] as const;

export type VetVisitTypeValue = (typeof VET_VISIT_TYPES)[number]["value"];

const VALID = new Set<string>(VET_VISIT_TYPES.map((t) => t.value));

export function normalizeVisitType(value: string | null | undefined): VetVisitTypeValue {
  const v = value?.trim().toLowerCase();
  if (v && VALID.has(v)) return v as VetVisitTypeValue;
  return "kontrola";
}

export function visitTypeLabel(value: string | null | undefined): string {
  const v = normalizeVisitType(value);
  return VET_VISIT_TYPES.find((t) => t.value === v)?.label ?? v;
}

/** Badge pill (listy, karty) */
export function visitTypeBadgeClass(value: string | null | undefined): string {
  switch (normalizeVisitType(value)) {
    case "szczepienie":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "leczenie":
      return "bg-rose-100 text-rose-900 border-rose-200";
    case "kontrola":
      return "bg-sky-100 text-sky-800 border-sky-200";
    case "konsultacja":
      return "bg-slate-100 text-slate-700 border-slate-200";
    case "zabieg":
      return "bg-amber-100 text-amber-900 border-amber-200";
    case "odrobaczenie":
      return "bg-violet-100 text-violet-800 border-violet-200";
    case "pilna":
      return "bg-red-100 text-red-800 border-red-200";
    case "terenowa":
      return "bg-lime-100 text-lime-900 border-lime-200";
    default:
      return "bg-wet-teal-100 text-wet-teal-800 border-wet-teal-200";
  }
}

/** Blok wizyty w kalendarzu / timeline */
export function visitCalendarBlockClass(
  visitType: string | null | undefined,
  status: string
): string {
  if (status === "cancelled") {
    return "border-l-[4px] border-neutral-300 bg-neutral-100 text-neutral-500 line-through";
  }
  if (status === "no_show") {
    return "border-l-[4px] border-orange-400 bg-orange-50 text-orange-900 opacity-90";
  }
  if (status === "done") {
    return "border-l-[4px] border-green-500 bg-green-50/80 text-green-900";
  }
  switch (normalizeVisitType(visitType)) {
    case "szczepienie":
      return "border-l-[4px] border-emerald-500 bg-emerald-50 text-emerald-900";
    case "leczenie":
      return "border-l-[4px] border-rose-500 bg-rose-50 text-rose-900";
    case "kontrola":
      return "border-l-[4px] border-sky-500 bg-sky-50 text-sky-900";
    case "konsultacja":
      return "border-l-[4px] border-slate-400 bg-slate-50 text-slate-800";
    case "zabieg":
      return "border-l-[4px] border-amber-500 bg-amber-50 text-amber-900";
    case "odrobaczenie":
      return "border-l-[4px] border-violet-500 bg-violet-50 text-violet-900";
    case "pilna":
      return "border-l-[4px] border-red-500 bg-red-50 text-red-900";
    case "terenowa":
      return "border-l-[4px] border-lime-600 bg-lime-50 text-lime-900";
    default:
      return "border-l-[4px] border-wet-teal-500 bg-wet-teal-50 text-wet-teal-900";
  }
}
