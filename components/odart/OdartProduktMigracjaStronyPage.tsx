import Link from "next/link";
import { ChevronRight, LayoutTemplate, Search, Shield, Wrench } from "lucide-react";
import { ODART_SITE_URL } from "@/lib/odartSite";
import { OdartPublicShell } from "@/components/odart/OdartPublicShell";

const SITE = ODART_SITE_URL;
const CANONICAL = `${SITE}/produkt/migracja-strony-internetowej-na-inny-serwer/`;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${CANONICAL}#webpage`,
      url: CANONICAL,
      name: "Migracja strony WordPress na inny serwer | ODART",
      description:
        "Migracja WordPress: pliki, baza danych, ustawienia, testy, optymalizacja i wsparcie. Kołobrzeg i zdalnie.",
      isPartOf: { "@id": `${SITE}/#website` },
      inLanguage: "pl-PL",
    },
    {
      "@type": "Service",
      "@id": `${CANONICAL}#service`,
      name: "Migracja strony internetowej WordPress na inny serwer",
      serviceType: "Migracja i przeniesienie witryny WordPress",
      provider: { "@id": `${SITE}/#org` },
      areaServed: { "@type": "City", name: "Kołobrzeg" },
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

const serviceIncludes = [
  {
    title: "Przeniesienie strony internetowej",
    body:
      "Kompletne przeniesienie Twojej strony WordPress na nowe środowisko hostingowe. Nie musisz martwić się skomplikowanymi kwestiami technicznymi.",
  },
  {
    title: "Bezpieczeństwo i integralność danych",
    body:
      "Podczas migracji zadbam o zachowanie integralności witryny oraz danych. Bezpiecznie przenoszę pliki, bazę danych i ustawienia.",
  },
  {
    title: "Optymalizacja i testowanie",
    body:
      "Po migracji przeprowadzam optymalizację, aby strona działała szybko i sprawnie na nowym serwerze. Testuję funkcje, aby wszystko działało zgodnie z oczekiwaniami.",
  },
  {
    title: "Wsparcie techniczne",
    body:
      "Pomoc na każdym etapie migracji — odpowiadam na pytania i rozwiązuję ewentualne problemy.",
  },
];

const whyChoose = [
  {
    title: "Profesjonalne podejście",
    body:
      "Dbam o szczegóły podczas migracji, zapewniając spokój i pewność, że wszystko zostanie wykonane poprawnie.",
  },
  {
    title: "Bezpieczeństwo i niezawodność",
    body:
      "Gwarantuję bezpieczne przeniesienie witryny i danych, aby nic nie zostało utracone.",
  },
  {
    title: "Oszczędność czasu i energii",
    body:
      "Zamiast samodzielnie męczyć się migracją, oddaj zadanie specjalistom i skup się na biznesie.",
  },
];

export function OdartProduktMigracjaStronyPage() {
  return (
    <OdartPublicShell activeNav="uslugi" jsonLd={jsonLd}>
      <article className="border-b border-white/10 px-4 py-10 lg:px-6 lg:py-14">
        <div className="mx-auto max-w-3xl">
          <nav className="text-sm text-neutral-500" aria-label="Ścieżka nawigacji">
            <Link href={`${SITE}/`} className="hover:text-odart-accent">
              Strona główna
            </Link>
            <span className="mx-2 text-neutral-600">/</span>
            <span className="text-neutral-400">Strony Internetowe WordPress</span>
            <span className="mx-2 text-neutral-600">/</span>
            <span className="text-neutral-300">Migracja strony internetowej na inny serwer</span>
          </nav>

          <p className="mt-8 text-sm font-medium uppercase tracking-wide text-odart-accent">Usługa</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Migracja strony internetowej na inny serwer
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-neutral-300">
            Czy planujesz przenieść stronę internetową opartą na WordPressie na nowe środowisko hostingowe lub zmienić
            dostawcę usług? Usługa migracji WordPressa jest przygotowana tak, aby przebiegła płynnie i bezpiecznie — bez
            zbędnego stresu.{" "}
            <Link href={`${SITE}/kontakt/`} className="font-semibold text-odart-accent hover:text-orange-300">
              Napisz do mnie
            </Link>
            .
          </p>
          <p className="mt-4 text-sm text-neutral-500">
            Kategoria: <span className="text-neutral-400">Strony Internetowe WordPress</span>
          </p>
        </div>
      </article>

      <section className="border-b border-white/10 px-4 py-12 lg:px-6 lg:py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Opis</h2>
          <div className="prose prose-invert prose-p:text-neutral-400 prose-strong:text-neutral-200 prose-li:text-neutral-400 mt-8 max-w-none">
            <p>
              Czy planujesz przenieść swoją stronę internetową opartą na WordPressie na nowe środowisko hostingowe lub
              zmienić dostawcę usług hostingowych? Moja usługa migracji WordPressa została stworzona z myślą o Tobie,
              abyś mógł dokonać płynnej i bezpiecznej migracji bez zbędnych problemów.
            </p>

            <h3 className="mt-12 text-xl font-bold text-white">Co zawiera nasza usługa migracji WordPressa?</h3>

            <ol className="mt-8 list-decimal space-y-6 pl-6 marker:text-odart-accent">
              {serviceIncludes.map((item) => (
                <li key={item.title} className="pl-2">
                  <span className="font-semibold text-neutral-200">{item.title}:</span>{" "}
                  <span className="text-neutral-400">{item.body}</span>
                </li>
              ))}
            </ol>

            <h3 className="mt-12 text-xl font-bold text-white">Dlaczego warto skorzystać z usługi migracji WordPressa?</h3>

            <ul className="mt-8 list-disc space-y-4 pl-6 marker:text-odart-accent">
              {whyChoose.map((item) => (
                <li key={item.title} className="pl-2">
                  <span className="font-semibold text-neutral-200">{item.title}:</span>{" "}
                  <span className="text-neutral-400">{item.body}</span>
                </li>
              ))}
            </ul>

            <p className="mt-10">
              Gotowy na płynną i bezstresową migrację swojej strony WordPress?{" "}
              <Link href={`${SITE}/kontakt/`} className="text-odart-accent hover:text-orange-300">
                Skontaktuj się ze mną już dziś
              </Link>
              !
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 px-4 py-12 lg:px-6 lg:py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Podobne usługi</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <Link
              href={`${SITE}/pozycjonowanie-seo/`}
              className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-odart-accent/40"
            >
              <Search className="h-8 w-8 text-odart-accent" aria-hidden />
              <h3 className="mt-4 text-lg font-bold text-white group-hover:text-orange-300">SEO – optymalizacja strony</h3>
              <p className="mt-2 text-sm text-neutral-400">Pozycjonowanie i widoczność w Google.</p>
              <span className="mt-4 inline-flex items-center text-sm font-semibold text-odart-accent">
                Zobacz
                <ChevronRight className="ml-1 h-4 w-4" aria-hidden />
              </span>
            </Link>
            <Link
              href={`${SITE}/strony-internetowe/`}
              className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-odart-accent/40"
            >
              <LayoutTemplate className="h-8 w-8 text-odart-accent" aria-hidden />
              <h3 className="mt-4 text-lg font-bold text-white group-hover:text-orange-300">
                Budowa strony internetowej na WordPressie
              </h3>
              <p className="mt-2 text-sm text-neutral-400">Nowa strona — projekt, wdrożenie, szkolenie.</p>
              <span className="mt-4 inline-flex items-center text-sm font-semibold text-odart-accent">
                Zobacz
                <ChevronRight className="ml-1 h-4 w-4" aria-hidden />
              </span>
            </Link>
            <Link
              href={`${SITE}/produkt/przywracanie-strony-internetowej-wordpress/`}
              className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-odart-accent/40"
            >
              <Wrench className="h-8 w-8 text-odart-accent" aria-hidden />
              <h3 className="mt-4 text-lg font-bold text-white group-hover:text-orange-300">
                Przywracanie strony internetowej WordPress
              </h3>
              <p className="mt-2 text-sm text-neutral-400">Czyszczenie po malware, odbudowa, zabezpieczenia.</p>
              <span className="mt-4 inline-flex items-center text-sm font-semibold text-odart-accent">
                Zobacz
                <ChevronRight className="ml-1 h-4 w-4" aria-hidden />
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 lg:px-6">
        <div className="mx-auto max-w-6xl rounded-2xl border border-odart-accent/30 bg-gradient-to-br from-neutral-900/80 to-black p-8 lg:p-12">
          <Shield className="h-10 w-10 text-odart-accent" aria-hidden />
          <h2 className="mt-6 text-3xl font-bold text-white sm:text-4xl">Zaplanuj migrację</h2>
          <p className="mt-4 max-w-2xl text-neutral-400 leading-relaxed">
            Opisz obecny hosting i docelowe środowisko — przygotuję plan przeniesienia, termin i wycenę. Kołobrzeg i
            obsługa zdalna.
          </p>
          <Link
            href={`${SITE}/kontakt/`}
            className="mt-8 inline-flex items-center rounded-lg bg-odart-accent px-8 py-3.5 font-semibold text-white hover:brightness-110"
          >
            Kontakt
            <ChevronRight className="ml-1 h-5 w-5" aria-hidden />
          </Link>
          <div className="mt-12 grid gap-8 border-t border-white/10 pt-10 sm:grid-cols-3">
            <div>
              <p className="text-sm font-semibold text-neutral-500">Telefon</p>
              <a href="tel:+48695432415" className="mt-2 block text-lg text-white hover:text-orange-300">
                +48 695 432 415
              </a>
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-500">E-mail</p>
              <a href="mailto:biuro@odart.pl" className="mt-2 block text-lg text-white hover:text-orange-300">
                biuro@odart.pl
              </a>
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-500">Adres</p>
              <p className="mt-2 text-lg text-neutral-300">Kołobrzeg</p>
            </div>
          </div>
        </div>
      </section>
    </OdartPublicShell>
  );
}
