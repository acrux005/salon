"use client";

import Link from "next/link";
import { Sparkles, Search } from "lucide-react";
import { PORTAL_LOCALE } from "@/content/portalLocale";

// ——— Problemy skóry → analiza (quiz → terapia → gabinet)
const PROBLEM_CHIPS: { label: string; slug: string }[] = [
  { label: "Trądzik (dorosłych)", slug: "tradzik" },
  { label: "Przebarwienia", slug: "przebarwienia" },
  { label: "Anti-aging 30+", slug: "anti_aging" },
  { label: "Rumień / naczynka", slug: "naczynka" },
  { label: "Rozszerzone pory", slug: "pory" },
  { label: "Blizny potrądzikowe", slug: "blizny" },
];

// ——— Konkretne usługi → gabinety (cat=slug, opcjonalnie men=1)
const SERVICE_CATEGORIES: { label: string; slug: string; menOnly?: boolean }[] = [
  { label: "Paznokcie", slug: "paznokcie" },
  { label: "Brwi / rzęsy", slug: "brwi_rzesy" },
  { label: "Masaże", slug: "masaze_spa" },
  { label: "Depilacja", slug: "depilacja" },
  { label: "Zabiegi twarzy", slug: "twarz_pielegnacja" },
  { label: "Ciało / modelowanie", slug: "cialo_modelowanie" },
  { label: "Podologia / stopy", slug: "podologia_stopy" },
  { label: "Fryzjerstwo", slug: "fryzjerstwo" },
  { label: "Dla mężczyzn", slug: "", menOnly: true },
];

const GABINETY_BASE = "/portal/gabinety";
const ANALIZA_START = "/portal";

function buildGabinetyHref(slug: string, menOnly?: boolean): string {
  const params = new URLSearchParams();
  if (menOnly) params.set("men", "1");
  else if (slug) params.set("cat", slug);
  const qs = params.toString();
  return qs ? `${GABINETY_BASE}?${qs}` : GABINETY_BASE;
}

const cardClass =
  "flex flex-1 min-w-0 flex-col rounded-[16px] border border-[#f0f0f0] bg-white p-8 shadow-[0_8px_30px_rgba(0,0,0,0.03)]";

const chipClass =
  "inline-flex min-h-[40px] items-center rounded-full border border-[#f1d5e5] bg-white px-[18px] py-2.5 font-[var(--font-sans)] text-[14px] font-medium text-[#1F1A1C] transition-all duration-200 ease-out hover:-translate-y-px hover:bg-[#fdf1f8] focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-pink-400";

export function CategoriesBar() {
  return (
    <section
      id="zabiegi"
      className="border-b border-neutral-200/40 bg-white py-14 lg:py-20"
      aria-labelledby="categories-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2
          id="categories-heading"
          className="mb-2 text-center font-[var(--font-serif)] text-xl font-normal text-[#1F1A1C] sm:text-2xl"
        >
          Od czego chcesz zacząć?
        </h2>
        <p className="mb-10 text-center font-[var(--font-sans)] text-[15px] text-[#6F5E64] sm:mb-12">
          Wybierz problem skóry lub konkretną usługę. Działamy w {PORTAL_LOCALE.regionLong}.
        </p>

        <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch lg:gap-12">
          {/* Karta: problem skóry */}
          <div className="flex min-w-0 flex-1 flex-col">
            <div className={`${cardClass} relative`}>
              <span
                className="absolute right-6 top-6 rounded-full bg-pink-50/80 px-2.5 py-0.5 font-[var(--font-sans)] text-[11px] font-medium text-pink-600"
                aria-hidden
              >
                Najpopularniejsze
              </span>
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <Sparkles className="h-5 w-5 shrink-0 text-[#DE1F40]" aria-hidden />
                <h3 className="font-[var(--font-sans)] text-lg font-semibold text-[#1F1A1C]">
                  Mam problem ze skórą
                </h3>
              </div>
              <p className="mb-4 text-[15px] text-[#6F5E64]">
                Zrób analizę i dostaniesz terapię + 1–3 dopasowane gabinety.
              </p>
              <div className="flex flex-wrap gap-3">
                {PROBLEM_CHIPS.map(({ label, slug }) => (
                  <Link
                    key={slug}
                    href={`${ANALIZA_START}?problem=${slug}`}
                    scroll={false}
                    className={chipClass}
                  >
                    {label}
                  </Link>
                ))}
              </div>
              <Link
                href="/portal/problemy-skory"
                className="mt-4 inline-block font-[var(--font-sans)] text-[14px] font-medium text-pink-600 underline decoration-pink-300 underline-offset-2 transition-colors hover:text-pink-700 hover:decoration-pink-500 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-pink-400"
              >
                Zobacz wszystkie problemy →
              </Link>
            </div>
          </div>

          {/* Karta: konkretna usługa */}
          <div className="flex min-w-0 flex-1 flex-col">
            <div className={cardClass}>
              <div className="mb-2 font-[var(--font-sans)] text-[13px] font-medium uppercase tracking-wider text-[#6C6C75]">
                Usługi
              </div>
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <Search className="h-5 w-5 shrink-0 text-[#5F5F68]" aria-hidden />
                <h3 className="font-[var(--font-sans)] text-lg font-semibold text-[#1F1A1C]">
                  Szukam konkretnej usługi
                </h3>
              </div>
              <p className="mb-4 text-[15px] text-[#6F5E64]">
                Wybierz usługę, a pokażemy gabinety i wolne terminy w {PORTAL_LOCALE.regionLong}.
              </p>
              <div className="flex flex-wrap gap-3">
                {SERVICE_CATEGORIES.map(({ label, slug, menOnly }) => (
                  <Link
                    key={menOnly ? "men" : slug}
                    href={buildGabinetyHref(slug, menOnly)}
                    className={chipClass}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
