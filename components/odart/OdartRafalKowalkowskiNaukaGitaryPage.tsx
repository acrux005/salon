import Image from "next/image";
import Link from "next/link";
import { Jost } from "next/font/google";
import { ChevronRight } from "lucide-react";
import { OdartPublicShell } from "@/components/odart/OdartPublicShell";
import { ODART_SITE_URL } from "@/lib/odartSite";
import {
  RAFAL_KOWALKOWSKI_NAUKA_GITARY_PATH,
  RAFAL_KOWALKOWSKI_PROFILE_PATH,
  RAFAL_KOWALKOWSKI_ZAJECIA_WOKALNE_PATH,
} from "@/lib/rafalKowalkowskiGallery";
import { rafalMediaUrl } from "@/lib/rafalKowalkowskiMedia";
import { rafalPublicHref } from "@/lib/rafalKowalkowskiLegacyRoutes";
import { buildRafalGuitarLessonsJsonLd } from "@/lib/rafalKowalkowskiSeo";

const jost = Jost({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const SITE = ODART_SITE_URL.replace(/\/$/, "");

const HERO = {
  src: rafalMediaUrl(
    "https://rafalkowalkowski.pl/wp-content/uploads/2023/12/odart._A_guitarist_is_making_chords_by_looking_at_his_guitar__c43550c8-dc58-48f3-8ae8-20d37cc6374e_1.jpg",
  ),
  w: 400,
  h: 400,
} as const;

const FAQ = [
  {
    q: "Dla kogo są lekcje gitary w Kołobrzegu?",
    a: "Dla dzieci, młodzieży i dorosłych — od zupełnych początkujących po osoby, które chcą grać piosenki z tekstem, poprawić rytm albo przygotować się do nagrania.",
  },
  {
    q: "Czy prowadzisz zajęcia online?",
    a: "Tak. Część uczniów łączy spotkania w Kołobrzegu z lekcjami przez kamerę — przesyłam materiały, ćwiczenia i nagrania referencyjne między wizytami.",
  },
  {
    q: "Gitara akustyczna czy elektryczna?",
    a: "Obie. Na start często wybierana jest gitara akustyczna (prostszy start, akompaniament). Gitara elektryczna sprawdza się w rocku, popie i przy pracy ze wzmacniaczem.",
  },
  {
    q: "Jak wygląda pierwsza lekcja?",
    a: "Krótka rozmowa o celach, sprawdzenie poziomu, dobór repertuaru i pierwsze ćwiczenia — akordy, prosty riff lub akompaniament do ulubionej piosenki.",
  },
] as const;

const jsonLd = buildRafalGuitarLessonsJsonLd(RAFAL_KOWALKOWSKI_NAUKA_GITARY_PATH);

export function OdartRafalKowalkowskiNaukaGitaryPage() {
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
                <span className="text-white">Nauka gry na gitarze Kołobrzeg</span>
              </li>
            </ol>
          </nav>

          <header className="mt-8 border-b border-white/10 pb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-odart-accent">Edukacja · Kołobrzeg</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
              Nauka gry na gitarze Kołobrzeg
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-neutral-300">
              Indywidualne lekcje gitary akustycznej i elektrycznej — dla dzieci i dorosłych, na miejscu w{" "}
              <strong className="font-medium text-white">Kołobrzegu</strong> lub online. Gram od lat, nagrywam własne
              utwory i na co dzień łączę gitarę z wokalem oraz produkcją muzyczną w studio ACRUX.
            </p>
          </header>

          <div className="relative mt-10 aspect-square w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-neutral-900">
            <Image
              src={HERO.src}
              alt="Lekcje gitary w Kołobrzegu — ćwiczenie akordów na gitarze"
              width={HERO.w}
              height={HERO.h}
              className="h-full w-full object-cover"
              sizes="(max-width: 768px) 100vw, 448px"
              priority
            />
          </div>

          <article className="prose prose-invert prose-neutral mt-12 max-w-none prose-p:text-neutral-400 prose-p:leading-relaxed prose-headings:scroll-mt-28 prose-headings:font-semibold prose-headings:text-white prose-h2:mt-12 prose-h2:text-xl prose-h2:sm:text-2xl prose-li:text-neutral-400">
            <p>
              Szukasz <strong className="text-neutral-200">nauki gry na gitarze w Kołobrzegu</strong>? Prowadzę lekcje
              indywidualne dopasowane do wieku, poziomu i celu — od pierwszych akordów, przez grę towarzyszącą
              śpiewowi, po przygotowanie do nagrania w domowym studiu. Muzyka towarzyszy mi od dzieciństwa: gram na
              gitarze, śpiewam, komponuję i nagrywam — m.in. udział w programach telewizyjnych oraz własne produkcje
              pod marką ACRUX.
            </p>

            <h2 id="oferta">Co obejmują lekcje gitary</h2>
            <ul>
              <li>postawa prawidłowa i technika lewej oraz prawej ręki,</li>
              <li>akordy, przejścia, proste riffy i akompaniament do piosenek,</li>
              <li>rytm, metronom i grę w tempie (także z podkładem),</li>
              <li>czytanie diagramów akordów i podstawy teorii „od razu w praktyce”,</li>
              <li>przygotowanie do występu, nagrania lub wspólnej pracy ze śpiewem.</li>
            </ul>
            <p>
              Na zajęciach wokalnych regularnie ćwiczę śpiew do akompaniamentu gitary — wiem, jak połączyć głos i
              instrument na scenie i w nagraniu. Jeśli interesuje Cię śpiew, zobacz także{" "}
              <Link
                href={rafalPublicHref(RAFAL_KOWALKOWSKI_ZAJECIA_WOKALNE_PATH)}
                className="text-odart-accent no-underline hover:underline"
              >
                zajęcia wokalne w Kołobrzegu
              </Link>
              .
            </p>

            <h2 id="dla-kogo">Dla kogo</h2>
            <p>
              <strong className="text-neutral-200">Lekcje gitary Kołobrzeg</strong> — stacjonarnie, gdy mieszkasz w
              mieście lub okolicy (Gmina Kołobrzeg, Ustronie, Dźwirzyno, Grzybowo). Dla osób z dalsza oferuję
              zajęcia online z tym samym programem i materiałami do ćwiczeń w domu. Pracuję z uczniami w każdym
              wieku: dzieci od ok. 8–10 lat (w zależności od koncentracji), młodzież i dorośli.
            </p>

            <h2 id="gitara-akustyczna">Gitara akustyczna i elektryczna</h2>
            <p>
              Na start polecam często gitarkę akustyczną — słychać każdy dźwięk, łatwiej budować palce i grać przy
              ognisku czy w domu. Gitara elektryczna to świetny wybór, jeśli marzysz o rocku, bluesie lub grze ze
              wzmacniaczem. W studio nagrywam zarówno gitarę akustyczną, jak i elektryczną — mogę pokazać, jak brzmi
              profesjonalne nagranie i co ćwiczyć, żeby do niego dojść.
            </p>

            <h2 id="studio">Gitara i nagrania</h2>
            <p>
              Dla bardziej zaawansowanych uczniów łączę naukę z podstawami nagrywania: jak ustawić mikrofon, jak
              dograć partię rytmiczną lub solówkę, jak zsynchronizować gitarę z wokalem. To naturalne przedłużenie
              mojej pracy studyjnej — nagrania wokalu, podkładów i teledysków w regionie zachodniopomorskim.
            </p>

            <h2 id="faq">Najczęstsze pytania</h2>
            <dl className="not-prose space-y-8">
              {FAQ.map((item) => (
                <div key={item.q}>
                  <dt className="text-base font-semibold text-white">{item.q}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-neutral-400">{item.a}</dd>
                </div>
              ))}
            </dl>
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
              Umów lekcję gitary
            </Link>
          </footer>
        </div>
      </div>
    </OdartPublicShell>
  );
}
