"use client";

import Link from "next/link";
import { useClinicData } from "@/contexts/ClinicDataContext";
import { useClinicContactModal } from "@/contexts/ClinicContactModalContext";

export function ClinicFinalCTA() {
  const { finalCta } = useClinicData();
  const { openContactModal } = useClinicContactModal();
  return (
    <section className="border-b border-neutral-200/60 bg-gradient-to-b from-pink-50/50 to-white py-14 lg:py-20">
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="font-[var(--font-serif)] text-xl font-normal text-[#1F1A1C] sm:text-2xl">
          {finalCta.title}
        </h2>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={openContactModal}
            className="inline-block rounded-full bg-pink-500 px-8 py-4 font-[var(--font-sans)] text-[16px] font-medium text-white shadow-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
          >
            {finalCta.ctaBook}
          </button>
          <Link
            href={finalCta.ctaTermsHref}
            className="inline-block rounded-full border border-pink-300 bg-white px-8 py-4 font-[var(--font-sans)] text-[16px] font-medium text-[#1F1A1C] hover:bg-pink-50/50"
          >
            {finalCta.ctaTerms}
          </Link>
        </div>
        <a
          href={finalCta.telHref}
          className="mt-4 inline-block font-[var(--font-sans)] text-[15px] text-[#6F5E64] hover:text-pink-600"
        >
          {finalCta.telLabel}
        </a>
      </div>
    </section>
  );
}
