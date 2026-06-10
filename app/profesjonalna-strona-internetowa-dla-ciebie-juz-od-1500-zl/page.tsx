import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronRight,
  Layers,
  Smartphone,
  BadgeCheck,
  PenLine,
  Code2,
  Rocket,
  BarChart3,
} from "lucide-react";
import { ODART_PORTFOLIO_URL } from "@/lib/odartSite";
import { OdartPublicShell } from "@/components/odart/OdartPublicShell";

/** Kanoniczny adres strony oferty na odart.pl (deploy pod tą samą ścieżką co WordPress). */
const CANONICAL_PATH = "/profesjonalna-strona-internetowa-dla-ciebie-juz-od-1500-zl";
const ODART_SITE = process.env.NEXT_PUBLIC_ODART_SITE_URL?.replace(/\/$/, "") || "https://odart.pl";
const CANONICAL_URL = `${ODART_SITE}${CANONICAL_PATH}`;

export const metadata: Metadata = {
  title: "Profesjonalna strona internetowa od 1500 zł | ODART Kołobrzeg",
  description:
    "Profesjonalna strona internetowa w formie one page — responsywna, bez ukrytych kosztów, od 1500 zł. Projekt, realizacja i wdrożenie. Ostry Dyżur Artystyczny, Kołobrzeg.",
  keywords: [
    "profesjonalna strona internetowa",
    "profesjonalna strona",
    "strona internetowa Kołobrzeg",
    "strona www dla firmy",
    "one page",
  ],
  alternates: { canonical: CANONICAL_URL },
  openGraph: {
    title: "Profesjonalna strona internetowa od 1500 zł | ODART",
    description:
      "Pełna, funkcjonalna strona one page od 1500 zł. UX, WordPress, SEO. Kołobrzeg i online.",
    url: CANONICAL_URL,
    type: "website",
    locale: "pl_PL",
    siteName: "ODART",
  },
  twitter: {
    card: "summary_large_image",
    title: "Profesjonalna strona internetowa od 1500 zł | ODART",
    description: "Strona one page, responsywna, przejrzysta cena — ODART, Kołobrzeg.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${ODART_SITE}/#website`,
      url: `${ODART_SITE}/`,
      name: "ODART",
      publisher: { "@id": `${ODART_SITE}/#organization` },
    },
    {
      "@type": "ProfessionalService",
      "@id": `${ODART_SITE}/#organization`,
      name: "ODART — Ostry Dyżur Artystyczny",
      url: ODART_SITE,
      email: "biuro@odart.pl",
      telephone: "+48-695-432-415",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Kołobrzeg",
        addressCountry: "PL",
      },
      areaServed: { "@type": "Country", name: "Polska" },
    },
    {
      "@type": "WebPage",
      "@id": `${CANONICAL_URL}#webpage`,
      url: CANONICAL_URL,
      name: "Profesjonalna strona internetowa od 1500 zł | ODART",
      description:
        "Oferta profesjonalnej strony internetowej one page od 1500 zł — Kołobrzeg, cała Polska.",
      isPartOf: { "@id": `${ODART_SITE}/#website` },
      about: { "@id": `${ODART_SITE}/#organization` },
      inLanguage: "pl-PL",
    },
  ],
};

