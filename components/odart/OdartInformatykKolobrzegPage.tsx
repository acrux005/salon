import Link from "next/link";
import {
  AlertTriangle,
  ChevronRight,
  Network,
  Router,
  Shield,
  Database,
  ArrowRightLeft,
  ShieldCheck,
  Cloud,
  ListChecks,
  HardDrive,
} from "lucide-react";
import { ODART_SITE_URL } from "@/lib/odartSite";
import { OdartPublicShell } from "@/components/odart/OdartPublicShell";

const SITE = ODART_SITE_URL;
const CANONICAL = `${SITE}/informatyk-kolobrzeg/`;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${CANONICAL}#webpage`,
      url: CANONICAL,
      name: "Informatyk Kołobrzeg — sieci, ERP, opieka IT | ODART",
      description:
        "IT dla firm z Kołobrzegu: sieci, Comarch Optima, backup i opieka. Rafał Kowalkowski, od 2008. Tel. 695 432 415.",
      isPartOf: { "@id": `${SITE}/#website` },
      inLanguage: "pl-PL",
    },
    {
      "@type": "ProfessionalService",
      "@id": `${CANONICAL}#service`,
      name: "Informatyk Kołobrzeg — ODART",
      url: CANONICAL,
      telephone: "+48695432415",
      email: "biuro@odart.pl",
      address: {
        "@type": "PostalAddress",
        postalCode: "78-100",
        addressLocality: "Kołobrzeg",
        addressCountry: "PL",
      },
      areaServed: { "@type": "City", name: "Kołobrzeg" },
    },
  ],
};

const auditSteps = [
  { n: "01", title: "Analiza infrastruktury" },
  { n: "02", title: "Wykrywanie zagrożeń" },
  { n: "03", title: "Raport i rekomendacje usprawnień" },
  { n: "04", title: "Optymalizacja sieci" },
];

