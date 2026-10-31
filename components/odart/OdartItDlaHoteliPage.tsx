import Link from "next/link";
import {
  AlertTriangle,
  ChevronRight,
  Wifi,
  Network,
  MonitorSmartphone,
  CreditCard,
  ShieldAlert,
  CalendarRange,
} from "lucide-react";
import { ODART_SITE_URL } from "@/lib/odartSite";
import { OdartPublicShell } from "@/components/odart/OdartPublicShell";

const SITE = ODART_SITE_URL;
const CANONICAL = `${SITE}/it-dla-hoteli/`;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${CANONICAL}#webpage`,
      url: CANONICAL,
      name: "IT dla hoteli i pensjonatów Kołobrzeg — Wi-Fi, sieć, POS | ODART",
      description:
        "IT dla hoteli i pensjonatów w Kołobrzegu: Wi-Fi gości oddzielone od recepcji, sezonowe szczyty, monitoring, POS. Rafał Kowalkowski. Tel. 695 432 415.",
      isPartOf: { "@id": `${SITE}/#website` },
      inLanguage: "pl-PL",
    },
    {
      "@type": "ProfessionalService",
      "@id": `${CANONICAL}#service`,
      name: "IT dla hoteli i pensjonatów — ODART",
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
      areaServed: [
        { "@type": "City", name: "Kołobrzeg" },
        { "@type": "AdministrativeArea", name: "województwo zachodniopomorskie" },
      ],
      provider: {
        "@type": "Person",
        name: "Rafał Kowalkowski",
        telephone: "+48695432415",
        email: "biuro@odart.pl",
      },
    },
  ],
};

const topics = [
  {
    icon: Wifi,
    title: "Wi-Fi gości ≠ sieć recepcji",
    body: "Goście dostają osobny dostęp. Recepcja, księgowość i kasa działają na oddzielonej sieci — bez mieszania ruchu turystów z danymi obiektu.",
  },
  {
    icon: CalendarRange,
    title: "Sezonowe szczyty",
    body: "W sezonie sieć i Internet muszą wytrzymać pełny obłożenie. Ustawiam przepustowość, QoS i backup łącza, żeby check-in nie stał w kolejce do Wi-Fi.",
  },
  {
    icon: ShieldAlert,
    title: "Przestoje kosztują noclegi",
    body: "Awaria sieci albo terminala w sobotę wieczór to utracone rezerwacje. Mam ścieżkę awaryjną i stałą opiekę — żebym nie poznawał obiektu dopiero przy panice.",
  },
  {
    icon: CreditCard,
    title: "POS, terminale, drukarki",
    body: "Kasa, terminal płatniczy, drukarka fiskalna i PMS muszą ze sobą gadać. Konfiguruję stanowiska i pomagam, gdy coś przestaje drukować lub autoryzować.",
  },
  {
    icon: MonitorSmartphone,
    title: "Monitoring obiektu",
    body: "Kamery na parkingu, wejściu i strefach wspólnych — z podglądem na telefon. Osobna usługa montażu i konfiguracji w Kołobrzegu.",
  },
  {
    icon: Network,
    title: "Sieć, switch, Wi-Fi coverage",
    body: "Od kabli i switchy po access pointy na piętrach. Jedna osoba odpowiedzialna za to, żeby obiekty w regionie działały przewidywalnie.",
  },
];

