import Link from "next/link";
import { Jost, Syne } from "next/font/google";
import { ChevronRight } from "lucide-react";
import { OdartPublicShell } from "@/components/odart/OdartPublicShell";
import { OdartRafalKowalkowskiMuzykaHeroVideo } from "@/components/odart/OdartRafalKowalkowskiMuzykaHeroVideo";
import { OdartRafalKowalkowskiAlbumPlayer } from "@/components/odart/OdartRafalKowalkowskiAlbumPlayer";
import { OdartRafalKowalkowskiMuzykaTracks } from "@/components/odart/OdartRafalKowalkowskiMuzykaTracks";
import { ODART_SITE_URL } from "@/lib/odartSite";
import { RAFAL_KOWALKOWSKI_PROFILE_PATH } from "@/lib/rafalKowalkowskiGallery";
import { buildRafalWebPageJsonLd } from "@/lib/rafalKowalkowskiSeo";
import { RAFAL_KOWALKOWSKI_YOUTUBE_CHANNEL_URL } from "@/lib/rafalKowalkowskiYoutube";
import {
  RAFAL_KOWALKOWSKI_MUZYKA_ODART_HREF,
  RAFAL_KOWALKOWSKI_MUZYKA_WP_SOURCE,
  RAFAL_KOWALKOWSKI_SPOTIFY_ARTIST_URL,

  RAFAL_KOWALKOWSKI_MUZYKA_PATH,} from "@/lib/rafalKowalkowskiMuzyka";

