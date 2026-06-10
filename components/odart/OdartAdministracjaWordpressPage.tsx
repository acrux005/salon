import Link from "next/link";
import { ODART_SITE_URL } from "@/lib/odartSite";
import { OdartPublicShell } from "@/components/odart/OdartPublicShell";

const SITE = ODART_SITE_URL;
const CANONICAL = `${SITE}/administracja-stron-internetowych-wordpress/`;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "@id": `${CANONICAL}#article`,
      headline: "Administracja stron internetowych WordPress",
      datePublished: "2023-11-14",
      dateModified: "2026-03-23",
      author: { "@type": "Organization", name: "ODART", url: SITE },
      publisher: {
        "@type": "Organization",
        name: "ODART — Ostry Dyżur Artystyczny",
        url: SITE,
      },
      mainEntityOfPage: { "@id": `${CANONICAL}#webpage` },
      inLanguage: "pl-PL",
    },
    {
      "@type": "WebPage",
      "@id": `${CANONICAL}#webpage`,
      url: CANONICAL,
      name: "Administracja stron WordPress | ODART",
      isPartOf: { "@id": `${SITE}/#website` },
    },
  ],
};

export function OdartAdministracjaWordpressPage() {
  return (
    <OdartPublicShell jsonLd={jsonLd}>
      <article className="border-b border-white/10 px-4 py-12 lg:px-6 lg:py-16">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm text-odart-accent">
            <Link href={`${SITE}/blog/`} className="hover:text-orange-300">
              Blog
            </Link>
            <span className="text-neutral-600"> · </span>
            <span className="text-neutral-400">Strony internetowe</span>
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Administracja stron internetowych WordPress
          </h1>
          <p className="mt-4 text-sm text-neutral-500">
            <time dateTime="2023-11-14">14 listopada 2023</time>
            {" · "}
            Kategoria: strony internetowe
          </p>

          <p className="mt-8 text-sm font-semibold uppercase tracking-wide text-odart-accent">WordPress</p>

          <div className="prose prose-invert prose-headings:scroll-mt-24 prose-p:text-neutral-400 prose-li:text-neutral-400 prose-strong:text-neutral-200 mt-6 max-w-none">
            <h2 className="text-xl font-bold text-white">Kompleksowa obsługa WordPress – Twoje strony w bezpiecznych rękach</h2>
            <p className="lead text-lg text-neutral-300">
              WordPress, będący platformą obsługującą znaczną część witryn w sieci, jest nie tylko popularnym, ale i potężnym
              narzędziem do tworzenia stron internetowych. Dlatego budowa solidnej i funkcjonalnej strony na WordPressie
              powinna być priorytetem dla każdego przedsiębiorcy, który pragnie rozwijać swoją działalność online.
            </p>

            <h3 className="text-lg font-bold text-white mt-10">Utrzymanie strony WordPress</h3>
            <p>
              Popularność WordPressa niestety niesie ze sobą ryzyko ataków cybernetycznych. Dlatego zabezpieczenie strony
              jest kluczowe, aby chronić się przed złośliwym oprogramowaniem. W ramach naszych usług administracyjnych
              zapewniamy kompleksową opiekę nad Twoją witryną, co pozwala Ci skoncentrować się na rozwoju swojego biznesu.
            </p>

            <h2 className="text-xl font-bold text-white mt-12">Co oferujemy?</h2>

            <h3 className="text-lg font-bold text-white mt-8">Regularne aktualizacje i utrzymanie</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Aktualizacje:</strong> regularne aktualizowanie WordPressa, motywów i wtyczek, aby zapewnić
                najnowsze funkcje i bezpieczeństwo.
              </li>
              <li>
                <strong>Monitoring i naprawa błędów:</strong> ciągłe monitorowanie witryny i usuwanie wszelkich błędów,
                które mogą pojawić się po aktualizacjach.
              </li>
            </ul>

            <h3 className="text-lg font-bold text-white mt-10">Zarządzanie treścią</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Publikacja treści:</strong> dodawanie i edytowanie artykułów, zdjęć, filmów i innych mediów na
                Twojej stronie.
              </li>
              <li>
                <strong>Optymalizacja SEO:</strong> optymalizacja treści pod kątem wyszukiwarek, aby zwiększyć widoczność
                Twojej witryny.
              </li>
            </ul>

            <h3 className="text-lg font-bold text-white mt-10">Bezpieczeństwo i kopie zapasowe</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Zabezpieczenia:</strong> instalacja i konfiguracja wtyczek zabezpieczających przed atakami
                hakerskimi.
              </li>
              <li>
                <strong>Kopie zapasowe:</strong> regularne tworzenie kopii zapasowych, aby zabezpieczyć dane przed ich
                utratą.
              </li>
            </ul>

            <h3 className="text-lg font-bold text-white mt-10">Optymalizacja wydajności</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Szybkość ładowania:</strong> analiza i poprawa szybkości ładowania strony, co przekłada się na
                lepsze doświadczenie użytkownika.
              </li>
              <li>
                <strong>Optymalizacja mediów:</strong> kompresja obrazów i ustawienia pamięci podręcznej (caching) w celu
                zwiększenia wydajności.
              </li>
            </ul>

            <h3 className="text-lg font-bold text-white mt-10">Rozwój funkcjonalności</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Nowe funkcje:</strong> instalacja i konfiguracja nowych wtyczek, które wprowadzą dodatkowe
                funkcjonalności.
              </li>
              <li>
                <strong>Dostosowywanie motywów:</strong> personalizacja motywów WordPress zgodnie z unikalnymi potrzebami
                Twojej witryny.
              </li>
            </ul>

            <h3 className="text-lg font-bold text-white mt-10">Monitorowanie i analiza</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Analiza ruchu:</strong> regularna analiza danych analitycznych w celu zrozumienia zachowań
                użytkowników.
              </li>
              <li>
                <strong>Raportowanie:</strong> przekazywanie raportów i sugerowanie działań poprawczych na podstawie
                zebranych danych.
              </li>
            </ul>

            <h3 className="text-lg font-bold text-white mt-10">Obsługa techniczna i wsparcie</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Reakcja na problemy:</strong> szybka reakcja na wszelkie problemy techniczne lub zgłoszenia
                użytkowników.
              </li>
              <li>
                <strong>Rozwiązywanie problemów:</strong> debugowanie i rozwiązywanie problemów technicznych.
              </li>
              <li>
                <strong>Konsultacje:</strong> doradztwo w zakresie strategii rozwoju strony i implementacji nowych
                funkcji.
              </li>
            </ul>

            <h3 className="text-lg font-bold text-white mt-10">Zgodność z przepisami prawnymi</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>RODO i inne przepisy:</strong> zapewnienie zgodności strony z obowiązującymi przepisami
                dotyczącymi prywatności i ochrony danych.
              </li>
              <li>
                <strong>Aktualizacje prawne:</strong> regularne aktualizacje w związku z nowymi regulacjami prawnymi.
              </li>
            </ul>

            <h2 className="text-xl font-bold text-white mt-12">Skontaktuj się z nami</h2>
            <p>
              Dzięki naszym usługom administracyjnym dla WordPress Twoja strona internetowa będzie działać sprawnie,
              będzie bezpieczna i gotowa na nowe wyzwania. Skontaktuj się z nami, aby omówić, jak możemy dostosować nasze
              usługi do Twoich specyficznych potrzeb i wspierać rozwój Twojego biznesu online.
            </p>
          </div>

          <div className="mt-14 rounded-2xl border border-odart-accent/30 bg-neutral-950/50 p-6">
            <p className="text-sm font-medium text-orange-300">Potrzebujesz opieki nad WordPressem?</p>
            <p className="mt-2 text-sm text-neutral-400">
              Sprawdź{" "}
              <Link href={`${SITE}/uslugi/`} className="text-odart-accent hover:text-orange-300">
                zakres usług
              </Link>{" "}
              lub napisz przez{" "}
              <Link href={`${SITE}/kontakt/`} className="text-odart-accent hover:text-orange-300">
                formularz kontaktowy
              </Link>
              .
            </p>
          </div>
        </div>
      </article>
    </OdartPublicShell>
  );
}
