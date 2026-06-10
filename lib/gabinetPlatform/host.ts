import { GABINET_VERTICALS } from "@/lib/gabinetPlatform/verticals";
import {
  gabinetInternalPath,
  gabinetPublicHref,
  getGabinetLoginPublicPath,
} from "@/lib/gabinetPlatform/paths";

/** Hosty z konfiguracji verticali (np. dentysta.odart.pl). */
export function isGabinetPortalHost(host: string): boolean {
  const h = host.split(":")[0]?.toLowerCase() ?? "";
  for (const v of Object.values(GABINET_VERTICALS)) {
    for (const entry of v.hosts) {
      const normalized = entry.toLowerCase();
      if (h === normalized || h === `www.${normalized}`) return true;
    }
  }
  return false;
}

export function getGabinetSiteUrl(host?: string): string {
  if (host && isGabinetPortalHost(host)) {
    const h = host.split(":")[0]?.toLowerCase() ?? "dentysta.odart.pl";
    return `https://${h}`;
  }
  return "https://dentysta.odart.pl";
}

export function resolveGabinetAppPath(pathname: string, host: string): string {
  if (!isGabinetPortalHost(host)) return pathname;
  if (
    pathname.startsWith("/gabinet") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/uploads") ||
    pathname.startsWith("/public")
  ) {
    return pathname;
  }
  if (pathname === "/") return "/gabinet";
  return `/gabinet${pathname}`;
}

export { gabinetPublicHref, gabinetInternalPath, getGabinetLoginPublicPath };
