import type { NextRequest } from "next/server";
import type { JWT } from "next-auth/jwt";
import { resolveWetAppPath } from "@/lib/wetHost";
import { getWetLoginPublicPath, isWetMarketingOrAuthPath } from "@/lib/wetPaths";

/** Czy żądanie obsługujemy własną bramką auth (bez redirectu na /portal/login). */
export function shouldUseWetAuthGate(host: string, pathname: string): boolean {
  const internal = resolveWetAppPath(pathname, host);
  return internal.startsWith("/wet") || internal.startsWith("/api/wet/");
}

export function isWetPublicPath(internalPath: string): boolean {
  if (isWetMarketingOrAuthPath(internalPath)) return true;
  if (
    internalPath.startsWith("/wet/login") ||
    internalPath.startsWith("/wet/register") ||
    internalPath.startsWith("/wet/klient/logowanie") ||
    internalPath.startsWith("/wet/klient/rejestracja") ||
    internalPath.startsWith("/wet/potwierdz-email") ||
    internalPath.startsWith("/wet/zapomniane-haslo") ||
    internalPath.startsWith("/wet/ustaw-haslo")
  ) {
    return true;
  }
  if (internalPath.startsWith("/api/wet/owner/register")) return true;
  return false;
}

export function isAuthorizedWetPath(token: JWT | null, internalPath: string): boolean {
  if (isWetPublicPath(internalPath)) return true;
  if (internalPath.startsWith("/api/wet/pets/extract-document")) {
    return !!token;
  }
  if (internalPath.startsWith("/wet/panel")) {
    return !!token && (token.role === "vet" || token.role === "admin");
  }
  if (internalPath.startsWith("/wet/klient/panel")) {
    return !!token && token.role === "vet_owner";
  }
  return true;
}

export function getWetLoginRedirectUrl(request: NextRequest): URL {
  const host = request.headers.get("host") ?? "";
  const url = request.nextUrl.clone();
  url.pathname = getWetLoginPublicPath(host);
  if (!url.searchParams.has("callbackUrl")) {
    url.searchParams.set("callbackUrl", request.nextUrl.pathname + request.nextUrl.search);
  }
  return url;
}
