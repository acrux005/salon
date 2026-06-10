"use client";

import Link from "next/link";
import { clinicDemo } from "@/content/clinicDemo";

export function ClinicProblems() {
  const { problems } = clinicDemo;
  return (
    <section className="border-b border-neutral-200/60 bg-neutral-50/30 py-14 lg:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center font-[var(--font-serif)] text-2xl font-normal text-[#1F1A1C] sm:text-3xl">
          {problems.title}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center font-[var(--font-sans)] text-[15px] text-[#6F5E64]">
          {problems.subtitle}
        </p>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
          {problems.cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="flex min-h-[100px] items-center justify-center rounded-2xl border border-pink-200/60 bg-white px-6 py-8 text-center font-[var(--font-sans)] text-[15px] font-medium text-[#1F1A1C] transition-all hover:border-pink-400/80 hover:bg-pink-50/50 hover:shadow-md"
            >
              {card.title}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
