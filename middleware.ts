import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import { withAuth } from "next-auth/middleware";
import { applyRafalKowalkowskiRouting } from "@/lib/rafalKowalkowskiMiddleware";
import { getSalonMarketingRedirect } from "@/lib/salonSeo";
import { isGabinetPortalHost, resolveGabinetAppPath } from "@/lib/gabinetPlatform/host";
import { isGabinetAppPath } from "@/lib/gabinetPlatform/paths";
import { isAuthorizedGabinetPath } from "@/lib/gabinetPlatform/authGate";
import { isWetPortalHost, resolveWetAppPath } from "@/lib/wetHost";
import { isAuthorizedWetPath } from "@/lib/wetAuthGate";
import { isRandkiPortalHost, resolveRandkiAppPath } from "@/lib/randkiHost";
import { isAuthorizedRandkiPath } from "@/lib/randkiAuthGate";

function applyGabinetBlockSalonRoutes(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  if (!isGabinetPortalHost(host)) return null;
  const path = request.nextUrl.pathname;
  if (
    path.startsWith("/portal") ||
    path.startsWith("/zabiegi") ||
    path.startsWith("/wet") ||
    path === "/panel/logowanie" ||
    path.startsWith("/panel/logowanie/")
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return null;
}

function applyGabinetCanonicalRedirect(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  if (!isGabinetPortalHost(host)) return null;
  const { pathname, search } = request.nextUrl;
  if (!isGabinetAppPath(pathname)) return null;
  const dest = pathname === "/gabinet" ? "/" : pathname.slice(8) || "/";
  return NextResponse.redirect(new URL(`${dest}${search}`, request.url), 308);
}

function applyGabinetSubdomainRouting(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  if (!isGabinetPortalHost(host)) return null;
  const path = request.nextUrl.pathname;
  const internal = resolveGabinetAppPath(path, host);
  if (internal === path) return null;
  const url = request.nextUrl.clone();
  url.pathname = internal;
  return NextResponse.rewrite(url);
}

function applyWetBlockSalonRoutes(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  if (!isWetPortalHost(host)) return null;
  const path = request.nextUrl.pathname;
  if (
    path.startsWith("/portal") ||
    path.startsWith("/zabiegi") ||
    path === "/panel/logowanie" ||
    path.startsWith("/panel/logowanie/")
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return null;
}

function applyWetCanonicalRedirect(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  if (!isWetPortalHost(host)) return null;
  const { pathname, search } = request.nextUrl;
  if (!pathname.startsWith("/wet")) return null;
  const dest = pathname === "/wet" ? "/" : pathname.slice(4) || "/";
  return NextResponse.redirect(new URL(`${dest}${search}`, request.url), 308);
}

function applyWetSubdomainRouting(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  if (!isWetPortalHost(host)) return null;
  const path = request.nextUrl.pathname;
  const internal = resolveWetAppPath(path, host);
  if (internal === path) return null;
  const url = request.nextUrl.clone();
  url.pathname = internal;
  return NextResponse.rewrite(url);
}

function applyRandkiBlockSalonRoutes(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  if (!isRandkiPortalHost(host)) return null;
  const path = request.nextUrl.pathname;
  if (
    path.startsWith("/portal") ||
    path.startsWith("/zabiegi") ||
    path.startsWith("/wet") ||
    isGabinetAppPath(path) ||
    path === "/panel/logowanie" ||
    path.startsWith("/panel/logowanie/")
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return null;
}

function applyRandkiCanonicalRedirect(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  if (!isRandkiPortalHost(host)) return null;
  const { pathname, search } = request.nextUrl;
  if (!pathname.startsWith("/randki")) return null;
  const dest = pathname === "/randki" ? "/" : pathname.slice(7) || "/";
  return NextResponse.redirect(new URL(`${dest}${search}`, request.url), 308);
}

function applyRandkiSubdomainRouting(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  if (!isRandkiPortalHost(host)) return null;
  const path = request.nextUrl.pathname;
  const internal = resolveRandkiAppPath(path, host);
  if (internal === path) return null;
  const url = request.nextUrl.clone();
  url.pathname = internal;
  return NextResponse.rewrite(url);
}

function resolveAppPath(pathname: string, host: string): string {
  if (isGabinetPortalHost(host)) return resolveGabinetAppPath(pathname, host);
  if (isWetPortalHost(host)) return resolveWetAppPath(pathname, host);
  if (isRandkiPortalHost(host)) return resolveRandkiAppPath(pathname, host);
  return pathname;
}

const authMiddleware = withAuth(
  function middleware(request) {
    const salonIt = getSalonMarketingRedirect(request);
    if (salonIt) return salonIt;
    const rafal = applyRafalKowalkowskiRouting(request);
    if (rafal) return rafal;
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const host = req.headers.get("host") ?? "";
        const path = resolveAppPath(req.nextUrl.pathname, host);

        if (isGabinetAppPath(path) || path.startsWith("/api/gabinet/")) {
          return isAuthorizedGabinetPath(token, path);
        }

        if (path.startsWith("/wet") || path.startsWith("/api/wet/")) {
          return isAuthorizedWetPath(token, path);
        }

        if (path.startsWith("/randki") || path.startsWith("/api/randki/")) {
          return isAuthorizedRandkiPath(token, path);
        }

        if (path.startsWith("/panel")) {
          if (path === "/panel/logowanie" || path.startsWith("/panel/logowanie")) return true;
          if (!token) return false;
          return ["restaurant", "admin"].includes(String(token.role ?? ""));
        }
        if (path.startsWith("/portal")) {
          if (path.startsWith("/portal/admin")) return token?.role === "admin";
          if (path.startsWith("/portal/panel/zabiegi")) return token?.role === "admin";
          if (path.startsWith("/portal/moje-rezerwacje")) return token?.role === "client";
          if (path.startsWith("/portal/ustawienia")) return !!token;
          if (path.startsWith("/portal/powiadomienia")) return !!token;
          if (path.startsWith("/portal/wiadomosci")) return !!token;
          if (path.startsWith("/portal/panel")) return !!token;
        }
        if (
          path.startsWith("/api/booking/appointments") ||
          path.startsWith("/api/booking/calendar")
        ) {
          return !!token;
        }
        return true;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

export default async function middleware(request: NextRequest, event: NextFetchEvent) {
  for (const fn of [
    applyGabinetBlockSalonRoutes,
    applyGabinetCanonicalRedirect,
    applyGabinetSubdomainRouting,
    applyWetBlockSalonRoutes,
    applyWetCanonicalRedirect,
    applyWetSubdomainRouting,
    applyRandkiBlockSalonRoutes,
    applyRandkiCanonicalRedirect,
    applyRandkiSubdomainRouting,
  ]) {
    const res = fn(request);
    if (res) return res;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return authMiddleware(request as any, event);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:ico|png|jpg|jpeg|gif|webp|svg|woff2?|css|js)$).*)",
  ],
};
