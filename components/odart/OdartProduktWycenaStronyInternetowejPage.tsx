import Link from "next/link";
import { Calculator, ChevronRight, LayoutTemplate, Search, Server, ShieldAlert } from "lucide-react";
import { ODART_SITE_URL } from "@/lib/odartSite";
import { OdartPublicShell } from "@/components/odart/OdartPublicShell";

const SITE = ODART_SITE_URL;
const CANONICAL = `${SITE}/produkt/wycena-strony-internetowej/`;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${CANONICAL}#webpage`,
      url: CANONICAL,
      name: "Wycena strony internetowej | ODART",
      description:
        "Co wpływa na koszt strony WWW: zakres, grafika, funkcje, integracje, hosting i domena. Wycena indywidualna — Kołobrzeg.",
      isPartOf: { "@id": `${SITE}/#website` },
      inLanguage: "pl-PL",
    },
    {
      "@type": "Service",
      "@id": `${CANONICAL}#service`,
      name: "Wycena strony internetowej",
      serviceType: "Projektowanie i wycena witryny WordPress",
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

const quoteNeeds: { title: string; body: string }[] = [
  {
    title: "Zakres projektu",
    body:
      "Czy strona będzie prosta z podstawowymi funkcjami, czy rozbudowany e-commerce z wieloma integracjami? Przydaje się przykład witryny o podobnym charakterze.",
  },
  {
    title: "Projekt graficzny",
    body:
      "Indywidualny projekt czy gotowy szablon? Grafika mocno wpływa na cenę. Czy potrzebne są logo, zdjęcia, banery?",
  },
  {
    title: "Funkcjonalności",
    body:
      "Płatności online, integracje płatności, zamówienia, oceny produktów, rabaty i inne moduły.",
  },
  {
    title: "Integracje zewnętrzne",
    body: "Płatności, magazyn, księgowość, wysyłka — czy strona ma się łączyć z innymi systemami?",
  },
  {
    title: "Wsparcie i utrzymanie",
    body: "Czy wycena ma obejmować opiekę techniczną po uruchomieniu?",
  },
  {
    title: "Analiza konkurencji",
    body: "Czy potrzebujesz przeglądu rynku pod kątem oferty i pozycjonowania?",
  },
  {
    title: "Wsparcie marketingowe",
    body: "SEO, kampanie reklamowe, strategia promocji — czy to w zakresie?",
  },
  { title: "Branża", body: "Dopasowanie języka i struktury do specyfiki działalności." },
  { title: "Liczba produktów lub usług", body: "Szczególnie istotne przy sklepach i katalogach." },
];

export function OdartProduktWycenaStronyInternetowejPage() {
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
            <span className="text-neutral-300">Wycena strony internetowej</span>
          </nav>

          <p className="mt-8 text-sm font-medium uppercase tracking-wide text-odart-accent">Usługa</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Wycena strony internetowej
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-neutral-300">
            Jedną z mocnych stron WordPressa jest ogromna elastyczność — od motywu po kolory przycisków. Z tej swobody
            wynika jednak wiele decyzji: jak ma wyglądać witryna, jakie funkcje ma mieć i ile to kosztuje. Poniżej
            zebrane są pytania i informacje przydatne przy{" "}
            <Link href={`${SITE}/kontakt/`} className="font-semibold text-odart-accent hover:text-orange-300">
              wycenie indywidualnej
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
          <div className="prose prose-invert prose-p:text-neutral-400 prose-li:text-neutral-400 prose-strong:text-neutral-200 mt-8 max-w-none">
            <h3 className="text-xl font-bold text-white">Zadaj sobie pytania</h3>
            <ul className="mt-4 list-disc space-y-2 pl-6 marker:text-odart-accent">
              <li>Do czego ma służyć Twoja strona?</li>
              <li>Jak chcesz zorganizować witrynę?</li>
              <li>Czy to blog, strona firmowa, a może sklep internetowy — albo połączenie?</li>
            </ul>

            <h3 className="mt-12 text-xl font-bold text-white">Do wyceny strony będę potrzebować m.in.</h3>
            <ul className="mt-6 list-disc space-y-4 pl-6 marker:text-odart-accent">
              {quoteNeeds.map((item) => (
                <li key={item.title} className="pl-1">
                  <strong className="text-neutral-200">{item.title}</strong>
                  <span className="text-neutral-400"> — {item.body}</span>
                </li>
              ))}
            </ul>

            <h3 className="mt-14 text-xl font-bold text-white">Domena, hosting i koszty stałe</h3>
            <p>
              Najtańsza sensowna ścieżka to strona na WordPressie z{" "}
              <strong className="text-neutral-200">własną domeną i hostingiem</strong> — nie chodzi o darmowe kreatory bez
              pełnej kontroli, tylko o witrynę pod Twoją marką.
            </p>
            <p>
              <strong className="text-neutral-200">Hosting</strong> to miejsce na serwerze, gdzie fizycznie leżą pliki
              strony i baza danych; bez niego domena nie „pokaże” witryny. Dobór hostingu zależy od ruchu, sklepu i
              bezpieczeństwa — mogę doradzić przy wycenie.
            </p>
            <p>
              <strong className="text-neutral-200">Domena</strong> — często niska cena w pierwszym roku, potem odnowienie
              wyższe (np. rząd 70–200 zł rocznie, zależnie od końcówki i rejestratora). Warto czytać regulamin: po roku
              łączny koszt domeny, SSL i hostingu może wyraźnie wzrosnąć.
            </p>
            <p>
              Przyjmij orientacyjnie, że samo utrzymanie (domena + hosting) to często okolice{" "}
              <strong className="text-neutral-200">około 200 zł rocznie</strong> i więcej — zależnie od dostawcy, SSL i
              pakietu. Tańsze hostingi współdzielone sprawdzają się przy mniejszym ruchu; przy skalowaniu bywa potrzebny
              mocniejszy serwer.
            </p>

            <h3 className="mt-12 text-xl font-bold text-white">WordPress, WooCommerce, motywy</h3>
            <p>
              Sam WordPress i WooCommerce można uruchomić bez licencji na oprogramowanie — to otwiera drogę do sklepu bez
              kosztów samego silnika. Są darmowe motywy, ale często sensowniej wybrać płatny szablon (często ok. 100–300
              zł) lub projekt dedykowany.
            </p>
            <p>
              WordPress nie jest „kliknięciem i gotowe” — błąd konfiguracji potrafi wyłączyć stronę, a popularność systemu
              wymaga porządnego zabezpieczenia. To też wpływa na realny koszt prac i utrzymania.
            </p>
            <p>
              Szukasz krótkiej strony na start? Zobacz ofertę{" "}
              <Link
                href={`${SITE}/profesjonalna-strona-internetowa-dla-ciebie-juz-od-1500-zl`}
                className="text-odart-accent hover:text-orange-300"
              >
                strony one page
              </Link>
              . Zakres i kwotę ustalamy po rozmowie.
            </p>

            <h3 className="mt-12 text-xl font-bold text-white">Cel i struktura witryny</h3>
            <p>
              Po co jest witryna i do kogo jest skierowana — blog, portfolio, firma, sklep? To pierwszy krok do sensownej
              struktury i treści.
            </p>
            <p>
              Organizacja menu, sekcji i podstron wynika z celu: ułatwia to odwiedzającym nawigację i Tobie późniejszy
              rozwój. Możesz zacząć od mniejszego zakresu i rozbudowywać witrynę wg ruchu i opinii użytkowników.
            </p>
            <p>
              Blog a „klasyczna” strona różnią się dynamiką treści (wpisy vs. statyczne podstrony); blog bywa też częścią
              sklepu.
            </p>
            <p>
              Inspiracje z sieci są w porządku jako kierunek stylistyczny — treści i zdjęcia cudzych witryn kopiować nie
              wolno, ale układ, kolorystyka czy typografia mogą być punktem odniesienia dla własnego projektu.
            </p>

            <h3 className="mt-12 text-xl font-bold text-white">UX, menu, CTA</h3>
            <p>
              Menu nawigacyjne pomaga znaleźć treści; przejrzysty układ, nagłówki i obrazy wspierają skanowanie strony.
              Wezwanie do działania (CTA) warto umieścić w widocznym miejscu „nad foldem”. Nagłówki porządkują tekst i
              wspierają SEO; zdjęcia produktów czy grafiki „łamią” ściany tekstu.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 px-4 py-12 lg:px-6 lg:py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Powiązane usługi</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href={`${SITE}/strony-internetowe/`}
              className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-odart-accent/40"
            >
              <LayoutTemplate className="h-8 w-8 text-odart-accent" aria-hidden />
              <h3 className="mt-4 text-lg font-bold text-white group-hover:text-orange-300">
                Budowa strony na WordPressie
              </h3>
              <p className="mt-2 text-sm text-neutral-400">Projekt i wdrożenie.</p>
              <span className="mt-4 inline-flex items-center text-sm font-semibold text-odart-accent">
                Zobacz
                <ChevronRight className="ml-1 h-4 w-4" aria-hidden />
              </span>
            </Link>
            <Link
              href={`${SITE}/produkt/seo-optymalizacja-strony/`}
              className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-odart-accent/40"
            >
              <Search className="h-8 w-8 text-odart-accent" aria-hidden />
              <h3 className="mt-4 text-lg font-bold text-white group-hover:text-orange-300">SEO — optymalizacja</h3>
              <p className="mt-2 text-sm text-neutral-400">Widoczność w Google.</p>
              <span className="mt-4 inline-flex items-center text-sm font-semibold text-odart-accent">
                Zobacz
                <ChevronRight className="ml-1 h-4 w-4" aria-hidden />
              </span>
            </Link>
            <Link
              href={`${SITE}/produkt/przywracanie-strony-internetowej-wordpress/`}
              className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-odart-accent/40"
            >
              <ShieldAlert className="h-8 w-8 text-odart-accent" aria-hidden />
              <h3 className="mt-4 text-lg font-bold text-white group-hover:text-orange-300">Przywracanie WordPress</h3>
              <p className="mt-2 text-sm text-neutral-400">Po infekcji lub awarii.</p>
              <span className="mt-4 inline-flex items-center text-sm font-semibold text-odart-accent">
                Zobacz
                <ChevronRight className="ml-1 h-4 w-4" aria-hidden />
              </span>
            </Link>
            <Link
              href={`${SITE}/produkt/migracja-strony-internetowej-na-inny-serwer/`}
              className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-odart-accent/40"
            >
              <Server className="h-8 w-8 text-odart-accent" aria-hidden />
              <h3 className="mt-4 text-lg font-bold text-white group-hover:text-orange-300">Migracja na inny serwer</h3>
              <p className="mt-2 text-sm text-neutral-400">Przeniesienie WordPress.</p>
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
          <Calculator className="h-10 w-10 text-odart-accent" aria-hidden />
          <h2 className="mt-6 text-3xl font-bold text-white sm:text-4xl">Poproś o wycenę</h2>
          <p className="mt-4 max-w-2xl text-neutral-400 leading-relaxed">
            Opisz cel strony, przykłady witryn z branży i oczekiwane funkcje — przygotuję orientacyjną wycenę i kolejne
            kroki. Kołobrzeg i obsługa zdalna.
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
