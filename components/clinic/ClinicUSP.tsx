"use client";

import { clinicDemo } from "@/content/clinicDemo";

export function ClinicUSP() {
  const { usp } = clinicDemo;
  return (
    <section className="border-b border-neutral-200/60 bg-white py-14 lg:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {usp.items.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-neutral-200/80 bg-neutral-50/50 p-6 text-center transition-shadow hover:shadow-md"
            >
              <h3 className="font-[var(--font-sans)] text-[17px] font-semibold text-[#1F1A1C]">
                {item.title}
              </h3>
              <p className="mt-2 font-[var(--font-sans)] text-[14px] text-[#6F5E64]">
                {item.short}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
