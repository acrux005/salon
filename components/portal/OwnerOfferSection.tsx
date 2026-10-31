"use client";

import Link from "next/link";
import { SalonWebsiteDevicesMockup } from "./SalonWebsiteDevicesMockup";

const WWW_DEMO = "/przyklady-stron";
const WWW_OFFER = "/strona-internetowa-dla-gabinetu-kosmetycznego";

const PROFILE_FEATURES = [
  "Profil publiczny z usługami, zdjęciami i kontaktem",
  "Cennik zabiegów oraz godziny pracy",
  "Kalendarz rezerwacji online (opcjonalnie)",
  "Wiadomości od klientek w jednym miejscu",
  "Pracownicy, terminy i podgabinety",
  "Przypomnienia o wizycie i prośby o opinię",
] as const;

/** Oferta dla właścicieli: profil w portalu + strona WWW. */
export function OwnerOfferSection() {
  return (
    <section
      id="dla-salonow"
      className="border-b border-neutral-200/40 py-16 lg:py-24"
      style={{ background: "#F7F4F6" }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center font-[var(--font-serif)] text-2xl font-normal text-[#1F1A1C] sm:text-3xl">
          Prowadzisz salon beauty? Zadbaj o jego obecność w internecie
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center font-[var(--font-sans)] text-[15px] text-[#6F5E64]">
          Uzupełnij profil w Salon Odart lub poznaj ofertę własnej strony internetowej.
        </p>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <article className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
            <h3 className="font-[var(--font-sans)] text-lg font-semibold text-[#1F1A1C]">
              Bezpłatny profil w portalu
            </h3>
            <p className="mt-3 font-[var(--font-sans)] text-[15px] leading-relaxed text-[#6F5E64]">
              Pokaż usługi, zdjęcia i dane kontaktowe. Jeśli Twój salon jest już w katalogu, przejmij
              jego profil i uzupełnij informacje.
            </p>
            <ul className="mt-5 flex-1 space-y-2.5">
              {PROFILE_FEATURES.map((item) => (
                <li
                  key={item}
                  className="flex gap-2.5 font-[var(--font-sans)] text-[14px] leading-snug text-[#4a3f42]"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-pink-500" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
              <Link
                href="/portal/dodaj-salon"
                className="inline-flex rounded-full bg-pink-500 px-5 py-3 font-[var(--font-sans)] text-[14px] font-medium text-white hover:bg-pink-600"
              >
                Dodaj lub przejmij profil
              </Link>
              <Link
                href="/portal/dla-salonow"
                className="font-[var(--font-sans)] text-[14px] font-medium text-pink-600 hover:underline"
              >
                Wszystkie funkcje →
              </Link>
            </div>
          </article>

          <article className="flex flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
            <div className="relative aspect-[16/9]" role="img" aria-label="Przykład strony salonu na komputerze i telefonie">
              <SalonWebsiteDevicesMockup />
            </div>
            <div className="flex flex-1 flex-col p-6 sm:p-8">
              <h3 className="font-[var(--font-sans)] text-lg font-semibold text-[#1F1A1C]">
                Własna strona internetowa
              </h3>
              <p className="mt-3 flex-1 font-[var(--font-sans)] text-[15px] leading-relaxed text-[#6F5E64]">
                Zaprezentuj swoją markę na stronie z ofertą, cennikiem, galerią i kontaktem. Poznaj
                zakres realizacji i cenę.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={WWW_OFFER}
                  className="inline-flex rounded-full bg-[#1F1A1C] px-5 py-3 font-[var(--font-sans)] text-[14px] font-medium text-white hover:bg-neutral-800"
                >
                  Zobacz ofertę stron WWW
                </Link>
                <Link
                  href={WWW_DEMO}
                  className="inline-flex rounded-full border border-neutral-300 px-5 py-3 font-[var(--font-sans)] text-[14px] font-medium text-[#1F1A1C] hover:border-pink-300 hover:bg-pink-50/50"
                >
                  Przykłady stron
                </Link>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
