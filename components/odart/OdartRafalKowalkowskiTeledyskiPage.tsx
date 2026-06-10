import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Jost, Syne } from "next/font/google";
import { ChevronRight } from "lucide-react";
import { OdartPublicShell } from "@/components/odart/OdartPublicShell";
import { OdartRafalKowalkowskiYoutubeGallery } from "@/components/odart/OdartRafalKowalkowskiYoutubeGallery";
import { ODART_SITE_URL } from "@/lib/odartSite";
import {
  RAFAL_KOWALKOWSKI_PROFILE_PATH,
  RAFAL_KOWALKOWSKI_TELEDYSKI_ODART_HREF,
  RAFAL_KOWALKOWSKI_TELEDYSKI_WP_SOURCE,

  RAFAL_KOWALKOWSKI_TELEDYSKI_PATH,} from "@/lib/rafalKowalkowskiGallery";
import { buildRafalWebPageJsonLd } from "@/lib/rafalKowalkowskiSeo";

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

const HERO_BG = {
  src: "https://rafalkowalkowski.pl/wp-content/uploads/2023/02/3P4A7847-3.jpg",
  w: 800,
  h: 800,
} as const;

const WEDDING_IMG = {
  src: "https://rafalkowalkowski.pl/wp-content/uploads/2025/03/odart._hyper_realistic_photo_of_an_Armenian_bride_and_groom_i_2ba27b22-a9ed-4c77-9827-8abe9ae02be7_2-1024x574.jpg",
  w: 1024,
  h: 574,
} as const;

const STUDIO_STATS = [
  {
    label: "Scenariusz",
    pct: 90,
    text: "Scenariusz to podstawa każdego filmu. Na tym etapie powstaje koncepcja całego projektu.",
  },
  {
    label: "Produkcja",
    pct: 80,
    text: "Etap produkcji to rzeczywiste nagrywanie scen na podstawie scenariusza i aranżacji.",
  },
  {
    label: "Montaż",
    pct: 95,
    text: "Montaż to etap, na którym surowy materiał filmowy przekształcany jest w gotowy film.",
  },
  {
    label: "Aranżacja",
    pct: 75,
    text: "Etap aranżacji obejmuje przygotowanie wszystkich elementów potrzebnych do realizacji filmu zgodnie ze scenariuszem.",
  },
] as const;

const PROCESS = [
  {
    n: "1",
    title: "Koncepcja i scenariusz",
    lines: [
      "Analiza utworu i opracowanie pomysłu na klimat, historię, symbolikę.",
      "Tworzenie scenariusza, podział na ujęcia, planowanie lokalizacji i stylistyki.",
    ],
  },
  {
    n: "2",
    title: "Preprodukcja (przygotowania)",
    lines: [
      "Dobór lokacji, aktorów, stylizacji, rekwizytów.",
      "Organizacja ekipy filmowej i sprzętu.",
      "Tworzenie harmonogramu zdjęć.",
    ],
  },
  {
    n: "3",
    title: "Produkcja (nagrania)",
    lines: [
      "Realizacja zdjęć zgodnie ze scenariuszem.",
      "Nagranie kilku wersji (np. pełne wykonanie, detale, slow motion) dla swobody montażu.",
    ],
  },
  {
    n: "4",
    title: "Postprodukcja (montaż)",
    lines: [
      "Montaż ujęć pod rytm i dynamikę muzyki.",
      "Kolor korekcja, efekty wizualne, animacje.",
      "Synchronizacja ruchu ust i instrumentów z dźwiękiem.",
      "Finalna wersja dostosowana do YouTube, TV, social media.",
    ],
  },
] as const;

const jsonLd = buildRafalWebPageJsonLd(RAFAL_KOWALKOWSKI_TELEDYSKI_PATH, "Teledyski — Rafał Kowalkowski");


