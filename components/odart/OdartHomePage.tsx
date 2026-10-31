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
import { OdartZaamowSection } from "@/components/odart/OdartZaamowSection";

const SITE = ODART_SITE_URL;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE}/#website`,
      url: `${SITE}/`,
      name: "ODART",
      description: "Strony internetowe, aplikacje i opieka IT. Rafał Kowalkowski, Kołobrzeg.",
      publisher: { "@id": `${SITE}/#org` },
      inLanguage: "pl-PL",
    },
    {
      "@type": "Organization",
      "@id": `${SITE}/#org`,
      name: "ODART, Ostry Dyżur Artystyczny",
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
        jobTitle: "web developer",
      },
      sameAs: ["https://zaamow.pl"],
    },
  ],
};

export function OdartHomePage() {
  return (
    <OdartPublicShell activeNav="home" jsonLd={jsonLd}>
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(249,115,22,0.1),transparent)] lg:hidden" aria-hidden />
          <OdartSnakeLineAccent side="left" />
          <OdartSnakeLineAccent side="right" phaseDelay />
          <OdartSpiralLine segments={28} />
          <div className="absolute inset-0 z-0 hidden lg:block">
            <Image
              src="https://odart.pl/wp-content/uploads/2026/02/odart._in_office_with_monitors_and_code_around_-ar_11_-styl_66ecffcf-aeef-478d-8736-270028d15204_3.jpg"
              alt="Rafał Kowalkowski, ODART"
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
            <p className="text-sm font-medium uppercase tracking-wide text-odart-accent">Kołobrzeg · od 2008</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Strony internetowe i aplikacje
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-300">
              Nazywam się Rafał Kowalkowski. Od 2008 robię strony i aplikacje: Fotoferia, zamówienia jedzenia, panele.
              WordPress, gdy ktoś sam ma zmieniać treści.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href={`${SITE}/kontakt/`}
                className="inline-flex items-center rounded-lg bg-odart-accent px-6 py-3 font-semibold text-white hover:brightness-110"
              >
                Zapytaj o wycenę
                <ChevronRight className="ml-1 h-5 w-5" aria-hidden />
              </Link>
              <Link
                href={`${SITE}/strony-internetowe/`}
                className="inline-flex items-center rounded-lg border border-white/10 px-6 py-3 font-semibold text-white hover:bg-neutral-800"
              >
                Strony internetowe
              </Link>
              <Link
                href={`${SITE}/uslugi/`}
                className="inline-flex items-center rounded-lg border border-odart-accent/35 bg-odart-accent/10 px-6 py-3 font-semibold text-white hover:bg-odart-accent/20"
              >
                Usługi
              </Link>
            </div>
          </div>
        </section>

        <section className="border-b border-white/10 bg-neutral-950 px-4 py-16 lg:px-6" aria-labelledby="oferty-glowne">
          <div className="mx-auto max-w-6xl">
            <h2 id="oferty-glowne" className="text-center text-sm font-semibold uppercase tracking-wide text-odart-accent">
              Strony WWW i IT
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-2xl font-bold text-white sm:text-3xl">
              Strony i opieka IT
            </p>
            <div className="mt-12 grid gap-8 lg:grid-cols-2">
              <article className="flex flex-col rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent p-8 lg:p-10">
                <p className="text-xs font-medium uppercase tracking-wider text-odart-accent">Strony WWW</p>
                <h3 className="mt-3 text-xl font-bold text-white sm:text-2xl">Strona firmowa</h3>
                <p className="mt-4 text-sm leading-relaxed text-neutral-400">
                  Wizytówka, gabinet albo sklep. Formularz, telefon i mail na wierzchu. WordPress albo Next.js, zależnie
                  od tego, czy potem sami będziecie zmieniać teksty.
                </p>
                <ul className="mt-6 space-y-2 text-sm text-neutral-500">
                  <li className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-odart-accent" aria-hidden />
                    Działa na telefonie
                  </li>
                  <li className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-odart-accent" aria-hidden />
                    Podstawowe SEO (tytuły, nagłówki, mapa strony)
                  </li>
                  <li className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-odart-accent" aria-hidden />
                    Zakres ustalam po rozmowie
                  </li>
                </ul>
                <Link
                  href={`${SITE}/strony-internetowe/`}
                  className="mt-8 inline-flex items-center font-semibold text-odart-accent hover:text-orange-300"
                >
                  Strony internetowe
                  <ChevronRight className="ml-1 h-5 w-5" aria-hidden />
                </Link>
              </article>
              <article className="flex flex-col rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent p-8 lg:p-10">
                <p className="text-xs font-medium uppercase tracking-wider text-odart-accent">IT dla firm i hoteli</p>
                <h3 className="mt-3 text-xl font-bold text-white sm:text-2xl">Komputery i sieć</h3>
                <p className="mt-4 text-sm leading-relaxed text-neutral-400">
                  Opieka IT, Wi-Fi w hotelach, awarie. Kołobrzeg, Koszalin albo zdalny pulpit. Jeden numer — Rafał
                  Kowalkowski, 695 432 415.
                </p>
                <ul className="mt-6 space-y-2 text-sm text-neutral-500">
                  <li className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-odart-accent" aria-hidden />
                    Abonament albo pogotowie
                  </li>
                  <li className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-odart-accent" aria-hidden />
                    Hotele: Wi-Fi gości vs recepcja
                  </li>
                  <li className="flex gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-odart-accent" aria-hidden />
                    Na miejscu albo zdalnie
                  </li>
                </ul>
                <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
                  <Link
                    href={`${SITE}/opieka-it-dla-firm-kolobrzeg/`}
                    className="inline-flex items-center font-semibold text-odart-accent hover:text-orange-300"
                  >
                    Opieka IT
                    <ChevronRight className="ml-1 h-5 w-5" aria-hidden />
                  </Link>
                  <Link
                    href={`${SITE}/it-dla-hoteli/`}
                    className="inline-flex items-center font-semibold text-odart-accent hover:text-orange-300"
                  >
                    Hotele
                    <ChevronRight className="ml-1 h-5 w-5" aria-hidden />
                  </Link>
                  <Link
                    href={`${SITE}/pogotowie-it/`}
                    className="inline-flex items-center font-semibold text-odart-accent hover:text-orange-300"
                  >
                    Awaria
                    <ChevronRight className="ml-1 h-5 w-5" aria-hidden />
                  </Link>
                </div>
              </article>
            </div>
          </div>
        </section>

        <OdartZaamowSection />

        <section className="border-b border-white/10 bg-neutral-950 px-4 py-16 lg:px-6" aria-labelledby="zakres-tytul">
          <div className="mx-auto max-w-6xl">
            <h2 id="zakres-tytul" className="sr-only">
              Zakres prac
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: Palette, title: "Interfejs", desc: "Układ strony i aplikacji. Figma, czasem Adobe." },
                { icon: Code2, title: "Aplikacje", desc: "Next.js, React. WordPress, gdy ma być panel do treści." },
                { icon: Sparkles, title: "Grafika", desc: "Logo, banery, grafiki do social mediów." },
                { icon: FileText, title: "Teksty", desc: "Mogę napisać od zera albo poprawić to, co już jest." },
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

        <section className="border-y border-white/10 bg-neutral-950/50 px-4 py-20 lg:px-6">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,1fr)_1.1fr] lg:items-center">
            <div className="relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900 lg:mx-0">
              <Image
                src="https://odart.pl/wp-content/uploads/2026/02/odart._in_office_with_monitors_and_code_around_-ar_11_-styl_66ecffcf-aeef-478d-8736-270028d15204_3.jpg"
                alt="Rafał Kowalkowski, ODART"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 28rem"
                priority
              />
            </div>
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-odart-accent">17 lat</p>
              <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">Z Kołobrzegu, od 2008</h2>
              <p className="mt-6 text-neutral-400 leading-relaxed">
                fotoferia.pl robię od 2008. Potem doszły sklepy, panele, zamówienia jedzenia, harmonogramy. Teraz głównie
                Next.js. WordPress zostaje, gdy ktoś codziennie wchodzi w panel i zmienia ofertę.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  { icon: Headphones, t: "Rozmowa", d: "Najpierw zakres, potem robota." },
                  { icon: Cpu, t: "Po starcie", d: "Jak coś padnie, dzwonisz do mnie." },
                  { icon: Globe, t: "WWW i CMS", d: "Strona, sklep albo aplikacja." },
                  { icon: Server, t: "Domena i hosting", d: "Dobiorę i podłączę SSL." },
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
              <Link href={`${SITE}/o-mnie/`} className="mt-8 inline-flex font-semibold text-odart-accent hover:text-orange-300">
                Więcej o mnie →
              </Link>
            </div>
          </div>
        </section>

        <section className="px-4 py-20 lg:px-6">
          <div className="mx-auto max-w-6xl">
            <p className="text-center text-sm font-medium uppercase tracking-wide text-odart-accent">Usługi</p>
            <h2 className="mt-2 text-center text-3xl font-bold text-white sm:text-4xl">Oferta</h2>
            <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "zaamow.pl",
                  desc: "Domena .pl, poczta firmowa, strona z katalogu i gotowe aplikacje. Zamawiasz na zaamow.pl.",
                  href: "/zaamow/",
                },
                {
                  title: "Aplikacje webowe",
                  desc: "Panele, konta, zamówienia, rezerwacje. Next.js, React, TypeScript.",
                  href: "/produkt/nowoczesne-aplikacje-webowe/",
                },
                {
                  title: "Panele dla firm",
                  desc: "Role, raporty, kolejki zadań.",
                  href: "/produkt/panele-i-systemy-dla-firm/",
                },
                {
                  title: "Integracje i API",
                  desc: "Sklep, CRM, kurier, księgowość. Webhooki i REST.",
                  href: "/produkt/integracje-api-i-automatyzacja/",
                },
                {
                  title: "Strona internetowa",
                  desc: "Firmowa, gabinet, sklep. WordPress albo Next.js.",
                  href: "/strony-internetowe/",
                },
                {
                  title: "Opieka IT",
                  desc: "Helpdesk, sieć, stacje, backup. Kołobrzeg, Koszalin, zdalnie.",
                  href: "/opieka-it-dla-firm-kolobrzeg/",
                },
                {
                  title: "IT dla hoteli",
                  desc: "Wi-Fi gości vs recepcja, sezon, POS, monitoring. Kołobrzeg.",
                  href: "/it-dla-hoteli/",
                },
                {
                  title: "Pogotowie IT",
                  desc: "Praca stoi? Dzwoń 695 432 415. Sieć, Wi-Fi, kasa.",
                  href: "/pogotowie-it/",
                },
                {
                  title: "Migracja strony",
                  desc: "WordPress na inny hosting albo inną domenę. Treści zostają.",
                  href: "/produkt/migracja-strony-internetowej-na-inny-serwer/",
                },
                {
                  title: "Przywracanie po infekcji",
                  desc: "Czyszczenie malware, hasła, kopia. Strona wraca do użytku.",
                  href: "/produkt/przywracanie-strony-internetowej-wordpress/",
                },
                {
                  title: "SEO",
                  desc: "Tytuły, nagłówki, szybkość, mapa strony.",
                  href: "/produkt/seo-optymalizacja-strony/",
                },
                {
                  title: "Monitoring i kamery",
                  desc: "Montaż i konfiguracja w Kołobrzegu. Dom, firma, obiekt.",
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

        <section className="border-t border-white/10 bg-neutral-950/60 px-4 py-20 lg:px-6">
          <div className="mx-auto max-w-6xl lg:grid lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="text-3xl font-bold text-white">Rafał Kowalkowski</h2>
              <p className="mt-6 text-neutral-400 leading-relaxed">
                ODART to moja działalność. Piszesz albo dzwonisz do mnie, od rozmowy do wdrożenia. Jak coś padnie po
                starcie, też do mnie.
              </p>
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
                <p className="text-sm text-neutral-500">web developer, fotograf</p>
                <p className="mt-6 text-sm text-neutral-400 leading-relaxed">
                  Najpierw ustalam, do czego strona ma służyć. Potem dobieram układ, CMS i hosting.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
                <p className="text-sm font-medium uppercase tracking-wide text-odart-accent">zaamow.pl</p>
                <p className="mt-2 text-sm text-neutral-400 leading-relaxed">
                  Domena, poczta, strona i aplikacje do zamówienia online. Katalog:{" "}
                  <Link href={`${SITE}/zaamow/`} className="text-odart-accent hover:text-orange-300">
                    odart.pl/zaamow
                  </Link>
                  . Sklep:{" "}
                  <a href="https://zaamow.pl" className="text-odart-accent hover:text-orange-300" rel="noopener noreferrer">
                    zaamow.pl
                  </a>
                  .
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
                <p className="text-sm font-medium uppercase tracking-wide text-odart-accent">zamow.odart.pl</p>
                <p className="mt-2 text-sm text-neutral-400 leading-relaxed">
                  Zamówienia jedzenia: menu, koszyk, odbiór albo dostawa, panel restauracji. Next.js, React, Prisma.
                  Działa na zamow.odart.pl.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 bg-neutral-950/50 px-4 py-20 lg:px-6">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-3xl font-bold text-white">Pytania</h2>
            <div className="mt-10 space-y-3">
              {[
                {
                  q: "Czym jest zaamow.pl?",
                  a: "Sklep, w którym zamawiasz domenę .pl, pocztę firmową, stronę z katalogu i gotowe aplikacje. Indywidualny projekt zostaje na odart.pl. Katalog: odart.pl/zaamow.",
                },
                {
                  q: "Co z serwerem i domeną?",
                  a: "Domenę możesz wziąć na zaamow.pl/domeny. Przy większej stronie dobieram hosting i SSL. Możesz mieć swoje, mogę założyć.",
                },
                {
                  q: "Czy obsługujesz tylko Kołobrzeg?",
                  a: "Pracuję zdalnie z całą Polską. W regionie mogę się spotkać.",
                },
                {
                  q: "Ile to trwa?",
                  a: "Prosta strona zwykle tydzień albo dwa. Aplikacja dłużej. Termin podaję po rozmowie.",
                },
                {
                  q: "Od czego zaczynamy?",
                  a: "Mail albo telefon. Opisujesz, po co ta strona. Potem zakres i wycena. Czasem od razu kod, czasem najpierw układ w Figmie.",
                },
                {
                  q: "Co po wdrożeniu?",
                  a: "Aktualizacje, poprawki, nowe sekcje. Można doraźnie albo umówić stałą opiekę.",
                },
                {
                  q: "Jak wygląda płatność?",
                  a: "Zaliczka na start, reszta po oddaniu. Przy większych rzeczach etapy.",
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
                {
                  t: "Realizacje",
                  d: "Wybrane strony i aplikacje, które poszły na produkcję.",
                  href: `${SITE}/blog/realizacje/`,
                },
                {
                  t: "Zasady pozycjonowania SEO",
                  d: "Tytuły, nagłówki, struktura strony.",
                  href: `${SITE}/pozycjonowanie-seo/`,
                },
                {
                  t: "Strona internetowa Koszalin",
                  d: "Spotkania i realizacje w regionie.",
                  href: `${SITE}/strona-internetowa-koszalin/`,
                },
              ].map((post) => (
                <article key={post.t} className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
                  <h3 className="font-semibold text-white">{post.t}</h3>
                  <p className="mt-2 text-sm text-neutral-400">{post.d}</p>
                  <Link href={post.href} className="mt-4 inline-block text-sm font-medium text-odart-accent hover:text-orange-300">
                    czytaj dalej →
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="kontakt" className="border-t border-white/10 bg-gradient-to-br from-neutral-950/50 to-black px-4 py-20 lg:px-6">
          <div className="mx-auto max-w-6xl lg:grid lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="text-3xl font-bold text-white">Kontakt</h2>
              <p className="mt-4 text-neutral-400">
                Napisz na biuro@odart.pl albo zadzwoń. Odpowiadam zwykle tego samego dnia.
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
              <p className="text-sm font-medium text-white">Formularz</p>
              <p className="mt-2 text-sm text-neutral-500">Możesz też od razu napisać maila.</p>
              <Link
                href={`${SITE}/kontakt/`}
                className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-odart-accent py-3 font-semibold text-white hover:brightness-110"
              >
                Zapytaj o wycenę
              </Link>
            </div>
          </div>
        </section>
    </OdartPublicShell>
  );
}
