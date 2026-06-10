import Image from "next/image";
import Link from "next/link";
import { Jost } from "next/font/google";
import { ChevronRight } from "lucide-react";
import { OdartPublicShell } from "@/components/odart/OdartPublicShell";
import { ODART_SITE_URL } from "@/lib/odartSite";
import { RAFAL_KOWALKOWSKI_PROFILE_PATH, RAFAL_KOWALKOWSKI_USLUGI_INFORMATYCZNE_PATH } from "@/lib/rafalKowalkowskiGallery";
import { rafalPublicHref } from "@/lib/rafalKowalkowskiLegacyRoutes";
import { RAFAL_SERVICE_IMAGE } from "@/lib/rafalKowalkowskiMedia";
import { buildRafalWebPageJsonLd } from "@/lib/rafalKowalkowskiSeo";

const jost = Jost({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const SITE = ODART_SITE_URL.replace(/\/$/, "");

const HERO = RAFAL_SERVICE_IMAGE.informatyka;

const SHORT_POINTS = [
  "Projektowanie, instalacja i konfiguracja sieci lokalnych dla firm.",
  "Konfiguracja routerów, switchy i inne urządzenia sieciowe.",
  "Zapewnienie bezpieczeństwa sieci, w tym zabezpieczenia przed atakami, ochrona przed nieautoryzowanym dostępem itd.",
  "Diagnozowanie i naprawa problemów związanych z sieciami lokalnymi i komputerowymi.",
  "Optymalizacja wydajności sieci oraz dostosowanie do potrzeb klienta.",
] as const;

const SECTIONS: { title: string; bullets: readonly string[] }[] = [
  {
    title: "Sieci lokalne i komputerowe",
    bullets: [
      "Projektowanie, instalacja i konfiguracja sieci lokalnych dla firm.",
      "Konfiguracja routerów, switchy i inne urządzenia sieciowe.",
      "Zapewnienie bezpieczeństwa sieci, w tym zabezpieczenia przed atakami, ochrona przed nieautoryzowanym dostępem itd.",
      "Diagnozowanie i naprawa problemów związanych z sieciami lokalnymi i komputerowymi.",
      "Optymalizacja wydajności sieci oraz dostosowanie do potrzeb klienta.",
    ],
  },
  {
    title: "Integracja baz danych Comarch Optima i Enova",
    bullets: [
      "Konfiguracja i integracja systemów ERP (Enterprise Resource Planning) Comarch Optima i Enova z istniejącymi infrastrukturami informatycznymi.",
      "Transfer danych między różnymi bazami danych.",
      "Zapewnienie spójności i bezpieczeństwa danych w procesie integracji.",
    ],
  },
  {
    title: "Kopie zapasowe baz danych w chmurze",
    bullets: [
      "Konfiguracja i zarządzanie systemami kopii zapasowych w chmurze, takimi jak AWS (Amazon Web Services), Microsoft Azure, Google Cloud itp.",
      "Planowanie i automatyzacja procesu tworzenia kopii zapasowych w chmurze.",
      "Zapewnienie bezpieczeństwa i odtwarzalności danych w przypadku awarii systemu lub utraty danych.",
    ],
  },
  {
    title: "Audyt sieci komputerowej",
    bullets: [
      "Przegląd istniejącej infrastruktury sieciowej i komputerowej w celu identyfikacji słabych punktów i zagrożeń.",
      "Ocena zgodności z najlepszymi praktykami branżowymi i standardami bezpieczeństwa.",
      "Raportowanie i rekomendacje dotyczące poprawy wydajności, bezpieczeństwa i stabilności sieci.",
    ],
  },
];

const jsonLd = buildRafalWebPageJsonLd(RAFAL_KOWALKOWSKI_USLUGI_INFORMATYCZNE_PATH, "Usługi informatyczne Kołobrzeg — Rafał Kowalkowski");


export function OdartRafalKowalkowskiUslugiInformatycznePage() {
  return (
    <OdartPublicShell jsonLd={jsonLd}>
      <div className={`${jost.className} bg-[#0f0f0f] text-neutral-300`}>
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <nav className="text-sm text-neutral-500" aria-label="Ścieżka nawigacji">
            <ol className="flex flex-wrap items-center gap-1">
              <li>
                <Link href={rafalPublicHref(RAFAL_KOWALKOWSKI_PROFILE_PATH)} className="transition hover:text-white">
                  Rafał Kowalkowski
                </Link>
              </li>
              <li className="flex items-center gap-1">
                <ChevronRight className="h-4 w-4 text-neutral-600" aria-hidden />
                <span className="text-neutral-400">Informatyka</span>
              </li>
              <li className="flex items-center gap-1">
                <ChevronRight className="h-4 w-4 text-neutral-600" aria-hidden />
                <span className="text-white">Usługi informatyczne Kołobrzeg</span>
              </li>
            </ol>
          </nav>

          <header className="mt-8 border-b border-white/10 pb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-odart-accent">Informatyka</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
              Usługi informatyczne Kołobrzeg
            </h1>
            <p className="mt-4 text-2xl font-semibold text-odart-accent">300,00 zł</p>
            <p className="mt-2 text-sm text-neutral-500">Orientacyjna stawka — dokładny zakres ustalamy po kontakcie.</p>
          </header>

          <div className="relative mt-10 aspect-[800/427] w-full overflow-hidden rounded-2xl border border-white/10 bg-neutral-900">
            <Image
              src={HERO.src}
              alt="Usługi informatyczne Kołobrzeg"
              width={HERO.w}
              height={HERO.h}
              className="h-full w-full object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>

          <ul className="mt-10 list-disc space-y-2 pl-5 text-base leading-relaxed text-neutral-400">
            {SHORT_POINTS.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>

          <div className="mt-12 space-y-10">
            <p className="text-lg leading-relaxed text-neutral-300">
              Oferowana usługa obejmuje szeroki zakres obsługi informatycznej, w tym:
            </p>
            {SECTIONS.map((sec, i) => (
              <section key={sec.title} aria-labelledby={`sec-${i}`}>
                <h2 id={`sec-${i}`} className="text-xl font-semibold text-white">
                  {i + 1}. {sec.title}
                </h2>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-relaxed text-neutral-400">
                  {sec.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </section>
            ))}
            <p className="border-t border-white/10 pt-8 text-base leading-relaxed text-neutral-400">
              Kluczowe dla tej usługi jest zapewnienie kompleksowego wsparcia informatycznego, obejmującego zarówno
              infrastrukturę sieciową, jak i systemy bazodanowe, wraz z audytem, zapewnieniem bezpieczeństwa danych oraz
              integracją oprogramowania ERP. Dzięki temu klienci mogą skoncentrować się na swojej działalności, mając
              pewność, że ich infrastruktura informatyczna działa sprawnie i bezpiecznie.
            </p>
          </div>

          <footer className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-10 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href={rafalPublicHref(RAFAL_KOWALKOWSKI_PROFILE_PATH)}
              className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:border-odart-accent/50"
            >
              Wróć do profilu
            </Link>
            <Link
              href={`${SITE}/kontakt/`}
              className="inline-flex items-center justify-center rounded-full bg-odart-accent px-6 py-3 text-sm font-semibold text-white shadow-md shadow-orange-950/25 transition hover:brightness-110"
            >
              Zapytaj o wycenę
            </Link>
          </footer>
        </div>
      </div>
    </OdartPublicShell>
  );
}