function RingStat({ label, pct, text }: { label: string; pct: number; text: string }) {
  const r = 54;
  const c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative">
        <svg width="132" height="132" viewBox="0 0 132 132" className="-rotate-90" aria-hidden>
          <circle cx="66" cy="66" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
          <circle
            cx="66"
            cy="66"
            r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${c}`}
            className="text-odart-accent"
          />
        </svg>
        <span
          className={`absolute inset-0 z-10 flex items-center justify-center text-2xl font-bold tabular-nums text-white ${syne.className}`}
        >
          {pct}%
        </span>
      </div>
      <p className={`mt-5 text-sm font-semibold uppercase tracking-[0.2em] text-odart-accent ${syne.className}`}>{label}</p>
      <p className="mt-3 max-w-[16rem] text-sm leading-relaxed text-neutral-500">{text}</p>
    </div>
  );
}

function SectionShell({
  id,
  eyebrow,
  title,
  children,
  dark = true,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
  dark?: boolean;
}) {
  return (
    <section
      id={id}
      className={`relative scroll-mt-24 border-t border-white/10 py-20 sm:py-28 ${dark ? "bg-[#0a0a0a]" : "bg-[#111]"}`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className={`text-[10px] font-bold uppercase tracking-[0.35em] text-odart-accent ${syne.className}`}>{eyebrow}</p>
        <h2 className={`mt-4 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl ${syne.className}`}>
          {title}
        </h2>
        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}

export function OdartRafalKowalkowskiTeledyskiPage() {
  return (
    <OdartPublicShell jsonLd={jsonLd}>
      <div className={`${jost.className} bg-black text-neutral-300`}>
        <nav
          className="absolute left-0 right-0 top-0 z-20 border-b border-white/5 bg-black/40 px-4 py-4 backdrop-blur-md sm:px-6 lg:px-8"
          aria-label="Ścieżka nawigacji"
        >
          <ol className="mx-auto flex max-w-6xl flex-wrap items-center gap-1 text-xs text-neutral-500 sm:text-sm">
            <li>
              <Link href={RAFAL_KOWALKOWSKI_PROFILE_PATH} className="transition hover:text-white">
                Rafał Kowalkowski
              </Link>
            </li>
            <li className="flex items-center gap-1">
              <ChevronRight className="h-3.5 w-3.5 text-neutral-600" aria-hidden />
              <span className="text-white">Teledyski</span>
            </li>
          </ol>
        </nav>

        {/* Hero — pełnoekranowy, „creative portfolio” */}
        <header className="relative min-h-[92vh] overflow-hidden">
          <Image
            src={HERO_BG.src}
            alt=""
            fill
            className="object-cover opacity-50"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(217,91,58,0.12),transparent_55%)]" />

          <div className="relative z-10 flex min-h-[92vh] flex-col justify-end px-4 pb-16 pt-28 sm:px-6 sm:pb-24 lg:px-8">
            <div className="mx-auto w-full max-w-6xl">
              <p className={`text-[10px] font-bold uppercase tracking-[0.4em] text-odart-accent sm:text-xs ${syne.className}`}>
                Film · Muzyka · Region
              </p>
              <div className="relative mt-6">
                <p
                  className={`pointer-events-none select-none text-[clamp(3.5rem,14vw,11rem)] font-extrabold leading-[0.85] tracking-tighter text-white/[0.06] sm:text-[clamp(4rem,16vw,12rem)] ${syne.className}`}
                  aria-hidden
                >
                  FILMY
                </p>
                <h1
                  className={`relative -mt-[0.2em] max-w-4xl text-[clamp(2.5rem,8vw,5.5rem)] font-bold leading-[0.95] tracking-tight text-white ${syne.className}`}
                >
                  Teledyski
                </h1>
              </div>
              <p className="mt-6 max-w-xl text-base text-neutral-400 sm:text-lg">
                Filmy i teledyski —{" "}
                <span className="text-neutral-200">Kołobrzeg · Koszalin · Szczecin · Zachodniopomorskie</span>
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href={`${SITE}/kontakt/`}
                  className={`inline-flex items-center justify-center rounded-full bg-odart-accent px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-950/40 transition hover:brightness-110 ${syne.className}`}
                >
                  Zapytaj o realizację
                </Link>
                <a
                  href={RAFAL_KOWALKOWSKI_TELEDYSKI_WP_SOURCE}
                  className="inline-flex items-center justify-center rounded-full border border-white/20 px-8 py-3.5 text-sm font-medium text-white transition hover:border-odart-accent/60"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Wersja na rafalkowalkowski.pl
                </a>
              </div>
            </div>
          </div>
        </header>

        <SectionShell id="realizacje" eyebrow="Portfolio wideo" title="Realizacje z YouTube" dark>
          <p className="-mt-6 mb-10 max-w-2xl text-base leading-relaxed text-neutral-500">
            Wybrane filmy z kanału{" "}
            <a
              href="https://www.youtube.com/channel/UCOp3fAgkkXzEOY3PgBk29jA"
              className="text-odart-accent hover:underline"
              rel="noopener noreferrer"
              target="_blank"
            >
              Rafał Kowalkowski na YouTube
            </a>
            . Kliknij miniaturę, aby odtworzyć.
          </p>
          <OdartRafalKowalkowskiYoutubeGallery />
        </SectionShell>

        <SectionShell eyebrow="Zakres" title="Filmy" dark>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <h3 className={`text-2xl font-semibold text-white sm:text-3xl ${syne.className}`}>Teledyski ślubne</h3>
              <p className="mt-6 text-base leading-relaxed text-neutral-400">
                Wybierając teledysk weselny, inwestujecie w niezapomnianą pamiątkę, która pozwoli Wam wracać do
                najpiękniejszych chwil Waszego ślubu i wesela. Profesjonalna ekipa zadba o to, by każdy ważny moment został
                uchwycony z największą starannością i pasją.
              </p>
            </div>
            <div className="relative aspect-[1024/574] overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/60">
              <Image src={WEDDING_IMG.src} alt="" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 55vw" />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/50 via-transparent to-transparent" />
            </div>
          </div>
        </SectionShell>

        <SectionShell id="studio" eyebrow="Proces" title="Moje studio filmowe" dark={false}>
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {STUDIO_STATS.map((s) => (
              <RingStat key={s.label} label={s.label} pct={s.pct} text={s.text} />
            ))}
          </div>
        </SectionShell>

        <SectionShell eyebrow="Pipeline" title="Film i muzyka" dark>
          <ul className="space-y-16 sm:space-y-20">
            {PROCESS.map((step) => (
              <li
                key={step.n}
                className="grid gap-6 border-l border-odart-accent/30 pl-6 sm:grid-cols-[auto_1fr] sm:gap-10 sm:pl-8 lg:pl-10"
              >
                <span
                  className={`text-5xl font-bold leading-none text-odart-accent/90 sm:text-6xl lg:text-7xl ${syne.className}`}
                  aria-hidden
                >
                  {step.n}
                </span>
                <div>
                  <h3 className={`text-xl font-semibold text-white sm:text-2xl ${syne.className}`}>{step.title}</h3>
                  <ul className="mt-5 space-y-3 text-neutral-400">
                    {step.lines.map((line) => (
                      <li key={line} className="flex gap-3 text-sm leading-relaxed sm:text-base">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-odart-accent" aria-hidden />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        </SectionShell>

        <footer className="border-t border-white/10 bg-[#0a0a0a] px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
            <Link
              href={RAFAL_KOWALKOWSKI_PROFILE_PATH}
              className="text-sm font-medium text-neutral-500 transition hover:text-white"
            >
              ← Profil Rafała
            </Link>
            <Link
              href={`${SITE}/kontakt/`}
              className={`inline-flex rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-black transition hover:bg-neutral-200 ${syne.className}`}
            >
              Kontakt — wycena
            </Link>
          </div>
        </footer>
      </div>
    </OdartPublicShell>
  );
}
