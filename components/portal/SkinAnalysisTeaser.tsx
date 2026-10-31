"use client";

import Link from "next/link";
import { usePortalQuiz } from "./PortalQuizContext";

/** Krótki blok analizy skóry — bez fake’owych terminów i placeholderów. */
export function SkinAnalysisTeaser() {
  const { openModal } = usePortalQuiz();

  return (
    <section
      id="analiza"
      className="border-b border-neutral-200/40 bg-white py-16 lg:py-20"
    >
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="font-[var(--font-serif)] text-2xl font-normal text-[#1F1A1C] sm:text-3xl">
          Potrzebujesz pomocy w wyborze zabiegu?
        </h2>
        <p className="mt-4 font-[var(--font-sans)] text-[15px] leading-relaxed text-[#6F5E64]">
          Odpowiedz na kilka pytań o potrzeby swojej skóry i poznaj propozycje, które możesz omówić
          ze specjalistą.
        </p>
        <button
          type="button"
          onClick={openModal}
          className="mt-8 inline-flex rounded-full bg-pink-500 px-6 py-3.5 font-[var(--font-sans)] text-[15px] font-medium text-white shadow-sm hover:bg-pink-600"
        >
          Rozpocznij analizę skóry
        </button>
        <p className="mt-3 font-[var(--font-sans)] text-[13px] text-[#8A7F84]">
          To nie zastępuje konsultacji w gabinecie.
        </p>
      </div>
    </section>
  );
}
