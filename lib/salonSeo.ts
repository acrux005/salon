import type { MetadataRoute } from "next";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ODART_SITE_URL } from "@/lib/odartSite";
import { SALON_B2B_LANDING_PATHS } from "@/lib/seoLandingPaths";

export const SALON_SITE_URL =
  process.env.NEXT_PUBLIC_SALON_SITE_URL?.replace(/\/$/, "") || "https://salon.odart.pl";

const ODART_ORIGIN = ODART_SITE_URL.replace(/\/$/, "");

/** Ścieżki marketingu IT / ODART — na salon.odart.pl przekierowujemy na odart.pl. */
const SALON_IT_EXACT_PATHS = new Set([
  "/o-mnie",
  "/uslugi",
  "/pozycjonowanie-seo",
  "/profesjonalna-strona-internetowa-dla-ciebie-juz-od-1500-zl",
  "/administracja-stron-internetowych-wordpress",
  "/tworzenie-stron-internetowych-na-wordpressie",
  "/informatyk-kolobrzeg",
  "/opieka-it-dla-firm-kolobrzeg",
  "/informatyk-koszalin",
  "/monitoring-i-kamery-kolobrzeg",
  "/strony-internetowe",
  "/strona-internetowa-koszalin",
  "/strony-demo",
]);

const SALON_IT_PREFIXES = [
  "/produkt/",
  "/blog/",
  "/portfolio/",
  "/project/",
  "/rafal-kowalkowski/",
  "/salon-demo/",
];

export function isSalonPublicHost(host: string): boolean {
  const h = host.split(":")[0]?.toLowerCase() ?? "";
  return h === "salon.odart.pl";
}

export function isSalonItPath(pathname: string): boolean {
  const path = pathname.replace(/\/$/, "") || "/";
  if (SALON_IT_EXACT_PATHS.has(path)) return true;
  if (path === "/en" || path.startsWith("/en/")) return true;
  return SALON_IT_PREFIXES.some((prefix) => path.startsWith(prefix));
}

/** 301 z salon.odart.pl → ten sam path na odart.pl (treść agencji). */
export function getSalonMarketingRedirect(request: NextRequest): NextResponse | null {
  const host = request.headers.get("host") ?? "";
  if (!isSalonPublicHost(host)) return null;
  const { pathname, search } = request.nextUrl;
  if (!isSalonItPath(pathname)) return null;
  const dest = new URL(`${pathname}${search}`, `${ODART_ORIGIN}/`);
  return NextResponse.redirect(dest, 301);
}

export function getSalonSitemapBase(base: string, now: Date): MetadataRoute.Sitemap {
  const b = base.replace(/\/$/, "");
  const b2bLandings: MetadataRoute.Sitemap = SALON_B2B_LANDING_PATHS.map((path) => ({
    url: `${b}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.88,
  }));
  return [
    { url: `${b}/portal`, lastModified: now, changeFrequency: "daily" as const, priority: 1.0 },
    ...b2bLandings,
    { url: `${b}/zabiegi`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.95 },
    { url: `${b}/portal/gabinety`, lastModified: now, changeFrequency: "daily" as const, priority: 0.9 },
    { url: `${b}/portal/problemy-skory`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.85 },
    { url: `${b}/portal/artykuly`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.85 },
    { url: `${b}/portal/faq`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${b}/portal/dla-gabinetow`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.72 },
    { url: `${b}/kontakt`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${b}/polityka-prywatnosci`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${b}/polityka-cookies`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${b}/regulamin`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${b}/regulamin-wspolpracy`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${b}/o-nas`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${b}/analiza-skory`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 },
  ];
}
