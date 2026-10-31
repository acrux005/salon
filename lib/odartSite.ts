/** Domena marketingowa ODART (kanoniczne URL-e). */
export const ODART_SITE_URL =
  process.env.NEXT_PUBLIC_ODART_SITE_URL?.replace(/\/$/, "") || "https://odart.pl";

/**
 * Główna witryna ODART (PL/EN, regulamin itd.), gdy shell jest serwowany z rafalkowalkowski.pl —
 * linki do treści spoza profilu Rafała.
 */
export const ODART_MARKETING_ORIGIN = (
  process.env.NEXT_PUBLIC_ODART_MARKETING_ORIGIN || "https://odart.pl"
).replace(/\/$/, "");

/** Pełne portfolio w Next.js (oś czasu — kanoniczny URL). */
export const ODART_PORTFOLIO_URL = `${ODART_SITE_URL}/portfolio/`;

/** Blog (lista + wpisy) w Next.js — treść z WordPress REST API. */
export const ODART_BLOG_URL = `${ODART_SITE_URL}/blog/`;

export function isOdartMainHost(host: string) {
  const h = host.split(":")[0]?.toLowerCase() ?? "";
  if (h === "odart.pl" || h === "www.odart.pl") return true;
  return (
    process.env.ODART_PREVIEW === "1" &&
    process.env.NODE_ENV !== "production" &&
    (h === "localhost" || h === "127.0.0.1")
  );
}

/** Osobna witryna Next z sekcją Rafała (mirror treści z rafalkowalkowski.pl). */
const RAFAL_KOWALKOWSKI_PUBLIC_HOSTS = new Set([
  "rafalkowalkowski.pl",
  "www.rafalkowalkowski.pl",
  "dev.rafalkowalkowski.pl",
]);

export function isRafalKowalkowskiPlHost(host: string): boolean {
  const h = host.split(":")[0]?.toLowerCase() ?? "";
  return RAFAL_KOWALKOWSKI_PUBLIC_HOSTS.has(h);
}

/** Strony `/rafal-kowalkowski/*` — ODART lub dedykowana domena Rafała. */
export function isRafalKowalkowskiContentHost(host: string): boolean {
  return isOdartMainHost(host) || isRafalKowalkowskiPlHost(host);
}
