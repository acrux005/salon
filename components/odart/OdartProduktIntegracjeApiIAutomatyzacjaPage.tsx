import Link from "next/link";
import { ChevronRight, Code2, LayoutDashboard, LayoutTemplate, Plug } from "lucide-react";
import { ODART_SITE_URL } from "@/lib/odartSite";
import { OdartPublicShell } from "@/components/odart/OdartPublicShell";

const SITE = ODART_SITE_URL;
const CANONICAL = `${SITE}/produkt/integracje-api-i-automatyzacja/`;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${CANONICAL}#webpage`,
      url: CANONICAL,
      name: "Integracje API i automatyzacja | ODART",
      description:
        "REST, webhooki, płatności, magazyn, CRM: bezpieczne łączenie systemów i automatyzacja powtarzalnych zadań. Kołobrzeg.",
      isPartOf: { "@id": `${SITE}/#website` },
      inLanguage: "pl-PL",
    },
    {
      "@type": "Service",
      "@id": `${CANONICAL}#service`,
      name: "Integracje API i automatyzacja",
      serviceType: "Integracje systemów i API",
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

const scenarios: { title: string; body: string }[] = [
  {
    title: "REST i webhooki",
    body: "Synchronizacja zamówień, stanów magazynowych, statusów przesyłek — z retry i logowaniem błędów.",
  },
  {
    title: "Płatności i faktury",
    body: "Podpięcie bramki, obsługa zwrotów, spójność kwot między sklepem a systemem księgowym tam, gdzie to możliwe.",
  },
  {
    title: "Mapowanie danych",
    body: "Formaty JSON, CSV, ID po stronie dostawcy — żeby nie dublować rekordów i nie gubić powiązań.",
  },
  {
    title: "Bezpieczeństwo",
    body: "Klucze API w zmiennych środowiskowych, rotacja sekretów, minimalne uprawnienia do zasobów.",
  },
];

export function OdartProduktIntegracjeApiIAutomatyzacjaPage() {
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
            <span className="text-neutral-300">Integracje API i automatyzacja</span>
          </nav>

          <p className="mt-8 text-sm font-medium uppercase tracking-wide text-odart-accent">Usługa</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Integracje API i automatyzacja
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-neutral-300">
            Łączę strony i aplikacje z zewnętrznymi usługami: sklepy, kurierzy, systemy księgowe, CRM, newslettery. Chodzi
            o to, by dane płynęły same, a zespół nie przepisywał tego samo wieczorem.{" "}
            <Link href={`${SITE}/kontakt/`} className="font-semibold text-odart-accent hover:text-orange-300">
              Napisz, co masz po obu stronach integracji
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
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Jak to wygląda w praktyce</h2>
          <div className="prose prose-invert prose-p:text-neutral-400 prose-strong:text-neutral-200 prose-li:text-neutral-400 mt-8 max-w-none">
            <p>
              Zaczynam od <strong className="text-neutral-200">dokumentacji API</strong> albo od rozmowy z dostawcą
              oprogramowania, z którym już pracujesz. Ustalamy, co jest źródłem prawdy (np. magazyn u operatora
              logistycznego), a co tylko odbiciem — i pod to projektuję warstwę pośrednią lub bezpośrednie wywołania.
            </p>

            <h3 className="mt-12 text-xl font-bold text-white">Typowe scenariusze</h3>
            <ul className="mt-6 list-disc space-y-4 pl-6 marker:text-odart-accent">
              {scenarios.map((s) => (
                <li key={s.title} className="pl-1">
                  <strong className="text-neutral-200">{s.title}</strong> — {s.body}
                </li>
              ))}
            </ul>

            <p className="mt-10">
              Integracje najczęściej idą w parze z{" "}
              <Link href={`${SITE}/produkt/nowoczesne-aplikacje-webowe/`} className="text-odart-accent hover:text-orange-300">
                aplikacją webową
              </Link>{" "}
              lub{" "}
              <Link href={`${SITE}/produkt/panele-i-systemy-dla-firm/`} className="text-odart-accent hover:text-orange-300">
                panelem wewnętrznym
              </Link>{" "}
              — wtedy masz jeden spójny produkt, a nie pięć osobnych skryptów.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 px-4 py-12 lg:px-6 lg:py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Powiązane usługi</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <Link
              href={`${SITE}/produkt/nowoczesne-aplikacje-webowe/`}
              className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-odart-accent/40"
            >
              <Code2 className="h-8 w-8 text-odart-accent" aria-hidden />
              <h3 className="mt-4 text-lg font-bold text-white group-hover:text-orange-300">
                Nowoczesne aplikacje webowe
              </h3>
              <p className="mt-2 text-sm text-neutral-400">Frontend i logika produktu.</p>
              <span className="mt-4 inline-flex items-center text-sm font-semibold text-odart-accent">
                Zobacz
                <ChevronRight className="ml-1 h-4 w-4" aria-hidden />
              </span>
            </Link>
            <Link
              href={`${SITE}/produkt/panele-i-systemy-dla-firm/`}
              className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-odart-accent/40"
            >
              <LayoutDashboard className="h-8 w-8 text-odart-accent" aria-hidden />
              <h3 className="mt-4 text-lg font-bold text-white group-hover:text-orange-300">
                Panele i systemy dla firm
              </h3>
              <p className="mt-2 text-sm text-neutral-400">Narzędzia operacyjne dla zespołu.</p>
              <span className="mt-4 inline-flex items-center text-sm font-semibold text-odart-accent">
                Zobacz
                <ChevronRight className="ml-1 h-4 w-4" aria-hidden />
              </span>
            </Link>
            <Link
              href={`${SITE}/strony-internetowe/`}
              className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-odart-accent/40"
            >
              <LayoutTemplate className="h-8 w-8 text-odart-accent" aria-hidden />
              <h3 className="mt-4 text-lg font-bold text-white group-hover:text-orange-300">WordPress + integracje</h3>
              <p className="mt-2 text-sm text-neutral-400">Gdy witryna jest na CMS, a reszta podpięta.</p>
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
          <Plug className="h-10 w-10 text-odart-accent" aria-hidden />
          <h2 className="mt-6 text-3xl font-bold text-white sm:text-4xl">Połączmy Twoje systemy</h2>
          <p className="mt-4 max-w-2xl text-neutral-400 leading-relaxed">
            Wyślij listę narzędzi (nawet z nazw produktów) — sprawdzę, co da się spiąć w sensownym pierwszym etapie.
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
