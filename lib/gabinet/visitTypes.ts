import { GABINET_VERTICALS, type GabinetVerticalId } from "@/lib/gabinetPlatform/verticals";

export function getVisitTypesForVertical(vertical: GabinetVerticalId = "dent") {
  return GABINET_VERTICALS[vertical].visitTypes;
}

export function visitTypeLabel(value: string | null | undefined): string {
  if (!value) return "Wizyta";
  for (const v of Object.values(GABINET_VERTICALS)) {
    const found = v.visitTypes.find((t) => t.value === value);
    if (found) return found.label;
  }
  return value;
}

export function normalizeVisitType(value: string | null | undefined): string {
  const v = value?.trim().toLowerCase();
  if (!v) return "konsultacja";
  for (const vertical of Object.values(GABINET_VERTICALS)) {
    if (vertical.visitTypes.some((t) => t.value === v)) return v;
  }
  return v;
}

export function visitTypeBadgeClass(value: string | null | undefined): string {
  switch (value) {
    case "pilna":
      return "bg-red-100 text-red-800";
    case "higienizacja":
      return "bg-sky-100 text-sky-800";
    case "leczenie":
      return "bg-amber-100 text-amber-900";
    default:
      return "bg-slate-100 text-slate-700";
  }
}
