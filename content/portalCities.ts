import portalCitiesBundle from "./portalCitiesAll.json";

export type PortalSeoCity = {
  name: string;
  slug: string;
  locative: string;
  /** Ręcznie wpisany miejscownik (np. „Warszawie”). */
  locativeManual?: boolean;
};

const bundle = portalCitiesBundle as {
  cities: PortalSeoCity[];
  topMarketingSlugs: string[];
  total: number;
};

/** Wszystkie miasta w Polsce (~1020) — podstrony /portal/gabinety/{slug}. */
export const PORTAL_SEO_CITIES: PortalSeoCity[] = bundle.cities;

/** ~200 największych — indeksowane nawet bez gabinetu (landing „szukamy partnerów”). */
export const TOP_MARKETING_CITY_SLUGS: ReadonlySet<string> = new Set(bundle.topMarketingSlugs);

export const PORTAL_CITY_BY_SLUG = Object.fromEntries(PORTAL_SEO_CITIES.map((city) => [city.slug, city]));
export const PORTAL_CITY_BY_NAME = Object.fromEntries(PORTAL_SEO_CITIES.map((city) => [city.name, city]));

/** W skrótach marketingowych — największe z listy SEO. */
export const FEATURED_PORTAL_CITIES = bundle.topMarketingSlugs
  .slice(0, 24)
  .map((slug) => PORTAL_CITY_BY_SLUG[slug])
  .filter((c): c is PortalSeoCity => Boolean(c));

/**
 * Stopka: Kołobrzeg + miasta z realnymi profilami w bazie (max 6).
 * Reszta przez link „Wszystkie miasta”.
 */
export const FOOTER_PORTAL_CITY_SLUGS = [
  "kolobrzeg",
  "wroclaw",
  "lodz",
  "gdansk",
  "szczecin",
  "bydgoszcz",
] as const;

export const FOOTER_PORTAL_CITIES = FOOTER_PORTAL_CITY_SLUGS.map(
  (slug) => PORTAL_CITY_BY_SLUG[slug]
).filter((c): c is PortalSeoCity => Boolean(c));

export const PORTAL_CITIES_TOTAL = bundle.total;

export function getPortalCityBySlug(slug: string | undefined): PortalSeoCity | undefined {
  return slug ? PORTAL_CITY_BY_SLUG[slug.toLowerCase()] : undefined;
}

export function getPortalCitySlug(city: string | undefined | null): string | undefined {
  return city ? PORTAL_CITY_BY_NAME[city]?.slug : undefined;
}

export function isTopMarketingCity(slug: string): boolean {
  return TOP_MARKETING_CITY_SLUGS.has(slug);
}

/** Tekst lokalizacji do treści (bez importu serwera). */
export function formatCityLocativePhrase(city: PortalSeoCity): string {
  if (city.locativeManual && city.locative !== city.name) {
    return city.locative;
  }
  return `miejscowości ${city.name}`;
}
