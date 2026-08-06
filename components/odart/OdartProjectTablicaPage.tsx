import Link from "next/link";
import {
  ExternalLink,
  LayoutGrid,
  Mail,
  MessageSquare,
  Package,
  Scale,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { ODART_SITE_URL } from "@/lib/odartSite";
import { OdartPublicShell } from "@/components/odart/OdartPublicShell";

const SITE = ODART_SITE_URL;
const CANONICAL = `${SITE}/project/tablica/`;
const LIVE = "https://tablica.odart.pl/";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${CANONICAL}#webpage`,
      url: CANONICAL,
      name: "Tablica — ogłoszenia w całej Polsce | ODART",
      description:
        "Realizacja ODART: portal ogłoszeniowy Next.js z chatem, escrow PayU, dostawami InPost/Orlen, porównywarką, AI i i18n PL/EN.",
      isPartOf: { "@id": `${SITE}/#website` },
      inLanguage: "pl-PL",
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${CANONICAL}#app`,
      name: "Tablica Odart",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: LIVE,
      description:
        "Ogłoszenia rzeczy, usług i pracy w całej Polsce — bez prowizji od sprzedaży, z ochroną płatności i dostawą.",
      provider: { "@id": `${SITE}/#org` },
    },
    {
      "@type": "Organization",
      "@id": `${SITE}/#org`,
      name: "ODART — Ostry Dyżur Artystyczny",
      url: SITE,
      telephone: "+48695432415",
      email: "biuro@odart.pl",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Kołobrzeg",
        addressCountry: "PL",
      },
    },
  ],
};

const FEATURES = [
  {
    icon: LayoutGrid,
    title: "Ogłoszenia rzeczy, usług i pracy",
    text: "Jedna tablica: sprzedaż i zakupy, fachowcy oraz oferty pracy — filtry, kategorie, mapa i alerty wyszukiwania.",
  },
  {
    icon: MessageSquare,
    title: "Chat i negocjacje",
    text: "Wiadomości między użytkownikami, oferty cenowe w wątku i bezpośredni kontakt — bez pośredników.",
  },
  {
    icon: ShieldCheck,
    title: "Kupno z ochroną (escrow)",
    text: "Płatność PayU trafia na konto Tablicy; sprzedawca wysyła paczkę, kupujący potwierdza odbiór.",
  },
  {
    icon: Package,
    title: "InPost, Orlen, kurier",
    text: "Metody dostawy w ogłoszeniu: paczkomat, Orlen Paczka, kurier albo odbiór osobisty — z cenami wysyłki.",
  },
  {
    icon: Scale,
    title: "Porównywarka i feed XML",
    text: "Porównanie do 4 ogłoszeń obok siebie oraz eksport/import XML pod integracje i katalogi.",
  },
  {
    icon: Sparkles,
    title: "AI, push, i18n PL/EN",
    text: "Generowanie opisu AI, powiadomienia push i pełne tłumaczenie interfejsu polski / angielski.",
  },
] as const;