export default function ProfesjonalnaStrona1500Page() {
  return (
    <OdartPublicShell jsonLd={jsonLd}>
      <main className="bg-neutral-950">
        {/* Hero (nagłówek globalny w OdartPublicShell) */}
        <section className="bg-black pb-20 lg:pb-28">
          <div className="relative min-h-[26rem] overflow-hidden lg:min-h-[32rem]">
            <div className="absolute inset-0 z-0 hidden lg:block">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80"
                alt="Praca przy projektowaniu profesjonalnej strony internetowej dla firmy"
                fill
                className="object-cover object-right"
                sizes="100vw"
                priority
              />
            </div>
            <div className="absolute inset-0 z-10 flex flex-col justify-between bg-black px-6 py-10 lg:px-12 xl:px-16 [clip-path:polygon(0_0,100%_0,100%_100%,0_100%)] lg:[clip-path:polygon(0_0,68%_0,50%_100%,0_100%)]">
              <div className="max-w-2xl">
                <p className="text-sm font-medium uppercase tracking-wide text-odart-accent">Kołobrzeg · online</p>
                <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                  Profesjonalna strona internetowa dla Ciebie już od 1500 zł
                </h1>
                <p className="mt-6 text-base leading-7 text-neutral-300">
                  Marzysz o własnej witrynie, ale obawiasz się kosztów? Ta{" "}
                  <strong className="font-semibold text-white">profesjonalna strona</strong> w formie one page
                  mieści się w przejrzystym pakiecie — pełna funkcjonalność, jasna cena, bez niespodzianek.
                </p>
              </div>
              <div className="mt-8 max-w-2xl lg:mt-10">
                <div className="flex flex-wrap items-center gap-5">
                  <a
                    href="mailto:biuro@odart.pl?subject=Zapytanie%20o%20stron%C4%99%201500%20z%C5%82"
                    className="rounded-lg bg-odart-accent px-6 py-3 text-base font-semibold text-white shadow-sm hover:brightness-110"
                  >
                    Napisz — wycena
                  </a>
                  <a
                    href="tel:+48695432415"
                    className="inline-flex items-center text-base font-semibold text-white hover:text-neutral-200"
                  >
                    Zadzwoń: +48 695 432 415
                    <ChevronRight className="ml-1 h-5 w-5" aria-hidden />
                  </a>
                </div>
                <p className="mt-4 text-sm text-neutral-500">
                  <a href="mailto:biuro@odart.pl" className="text-odart-accent hover:text-orange-300">
                    biuro@odart.pl
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Cechy oferty */}
        <section id="cechy" className="scroll-mt-20 bg-neutral-950 px-6 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Cechy naszej oferty</h2>
            <p className="mt-4 max-w-2xl text-neutral-400">
              Profesjonalna strona internetowa powinna być czytelna dla klientów i przyjazna w pozycjonowaniu —
              dlatego stawiamy na przejrzystą strukturę i technologię dopasowaną do Twojej branży.
            </p>
            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: Layers,
                  title: "Strona typu One Page",
                  text: "Jedna spójna witryna — idealna na start lub kampanię. Łatwa nawigacja, szybkie ładowanie, przekaz w jednym miejscu.",
                },
                {
                  icon: Smartphone,
                  title: "Responsywność",
                  text: "Profesjonalna strona musi dobrze wyglądać na telefonie i komputerze — projektujemy pod urządzenia, z których korzystają Twoi klienci.",
                },
                {
                  icon: BadgeCheck,
                  title: "Bez ukrytych kosztów",
                  text: "Ustalona kwota 1500 zł za opisany zakres — bez dopłat „za każdą ikonkę”. Wiesz, za co płacisz.",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-odart-accent/40 bg-odart-accent/10">
                    <item.icon className="h-6 w-6 text-odart-accent" aria-hidden />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-400">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Co zawiera */}
        <section id="zakres" className="scroll-mt-20 border-t border-white/10 bg-neutral-950 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Co zawiera nasza oferta?</h2>
            <p className="mt-4 max-w-2xl text-neutral-400">
              Od pierwszego szkicu po publikację — spójny proces, żeby Twoja profesjonalna strona internetowa była
              gotowa do pracy od pierwszego dnia.
            </p>
            <div className="mt-14 grid gap-10 md:grid-cols-3">
              {[
                {
                  icon: PenLine,
                  title: "Projektowanie",
                  text: "Układ treści, dobór sekcji i stylu pod Twój biznes — tak, by witryna budowała zaufanie i prowadziła do kontaktu.",
                },
                {
                  icon: Code2,
                  title: "Tworzenie strony",
                  text: "Realizacja w sprawdzonym stacku (m.in. WordPress tam, gdzie to ma sens) — szybko, stabilnie, z myślą o Tobie.",
                },
                {
                  icon: Rocket,
                  title: "Wdrożenie",
                  text: "Hosting, domena wg ustaleń i start produkcyjny — strona działa, a Ty możesz skupić się na kliencie.",
                },
              ].map((item) => (
                <div key={item.title}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-odart-accent/40 bg-odart-accent/10">
                    <item.icon className="h-6 w-6 text-odart-accent" aria-hidden />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-400">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Statystyki */}
        <section className="border-t border-white/10 bg-neutral-950/60 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Imponujące statystyki</h2>
            <p className="mt-4 max-w-2xl text-neutral-400">
              Projekty naszych klientów często notują wyższy ruch w pierwszych miesiącach — efekt zależy od branży,
              promocji i treści.
            </p>
            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { value: "200+", label: "Zrealizowanych projektów" },
                { value: "93%", label: "Zadowolonych klientów" },
                { value: "95%", label: "Wsparcia technicznego" },
                { value: "24/7", label: "Hosting dostępny" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-white/10 bg-white/[0.02] p-6 text-center">
                  <p className="text-3xl font-bold text-white">{s.value}</p>
                  <p className="mt-2 text-sm text-neutral-400">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Realizacje / blog — linki na odart.pl */}
        <section id="realizacje" className="scroll-mt-20 border-t border-white/10 bg-neutral-950 px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Portfolio i wiedza</h2>
            <p className="mt-4 max-w-2xl text-neutral-400">
              Zobacz przykłady realizacji i artykuły o stronach WWW oraz SEO na blogu ODART.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href={ODART_PORTFOLIO_URL}
                className="inline-flex items-center rounded-lg border border-white/10 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800"
              >
                Portfolio
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
              <Link
                href={`${ODART_SITE}/blog/`}
                className="inline-flex items-center rounded-lg border border-white/10 px-5 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800"
              >
                Blog — porady
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="zamow" className="scroll-mt-20 border-t border-white/10 bg-gradient-to-br from-neutral-950/50 via-neutral-950 to-black px-6 py-20">
          <div className="mx-auto max-w-3xl text-center">
            <BarChart3 className="mx-auto h-10 w-10 text-odart-accent" aria-hidden />
            <h2 className="mt-6 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Zamów swoją profesjonalną stronę internetową za 1500 zł
            </h2>
            <p className="mt-4 text-neutral-300">
              Ostry Dyżur Artystyczny — UX, WordPress i SEO w przystępnej cenie. Jedna, spójna kwota za opisany
              zakres; ustalenia indywidualne ustalamy mailowo lub telefonicznie.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <a
                href="mailto:biuro@odart.pl?subject=Zam%C3%B3wienie%20strony%201500%20z%C5%82"
                className="rounded-lg bg-odart-accent px-8 py-3 text-base font-semibold text-white hover:brightness-110"
              >
                Zamów teraz
              </a>
              <a
                href={`${ODART_SITE}/kontakt/`}
                className="rounded-lg border border-white/10 px-8 py-3 text-base font-semibold text-white hover:bg-neutral-800"
              >
                Formularz kontaktowy
              </a>
            </div>
          </div>
        </section>

        {/* Kontakt — skrót; pełna stopka jak na stronie głównej w OdartPublicShell */}
        <section id="kontakt" className="scroll-mt-20 border-t border-white/10 bg-neutral-950 px-6 py-16">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <h2 className="text-xl font-bold text-white">Zostaw wiadomość</h2>
                <p className="mt-2 text-sm text-neutral-400">
                  Najszybszy kontakt: napisz na adres e-mail — odpowiadamy tak szybko, jak to możliwe.
                </p>
                <a
                  href="mailto:biuro@odart.pl"
                  className="mt-6 inline-block text-lg font-semibold text-odart-accent hover:text-orange-300"
                >
                  biuro@odart.pl
                </a>
              </div>
              <div className="space-y-4 text-neutral-400">
                <p>
                  <a href="tel:+48695432415" className="hover:text-white">
                    +48 695 432 415
                  </a>
                </p>
                <p>Kołobrzeg</p>
                <p className="text-sm">Strony internetowe · WordPress · SEO</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </OdartPublicShell>
  );
}
