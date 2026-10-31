"use client";

import Link from "next/link";

const SERVICE_CATEGORIES: { label: string; slug: string }[] = [
  { label: "Paznokcie", slug: "paznokcie" },
  { label: "Brwi i rzęsy", slug: "brwi_rzesy" },
  { label: "Fryzjerstwo", slug: "fryzjerstwo" },
  { label: "Zabiegi twarzy", slug: "twarz_pielegnacja" },
  { label: "Masaże", slug: "masaze_spa" },
  { label: "Depilacja", slug: "depilacja" },
  { label: "Pielęgnacja ciała", slug: "cialo_modelowanie" },
  { label: "Podologia", slug: "podologia_stopy" },
];

const chipClass =
  "inline-flex min-h-[44px] items-center justify-center rounded-full border border-[#f1d5e5] bg-white px-5 py-2.5 font-[var(--font-sans)] text-[14px] font-medium text-[#1F1A1C] transition-all duration-200 ease-out hover:-translate-y-px hover:border-pink-300 hover:bg-[#fdf1f8] focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-pink-400";

export function CategoriesBar() {
  return (
    <section
      id="uslugi"
      className="border-b border-neutral-200/40 bg-white py-14 lg:py-20"
      aria-labelledby="categories-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2
          id="categories-heading"
          className="mb-3 text-center font-[var(--font-serif)] text-xl font-normal text-[#1F1A1C] sm:text-2xl"
        >
          Czego szukasz?
        </h2>
        <p className="mb-10 text-center font-[var(--font-sans)] text-[15px] text-[#6F5E64]">
          Wybierz kategorię, aby zawęzić wyszukiwanie salonów.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {SERVICE_CATEGORIES.map(({ label, slug }) => (
            <Link
              key={slug}
              href={`/portal/gabinety?cat=${encodeURIComponent(slug)}`}
              className={chipClass}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
