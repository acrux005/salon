import type { JWT } from "next-auth/jwt";
import { RANDKI_ROLE } from "@/lib/auth";
import { resolveRandkiAppPath } from "@/lib/randkiHost";
import { getRandkiLoginPublicPath, isRandkiMarketingOrAuthPath } from "@/lib/randkiPaths";

export function shouldUseRandkiAuthGate(host: string, pathname: string): boolean {
  const internal = resolveRandkiAppPath(pathname, host);
  return internal.startsWith("/randki") || internal.startsWith("/api/randki/");
}

export function isRandkiPublicPath(internalPath: string): boolean {
  if (isRandkiMarketingOrAuthPath(internalPath)) return true;
  return false;
}

export function isAuthorizedRandkiPath(token: JWT | null, internalPath: string): boolean {
  if (isRandkiPublicPath(internalPath)) return true;
  if (
    internalPath.startsWith("/randki/panel") ||
    internalPath.startsWith("/randki/profil") ||
    internalPath.startsWith("/randki/dopasowania") ||
    internalPath.startsWith("/randki/czat") ||
    internalPath.startsWith("/randki/polubienia") ||
    internalPath.startsWith("/randki/ustawienia") ||
    internalPath.startsWith("/randki/onboarding") ||
    internalPath.startsWith("/api/randki/")
  ) {
    if (token?.datingBanned) return false;
    return !!token && token.role === RANDKI_ROLE;
  }
  return true;
}

export function getRandkiLoginRedirectPath(host: string, callbackPath: string): string {
  const login = getRandkiLoginPublicPath(host);
  const cb = encodeURIComponent(callbackPath);
  return `${login}?callbackUrl=${cb}`;
}
