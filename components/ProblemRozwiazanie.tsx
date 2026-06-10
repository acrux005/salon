"use client";

import Link from "next/link";

const problems = [
  { title: "Trądzik", href: "/portal/problem/tradzik" },
  { title: "Zmarszczki", href: "/portal/problem/anti_aging" },
  { title: "Przebarwienia", href: "/portal/problem/przebarwienia" },
  { title: "Naczynka", href: "/portal/problem/naczynka" },
  { title: "Utrata jędrności", href: "/portal/problem/anti_aging" },
  { title: "Opadający owal", href: "/portal/problem/anti_aging" },
];

export function ProblemRozwiazanie() {
  return (
    <section className="border-t border-neutral-200/60 bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="mb-12 text-center">
          <h2 className="font-[var(--font-serif)] text-2xl font-normal text-[#1F1A1C] sm:text-3xl lg:text-4xl">
            Z czym zgłaszają się nasi pacjenci
          </h2>
          <p className="mt-3 max-w-xl mx-auto text-[15px] text-[#6F5E64] leading-relaxed">
            Wybierz obszar, który chcesz poprawić — prowadzimy do właściwego zabiegu
          </p>
        </header>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6">
          {problems.map(({ title, href }) => (
            <Link
              key={href}
              href={href}
              className="group flex min-h-[120px] items-center justify-center rounded-2xl border border-pink-200/60 bg-white px-6 py-8 text-center transition-all duration-200 hover:border-pink-400/60 hover:bg-pink-50/50 hover:shadow-lg"
            >
              <span className="font-[var(--font-sans)] text-[15px] font-medium text-[#1F1A1C] group-hover:text-pink-600">
                {title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
