"use client";

import { clinicDemo } from "@/content/clinicDemo";

export function ClinicFirstVisit() {
  const { firstVisit } = clinicDemo;
  return (
    <section className="border-b border-neutral-200/60 bg-white py-14 lg:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center font-[var(--font-serif)] text-2xl font-normal text-[#1F1A1C] sm:text-3xl">
          {firstVisit.title}
        </h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {firstVisit.steps.map((step, i) => (
            <div key={i} className="relative">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-pink-100 font-[var(--font-sans)] text-lg font-semibold text-pink-600">
                {i + 1}
              </span>
              <h3 className="mt-4 font-[var(--font-sans)] text-[17px] font-semibold text-[#1F1A1C]">
                {step.title}
              </h3>
              <p className="mt-2 font-[var(--font-sans)] text-[14px] leading-relaxed text-[#6F5E64]">
                {step.description}
              </p>
              {i < firstVisit.steps.length - 1 && (
                <div className="absolute -right-4 top-5 hidden h-0.5 w-8 bg-neutral-200 lg:block" aria-hidden />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
