"use client";

import Link from "next/link";

const ARTICLES = [
  { title: "Jak przygotować skórę do zabiegu?", href: "/portal/artykuly/przygotowanie-skory" },
  { title: "Trądzik dorosłych: co działa, a co szkodzi?", href: "/portal/artykuly/tradzik-doroslych" },
  { title: "Przebarwienia: od czego zacząć dobór pielęgnacji i zabiegów?", href: "/portal/artykuly/przebarwienia-plan" },
  { title: "Jak wybrać manicure, który naprawdę się trzyma?", href: "/portal/artykuly/manicure-wybor" },
  { title: "Masaż relaksacyjny czy sportowy — co wybrać?", href: "/portal/artykuly/masaz-relaksacyjny-sportowy" },
];

export function BlogSection() {
  return (
    <section
      id="artykuly"
      className="border-b border-neutral-200/40 py-20 lg:py-28"
      style={{ background: "#FFF8FB" }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-3 text-center font-[var(--font-serif)] text-2xl font-normal text-[#1F1A1C] sm:text-3xl">
          Poradnik beauty
        </h2>
        <p className="mx-auto mb-12 max-w-xl text-center font-[var(--font-sans)] text-[15px] text-[#6F5E64]">
          Poznaj zabiegi, przygotuj się do wizyty i sprawdź, na co zwrócić uwagę przy wyborze salonu.
        </p>
        <div className="grid gap-6 sm:grid-cols-3">
          {ARTICLES.slice(0, 3).map(({ title, href }) => (
            <Link
              key={href}
              href={href}
              className="block rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-[box-shadow,border-color] duration-300 ease-out hover:border-pink-200 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)]"
            >
              <h3 className="font-[var(--font-sans)] text-[16px] font-semibold text-[#1F1A1C]">
                {title}
              </h3>
              <span className="mt-2 inline-block font-[var(--font-sans)] text-[14px] text-pink-600">
                Czytaj →
              </span>
            </Link>
          ))}
        </div>
        <p className="mt-10 text-center">
          <Link
            href="/portal/artykuly"
            className="font-[var(--font-sans)] text-[15px] font-medium text-pink-600 hover:underline"
          >
            Zobacz wszystkie artykuły
          </Link>
        </p>
      </div>
    </section>
  );
}
