import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isRafalKowalkowskiPlHost } from "@/lib/odartSite";
import {
  internalPathToLegacyPublic,
  legacyPathToInternal,
  rafalInternalToLegacyRedirect,
} from "@/lib/rafalKowalkowskiLegacyRoutes";

export function applyRafalKowalkowskiRouting(request: NextRequest): NextResponse | null {
  const host = request.headers.get("host") ?? "";
  if (!isRafalKowalkowskiPlHost(host)) return null;

  const pathname = request.nextUrl.pathname;

  const legacyRedirect = rafalInternalToLegacyRedirect(pathname);
  if (legacyRedirect) {
    const url = request.nextUrl.clone();
    url.pathname = legacyRedirect;
    return NextResponse.redirect(url, 301);
  }

  const internal = legacyPathToInternal(pathname);
  if (!internal) return null;

  if (internal.startsWith("REDIRECT_PUBLIC:")) {
    const target = internal.slice("REDIRECT_PUBLIC:".length);
    const url = request.nextUrl.clone();
    url.pathname = target;
    return NextResponse.redirect(url, 301);
  }

  if (internal.startsWith("REDIRECT:")) {
    const target = internal.slice("REDIRECT:".length);
    const url = request.nextUrl.clone();
    url.pathname = internalPathToLegacyPublic(target) ?? target;
    return NextResponse.redirect(url, 301);
  }

  if (internal === "/kontakt" || internal === "/blog") {
    return null;
  }

  if (internal.startsWith("REWRITE:")) {
    const body = internal.slice("REWRITE:".length);
    const [internalPath, publicPath, search = ""] = body.split("|");
    const url = request.nextUrl.clone();
    url.pathname = internalPath;
    url.search = search ? `?${search}` : "";
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-rafal-public-path", publicPath);
    return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
  }

  const url = request.nextUrl.clone();
  url.pathname = internal;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-rafal-public-path", pathname);
  return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
}
