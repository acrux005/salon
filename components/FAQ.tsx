"use client";

import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Czy zabieg boli?",
    a: "Większość zabiegów jest bezbolesna lub powoduje jedynie lekkie uczucie mrowienia. W razie potrzeby stosujemy znieczulenie miejscowe.",
  },
  {
    q: "Ile trwa regeneracja?",
    a: "Zależy od zabiegu — od kilku godzin do 3–5 dni. Na konsultacji omówimy dokładnie, czego się spodziewać.",
  },
  {
    q: "Czy efekty są trwałe?",
    a: "Część zabiegów daje efekty długoterminowe, inne wymagają serii podtrzymujących. Plan terapii dopasowujemy indywidualnie.",
  },
  {
    q: "Czy mogę wrócić do pracy po zabiegu?",
    a: "Tak — większość zabiegów nie wyklucza powrotu do codziennych aktywności. Wyjątki omawiamy przed zabiegiem.",
  },
  {
    q: "Czy konsultacja jest obowiązkowa?",
    a: "Tak. Pierwsza wizyta to zawsze konsultacja — bez zabiegu. Dopiero po analizie skóry i Twojej zgodzie planujemy dalsze kroki.",
  },
];

export function FAQ() {
  return (
    <section className="border-t border-neutral-200/60 bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <h2 className="font-[var(--font-serif)] text-2xl font-normal text-[#1F1A1C] sm:text-3xl lg:text-4xl">
            Najczęstsze pytania
          </h2>
          <p className="mt-3 text-[15px] text-[#6F5E64] leading-relaxed">
            Tu zamykasz sprzedaż — odpowiadasz na obiekcje
          </p>
        </header>

        <div className="space-y-3">
          {faqs.map(({ q, a }) => (
            <details
              key={q}
              className="group rounded-xl border border-pink-100 bg-white transition-colors hover:border-pink-200"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left font-[var(--font-sans)] text-[15px] font-medium text-[#1F1A1C]">
                {q}
                <ChevronDown className="h-5 w-5 shrink-0 text-pink-400 transition-transform group-open:rotate-180" />
              </summary>
              <div className="border-t border-pink-50 px-5 py-4">
                <p className="font-[var(--font-sans)] text-[14px] leading-relaxed text-[#6F5E64]">
                  {a}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