const jost = Jost({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const syne = Syne({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const SITE = ODART_SITE_URL.replace(/\/$/, "");

const HERO_STATS = [
  { value: "50", label: "Własnych utworów" },
  { value: "ponad 20", label: "Teledysków" },
  { value: "ACRUX", label: "Marka studyjna" },
] as const;

const jsonLd = buildRafalWebPageJsonLd(RAFAL_KOWALKOWSKI_MUZYKA_PATH, "Muzyka autorska — Rafał Kowalkowski");


export function OdartRafalKowalkowskiMuzykaPage() {
  return (
    <OdartPublicShell jsonLd={jsonLd}>
      <div className={`${jost.className} bg-black text-neutral-300`}>
        <nav
          className="absolute left-0 right-0 top-0 z-30 border-b border-white/10 bg-black/30 px-4 py-4 backdrop-blur-sm sm:px-6 lg:px-8"
          aria-label="Ścieżka nawigacji"
        >
          <ol className="mx-auto flex max-w-6xl flex-wrap items-center gap-1 text-xs text-neutral-400 sm:text-sm">
            <li>
              <Link href={RAFAL_KOWALKOWSKI_PROFILE_PATH} className="transition hover:text-white">
                Rafał Kowalkowski
              </Link>
            </li>
            <li className="flex items-center gap-1">
              <ChevronRight className="h-3.5 w-3.5 text-neutral-600" aria-hidden />
              <span className="text-white">Muzyka autorska</span>
            </li>
          </ol>
        </nav>

        {/* Hero — pełnoekranowe tło wideo (jak czerwonyszkwal.pl) */}
        <header className="relative min-h-[88vh] overflow-hidden sm:min-h-[92vh]">
          <OdartRafalKowalkowskiMuzykaHeroVideo variant="background" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/65 to-black/45" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/25" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(217,91,58,0.18),transparent_50%)]" />

          <div className="relative z-10 flex min-h-[88vh] flex-col justify-end px-4 pb-8 pt-24 sm:min-h-[92vh] sm:px-6 sm:pb-10 lg:px-8 lg:pb-12">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
              <div className="max-w-2xl">
                <p className={`text-[10px] font-bold uppercase tracking-[0.4em] text-odart-accent sm:text-xs ${syne.className}`}>
                  ACRUX · Muzyka autorska
                </p>
                <h1
                  className={`mt-4 text-[clamp(2rem,6vw,3.75rem)] font-bold leading-[1.05] tracking-tight text-white sm:text-[clamp(2.5rem,5vw,4.25rem)] ${syne.className}`}
                >
                  Muzyka autorska Rafał Kowalkowski
                </h1>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-neutral-300 sm:text-lg">
                  Muzyką była ze mną od zawsze — gram na gitarze i piszę teksty. Szanty, poezja śpiewana, rock i pop.
                  Album <em className="text-white">Fotografia</em> i teledyski na YouTube i Spotify.
                </p>
                <div className="mt-8 flex flex-wrap gap-3 sm:gap-4">
                  <a
                    href={RAFAL_KOWALKOWSKI_SPOTIFY_ARTIST_URL}
                    className={`inline-flex items-center justify-center rounded-full border border-white/30 bg-transparent px-7 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/5 ${syne.className}`}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Słuchaj na Spotify
                  </a>
                  <a
                    href="#teledyski"
                    className={`inline-flex items-center justify-center rounded-full bg-white px-7 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200 ${syne.className}`}
                  >
                    Teledyski
                  </a>
                </div>
              </div>

              <div
                className="flex shrink-0 flex-col gap-0 overflow-hidden rounded-sm border border-white/10 bg-black/50 backdrop-blur-md sm:flex-row lg:max-w-md"
                aria-label="W skrócie"
              >
                {HERO_STATS.map((stat, i) => (
                  <div key={stat.label} className="flex flex-1 items-stretch">
                    {i > 0 ? <span className="hidden w-px shrink-0 bg-white/15 sm:block" aria-hidden /> : null}
                    <div className="flex flex-1 flex-col justify-center px-5 py-4 sm:px-6 sm:py-5">
                      <p
                        className={`font-bold text-white ${syne.className} ${
                          stat.value.includes(" ")
                            ? "text-lg leading-tight sm:text-xl"
                            : "text-2xl tabular-nums sm:text-3xl"
                        }`}
                      >
                        {stat.value}
                      </p>
                      <p className="mt-1 text-[11px] leading-snug text-neutral-400 sm:text-xs">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </header>

        <section id="teledyski" className="scroll-mt-24 border-t border-white/10 bg-[#0a0a0a] py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className={`text-2xl font-semibold text-white sm:text-3xl ${syne.className}`}>Teledyski</h2>
            <p className="mt-3 max-w-xl text-neutral-500">Kliknij okładkę, aby odtworzyć utwór.</p>
            <div className="mt-10">
              <OdartRafalKowalkowskiMuzykaTracks />
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className={`text-2xl font-semibold text-white sm:text-3xl ${syne.className}`}>Album Fotografia</h2>
            <p className="mt-4 max-w-2xl leading-relaxed text-neutral-400">
              W 2020 wydałem pierwszy album muzyczny <em className="text-neutral-200">Fotografia</em>. Odsłuchaj utwory bezpośrednio
              na tej stronie — źródło audio:{" "}
              <a
                href={RAFAL_KOWALKOWSKI_MUZYKA_WP_SOURCE}
                className="text-odart-accent hover:underline"
                rel="noopener noreferrer"
                target="_blank"
              >
                rafalkowalkowski.pl
              </a>
              .
            </p>
            <div className="mt-10" id="album-fotografia">
              <OdartRafalKowalkowskiAlbumPlayer />
            </div>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href={RAFAL_KOWALKOWSKI_SPOTIFY_ARTIST_URL}
                className={`inline-flex rounded-full bg-[#1DB954] px-6 py-3 text-sm font-semibold text-black transition hover:brightness-110 ${syne.className}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                Słuchaj na Spotify
              </a>
              <a
                href={RAFAL_KOWALKOWSKI_YOUTUBE_CHANNEL_URL}
                className="inline-flex rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-odart-accent/60"
                rel="noopener noreferrer"
                target="_blank"
              >
                Kanał YouTube
              </a>
            </div>
          </div>
        </section>

        <footer className="border-t border-white/10 bg-[#0a0a0a] px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
            <Link
              href={RAFAL_KOWALKOWSKI_PROFILE_PATH}
              className="text-sm font-medium text-neutral-500 transition hover:text-white"
            >
              ← Profil Rafała
            </Link>
            <div className="flex flex-wrap gap-4">
              <Link
                href={`${SITE}/kontakt/`}
                className={`inline-flex rounded-full bg-odart-accent px-6 py-3 text-sm font-semibold text-white shadow-md shadow-orange-950/25 transition hover:brightness-110 ${syne.className}`}
              >
                Zapytaj o nagranie
              </Link>
              <a
                href={RAFAL_KOWALKOWSKI_MUZYKA_WP_SOURCE}
                className="inline-flex rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-white transition hover:border-white/30"
                rel="noopener noreferrer"
                target="_blank"
              >
                Wersja na rafalkowalkowski.pl
              </a>
            </div>
          </div>
        </footer>
      </div>
    </OdartPublicShell>
  );
}
