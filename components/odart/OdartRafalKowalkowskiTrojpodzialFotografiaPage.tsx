import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Jost } from "next/font/google";
import { ChevronRight } from "lucide-react";
import { OdartPublicShell } from "@/components/odart/OdartPublicShell";
import { ODART_SITE_URL } from "@/lib/odartSite";
import {
  RAFAL_KOWALKOWSKI_KOMPOZYCJA_FOTO_PATH,
  RAFAL_KOWALKOWSKI_PROFILE_PATH,
  RAFAL_KOWALKOWSKI_TROJPODZIAL_FOTO_ODART_HREF,
  RAFAL_KOWALKOWSKI_TROJPODZIAL_FOTO_WP_SOURCE,
  RAFAL_KOWALKOWSKI_ZLOTA_PROPORCJA_PRZYKLADY_PATH,
  RAFAL_KOWALKOWSKI_ZLOTY_PODZIAL_FOTO_PATH,

  RAFAL_KOWALKOWSKI_TROJPODZIAL_FOTO_PATH,} from "@/lib/rafalKowalkowskiGallery";
import { buildRafalWebPageJsonLd } from "@/lib/rafalKowalkowskiSeo";

const jost = Jost({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const SITE = ODART_SITE_URL.replace(/\/$/, "");
const UP = "https://rafalkowalkowski.pl/wp-content/uploads/2023/03";

const IMG_GRID = { src: `${UP}/20230329095155.jpg`, w: 609, h: 800 } as const;
const IMG_WINDMILLS = { src: `${UP}/20230329095243.jpg`, w: 800, h: 600 } as const;
const IMG_TRZESACZ = { src: `${UP}/20230329100225.jpg`, w: 800, h: 598 } as const;
const IMG_KOLOBRZEG_ORIG = { src: `${UP}/20230329100248.png`, w: 799, h: 584 } as const;
const IMG_KOLOBRZEG_CROP = { src: `${UP}/20230329100204.jpg`, w: 800, h: 599 } as const;
const IMG_TREE = { src: `${UP}/20230329100025.jpg`, w: 800, h: 591 } as const;
const IMG_LINES = { src: `${UP}/20230329100325-1.jpg`, w: 800, h: 745 } as const;
const IMG_NORWAY = { src: `${UP}/20230330084629.jpg`, w: 800, h: 532 } as const;
const IMG_GRAND_CANYON = { src: `${UP}/20230329100040.jpg`, w: 630, h: 800 } as const;

const jsonLd = buildRafalWebPageJsonLd(RAFAL_KOWALKOWSKI_TROJPODZIAL_FOTO_PATH, "Trójpodział w fotografii — Rafał Kowalkowski");


function Figure({ children, caption }: { children: ReactNode; caption?: string }) {
  return (
    <figure className="my-8 overflow-hidden rounded-xl border border-white/10 bg-black/30 p-3 sm:p-4">
      {children}
      {caption ? <figcaption className="mt-3 text-center text-sm text-neutral-500">{caption}</figcaption> : null}
    </figure>
  );
}

function ArticleImage({
  src,
  w,
  h,
  alt,
  priority,
}: {
  src: string;
  w: number;
  h: number;
  alt: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={w}
      height={h}
      className="mx-auto h-auto w-full max-w-full object-contain"
      sizes="(max-width: 768px) 100vw, 768px"
      priority={priority}
    />
  );
}

export function OdartRafalKowalkowskiTrojpodzialFotografiaPage() {
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
                <span className="text-white">Trójpodział</span>
              </li>
            </ol>
          </nav>

          <header className="mt-8 border-b border-white/10 pb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-odart-accent">Edukacja</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
              Kompozycja w fotografii – Trójpodział
            </h1>
            <time className="mt-4 block text-sm text-neutral-500" dateTime="2023-03-07">
              7 marca 2023
            </time>
            <p className="mt-2 text-xs text-neutral-600">
              Treść i ilustracje zgodne z wpisem na{" "}
              <a
                href={RAFAL_KOWALKOWSKI_TROJPODZIAL_FOTO_WP_SOURCE}
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
            <h2>Jak wykorzystać trójpodział w kompozycji fotografii</h2>
            <p>
              Trójpodział jest jednym z podstawowych zasad kompozycji fotografii. Polega on na podzieleniu zdjęcia na trzy
              równe części, zarówno poziomo, jak i pionowo. Trójpodział może być wykorzystany do wyeksponowania ważnych
              elementów w kadrze, takich jak postaci lub obiekty.
            </p>
            <p>
              Trójpodział to po prostu siatka dzieląca prostokąt na dziewięć równych części, jak pokazuję na moim zdjęciu
              poniżej:
            </p>

            <Figure caption="Siatka trójpodziału na kadrze">
              <ArticleImage
                src={IMG_GRID.src}
                w={IMG_GRID.w}
                h={IMG_GRID.h}
                alt="Siatka trójpodziału — dziewięć równych pól na zdjęciu"
                priority
              />
            </Figure>

            <p>
              Trójpodział nazywany też czasami złotym podziałem (choć myślę, że błędnie, bo złoty podział to też złota
              proporcja) wywodzi się z formuły złotej proporcji, która ma wpływ na umiejscowieniu tematu poza centrum kadru.
              Złota proporcja to matematyczna formuła, która daje podstawy do stworzenia złotej spirali. Genezę złotej
              spirali opisuję w{" "}
              <Link href={RAFAL_KOWALKOWSKI_ZLOTY_PODZIAL_FOTO_PATH} className="text-odart-accent hover:underline">
                tym artykule
              </Link>
              .
            </p>
            <p>
              Warto jest zobaczyć czym jest złota spirala, więc zapraszam najpierw do przeczytania wspomnianego artykułu.
              Jeżeli poprowadzimy złote spirale z każdego rogu zdjęcia to zakończą się one mniej więcej w przecięciach
              siatki trójpodziału, co daje szybkie i konkretne umiejscowienie wybranego tematu w mocnych punktach kadru.
            </p>
            <p>
              Reguła trójpodziału ma być wskazówką udanej kompozycji — sugeruje umieszczenie fotografowanego obiektu wzdłuż
              jednej z czterech linii, a najlepiej w jednym z czterech punktów przecięcia.
            </p>
            <p>
              Prześledźmy wybrane moje fotografie wykonane ponad 10 lat temu i sprawdźmy czy zastosowałem tę regułę. Moją
              przygodę z fotografią rozpocząłem 15 lat temu, więc w tym czasie uczyłem się zasad kompozycji i niektóre
              kadry wykonywałem bardziej intuicyjnie, niż zgodnie z wytycznymi.
            </p>

            <p>
              Wiatraki zaczęto stawiać na kołobrzeskich polach około 2008 roku i były nowym planem do zdjęć. To
              fotomontaż, na który składa się kilka zdjęć, ale wydaje się, że trójpodział został zachowany, bo kolumna
              biegnie wzdłuż jednej linii, a w mocnym punkcie znajduje się jedno ze skrzydeł. Mam duży sentyment do tego
              zdjęcia, bo to było jedno z moich pierwszych zdjęć krajobrazowych.
            </p>
            <Figure caption="Wiatraki — fotomontaż z zachowaniem trójpodziału">
              <ArticleImage src={IMG_WINDMILLS.src} w={IMG_WINDMILLS.w} h={IMG_WINDMILLS.h} alt="Wiatraki na polach koło Kołobrzegu" />
            </Figure>

            <p>
              Plaża w Trzęsaczu, pozostałości po wzmocnieniach przy ruinach kościoła. Jedna z linii biegnie prawie po
              widnokręgu, a beczki są w mocnych punktach. Idealnie byłoby gdyby słońce zachodziło w mocnym punkcie,
              jednakże ze względu na dobór kadru oraz wielkość tych beczek jest to raczej niemożliwe do wykadrowania w tej
              chwili. Beczki powodują też, że kadr stał się „ciężki” i przytłacza odbiorcę. Być może odejście od pierwszego
              planu pomogłoby perspektywie, ale pewnie „boki” na to nie pozwalały.
            </p>
            <Figure caption="Plaża w Trzęsaczu — linia widnokręgu i mocne punkty">
              <ArticleImage src={IMG_TRZESACZ.src} w={IMG_TRZESACZ.w} h={IMG_TRZESACZ.h} alt="Plaża w Trzęsaczu przy ruinach kościoła" />
            </Figure>

            <p>Plaża w Kołobrzegu. Linie kompletnie nietrafione. Wykadrowałem poniżej zgodnie z wytycznymi.</p>
            <Figure caption="Plaża w Kołobrzegu — kadr przed korektą kompozycji">
              <ArticleImage
                src={IMG_KOLOBRZEG_ORIG.src}
                w={IMG_KOLOBRZEG_ORIG.w}
                h={IMG_KOLOBRZEG_ORIG.h}
                alt="Plaża w Kołobrzegu — pierwotny kadr"
              />
            </Figure>

            <p>Po wykadrowaniu zdjęcia do linii trójpodziału.</p>
            <Figure caption="Kadrowanie do linii trójpodziału">
              <ArticleImage
                src={IMG_KOLOBRZEG_CROP.src}
                w={IMG_KOLOBRZEG_CROP.w}
                h={IMG_KOLOBRZEG_CROP.h}
                alt="Plaża w Kołobrzegu po wykadrowaniu według trójpodziału"
              />
            </Figure>

            <p>Górna linia idzie wzdłuż widnokręgu, a mocny punkt jest „prawie” na konarze.</p>
            <Figure>
              <ArticleImage src={IMG_TREE.src} w={IMG_TREE.w} h={IMG_TREE.h} alt="Kompozycja z konarem przy widnokręgu" />
            </Figure>

            <p>Tu już wykadrowane tak, żeby odnaleźć linie trójpodziału.</p>
            <Figure>
              <ArticleImage
                src={IMG_LINES.src}
                w={IMG_LINES.w}
                h={IMG_LINES.h}
                alt="Zdjęcie z zaznaczonymi liniami trójpodziału"
              />
            </Figure>

            <p>
              Norwegia. Po wykadrowaniu tak, żeby górna linia była na styku góry z wodą, a mocne punkty dotykały kamieni.
            </p>
            <Figure caption="Norwegia — linia horyzontu i mocne punkty">
              <ArticleImage src={IMG_NORWAY.src} w={IMG_NORWAY.w} h={IMG_NORWAY.h} alt="Krajobraz norweski — trójpodział" />
            </Figure>

            <p>
              W roku 2009 odwiedziłem Grand Canyon. Tutaj poprowadziłem jedną z linii wzdłuż olbrzymiej skały.
            </p>
            <Figure caption="Grand Canyon — linia wzdłuż skały">
              <ArticleImage
                src={IMG_GRAND_CANYON.src}
                w={IMG_GRAND_CANYON.w}
                h={IMG_GRAND_CANYON.h}
                alt="Grand Canyon — kompozycja według trójpodziału"
              />
            </Figure>
          </article>

          <aside className="mt-12 rounded-xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm font-semibold text-white">Powiązane wpisy</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href={RAFAL_KOWALKOWSKI_KOMPOZYCJA_FOTO_PATH} className="font-semibold text-odart-accent hover:underline">
                  Kompozycja – główne zasady →
                </Link>
              </li>
              <li>
                <Link href={RAFAL_KOWALKOWSKI_ZLOTY_PODZIAL_FOTO_PATH} className="font-semibold text-odart-accent hover:underline">
                  Złota proporcja w fotografii →
                </Link>
              </li>
              <li>
                <Link href={RAFAL_KOWALKOWSKI_ZLOTA_PROPORCJA_PRZYKLADY_PATH} className="font-semibold text-odart-accent hover:underline">
                  Złota proporcja – przykłady →
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
