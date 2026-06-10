import Link from "next/link";
import { ChevronRight, LayoutTemplate, MessageCircle, Search, Server } from "lucide-react";
import { ODART_SITE_URL } from "@/lib/odartSite";
import { OdartPublicShell } from "@/components/odart/OdartPublicShell";

const SITE = ODART_SITE_URL;
const CANONICAL = `${SITE}/produkt/seo-optymalizacja-strony/`;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${CANONICAL}#webpage`,
      url: CANONICAL,
      name: "SEO – optymalizacja strony | ODART",
      description:
        "Audyt SEO, optymalizacja treści i techniczna, słowa kluczowe, linki, raporty. Wzrost widoczności w Google. Kołobrzeg.",
      isPartOf: { "@id": `${SITE}/#website` },
      inLanguage: "pl-PL",
    },
    {
      "@type": "Service",
      "@id": `${CANONICAL}#service`,
      name: "SEO – optymalizacja strony internetowej",
      serviceType: "Pozycjonowanie i optymalizacja SEO",
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

const benefits: { title: string; body: string }[] = [
  {
    title: "Poprawa pozycji w wyszukiwarkach",
    body: "Wyższe miejsca w wynikach wyszukiwania zwiększają szansę na dotarcie do nowych klientów.",
  },
  {
    title: "Zwiększenie ruchu organicznego",
    body: "Skuteczna optymalizacja przyciąga więcej użytkowników z organicznych wyników wyszukiwania.",
  },
  {
    title: "Analiza konkurencji",
    body: "Przegląd działań konkurencji i dopasowanie strategii SEO do trendów w branży.",
  },
  {
    title: "Raportowanie i analiza",
    body: "Raporty z postępów i analiza wyników — możliwość śledzenia efektywności działań.",
  },
];

const features: { title: string; body: string }[] = [
  {
    title: "Optymalizacja treści",
    body: "Dostosowanie treści pod słowa kluczowe dla lepszej widoczności w wynikach wyszukiwania.",
  },
  {
    title: "Linki",
    body: "Budowa skutecznych linków wewnętrznych i zewnętrznych wzmacniających autorytet strony.",
  },
  {
    title: "Analiza słów kluczowych",
    body: "Dobór fraz najbardziej efektywnych dla Twojej branży.",
  },
  {
    title: "Optymalizacja techniczna",
    body: "Struktura kodu, szybkość ładowania i inne aspekty techniczne wpływające na SEO.",
  },
];

const toolPoints: { title: string; body: string }[] = [
  {
    title: "Popraw SEO swojej strony",
    body:
      "Audyty technicznego SEO przy starcie, migracji lub gdy szukasz sposobów na lepsze pozycje w wyszukiwarkach.",
  },
  {
    title: "Zrób użytek z Google Search Console i Google Analytics",
    body: "Praktyczne wskazówki z tych narzędzi pomagają optymalizować witrynę.",
  },
  {
    title: "Spersonalizowane instrukcje SEO krok po kroku",
    body:
      "Na podstawie analizy można ustalić listę zadań: treści, statystyki, backlinki.",
  },
  {
    title: "Monitoruj zmiany na stronie",
    body: "Śledzenie zmian pomaga uniknąć kosztownych błędów i utrzymać spójność projektu.",
  },
  {
    title: "Przejrzyste raporty słów kluczowych",
    body: "Regularny podgląd rankingu — widać, które działania działają, z powiadomieniami o ważnych zmianach.",
  },
  {
    title: "Kontroluj backlinki",
    body: "Monitorowanie i analiza linków zewnętrznych — szybsza reakcja na utratę i stabilniejsze SEO.",
  },
  {
    title: "Oszczędzaj czas z rozszerzeniem do przeglądarki",
    body: "Szybki podgląd SEO on-page wybranej strony jednym kliknięciem (np. rozszerzenia do Chrome).",
  },
];

const sitecheckerFeatures: string[] = [
  "Łatwa obsługa.",
  "Instrukcje w formie tekstowej i wideo pomagają opanować narzędzia i zoptymalizować stronę.",
  "Powiadomienia i raporty o istotnych zmianach na stronie.",
  "Monitor kondycji strony, słów kluczowych i backlinków w jednym miejscu.",
];

export function OdartProduktSeoOptymalizacjaStronyPage() {
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
            <span className="text-neutral-300">SEO – optymalizacja strony</span>
          </nav>

          <p className="mt-8 text-sm font-medium uppercase tracking-wide text-odart-accent">Usługa</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            SEO – optymalizacja strony
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-neutral-300">
            Zainwestuj w profesjonalną usługę SEO, aby zwiększyć widoczność strony i osiągnąć lepsze pozycje w wynikach
            wyszukiwania. Zadbam o optymalizację treści, struktury witryny i linków — to może przełożyć się na wzrost
            ruchu organicznego. Przeprowadzę audyt techniczny SEO i poszukam sposobów na poprawę pozycji w Google.{" "}
            <Link href={`${SITE}/kontakt/`} className="font-semibold text-odart-accent hover:text-orange-300">
              Zapytaj o wycenę
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
              Profesjonalna usługa SEO zwiększa widoczność strony i pomaga osiągać lepsze pozycje w wynikach wyszukiwania.
              Optymalizacja treści, struktury witryny i linków sprzyja wzrostowi ruchu organicznego. Audyt techniczny SEO
              pozwala wskazać, co poprawić, by witryna lepiej radziła sobie w wyszukiwarce.
            </p>

            <h3 className="mt-12 text-xl font-bold text-white">Korzyści</h3>
            <ol className="mt-6 list-decimal space-y-4 pl-6 marker:text-odart-accent">
              {benefits.map((b) => (
                <li key={b.title} className="pl-2 text-neutral-400">
                  <strong className="text-neutral-200">{b.title}</strong> — {b.body}
                </li>
              ))}
            </ol>

            <p className="mt-8">
              <a
                href="https://sitechecker.pro/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-odart-accent hover:text-orange-300"
              >
                Możesz też sprawdzić SEO własnej strony za darmo
              </a>{" "}
              (np. w narzędziu online) — to dobry pierwszy krok przed głębszym audytem.
            </p>

            <h3 className="mt-12 text-xl font-bold text-white">Cechy usługi</h3>
            <ul className="mt-6 list-disc space-y-4 pl-6 marker:text-odart-accent">
              {features.map((f) => (
                <li key={f.title} className="pl-1 text-neutral-400">
                  <strong className="text-neutral-200">{f.title}</strong> — {f.body}
                </li>
              ))}
            </ul>

            <p className="mt-8">
              Chcesz przejrzeć słowa kluczowe pod swoją branżę?{" "}
              <Link href={`${SITE}/kontakt/`} className="text-odart-accent hover:text-orange-300">
                Napisz — wspólnie ustalimy zakres
              </Link>
              .
            </p>

            <h3 className="mt-12 text-xl font-bold text-white">
              Raport SEO i lista kontrolna
            </h3>
            <p className="text-neutral-400">
              Możesz zyskać szczegółowy raport SEO wraz ze spersonalizowaną listą kontrolną, która pomoże poprawić stronę i
              dążyć do lepszej widoczności w Google — szczegóły ustalamy indywidualnie.
            </p>

            <h4 className="mt-10 text-lg font-bold text-white">Przedsiębiorcy</h4>
            <p className="text-neutral-400">
              Niezależnie od tego, czy prowadzisz startup, MŚP czy sklep internetowy — pomagam wspiąć się wyżej w
              wynikach Google bez konieczności samodzielnego zagłębiania się w zawiłości SEO lub skomplikowane
              oprogramowanie.
            </p>

            <h4 className="mt-8 text-lg font-bold text-white">Agencje</h4>
            <p className="text-neutral-400">
              Prowadzisz agencję marketingową, internetową lub designerską? Mogę wspierać Cię w oferowaniu usług SEO
              klientom bez konieczności zatrudniania pełnego zespołu SEO od razu.
            </p>

            <h4 className="mt-8 text-lg font-bold text-white">Marketerzy i zespoły produktowe</h4>
            <p className="text-neutral-400">
              Marketer, projektant czy deweloper — pomogę poprawić SEO strony także wtedy, gdy Twoja wiedza o SEO jest
              ograniczona.
            </p>

            <h3 className="mt-14 text-xl font-bold text-white">Kompleksowe narzędzia SEO</h3>
            <ol className="mt-6 list-decimal space-y-5 pl-6 marker:text-odart-accent">
              {toolPoints.map((t) => (
                <li key={t.title} className="pl-2 text-neutral-400">
                  <strong className="text-neutral-200">{t.title}</strong>
                  <span className="block pt-1">{t.body}</span>
                </li>
              ))}
            </ol>

            <h3 className="mt-14 text-xl font-bold text-white">Sitechecker — przyjazna platforma SEO</h3>
            <p className="text-neutral-400">
              Rekomendowana przeze mnie platforma do analizy i monitorowania:{" "}
              <a
                href="https://sitechecker.pro/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-odart-accent hover:text-orange-300"
              >
                Sitechecker
              </a>
              . Cechy platformy:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6 marker:text-neutral-600 text-neutral-400">
              {sitecheckerFeatures.map((line) => (
                <li key={line.slice(0, 40)}>{line}</li>
              ))}
            </ul>

            <h4 className="mt-10 text-lg font-bold text-white">Jak korzystać z analizatora SEO?</h4>
            <p className="text-neutral-400">
              Wprowadź domenę lub adres URL i kliknij „Sprawdź”. Narzędzie analizuje stronę i pokazuje wynik oraz błędy do
              naprawy.
            </p>

            <h4 className="mt-8 text-lg font-bold text-white">Dlaczego naprawa błędów SEO jest ważna?</h4>
            <p className="text-neutral-400">
              Optymalizacja techniczna wpływa na ranking. Dzięki rekomendacjom możesz poprawić szybkość, ograniczyć błędy i
              zwiększyć ruch organiczny.
            </p>

            <h4 className="mt-8 text-lg font-bold text-white">Nie wiem, jak naprawić błędy SEO — co dalej?</h4>
            <p className="text-neutral-400">
              Prześlij raport SEO —{" "}
              <Link href={`${SITE}/kontakt/`} className="text-odart-accent hover:text-orange-300">
                pomogę wdrożyć poprawki
              </Link>{" "}
              lub zaplanować kolejne kroki.
            </p>

            <p className="mt-10 text-sm text-neutral-500">
              Więcej wytycznych znajdziesz też w artykule:{" "}
              <Link href={`${SITE}/pozycjonowanie-seo/`} className="text-odart-accent hover:text-orange-300">
                Zasady pozycjonowania SEO
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
              href={`${SITE}/produkt/migracja-strony-internetowej-na-inny-serwer/`}
              className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-odart-accent/40"
            >
              <Server className="h-8 w-8 text-odart-accent" aria-hidden />
              <h3 className="mt-4 text-lg font-bold text-white group-hover:text-orange-300">
                Migracja strony na inny serwer
              </h3>
              <p className="mt-2 text-sm text-neutral-400">WordPress, hosting, DNS, SSL.</p>
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
              <h3 className="mt-4 text-lg font-bold text-white group-hover:text-orange-300">Wycena strony</h3>
              <p className="mt-2 text-sm text-neutral-400">SEO, strona, projekt — opisz potrzeby.</p>
              <span className="mt-4 inline-flex items-center text-sm font-semibold text-odart-accent">
                Kontakt
                <ChevronRight className="ml-1 h-4 w-4" aria-hidden />
              </span>
            </Link>
            <Link
              href={`${SITE}/strony-internetowe/`}
              className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-odart-accent/40"
            >
              <LayoutTemplate className="h-8 w-8 text-odart-accent" aria-hidden />
              <h3 className="mt-4 text-lg font-bold text-white group-hover:text-orange-300">
                Budowa strony na WordPressie
              </h3>
              <p className="mt-2 text-sm text-neutral-400">Nowa witryna z myślą o SEO.</p>
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
          <Search className="h-10 w-10 text-odart-accent" aria-hidden />
          <h2 className="mt-6 text-3xl font-bold text-white sm:text-4xl">Zadbaj o widoczność w Google</h2>
          <p className="mt-4 max-w-2xl text-neutral-400 leading-relaxed">
            Napisz, jaka jest Twoja strona i branża — zaproponuję audyt, zakres i harmonogram prac SEO.
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
