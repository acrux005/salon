import Link from "next/link";
import Image from "next/image";
import {
  ChevronRight,
  Palette,
  Code2,
  Sparkles,
  FileText,
  Headphones,
  Cpu,
  Globe,
  Server,
  Mail,
  Phone,
  MapPin,
  Check,
} from "lucide-react";
import { ODART_SITE_URL, ODART_PORTFOLIO_URL } from "@/lib/odartSite";
import { ODART_PORTFOLIO_ITEMS } from "@/lib/odartPortfolio";
import { OdartPublicShell } from "@/components/odart/OdartPublicShell";
import { OdartSnakeLineAccent } from "@/components/odart/OdartSnakeLineAccent";
import { OdartSpiralLine } from "@/components/odart/OdartSpiralLine";

const SITE = ODART_SITE_URL;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE}/#website`,
      url: `${SITE}/`,
      name: "ODART",
      description: "Zaawansowane aplikacje webowe, strony internetowe, WordPress, SEO — Kołobrzeg.",
      publisher: { "@id": `${SITE}/#org` },
      inLanguage: "pl-PL",
    },
    {
      "@type": "Organization",
      "@id": `${SITE}/#org`,
      name: "ODART — Ostry Dyżur Artystyczny",
      url: SITE,
      email: "biuro@odart.pl",
      telephone: "+48695432415",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Kołobrzeg",
        addressCountry: "PL",
      },
      founder: {
        "@type": "Person",
        name: "Rafał Kowalkowski",
        jobTitle: "Web developer & designer",
      },
    },
  ],
};

