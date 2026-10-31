import { Suspense } from "react";
import Link from "next/link";
import { headers } from "next/headers";
import { Waves } from "lucide-react";
import {
  ODART_SITE_URL,
  ODART_PORTFOLIO_URL,
  ODART_MARKETING_ORIGIN,
  isRafalKowalkowskiPlHost,
} from "@/lib/odartSite";
import type { OdartLocale, OdartNavKey } from "@/components/odart/odartNav";
import { getRafalKowalkowskiProjectsHref } from "@/components/odart/odartNav";
import {
  RAFAL_KOWALKOWSKI_GALLERY_PATH,
  RAFAL_KOWALKOWSKI_USLUGI_PATH,
} from "@/lib/rafalKowalkowskiGallery";
import { rafalPublicHref } from "@/lib/rafalKowalkowskiLegacyRoutes";
import { OdartResponsiveNav } from "@/components/odart/OdartResponsiveNav";
import { AppHubStripGate } from "@/components/odart/AppHubStripGate";

const SITE = ODART_SITE_URL;

type Props = {
  children: React.ReactNode;
  /** Podświetlenie pozycji menu (dopasowanie po `key`). */
  activeNav?: OdartNavKey;
  /** Opcjonalny JSON-LD (strona główna / podstrony). */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  locale?: OdartLocale;
};

const COPY = {
  pl: {
    location: "Kołobrzeg",
    footerTitle: "Strony internetowe",
    footerLead: "Napisz na biuro@odart.pl. Odpowiadam zwykle tego samego dnia.",
    about: "O mnie",
    projects: "Realizacje",
    portfolio: "Portfolio",
    contact: "Kontakt",
    services: "Usługi",
    privacy: "Polityka prywatności",
    terms: "Regulamin",
    developerPage: "Strona dla dewelopera",
    websites: "Strony internetowe",
    itCare: "Opieka IT dla firm Kołobrzeg",
    zaamow: "zaamow.pl",
    zaamowDomains: "Domeny .pl",
    zaamowMail: "Poczta firmowa",
    zaamowSites: "Strony WWW",
    zaamowApps: "Aplikacje",
    rights: "Wszelkie prawa zastrzeżone",
    polish: "PL",
    english: "EN",
  },
  en: {
    location: "Kolobrzeg, Poland",
    footerTitle: "Websites and web applications",
    footerLead: "Leave your email address - I will reply as soon as possible.",
    about: "About",
    projects: "Projects",
    portfolio: "Portfolio",
    contact: "Contact",
    services: "Services",
    privacy: "Privacy policy",
    terms: "Terms",
    developerPage: "Real estate developer website",
    websites: "Business websites",
    itCare: "IT support for companies",
    zaamow: "zaamow.pl",
    zaamowDomains: ".pl domains",
    zaamowMail: "Business email",
    zaamowSites: "Websites",
    zaamowApps: "Apps",
    rights: "All Rights Reserved",
    polish: "PL",
    english: "EN",
  },
} as const;

