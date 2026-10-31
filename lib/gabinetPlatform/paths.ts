import { isGabinetPortalHost } from "@/lib/gabinetPlatform/host";

/** Prefiks aplikacji — `/gabinet` i `/gabinet/...`, ale nie `/gabinety`. */
export function isGabinetAppPath(pathname: string): boolean {
  return pathname === "/gabinet" || pathname.startsWith("/gabinet/");
}

/** Ścieżka wewnętrzna aplikacji (/gabinet/...) niezależnie od publicznego URL. */
export function gabinetInternalPath(pathname: string): string {
  if (isGabinetAppPath(pathname)) return pathname;
  if (pathname === "/") return "/gabinet";
  return `/gabinet${pathname}`;
}

/** Publiczny URL linku — na subdomenie dent bez prefiksu /gabinet. */
export function gabinetPublicHref(path: string, hostOrIsPortal?: string | boolean): string {
  const isPortal =
    typeof hostOrIsPortal === "boolean"
      ? hostOrIsPortal
      : hostOrIsPortal
        ? isGabinetPortalHost(hostOrIsPortal)
        : false;
  const p = path.startsWith("/") ? path : `/${path}`;
  const internal = isGabinetAppPath(p) ? p : `/gabinet${p === "/" ? "" : p}`;
  if (!isPortal) return internal;
  if (internal === "/gabinet") return "/";
  return internal.slice(8) || "/";
}

export function getGabinetLoginPublicPath(host: string): string {
  return isGabinetPortalHost(host) ? "/login" : "/gabinet/login";
}

export function isGabinetMarketingOrAuthPath(internalPath: string): boolean {
  if (!isGabinetAppPath(internalPath)) return false;
  if (internalPath.startsWith("/gabinet/panel")) return false;
  if (internalPath.startsWith("/gabinet/klient/panel")) return false;
  return true;
}

export function resolveGabinetLoginCallback(
  callbackUrl: string | null | undefined,
  fallbackInternal: string,
  isPortal = false
): string {
  const fallback = gabinetPublicHref(fallbackInternal, isPortal);
  if (!callbackUrl?.startsWith("/")) return fallback;

  let internal = callbackUrl;
  if (callbackUrl.startsWith("/panel") || callbackUrl.startsWith("/klient")) {
    internal = `/gabinet${callbackUrl}`;
  } else if (!isGabinetAppPath(callbackUrl)) {
    return fallback;
  }

  return gabinetPublicHref(internal, isPortal);
}
