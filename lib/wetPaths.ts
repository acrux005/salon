import { isWetPortalHost } from "@/lib/wetHost";

/** Ścieżka wewnętrzna aplikacji (/wet/...) niezależnie od publicznego URL. */
export function wetInternalPath(pathname: string): string {
  if (pathname.startsWith("/wet")) return pathname;
  if (pathname === "/") return "/wet";
  return `/wet${pathname}`;
}

/** Publiczny URL linku — na subdomenie wet bez prefiksu /wet. */
export function wetPublicHref(path: string, hostOrIsWet?: string | boolean): string {
  const isWet =
    typeof hostOrIsWet === "boolean"
      ? hostOrIsWet
      : hostOrIsWet
        ? isWetPortalHost(hostOrIsWet)
        : false;
  const p = path.startsWith("/") ? path : `/${path}`;
  const internal = p.startsWith("/wet") ? p : `/wet${p === "/" ? "" : p}`;
  if (!isWet) return internal;
  if (internal === "/wet") return "/";
  return internal.slice(4) || "/";
}

export function getWetLoginPublicPath(host: string): string {
  return isWetPortalHost(host) ? "/login" : "/wet/login";
}

export function isWetMarketingOrAuthPath(internalPath: string): boolean {
  if (!internalPath.startsWith("/wet")) return false;
  if (internalPath.startsWith("/wet/panel")) return false;
  if (internalPath.startsWith("/wet/klient/panel")) return false;
  return true;
}

/** Po logowaniu wet — akceptuje callback /wet/..., /panel/... i /klient/... */
export function resolveWetLoginCallback(
  callbackUrl: string | null | undefined,
  fallbackInternal: string,
  isWetPortal = false
): string {
  const fallback = wetPublicHref(fallbackInternal, isWetPortal);
  if (!callbackUrl?.startsWith("/")) return fallback;

  let internal = callbackUrl;
  if (callbackUrl.startsWith("/panel") || callbackUrl.startsWith("/klient")) {
    internal = `/wet${callbackUrl}`;
  } else if (!callbackUrl.startsWith("/wet")) {
    return fallback;
  }

  return wetPublicHref(internal, isWetPortal);
}
