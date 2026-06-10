import { ODART_SITE_URL, ODART_PORTFOLIO_URL, ODART_BLOG_URL } from "@/lib/odartSite";
import { getEnglishServiceHref, ODART_ENGLISH_SERVICES_INDEX } from "@/lib/odartEnglishServices";
import {
  RAFAL_KOWALKOWSKI_GALLERY_PATH,
  RAFAL_KOWALKOWSKI_PROFILE_PATH,
  RAFAL_KOWALKOWSKI_TELEDYSKI_PATH,
  RAFAL_KOWALKOWSKI_USLUGI_PATH,
} from "@/lib/rafalKowalkowskiGallery";
import { RAFAL_KOWALKOWSKI_SERVICES } from "@/lib/rafalKowalkowskiServices";
import { rafalPublicHref } from "@/lib/rafalKowalkowskiLegacyRoutes";

const SITE = ODART_SITE_URL;
const EN_SITE = `${SITE}/en`;

export type OdartLocale = "pl" | "en";
export type OdartNavItem = { label: string; href: string; key: OdartNavKey };
export type OdartServiceItem = { label: string; href: string };

/** Lista usług do dropdownu w menu. */
export const ODART_SERVICES: OdartServiceItem[] = [
  { label: "Wszystkie usługi", href: `${SITE}/uslugi/` },
  { label: "Nowoczesne aplikacje webowe", href: `${SITE}/produkt/nowoczesne-aplikacje-webowe/` },
  { label: "Panele i systemy dla firm", href: `${SITE}/produkt/panele-i-systemy-dla-firm/` },
  { label: "Integracje API i automatyzacja", href: `${SITE}/produkt/integracje-api-i-automatyzacja/` },
  { label: "Strona internetowa", href: `${SITE}/strony-internetowe/` },
  { label: "Strona od 1500 zł", href: `${SITE}/profesjonalna-strona-internetowa-dla-ciebie-juz-od-1500-zl` },
  { label: "Tworzenie stron WordPress", href: `${SITE}/tworzenie-stron-internetowych-na-wordpressie` },
  { label: "Administracja WordPress", href: `${SITE}/administracja-stron-internetowych-wordpress` },
  { label: "Migracja strony internetowej", href: `${SITE}/produkt/migracja-strony-internetowej-na-inny-serwer/` },
  { label: "Przywracanie strony po infekcji", href: `${SITE}/produkt/przywracanie-strony-internetowej-wordpress/` },
  { label: "Wycena strony internetowej", href: `${SITE}/produkt/wycena-strony-internetowej/` },
  { label: "SEO — optymalizacja strony", href: `${SITE}/produkt/seo-optymalizacja-strony/` },
  { label: "Pozycjonowanie SEO", href: `${SITE}/pozycjonowanie-seo` },
  { label: "Obsługa mediów społecznościowych", href: `${SITE}/produkt/obsluga-mediow-spolecznosciowych/` },
  { label: "Monitoring i kamery Kołobrzeg", href: `${SITE}/monitoring-i-kamery-kolobrzeg` },
  { label: "Opieka IT dla firm Kołobrzeg", href: `${SITE}/opieka-it-dla-firm-kolobrzeg` },
  { label: "Informatyk Kołobrzeg", href: `${SITE}/informatyk-kolobrzeg` },
  { label: "Informatyk Koszalin", href: `${SITE}/informatyk-koszalin` },
];

export const ODART_SERVICES_EN: OdartServiceItem[] = [
  { label: "All services", href: ODART_ENGLISH_SERVICES_INDEX },
  { label: "Custom web applications", href: getEnglishServiceHref("custom-web-applications") },
  { label: "Business panels and systems", href: getEnglishServiceHref("business-panels-and-systems") },
  { label: "API integrations and automation", href: getEnglishServiceHref("api-integrations-and-automation") },
  { label: "Business websites", href: getEnglishServiceHref("business-websites") },
  { label: "Website from PLN 1500", href: getEnglishServiceHref("website-from-pln-1500") },
  { label: "WordPress websites", href: getEnglishServiceHref("wordpress-websites") },
  { label: "WordPress administration", href: getEnglishServiceHref("wordpress-administration") },
  { label: "Website migration", href: getEnglishServiceHref("website-migration") },
  { label: "Website recovery after infection", href: getEnglishServiceHref("website-recovery-after-infection") },
  { label: "Website pricing estimate", href: getEnglishServiceHref("website-pricing-estimate") },
  { label: "SEO optimization", href: getEnglishServiceHref("seo-optimization") },
  { label: "SEO positioning", href: getEnglishServiceHref("seo-positioning") },
  { label: "Social media support", href: getEnglishServiceHref("social-media-support") },
  { label: "CCTV and monitoring in Kolobrzeg", href: getEnglishServiceHref("cctv-monitoring-kolobrzeg") },
  { label: "IT support for companies", href: getEnglishServiceHref("it-support-for-companies") },
  { label: "IT specialist Kolobrzeg", href: getEnglishServiceHref("it-specialist-kolobrzeg") },
  { label: "IT specialist Koszalin", href: getEnglishServiceHref("it-specialist-koszalin") },
];