export function OdartHomePage() {
  return (
    <OdartPublicShell activeNav="home" jsonLd={jsonLd}>
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(249,115,22,0.1),transparent)] lg:hidden" aria-hidden />
          <OdartSnakeLineAccent side="left" />
          <OdartSnakeLineAccent side="right" phaseDelay />
          <OdartSpiralLine segments={28} />
          <div className="absolute inset-0 z-0 hidden lg:block">
            <Image
              src="https://odart.pl/wp-content/uploads/2026/02/odart._in_office_with_monitors_and_code_around_-ar_11_-styl_66ecffcf-aeef-478d-8736-270028d15204_3.jpg"
              alt="Rafał Kowalkowski — ODART"
              fill
              className="object-cover object-center opacity-40"
              sizes="100vw"
              priority
              role="presentation"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/95 to-transparent" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_20%_20%,rgba(249,115,22,0.08),transparent)]" aria-hidden />
          </div>
          <div className="relative z-10 mx-auto max-w-6xl px-4 py-20 lg:py-28 lg:px-6">
            <p className="text-sm font-medium uppercase tracking-wide text-odart-accent">Ostry Dyżur Artystyczny</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Zaawansowane aplikacje webowe
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-300">
              Tworzę nowoczesne aplikacje i systemy webowe — od architektury i interfejsu po integracje, API i
              wdrożenia produkcyjne. Łączę wydajność, bezpieczeństwo i UX tak, żeby produkt realnie wspierał Twój biznes.
              Przy stronach marketingowych i treściowych często wykorzystuję też{" "}
              <strong className="font-semibold text-white">WordPress</strong> jako sprawdzony CMS — gdy projekt tego
              wymaga lub klient potrzebuje wygodnej edycji treści.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href={`${SITE}/o-mnie/`}
                className="inline-flex items-center rounded-lg bg-odart-accent px-6 py-3 font-semibold text-white hover:brightness-110"
              >
                Więcej
                <ChevronRight className="ml-1 h-5 w-5" aria-hidden />
              </Link>
              <Link
                href={`${SITE}/uslugi/`}
                className="inline-flex items-center rounded-lg border border-white/10 px-6 py-3 font-semibold text-white hover:bg-neutral-800"
              >
                Usługi
              </Link>
              <Link
                href={`${SITE}/strony-internetowe/`}
                className="inline-flex items-center rounded-lg border border-odart-accent/35 bg-odart-accent/10 px-6 py-3 font-semibold text-white hover:bg-odart-accent/20"
              >
                Strony internetowe
              </Link>
            </div>
          </div>
        </section>

        {/* Strony WWW + Opieka IT — skrót treści z landingów */}
        <section className="border-b border-white/10 bg-neutral-950 px-4 py-16 lg:px-6" aria-labelledby="oferty-glowne">
          <div className="mx-auto max-w-6xl">
            <h2 id="oferty-glowne" className="text-center text-sm font-semibold uppercase tracking-wide text-odart-accent">
              ODART — Kołobrzeg i zdalnie
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-2xl font-bold text-white sm:text-3xl">
              Strony dla firm i opieka IT — skrót treści z landingów
            </p>
            <p className="mx-auto mt-4 max-w-3xl text-center text-sm text-neutral-500">
              Pełny tekst, pakiety, spirala w tle i formularze są na dedykowanych podstronach (to, co wcześniej w demo
              przez iframe — teraz w Next). Poniżej najważniejsze punkty i linki.
            </p>
            <div className="mt-12 grid gap-8 lg:grid-cols-2">
              <article className="flex flex-col rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent p-8 lg:p-10">
                <p className="text-xs font-medium uppercase tracking-wider text-odart-accent">Strony WWW</p>
                <h3 className="mt-3 text-xl font-bold text-white sm:text-2xl">
                  Tworzę strony internetowe, które zdobywają klientów
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-neutral-400">
                  Strona ma pracować: zbierać zapytania, pokazywać ofertę i być widoczna w Google — tak jak na landingowej
                  stronie WWW: sekcje O mnie, ból klienta, współpraca, usługi, pakiety, portfolio, opinie, formularz.
                </p>
                <p className="mt-3 text-sm text-neutral-500">
                  <span className="text-neutral-400">Z czym zgłaszają się klienci:</span> brak zapytań, słaba widoczność,
                  wolny mobile, treści bez edycji — to adresujemy w projekcie.
                </p>
                <div className="mt-6 grid grid-cols-3 gap-2 rounded-xl border border-white/10 bg-black/30 p-3 text-center text-[11px] sm:text-xs">
                  <div>
                    <p className="font-semibold text-odart-accent">Start</p>
                    <p className="text-neutral-500">od 1200 zł</p>
                  </div>
                  <div className="border-x border-white/10">
                    <p className="font-semibold text-odart-accent">Firma</p>
                    <p className="text-neutral-500">od 2500 zł</p>
                  </div>
                  <div>
                    <p className="font-semibold text-odart-accent">Premium</p>
                    <p className="text-neutral-500">od 4500 zł</p>
                  </div>
                </div>
                <ul className="mt-6 space-y-2 text-sm text-neutral-500">
                  <li className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-odart-accent" aria-hidden />
                    WordPress / Next.js, UX, SEO, formularz na stronie
                  </li>
                  <li className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-odart-accent" aria-hidden />
                    Spirala + layout jak w demo —{" "}
                    <span className="text-neutral-400">/strony-internetowe/</span>
                  </li>
                </ul>
                <Link
                  href={`${SITE}/strony-internetowe/`}
                  className="mt-8 inline-flex items-center font-semibold text-odart-accent hover:text-orange-300"
                >
                  Pełna strona „Strony internetowe”
                  <ChevronRight className="ml-1 h-5 w-5" aria-hidden />
                </Link>
              </article>
              <article className="flex flex-col rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent p-8 lg:p-10">
                <p className="text-xs font-medium uppercase tracking-wider text-odart-accent">IT dla firm</p>
                <h3 className="mt-3 text-xl font-bold text-white sm:text-2xl">Opieka IT dla firm — Kołobrzeg</h3>
                <p className="mt-4 text-sm leading-relaxed text-neutral-400">
                  Abonament: helpdesk, stacje, sieć, backup, bezpieczeństwo — ustalony zakres i kanał zgłoszeń. Na osobnej
                  podstronie masz pełny opis, sześć powodów „dlaczego abonament”, sekcję startu współpracy, podobne usługi i
                  formularz z kontekstem opieki IT.
                </p>
                <ul className="mt-6 space-y-2 text-sm text-neutral-500">
                  <li className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-odart-accent" aria-hidden />
                    Przewidywalny zakres i kanał zgłoszeń
                  </li>
                  <li className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-odart-accent" aria-hidden />
                    Infrastruktura i backup pod kontrolą
                  </li>
                  <li className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-odart-accent" aria-hidden />
                    Bezpieczeństwo na co dzień · Kołobrzeg, Koszalin, zdalnie
                  </li>
                </ul>
                <Link
                  href={`${SITE}/opieka-it-dla-firm-kolobrzeg/`}
                  className="mt-8 inline-flex items-center font-semibold text-odart-accent hover:text-orange-300"
                >
                  Pełna strona „Opieka IT”
                  <ChevronRight className="ml-1 h-5 w-5" aria-hidden />
                </Link>
              </article>
            </div>
          </div>
        </section>

        {/* 4 ikony — zakres */}
        <section className="border-b border-white/10 bg-neutral-950 px-4 py-16 lg:px-6" aria-labelledby="zakres-tytul">
          <div className="mx-auto max-w-6xl">
            <h2 id="zakres-tytul" className="sr-only">
              Zakres prac
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: Palette, title: "UI/UX Design", desc: "Projekt interfejsu w Figma i Adobe — przejrzysta ścieżka użytkownika." },
                { icon: Code2, title: "Aplikacje webowe", desc: "React, Next.js, integracje API — oraz WordPress, gdy projekt tego wymaga." },
                { icon: Sparkles, title: "Kreacja", desc: "Grafiki, animacje, spójna identyfikacja wizualna." },
                { icon: FileText, title: "Teksty", desc: "Treści pod SEO i czytelność — także we współpracy z Tobą." },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
                  <item.icon className="h-8 w-8 text-odart-accent" aria-hidden />
                  <h3 className="mt-4 text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm text-neutral-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Usługi internetowe — lead */}
        <section className="px-4 py-20 lg:px-6">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm font-medium uppercase tracking-wide text-odart-accent">Usługi internetowe</p>
            <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Kompleksowe wsparcie online</h2>
            <p className="mt-6 max-w-3xl text-neutral-400 leading-relaxed">
              Oferuję funkcjonalne produkty webowe — od rozbudowanych aplikacji i paneli po estetyczne, responsywne serwisy
              i sklepy. Łączę design, technologię i analitykę, żeby rozwiązanie pracowało na Twój wizerunek i wyniki.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-8">
              <div>
                <p className="text-4xl font-bold text-white">17+</p>
                <p className="text-sm text-neutral-500">lat praktyki (od 2008)</p>
              </div>
              <Link href={`${SITE}/o-mnie/`} className="text-odart-accent hover:text-orange-300 font-medium">
                O mnie →
              </Link>
            </div>
          </div>
        </section>

        {/* O mnie — skrót */}
        <section className="border-y border-white/10 bg-neutral-950/50 px-4 py-20 lg:px-6">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,1fr)_1.1fr] lg:items-center">
            <div className="relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900 lg:mx-0">
              <Image
                src="https://odart.pl/wp-content/uploads/2026/02/odart._in_office_with_monitors_and_code_around_-ar_11_-styl_66ecffcf-aeef-478d-8736-270028d15204_3.jpg"
                alt="Rafał Kowalkowski — ODART"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 28rem"
                priority
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white sm:text-4xl">Postaw na doświadczenie</h2>
              <p className="mt-6 text-neutral-400 leading-relaxed">
                Od 2008 roku rozwijam produkty cyfrowe — od portalu fotoferia.pl po aplikacje, panele i serwisy dla
                różnych branż. Projektuję UX/UI (Figma, Adobe), koduję w nowoczesnym stacku (m.in. React, Next.js), a
                WordPress czy PHP dobieram tam, gdzie mają sens biznesowy — np. treściowy CMS albo istniejący ekosystem.
                W każdym projekcie liczy się architektura, wydajność i użyteczność, nie tylko wygląd.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  { icon: Headphones, t: "Konsultacje", d: "Omówienie celów i zakresu." },
                  { icon: Cpu, t: "Wsparcie", d: "Pomoc po wdrożeniu." },
                  { icon: Globe, t: "WWW i CMS", d: "Od aplikacji na zamówienie po WordPress — dobór stacku pod cel." },
                  { icon: Server, t: "Hosting", d: "Porządek z domeną i SSL." },
                ].map((x) => (
                  <div
                    key={x.t}
                    className="flex gap-3 rounded-xl border border-neutral-800 bg-white/[0.02] p-6"
                  >
                    <x.icon className="h-6 w-6 shrink-0 text-odart-accent" aria-hidden />
                    <div>
                      <p className="font-semibold text-white">{x.t}</p>
                      <p className="text-sm text-neutral-500">{x.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Karty usług */}
        <section className="px-4 py-20 lg:px-6">
          <div className="mx-auto max-w-6xl">
            <p className="text-center text-sm font-medium uppercase tracking-wide text-odart-accent">Usługi</p>
            <h2 className="mt-2 text-center text-3xl font-bold text-white sm:text-4xl">Poznaj ofertę</h2>
            <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Aplikacje webowe",
                  desc: "React, Next.js, TypeScript — produkty webowe na zamówienie: wydajność, UX i wdrożenia pod Twój biznes.",
                  href: "/produkt/nowoczesne-aplikacje-webowe/",
                },
                {
                  title: "Panele i systemy dla firm",
                  desc: "Wewnętrzne narzędzia, role, raporty i workflow — mniej Excela, więcej porządku w operacjach.",
                  href: "/produkt/panele-i-systemy-dla-firm/",
                },
                {
                  title: "Integracje i API",
                  desc: "Łączenie sklepów, CRM, kurierów i księgowości — webhooki, REST i automatyzacja przepływu danych.",
                  href: "/produkt/integracje-api-i-automatyzacja/",
                },
                {
                  title: "Strona internetowa",
                  desc: "Profesjonalna witryna na WordPressie — dopasowana do marki i zaprojektowana pod konwersję.",
                  href: "/strony-internetowe/",
                },
                {
                  title: "Opieka IT dla firm Kołobrzeg",
                  desc: "Abonament informatyczny: helpdesk, sieć, stacje robocze, backup i bezpieczeństwo — pod małe i średnie firmy.",
                  href: "/opieka-it-dla-firm-kolobrzeg/",
                },
                {
                  title: "Migracja strony",
                  desc: "Bezpieczne przeniesienie WordPressa na nowy hosting lub domenę — bez utraty danych.",
                  href: "/produkt/migracja-strony-internetowej-na-inny-serwer/",
                },
                {
                  title: "Przywracanie po infekcji",
                  desc: "Czyszczenie malware, hardening i przywrócenie działania strony WordPress.",
                  href: "/produkt/przywracanie-strony-internetowej-wordpress/",
                },
                {
                  title: "Wycena strony",
                  desc: "Rozmowa o zakresie, funkcjach i kosztach — przejrzyście, zanim zaczniemy.",
                  href: "/produkt/wycena-strony-internetowej/",
                },
                {
                  title: "SEO — optymalizacja",
                  desc: "Audyt techniczny, treści i linkowanie — żeby Google widział Twoją stronę.",
                  href: "/produkt/seo-optymalizacja-strony/",
                },
                {
                  title: "Media społecznościowe",
                  desc: "Spójna komunikacja i grafiki w socialach pod Twój biznes.",
                  href: "/produkt/obsluga-mediow-spolecznosciowych/",
                },
                {
                  title: "Monitoring i kamery Kołobrzeg",
                  desc: "Montaż i konfiguracja systemów monitoringu wizyjnego — dom, firma, obiekt turystyczny.",
                  href: "/monitoring-i-kamery-kolobrzeg",
                },
              ].map((s) => (
                <article
                  key={s.title}
                  className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-6"
                >
                  <h3 className="text-lg font-semibold text-white">{s.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-neutral-400">{s.desc}</p>
                  <Link
                    href={`${SITE}${s.href}`}
                    className="mt-6 inline-flex items-center text-sm font-semibold text-odart-accent hover:text-orange-300"
                  >
                    Więcej
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Zakres: aplikacje + WWW + utrzymanie */}
        <section
          className="border-y border-white/10 bg-neutral-950 px-4 py-16 lg:px-6"
          aria-labelledby="zakres-projektu-tytul"
        >
          <div className="mx-auto max-w-3xl text-center">
            <h2 id="zakres-projektu-tytul" className="text-2xl font-bold text-white sm:text-3xl">
              Od pomysłu do działającego produktu
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-neutral-500 sm:text-base">
              Projektuję i wdrażam nowoczesne aplikacje webowe oraz witryny — z dobranym stackiem, integracjami i
              fundamentami pod SEO, tak żeby całość była spójna z Twoim biznesem, nie tylko „ładnym frontem”.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              {[
                "UX i interfejs",
                "React / Next.js",
                "API i integracje",
                "WordPress i treści",
                "Wydajność i bezpieczeństwo",
                "Wdrożenie i opieka",
              ].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-neutral-800/50 px-4 py-2 text-sm text-neutral-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Portfolio — skrót */}
        <section className="px-4 py-20 lg:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm font-medium uppercase tracking-wide text-odart-accent">Portfolio</p>
                <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Wybrane realizacje</h2>
              </div>
              <Link href={ODART_PORTFOLIO_URL} className="font-semibold text-odart-accent hover:text-orange-300">
                Zobacz wszystkie →
              </Link>
            </div>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {ODART_PORTFOLIO_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-neutral-950 shadow-lg shadow-black/30 transition hover:border-odart-accent/45 hover:shadow-xl hover:shadow-black/40"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-900">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      unoptimized
                      className="object-cover transition duration-500 group-hover:scale-[1.04]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"
                      aria-hidden
                    />
                    <p className="absolute bottom-3 left-4 right-4 text-xs font-medium uppercase tracking-wider text-white/90">
                      {item.host}
                    </p>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-lg font-semibold leading-snug text-white group-hover:text-orange-100">
                      {item.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-neutral-400">{item.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.tech.map((t) => (
                        <span
                          key={`${item.href}-${t}`}
                          className="rounded-md border border-white/10 bg-white/[0.05] px-2.5 py-1 text-xs font-medium text-neutral-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <span className="mt-5 inline-flex items-center text-sm font-semibold text-odart-accent group-hover:text-orange-300">
                      Otwórz stronę
                      <ChevronRight className="ml-1 h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Umiejętności + bio */}
        <section className="border-t border-white/10 bg-neutral-950/60 px-4 py-20 lg:px-6">
          <div className="mx-auto max-w-6xl lg:grid lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="text-3xl font-bold text-white">ODART — Ostry Dyżur Artystyczny</h2>
              <p className="mt-6 text-neutral-400 leading-relaxed">
                Specjalizuję się w aplikacjach webowych i produktowym UX: szybkie interfejsy, przemyślane API i
                wdrożenia, które da się utrzymać. WordPress czy klasyczny CMS wykorzystuję tam, gdzie skracają drogę do
                celu — od planu po wdrożenie, żebyś mógł skupić się na biznesie.
              </p>
              <div className="mt-10 space-y-6">
                {[
                  { label: "Software development", v: 87 },
                  { label: "Web development", v: 94 },
                  { label: "UI / UX design", v: 83 },
                ].map((row) => (
                  <div key={row.label}>
                    <div className="flex justify-between text-sm">
                      <span className="text-neutral-300">{row.label}</span>
                      <span className="text-odart-accent">{row.v}%</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-800">
                      <div className="h-full rounded-full bg-odart-accent" style={{ width: `${row.v}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <Link
                href={`${SITE}/o-mnie/`}
                className="mt-10 inline-flex font-semibold text-odart-accent hover:text-orange-300"
              >
                O mnie →
              </Link>
            </div>
            <div className="mt-12 space-y-6 lg:mt-0">
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
                <p className="text-lg font-semibold text-white">Rafał Kowalkowski</p>
                <p className="text-sm text-neutral-500">Web developer, UX/UI — fotograf</p>
                <p className="mt-6 text-sm text-neutral-400 leading-relaxed">
                  Zaczynam od celu: kto korzysta, jakie ma działać, co ma mierzyć. ODART dostarcza aplikacje i serwisy pod
                  konkretne wymagania — bez zbędnej złożoności i z myślą o tym, że produkt żyje po starcie.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
                <p className="text-sm font-medium uppercase tracking-wide text-odart-accent">Zamów.odart.pl</p>
                <p className="mt-2 text-sm text-neutral-400 leading-relaxed">
                  Aplikacja do zamawiania jedzenia online — pizza, sushi, bary. Wdrożyłem listę restauracji, menu z
                  kategoriami i cenami, koszyk, składanie zamówień (odbiór lub dostawa) z wyborem terminu, panel dla
                  restauracji (zarządzanie menu, kategorie, zamówienia i statusy) oraz powiadomienia o nowych zamówieniach.
                  Next.js, React, Prisma, SQLite.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Cennik */}
        <section className="px-4 py-20 lg:px-6">
          <div className="mx-auto max-w-6xl">
            <p className="text-center text-sm font-medium uppercase tracking-wide text-odart-accent">Cennik</p>
            <h2 className="mt-2 text-center text-3xl font-bold text-white sm:text-4xl">Wybierz plan</h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-neutral-400">
              Orientacyjne pakiety — dokładną wycenę ustalamy po krótkiej rozmowie.
            </p>
            <div className="mt-14 grid gap-8 lg:grid-cols-3">
              {[
                {
                  name: "Prosta strona",
                  price: "1000 zł",
                  sub: "strona internetowa",
                  feats: ["Panel administracyjny", "Motyw", "Instalacja i konfiguracja", "Materiały graficzne", "Treści"],
                },
                {
                  name: "Rozbudowana strona",
                  price: "1800 zł",
                  sub: "strona internetowa",
                  highlight: true,
                  feats: [
                    "Panel administracyjny",
                    "Motyw",
                    "Instalacja i konfiguracja",
                    "Materiały i treści",
                    "Dodatkowe zakładki",
                    "Analityka",
                  ],
                },
                {
                  name: "Sklep internetowy",
                  price: "2500 zł",
                  sub: "sklep",
                  feats: [
                    "Panel administracyjny",
                    "Motyw",
                    "Instalacja i konfiguracja",
                    "Materiały i treści",
                    "Dodatkowe zakładki",
                    "Analityka",
                  ],
                },
              ].map((plan) => (
                <div
                  key={plan.name}
                  className={`flex flex-col rounded-2xl border p-8 ${
                    plan.highlight
                      ? "border-odart-accent/50 bg-neutral-950/50 ring-1 ring-odart-accent/30"
                      : "border-white/10 bg-white/[0.02]"
                  }`}
                >
                  <p className="text-sm text-odart-accent">{plan.name}</p>
                  <p className="mt-4 text-3xl font-bold text-white">
                    {plan.price}
                    <span className="text-base font-normal text-neutral-500"> / {plan.sub}</span>
                  </p>
                  <ul className="mt-8 flex-1 space-y-3">
                    {plan.feats.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-neutral-300">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-odart-accent" aria-hidden />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`${SITE}/kontakt/`}
                    className={`mt-8 block rounded-lg py-3 text-center text-sm font-semibold ${
                      plan.highlight
                        ? "bg-odart-accent text-white hover:brightness-110"
                        : "border border-white/10 text-white hover:bg-neutral-800"
                    }`}
                  >
                    Wybierz plan
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-white/10 bg-neutral-950/50 px-4 py-20 lg:px-6">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-3xl font-bold text-white">Często zadawane pytania</h2>
            <div className="mt-10 space-y-3">
              {[
                {
                  q: "Co z serwerem i domeną?",
                  a: "Pomagam dobrać hosting, domenę i certyfikat SSL — żeby witryna działała stabilnie i bezpiecznie.",
                },
                {
                  q: "Czy obsługujesz tylko Kołobrzeg?",
                  a: "Pracuję zdalnie z klientami w całej Polsce; spotkania możliwe w regionie po uzgodnieniu.",
                },
                {
                  q: "Ile trwa realizacja projektu?",
                  a: "Prosta strona — zwykle 1–2 tygodnie. Rozbudowane strony i aplikacje — od kilku tygodni do kilku miesięcy, zależnie od zakresu. Termin ustalamy na początku współpracy.",
                },
                {
                  q: "Jak wygląda współpraca — od czego zaczynamy?",
                  a: "Rozmowa o celu, grupie docelowej i wymaganiach. Potem krótka wycena i plan. Zaczynam od projektu (czasem w Figma) albo od strony docelowej — zależnie od skali.",
                },
                {
                  q: "Czy oferujesz wsparcie po wdrożeniu?",
                  a: "Tak — naprawy, aktualizacje, dodawanie treści. Koszty ustalamy indywidualnie; można też umówić się na pakiet opieki miesięcznej.",
                },
                {
                  q: "Co wchodzi w cenę strony?",
                  a: "Instalacja, motyw, podstawowa konfiguracja, treści (jeśli w pakiecie). Hosting i domena zwykle rozliczane osobno — pomagam je wybrać.",
                },
                {
                  q: "Jak płatność za projekt?",
                  a: "Zazwyczaj zaliczka na start (np. 30–50%) i reszta po zakończeniu. W większych projektach — etapy z osobnymi rozliczeniami.",
                },
              ].map((faq) => (
                <details
                  key={faq.q}
                  className="group rounded-xl border border-white/10 bg-white/[0.02] px-5 py-4 open:bg-neutral-900/60"
                >
                  <summary className="cursor-pointer list-none font-medium text-white marker:content-none [&::-webkit-details-marker]:hidden">
                    {faq.q}
                  </summary>
                  <p className="mt-3 text-sm text-neutral-400 leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Blog skrót */}
        <section className="px-4 py-20 lg:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm font-medium uppercase tracking-wide text-odart-accent">Blog</p>
                <h2 className="mt-2 text-3xl font-bold text-white">Ostatnie wpisy</h2>
              </div>
              <Link href={`${SITE}/blog/`} className="font-semibold text-odart-accent hover:text-orange-300">
                Wszystkie artykuły →
              </Link>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {[
                { t: "Realizacje", d: "Przegląd ostatnich projektów i przykładów stron." },
                { t: "Zasady pozycjonowania SEO", d: "Słowa kluczowe, struktura i dobre praktyki." },
                { t: "Strona internetowa Koszalin", d: "Spotkania i realizacje w regionie." },
              ].map((post) => (
                <article key={post.t} className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
                  <h3 className="font-semibold text-white">{post.t}</h3>
                  <p className="mt-2 text-sm text-neutral-400">{post.d}</p>
                  <Link href={`${SITE}/blog/`} className="mt-4 inline-block text-sm font-medium text-odart-accent hover:text-orange-300">
                    czytaj dalej →
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Kontakt */}
        <section id="kontakt" className="border-t border-white/10 bg-gradient-to-br from-neutral-950/50 to-black px-4 py-20 lg:px-6">
          <div className="mx-auto max-w-6xl lg:grid lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="text-3xl font-bold text-white">Kontakt i wycena</h2>
              <p className="mt-4 text-neutral-400">
                Napisz kilka słów o projekcie — oddzwonię lub odpiszę z propozycją terminu rozmowy.
              </p>
              <ul className="mt-8 space-y-4 text-neutral-300">
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-odart-accent" aria-hidden />
                  <a href="tel:+48695432415" className="hover:text-white">
                    +48 695 432 415
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-odart-accent" aria-hidden />
                  <a href="mailto:biuro@odart.pl" className="hover:text-white">
                    biuro@odart.pl
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 shrink-0 text-odart-accent mt-0.5" aria-hidden />
                  Kołobrzeg
                </li>
              </ul>
            </div>
            <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.02] p-8 lg:mt-0">
              <p className="text-sm font-medium text-white">Szybki kontakt</p>
              <p className="mt-2 text-sm text-neutral-500">Formularz kontaktowy na tej stronie lub bezpośrednio e-mail.</p>
              <Link
                href={`${SITE}/kontakt/`}
                className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-odart-accent py-3 font-semibold text-white hover:brightness-110"
              >
                Przejdź do formularza
              </Link>
            </div>
          </div>
        </section>
    </OdartPublicShell>
  );
}
