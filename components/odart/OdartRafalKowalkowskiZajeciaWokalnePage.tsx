import Image from "next/image";
import Link from "next/link";
import { Jost } from "next/font/google";
import { ChevronRight } from "lucide-react";
import { OdartPublicShell } from "@/components/odart/OdartPublicShell";
import { ODART_SITE_URL } from "@/lib/odartSite";
import {
  RAFAL_KOWALKOWSKI_NAUKA_GITARY_PATH,
  RAFAL_KOWALKOWSKI_PROFILE_PATH,
  RAFAL_KOWALKOWSKI_ZAJECIA_WOKALNE_WP_SOURCE,
  RAFAL_KOWALKOWSKI_ZAJECIA_WOKALNE_PATH,
} from "@/lib/rafalKowalkowskiGallery";
import { rafalPublicHref } from "@/lib/rafalKowalkowskiLegacyRoutes";
import { RAFAL_SERVICE_IMAGE } from "@/lib/rafalKowalkowskiMedia";
import { buildRafalWebPageJsonLd } from "@/lib/rafalKowalkowskiSeo";

const jost = Jost({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const SITE = ODART_SITE_URL.replace(/\/$/, "");

const HERO = RAFAL_SERVICE_IMAGE.wokal;

const jsonLd = buildRafalWebPageJsonLd(RAFAL_KOWALKOWSKI_ZAJECIA_WOKALNE_PATH, "Zajęcia wokalne — Rafał Kowalkowski");


export function OdartRafalKowalkowskiZajeciaWokalnePage() {
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
                <span className="text-white">Zajęcia wokalne Kołobrzeg</span>
              </li>
            </ol>
          </nav>

          <header className="mt-8 border-b border-white/10 pb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-odart-accent">Edukacja</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
              Zajęcia wokalne Kołobrzeg
            </h1>
            <p className="mt-2 text-xl font-medium text-neutral-200">Zajęcia wokalne</p>
            <time className="mt-4 block text-sm text-neutral-500" dateTime="2023-03-27">
              27 marca 2023
            </time>
            <p className="mt-2 text-xs text-neutral-600">
              Treść zgodna z wpisem na{" "}
              <a
                href={RAFAL_KOWALKOWSKI_ZAJECIA_WOKALNE_WP_SOURCE}
                className="text-odart-accent/90 underline decoration-odart-accent/30 underline-offset-2 hover:decoration-odart-accent"
                rel="noopener noreferrer"
                target="_blank"
              >
                rafalkowalkowski.pl
              </a>
              .
            </p>
          </header>

          <div className="relative mt-10 aspect-[800/533] w-full overflow-hidden rounded-2xl border border-white/10 bg-neutral-900">
            <Image
              src={HERO.src}
              alt="Zajęcia wokalne w studiu — Kołobrzeg"
              width={HERO.w}
              height={HERO.h}
              className="h-full w-full object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>

          <article className="prose prose-invert prose-neutral mt-12 max-w-none prose-p:text-neutral-400 prose-p:leading-relaxed prose-headings:scroll-mt-28 prose-headings:font-semibold prose-headings:text-white prose-h2:mt-12 prose-h2:text-xl prose-h2:sm:text-2xl">
            <p>
              Prowadzę zajęcia wokalno/muzyczne dla dzieci i dorosłych, również online. Ćwiczymy wybrane piosenki,
              nagrywamy i na koniec tworzymy teledysk.
            </p>
            <p>
              Od 15 roku życia jestem związany z muzyką. Przez cały ten czas doskonalę swój głos i sam brałem lekcje u
              trenerów wokalnych, żeby poznać tajniki śpiewu. Mój upór zaowocował udziałem w The Voice of Poland w roku
              2021. Do programu dostałem się poprzez prezentację dwóch piosenek: „List do M” Dżemu oraz „Pumped up Kicks”
              Foster the People w wersji na gitarę wykonywanej przez jednego z poprzednich uczestników programu. W roku
              2022 wziąłem udział w Szansie na Sukces i śpiewałem piosenki zespołu Piersi.
            </p>
            <p>
              Stworzyłem kilkanaście własnych utworów i mam wiele pomysłów na własną muzykę. To czego nauczyłem się sam,
              chciałbym przekazywać młodym osobom, a w szczególności tworzyć z nimi muzykę.
            </p>
            <p>
              Nagrania w studio podsunęły mi pomysł, że sam mogę nagrywać swój własny wokal. Kupiłem sprzęt i zbudowałem
              małą kabinę wokalną, żeby dźwięk był jak najlepszy. Po dwóch latach ćwiczeń jestem w stanie nagrać piosenkę
              w jakości studyjnej oraz za pomocą oprogramowania osadzić go w odpowiednich dźwiękach, wedle potrzeby.
              Udoskonaliłem technikę nagrywania gitary akustycznej.
            </p>

            <h2 id="cwiczenia">Ćwiczenia wokalne</h2>
            <p>
              W międzyczasie zdałem sobie sprawę, że tylko ćwiczenia oddechowe i ćwiczenia wokalne pomogą mi w
              osiągnięciu sukcesu i w tej chwili powiększyłem swoją skalę do dwóch oktaw. W ten sposób mogę zaśpiewać
              utwory, które nigdy nie były dla mnie dostępne. Dlatego też wielką wagę przykładam do ćwiczeń, które zawsze
              są częścią mojej pracy z wokalem. Z tego tytułu zawsze do 15 minut są ćwiczenia wokalne. Oczywiście można
              je zrobić w domu przed zajęciami.
            </p>
            <p>
              Drugim elementem ćwiczeń jest śpiewanie do akompaniamentu gitary. Wyrabia to sztukę współpracy z drugą
              osobą na scenie i śpiewanie w odpowiednim tempie. Z kolei samo tempo jest ćwiczone jako śpiewanie do
              „kliku”, co przyzwyczaja do odpowiedniego rytmu. Prowadzę też{" "}
              <Link
                href={rafalPublicHref(RAFAL_KOWALKOWSKI_NAUKA_GITARY_PATH)}
                className="text-odart-accent no-underline hover:underline"
              >
                lekcje gitary w Kołobrzegu
              </Link>
              .
            </p>

            <h2 id="kabina">Kabina wokalna</h2>
            <p>
              W kabinie wokalnej ćwiczymy wybrane piosenki fragmentami. Każdy fragment ćwiczymy do satysfakcjonującego
              poziomu, przy sprawdzeniu dźwięków i układu. Piosenka jest rozbita przeze mnie na dźwięki, co jest
              przygotowane przed zajęciami, tak aby jak najwierniej odtworzyć technikę śpiewania autora piosenki. Jest to
              najlepsza nauka coverów, przede wszystkim dlatego, że słuchamy najpierw oryginału, a potem próbujemy
              odtworzyć intencję autora. Oczywiście nic nie stoi na przeszkodzie, żeby improwizować, czy też wymyślać
              własną linię melodyczną (jeśli nie jesteśmy w stanie osiągnąć odpowiedniej skali), ale w ten sposób uczymy
              się zupełnie nowych rzeczy.
            </p>
            <p>
              Piosenki sprawdzamy programem Melodyne. Tu nie ma śpiewania na „czuja”, bo przed programem nic się nie
              ukryje i jest w stanie pokazać nawet ładne vibratto, a o odpowiedniej wysokości dźwięku nie wspominając :)
            </p>
            <p>
              Podkład do piosenek można zakupić na stronach internetowych lub też dograć gitarę, co zwykle robię przed
              zajęciami.
            </p>
            <p>
              Ideą zajęć jest nagranie coveru i ewentualnie zrobienie do niego teledysku, tak żeby pokazać go w sieci.
              Można próbować tworzyć własne utwory, co też jest super wyzwaniem.
            </p>
            <p>Efekt końcowy zajęć to nagranie filmu do piosenki.</p>
            <p>
              Uwagę też zwracam na język angielski. W studio ćwiczymy wymowę poszczególnych słówek w razie potrzeby i
              używanie odpowiedniego akcentu.
            </p>
          </article>

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
              Zapytaj o zajęcia
            </Link>
          </footer>
        </div>
      </div>
    </OdartPublicShell>
  );
}