export const ODART_NAV = [
  { label: "Home", href: `${SITE}/`, key: "home" as const },
  { label: "O mnie", href: `${SITE}/o-mnie/`, key: "o-mnie" as const },
  { label: "Usługi", href: `${SITE}/uslugi/`, key: "uslugi" as const },
  { label: "Portfolio", href: ODART_PORTFOLIO_URL, key: "portfolio" as const },
  { label: "Blog", href: ODART_BLOG_URL, key: "blog" as const },
  { label: "Kontakt", href: `${SITE}/kontakt/`, key: "kontakt" as const },
] as const;

export type OdartNavKey = (typeof ODART_NAV)[number]["key"];

export const ODART_NAV_EN: OdartNavItem[] = [
  { label: "Home", href: `${EN_SITE}/`, key: "home" },
  { label: "About", href: `${EN_SITE}/#about`, key: "o-mnie" },
  { label: "Services", href: `${EN_SITE}/services`, key: "uslugi" },
  { label: "Portfolio", href: `${EN_SITE}/#portfolio`, key: "portfolio" },
  { label: "Blog", href: ODART_BLOG_URL, key: "blog" },
  { label: "Contact", href: `${EN_SITE}/#contact`, key: "kontakt" },
];

export function getOdartNav(locale: OdartLocale = "pl"): readonly OdartNavItem[] {
  return locale === "en" ? ODART_NAV_EN : ODART_NAV;
}

export function getOdartServices(locale: OdartLocale = "pl"): readonly OdartServiceItem[] {
  return locale === "en" ? ODART_SERVICES_EN : ODART_SERVICES;
}

/** Menu główne — publiczne URL-e legacy (GSC) na rafalkowalkowski.pl. */
export function getRafalKowalkowskiNav(): readonly OdartNavItem[] {
  return [
    { label: "Home", href: "/", key: "home" },
    { label: "O mnie", href: "/#about", key: "o-mnie" },
    { label: "Usługi", href: rafalPublicHref(RAFAL_KOWALKOWSKI_USLUGI_PATH), key: "uslugi" },
    { label: "Portfolio", href: rafalPublicHref(RAFAL_KOWALKOWSKI_GALLERY_PATH), key: "portfolio" },
    { label: "Blog", href: "/blog/", key: "blog" },
    { label: "Kontakt", href: "/kontakt/", key: "kontakt" },
  ];
}

export function getRafalKowalkowskiNavEn(): readonly OdartNavItem[] {
  return getRafalKowalkowskiNav();
}

/** Dropdown „Usługi” — `/produkt/…` i katalog (jak w WooCommerce). */
export function getRafalKowalkowskiServices(): readonly OdartServiceItem[] {
  const first: OdartServiceItem = {
    label: "Wszystkie usługi",
    href: rafalPublicHref(RAFAL_KOWALKOWSKI_USLUGI_PATH),
  };
  const rest = RAFAL_KOWALKOWSKI_SERVICES.filter((s): s is (typeof s & { detailHref: string }) =>
    Boolean(s.detailHref),
  ).map((s) => ({ label: s.title, href: rafalPublicHref(s.detailHref) }));
  return [first, ...rest];
}

/** Realizacje wideo w menu stopki na domenie Rafała. */
export function getRafalKowalkowskiProjectsHref(): string {
  return rafalPublicHref(RAFAL_KOWALKOWSKI_TELEDYSKI_PATH);
}