export function OdartItDlaHoteliPage() {
  return (
    <OdartPublicShell activeNav="uslugi" jsonLd={jsonLd}>
      <section className="border-b border-white/10 bg-gradient-to-b from-neutral-950/40 to-black px-4 py-16 lg:px-6 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-medium uppercase tracking-wide text-odart-accent">
            ODART — Rafał Kowalkowski · NIP 5791020696
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
            IT dla hoteli i pensjonatów w Kołobrzegu
          </h1>
          <p className="mt-6 max-w-3xl text-lg font-medium text-white">
            Wi-Fi gości · sieć recepcji · sezon · monitoring · POS
          </p>
          <p className="mt-3">
            <a href="tel:+48695432415" className="text-xl font-semibold text-odart-accent hover:text-orange-300">
              695 432 415
            </a>
            <span className="mx-3 text-neutral-600" aria-hidden>
              ·
            </span>
            <a href="mailto:biuro@odart.pl" className="text-lg text-neutral-300 hover:text-odart-accent">
              biuro@odart.pl
            </a>
          </p>
          <p className="mt-8 max-w-3xl text-lg leading-relaxed text-neutral-300">
            Hotel i pensjonat w sezonie nie mogą czekać na „jutro”. Oddzielam Wi-Fi gości od sieci obiektu, pilnuję
            łącza w szczycie, pomagam przy kasie i terminalach — i zostawiam ścieżkę na awarię. Od 2008, Kołobrzeg i
            okolice.
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
            <a
              href="mailto:biuro@odart.pl"
              className="inline-flex items-center rounded-lg border border-white/10 px-6 py-3 font-semibold text-white hover:bg-neutral-800"
            >
              Napisz e-mail
            </a>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 px-4 py-16 lg:px-6" aria-labelledby="hotel-topics">
        <div className="mx-auto max-w-6xl">
          <h2 id="hotel-topics" className="text-3xl font-bold text-white sm:text-4xl">
            Co rozwiązuję w obiektach noclegowych
          </h2>
          <p className="mt-4 max-w-3xl text-neutral-400">
            Bez farmy stron pod każde miasto — konkretna oferta dla hoteli i pensjonatów w Kołobrzegu i regionie.
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {topics.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                  <Icon className="h-8 w-8 text-odart-accent" aria-hidden />
                  <h3 className="mt-4 text-lg font-bold text-white">{item.title}</h3>
                  <p className="mt-2 text-neutral-400 leading-relaxed">{item.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-neutral-950/40 px-4 py-16 lg:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Opieka albo awaria — wybierz ścieżkę</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
              <h3 className="text-xl font-bold text-white">Stała opieka IT</h3>
              <p className="mt-3 text-neutral-400 leading-relaxed">
                Abonament: monitoring łącza i urządzeń, aktualizacje, backup, jedna osoba do kontaktu. Mniej niespodzianek
                w sezonie.
              </p>
              <Link
                href={`${SITE}/opieka-it-dla-firm-kolobrzeg/`}
                className="mt-6 inline-flex items-center text-sm font-semibold text-odart-accent hover:text-orange-300"
              >
                Opieka IT dla firm
                <ChevronRight className="ml-1 h-4 w-4" aria-hidden />
              </Link>
            </article>
            <article className="rounded-2xl border border-odart-accent/30 bg-odart-accent/5 p-8">
              <h3 className="text-xl font-bold text-white">Praca stoi — dzwoń</h3>
              <p className="mt-3 text-neutral-400 leading-relaxed">
                Sieć padła, Wi-Fi nie działa, kasa nie drukuje? Krótka ścieżka awaryjna — bez fałszywego „systemu ticketów”.
              </p>
              <Link
                href={`${SITE}/pogotowie-it/`}
                className="mt-6 inline-flex items-center text-sm font-semibold text-odart-accent hover:text-orange-300"
              >
                Pogotowie IT
                <ChevronRight className="ml-1 h-4 w-4" aria-hidden />
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 px-4 py-16 lg:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Powiązane usługi ODART</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href={`${SITE}/informatyk-kolobrzeg/`}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 hover:border-odart-accent/40"
            >
              <span className="text-xs font-medium uppercase tracking-wide text-odart-accent/90">IT lokalnie</span>
              <span className="mt-1 block text-sm font-semibold text-white">Informatyk Kołobrzeg</span>
            </Link>
            <Link
              href={`${SITE}/opieka-it-dla-firm-kolobrzeg/`}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 hover:border-odart-accent/40"
            >
              <span className="text-xs font-medium uppercase tracking-wide text-odart-accent/90">Abonament</span>
              <span className="mt-1 block text-sm font-semibold text-white">Opieka IT dla firm</span>
            </Link>
            <Link
              href={`${SITE}/monitoring-i-kamery-kolobrzeg/`}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 hover:border-odart-accent/40"
            >
              <span className="text-xs font-medium uppercase tracking-wide text-odart-accent/90">CCTV</span>
              <span className="mt-1 block text-sm font-semibold text-white">Monitoring i kamery</span>
            </Link>
            <Link
              href={`${SITE}/hotel/`}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 hover:border-odart-accent/40"
            >
              <span className="text-xs font-medium uppercase tracking-wide text-odart-accent/90">Aplikacja</span>
              <span className="mt-1 block text-sm font-semibold text-white">HotelOps — awarie i housekeeping</span>
            </Link>
            <Link
              href={`${SITE}/strony-internetowe/`}
              className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 hover:border-odart-accent/40"
            >
              <span className="text-xs font-medium uppercase tracking-wide text-odart-accent/90">WWW</span>
              <span className="mt-1 block text-sm font-semibold text-white">Strony internetowe</span>
            </Link>
          </div>
          <p className="mt-8 text-sm text-neutral-500">
            Domena, poczta i zamówienia online:{" "}
            <Link href={`${SITE}/zaamow/`} className="text-odart-accent hover:text-orange-300">
              zaamow.pl
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="px-4 py-16 lg:px-6">
        <div className="mx-auto max-w-6xl rounded-2xl border border-odart-accent/30 bg-gradient-to-br from-neutral-900/80 to-black p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Porozmawiajmy o Twoim obiekcie</h2>
          <p className="mt-4 max-w-3xl text-neutral-400 leading-relaxed">
            Rafał Kowalkowski · ODART · NIP 5791020696 · 78-100 Kołobrzeg. Zadzwoń albo napisz — ustalimy, czy potrzebujesz
            jednorazowego porządku w sieci, czy stałej opieki przed sezonem.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="tel:+48695432415"
              className="inline-flex items-center rounded-lg bg-odart-accent px-8 py-3.5 font-semibold text-white hover:brightness-110"
            >
              695 432 415
              <ChevronRight className="ml-1 h-5 w-5" aria-hidden />
            </a>
            <a
              href="mailto:biuro@odart.pl"
              className="inline-flex items-center rounded-lg border border-white/10 px-8 py-3.5 font-semibold text-white hover:bg-neutral-800"
            >
              biuro@odart.pl
            </a>
          </div>
        </div>
      </section>
    </OdartPublicShell>
  );
}
