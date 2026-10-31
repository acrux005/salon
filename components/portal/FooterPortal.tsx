"use client";

import Link from "next/link";
import { PORTAL_LOCALE } from "@/content/portalLocale";
import { FOOTER_PORTAL_CITIES } from "@/content/portalCities";

const LINK_CLASS =
  "font-[var(--font-sans)] text-[14px] text-[#5F5F68] transition-colors hover:text-[#DE1F40] hover:underline underline-offset-2 decoration-[#DE1F40]/60";

const COLUMN_HEADING_CLASS =
  "font-[var(--font-sans)] text-[13px] font-semibold uppercase tracking-[0.1em] text-[#1F1F1F]";

export function FooterPortal() {
  return (
    <footer className="border-t border-neutral-200/60 py-12 lg:py-14" style={{ background: "#F4F4F8" }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* 4 kolumny: opis · dla klienta · dla gabinetów · miasta */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* 1. Lewa kolumna – opis produktu */}
          <div className="sm:col-span-2 lg:col-span-1 lg:max-w-[280px]">
            <p className="font-[var(--font-serif)] text-lg font-medium text-[#1F1A1C]">
              Salon Odart
            </p>
            <p className="mt-3 font-[var(--font-sans)] text-[14px] leading-[1.6] text-[#6C6C75]">
              Salon Odart to portal gabinetów i usług beauty. Klientom ułatwiamy znalezienie salonu,
              a właścicielom oferujemy profile w portalu i tworzenie własnych stron internetowych.
            </p>
          </div>

          {/* 2. Dla klienta */}
          <div>
            <h3 className={COLUMN_HEADING_CLASS}>
              Dla klienta
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link href="/portal#analiza" className={LINK_CLASS}>
                  Analiza skóry
                </Link>
              </li>
              <li>
                <Link href="/portal/gabinety" className={LINK_CLASS}>
                  Znajdź salon
                </Link>
              </li>
              <li>
                <Link href="/portal#uslugi" className={LINK_CLASS}>
                  Usługi
                </Link>
              </li>
              <li>
                <Link href="/portal/artykuly" className={LINK_CLASS}>
                  Poradnik beauty
                </Link>
              </li>
              <li>
                <Link href="/portal/faq" className={LINK_CLASS}>
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Dla salonów */}
          <div>
            <h3 className={COLUMN_HEADING_CLASS}>
              Dla salonów
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link href="/portal/dodaj-salon" className={LINK_CLASS}>
                  Dodaj lub przejmij profil
                </Link>
              </li>
              <li>
                <Link href="/strona-internetowa-dla-gabinetu-kosmetycznego" className={LINK_CLASS}>
                  Strona WWW dla salonu
                </Link>
              </li>
              <li>
                <Link href="/przyklady-stron" className={LINK_CLASS}>
                  Przykłady stron WWW
                </Link>
              </li>
              <li>
                <Link href="/strona-kosmetyczki" className={LINK_CLASS}>
                  Demo: gabinet kosmetyczny
                </Link>
              </li>
              <li>
                <Link href="/strona-internetowa-dla-kosmetyczek" className={LINK_CLASS}>
                  Strona dla kosmetyczek
                </Link>
              </li>
              <li>
                <Link href="/portal/dla-salonow" className={LINK_CLASS}>
                  Funkcje panelu
                </Link>
              </li>
              <li>
                <Link href="/portal/dla-gabinetow" className={LINK_CLASS}>
                  Jak działa współpraca
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className={LINK_CLASS}>
                  Kontakt biznesowy
                </Link>
              </li>
              <li>
                <Link href="/regulamin-wspolpracy" className={LINK_CLASS}>
                  Regulamin współpracy
                </Link>
              </li>
            </ul>
          </div>

          {/* 4. Miasta – SEO */}
          <div>
            <h3 className={COLUMN_HEADING_CLASS}>
              Miasta
            </h3>
            <ul className="mt-4 space-y-2.5">
              {FOOTER_PORTAL_CITIES.map(({ slug, name }) => (
                <li key={slug}>
                  <Link href={`/portal/gabinety/${slug}`} className={LINK_CLASS}>
                    Gabinet kosmetyczny {name}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/portal/gabinety" className={`${LINK_CLASS} mt-3 inline-block text-[13px]`}>
              Wszystkie miasta →
            </Link>
          </div>
        </div>

        {/* Dolna belka: legal + micro copy */}
        <div
          className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          style={{ borderTop: "1px solid rgba(0,0,0,0.05)", paddingTop: "24px", marginTop: "32px" }}
        >
          <div>
            <p className="font-[var(--font-sans)] text-[13px] text-[#5F5F68]">
              © 2026 Salon Odart – gabinety i usługi beauty w {PORTAL_LOCALE.regionIn}
            </p>
            <p className="mt-1 font-[var(--font-sans)] text-[12px] text-[#5F5F68]">
              <a href="https://zaamow.pl" className={LINK_CLASS}>
                Strony WWW: zaamow.pl
              </a>
            </p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-1">
            <Link href="/regulamin" className={LINK_CLASS}>
              Regulamin
            </Link>
            <Link href="/polityka-prywatnosci" className={LINK_CLASS}>
              Polityka prywatności
            </Link>
            <Link href="/polityka-cookies" className={LINK_CLASS}>
              Polityka cookies
            </Link>
            <Link href="/regulamin-wspolpracy" className={LINK_CLASS}>
              Regulamin współpracy
            </Link>
            <Link href="/kontakt" className={LINK_CLASS}>
              Kontakt
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
