import Link from "next/link";
import { ChevronRight, Code2, LayoutDashboard, Plug } from "lucide-react";
import { ODART_SITE_URL } from "@/lib/odartSite";
import { OdartPublicShell } from "@/components/odart/OdartPublicShell";

const SITE = ODART_SITE_URL;
const CANONICAL = `${SITE}/produkt/panele-i-systemy-dla-firm/`;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${CANONICAL}#webpage`,
      url: CANONICAL,
      name: "Panele i systemy dla firm | ODART",
      description:
        "Panele administracyjne, narzędzia wewnętrzne, systemy B2B: role, uprawnienia, raporty, workflow. Kołobrzeg.",
      isPartOf: { "@id": `${SITE}/#website` },
      inLanguage: "pl-PL",
    },
    {
      "@type": "Service",
      "@id": `${CANONICAL}#service`,
      name: "Panele i systemy dla firm",
      serviceType: "Oprogramowanie dla biznesu — panele i aplikacje wewnętrzne",
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

const areas: { title: string; body: string }[] = [
  {
    title: "Role i uprawnienia",
    body: "Kto widzi które dane — administrator, pracownik, partner zewnętrzny — bez chaosu w jednym koncie „do wszystkiego”.",
  },
  {
    title: "Raporty i eksporty",
    body: "Zestawienia pod decyzje: CSV, PDF, podgląd na żywo z filtrami po dacie, statusie, kontrahencie.",
  },
  {
    title: "Workflow",
    body: "Zatwierdzanie zamówień, zgłoszeń, faktur — proste ścieżki, które da się później rozszerzyć.",
  },
  {
    title: "Dostęp z przeglądarki",
    body: "Bez instalacji na stanowisku — aktualizacje centralnie, spójny wygląd na laptopie i tablecie.",
  },
];

export function OdartProduktPaneleISystemyDlaFirmPage() {
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
            <span className="text-neutral-300">Panele i systemy dla firm</span>
          </nav>

          <p className="mt-8 text-sm font-medium uppercase tracking-wide text-odart-accent">Usługa</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Panele i systemy dla firm
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-neutral-300">
            Zamiast Excela i maili w kółko — jeden panel: zamówienia, stany, klienci, zadania dla zespołu. Projektuję i
            wdrażam narzędzia wewnętrzne, które skracają czas operacyjny i zmniejszają liczbę pomyłek.{" "}
            <Link href={`${SITE}/kontakt/`} className="font-semibold text-odart-accent hover:text-orange-300">
              Opisz proces — zaproponuję zakres
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
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Co możemy zbudować</h2>
          <div className="prose prose-invert prose-p:text-neutral-400 prose-strong:text-neutral-200 prose-li:text-neutral-400 mt-8 max-w-none">
            <p>
              Od lekkiego <strong className="text-neutral-200">panelu do zleceń</strong> po bardziej rozbudowane
              moduły — zawsze z jasnym podziałem etapów: prototyp, MVP, rozwój pod realny ruch i feedback.
            </p>

            <h3 className="mt-12 text-xl font-bold text-white">Obszary</h3>
            <ul className="mt-6 list-disc space-y-4 pl-6 marker:text-odart-accent">
              {areas.map((a) => (
                <li key={a.title} className="pl-1">
                  <strong className="text-neutral-200">{a.title}</strong> — {a.body}
                </li>
              ))}
            </ul>

            <p className="mt-10">
              Jeśli masz już ERP, CRM lub sklep — często sensowne jest{" "}
              <Link href={`${SITE}/produkt/integracje-api-i-automatyzacja/`} className="text-odart-accent hover:text-orange-300">
                spięcie przez API
              </Link>
              , zamiast przepisywania wszystkiego od zera.
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
              <p className="mt-2 text-sm text-neutral-400">React, Next.js, produkcyjny frontend.</p>
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
              <p className="mt-2 text-sm text-neutral-400">Łączenie systemów i synchronizacja danych.</p>
              <span className="mt-4 inline-flex items-center text-sm font-semibold text-odart-accent">
                Zobacz
                <ChevronRight className="ml-1 h-4 w-4" aria-hidden />
              </span>
            </Link>
            <Link
              href={`${SITE}/kontakt/`}
              className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-odart-accent/40"
            >
              <LayoutDashboard className="h-8 w-8 text-odart-accent" aria-hidden />
              <h3 className="mt-4 text-lg font-bold text-white group-hover:text-orange-300">Konsultacja</h3>
              <p className="mt-2 text-sm text-neutral-400">Umów krótką rozmowę o zakresie.</p>
              <span className="mt-4 inline-flex items-center text-sm font-semibold text-odart-accent">
                Kontakt
                <ChevronRight className="ml-1 h-4 w-4" aria-hidden />
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 lg:px-6">
        <div className="mx-auto max-w-6xl rounded-2xl border border-odart-accent/30 bg-gradient-to-br from-neutral-900/80 to-black p-8 lg:p-12">
          <LayoutDashboard className="h-10 w-10 text-odart-accent" aria-hidden />
          <h2 className="mt-6 text-3xl font-bold text-white sm:text-4xl">Uporządkujmy operacje w jednym miejscu</h2>
          <p className="mt-4 max-w-2xl text-neutral-400 leading-relaxed">
            Napisz, co dziś robicie w arkuszach i mailach — sprawdzę, co da się zastąpić lub usprawnić panelem.
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
