"use client";

import Link from "next/link";
import { PORTAL_LOCALE } from "@/content/portalLocale";

const POINTS = [
  "Leady kwalifikowane — problem lub usługa + budżet + lokalizacja",
  "Bez wojny cenowej — dopasowanie jakości, nie cennik",
  "Twoja specjalizacja = wyższa widoczność w wynikach",
];

export function ForClinics() {
  return (
    <section
      id="dla-gabinetow"
      className="border-t border-neutral-200/60 py-20 lg:py-28"
      style={{ background: "#F4F4F7" }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-4 text-center font-[var(--font-serif)] text-[1.65rem] font-normal text-[#1F1F1F] sm:text-[2.06rem]">
          Pokażemy Ci klientki z {PORTAL_LOCALE.regionFrom}, które już wiedzą czego chcą.
        </h2>
        <ul className="mx-auto mb-12 max-w-lg space-y-4">
          {POINTS.map((text) => (
            <li
              key={text}
              className="flex items-start gap-3 font-[var(--font-sans)] text-[15px] font-medium leading-loose text-[#2d2629]"
            >
              <span
                className="mt-2 h-2 w-2 shrink-0 rounded-full bg-pink-400"
                aria-hidden
              />
              {text}
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/portal/register"
            className="rounded-full border border-pink-400 bg-white px-6 py-3 font-[var(--font-sans)] text-[15px] font-medium text-pink-600 transition-all hover:bg-pink-600 hover:text-white hover:border-pink-600"
          >
            Dołącz gabinet
          </Link>
          <Link
            href="/portal/dla-gabinetow"
            className="rounded-full border border-neutral-300 px-5 py-3 font-[var(--font-sans)] text-[14px] font-medium text-[#6F5E64] transition-colors hover:border-pink-200 hover:bg-pink-50 hover:text-pink-600"
          >
            Jak działa współpraca
          </Link>
        </div>
      </div>
    </section>
  );
}
