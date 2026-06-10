"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useClinicData } from "@/contexts/ClinicDataContext";

export function ClinicFAQ() {
  const { faq } = useClinicData();
  const sectionEnabled = (faq as { enabled?: boolean }).enabled !== false;
  if (!sectionEnabled) return null;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="border-b border-neutral-200/60 bg-white py-14 lg:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center font-[var(--font-serif)] text-2xl font-normal text-[#1F1A1C] sm:text-3xl">
          {faq.title}
        </h2>
        <div className="mt-10 space-y-2">
          {faq.items.map((item, i) => (
            <div key={i} className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between px-5 py-4 text-left font-[var(--font-sans)] text-[15px] font-medium text-[#1F1A1C] hover:bg-neutral-50"
                aria-expanded={openIndex === i}
              >
                {item.question}
                <ChevronDown className={"h-5 w-5 shrink-0 text-neutral-400 transition-transform " + (openIndex === i ? "rotate-180" : "")} />
              </button>
              {openIndex === i && (
                <div className="border-t border-neutral-100 px-5 py-4">
                  <p className="font-[var(--font-sans)] text-[14px] leading-relaxed text-[#6F5E64]">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
