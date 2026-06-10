import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Jost } from "next/font/google";
import { ChevronRight } from "lucide-react";
import { OdartPublicShell } from "@/components/odart/OdartPublicShell";
import { ODART_SITE_URL } from "@/lib/odartSite";
import {
  RAFAL_KOWALKOWSKI_PROFILE_PATH,
  RAFAL_KOWALKOWSKI_KOMPOZYCJA_FOTO_PATH,
  RAFAL_KOWALKOWSKI_TROJPODZIAL_FOTO_PATH,
  RAFAL_KOWALKOWSKI_ZLOTA_PROPORCJA_PRZYKLADY_PATH,
  RAFAL_KOWALKOWSKI_ZLOTY_PODZIAL_FOTO_ODART_HREF,
  RAFAL_KOWALKOWSKI_ZLOTY_PODZIAL_FOTO_WP_SOURCE,

  RAFAL_KOWALKOWSKI_ZLOTY_PODZIAL_FOTO_PATH,} from "@/lib/rafalKowalkowskiGallery";
import { buildRafalWebPageJsonLd } from "@/lib/rafalKowalkowskiSeo";

const jost = Jost({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const SITE = ODART_SITE_URL.replace(/\/$/, "");

const HERO = {
  src: "https://rafalkowalkowski.pl/wp-content/uploads/2023/03/odart_show_golden_proportion_in_composition_photography_art_262bbd9d-7f02-45cf-b7a9-dab25263264e.jpg",
  w: 800,
  h: 462,
} as const;

const IMG_LINE = {
  src: "https://rafalkowalkowski.pl/wp-content/uploads/2023/03/gloden-ratio-photography-1.jpg",
  w: 568,
  h: 102,
} as const;

const IMG_RECT = {
  src: "https://rafalkowalkowski.pl/wp-content/uploads/2023/03/golden-ratio-photography03-1.jpg",
  w: 604,
  h: 388,
} as const;

const IMG_SPIRAL = {
  src: "https://rafalkowalkowski.pl/wp-content/uploads/2023/03/spirala.png",
  w: 1000,
  h: 623,
} as const;

const jsonLd = buildRafalWebPageJsonLd(RAFAL_KOWALKOWSKI_ZLOTY_PODZIAL_FOTO_PATH, "Złoty podział w fotografii — Rafał Kowalkowski");


function Figure({ children }: { children: ReactNode }) {
  return (
    <figure className="my-8 overflow-hidden rounded-xl border border-white/10 bg-black/30 p-3 sm:p-4">{children}</figure>
  );
}

export function OdartRafalKowalkowskiZlotyPodzialFotografiaPage() {
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
                <span className="text-white">Złota proporcja w fotografii</span>
              </li>
            </ol>
          </nav>

          <header className="mt-8 border-b border-white/10 pb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-odart-accent">Edukacja</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
              Złota proporcja w fotografii
            </h1>
            <time className="mt-4 block text-sm text-neutral-500" dateTime="2023-03-07">
              7 marca 2023
            </time>
            <p className="mt-2 text-xs text-neutral-600">
              Treść i ilustracje zgodne z wpisem na{" "}
              <a
                href={RAFAL_KOWALKOWSKI_ZLOTY_PODZIAL_FOTO_WP_SOURCE}
                className="text-odart-accent/90 underline decoration-odart-accent/30 underline-offset-2 hover:decoration-odart-accent"
                rel="noopener noreferrer"
                target="_blank"
              >
                rafalkowalkowski.pl
              </a>
              .
            </p>
          </header>

          <div className="relative mx-auto mt-10 aspect-[800/462] w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-neutral-900">
            <Image
              src={HERO.src}
              alt="Kompozycja fotograficzna ze złotą proporcją"
              width={HERO.w}
              height={HERO.h}
              className="h-full w-full object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>

          <article className="prose prose-invert prose-neutral mt-12 max-w-none prose-p:text-neutral-400 prose-p:leading-relaxed prose-headings:scroll-mt-28 prose-headings:font-semibold prose-headings:text-white prose-h2:mt-10 prose-h2:text-xl prose-h2:sm:text-2xl prose-strong:text-neutral-200">
            <h2>Złota proporcja w fotografii</h2>
            <p>
              Złota proporcja jest stosowana na wiele różnych sposobów i jest znana pod różnymi nazwami. Niektóre z nazw
              to spirala Fibonacciego, złota spirala lub boska proporcja.
            </p>
            <p>
              Złota proporcja to sposób tworzenia sztuki, obrazu i architektury, który jest przyjemny dla ludzkiego oka.
            </p>

            <h2 id="czym">Czym jest złota proporcja w fotografii?</h2>
            <p>
              Złota proporcja to stosunek około 1,618 do 1. Artyści od wieków wykorzystują ten stosunek do tworzenia dzieł
              sztuki, od obrazów po architekturę. Beethoven używa go w swojej słynnej V Symfonii. Ta proporcja jest
              wszędzie wokół nas, w tym w naszych własnych ciałach.
            </p>
            <p>
              Aby zobaczyć i zrozumieć złotą proporcję, weźmy linię i podzielmy ją na dwie części. Jeśli zastosujemy złoty
              podział, będzie to wyglądać jak na poniższym obrazku, gdzie A to dłuższy bok (1,618), a B to krótszy bok
              (1).
            </p>

            <Figure>
              <Image
                src={IMG_LINE.src}
                alt="Podział odcinka na części A i B według złotej proporcji"
                width={IMG_LINE.w}
                height={IMG_LINE.h}
                className="mx-auto h-auto w-full max-w-full object-contain"
              />
            </Figure>

            <p>
              Złota proporcja polega na podzieleniu dowolnego odcinka na dwie części tak, aby całość miała się tak do
              większej części, jak większa część do mniejszej.
            </p>
            <p>
              Już w starożytności znano tę definicję, gdyż znalazła się w jednej z najważniejszych ksiąg w dziejach
              ludzkości — „Elementach Geometrii” Euklidesa.
            </p>
            <p>
              Wartość liczbowa tego podziału wynosi w przybliżeniu 1,618 i nazywana jest złotą liczbą Φ (fi).
            </p>
            <p>
              Ze złotą liczbą związany jest <strong>ciąg Fibonacciego</strong>, który tworzymy zaczynając od dwóch
              jedynek, po czym każda następna liczba w ciągu jest sumą dwóch poprzednich.
            </p>
            <p>Ciąg Fibonacciego: 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, …</p>
            <p>
              Co ten ciąg ma wspólnego ze złotą liczbą? Otóż dzieląc dowolną liczbę ciągu Fibonacciego przez liczbę ją
              poprzedzającą otrzymamy wynik oscylujący wokół 1,618… czyli złotej liczby Φ (fi).
            </p>
            <p>
              Dla artystów moc złotego podziału zaczyna się, gdy stosunek ten jest stosowany do kształtów. Skonstruujmy
              najpierw tak zwany złoty prostokąt. Robimy to, biorąc dłuższy bok linii, który oznaczyliśmy literą A, i
              dopasowując tę długość, aby utworzyć krótsze boki prostokąta.
            </p>
            <p>
              W literaturze anglojęzycznej mówi się o tworzeniu złotego prostokąta. Tak naprawdę zdjęcie, które jest
              prostokątne, musimy podzielić na kwadrat i prostokąt. Dla przykładu poniżej, gdzie można obliczyć wartości
              boków złotego prostokąta:
            </p>

            <Figure>
              <Image
                src={IMG_RECT.src}
                alt="Złoty prostokąt — podział na kwadrat i mniejszy prostokąt"
                width={IMG_RECT.w}
                height={IMG_RECT.h}
                className="mx-auto h-auto w-full max-w-full object-contain"
              />
            </Figure>

            <p>
              jest jasne, że (a+b) dzielone przez (a) daje w przybliżeniu złotą liczbę. Jeżeli zaczniemy dzielić
              pozostałe prostokąty w ten sam sposób, to otrzymamy kształty, które układają się w określony sposób i po
              połączeniu ich linią otrzymamy złotą spiralę. Jest to ciąg Fibonacciego.
            </p>

            <Figure>
              <Image
                src={IMG_SPIRAL.src}
                alt="Złota spirala złożona z prostokątów o bokach z ciągu Fibonacciego"
                width={IMG_SPIRAL.w}
                height={IMG_SPIRAL.h}
                className="mx-auto h-auto w-full max-w-full object-contain"
              />
            </Figure>

            <p>
              Około 92% roślin o filotaksji skrętoległej charakteryzuje się skręceniem opisywanym za pomocą liczb ciągu
              Fibonacciego. Przykładem tego są choćby spirale ułożeń nasion w takich kwiatach jak słonecznik lub
              stokrotka. Liczba płatków w kwiatach też zwykle jest liczbą z ciągu Fibonacciego — a nawet układ liści na
              łodydze zazwyczaj jest zgodny z tą regułą.
            </p>
            <p>
              Złotą spiralę przypominają muszle ślimaków i wiele innych naturalnych zjawisk jak na przykład huragany.
            </p>
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
                <Link href={RAFAL_KOWALKOWSKI_TROJPODZIAL_FOTO_PATH} className="font-semibold text-odart-accent hover:underline">
                  Kompozycja – Trójpodział →
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
