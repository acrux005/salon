import Link from "next/link";
import { ChevronRight, Code2, LayoutDashboard, Plug } from "lucide-react";
import { ODART_SITE_URL } from "@/lib/odartSite";
import { OdartPublicShell } from "@/components/odart/OdartPublicShell";

const SITE = ODART_SITE_URL;
const CANONICAL = `${SITE}/produkt/nowoczesne-aplikacje-webowe/`;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${CANONICAL}#webpage`,
      url: CANONICAL,
      name: "Nowoczesne aplikacje webowe | ODART",
      description:
        "Aplikacje webowe na zamówienie: React, Next.js, TypeScript, wydajność, bezpieczeństwo, wdrożenia produkcyjne. Kołobrzeg.",
      isPartOf: { "@id": `${SITE}/#website` },
      inLanguage: "pl-PL",
    },
    {
      "@type": "Service",
      "@id": `${CANONICAL}#service`,
      name: "Nowoczesne aplikacje webowe",
      serviceType: "Oprogramowanie webowe i aplikacje SPA/SSR",
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

const highlights: { title: string; body: string }[] = [
  {
    title: "Stack pod produkcję",
    body: "React, Next.js, TypeScript — architektura modułowa, typowane API i przewidywalne wdrożenia.",
  },
  {
    title: "Wydajność i UX",
    body: "Lazy loading, podział kodu, sensowne stany ładowania i responsywny interfejs na desktop i mobile.",
  },
  {
    title: "Bezpieczeństwo",
    body: "Uwierzytelnianie, sesje, nagłówki CSP i dobre praktyki OWASP tam, gdzie projekt tego wymaga.",
  },
  {
    title: "Wdrożenia",
    body: "CI/CD, środowiska staging/produkcja, monitoring błędów — żeby produkt dało się utrzymywać latami.",
  },
];

export function OdartProduktNowoczesneAplikacjeWebowePage() {
  return (
    <OdartPublicShell activeNav="uslugi" jsonLd={jsonLd}>
      <article className="border-b border-white/10 px-4 py-10 lg:px-6 lg:py-14">
        <div className="mx-auto max-w-3xl">
          <nav className="text-sm text-neutral-500" aria-label="Ścieżka nawigacji">
            <Link href={`${SITE}/`} className="hover:text-odart-accent">
              Strona główna
            </Link>
            <span className="mx-2 text-neutral-600">/</span>
            <span className="text-neutral-400">Aplikacje webowe</span>
            <span className="mx-2 text-neutral-600">/</span>
            <span className="text-neutral-300">Nowoczesne aplikacje webowe</span>
          </nav>

          <p className="mt-8 text-sm font-medium uppercase tracking-wide text-odart-accent">Usługa</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Nowoczesne aplikacje webowe
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-neutral-300">
            Projektuję i buduję aplikacje webowe „szyte na miarę” — od koncepcji i UX po kod produkcyjny. To nie jest
            gotowy motyw CMS: to produkt dopasowany do procesów Twojej firmy, z naciskiem na wydajność, czytelny interfejs
            i możliwość dalszego rozwoju.{" "}
            <Link href={`${SITE}/kontakt/`} className="font-semibold text-odart-accent hover:text-orange-300">
              Opisz projekt — umówimy konsultację
            </Link>
            .
          </p>
          <p className="mt-4 text-sm text-neutral-500">
            Kategoria: <span className="text-neutral-400">Aplikacje webowe</span>
          </p>
        </div>
      </article>

      <section className="border-b border-white/10 px-4 py-12 lg:px-6 lg:py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Dla kogo</h2>
          <div className="prose prose-invert prose-p:text-neutral-400 prose-strong:text-neutral-200 prose-li:text-neutral-400 mt-8 max-w-none">
            <p>
              Dla firm i zespołów, które potrzebują <strong className="text-neutral-200">dedykowanego oprogramowania w przeglądarce</strong> —
              narzędzi sprzedażowych, onboardingowych, konfiguratorów, portali dla partnerów albo produktów SaaS w
              wąskim zakresie. WordPress zostawiamy tam, gdzie liczy się treść i szybki CMS; tutaj stawiamy na stack
              developerski i pełną kontrolę nad logiką.
            </p>

            <h3 className="mt-12 text-xl font-bold text-white">Co obejmuje współpraca</h3>
            <ul className="mt-6 list-disc space-y-4 pl-6 marker:text-odart-accent">
              {highlights.map((h) => (
                <li key={h.title} className="pl-1">
                  <strong className="text-neutral-200">{h.title}</strong> — {h.body}
                </li>
              ))}
            </ul>

            <p className="mt-10">
              Masz już backend lub design w Figmie? Mogę wejść w dowolnym etapie — od prototypu po utrzymanie istniejącej
              aplikacji.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 px-4 py-12 lg:px-6 lg:py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Powiązane usługi</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <Link
              href={`${SITE}/produkt/panele-i-systemy-dla-firm/`}
              className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-odart-accent/40"
            >
              <LayoutDashboard className="h-8 w-8 text-odart-accent" aria-hidden />
              <h3 className="mt-4 text-lg font-bold text-white group-hover:text-orange-300">
                Panele i systemy dla firm
              </h3>
              <p className="mt-2 text-sm text-neutral-400">Wewnętrzne narzędzia, role, raporty.</p>
              <span className="mt-4 inline-flex items-center text-sm font-semibold text-odart-accent">
                Zobacz
                <ChevronRight className="ml-1 h-4 w-4" aria-hidden />
              </span>
            </Link>
            <Link
              href={`${SITE}/produkt/integracje-api-i-automatyzacja/`}
              className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-odart-accent/40"
            >
              <Plug className="h-8 w-8 text-odart-accent" aria-hidden />
              <h3 className="mt-4 text-lg font-bold text-white group-hover:text-orange-300">
                Integracje API i automatyzacja
              </h3>
              <p className="mt-2 text-sm text-neutral-400">Łączenie systemów, webhooki, płatności.</p>
              <span className="mt-4 inline-flex items-center text-sm font-semibold text-odart-accent">
                Zobacz
                <ChevronRight className="ml-1 h-4 w-4" aria-hidden />
              </span>
            </Link>
            <Link
              href={`${SITE}/strony-internetowe/`}
              className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-odart-accent/40"
            >
              <Code2 className="h-8 w-8 text-odart-accent" aria-hidden />
              <h3 className="mt-4 text-lg font-bold text-white group-hover:text-orange-300">Strona na WordPressie</h3>
              <p className="mt-2 text-sm text-neutral-400">Gdy priorytetem jest CMS i treść.</p>
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
          <Code2 className="h-10 w-10 text-odart-accent" aria-hidden />
          <h2 className="mt-6 text-3xl font-bold text-white sm:text-4xl">Zacznijmy od rozmowy o produkcie</h2>
          <p className="mt-4 max-w-2xl text-neutral-400 leading-relaxed">
            Krótki opis problemu, użytkowników i terminów — odpowiem, czy to dobry kierunek i jaki byłby kolejny krok.
          </p>
          <Link
            href={`${SITE}/kontakt/`}
            className="mt-8 inline-flex items-center rounded-lg bg-odart-accent px-8 py-3.5 font-semibold text-white hover:brightness-110"
          >
            Kontakt
            <ChevronRight className="ml-1 h-5 w-5" aria-hidden />
          </Link>
        </div>
      </section>
    </OdartPublicShell>
  );
}
