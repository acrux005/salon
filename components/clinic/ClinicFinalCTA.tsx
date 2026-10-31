"use client";

import Link from "next/link";
import { useClinicData } from "@/contexts/ClinicDataContext";
import { useClinicContactModal } from "@/contexts/ClinicContactModalContext";
import { clinicClaimPath } from "@/lib/catalogListing";
import { splitCatalogClinicName } from "@/lib/catalog/clinicDisplayName";

export function ClinicFinalCTA() {
  const { finalCta, claimed, clinicSlug, profile } = useClinicData();
  const { openContactModal } = useClinicContactModal();
  if (claimed === false) {
    const hasPhone = Boolean(finalCta.telHref && finalCta.telHref !== "#");
    const { displayName } = splitCatalogClinicName(profile.name);
    return (
      <section className="border-b border-neutral-200/60 bg-gradient-to-b from-amber-50/60 to-white py-14">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <h2 className="font-[var(--font-serif)] text-xl font-normal text-[#1F1A1C] sm:text-2xl">
            Kontakt
          </h2>
          {hasPhone ? (
            <a
              href={finalCta.telHref}
              className="mt-6 inline-flex rounded-full bg-[#1F1A1C] px-8 py-4 font-[var(--font-sans)] text-[16px] font-medium text-white hover:bg-neutral-800"
            >
              📞 {finalCta.telLabel}
            </a>
          ) : (
            <p className="mt-4 text-[15px] leading-relaxed text-[#6F5E64]">
              Nie mamy jeszcze danych umożliwiających kontakt z gabinetem.
            </p>
          )}
          {clinicSlug ? (
            <p className="mt-6 text-[15px] text-[#4a3f42]">
              Prowadzisz {displayName || profile.name}?{" "}
              <Link href={clinicClaimPath(clinicSlug)} className="font-medium text-pink-600 hover:underline">
                Przejmij profil bezpłatnie
              </Link>
              .
            </p>
          ) : null}
        </div>
      </section>
    );
  }
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
