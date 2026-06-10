import { normalizeVisitType, type VetVisitTypeValue } from "@/lib/vet/visitTypes";

export const VET_CATALOG_CATEGORIES = [
  { value: "szczepienie", label: "Szczepienia" },
  { value: "zabieg", label: "Zabiegi" },
  { value: "konsultacja", label: "Konsultacje" },
  { value: "inne", label: "Inne" },
] as const;

export type VetCatalogCategory = (typeof VET_CATALOG_CATEGORIES)[number]["value"];

const VALID_CATEGORIES = new Set<string>(VET_CATALOG_CATEGORIES.map((c) => c.value));

export function normalizeCatalogCategory(value: string | null | undefined): VetCatalogCategory {
  const v = value?.trim();
  if (v && VALID_CATEGORIES.has(v)) return v as VetCatalogCategory;
  return "szczepienie";
}

export function catalogCategoryLabel(value: string | null | undefined): string {
  const v = normalizeCatalogCategory(value);
  return VET_CATALOG_CATEGORIES.find((c) => c.value === v)?.label ?? v;
}

export function catalogCategoryToVisitType(category: string | null | undefined): VetVisitTypeValue {
  switch (normalizeCatalogCategory(category)) {
    case "szczepienie":
      return "szczepienie";
    case "zabieg":
      return "zabieg";
    case "konsultacja":
      return "konsultacja";
    default:
      return "kontrola";
  }
}

export function resolveVisitTypeFromCatalog(item: {
  category: string;
  defaultVisitType?: string | null;
}): VetVisitTypeValue {
  if (item.defaultVisitType?.trim()) {
    return normalizeVisitType(item.defaultVisitType);
  }
  return catalogCategoryToVisitType(item.category);
}

/** Grosze → tekst PLN */
export function formatCatalogPrice(grosze: number | null | undefined): string {
  if (grosze == null) return "—";
  return `${(grosze / 100).toLocaleString("pl-PL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} zł`;
}

export function parseCatalogPriceInput(value: string): number | null {
  const cleaned = value.replace(/\s/g, "").replace(",", ".").trim();
  if (!cleaned) return null;
  const num = parseFloat(cleaned);
  if (Number.isNaN(num) || num < 0) return null;
  return Math.round(num * 100);
}

export const DEFAULT_CATALOG_TEMPLATES: {
  category: VetCatalogCategory;
  name: string;
  manufacturer?: string;
  defaultIntervalDays?: number;
  defaultVisitType?: VetVisitTypeValue;
  defaultPriceGrosze?: number;
}[] = [
  { category: "szczepienie", name: "Nobivac DHPPi", manufacturer: "MSD", defaultIntervalDays: 365, defaultVisitType: "szczepienie" },
  { category: "szczepienie", name: "Purevax RCP", manufacturer: "Boehringer", defaultIntervalDays: 365, defaultVisitType: "szczepienie" },
  { category: "szczepienie", name: "Wścieklizna", defaultIntervalDays: 365, defaultVisitType: "szczepienie" },
  { category: "zabieg", name: "Kastracja", defaultVisitType: "zabieg" },
  { category: "zabieg", name: "Sterylizacja", defaultVisitType: "zabieg" },
  { category: "zabieg", name: "Odrobaczenie", defaultVisitType: "odrobaczenie" },
  { category: "konsultacja", name: "Konsultacja ogólna", defaultVisitType: "konsultacja" },
];

export type VetCatalogItemDto = {
  id: string;
  category: string;
  name: string;
  manufacturer: string | null;
  defaultPrice: number | null;
  defaultIntervalDays: number;
  defaultVisitType: string | null;
  trackStock: boolean;
  stockDoses: number | null;
  urplId: string | null;
  permitNumber: string | null;
  active: boolean;
  order: number;
};

export const LOW_STOCK_THRESHOLD = 5;

export function isLowStock(item: { trackStock: boolean; stockDoses: number | null }): boolean {
  return item.trackStock && item.stockDoses != null && item.stockDoses <= LOW_STOCK_THRESHOLD;
}

export { PREVENTION_CATALOG_TEMPLATES } from "@/lib/vet/preventionPlans";
