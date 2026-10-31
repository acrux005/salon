import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Layers,
  Mail,
  MapPin,
  Phone,
  Shield,
  Sparkles,
} from "lucide-react";
import { ODART_PORTFOLIO_URL, ODART_SITE_URL } from "@/lib/odartSite";
import { OdartPublicShell } from "@/components/odart/OdartPublicShell";
import { OdartKontaktForm } from "@/components/odart/OdartKontaktForm";
import { OdartSnakeLineAccent } from "@/components/odart/OdartSnakeLineAccent";
import { OdartSpiralLine } from "@/components/odart/OdartSpiralLine";

const SITE = ODART_SITE_URL;

type Props = {
  /** Kanoniczny URL dla JSON-LD (np. zawsze /strony-internetowe/ przy duplikacie /produkt/…) */
  jsonLdCanonicalPathname?: string;
  /** Wariant lokalny SEO — m.in. areaServed, hero, dane w stopce */
  localSeo?: { city: string; cityLocative: string };
};

function canonicalUrl(pathname: string): string {
  const base = SITE.replace(/\/$/, "");
  const p = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${base}${p.endsWith("/") ? p : `${p}/`}`;
}

const localExamples = [
  { cat: "Restauracja", title: "Smaczna Ryba", href: "https://smacznaryba.pl/" },
  { cat: "Gabinet", title: "Beauty Room", href: "https://roombeauty.pl/" },
  { cat: "Sklep", title: "Kos-Mos", href: "https://kos-mos.pl/" },
];

const portfolioItems = [
  { cat: "Sklep", title: "Smaczna Ryba", href: "https://smacznaryba.pl/" },
  { cat: "Deweloper", title: "Platforma sprzedaży mieszkań", href: `${SITE}/project/strona-dla-dewelopera/` },
  { cat: "Kancelaria", title: "Biuro Rachunkowe MKProfit", href: "https://mkprofit.com.pl/" },
  { cat: "Szkolenia", title: "ProKursy-Online", href: "https://prokursy-online.pl/" },
  { cat: "Hotel", title: "HotelOps", href: "/hotel/" },
  { cat: "Portal", title: "Fotoferia", href: "https://fotoferia.pl/" },
];

const testimonials = [
  {
    quote:
      "Właściciel ODA jest również właścicielem portalu fotograficznego Fotoferia, którego jestem uczestnikiem. Jego profesjonalizm, kompetencje, intelekt, kreatywność pomogły mu stworzyć niebanalny, profesjonalny, nowatorski portal na wysokim poziomie.",
    author: "Anna K.",
  },
  {
    quote:
      "Serdecznie polecam! ODA to konkretna i fachowa pomoc w budowie portfolio. Świetny kontakt i pełen profesjonalizm.",
    author: "Lukas K.",
  },
  {
    quote:
      "Miałam przyjemność współpracować z Panem Rafałem przy tworzeniu moich stron internetowych i jestem bardzo zadowolona z efektów. Strony zostały stworzone na szablonie, ale dzięki dbałości o szczegóły wyglądają profesjonalnie i są w pełni dostosowane do moich potrzeb.",
    author: "Milena M.",
  },
];

const packages = [
  {
    name: "Wizytówka",
    subtitle: "Mała firma, gabinet, jednoosobowa działalność",
    price: "od 1200 zł",
    features: [
      "Strona wizytówka (do 5 podstron)",
      "Gotowy, estetyczny układ",
      "Formularz kontaktowy",
      "Optymalizacja pod telefon",
      "Podstawowe SEO",
      "Publikacja na hostingu",
    ],
  },
  {
    name: "Firma",
    subtitle: "Najczęściej wybierany",
    price: "od 2500 zł",
    highlight: true,
    features: [
      "Indywidualny układ strony",
      "Strona sprzedażowa / usługowa",
      "Formularze i sekcje ofertowe",
      "Przygotowanie pod Google (SEO)",
      "Szkolenie z obsługi",
      "Pomoc po wdrożeniu",
    ],
  },
  {
    name: "Premium",
    subtitle: "Dla firm, które chcą pozyskiwać klientów online",
    price: "od 4500 zł",
    features: [
      "Projekt UX dopasowany do branży",
      "Strona lub sklep",
      "Integracje (płatności, CRM, automatyzacje)",
      "Wydajność i optymalizacja Core Web Vitals",
      "Opieka po wdrożeniu",
      "Możliwość rozbudowy",
    ],
  },
];

export function OdartStronyInternetoweDemoPage({
  jsonLdCanonicalPathname = "/strony-internetowe/",
  localSeo,
}: Props) {
  const CANONICAL = canonicalUrl(jsonLdCanonicalPathname);
  const pageH1 = localSeo
    ? `Strony internetowe w ${localSeo.cityLocative}`
    : "Strony internetowe w Kołobrzegu";
  const webPageName = localSeo
    ? `Strony internetowe ${localSeo.city} | ODART`
    : "Strony internetowe Kołobrzeg od 1200 zł | ODART";
  const webPageDescription = localSeo
    ? `Strony WWW dla firm w ${localSeo.cityLocative}. Wizytówka od 1200 zł, strona firmowa od 2500 zł.`
    : "Strony dla firm z Kołobrzegu i okolic. Wizytówka od 1200 zł, strona firmowa od 2500 zł. Rafał Kowalkowski, od 2008. Tel. 695 432 415.";
  const serviceAreaServed = localSeo
    ? [
        { "@type": "City" as const, name: localSeo.city },
        { "@type": "City" as const, name: "Kołobrzeg" },
      ]
    : { "@type": "City" as const, name: "Kołobrzeg" };
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${CANONICAL}#webpage`,
        url: CANONICAL,
        name: webPageName,
        description: webPageDescription,
        isPartOf: { "@id": `${SITE}/#website` },
        inLanguage: "pl-PL",
      },
      {
        "@type": "Service",
        "@id": `${CANONICAL}#service`,
        name: pageH1,
        serviceType: "Tworzenie stron internetowych",
        provider: { "@id": `${SITE}/#org` },
        areaServed: serviceAreaServed,
        offers: [
          {
            "@type": "Offer",
            name: "Wizytówka",
            price: "1200",
            priceCurrency: "PLN",
            priceSpecification: { "@type": "PriceSpecification", minPrice: "1200", priceCurrency: "PLN" },
          },
          {
            "@type": "Offer",
            name: "Firma",
            price: "2500",
            priceCurrency: "PLN",
            priceSpecification: { "@type": "PriceSpecification", minPrice: "2500", priceCurrency: "PLN" },
          },
        ],
      },
      {
        "@type": "Organization",
        "@id": `${SITE}/#org`,
        name: "ODART — Ostry Dyżur Artystyczny",
        url: SITE,
        telephone: "+48695432415",
        email: "biuro@odart.pl",
      },
    ],
  };

  return (
    <OdartPublicShell activeNav="uslugi" jsonLd={jsonLd}>
      <OdartSpiralLine mode="page" />
      <div className="relative z-10">
      <section className="relative overflow-hidden border-b border-white/10 bg-gradient-to-b from-neutral-950 via-black to-black px-4 py-16 lg:px-6 lg:py-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(249,115,22,0.12),transparent)]" aria-hidden />
        <OdartSnakeLineAccent side="left" />
        <OdartSnakeLineAccent side="right" phaseDelay />
        <div className="relative mx-auto max-w-4xl text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-odart-accent">
            ODART — Rafał Kowalkowski
          </p>
          <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-[3.25rem] lg:leading-tight">
            {pageH1}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg font-medium text-white">
            Wizytówka od 1200 zł · strona firmowa od 2500 zł
          </p>
          <p className="mt-3">
            <a href="tel:+48695432415" className="text-lg font-semibold text-odart-accent hover:text-orange-300">
              695 432 415
            </a>
          </p>
          <div className="mx-auto mt-8 grid max-w-3xl gap-3 text-left sm:grid-cols-3">
            {localExamples.map((item) => (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 hover:border-odart-accent/40"
              >
                <span className="text-xs font-medium uppercase tracking-wide text-odart-accent/90">{item.cat}</span>
                <span className="mt-1 block text-sm font-semibold text-white">{item.title}</span>
              </a>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-neutral-400">
            Wizytówka, strona usługowa albo sklep. Układ pod ofertę, formularz, podstawowe SEO. WordPress, gdy chcesz
            sam zmieniać treści.
          </p>
          {localSeo && (
            <p className="mx-auto mt-4 max-w-2xl text-sm text-neutral-500">
              Realizacje i spotkania w {localSeo.cityLocative} i online — siedziba: Kołobrzeg.
            </p>
          )}
          <p className="mt-4 text-sm text-neutral-500">Firmy · gabinety · trenerzy · deweloperzy · usługi lokalne</p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href={`${SITE}/kontakt/`}
              className="inline-flex items-center rounded-lg bg-odart-accent px-8 py-3.5 text-[15px] font-semibold text-white hover:brightness-110"
            >
              Porozmawiajmy o Twojej stronie
              <ChevronRight className="ml-1 h-5 w-5" aria-hidden />
            </Link>
            <Link
              href={ODART_PORTFOLIO_URL}
              className="inline-flex items-center rounded-lg border border-white/15 px-8 py-3.5 text-[15px] font-semibold text-white hover:bg-white/5"
            >
              Zobacz realizacje
              <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 px-4 py-16 lg:px-6">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-odart-accent">O mnie</p>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Robię to od 2008</h2>
          <p className="mt-6 text-lg leading-relaxed text-neutral-400">
            Najpierw rozmawiamy, po co ta strona. Potem układ, teksty, wdrożenie. WordPress, PHP albo Next.js — zależnie
            od tego, kto ma później wchodzić w panel.
          </p>
          <p className="mt-4 font-medium text-neutral-300">
            Ma być szybka, czytelna na telefonie i mieć miejsce, gdzie ktoś zostawi wiadomość.
          </p>
        </div>
      </section>

      <section className="border-b border-white/10 bg-neutral-950/50 px-4 py-16 lg:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Z czym zgłaszają się klienci</h2>
          <p className="mt-6 text-neutral-400 leading-relaxed">
            Strona jest, a telefon milczy. Formularz jest, nikt nie pisze. W Google Cię nie ma. Na telefonie rozjeżdża
            się layout. Żeby zmienić godzinę otwarcia, trzeba dzwonić do „pana od stron”.
            <span className="text-neutral-300"> Tym się zajmuję.</span>
          </p>
        </div>
      </section>

      <section className="border-b border-white/10 px-4 py-16 lg:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Jak wygląda współpraca</h2>
          <p className="mt-6 text-neutral-400 leading-relaxed">
            Opisujesz ofertę. Układam stronę tak, żeby dało się z niej napisać albo zadzwonić. Wdrażam, ustawiam
            formularz i podstawowe SEO. Dostajesz panel albo ustalamy, że zmiany idą przeze mnie.
          </p>
          <ul className="mt-8 space-y-3">
            {[
              "Formularz i telefon na wierzchu.",
              "Działa na telefonie, nie tylko na desktopie.",
              "Da się zmienić treść bez zgadywania.",
            ].map((t) => (
              <li key={t} className="flex gap-3 text-neutral-300">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-odart-accent" aria-hidden />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-b border-white/10 px-4 py-16 lg:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold text-white sm:text-4xl">Usługi</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <article className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
              <Sparkles className="h-10 w-10 text-odart-accent" aria-hidden />
              <h3 className="mt-6 text-xl font-bold text-white">Strona, z której ktoś napisze</h3>
              <p className="mt-2 text-sm text-neutral-500">Nie sam wygląd. Oferta, kontakt, szybkość.</p>
              <ul className="mt-6 space-y-2 text-sm text-neutral-400">
                {["Struktura dopasowana do branży", "Formularze i zapytania trafiają do Ciebie", "Strona szybka i responsywna", "Gotowa pod pozycjonowanie (SEO)", "Integracje z mapą, social media i analytics"].map((x) => (
                  <li key={x} className="flex gap-2">
                    <span className="text-odart-accent">·</span> {x}
                  </li>
                ))}
              </ul>
              <Link href={`${SITE}/kontakt/`} className="mt-8 inline-flex items-center text-sm font-semibold text-odart-accent hover:text-orange-300">
                Zapytaj o wycenę <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </article>
            <article className="rounded-2xl border border-odart-accent/30 bg-white/[0.04] p-8 ring-1 ring-odart-accent/20">
              <Layers className="h-10 w-10 text-odart-accent" aria-hidden />
              <h3 className="mt-6 text-xl font-bold text-white">Proces tworzenia krok po kroku</h3>
              <p className="mt-2 text-sm text-neutral-500">Wiesz co powstaje i dlaczego — bez chaosu i zgadywania.</p>
              <ul className="mt-6 space-y-2 text-sm text-neutral-400">
                {["Analiza potrzeb i celu strony", "Projekt układu i UX", "Wdrożenie (WordPress / custom / Next.js)", "Testy i poprawki", "Publikacja i szkolenie z obsługi"].map((x) => (
                  <li key={x} className="flex gap-2">
                    <span className="text-odart-accent">·</span> {x}
                  </li>
                ))}
              </ul>
              <Link href={`${SITE}/kontakt/`} className="mt-8 inline-flex items-center text-sm font-semibold text-odart-accent hover:text-orange-300">
                Zapytaj o wycenę <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </article>
            <article className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
              <Shield className="h-10 w-10 text-odart-accent" aria-hidden />
              <h3 className="mt-6 text-xl font-bold text-white">Opieka po wdrożeniu</h3>
              <p className="mt-2 text-sm text-neutral-500">Strona nie zostaje sama po publikacji.</p>
              <ul className="mt-6 space-y-2 text-sm text-neutral-400">
                {["Aktualizacje i bezpieczeństwo", "Kopie zapasowe", "Rozbudowa i nowe sekcje", "Pomoc techniczna", "Stałe wsparcie"].map((x) => (
                  <li key={x} className="flex gap-2">
                    <span className="text-odart-accent">·</span> {x}
                  </li>
                ))}
              </ul>
              <Link href={`${SITE}/kontakt/`} className="mt-8 inline-flex items-center text-sm font-semibold text-odart-accent hover:text-orange-300">
                Zapytaj o wycenę <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-neutral-950/40 px-4 py-12 lg:px-6">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h2 className="text-xl font-bold text-white sm:text-2xl">Tworzenie stron internetowych</h2>
            <p className="mt-2 text-neutral-400">Tworzę strony od podstaw — strona firmowa, sklep, formularze i integracje.</p>
            <ul className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-neutral-500 sm:justify-start">
              <li>Strony i sklepy</li>
              <li>Formularze i zapytania</li>
              <li>Widoczność w Google</li>
            </ul>
          </div>
          <a
            href="tel:+48695432415"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-6 py-4 text-lg font-semibold text-white hover:border-odart-accent/40"
          >
            <Phone className="h-5 w-5 text-odart-accent" aria-hidden />
            +48 695 432 415
          </a>
        </div>
      </section>

      <section className="border-b border-white/10 px-4 py-16 lg:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold text-white sm:text-4xl">Jak to zwykle wygląda</h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-neutral-400">
            Trzy typowe zakresy. Kwotę mówię po rozmowie, nie z tabelki.
          </p>
          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {packages.map((pkg) => (
              <article
                key={pkg.name}
                className={`flex flex-col rounded-2xl border p-8 ${
                  pkg.highlight
                    ? "border-odart-accent/40 bg-gradient-to-b from-odart-accent/10 to-transparent"
                    : "border-white/10 bg-white/[0.02]"
                }`}
              >
                <h3 className="text-xl font-bold text-white">{pkg.name}</h3>
                <p className="mt-1 text-sm text-neutral-500">{pkg.subtitle}</p>
                <p className="mt-4 text-2xl font-bold text-odart-accent">{pkg.price}</p>
                <ul className="mt-6 flex-1 space-y-3 text-sm text-neutral-400">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-odart-accent" aria-hidden />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`${SITE}/kontakt/`}
                  className={`mt-8 inline-flex items-center justify-center rounded-lg py-3 text-center text-sm font-semibold ${
                    pkg.highlight ? "bg-odart-accent text-white hover:brightness-110" : "border border-white/15 text-white hover:bg-white/5"
                  }`}
                >
                  Napisz o takim zakresie
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-neutral-950/40 px-4 py-16 lg:px-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl font-bold text-white sm:text-3xl">Zamówienia i panele gabinetów</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-neutral-400">
            Oprócz stron WWW utrzymuję też gotowe systemy, z których korzystają lokale i gabinety.
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <a
              href="https://zamow.odart.pl/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-odart-accent/40"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-odart-accent/90">Zamówienia</p>
              <h3 className="mt-2 text-lg font-semibold text-white">zamow.odart.pl</h3>
              <p className="mt-3 text-sm leading-relaxed text-neutral-400">
                Menu, koszyk, odbiór albo dostawa, panel restauracji.
              </p>
            </a>
            <a
              href="https://salon.odart.pl/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-odart-accent/40"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-odart-accent/90">Gabinety</p>
              <h3 className="mt-2 text-lg font-semibold text-white">salon.odart.pl</h3>
              <p className="mt-3 text-sm leading-relaxed text-neutral-400">
                Kalendarz, rezerwacje i kartoteki dla gabinetów i salonów.
              </p>
            </a>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 px-4 py-16 lg:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white sm:text-4xl">Portfolio</h2>
              <p className="mt-2 text-neutral-400">Wybrane realizacje</p>
            </div>
            <Link href={ODART_PORTFOLIO_URL} className="text-sm font-semibold text-odart-accent hover:text-orange-300">
              Wszystkie realizacje →
            </Link>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {portfolioItems.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group rounded-xl border border-white/10 bg-white/[0.02] p-5 transition hover:border-odart-accent/30"
                >
                  <span className="text-xs font-medium uppercase tracking-wide text-odart-accent/90">{item.cat}</span>
                  <h3 className="mt-2 text-lg font-semibold text-white group-hover:text-orange-200">{item.title}</h3>
                  <span className="mt-3 inline-flex items-center text-sm text-neutral-500 group-hover:text-odart-accent">
                    Zobacz <ChevronRight className="ml-1 h-4 w-4" />
                  </span>
                </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-neutral-950/30 px-4 py-16 lg:px-6">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold text-white sm:text-4xl">Opinie</h2>
          <p className="mt-2 text-center text-neutral-500">Co mówią klienci</p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <blockquote
                key={t.author + t.quote.slice(0, 20)}
                className="rounded-2xl border border-white/10 bg-black/40 p-6"
              >
                <p className="text-sm leading-relaxed text-neutral-300">&ldquo;{t.quote}&rdquo;</p>
                <footer className="mt-4 text-sm font-semibold text-odart-accent">{t.author}</footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-4 py-16 lg:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-medium uppercase tracking-wide text-odart-accent">Kontakt</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Napisz — przygotuję ofertę pod Twoją stronę
          </h2>
          <p className="mt-4 max-w-2xl text-neutral-400">
            Zostaw wiadomość poniżej. Odpowiadam zwykle tego samego dnia. Możesz też napisać bezpośrednio lub zadzwonić.
          </p>

          <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-neutral-900/80 to-black p-6 lg:p-8">
              <h3 className="text-lg font-semibold text-white">Dane kontaktowe</h3>
              <ul className="mt-6 space-y-5 text-neutral-300">
                <li className="flex items-start gap-3">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-odart-accent" aria-hidden />
                  <div>
                    <p className="text-xs uppercase tracking-wide text-neutral-500">Telefon</p>
                    <a href="tel:+48695432415" className="hover:text-white">
                      +48 695 432 415
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-odart-accent" aria-hidden />
                  <div>
                    <p className="text-xs uppercase tracking-wide text-neutral-500">E-mail</p>
                    <a href="mailto:biuro@odart.pl" className="hover:text-white">
                      biuro@odart.pl
                    </a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-odart-accent" aria-hidden />
                  <div>
                    <p className="text-xs uppercase tracking-wide text-neutral-500">Adres</p>
                    {localSeo ? (
                      <span>
                        Kołobrzeg
                        <span className="mt-1 block text-sm text-neutral-500">
                          Obsługa i spotkania także w {localSeo.cityLocative}
                        </span>
                      </span>
                    ) : (
                      <span>Kołobrzeg</span>
                    )}
                  </div>
                </li>
              </ul>
              <p className="mt-8 border-t border-white/10 pt-8 text-sm text-neutral-500">
                Pełny formularz z tymi samymi polami jest też na{" "}
                <Link href={`${SITE}/kontakt/`} className="font-medium text-odart-accent hover:text-orange-300">
                  stronie Kontakt
                </Link>
                .
              </p>
            </div>

            <div className="rounded-2xl border border-odart-accent/25 bg-white/[0.02] p-6 lg:p-8">
              <h3 className="sr-only">Formularz</h3>
              <OdartKontaktForm
                defaultProjectType="strona-standardowa"
                contextPath={jsonLdCanonicalPathname}
              />
            </div>
          </div>

          <p className="mt-12 text-center text-sm text-neutral-600">
            <Link href={`${SITE}/polityka-prywatnosci/`} className="hover:text-neutral-400">
              Polityka prywatności
            </Link>
            {" · "}
            <Link href={`${SITE}/regulamin/`} className="hover:text-neutral-400">
              Regulamin
            </Link>
          </p>
          <p className="mt-6 text-center text-sm text-neutral-500">
            <span className="text-neutral-400">Rafał Kowalkowski</span> · ODART — Ostry Dyżur Artystyczny
            {localSeo
              ? ` · Kołobrzeg, usługi w ${localSeo.cityLocative} i zdalnie`
              : " · Kołobrzeg"}
          </p>
        </div>
      </section>
      </div>
    </OdartPublicShell>
  );
}
