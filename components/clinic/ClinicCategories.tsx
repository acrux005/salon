"use client";

import Link from "next/link";
import { clinicDemo } from "@/content/clinicDemo";

export function ClinicCategories() {
  const { categories } = clinicDemo;
  return (
    <section className="border-b border-neutral-200/60 bg-neutral-50/30 py-14 lg:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center font-[var(--font-serif)] text-2xl font-normal text-[#1F1A1C] sm:text-3xl">
          {categories.title}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center font-[var(--font-sans)] text-[15px] text-[#6F5E64]">
          {categories.subtitle}
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {categories.cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group rounded-2xl border border-pink-200/60 bg-white p-8 text-center shadow-sm transition-all hover:border-pink-300 hover:shadow-md"
            >
              <h3 className="font-[var(--font-sans)] text-[18px] font-semibold text-[#1F1A1C] group-hover:text-pink-600">
                {card.title}
              </h3>
              <p className="mt-2 font-[var(--font-sans)] text-[14px] text-[#6F5E64]">
                {card.description}
              </p>
              <span className="mt-4 inline-block font-[var(--font-sans)] text-[14px] font-medium text-pink-600">
                {card.cta}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
