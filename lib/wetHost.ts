/** Główna domena portalu weterynaryjnego. */
export const WET_PORTAL_PRIMARY_HOST = "weterynaria.odart.pl";

/** Host portalu weterynaryjnego (subdomena dedykowana lub legacy wet.salon). */
export function isWetPortalHost(host: string): boolean {
  const h = host.split(":")[0]?.toLowerCase() ?? "";
  return (
    h === WET_PORTAL_PRIMARY_HOST ||
    h === `www.${WET_PORTAL_PRIMARY_HOST}` ||
    h === "wet.salon.odart.pl" ||
    h === "www.wet.salon.odart.pl"
  );
}

/** Kanoniczny URL portalu wet (HTTPS). */
export function getWetSiteUrl(host?: string): string {
  if (host && isWetPortalHost(host)) {
    const h = host.split(":")[0]?.toLowerCase() ?? WET_PORTAL_PRIMARY_HOST;
    return `https://${h}`;
  }
  return `https://${WET_PORTAL_PRIMARY_HOST}`;
}

/**
 * Ścieżka wewnętrzna aplikacji (/wet/...).
 * Na dedykowanej subdomenie /panel → /wet/panel (middleware).
 */
export function resolveWetAppPath(pathname: string, host: string): string {
  if (!isWetPortalHost(host)) return pathname;
  if (
    pathname.startsWith("/wet") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/uploads") ||
    pathname.startsWith("/public")
  ) {
    return pathname;
  }
  if (pathname === "/") return "/wet";
  return `/wet${pathname}`;
}

export { wetPublicHref, wetInternalPath, getWetLoginPublicPath } from "@/lib/wetPaths";
