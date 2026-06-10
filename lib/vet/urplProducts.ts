/**
 * Oficjalny rejestr URPL (Rejestr Produktów Leczniczych) — produkty weterynaryjne.
 * Źródło: https://rejestry.ezdrowie.gov.pl/api/rpl/medicinal-products/public-pl-report/6.0.0/overall.xml
 * Aktualizacja: scripts/sync-urpl-vet-products.mjs (pobiera XML z e-rejestru CEZ)
 */

export type UrplVetProduct = {
  urplId: string;
  name: string;
  commonName: string | null;
  manufacturer: string | null;
  permitNumber: string | null;
  pharmaceuticalForm: string | null;
  isVaccine: boolean;
};

export const URPL_XML_URL =
  "https://rejestry.ezdrowie.gov.pl/api/rpl/medicinal-products/public-pl-report/6.0.0/overall.xml";

export const URPL_SOURCE_LABEL =
  "URPL — Rejestr Produktów Leczniczych (rejestry.ezdrowie.gov.pl)";

function attr(tag: string, name: string): string | null {
  const re = new RegExp(`${name}="([^"]*)"`, "i");
  const m = tag.match(re);
  return m?.[1]?.trim() || null;
}

export function parseUrplVetProductsFromXml(xml: string): UrplVetProduct[] {
  const tagRe = /<produktLeczniczy[^>]*rodzajPreparatu="weterynaryjny"[^>]*>/gi;
  const out: UrplVetProduct[] = [];
  let m: RegExpExecArray | null;
  while ((m = tagRe.exec(xml)) !== null) {
    const tag = m[0];
    const name = attr(tag, "nazwaProduktu");
    const urplId = attr(tag, "id");
    if (!name || !urplId) continue;
    const commonName = attr(tag, "nazwaPowszechnieStosowana");
    const isVaccine =
      /szczepionk/i.test(commonName ?? "") ||
      /szczepionk/i.test(name) ||
      /vaccin/i.test(name);
    out.push({
      urplId,
      name,
      commonName,
      manufacturer: attr(tag, "podmiotOdpowiedzialny"),
      permitNumber: attr(tag, "numerPozwolenia"),
      pharmaceuticalForm: attr(tag, "nazwaPostaciFarmaceutycznej"),
      isVaccine,
    });
  }
  return out;
}

export function filterUrplProducts(
  products: UrplVetProduct[],
  query: string,
  options?: { vaccinesOnly?: boolean; limit?: number }
): UrplVetProduct[] {
  const q = query.trim().toLowerCase();
  let list = products;
  if (options?.vaccinesOnly) list = list.filter((p) => p.isVaccine);
  if (q) {
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.commonName?.toLowerCase().includes(q) ?? false) ||
        (p.manufacturer?.toLowerCase().includes(q) ?? false) ||
        (p.permitNumber?.includes(q) ?? false)
    );
  }
  list = list.slice().sort((a, b) => a.name.localeCompare(b.name, "pl"));
  return list.slice(0, options?.limit ?? 50);
}

/** Wczytuje wbudowany snapshot (generowany skryptem sync). */
export async function loadUrplVetProductsSnapshot(): Promise<UrplVetProduct[]> {
  try {
    const data = await import("@/lib/vet/data/urpl-vet-products.json");
    return (data.default ?? data) as UrplVetProduct[];
  } catch {
    return [];
  }
}

export async function fetchAndParseUrplVetProducts(): Promise<{
  products: UrplVetProduct[];
  fetchedAt: string;
}> {
  const res = await fetch(URPL_XML_URL, {
    headers: { Accept: "application/xml", "User-Agent": "VetHarmonogram/1.0 (+sync)" },
    next: { revalidate: 0 },
  });
  if (!res.ok) throw new Error(`URPL HTTP ${res.status}`);
  const xml = await res.text();
  return {
    products: parseUrplVetProductsFromXml(xml),
    fetchedAt: new Date().toISOString(),
  };
}
