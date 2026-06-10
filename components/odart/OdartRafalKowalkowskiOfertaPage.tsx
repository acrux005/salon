import Link from "next/link";
import { Jost } from "next/font/google";
import { ChevronRight } from "lucide-react";
import { OdartPublicShell } from "@/components/odart/OdartPublicShell";
import { OdartRafalKowalkowskiServiceGrid } from "@/components/odart/OdartRafalKowalkowskiServiceGrid";
import { ODART_SITE_URL } from "@/lib/odartSite";
import {
  RAFAL_KOWALKOWSKI_GALLERY_PATH,
  RAFAL_KOWALKOWSKI_OFERTA_ODART_HREF,
  RAFAL_KOWALKOWSKI_OFERTA_PATH,
  RAFAL_KOWALKOWSKI_OFERTA_WP_SOURCE,
  RAFAL_KOWALKOWSKI_PROFILE_PATH,
  RAFAL_KOWALKOWSKI_USLUGI_PATH,
} from "@/lib/rafalKowalkowskiGallery";
import { RAFAL_KOWALKOWSKI_SERVICES } from "@/lib/rafalKowalkowskiServices";
import { buildRafalWebPageJsonLd } from "@/lib/rafalKowalkowskiSeo";

const jost = Jost({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const SITE = ODART_SITE_URL.replace(/\/$/, "");

const STATS = [
  { value: "1000+", label: "sfotografowanych osób" },
  { value: "50+", label: "stron internetowych" },
  { value: "50+", label: "produkcji muzycznych" },
] as const;

const jsonLd = buildRafalWebPageJsonLd(
  RAFAL_KOWALKOWSKI_OFERTA_PATH,
  "Strony internetowe, sesje fotograficzne, muzyka, video — Rafał Kowalkowski | ODART",
);

export function OdartRafalKowalkowskiOfertaPage() {
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
                <span className="text-white">Oferta</span>
              </li>
            </ol>
          </nav>

          <header className="mt-8 border-b border-white/10 pb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-odart-accent">Kołobrzeg</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
              Strony internetowe, sesje fotograficzne, muzyka, video
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-neutral-400">
              Rafał Kowalkowski — fotografia, nagrania i strony WWW. Od 2005 roku łączę pasję do kadru z produkcją
              muzyczną i technologią; współpraca z ODART to infrastruktura, hosting i wsparcie IT dla firm.
            </p>
            <p className="mt-4 text-xs text-neutral-600">
              Treść inspirowana{" "}
              <a
                href={RAFAL_KOWALKOWSKI_OFERTA_WP_SOURCE}
                className="text-odart-accent/90 underline decoration-odart-accent/30 underline-offset-2 hover:decoration-odart-accent"
                rel="noopener noreferrer"
                target="_blank"
              >
                rafalkowalkowski.pl
              </a>
              .
            </p>
          </header>

          <p className="mt-10 text-base leading-relaxed text-neutral-400">
            Od 2005 roku pasjonuję się fotografią — to zaangażowanie przerodziło się w Fotoferię i dalszą drogę
            programistyczną. Dziś realizuję sesje, teledyski, nagrania studyjne oraz nowoczesne strony WordPress dla
            klientów indywidualnych i firm.
          </p>

          <ul className="mt-12 grid gap-6 sm:grid-cols-3">
            {STATS.map((s) => (
              <li
                key={s.label}
                className="rounded-xl border border-white/10 bg-white/[0.02] px-6 py-8 text-center"
              >
                <p className="text-3xl font-semibold text-odart-accent">{s.value}</p>
                <p className="mt-2 text-sm text-neutral-500">Ponad {s.label}</p>
              </li>
            ))}
          </ul>

          <div className="mt-14 flex flex-wrap gap-4">
            <Link
              href={RAFAL_KOWALKOWSKI_USLUGI_PATH}
              className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:border-odart-accent/50"
            >
              Pełny katalog usług
            </Link>
            <Link
              href={RAFAL_KOWALKOWSKI_GALLERY_PATH}
              className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:border-odart-accent/50"
            >
              Galeria zdjęć
            </Link>
          </div>

          <div className="mt-16">
            <h2 className="text-xl font-semibold text-white">Wybrane usługi</h2>
            <p className="mt-2 text-sm text-neutral-500">Ceny orientacyjne — szczegóły na kartach produktów.</p>
            <div className="mt-8">
              <OdartRafalKowalkowskiServiceGrid items={RAFAL_KOWALKOWSKI_SERVICES} />
            </div>
          </div>

          <footer className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-10 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href={RAFAL_KOWALKOWSKI_PROFILE_PATH}
              className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:border-odart-accent/50"
            >
              Profil Rafała
            </Link>
            <Link
              href={`${SITE}/kontakt/`}
              className="inline-flex items-center justify-center rounded-full bg-odart-accent px-6 py-3 text-sm font-semibold text-white shadow-md shadow-orange-950/25 transition hover:brightness-110"
            >
              Kontakt
            </Link>
          </footer>
        </div>
      </div>
    </OdartPublicShell>
  );
}
