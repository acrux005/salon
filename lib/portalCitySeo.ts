import portalCitiesBundle from "@/content/portalCitiesAll.json";
import { PORTAL_CITY_BY_NAME, TOP_MARKETING_CITY_SLUGS as TOP_MARKETING_SET } from "@/content/portalCities";

export { formatCityLocativePhrase } from "@/content/portalCities";

import type { PortalSeoCity } from "@/content/portalCities";

type CityRecord = PortalSeoCity & {
  locativeManual?: boolean;
  radius?: number;
  countyCode?: string | null;
};

const bundle = portalCitiesBundle as {
  cities: CityRecord[];
  topMarketingSlugs: string[];
};

export const TOP_MARKETING_CITY_SLUGS = TOP_MARKETING_SET;

const cityMetaBySlug = new Map(bundle.cities.map((c) => [c.slug, c]));

export function getPortalCityMeta(slug: string): CityRecord | undefined {
  return cityMetaBySlug.get(slug);
}

export function isTopMarketingCity(slug: string): boolean {
  return TOP_MARKETING_CITY_SLUGS.has(slug);
}

/** Indeksacja: miasto z gabinetem LUB w top 200 rynków. */
export function shouldIndexCityPage(slug: string, hasPublishedClinics: boolean): boolean {
  if (hasPublishedClinics) return true;
  return isTopMarketingCity(slug);
}

export async function getCitiesWithPublishedClinics(): Promise<Set<string>> {
  const { getPrisma } = await import("@/lib/db");
  const prisma = getPrisma();
  const rows = await prisma.clinic.findMany({
    where: { isPublished: true },
    select: { city: true },
    distinct: ["city"],
  });
  return new Set(rows.map((r) => r.city).filter(Boolean));
}

export async function getIndexableCitySlugsForSitemap(): Promise<string[]> {
  const withClinics = await getCitiesWithPublishedClinics();
  const slugs = new Set<string>();

  Array.from(withClinics).forEach((cityName) => {
    const row = PORTAL_CITY_BY_NAME[cityName];
    if (row) slugs.add(row.slug);
  });

  Array.from(TOP_MARKETING_CITY_SLUGS).forEach((slug) => {
    slugs.add(slug);
  });

  return Array.from(slugs);
}
