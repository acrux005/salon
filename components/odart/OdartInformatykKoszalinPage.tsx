import Link from "next/link";
import {
  ChevronRight,
  Server,
  Network,
  Shield,
  Database,
  ShieldCheck,
  Cloud,
  ListChecks,
  HardDrive,
  Monitor,
  Settings,
} from "lucide-react";
import { ODART_SITE_URL } from "@/lib/odartSite";
import { OdartPublicShell } from "@/components/odart/OdartPublicShell";

const SITE = ODART_SITE_URL;
const CANONICAL = `${SITE}/informatyk-koszalin/`;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${CANONICAL}#webpage`,
      url: CANONICAL,
      name: "Usługi informatyczne Koszalin | ODART",
      description:
        "Serwery, sieci LAN/WAN, ERP Comarch Optima i Enova, backup w chmurze, audyt IT. Obsługa firm w Koszalinie.",
      isPartOf: { "@id": `${SITE}/#website` },
      inLanguage: "pl-PL",
    },
    {
      "@type": "ProfessionalService",
      "@id": `${CANONICAL}#service`,
      name: "Usługi informatyczne Koszalin — ODART",
      url: CANONICAL,
      telephone: "+48695432415",
      email: "biuro@odart.pl",
      address: {
        "@type": "PostalAddress",
        postalCode: "78-100",
        addressLocality: "Kołobrzeg",
        addressCountry: "PL",
      },
      areaServed: [{ "@type": "City", name: "Koszalin" }, { "@type": "City", name: "Kołobrzeg" }],
    },
  ],
};

const auditSteps = [
  { n: "01", title: "Analiza infrastruktury" },
  { n: "02", title: "Wykrywanie zagrożeń" },
  { n: "03", title: "Raport i rekomendacje usprawnień" },
  { n: "04", title: "Optymalizacja sieci" },
];

export function OdartInformatykKoszalinPage() {
  return (
    <OdartPublicShell activeNav="uslugi" jsonLd={jsonLd}>
      <section className="border-b border-white/10 bg-gradient-to-b from-neutral-950/40 to-black px-4 py-16 lg:px-6 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-medium uppercase tracking-wide text-odart-accent">
            Kompleksowe wsparcie IT dla firm i klientów indywidualnych
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Usługi informatyczne Koszalin — profesjonalna obsługa firm i biur
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-neutral-300">
            Oferujemy szeroki zakres usług IT, które zapewniają bezpieczeństwo, wydajność i niezawodność dla Twojej firmy.
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
              href="#nasze-uslugi-it"
              className="inline-flex items-center rounded-lg border border-white/10 px-6 py-3 font-semibold text-white hover:bg-neutral-800"
            >
              Poznaj szczegóły
            </a>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 px-4 py-16 lg:px-6" aria-labelledby="prof-it-koszalin">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-neutral-500">Profesjonalne usługi IT</p>
          <h2 id="prof-it-koszalin" className="mt-3 text-3xl font-bold text-white sm:text-4xl">
            Bezpieczeństwo, wydajność, niezawodność
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-neutral-400">
            Kompleksowa obsługa IT dla firm w Koszalinie: administracja serwerami, konfiguracja sieci, wdrożenia systemów
            ERP i pełne bezpieczeństwo IT.
          </p>
        </div>
      </section>

      <section id="nasze-uslugi-it" className="scroll-mt-24 border-b border-white/10 px-4 py-16 lg:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Nasze usługi IT</h2>
          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            <article className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-odart-accent/40 bg-odart-accent/10">
                <Server className="h-6 w-6 text-odart-accent" aria-hidden />
              </div>
              <h3 className="mt-5 text-xl font-bold text-white">Infrastruktura serwerowa i systemy IT</h3>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-neutral-400 leading-relaxed">
                <li>Konfiguracja serwerów lokalnych i chmurowych.</li>
                <li>Wirtualizacja, monitoring, administracja systemami.</li>
                <li>Optymalizacja środowiska pracy i backup danych.</li>
              </ul>
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
                <Network className="h-6 w-6 text-odart-accent" aria-hidden />
              </div>
              <h3 className="mt-5 text-xl font-bold text-white">Sieci komputerowe i bezpieczeństwo</h3>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-neutral-400 leading-relaxed">
                <li>Projektowanie i wdrażanie nowoczesnych sieci LAN/WAN.</li>
                <li>Konfiguracja urządzeń sieciowych (routery, switche, firewalle).</li>
                <li>Zaawansowane rozwiązania cyberbezpieczeństwa i ochrony danych.</li>
              </ul>
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
              <h3 className="mt-5 text-xl font-bold text-white">Wdrożenia i integracja ERP (Comarch Optima, Enova)</h3>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-neutral-400 leading-relaxed">
                <li>Instalacja i konfiguracja ERP.</li>
                <li>Transfer i synchronizacja danych.</li>
                <li>Stała opieka nad systemami księgowymi i finansowymi dla biur rachunkowych.</li>
              </ul>
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
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Serwis i wsparcie IT</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <article className="flex gap-4">
              <Monitor className="h-8 w-8 shrink-0 text-odart-accent" aria-hidden />
              <div>
                <h3 className="text-lg font-bold text-white">Sieć lokalna</h3>
                <p className="mt-2 text-neutral-400">Aktualizacje i optymalizacja komputerów.</p>
              </div>
            </article>
            <article className="flex gap-4">
              <Settings className="h-8 w-8 shrink-0 text-odart-accent" aria-hidden />
              <div>
                <h3 className="text-lg font-bold text-white">Systemy</h3>
                <p className="mt-2 text-neutral-400">Diagnostyka, naprawa, utrzymanie systemów.</p>
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

      <section className="px-4 py-16 lg:px-6">
        <div className="mx-auto max-w-6xl rounded-2xl border border-odart-accent/30 bg-gradient-to-br from-neutral-900/80 to-black p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Skontaktuj się z nami już dziś!</h2>
          <p className="mt-4 max-w-3xl text-neutral-400 leading-relaxed">
            Zapraszamy do kontaktu, aby umówić się na spotkanie i omówić, jak możemy wspierać Twoją firmę w Koszalinie i
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
              <p className="text-sm font-semibold text-neutral-500">Adres biura</p>
              <p className="mt-2 text-lg text-neutral-300">78-100 Kołobrzeg</p>
              <p className="mt-2 text-sm text-neutral-500">Obsługa klientów w Koszalinie i regionie</p>
            </div>
          </div>
        </div>
      </section>
    </OdartPublicShell>
  );
}