export function OdartPublicShell({ children, activeNav, jsonLd, locale = "pl" }: Props) {
  const copy = COPY[locale];
  const host = headers().get("host") ?? "";
  const isRafalShell = isRafalKowalkowskiPlHost(host);
  const marketing = ODART_MARKETING_ORIGIN;
  const enHref = isRafalShell ? `${marketing}/en/` : `${SITE}/en/`;
  const plHref = isRafalShell ? "/" : `${SITE}/`;
  const logoHref = isRafalShell ? "/" : `${SITE}/`;

  return (
    <>
      {jsonLd != null ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}
      <div className="min-h-screen bg-black text-neutral-200">
        <Suspense fallback={null}>
          <AppHubStripGate locale={locale} />
        </Suspense>
        <div className="border-b border-white/10 bg-neutral-950 px-4 py-2 text-center text-xs text-neutral-400 sm:text-left">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-1 sm:justify-between">
            <span>{copy.location}</span>
            <a href="mailto:biuro@odart.pl" className="text-odart-accent hover:text-orange-300">
              biuro@odart.pl
            </a>
            <a href="tel:+48695432415" className="hover:text-white">
              +48 695 432 415
            </a>
          </div>
        </div>

        <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 lg:px-6">
            <Link href={logoHref} className="flex shrink-0 items-center gap-2">
              <Waves className="h-8 w-8 text-odart-accent" aria-hidden />
              <span className="text-xl font-semibold text-white">ODART</span>
            </Link>
            <div className="flex min-w-0 flex-1 items-center justify-end gap-3">
              <OdartResponsiveNav
                activeNav={activeNav}
                locale={locale}
                profileNavVariant={isRafalShell ? "rafal" : "odart"}
              />
              <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1 text-xs font-semibold text-neutral-400 sm:flex">
                <Link
                  href={plHref}
                  className={`rounded-full px-2.5 py-1 transition ${
                    locale === "pl" ? "bg-white text-black" : "hover:text-white"
                  }`}
                  aria-current={locale === "pl" ? "page" : undefined}
                >
                  {copy.polish}
                </Link>
                <Link
                  href={enHref}
                  className={`rounded-full px-2.5 py-1 transition ${
                    locale === "en" ? "bg-white text-black" : "hover:text-white"
                  }`}
                  aria-current={locale === "en" ? "page" : undefined}
                >
                  {copy.english}
                </Link>
              </div>
            </div>
          </div>
        </header>

        {children}

        <footer className="border-t border-white/10 bg-neutral-950 px-4 py-14 lg:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-10 md:grid-cols-3">
              <div>
                <p className="font-semibold text-white">{copy.footerTitle}</p>
                <p className="mt-3 text-sm text-neutral-500">
                  {copy.footerLead}
                </p>
                <a
                  href="mailto:biuro@odart.pl"
                  className="mt-4 inline-block text-sm text-odart-accent hover:text-orange-300"
                >
                  biuro@odart.pl
                </a>
              </div>
              <div className="flex flex-col gap-2 text-sm text-neutral-400">
                <Link
                  href={
                    isRafalShell
                      ? "/#about"
                      : locale === "en"
                        ? `${SITE}/en/#about`
                        : `${SITE}/o-mnie/`
                  }
                  className="hover:text-white"
                >
                  {copy.about}
                </Link>
                <Link href={isRafalShell ? "/blog/" : `${SITE}/blog/`} className="hover:text-white">
                  Blog
                </Link>
                <Link
                  href={isRafalShell ? getRafalKowalkowskiProjectsHref() : `${SITE}/blog/realizacje/`}
                  className="hover:text-white"
                >
                  {copy.projects}
                </Link>
                <Link
                  href={isRafalShell ? rafalPublicHref(RAFAL_KOWALKOWSKI_GALLERY_PATH) : ODART_PORTFOLIO_URL}
                  className="hover:text-white"
                >
                  {copy.portfolio}
                </Link>
                <Link
                  href={
                    isRafalShell
                      ? "/kontakt/"
                      : locale === "en"
                        ? `${SITE}/en/#contact`
                        : `${SITE}/kontakt/`
                  }
                  className="hover:text-white"
                >
                  {copy.contact}
                </Link>
                <Link
                  href={
                    isRafalShell
                      ? rafalPublicHref(RAFAL_KOWALKOWSKI_USLUGI_PATH)
                      : locale === "en"
                        ? `${SITE}/en/services/`
                        : `${SITE}/uslugi/`
                  }
                  className="hover:text-white"
                >
                  {copy.services}
                </Link>
              </div>
              <div className="flex flex-col gap-2 text-sm text-neutral-400">
                <Link href={`${marketing}/polityka-prywatnosci/`} className="hover:text-white">
                  {copy.privacy}
                </Link>
                <Link href={`${marketing}/regulamin/`} className="hover:text-white">
                  {copy.terms}
                </Link>
                <Link href={`${marketing}/project/strona-dla-dewelopera/`} className="hover:text-white">
                  {copy.developerPage}
                </Link>
                <Link href={`${marketing}/strony-internetowe/`} className="hover:text-white">
                  {copy.websites}
                </Link>
                <Link href={`${marketing}/opieka-it-dla-firm-kolobrzeg/`} className="hover:text-white">
                  {copy.itCare}
                </Link>
                <Link href={`${marketing}/zaamow/`} className="hover:text-white">
                  {copy.zaamow}
                </Link>
                <a href="https://zaamow.pl/domeny" className="hover:text-white" rel="noopener noreferrer">
                  {copy.zaamowDomains}
                </a>
                <a href="https://zaamow.pl/poczta" className="hover:text-white" rel="noopener noreferrer">
                  {copy.zaamowMail}
                </a>
                <a href="https://zaamow.pl/strony" className="hover:text-white" rel="noopener noreferrer">
                  {copy.zaamowSites}
                </a>
                <a href="https://zaamow.pl/aplikacje" className="hover:text-white" rel="noopener noreferrer">
                  {copy.zaamowApps}
                </a>
              </div>
            </div>
            <div className="mt-10 flex flex-wrap gap-6 border-t border-white/10 pt-8 text-sm text-neutral-600">
              <span>© {new Date().getFullYear()} ODART | {copy.rights}</span>
              <span>{copy.location} · biuro@odart.pl · +48 695 432 415</span>
              <a
                href="https://zaamow.pl"
                className="text-neutral-500 hover:text-odart-accent"
                rel="noopener noreferrer"
              >
                {copy.zaamow}
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