export function OdartInformatykKolobrzegPage() {
  return (
    <OdartPublicShell activeNav="uslugi" jsonLd={jsonLd}>
      <section className="border-b border-white/10 bg-gradient-to-b from-neutral-950/40 to-black px-4 py-16 lg:px-6 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-medium uppercase tracking-wide text-odart-accent">
            ODART — Rafał Kowalkowski
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Informatyk Kołobrzeg
          </h1>
          <p className="mt-6 max-w-3xl text-lg font-medium text-white">
            Sieci · ERP Comarch Optima · opieka IT dla firm
          </p>
          <p className="mt-3">
            <a href="tel:+48695432415" className="text-lg font-semibold text-odart-accent hover:text-orange-300">
              695 432 415
            </a>
          </p>
          <div className="mt-8 grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href={`${SITE}/opieka-it-dla-firm-kolobrzeg/`}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 hover:border-odart-accent/40"
            >
              <span className="text-xs font-medium uppercase tracking-wide text-odart-accent/90">Opieka</span>
              <span className="mt-1 block text-sm font-semibold text-white">Abonament IT dla firm</span>
            </Link>
            <Link
              href={`${SITE}/strony-internetowe/`}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 hover:border-odart-accent/40"
            >
              <span className="text-xs font-medium uppercase tracking-wide text-odart-accent/90">Strony</span>
              <span className="mt-1 block text-sm font-semibold text-white">WWW od 1200 zł</span>
            </Link>
            <Link
              href={`${SITE}/monitoring-i-kamery-kolobrzeg/`}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 hover:border-odart-accent/40"
            >
              <span className="text-xs font-medium uppercase tracking-wide text-odart-accent/90">Monitoring</span>
              <span className="mt-1 block text-sm font-semibold text-white">Kamery w Kołobrzegu</span>
            </Link>
            <Link
              href={`${SITE}/it-dla-hoteli/`}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 hover:border-odart-accent/40"
            >
              <span className="text-xs font-medium uppercase tracking-wide text-odart-accent/90">Hotele</span>
              <span className="mt-1 block text-sm font-semibold text-white">IT dla hoteli</span>
            </Link>
            <Link
              href={`${SITE}/pogotowie-it/`}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 hover:border-odart-accent/40"
            >
              <span className="text-xs font-medium uppercase tracking-wide text-odart-accent/90">Awaria</span>
              <span className="mt-1 block text-sm font-semibold text-white">Pogotowie IT</span>
            </Link>
          </div>
          <p className="mt-8 max-w-3xl text-lg leading-relaxed text-neutral-300">
            Sieć, serwery, Optima, kopie zapasowe i bieżąca opieka — dla firm z Kołobrzegu i okolic. Od 2008.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href={`${SITE}/pogotowie-it/#zgloszenie`}
              className="inline-flex items-center gap-2 rounded-lg border border-red-500/80 px-6 py-3 font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300"
              aria-label="Zgłoś awarię IT"
            >
              <AlertTriangle className="h-5 w-5 shrink-0" aria-hidden />
              Zgłoś awarię
            </Link>
            <a
              href="tel:+48695432415"
              className="inline-flex items-center rounded-lg bg-odart-accent px-6 py-3 font-semibold text-white hover:brightness-110"
            >
              Zadzwoń
              <ChevronRight className="ml-1 h-5 w-5" aria-hidden />
            </a>
            <Link
              href={`${SITE}/kontakt/`}
              className="inline-flex items-center rounded-lg border border-white/10 px-6 py-3 font-semibold text-white hover:bg-neutral-800"
            >
              Napisz
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 px-4 py-16 lg:px-6" aria-labelledby="prof-it">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Profesjonalne usługi IT</p>
          <h2 id="prof-it" className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            Bezpieczeństwo, wydajność, niezawodność
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-neutral-400">
            Nasze usługi informatyczne są dostosowane do indywidualnych potrzeb klientów, zapewniając optymalne rozwiązania
            technologiczne. Skupiamy się na bezpieczeństwie danych, wydajności systemów oraz niezawodności infrastruktury IT,
            aby wspierać rozwój Twojego biznesu w Kołobrzegu i okolicach.
          </p>
        </div>
      </section>

      <section id="nasze-uslugi-it" className="scroll-mt-24 border-b border-white/10 px-4 py-16 lg:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Nasze usługi IT</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <article className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-odart-accent/40 bg-odart-accent/10">
                <Network className="h-6 w-6 text-odart-accent" aria-hidden />
              </div>
              <h3 className="mt-5 text-xl font-bold text-white">Projektowanie i instalacja sieci</h3>
              <p className="mt-3 text-neutral-400 leading-relaxed">
                Tworzymy i wdrażamy nowoczesne sieci lokalne i komputerowe, które zapewniają szybki i bezpieczny dostęp do
                zasobów firmy.
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
                <Router className="h-6 w-6 text-odart-accent" aria-hidden />
              </div>
              <h3 className="mt-5 text-xl font-bold text-white">Konfiguracja sprzętu sieciowego</h3>
              <p className="mt-3 text-neutral-400 leading-relaxed">
                Specjalizujemy się w konfiguracji routerów, switchy oraz firewalli, aby zapewnić optymalne działanie Twojej
                sieci.
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
                <Shield className="h-6 w-6 text-odart-accent" aria-hidden />
              </div>
              <h3 className="mt-5 text-xl font-bold text-white">Zabezpieczenia sieciowe</h3>
              <p className="mt-3 text-neutral-400 leading-relaxed">
                Oferujemy zaawansowane rozwiązania zabezpieczające, które chronią Twoją sieć przed zagrożeniami zewnętrznymi
                i wewnętrznymi.
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
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Integracja baz danych Comarch Optima i Enova</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <article className="flex gap-4">
              <Database className="h-8 w-8 shrink-0 text-odart-accent" aria-hidden />
              <div>
                <h3 className="text-lg font-bold text-white">Instalacja i konfiguracja ERP</h3>
                <p className="mt-2 text-neutral-400">
                  Zapewniamy kompleksową instalację i konfigurację systemów ERP, dostosowując je do specyficznych potrzeb
                  Twojej firmy.
                </p>
              </div>
            </article>
            <article className="flex gap-4">
              <ArrowRightLeft className="h-8 w-8 shrink-0 text-odart-accent" aria-hidden />
              <div>
                <h3 className="text-lg font-bold text-white">Transfer i migracja danych</h3>
                <p className="mt-2 text-neutral-400">
                  Bezpiecznie przenosimy dane między systemami, zapewniając ich integralność i spójność.
                </p>
              </div>
            </article>
            <article className="flex gap-4">
              <ShieldCheck className="h-8 w-8 shrink-0 text-odart-accent" aria-hidden />
              <div>
                <h3 className="text-lg font-bold text-white">Ochrona i spójność danych</h3>
                <p className="mt-2 text-neutral-400">
                  Stosujemy zaawansowane metody ochrony danych, gwarantując ich bezpieczeństwo i dostępność.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 px-4 py-16 lg:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Kopie zapasowe w chmurze</h2>
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
              <Cloud className="h-8 w-8 text-odart-accent" aria-hidden />
              <h3 className="mt-4 text-lg font-bold text-white">Backup w AWS, Azure, Google Cloud</h3>
              <p className="mt-2 text-neutral-400">
                Oferujemy niezawodne rozwiązania do tworzenia kopii zapasowych w najpopularniejszych chmurach.
              </p>
              <Link href={`${SITE}/kontakt/`} className="mt-4 inline-block text-sm font-semibold text-odart-accent hover:text-orange-300">
                Sprawdź szczegóły
              </Link>
            </article>
            <article className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <ListChecks className="h-8 w-8 text-odart-accent" aria-hidden />
              <h3 className="mt-4 text-lg font-bold text-white">Automatyzacja kopii zapasowych</h3>
              <p className="mt-2 text-neutral-400">
                Automatyzujemy procesy tworzenia kopii zapasowych, aby zapewnić ciągłość działania Twojej firmy.
              </p>
              <Link href={`${SITE}/kontakt/`} className="mt-4 inline-block text-sm font-semibold text-odart-accent hover:text-orange-300">
                Zobacz ofertę
              </Link>
            </article>
            <article className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <HardDrive className="h-8 w-8 text-odart-accent" aria-hidden />
              <h3 className="mt-4 text-lg font-bold text-white">Ochrona i szybkie przywracanie danych</h3>
              <p className="mt-2 text-neutral-400">
                Gwarantujemy szybkie odzyskiwanie danych w razie awarii, minimalizując przestoje.
              </p>
              <Link href={`${SITE}/kontakt/`} className="mt-4 inline-block text-sm font-semibold text-odart-accent hover:text-orange-300">
                Skontaktuj się z nami
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-neutral-950/50 px-4 py-16 lg:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Audyt sieci komputerowej</h2>
          <p className="mt-4 max-w-3xl text-neutral-400">
            Przeprowadzamy szczegółowe audyty sieci komputerowych, identyfikując potencjalne zagrożenia i obszary do poprawy.
          </p>
          <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {auditSteps.map((step) => (
              <li
                key={step.n}
                className="relative rounded-xl border border-white/10 bg-neutral-950/50 p-6 pt-12"
              >
                <span className="absolute left-6 top-4 text-2xl font-bold text-odart-accent/80">{step.n}</span>
                <span className="text-lg font-semibold text-white">{step.title}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-b border-white/10 bg-neutral-950/30 px-4 py-14 lg:px-6">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h2 className="text-xl font-bold text-white">Hotele i pensjonaty</h2>
            <p className="mt-3 text-neutral-400 leading-relaxed">
              Wi-Fi gości oddzielone od recepcji, sezonowe szczyty, POS i monitoring — osobna oferta pod obiekty
              noclegowe w Kołobrzegu i regionie.
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
            <h2 className="text-xl font-bold text-white">Praca stoi — awaria IT</h2>
            <p className="mt-3 text-neutral-400 leading-relaxed">
              Sieć, Wi-Fi albo stanowisko padło? Dzwoń{" "}
              <a href="tel:+48695432415" className="font-semibold text-odart-accent hover:text-orange-300">
                695 432 415
              </a>
              . Bez portalu ticketów.
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
            Zapraszamy do kontaktu, aby umówić się na spotkanie i omówić, jak możemy wspierać Twoją firmę w Kołobrzegu i
            okolicach. Nasze usługi IT są dostosowane do Twoich potrzeb, zapewniając bezpieczeństwo i niezawodność.
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
