"use client";

import { useClinicData } from "@/contexts/ClinicDataContext";

export function ClinicEffects() {
  const { effects } = useClinicData();
  const sectionEnabled = (effects as { enabled?: boolean }).enabled !== false;
  if (!sectionEnabled) return null;

  return (
    <section className="border-b border-neutral-200/60 bg-white py-10 lg:py-14">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-[var(--font-serif)] text-xl font-normal text-[#1F1A1C] sm:text-2xl">
          {effects.title}
        </h2>
        <p className="mt-1 font-[var(--font-sans)] text-[14px] text-[#6F5E64]">
          {effects.subtitle}
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {effects.cards.map((card, i) => (
            <div
              key={i}
              className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-5"
            >
              <p className="font-[var(--font-sans)] text-[13px] font-medium uppercase tracking-wide text-[#6F5E64]">
                {card.problem}
              </p>
              <p className="mt-1 font-[var(--font-sans)] text-[15px] font-semibold text-[#1F1A1C]">
                {card.terapia}
              </p>
              <p className="mt-1 font-[var(--font-sans)] text-[14px] text-[#6F5E64]">
                {card.wizyty} → {card.efekt}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
