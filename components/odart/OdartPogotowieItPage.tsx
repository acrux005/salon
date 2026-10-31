import Link from "next/link";
import { AlertTriangle, ChevronRight, Phone, Check, X } from "lucide-react";
import { ODART_SITE_URL } from "@/lib/odartSite";
import { OdartPublicShell } from "@/components/odart/OdartPublicShell";
import { OdartAwariaForm } from "@/components/odart/OdartAwariaForm";

const SITE = ODART_SITE_URL;
const CANONICAL = `${SITE}/pogotowie-it/`;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${CANONICAL}#webpage`,
      url: CANONICAL,
      name: "Pogotowie IT Kołobrzeg — awaria, praca stoi? Dzwoń 695 432 415 | ODART",
      description:
        "Awaria IT w firmie lub hotelu w Kołobrzegu? Praca stoi — dzwoń 695 432 415. Sieć, Wi-Fi, komputery, kasa. Rafał Kowalkowski.",
      isPartOf: { "@id": `${SITE}/#website` },
      inLanguage: "pl-PL",
    },
    {
      "@type": "ProfessionalService",
      "@id": `${CANONICAL}#service`,
      name: "Pogotowie IT — ODART",
      url: CANONICAL,
      telephone: "+48695432415",
      email: "biuro@odart.pl",
      taxID: "5791020696",
      address: {
        "@type": "PostalAddress",
        postalCode: "78-100",
        addressLocality: "Kołobrzeg",
        addressCountry: "PL",
      },
      areaServed: { "@type": "City", name: "Kołobrzeg" },
      provider: {
        "@type": "Person",
        name: "Rafał Kowalkowski",
        telephone: "+48695432415",
        email: "biuro@odart.pl",
      },
    },
  ],
};

const fixScope = [
  "Sieć lokalna, router, switch, Wi-Fi — brak Internetu w biurze lub obiekcie",
  "Stanowiska: Windows, drukarki, udziały sieciowe, dostęp do ERP / Optimy",
  "Kasa, terminal, drukarka fiskalna — gdy przestają działać w godzinach pracy",
  "Podstawowa diagnostyka serwera / NAS i odzyskanie dostępu do danych (gdy to możliwe)",
];

const callWhen = [
  "Recepcja / biuro nie ma Internetu albo Wi-Fi padło w całym obiekcie",
  "Kasa lub terminal blokuje sprzedaż / check-out",
  "Program księgowy lub ERP nie startuje i stoi praca",
  "Wirus, ransomware-podejrzenie, zablokowane dyski — potrzebujesz szybkiej oceny",
];

const opiekaWhen = [
  "Chcesz mieć kogoś na stałe, zanim awaria się wydarzy",
  "Potrzebujesz backupu, aktualizacji i monitoringu łącza",
  "Hotel / firma rośnie i IT nie nadąża za sezonem",
];

