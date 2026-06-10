import { Suspense } from "react";
import Link from "next/link";
import { Jost } from "next/font/google";
import { ChevronRight } from "lucide-react";
import { OdartPublicShell } from "@/components/odart/OdartPublicShell";
import { OdartRafalKowalkowskiServiceGrid } from "@/components/odart/OdartRafalKowalkowskiServiceGrid";
import { ODART_SITE_URL } from "@/lib/odartSite";
import {
  RAFAL_KOWALKOWSKI_PROFILE_PATH,
  RAFAL_KOWALKOWSKI_USLUGI_ODART_HREF,
  RAFAL_KOWALKOWSKI_USLUGI_WP_SOURCE,

  RAFAL_KOWALKOWSKI_USLUGI_PATH,} from "@/lib/rafalKowalkowskiGallery";
import { buildRafalWebPageJsonLd } from "@/lib/rafalKowalkowskiSeo";
import { RAFAL_KOWALKOWSKI_SERVICES, RAFAL_USLUGI_CATEGORIES } from "@/lib/rafalKowalkowskiServices";

const jost = Jost({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const SITE = ODART_SITE_URL.replace(/\/$/, "");

const jsonLd = buildRafalWebPageJsonLd(RAFAL_KOWALKOWSKI_USLUGI_PATH, "Usługi — Rafał Kowalkowski");


type UslugiPageProps = { initialCategory?: string };

export function OdartRafalKowalkowskiUslugiPage({ initialCategory }: UslugiPageProps = {}) {
  return (
    <OdartPublicShell jsonLd={jsonLd}>
      <div className={`${jost.className} bg-[#0f0f0f] text-neutral-300`}>
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <nav className="text-sm text-neutral-500" aria-label="Ścieżka nawigacji">
            <ol className="flex flex-wrap items-center gap-1">
              <li>
                <Link href={RAFAL_KOWALKOWSKI_PROFILE_PATH} className="transition hover:text-white">
                  Rafał Kowalkowski
                </Link>
              </li>
              <li className="flex items-center gap-1">
                <ChevronRight className="h-4 w-4 text-neutral-600" aria-hidden />
                <span className="text-white">Usługi</span>
              </li>
            </ol>
          </nav>

          <header className="mt-8 border-b border-white/10 pb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-odart-accent">Oferta</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">Moje usługi</h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-neutral-400">
              Fotografia, nagrania, teledyski i strony internetowe — pełna oferta w jednym miejscu. Wybierz kategorię lub
              przejrzyj wszystkie pozycje poniżej.
            </p>
            <p className="mt-4 text-xs text-neutral-600">
              Katalog zgodny z{" "}
              <a
                href={RAFAL_KOWALKOWSKI_USLUGI_WP_SOURCE}
                className="text-odart-accent/90 underline decoration-odart-accent/30 underline-offset-2 hover:decoration-odart-accent"
                rel="noopener noreferrer"
                target="_blank"
              >
                rafalkowalkowski.pl/uslugi
              </a>
              .
            </p>
          </header>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {RAFAL_USLUGI_CATEGORIES.map((c) => (
              <li
                key={c.title}
                className="rounded-xl border border-white/10 bg-white/[0.02] p-5 transition hover:border-odart-accent/30"
              >
                <h2 className="text-lg font-semibold text-white">{c.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-neutral-500">{c.desc}</p>
              </li>
            ))}
          </ul>

          <div className="mt-16">
            <Suspense fallback={<p className="text-center text-sm text-neutral-500">Ładowanie katalogu…</p>}>
              <OdartRafalKowalkowskiServiceGrid items={RAFAL_KOWALKOWSKI_SERVICES} initialCategory={initialCategory} />
            </Suspense>
          </div>

          <footer className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-10 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href={RAFAL_KOWALKOWSKI_PROFILE_PATH}
              className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:border-odart-accent/50"
            >
              Wróć do profilu
            </Link>
            <Link
              href={`${SITE}/kontakt/`}
              className="inline-flex items-center justify-center rounded-full bg-odart-accent px-6 py-3 text-sm font-semibold text-white shadow-md shadow-orange-950/25 transition hover:brightness-110"
            >
              Zapytaj o wycenę
            </Link>
          </footer>
        </div>
      </div>
    </OdartPublicShell>
  );
}
