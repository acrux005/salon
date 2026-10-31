import Link from "next/link";
import {
  ChevronRight,
  Layers,
  Package,
  ShieldCheck,
  Store,
  Home,
  Building2,
  ClipboardList,
  Smartphone,
  Wrench,
} from "lucide-react";
import { ODART_SITE_URL } from "@/lib/odartSite";
import { OdartPublicShell } from "@/components/odart/OdartPublicShell";

const SITE = ODART_SITE_URL;
const CANONICAL = `${SITE}/monitoring-i-kamery-kolobrzeg/`;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${CANONICAL}#webpage`,
      url: CANONICAL,
      name: "Monitoring i kamery Kołobrzeg | ODART",
      description:
        "Montaż i konfiguracja monitoringu wizyjnego: kamery, rejestratory Hikvision i Dahua, zdalny podgląd, serwis. Kołobrzeg i okolice.",
      isPartOf: { "@id": `${SITE}/#website` },
      inLanguage: "pl-PL",
    },
    {
      "@type": "Service",
      "@id": `${CANONICAL}#service`,
      name: "Monitoring i kamery — Kołobrzeg",
      serviceType: "Instalacja systemów monitoringu wizyjnego",
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
        postalCode: "78-100",
        addressLocality: "Kołobrzeg",
        addressCountry: "PL",
      },
    },
  ],
};