export function OdartPogotowieItPage() {
  return (
    <OdartPublicShell activeNav="uslugi" jsonLd={jsonLd}>
      <section className="border-b border-white/10 bg-gradient-to-b from-neutral-950/40 to-black px-4 py-16 lg:px-6 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-medium uppercase tracking-wide text-odart-accent">
            ODART — Rafał Kowalkowski · NIP 5791020696
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Pogotowie IT — praca stoi? Dzwoń
          </h1>
          <p className="mt-6">
            <a
              href="tel:+48695432415"
              className="inline-flex items-center gap-3 text-3xl font-bold tracking-tight text-odart-accent hover:text-orange-300 sm:text-4xl"
            >
              <Phone className="h-8 w-8 shrink-0 sm:h-9 sm:w-9" aria-hidden />
              695 432 415
            </a>
          </p>
          <p className="mt-4 max-w-2xl text-lg text-neutral-300">
            Awaria sieci, Wi-Fi, stanowiska albo kasy w Kołobrzegu i okolicach. Wybierz co nie działa w formularzu poniżej
            — albo dzwoń od razu, gdy praca stoi.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#zgloszenie"
              className="inline-flex items-center gap-2 rounded-lg border border-red-500 bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-500"
              aria-label="Zgłoś awarię — formularz"
            >
              <AlertTriangle className="h-5 w-5 shrink-0" aria-hidden />
              Zgłoś awarię
            </a>
            <a
              href="tel:+48695432415"
              className="inline-flex items-center rounded-lg border border-white/10 px-6 py-3 font-semibold text-white hover:bg-neutral-800"
            >
              Zadzwoń 695 432 415
            </a>
          </div>
        </div>
      </section>

      <section
        id="zgloszenie"
        className="scroll-mt-24 border-b border-white/10 px-4 py-16 lg:px-6"
        aria-labelledby="zgloszenie-heading"
      >
        <div className="mx-auto max-w-6xl">
          <h2 id="zgloszenie-heading" className="text-3xl font-bold text-white sm:text-4xl">
            Zgłoś awarię IT
          </h2>
          <p className="mt-3 max-w-2xl text-neutral-400">
            Kilka kliknięć: co nie działa, czy blokuje pracę, opis i kontakt. Bez numerów ticketów i panelu statusów —
            mail idzie do mnie.
          </p>
          <div className="mt-10">
            <OdartAwariaForm />
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 px-4 py-16 lg:px-6" aria-labelledby="scope">
        <div className="mx-auto max-w-6xl">
          <h2 id="scope" className="text-3xl font-bold text-white sm:text-4xl">
            Co naprawiam w trybie awaryjnym
          </h2>
          <ul className="mt-8 max-w-3xl space-y-4">
            {fixScope.map((line) => (
              <li key={line} className="flex gap-3 text-neutral-300">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-odart-accent" aria-hidden />
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-3xl text-sm text-neutral-500">
            Nie sprzedaję „SLA 15 minut w całym kraju” ani aplikacji do zgłoszeń. Jest telefon, e-mail i ja — Rafał
            Kowalkowski. Jeśli jestem zajęty, mówię wprost kiedy mogę pomóc.
          </p>
        </div>
      </section>

      <section className="border-b border-white/10 bg-neutral-950/40 px-4 py-16 lg:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Kiedy dzwonić, a kiedy wziąć opiekę</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <article className="rounded-2xl border border-odart-accent/30 bg-odart-accent/5 p-8">
              <h3 className="text-xl font-bold text-white">Dzwoń na pogotowie, gdy…</h3>
              <ul className="mt-6 space-y-3">
                {callWhen.map((line) => (
                  <li key={line} className="flex gap-3 text-sm text-neutral-300">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-odart-accent" aria-hidden />
                    {line}
                  </li>
                ))}
              </ul>
              <a
                href="tel:+48695432415"
                className="mt-8 inline-flex items-center text-sm font-semibold text-odart-accent hover:text-orange-300"
              >
                695 432 415
                <ChevronRight className="ml-1 h-4 w-4" aria-hidden />
              </a>
            </article>
            <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
              <h3 className="text-xl font-bold text-white">Weź opiekę IT, gdy…</h3>
              <ul className="mt-6 space-y-3">
                {opiekaWhen.map((line) => (
                  <li key={line} className="flex gap-3 text-sm text-neutral-300">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-odart-accent" aria-hidden />
                    {line}
                  </li>
                ))}
              </ul>
              <p className="mt-4 flex gap-2 text-sm text-neutral-500">
                <X className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                Pogotowie gasi pożar. Opieka zmniejsza liczbę pożarów.
              </p>
              <Link
                href={`${SITE}/opieka-it-dla-firm-kolobrzeg/`}
                className="mt-6 inline-flex items-center text-sm font-semibold text-odart-accent hover:text-orange-300"
              >
                Opieka IT dla firm Kołobrzeg
                <ChevronRight className="ml-1 h-4 w-4" aria-hidden />
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 px-4 py-16 lg:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Dalej w ODART</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Link
              href={`${SITE}/informatyk-kolobrzeg/`}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 hover:border-odart-accent/40"
            >
              <span className="text-xs font-medium uppercase tracking-wide text-odart-accent/90">Usługi</span>
              <span className="mt-1 block text-sm font-semibold text-white">Informatyk Kołobrzeg</span>
            </Link>
            <Link
              href={`${SITE}/opieka-it-dla-firm-kolobrzeg/`}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 hover:border-odart-accent/40"
            >
              <span className="text-xs font-medium uppercase tracking-wide text-odart-accent/90">Abonament</span>
              <span className="mt-1 block text-sm font-semibold text-white">Opieka IT</span>
            </Link>
            <Link
              href={`${SITE}/it-dla-hoteli/`}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 hover:border-odart-accent/40"
            >
              <span className="text-xs font-medium uppercase tracking-wide text-odart-accent/90">Obiekty</span>
              <span className="mt-1 block text-sm font-semibold text-white">IT dla hoteli</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 lg:px-6">
        <div className="mx-auto max-w-6xl rounded-2xl border border-odart-accent/30 bg-gradient-to-br from-neutral-900/80 to-black p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Praca stoi — nie czekaj na formularz</h2>
          <p className="mt-4 max-w-3xl text-neutral-400 leading-relaxed">
            Rafał Kowalkowski · ODART · NIP 5791020696 · 78-100 Kołobrzeg.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#zgloszenie"
              className="inline-flex items-center gap-2 rounded-lg border border-red-500 bg-red-600 px-8 py-3.5 text-lg font-semibold text-white hover:bg-red-500"
            >
              <AlertTriangle className="h-5 w-5 shrink-0" aria-hidden />
              Zgłoś awarię w formularzu
            </a>
            <a
              href="tel:+48695432415"
              className="inline-flex items-center rounded-lg border border-white/10 px-8 py-3.5 font-semibold text-white hover:bg-neutral-800"
            >
              695 432 415
            </a>
          </div>
        </div>
      </section>
    </OdartPublicShell>
  );
}
