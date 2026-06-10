import Link from "next/link";
import { ChevronRight, LayoutTemplate, Search, MessageCircle, Server } from "lucide-react";
import { ODART_SITE_URL } from "@/lib/odartSite";
import { OdartPublicShell } from "@/components/odart/OdartPublicShell";

const SITE = ODART_SITE_URL;

function canonicalUrl(pathname: string): string {
  const base = SITE.replace(/\/$/, "");
  const p = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${base}${p.endsWith("/") ? p : `${p}/`}`;
}

export type OdartProduktStronaInternetowaWordpressPageProps = {
  /** Pełna ścieżka kanoniczna (np. `/strony-internetowe/` albo `/produkt/strona-internetowa-na-wordpress/`) */
  canonicalPathname?: string;
  /** Krótszy breadcrumb pod URL /strony-internetowe */
  shortBreadcrumb?: boolean;
};

const reasons = [
  {
    title: "Elastyczność i dostosowanie",
    body:
      "WordPress to potężny system zarządzania treścią (CMS), który umożliwia elastyczne dostosowanie strony do indywidualnych potrzeb klienta. Tworzymy strony internetowe dla różnych branż i dziedzin, dostosowując je do specyfiki działalności.",
  },
  {
    title: "Responsywność i mobilność",
    body:
      "W dzisiejszych czasach ważne jest, aby strony internetowe były dostosowane do różnych urządzeń. Tworzę responsywne strony, które doskonale wyglądają i działają zarówno na komputerach, tabletach, jak i smartfonach.",
  },
  {
    title: "Estetyka i User Experience (UX)",
    body:
      "Projekty kładą nacisk na estetykę i przyjazność dla użytkownika. Tworzę interfejsy, które nie tylko przyciągają wzrok, ale także zapewniają intuicyjną nawigację, co poprawia ogólne doświadczenie użytkownika (UX).",
  },
  {
    title: "Optymalizacja pod kątem SEO",
    body: (
      <>
        Zależy mi na tym, aby strony internetowe moich klientów były łatwo odnajdywane w wynikach wyszukiwania. Dlatego projektuję strony z myślą o SEO.{" "}
        <Link href={`${SITE}/pozycjonowanie-seo/`} className="font-semibold text-odart-accent hover:text-orange-300">
          Przeczytaj o wytycznych SEO
        </Link>
        .
      </>
    ),
  },
  {
    title: "Bezpieczeństwo i aktualizacje",
    body:
      "Zapewniam regularne aktualizacje systemu WordPress oraz wtyczek, aby utrzymać stronę w najlepszej kondycji. Dbam o zabezpieczenia przed zagrożeniami. Daję półroczną gwarancję na działanie strony.",
  },
  {
    title: "Działania pomocnicze i szkolenia",
    body:
      "Po zakończeniu projektu oferuję wsparcie techniczne oraz szkolenia, aby klient mógł samodzielnie zarządzać treścią na stronie.",
  },
];

export function OdartProduktStronaInternetowaWordpressPage({
  canonicalPathname = "/produkt/strona-internetowa-na-wordpress/",
  shortBreadcrumb = false,
}: OdartProduktStronaInternetowaWordpressPageProps = {}) {
  const CANONICAL = canonicalUrl(canonicalPathname);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${CANONICAL}#webpage`,
        url: CANONICAL,
        name: "Budowa strony internetowej na WordPressie | ODART",
        description:
          "Profesjonalne tworzenie stron na WordPressie: CMS, responsywność, UX, SEO, bezpieczeństwo, szkolenia. Kołobrzeg.",
        isPartOf: { "@id": `${SITE}/#website` },
        inLanguage: "pl-PL",
      },
      {
        "@type": "Service",
        "@id": `${CANONICAL}#service`,
        name: "Budowa strony internetowej na WordPressie",
        serviceType: "Tworzenie i wdrożenie stron WWW (WordPress)",
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

  return (
    <OdartPublicShell activeNav="uslugi" jsonLd={jsonLd}>
      <article className="border-b border-white/10 px-4 py-10 lg:px-6 lg:py-14">
        <div className="mx-auto max-w-3xl">
          <nav className="text-sm text-neutral-500" aria-label="Ścieżka nawigacji">
            <Link href={`${SITE}/`} className="hover:text-odart-accent">
              Strona główna
            </Link>
            <span className="mx-2 text-neutral-600">/</span>
            {shortBreadcrumb ? (
              <span className="text-neutral-300">Strony internetowe</span>
            ) : (
              <>
                <span className="text-neutral-400">Strony Internetowe WordPress</span>
                <span className="mx-2 text-neutral-600">/</span>
                <span className="text-neutral-300">Budowa strony internetowej na WordPressie</span>
              </>
            )}
          </nav>

          <p className="mt-8 text-sm font-medium uppercase tracking-wide text-odart-accent">Usługa</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Budowa strony internetowej na WordPressie
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-neutral-300">
            Skorzystaj z mojej usługi tworzenia stron na WordPressie, aby zyskać profesjonalną, nowoczesną i skuteczną
            stronę internetową, która w pełni odzwierciedli wartości Twojej marki i przyciągnie uwagę online.{" "}
            <Link href={`${SITE}/kontakt/`} className="font-semibold text-odart-accent hover:text-orange-300">
              Skontaktuj się ze mną
            </Link>
            !
          </p>
          <p className="mt-4 text-sm text-neutral-500">
            Kategoria:{" "}
            <span className="text-neutral-400">Strony Internetowe WordPress</span>
          </p>
        </div>
      </article>

      <section className="border-b border-white/10 px-4 py-12 lg:px-6 lg:py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Opis</h2>
          <div className="prose prose-invert prose-p:text-neutral-400 prose-headings:text-white mt-8 max-w-none">
            <p>
              Specjalizuję się w profesjonalnym tworzeniu stron internetowych opartych na platformie WordPress. Moja
              usługa obejmuje kompleksową obsługę, zapewniając klientom funkcjonalne, estetyczne i responsywne strony,
              które spełniają ich unikalne cele biznesowe.
            </p>
            <p>
              <Link href={`${SITE}/tworzenie-stron-internetowych-na-wordpressie/`} className="text-odart-accent hover:text-orange-300">
                Jak stworzyć stronę internetową online
              </Link>
              .
            </p>

            <h3 className="mt-12 text-xl font-bold text-white">Dlaczego warto skorzystać z naszego tworzenia stron na WordPressie?</h3>

            <ol className="mt-8 list-decimal space-y-8 pl-6 marker:text-odart-accent">
              {reasons.map((item) => (
                <li key={item.title} className="pl-2">
                  <span className="font-semibold text-neutral-200">{item.title}:</span>{" "}
                  <span className="text-neutral-400">{item.body}</span>
                </li>
              ))}
            </ol>

            <p className="mt-10">
              Skorzystaj z mojej usługi tworzenia stron na WordPressie, aby zyskać profesjonalną, nowoczesną i skuteczną
              stronę internetową, która w pełni odzwierciedli wartości Twojej marki i przyciągnie uwagę online.{" "}
              <Link href={`${SITE}/kontakt/`} className="text-odart-accent hover:text-orange-300">
                Skontaktuj się ze mną
              </Link>
              !
            </p>

            <p className="mt-6">
              Budowanie stron na WordPressie jest stosunkowo prostym procesem dzięki intuicyjnemu interfejsowi i dostępności
              licznych motywów i wtyczek. Czasochłonność zależy od skomplikowania projektu, personalizacji i liczby
              dodatkowych funkcji.
            </p>

            <h3 className="mt-12 text-xl font-bold text-white">Ile kosztuje własna strona internetowa?</h3>
            <p className="mt-4">
              Stronę można w internecie zrobić za darmo, ale bez dedykowanej domeny — tylko z adresem narzuconym przez
              dostawcę gotowego szablonu.{" "}
              <Link
                href={`${SITE}/profesjonalna-strona-internetowa-dla-ciebie-juz-od-1500-zl`}
                className="text-odart-accent hover:text-orange-300"
              >
                Sprawdź ofertę stron od 1500 zł
              </Link>{" "}
              lub{" "}
              <Link href={`${SITE}/kontakt/`} className="text-odart-accent hover:text-orange-300">
                poproś o wycenę
              </Link>
              .
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
              href={`${SITE}/kontakt/`}
              className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-odart-accent/40"
            >
              <MessageCircle className="h-8 w-8 text-odart-accent" aria-hidden />
              <h3 className="mt-4 text-lg font-bold text-white group-hover:text-orange-300">Wycena strony internetowej</h3>
              <p className="mt-2 text-sm text-neutral-400">Opisz projekt — przygotuję wycenę.</p>
              <span className="mt-4 inline-flex items-center text-sm font-semibold text-odart-accent">
                Kontakt
                <ChevronRight className="ml-1 h-4 w-4" aria-hidden />
              </span>
            </Link>
            <Link
              href={`${SITE}/produkt/migracja-strony-internetowej-na-inny-serwer/`}
              className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-odart-accent/40"
            >
              <Server className="h-8 w-8 text-odart-accent" aria-hidden />
              <h3 className="mt-4 text-lg font-bold text-white group-hover:text-orange-300">
                Migracja strony na inny serwer
              </h3>
              <p className="mt-2 text-sm text-neutral-400">Migracje WordPress, hosting, SSL, DNS.</p>
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
          <LayoutTemplate className="h-10 w-10 text-odart-accent" aria-hidden />
          <h2 className="mt-6 text-3xl font-bold text-white sm:text-4xl">Zacznijmy od rozmowy</h2>
          <p className="mt-4 max-w-2xl text-neutral-400 leading-relaxed">
            Potrzebujesz strony na WordPressie w Kołobrzegu lub online? Napisz lub zadzwoń — omówimy zakres, termin i
            koszt.
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