export function OdartMonitoringKameryKolobrzegPage() {
  return (
    <OdartPublicShell activeNav="uslugi" jsonLd={jsonLd}>
      <section className="border-b border-white/10 bg-gradient-to-b from-neutral-950/40 to-black px-4 py-16 lg:px-6 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-medium uppercase tracking-wide text-odart-accent">
            Profesjonalny montaż i obsługa
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">Monitoring i kamery Kołobrzeg</h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-neutral-300">
            Oferujemy profesjonalny montaż i konfigurację systemów monitoringu wizyjnego w Kołobrzegu i okolicach.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href={`${SITE}/kontakt/`}
              className="inline-flex items-center rounded-lg bg-odart-accent px-6 py-3 font-semibold text-white hover:brightness-110"
            >
              Dowiedz się więcej
              <ChevronRight className="ml-1 h-5 w-5" aria-hidden />
            </Link>
            <a
              href="#monitoring"
              className="inline-flex items-center rounded-lg border border-white/10 px-6 py-3 font-semibold text-white hover:bg-neutral-800"
            >
              Poznaj szczegóły
            </a>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 px-4 py-16 lg:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Kompleksowe systemy monitoringu</p>
          <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Bezpieczeństwo, wydajność, niezawodność</h2>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-neutral-400">
            Oferujemy profesjonalny montaż i konfigurację systemów monitoringu wizyjnego w Kołobrzegu i okolicach.
            Tworzymy rozwiązania dopasowane do potrzeb zarówno klientów indywidualnych, jak i firm – od małych instalacji
            domowych po rozbudowane systemy przemysłowe.
          </p>
        </div>
      </section>

      <section id="monitoring" className="scroll-mt-24 border-b border-white/10 px-4 py-16 lg:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Monitoring</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <article className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-odart-accent/40 bg-odart-accent/10">
                <Layers className="h-6 w-6 text-odart-accent" aria-hidden />
              </div>
              <h3 className="mt-5 text-xl font-bold text-white">Indywidualny projekt systemu</h3>
              <p className="mt-3 text-neutral-400 leading-relaxed">
                Dobieramy odpowiednie kamery i rejestratory do warunków obiektu.
              </p>
              <Link
                href={`${SITE}/kontakt/`}
                className="mt-5 inline-flex items-center text-sm font-semibold text-odart-accent hover:text-orange-300"
              >
                Dowiedz się więcej
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </article>
            <article className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-odart-accent/40 bg-odart-accent/10">
                <Package className="h-6 w-6 text-odart-accent" aria-hidden />
              </div>
              <h3 className="mt-5 text-xl font-bold text-white">Sprzęt renomowanych producentów</h3>
              <p className="mt-3 text-neutral-400 leading-relaxed">Hikvision, Dahua i inne sprawdzone marki.</p>
              <Link
                href={`${SITE}/kontakt/`}
                className="mt-5 inline-flex items-center text-sm font-semibold text-odart-accent hover:text-orange-300"
              >
                Dowiedz się więcej
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </article>
            <article className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-odart-accent/40 bg-odart-accent/10">
                <ShieldCheck className="h-6 w-6 text-odart-accent" aria-hidden />
              </div>
              <h3 className="mt-5 text-xl font-bold text-white">Pełna obsługa</h3>
              <p className="mt-3 text-neutral-400 leading-relaxed">
                Od doradztwa i projektu, przez montaż, po szkolenie z obsługi systemu.
              </p>
              <Link
                href={`${SITE}/kontakt/`}
                className="mt-5 inline-flex items-center text-sm font-semibold text-odart-accent hover:text-orange-300"
              >
                Dowiedz się więcej
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-neutral-950/40 px-4 py-16 lg:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Działamy na terenie całego Kołobrzegu oraz okolicznych miejscowości.
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <article className="flex gap-4">
              <Store className="h-8 w-8 shrink-0 text-odart-accent" aria-hidden />
              <div>
                <h3 className="text-lg font-bold text-white">Sklepy i lokale usługowe</h3>
                <p className="mt-2 text-neutral-400">Kontrola pracowników i klientów, zapobieganie kradzieżom.</p>
              </div>
            </article>
            <article className="flex gap-4">
              <Home className="h-8 w-8 shrink-0 text-odart-accent" aria-hidden />
              <div>
                <h3 className="text-lg font-bold text-white">Dom i mieszkanie</h3>
                <p className="mt-2 text-neutral-400">Bezpieczeństwo rodziny, ochrona przed włamaniami.</p>
              </div>
            </article>
            <article className="flex gap-4">
              <Building2 className="h-8 w-8 shrink-0 text-odart-accent" aria-hidden />
              <div>
                <h3 className="text-lg font-bold text-white">Hotele, pensjonaty i apartamenty</h3>
                <p className="mt-2 text-neutral-400">Ochrona obiektów noclegowych w Kołobrzegu.</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 px-4 py-16 lg:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Projektowanie i montaż systemów monitoringu</h2>
            <Link
              href={`${SITE}/kontakt/`}
              className="inline-flex items-center text-sm font-semibold text-odart-accent hover:text-orange-300"
            >
              Dowiedz się więcej
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <article className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <ClipboardList className="h-8 w-8 text-odart-accent" aria-hidden />
              <h3 className="mt-4 text-lg font-bold text-white">Projekt</h3>
              <p className="mt-2 text-neutral-400">
                Oferujemy profesjonalny dobór, projekt i montaż kamer do domu, firmy czy obiektu turystycznego. Działamy na
                terenie całego Kołobrzegu i okolic.
              </p>
              <Link href={`${SITE}/kontakt/`} className="mt-4 inline-block text-sm font-semibold text-odart-accent hover:text-orange-300">
                Sprawdź szczegóły
              </Link>
            </article>
            <article className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <Smartphone className="h-8 w-8 text-odart-accent" aria-hidden />
              <h3 className="mt-4 text-lg font-bold text-white">Zdalny podgląd</h3>
              <p className="mt-2 text-neutral-400">
                Konfigurujemy monitoring z dostępem online – możesz oglądać obraz z kamer na telefonie, tablecie lub
                komputerze. Integrujemy system z alarmem i siecią Wi-Fi.
              </p>
              <Link href={`${SITE}/kontakt/`} className="mt-4 inline-block text-sm font-semibold text-odart-accent hover:text-orange-300">
                Zobacz ofertę
              </Link>
            </article>
            <article className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <Wrench className="h-8 w-8 text-odart-accent" aria-hidden />
              <h3 className="mt-4 text-lg font-bold text-white">Serwis i szybka pomoc techniczna</h3>
              <p className="mt-2 text-neutral-400">
                Gwarantujemy pełną obsługę posprzedażową – serwis, konserwację i szybkie reagowanie w razie awarii, aby Twój
                obiekt zawsze był bezpieczny.
              </p>
              <Link href={`${SITE}/kontakt/`} className="mt-4 inline-block text-sm font-semibold text-odart-accent hover:text-orange-300">
                Skontaktuj się z nami
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-neutral-950/30 px-4 py-14 lg:px-6">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h2 className="text-xl font-bold text-white">Monitoring w hotelu i pensjonacie</h2>
            <p className="mt-3 text-neutral-400 leading-relaxed">
              Kamery to część bezpieczeństwa obiektu. Sieć Wi-Fi gości, recepcja i POS — osobna oferta IT pod hotele w
              Kołobrzegu.
            </p>
            <Link
              href={`${SITE}/it-dla-hoteli/`}
              className="mt-4 inline-flex items-center text-sm font-semibold text-odart-accent hover:text-orange-300"
            >
              IT dla hoteli
              <ChevronRight className="ml-1 h-4 w-4" aria-hidden />
            </Link>
          </article>
          <article className="rounded-2xl border border-odart-accent/25 bg-odart-accent/5 p-6">
            <h2 className="text-xl font-bold text-white">Awaria rejestratora / sieci?</h2>
            <p className="mt-3 text-neutral-400 leading-relaxed">
              Brak podglądu albo padła sieć obiektu — dzwoń{" "}
              <a href="tel:+48695432415" className="font-semibold text-odart-accent hover:text-orange-300">
                695 432 415
              </a>
              .
            </p>
            <Link
              href={`${SITE}/pogotowie-it/`}
              className="mt-4 inline-flex items-center text-sm font-semibold text-odart-accent hover:text-orange-300"
            >
              Pogotowie IT
              <ChevronRight className="ml-1 h-4 w-4" aria-hidden />
            </Link>
          </article>
        </div>
      </section>

      <section className="px-4 py-16 lg:px-6">
        <div className="mx-auto max-w-6xl rounded-2xl border border-odart-accent/30 bg-gradient-to-br from-neutral-900/80 to-black p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Skontaktuj się z nami już dziś!</h2>
          <p className="mt-4 max-w-3xl text-neutral-400 leading-relaxed">
            Zapraszamy do kontaktu, aby omówić montaż monitoringu dopasowany do Twojego domu lub firmy w Kołobrzegu i
            okolicach. Dobierzemy sprzęt, wykonamy instalację i pomożemy w obsłudze systemu.
          </p>
          <Link
            href={`${SITE}/kontakt/`}
            className="mt-8 inline-flex items-center rounded-lg bg-odart-accent px-8 py-3.5 font-semibold text-white hover:brightness-110"
          >
            Umów spotkanie
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
              <p className="mt-2 text-lg text-neutral-300">78-100 Kołobrzeg</p>
            </div>
          </div>
        </div>
      </section>
    </OdartPublicShell>
  );
}
