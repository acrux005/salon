export const RANDKI_PORTAL_PRIMARY_HOST = "randka.odart.pl";

/** Aktualna subdomena + legacy alias (randki.odart.pl). */
const RANDKI_PORTAL_HOSTS = new Set([
  RANDKI_PORTAL_PRIMARY_HOST,
  `www.${RANDKI_PORTAL_PRIMARY_HOST}`,
  "randki.odart.pl",
  "www.randki.odart.pl",
]);

export function isRandkiPortalHost(host: string): boolean {
  const h = host.split(":")[0]?.toLowerCase() ?? "";
  return RANDKI_PORTAL_HOSTS.has(h);
}

export function getRandkiSiteUrl(host?: string): string {
  if (host && isRandkiPortalHost(host)) {
    const h = host.split(":")[0]?.toLowerCase() ?? RANDKI_PORTAL_PRIMARY_HOST;
    return `https://${h}`;
  }
  return `https://${RANDKI_PORTAL_PRIMARY_HOST}`;
}

export function resolveRandkiAppPath(pathname: string, host: string): string {
  if (!isRandkiPortalHost(host)) return pathname;
  if (
    pathname.startsWith("/randki") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/uploads") ||
    pathname.startsWith("/public") ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/randki-icon.svg" ||
    pathname === "/randki-manifest.json"
  ) {
    return pathname;
  }
  if (pathname === "/") return "/randki";
  return `/randki${pathname}`;
}

export { randkiPublicHref, randkiInternalPath, getRandkiLoginPublicPath } from "@/lib/randkiPaths";
