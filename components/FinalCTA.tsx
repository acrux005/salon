"use client";

import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="border-t border-neutral-200/60 bg-gradient-to-b from-white to-pink-50/30 py-20 lg:py-28">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="font-[var(--font-serif)] text-2xl font-normal text-[#1F1A1C] sm:text-3xl lg:text-4xl">
          Zacznij od konsultacji — nie od zabiegu
        </h2>
        <p className="mt-4 font-[var(--font-sans)] text-[16px] leading-relaxed text-[#6F5E64]">
          Umów wizytę online lub zadzwoń — pierwsza konsultacja to Twój krok do
          zdrowej, zadbanej skóry.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="https://salon.odart.pl/panel-umawiania/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 rounded-full bg-[#e7a7b4] px-8 py-4 font-[var(--font-sans)] text-[15px] font-medium text-white shadow-lg shadow-pink-200/60 transition-colors hover:bg-[#de8fa0]"
          >
            Umów wizytę
            <ArrowRight className="h-5 w-5" strokeWidth={2} />
          </Link>
          <a
            href="tel:+48123456789"
            className="inline-flex items-center gap-2 font-[var(--font-sans)] text-[15px] font-medium text-[#6F5E64] hover:text-pink-600"
          >
            <Phone className="h-5 w-5" strokeWidth={2} />
            Rezerwacja telefoniczna
          </a>
        </div>
      </div>
    </section>
  );
}
