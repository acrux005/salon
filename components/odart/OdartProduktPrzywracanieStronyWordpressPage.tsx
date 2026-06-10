import Link from "next/link";
import { ChevronRight, LayoutTemplate, MessageCircle, Server, ShieldAlert } from "lucide-react";
import { ODART_SITE_URL } from "@/lib/odartSite";
import { OdartPublicShell } from "@/components/odart/OdartPublicShell";

const SITE = ODART_SITE_URL;
const CANONICAL = `${SITE}/produkt/przywracanie-strony-internetowej-wordpress/`;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${CANONICAL}#webpage`,
      url: CANONICAL,
      name: "Przywracanie zainfekowanej strony WordPress | ODART",
      description:
        "Czyszczenie WordPress po malware: diagnoza, usunięcie złośliwego kodu, odbudowa z kopii, zabezpieczenia, raport. Kołobrzeg.",
      isPartOf: { "@id": `${SITE}/#website` },
      inLanguage: "pl-PL",
    },
    {
      "@type": "Service",
      "@id": `${CANONICAL}#service`,
      name: "Przywracanie strony internetowej WordPress po infekcji",
      serviceType: "Odzyskiwanie witryny WordPress po ataku lub malware",
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

const serviceBlocks: { title: string; bullets: string[] }[] = [
  {
    title: "Diagnoza zagrożenia",
    bullets: [
      "Kompleksowa analiza strony w celu zidentyfikowania źródła infekcji.",
      "Skanowanie witryny w poszukiwaniu złośliwego oprogramowania, backdoorów i innych potencjalnych luk w zabezpieczeniach.",
    ],
  },
  {
    title: "Usunięcie malware",
    bullets: [
      "Skanowanie i usuwanie zainfekowanych plików oraz złośliwego kodu z bazy danych WordPressa.",
      "Wykrywanie i usuwanie backdoorów lub ukrytych punktów wejścia wykorzystanych przez atakującego.",
    ],
  },
  {
    title: "Odbudowa i przywrócenie plików",
    bullets: [
      "Przywracanie usuniętych lub zainfekowanych plików z kopii zapasowej — warto regularnie tworzyć kopie strony.",
      "Aktualizacja i oczyszczenie zainfekowanych wtyczek i motywów.",
    ],
  },
  {
    title: "Aktualizacja i zabezpieczenia",
    bullets: [
      "Aktualizacja WordPressa, wtyczek i motywów do najnowszych wersji.",
      "Wzmocnienie zabezpieczeń: zmiana haseł, ograniczenia dostępu, konfiguracja firewalla.",
    ],
  },
  {
    title: "Monitorowanie bezpieczeństwa",
    bullets: [
      "Wdrożenie narzędzi monitorujących bezpieczeństwo w czasie rzeczywistym.",
      "Konfiguracja powiadomień o potencjalnych zagrożeniach.",
    ],
  },
  {
    title: "Zapobieganie przyszłym atakom",
    bullets: [
      "Porady dotyczące praktyk bezpieczeństwa online.",
      "Instalacja i konfiguracja wtyczek bezpieczeństwa WordPressa.",
      "Edukacja właścicieli witryn w zakresie utrzymania bezpieczeństwa.",
    ],
  },
  {
    title: "Przywracanie funkcjonalności",
    bullets: [
      "Testy witryny po usunięciu zagrożenia.",
      "Przywrócenie utraconych funkcji i danych.",
    ],
  },
  {
    title: "Raportowanie i analiza",
    bullets: [
      "Raport z ataku i podjętych działań.",
      "Analiza wektora ataku w celu ograniczenia podobnych incydentów w przyszłości.",
    ],
  },
];

const manualSteps: string[] = [
  "Zmień lub przełącz wersję PHP w panelu kontrolnym. Zmiana wersji PHP resetuje i kończy wszystkie procesy. Jeśli używasz PHP 7.4, możesz przełączyć na 7.0, a następnie wrócić do 7.4.",
  "Zrób zrzut ekranu strony „Wtyczki” w WordPressie albo sporządź listę zainstalowanych wtyczek.",
  "Utwórz nowe, bezpieczne hasło FTP.",
  "Pobierz folder motywu (theme) ze swojej strony.",
  "Pobierz wszystkie pliki z głównego folderu instalacji WordPress (folder z plikiem wp-config.php). Jeśli masz pliki w głównym folderze konta hostingowego, pobierz je także. Przykład: /public_html/{pobierz te pliki}.",
  "Usuń wszystkie pliki z głównego folderu instalacji WordPress. Jeśli masz pliki w głównym folderze konta, usuń je tamże. Przykład: /public_html/{usuń te pliki}.",
  "Usuń foldery rdzenia WordPress: wp-admin i wp-includes.",
  "Usuń wszystkie foldery motywów w /wp-content/themes/. Sprawdź /wp-content/index.php i /wp-content/themes/index.php — powinno być wyłącznie // Silence is golden. Usuń i zastąp pliki, jeśli jest kod hakerski. Ręczne usunięcie folderu motywu nie usuwa ustawień z bazy.",
  "Usuń wszystkie foldery wtyczek w /wp-content/plugins/. Sprawdź /wp-content/plugins/index.php — ta sama zasada co wyżej. Ustawienia wtyczek zostają w bazie.",
  "Sprawdź domyślne foldery konta oraz własne katalogi (cgi, cgi-bin, stats, errordocs, logs itd.). Przy podejrzanych plikach zrób kopię lokalnie, usuń z serwera. Przy pomyłce support hostingu może przywrócić pliki systemowe.",
  "Pobierz archiwum WordPress z oficjalnej strony, rozpakuj na komputerze.",
  "Utwórz archiwa ZIP folderów wp-admin i wp-includes (np. Windows: prawy przycisk → Wyślij do → folder skompresowany; na innych systemach 7-Zip, WinZip itp.).",
  "Prześlij ZIP-y wp-admin i wp-includes na hosting i rozpakuj w tym samym miejscu, gdzie stały wcześniejsze foldery.",
  "Prześlij pliki główne WordPressa (index.php, license.txt, readme.html itd.) do folderu instalacji.",
  "Prześlij zachowany wp-config.php — przed wgraniem otwórz go i upewnij się, że nie ma kodu hakerskiego.",
  "Prześlij nowy motyw lub zaufaną kopię motywu do /wp-content/themes/. Zalecana jest świeża kopia motywu zamiast starego archiwum.",
  "Zaloguj się do panelu WordPressa i ponownie zainstaluj wtyczki.",
  "Prześlij pozostałe pliki własne (z głównej instalacji i konta) dopiero po sprawdzeniu, że nie zawierają złośliwego kodu.",
];

export function OdartProduktPrzywracanieStronyWordpressPage() {
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
            <span className="text-neutral-300">Przywracanie strony internetowej WordPress</span>
          </nav>

          <p className="mt-8 text-sm font-medium uppercase tracking-wide text-odart-accent">Usługa</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Przywracanie strony internetowej WordPress
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-neutral-300">
            Usługa przywrócenia zainfekowanej strony na WordPressie jest kluczowa dla bezpieczeństwa, reputacji i
            działania witryny. Gdy strona zostanie zainfekowana malware lub padnie ofiarą ataku, ważne jest szybkie
            zidentyfikowanie zagrożenia, jego usunięcie i przywrócenie strony do pełnej sprawności.{" "}
            <Link href={`${SITE}/kontakt/`} className="font-semibold text-odart-accent hover:text-orange-300">
              Napisz w sprawie czyszczenia
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
            <p>
              Usługa przywrócenia zainfekowanej strony internetowej na WordPressie jest kluczowa dla utrzymania
              bezpieczeństwa, reputacji i funkcjonalności witryny. Gdy strona zostanie zainfekowana przez złośliwe
              oprogramowanie (malware) lub stanie się ofiarą ataku, ważne jest podjęcie natychmiastowych działań w celu
              zidentyfikowania i usunięcia zagrożenia oraz przywrócenia strony do pełnej sprawności.
            </p>

            <h3 className="mt-12 text-xl font-bold text-white">Usługa</h3>

            <ol className="mt-8 list-decimal space-y-10 pl-6 marker:text-odart-accent">
              {serviceBlocks.map((block) => (
                <li key={block.title} className="pl-2">
                  <strong className="text-neutral-200">{block.title}</strong>
                  <ul className="mt-4 list-disc space-y-2 pl-5 marker:text-neutral-600">
                    {block.bullets.map((b) => (
                      <li key={b.slice(0, 48)} className="text-neutral-400">
                        {b}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>

            <p className="mt-12 text-neutral-400">
              Usługa przywracania zainfekowanej strony wymaga współpracy z doświadczonymi osobami od bezpieczeństwa,
              które usuną zagrożenie i wzmocnią witrynę przed kolejnymi incydentami. Regularne monitorowanie, aktualizacje
              i świadomość bezpieczeństwa utrzymują stronę w dobrej kondycji.
            </p>

            <h3 className="mt-14 text-xl font-bold text-white">Kroki (przywracanie ręczne — skrót procedury)</h3>
            <p className="text-sm text-neutral-500">
              Poniżej uproszczona lista kroków znana z praktyki naprawczej. Wykonuj ją ostrożnie albo zleć audyt
              specjaliście — błąd może uszkodzić witrynę lub dane.
            </p>
            <ol className="mt-6 list-decimal space-y-4 pl-6 marker:text-odart-accent text-neutral-400">
              {manualSteps.map((step, i) => (
                <li key={i} className="pl-2 leading-relaxed">
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 px-4 py-12 lg:px-6 lg:py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Podobne usługi</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <Link
              href={`${SITE}/strony-internetowe/`}
              className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-odart-accent/40"
            >
              <LayoutTemplate className="h-8 w-8 text-odart-accent" aria-hidden />
              <h3 className="mt-4 text-lg font-bold text-white group-hover:text-orange-300">
                Budowa strony internetowej na WordPressie
              </h3>
              <p className="mt-2 text-sm text-neutral-400">Nowa strona — projekt i wdrożenie.</p>
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
              <h3 className="mt-4 text-lg font-bold text-white group-hover:text-orange-300">
                Migracja strony internetowej na inny serwer
              </h3>
              <p className="mt-2 text-sm text-neutral-400">Przeniesienie WordPress na nowy hosting.</p>
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
              <p className="mt-2 text-sm text-neutral-400">Opisz sytuację — przygotuję wycenę.</p>
              <span className="mt-4 inline-flex items-center text-sm font-semibold text-odart-accent">
                Kontakt
                <ChevronRight className="ml-1 h-4 w-4" aria-hidden />
              </span>
            </Link>
          </div>
          <p className="mt-8 text-center text-sm text-neutral-500">
            SEO:{" "}
            <Link href={`${SITE}/pozycjonowanie-seo/`} className="text-odart-accent hover:text-orange-300">
              optymalizacja strony
            </Link>
          </p>
        </div>
      </section>

      <section className="px-4 py-16 lg:px-6">
        <div className="mx-auto max-w-6xl rounded-2xl border border-odart-accent/30 bg-gradient-to-br from-neutral-900/80 to-black p-8 lg:p-12">
          <ShieldAlert className="h-10 w-10 text-odart-accent" aria-hidden />
          <h2 className="mt-6 text-3xl font-bold text-white sm:text-4xl">Infekcja lub podejrzenie ataku?</h2>
          <p className="mt-4 max-w-2xl text-neutral-400 leading-relaxed">
            Opisz objawy (np. przekierowania, ostrzeżenia przeglądarki, nieznane konta). Przygotuję plan czyszczenia lub
            odzyskania witryny. Kołobrzeg i obsługa zdalna.
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