export function OdartProjectTablicaPage() {
  return (
    <OdartPublicShell activeNav="portfolio" jsonLd={jsonLd}>
      <article className="border-b border-white/10 px-4 py-10 lg:px-6 lg:py-14">
        <div className="mx-auto max-w-3xl">
          <nav className="text-sm text-neutral-500" aria-label="Ścieżka nawigacji">
            <Link href={`${SITE}/`} className="hover:text-odart-accent">
              Strona główna
            </Link>
            <span className="mx-2 text-neutral-600">/</span>
            <Link href={`${SITE}/portfolio/`} className="hover:text-odart-accent">
              Portfolio
            </Link>
            <span className="mx-2 text-neutral-600">/</span>
            <span className="text-neutral-300">Tablica</span>
          </nav>

          <p className="mt-8 text-sm font-medium uppercase tracking-wide text-odart-accent">
            Realizacja produktowa
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Tablica — ogłoszenia w całej Polsce
          </h1>
          <p className="mt-4 text-lg font-semibold text-neutral-200">ODART</p>
          <p className="mt-1 text-sm font-medium text-odart-accent">Aplikacje webowe · marketplace</p>
          <a
            href="mailto:biuro@odart.pl"
            className="mt-4 inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-odart-accent"
          >
            <Mail className="h-4 w-4 shrink-0" aria-hidden />
            biuro@odart.pl
          </a>
          <p className="mt-8 text-lg leading-relaxed text-neutral-300">
            Tablica to własny portal ogłoszeniowy ODART — wzorowany na dużych marketplace’ach, ale bez prowizji od
            sprzedaży. Kupujący i sprzedający kontaktują się bezpośrednio; opcjonalnie mogą domknąć transakcję z
            ochroną płatności i wysyłką InPost / Orlen / kurier.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={LIVE}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-odart-accent px-5 py-3 text-sm font-semibold text-white hover:brightness-110"
            >
              Otwórz tablica.odart.pl
              <ExternalLink className="h-4 w-4" aria-hidden />
            </a>
            <Link
              href={`${SITE}/kontakt/`}
              className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-5 py-3 text-sm font-semibold text-white hover:border-odart-accent/50 hover:text-odart-accent"
            >
              Zapytaj o podobny produkt
            </Link>
          </div>
        </div>
      </article>

      <section className="border-b border-white/10 px-4 py-12 lg:px-6 lg:py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Co zbudowaliśmy</h2>
          <p className="mt-4 text-neutral-400 leading-relaxed">
            Pełny produkt: konta użytkowników, ogłoszenia z galerią, panel sprzedawcy, moderacja, wyróżnienia PayU,
            ulubione, alerty, zamówienia escrow i dział pracy. Stack produkcyjny — Next.js App Router, PostgreSQL
            (Prisma), NextAuth, web-push, PM2.
          </p>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2">
            {FEATURES.map(({ icon: Icon, title, text }) => (
              <li
                key={title}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
              >
                <Icon className="h-8 w-8 text-odart-accent" aria-hidden />
                <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-400">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-b border-white/10 px-4 py-12 lg:px-6 lg:py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Dla kogo to wzorzec</h2>
          <p className="mt-4 text-neutral-400 leading-relaxed">
            Tablica pokazuje, jak ODART buduje marketplace od zera: katalog, komunikacja, płatności i logistyka w jednym
            produkcie. Podobny model da się wdrożyć pod branżę (np. lokalny rynek, B2B, usługi) — z własną marką,
            regułami i integracjami.
          </p>
          <a
            href={LIVE}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 flex flex-col gap-4 rounded-2xl border border-odart-accent/40 bg-gradient-to-br from-neutral-900/90 to-black p-6 transition hover:border-odart-accent/70 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-semibold text-white">Live: tablica.odart.pl</p>
              <p className="mt-1 text-sm text-neutral-500">
                Ogłoszenia · usługi · praca · escrow · InPost / Orlen
              </p>
            </div>
            <span className="inline-flex items-center justify-center gap-2 rounded-lg bg-odart-accent px-5 py-3 text-sm font-semibold text-white">
              Zobacz produkt
              <ExternalLink className="h-4 w-4" aria-hidden />
            </span>
          </a>
        </div>
      </section>

      <section className="border-b border-white/10 px-4 py-12 lg:px-6 lg:py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Technologia</h2>
          <div className="mt-8 flex flex-wrap gap-2">
            {["Next.js 14", "TypeScript", "PostgreSQL", "Prisma", "NextAuth", "PayU", "web-push", "i18n"].map(
              (t) => (
                <span
                  key={t}
                  className="rounded-md border border-white/10 bg-white/[0.05] px-3 py-1.5 text-sm font-medium text-neutral-300"
                >
                  {t}
                </span>
              ),
            )}
          </div>
          <p className="mt-8 text-neutral-400 leading-relaxed">
            Szukasz marketplace’u albo rozbudowanej aplikacji webowej pod swój rynek? Napisz — dopasujemy zakres do celu
            biznesowego.
          </p>
          <Link
            href={`${SITE}/kontakt/`}
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-odart-accent hover:text-orange-300"
          >
            Kontakt
            <ExternalLink className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </section>
    </OdartPublicShell>
  );
}
