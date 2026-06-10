"use client";

import { ClipboardList, Search, FileText, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    title: "Konsultacja i wywiad",
    desc: "Opowiesz o skórze, celach i oczekiwaniach",
  },
  {
    icon: Search,
    title: "Diagnostyka skóry",
    desc: "Analiza stanu skóry i dopasowanie terapii",
  },
  {
    icon: FileText,
    title: "Plan terapii",
    desc: "Indywidualny harmonogram zabiegów",
  },
  {
    icon: CheckCircle,
    title: "Decyzja o zabiegu",
    desc: "Ty decydujesz — bez presji i zobowiązań",
  },
];

export function FirstVisit() {
  return (
    <section className="border-t border-neutral-200/60 bg-gradient-to-b from-white to-neutral-50/50 py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mb-14 text-center">
          <h2 className="font-[var(--font-serif)] text-2xl font-normal text-[#1F1A1C] sm:text-3xl lg:text-4xl">
            Jak wygląda pierwsza wizyta
          </h2>
          <p className="mt-3 max-w-xl mx-auto text-[15px] text-[#6F5E64] leading-relaxed">
            Każdy pacjent przechodzi przez te same etapy — nic nieznanego
          </p>
        </header>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ icon: Icon, title, desc }, i) => (
            <div
              key={title}
              className="relative flex flex-col items-center rounded-2xl border border-pink-100 bg-white p-6 text-center shadow-sm"
            >
              {i < steps.length - 1 && (
                <div
                  className="absolute top-1/2 -right-4 hidden h-px w-8 bg-pink-200/60 lg:block"
                  aria-hidden
                />
              )}
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-pink-200 bg-pink-50/50">
                <Icon className="h-7 w-7 text-pink-500" strokeWidth={1.5} />
              </div>
              <h3 className="font-[var(--font-sans)] text-[15px] font-semibold text-[#1F1A1C]">
                {title}
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-[#6F5E64]">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
