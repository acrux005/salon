import { isRandkiPortalHost } from "@/lib/randkiHost";

export function randkiInternalPath(pathname: string): string {
  if (pathname.startsWith("/randki")) return pathname;
  if (pathname === "/") return "/randki";
  return `/randki${pathname}`;
}

export function randkiPublicHref(path: string, hostOrIsRandki?: string | boolean): string {
  const isRandki =
    typeof hostOrIsRandki === "boolean"
      ? hostOrIsRandki
      : hostOrIsRandki
        ? isRandkiPortalHost(hostOrIsRandki)
        : false;
  const p = path.startsWith("/") ? path : `/${path}`;
  const internal = p.startsWith("/randki") ? p : `/randki${p === "/" ? "" : p}`;
  if (!isRandki) return internal;
  if (internal === "/randki") return "/";
  return internal.slice(7) || "/";
}

export function getRandkiLoginPublicPath(host: string): string {
  return isRandkiPortalHost(host) ? "/logowanie" : "/randki/logowanie";
}

export function isRandkiMarketingOrAuthPath(internalPath: string): boolean {
  if (!internalPath.startsWith("/randki")) return false;
  if (internalPath.startsWith("/randki/panel")) return false;
  if (internalPath.startsWith("/randki/profil")) return false;
  if (internalPath.startsWith("/randki/dopasowania")) return false;
  if (internalPath.startsWith("/randki/czat")) return false;
  if (internalPath.startsWith("/randki/polubienia")) return false;
  if (internalPath.startsWith("/randki/ustawienia")) return false;
  if (internalPath.startsWith("/randki/onboarding")) return false;
  if (internalPath.startsWith("/randki/spolecznosci")) return false;
  if (internalPath.startsWith("/randki/voice-match")) return false;
  if (internalPath.startsWith("/randki/gosc")) return false;
  if (internalPath.startsWith("/randki/pokoj")) return false;
  return true;
}

export function resolveRandkiLoginCallback(
  callbackUrl: string | null | undefined,
  fallbackInternal: string,
  isRandkiPortal = false
): string {
  const fallback = randkiPublicHref(fallbackInternal, isRandkiPortal);
  if (!callbackUrl?.startsWith("/")) return fallback;
  let internal = callbackUrl;
  if (
    !callbackUrl.startsWith("/randki") &&
    !["/panel", "/profil", "/dopasowania", "/czat", "/logowanie", "/rejestracja"].some((p) =>
      callbackUrl.startsWith(p)
    )
  ) {
    return fallback;
  }
  if (!callbackUrl.startsWith("/randki")) {
    internal = `/randki${callbackUrl}`;
  }
  return randkiPublicHref(internal, isRandkiPortal);
}
