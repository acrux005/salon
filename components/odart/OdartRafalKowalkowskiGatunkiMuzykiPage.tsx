import Link from "next/link";
import { Jost } from "next/font/google";
import { ChevronRight } from "lucide-react";
import { OdartPublicShell } from "@/components/odart/OdartPublicShell";
import { ODART_SITE_URL } from "@/lib/odartSite";
import {
  RAFAL_KOWALKOWSKI_GATUNKI_MUZYKI_ODART_HREF,
  RAFAL_KOWALKOWSKI_GATUNKI_MUZYKI_WP_SOURCE,
  RAFAL_KOWALKOWSKI_PROFILE_PATH,

  RAFAL_KOWALKOWSKI_GATUNKI_MUZYKI_PATH,} from "@/lib/rafalKowalkowskiGallery";
import { buildRafalWebPageJsonLd } from "@/lib/rafalKowalkowskiSeo";
import { RAFAL_KOWALKOWSKI_MUZYKA_PATH } from "@/lib/rafalKowalkowskiMuzyka";

const jost = Jost({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const SITE = ODART_SITE_URL.replace(/\/$/, "");

const GENRES = [
  {
    title: "Muzyka klasyczna",
    text: "Składa się z utworów komponowanych i wykonywanych przez klasycznych kompozytorów, takich jak Beethoven, Mozart i Brahms.",
  },
  {
    title: "Jazz",
    text: "Gatunek powstały w afroamerykańskiej społeczności w Nowym Orleanie w XIX wieku. Charakteryzuje się improwizacją i eksperymentowaniem z różnymi stylami i formami muzycznymi.",
  },
  {
    title: "Rock",
    text: "Powstał w latach 50. XX wieku i charakteryzuje się mocnym rytmem, gitarowymi riffami i wyrazistymi tekstami.",
  },
  {
    title: "Pop",
    text: "Szeroki gatunek, który zazwyczaj skupia się na melodiach i prostej, łatwej do zapamiętania strukturze.",
  },
  {
    title: "Hip-hop",
    text: "Gatunek i subkultura, która powstała w Nowym Jorku w latach 70. XX wieku. Charakteryzuje się rymami, beatboxem i breakdance.",
  },
  {
    title: "Blues",
    text: "Powstał w afroamerykańskiej społeczności na południu USA w XIX wieku. Charakteryzuje się smutnymi, bluesowymi melodiami i tekstami.",
  },
  {
    title: "Country",
    text: "Powstał w południowych stanach USA w XIX wieku — proste, akustyczne instrumenty i śpiew o życiu na wsi.",
  },
  {
    title: "Reggae",
    text: "Powstało na Jamajce w latach 60. XX wieku. Charakteryzuje się rytmem „one drop”, melodyjną linią basu i tekstami o pokoju, równości i sprawiedliwości. Znani artyści: Bob Marley, Peter Tosh, Toots and the Maytals.",
  },
  {
    title: "Metal",
    text: "Mocne, agresywne brzmienie i wysokie wokale. Podgatunki: heavy metal, thrash, power metal. Klasyczne utwory m.in. Black Sabbath, Metallica, Iron Maiden.",
  },
  {
    title: "Funk",
    text: "Specyficzny, groovy rytm i ostre linie basu — muzyka taneczna. Artyści: James Brown, Parliament Funkadelic, Earth, Wind & Fire, Prince.",
  },
] as const;

const jsonLd = buildRafalWebPageJsonLd(RAFAL_KOWALKOWSKI_GATUNKI_MUZYKI_PATH, "Gatunki muzyki — Rafał Kowalkowski");


export function OdartRafalKowalkowskiGatunkiMuzykiPage() {
  return (
    <OdartPublicShell jsonLd={jsonLd}>
      <div className={`${jost.className} bg-[#0f0f0f] text-neutral-300`}>
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <nav className="text-sm text-neutral-500" aria-label="Ścieżka nawigacji">
            <ol className="flex flex-wrap items-center gap-1">
              <li>
                <Link href={RAFAL_KOWALKOWSKI_PROFILE_PATH} className="transition hover:text-white">
                  Rafał Kowalkowski
                </Link>
              </li>
              <li className="flex items-center gap-1">
                <ChevronRight className="h-4 w-4 text-neutral-600" aria-hidden />
                <span className="text-neutral-400">Muzyka</span>
              </li>
              <li className="flex items-center gap-1">
                <ChevronRight className="h-4 w-4 text-neutral-600" aria-hidden />
                <span className="text-white">Gatunki muzyki</span>
              </li>
            </ol>
          </nav>

          <header className="mt-8 border-b border-white/10 pb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-odart-accent">Edukacja</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">Gatunki muzyki</h1>
            <p className="mt-4 text-xs text-neutral-600">
              Treść zgodna z{" "}
              <a
                href={RAFAL_KOWALKOWSKI_GATUNKI_MUZYKI_WP_SOURCE}
                className="text-odart-accent/90 underline decoration-odart-accent/30 underline-offset-2 hover:decoration-odart-accent"
                rel="noopener noreferrer"
                target="_blank"
              >
                rafalkowalkowski.pl
              </a>
              .
            </p>
          </header>

          <p className="mt-10 text-lg leading-relaxed text-neutral-300">
            Istnieje wiele różnych gatunków muzycznych, które można podzielić na kilka głównych kategorii, takich jak:
          </p>

          <ol className="mt-12 space-y-8">
            {GENRES.map((g, i) => (
              <li key={g.title} className="border-t border-white/10 pt-8 first:border-0 first:pt-0">
                <h2 className="text-xl font-semibold text-white">
                  {i + 1}. {g.title}
                </h2>
                <p className="mt-3 text-base leading-relaxed text-neutral-400">{g.text}</p>
              </li>
            ))}
          </ol>

          <p className="mt-12 border-t border-white/10 pt-8 text-base leading-relaxed text-neutral-400">
            Własną muzykę — szanty, poezję śpiewaną, rock i pop — znajdziesz na stronie{" "}
            <Link href={RAFAL_KOWALKOWSKI_MUZYKA_PATH} className="text-odart-accent hover:underline">
              muzyka autorska
            </Link>
            .
          </p>

          <footer className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-10 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href={RAFAL_KOWALKOWSKI_PROFILE_PATH}
              className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:border-odart-accent/50"
            >
              Wróć do profilu
            </Link>
            <Link
              href={RAFAL_KOWALKOWSKI_MUZYKA_PATH}
              className="inline-flex items-center justify-center rounded-full bg-odart-accent px-6 py-3 text-sm font-semibold text-white shadow-md shadow-orange-950/25 transition hover:brightness-110"
            >
              Muzyka autorska
            </Link>
          </footer>
        </div>
      </div>
    </OdartPublicShell>
  );
}
