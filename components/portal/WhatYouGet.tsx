"use client";

import { Check } from "lucide-react";
import { PORTAL_LOCALE } from "@/content/portalLocale";

const BENEFITS = [
  "Jasną rekomendację – bez przeglądania dziesiątek ofert",
  "Informację, ile wizyt będzie potrzebnych",
  "Wskazówki, czego unikać na początku terapii",
  `Sprawdzone gabinety w ${PORTAL_LOCALE.regionIn} dopasowane do Twojego przypadku`,
  "Możliwość szybkiej rezerwacji bez dzwonienia po 5 miejscach",
];

export function WhatYouGet() {
  return (
    <section
      className="border-b border-neutral-200/40 py-16 lg:py-20"
      style={{ background: "#FAFAFC" }}
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center font-[var(--font-serif)] text-xl font-normal text-[#1F1A1C] sm:text-2xl">
          Co realnie dostajesz?
        </h2>
        <ul className="mt-8 space-y-4 font-[var(--font-sans)] text-[15px] leading-relaxed text-[#4a3f42]">
          {BENEFITS.map((text) => (
            <li key={text} className="flex items-start gap-3">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-[#DE1F40]" aria-hidden />
              <span>{text}</span>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-center font-[var(--font-sans)] text-[15px] text-[#6F5E64]">
          Nie pokazujemy wszystkiego.
          <br />
          Pokazujemy to, co ma sens dla Ciebie.
        </p>
      </div>
    </section>
  );
}
