import Link from "next/link";
import { Jost } from "next/font/google";
import { ChevronRight } from "lucide-react";
import { OdartPublicShell } from "@/components/odart/OdartPublicShell";
import { OdartRafalKowalkowskiGalleryLightboxGrid } from "@/components/odart/OdartRafalKowalkowskiGalleryLightboxGrid";
import { OdartRafalKowalkowskiGallerySlideshow } from "@/components/odart/OdartRafalKowalkowskiGallerySlideshow";
import { ODART_SITE_URL } from "@/lib/odartSite";
import {
  RAFAL_KOWALKOWSKI_GALLERY,
  RAFAL_KOWALKOWSKI_GALLERY_PATH,
  RAFAL_KOWALKOWSKI_PROFILE_PATH,
} from "@/lib/rafalKowalkowskiGallery";
import { buildRafalWebPageJsonLd } from "@/lib/rafalKowalkowskiSeo";
import { rafalPublicHref } from "@/lib/rafalKowalkowskiLegacyRoutes";

const jost = Jost({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const SITE = ODART_SITE_URL.replace(/\/$/, "");

const jsonLd = buildRafalWebPageJsonLd(RAFAL_KOWALKOWSKI_GALLERY_PATH, "Galeria — Rafał Kowalkowski");

export function OdartRafalKowalkowskiGalleryPage() {
  return (
    <OdartPublicShell jsonLd={jsonLd}>
      <div className={`${jost.className} bg-[#0f0f0f] text-neutral-300`}>
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <nav className="text-sm text-neutral-500" aria-label="Ścieżka nawigacji">
            <ol className="flex flex-wrap items-center gap-1">
              <li>
                <Link href={RAFAL_KOWALKOWSKI_PROFILE_PATH} className="transition hover:text-white">
                  Rafał Kowalkowski
                </Link>
              </li>
              <li className="flex items-center gap-1">
                <ChevronRight className="h-4 w-4 text-neutral-600" aria-hidden />
                <span className="text-white">Galeria</span>
              </li>
            </ol>
          </nav>

          <header className="mt-8 max-w-2xl border-b border-white/10 pb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-odart-accent">Portfolio</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">Galeria</h1>
            <p className="mt-4 text-base leading-relaxed text-neutral-500">
              Uruchom slideshow z muzyką albo przejrzyj zdjęcia poniżej — kliknięcie otwiera pełnoekranowy lightbox
              (strzałki na klawiaturze, Escape zamyka).
            </p>
          </header>

          <OdartRafalKowalkowskiGallerySlideshow items={RAFAL_KOWALKOWSKI_GALLERY} className="mt-10" />

          <OdartRafalKowalkowskiGalleryLightboxGrid items={RAFAL_KOWALKOWSKI_GALLERY} layout="grid" className="mt-12" />

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
              Zapytaj o sesję
            </Link>
          </footer>
        </div>
      </div>
    </OdartPublicShell>
  );
}
