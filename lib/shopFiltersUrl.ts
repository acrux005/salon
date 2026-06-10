import type { WcAttributeFilter } from "./wcStoreApi";

/** `attr=pa_kolor:czerwony` lub `attr=pa_kolor:czerwony,niebieski` */
export function parseAttrSearchParams(
  searchParams: Record<string, string | string[] | undefined>
): WcAttributeFilter[] {
  const raw = searchParams.attr;
  const arr = raw === undefined ? [] : Array.isArray(raw) ? raw : [raw];
  const out: WcAttributeFilter[] = [];
  for (const s of arr) {
    const str = String(s);
    const idx = str.indexOf(":");
    if (idx < 0) continue;
    const attribute = str.slice(0, idx).trim();
    const slugPart = str.slice(idx + 1).trim();
    if (!attribute || !slugPart) continue;
    for (const slug of slugPart.split(",").map((x) => x.trim()).filter(Boolean)) {
      out.push({ attribute, slug });
    }
  }
  return out;
}

/** Jedna pozycja na taksonomię — slug z OR po przecinku (Store API). */
export function mergeAttributeFiltersForApi(rows: WcAttributeFilter[]): WcAttributeFilter[] {
  const map = new Map<string, Set<string>>();
  for (const { attribute, slug } of rows) {
    if (!map.has(attribute)) map.set(attribute, new Set());
    map.get(attribute)!.add(slug);
  }
  const out: WcAttributeFilter[] = [];
  map.forEach((slugs, attribute) => {
    out.push({ attribute, slug: Array.from(slugs).join(",") });
  });
  return out;
}

export function parseCategoryIdsParam(
  cat: string | string[] | undefined
): number[] {
  const raw = Array.isArray(cat) ? cat[0] : cat;
  if (!raw || !String(raw).trim()) return [];
  return String(raw)
    .split(",")
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => !isNaN(n) && n > 0);
}

/** Klient — `useSearchParams()` */
export function parseAttrFromUrlSearchParams(sp: { getAll(key: string): string[] }): WcAttributeFilter[] {
  const out: WcAttributeFilter[] = [];
  for (const raw of sp.getAll("attr")) {
    const idx = raw.indexOf(":");
    if (idx < 0) continue;
    const attribute = raw.slice(0, idx).trim();
    const slugPart = raw.slice(idx + 1).trim();
    if (!attribute || !slugPart) continue;
    for (const slug of slugPart.split(",").map((x) => x.trim()).filter(Boolean)) {
      out.push({ attribute, slug });
    }
  }
  return out;
}

export function attrFiltersToRecord(rows: WcAttributeFilter[]): Record<string, string[]> {
  const m: Record<string, string[]> = {};
  for (const { attribute, slug } of rows) {
    if (!m[attribute]) m[attribute] = [];
    if (!m[attribute].includes(slug)) m[attribute].push(slug);
  }
  return m;
}

export function flattenAttrRecordToFilters(rec: Record<string, string[]>): WcAttributeFilter[] {
  const out: WcAttributeFilter[] = [];
  for (const [attribute, slugs] of Object.entries(rec)) {
    for (const slug of slugs) out.push({ attribute, slug });
  }
  return out;
}
