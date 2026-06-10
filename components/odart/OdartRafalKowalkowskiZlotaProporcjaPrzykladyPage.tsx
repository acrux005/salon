import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Jost } from "next/font/google";
import { ChevronRight } from "lucide-react";
import { OdartPublicShell } from "@/components/odart/OdartPublicShell";
import { ODART_SITE_URL } from "@/lib/odartSite";
import {
  RAFAL_KOWALKOWSKI_PROFILE_PATH,
  RAFAL_KOWALKOWSKI_ZLOTA_PROPORCJA_PRZYKLADY_ODART_HREF,
  RAFAL_KOWALKOWSKI_ZLOTA_PROPORCJA_PRZYKLADY_WP_SOURCE,
  RAFAL_KOWALKOWSKI_TROJPODZIAL_FOTO_PATH,
  RAFAL_KOWALKOWSKI_ZLOTY_PODZIAL_FOTO_PATH,

  RAFAL_KOWALKOWSKI_ZLOTA_PROPORCJA_PRZYKLADY_PATH,} from "@/lib/rafalKowalkowskiGallery";
import { buildRafalWebPageJsonLd } from "@/lib/rafalKowalkowskiSeo";

const jost = Jost({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const SITE = ODART_SITE_URL.replace(/\/$/, "");

const IMG_SPIRAL_STAIRS = {
  src: "https://rafalkowalkowski.pl/wp-content/uploads/2023/04/20230420172526.png",
  w: 1200,
  h: 800,
} as const;

const IMG_ROAD_CAT = {
  src: "https://rafalkowalkowski.pl/wp-content/uploads/2023/04/20230420075629.jpg",
  w: 1200,
  h: 900,
} as const;

const IMG_RULE_OF_THIRDS = {
  src: "https://rafalkowalkowski.pl/wp-content/uploads/2023/04/20230423150622.jpg",
  w: 1200,
  h: 800,
} as const;

const jsonLd = buildRafalWebPageJsonLd(RAFAL_KOWALKOWSKI_ZLOTA_PROPORCJA_PRZYKLADY_PATH, "Złota proporcja — przykłady | Rafał Kowalkowski");


function Figure({ children, caption }: { children: ReactNode; caption?: string }) {
  return (
    <figure className="my-8 overflow-hidden rounded-xl border border-white/10 bg-black/30 p-3 sm:p-4">
      {children}
      {caption ? <figcaption className="mt-3 text-center text-sm text-neutral-500">{caption}</figcaption> : null}
    </figure>
  );
}

export function OdartRafalKowalkowskiZlotaProporcjaPrzykladyPage() {
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
                <span className="text-neutral-400">Edukacja</span>
              </li>
              <li className="flex items-center gap-1">
                <ChevronRight className="h-4 w-4 text-neutral-600" aria-hidden />
                <span className="text-white">Złota proporcja – przykłady</span>
              </li>
            </ol>
          </nav>

          <header className="mt-8 border-b border-white/10 pb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-odart-accent">Edukacja</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
              Złota proporcja – przykłady
            </h1>
            <time className="mt-4 block text-sm text-neutral-500" dateTime="2023-04-23">
              23 kwietnia 2023
            </time>
            <p className="mt-2 text-xs text-neutral-600">
              Treść i ilustracje zgodne z wpisem na{" "}
              <a
                href={RAFAL_KOWALKOWSKI_ZLOTA_PROPORCJA_PRZYKLADY_WP_SOURCE}
                className="text-odart-accent/90 underline decoration-odart-accent/30 underline-offset-2 hover:decoration-odart-accent"
                rel="noopener noreferrer"
                target="_blank"
              >
                rafalkowalkowski.pl
              </a>
              .
            </p>
          </header>

          <article className="prose prose-invert prose-neutral mt-12 max-w-none prose-p:text-neutral-400 prose-p:leading-relaxed prose-headings:font-semibold prose-headings:text-white prose-strong:text-neutral-200">
            <p>
              Złoty podział czy też złota spirala to reguła kompozycji, którą możemy zastosować przy komponowaniu
              obrazu. Najlepszym przykładem złotej spirali to schody jak na powyższym przykładzie czy też skorupa ślimaka.
              Złotą spiralę możemy poprowadzić z każdego rogu zdjęcia i temat umieścić w mocnym punkcie, gdzie w tym
              przypadku jest to najdalsza część konstrukcji wciągająca widza w głąb zdjęcia. Złotą spirala powinna
              prowadzić wzrok odbiorcy w stronę istotnego elementu, przy czym należy układać ją jakby w przestrzeni 3D
              zdjęcia, czyli podzielić zdjęcie na plany i nie traktować go jak płaskiej powierzchni.
            </p>

            <Figure caption="Złota spirala w kompozycji — przykład ze schodami">
              <Image
                src={IMG_SPIRAL_STAIRS.src}
                alt="Przykład złotej spirali na schodach w kompozycji fotograficznej"
                width={IMG_SPIRAL_STAIRS.w}
                height={IMG_SPIRAL_STAIRS.h}
                className="mx-auto h-auto w-full object-contain"
                sizes="(max-width: 768px) 100vw, 768px"
                priority
              />
            </Figure>

            <p>
              W powyższym zdjęciu droga stanowi linię wiodącą w głąb zdjęcia i wraca do wpatrzonego w ptaki kota.
            </p>

            <Figure caption="Linia wiodąca i punkt zainteresowania w kadrze">
              <Image
                src={IMG_ROAD_CAT.src}
                alt="Droga jako linia wiodąca prowadząca wzrok do kota obserwującego ptaki"
                width={IMG_ROAD_CAT.w}
                height={IMG_ROAD_CAT.h}
                className="mx-auto h-auto w-full max-w-full object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </Figure>

            <p>
              Ze złotej spirali wywodzi się trójpodział, który jest uproszczoną formą złotego podziału. Linie w złotym
              podziale są stycznymi do spiral wychodzącymi z każdego rogu zdjęcia jak na rysunku poniżej.
            </p>

            <Figure caption="Trójpodział i linie złotego podziału w kadrze">
              <Image
                src={IMG_RULE_OF_THIRDS.src}
                alt="Schemat trójpodziału i linii złotego podziału na zdjęciu"
                width={IMG_RULE_OF_THIRDS.w}
                height={IMG_RULE_OF_THIRDS.h}
                className="mx-auto h-auto w-full max-w-full object-contain"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </Figure>

            <p>
              W tym przypadku interesujące nas elementy zdjęcia powinny być umieszczone wzdłuż linii oraz w mocnych
              punktach w miejscach ich przecięcia. Łatwo zauważyć, że mocne punkty złotego podziału leżą bliżej centrum
              zdjęcia. Zarówno trójpodział jak i złoty podział polega na odsunięciu głównego tematu zdjęcia od centrum
              zdjęcia, tak jakby kadry centralne były złym wyborem. Centralne kadry są najczęściej łamaniem zasad
              kompozycji i sprawdzają się przy zdjęciach minimalistycznych.
            </p>
          </article>

          <aside className="mt-12 rounded-xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm font-semibold text-white">Powiązane wpisy</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href={RAFAL_KOWALKOWSKI_ZLOTY_PODZIAL_FOTO_PATH} className="font-semibold text-odart-accent hover:underline">
                  Złota proporcja w fotografii →
                </Link>
              </li>
              <li>
                <Link href={RAFAL_KOWALKOWSKI_TROJPODZIAL_FOTO_PATH} className="font-semibold text-odart-accent hover:underline">
                  Kompozycja – Trójpodział →
                </Link>
              </li>
            </ul>
          </aside>

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
              Zapytaj o fotografię
            </Link>
          </footer>
        </div>
      </div>
    </OdartPublicShell>
  );
}
