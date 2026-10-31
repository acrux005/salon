import Image from "next/image";
import Link from "next/link";
import {
  Check,
  Mail,
  MapPin,
  Phone,
  Wrench,
  BedDouble,
  BarChart3,
  Smartphone,
} from "lucide-react";
import { ODART_SITE_URL } from "@/lib/odartSite";
import { OdartHotelOpsDemoForm } from "@/components/odart/OdartHotelOpsDemoForm";

const SITE = ODART_SITE_URL;
const APP = "https://hotel.odart.pl";
const CANONICAL = `${SITE}/hotel/`;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${CANONICAL}#webpage`,
      url: CANONICAL,
      name: "Aplikacja hotelowa do awarii i housekeepingu | HotelOps",
      description:
        "HotelOps to aplikacja hotelowa do zgłaszania awarii i zarządzania housekeepingiem. Jedno narzędzie, porządek i pełna kontrola.",
      isPartOf: { "@id": `${SITE}/#website` },
      inLanguage: "pl-PL",
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${CANONICAL}#app`,
      name: "HotelOps",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: CANONICAL,
      description:
        "Aplikacja hotelowa do zgłoszeń awarii, housekeepingu, statusów pokoi i raportów dla kierownika.",
      offers: [
        {
          "@type": "Offer",
          name: "START",
          price: "50",
          priceCurrency: "PLN",
          description: "Zgłoszenia awarii, podstawowy housekeeping, statusy zadań",
        },
        {
          "@type": "Offer",
          name: "STANDARD",
          price: "99",
          priceCurrency: "PLN",
          description: "Plan sprzątania, przypisywanie zadań, raporty, statusy pokoi",
        },
        {
          "@type": "Offer",
          name: "PREMIUM",
          price: "149",
          priceCurrency: "PLN",
          description: "Zaawansowane raporty, SLA, indywidualne dostosowania",
        },
      ],
      provider: {
        "@type": "Organization",
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
    },
  ],
};

const nav = [
  { href: "#top", label: "Home" },
  { href: `${APP}/housekeeping/`, label: "Housekeeping" },
  { href: `${APP}/awarie-w-hotelu/`, label: "Awarie w hotelu" },
  { href: "#demo", label: "Kontakt" },
  { href: `${APP}/demo/`, label: "Demo" },
];

const pillars = [
  {
    icon: Wrench,
    title: "Awarie w 10 sekund",
    body: "Zgłoszenie usterki przez recepcję lub personel. Bez telefonów, bez karteczek.",
  },
  {
    icon: BedDouble,
    title: "Housekeeping pod kontrolą",
    body: "Statusy pokoi, plan dnia i jasne przypisania zadań.",
  },
  {
    icon: BarChart3,
    title: "Raporty dla kierownika",
    body: "Widzisz co się psuje, ile to trwa i kto realizuje zadania.",
  },
  {
    icon: Smartphone,
    title: "Działa na telefonie",
    body: "Recepcja, techniczni i sprzątanie pracują w jednym systemie.",
  },
];

const benefits = [
  {
    n: "01",
    title: "Szybkie zgłoszenia awarii",
    body: "Recepcja lub personel zgłasza usterkę w kilka sekund — bez dzwonienia.",
  },
  {
    n: "02",
    title: "Jasne przypisanie zadań",
    body: "Każde zgłoszenie trafia do właściwej osoby z określonym statusem.",
  },
  {
    n: "03",
    title: "Housekeeping pod kontrolą",
    body: "Plan sprzątania, statusy pokoi i bieżąca realizacja zadań.",
  },
  {
    n: "04",
    title: "Raporty i historia działań",
    body: "Widzisz co się psuje, ile trwa naprawa i kto realizuje zadania.",
  },
];

const whyPoints = [
  "HotelOps daje kierownikowi i właścicielowi jasny obraz sytuacji:",
  "jakie awarie są zgłoszone, co jest w trakcie, a co zakończone.",
  "Housekeeping pracuje według planu, a nie domysłów.",
  "Wszystko w jednym systemie, aktualne w czasie rzeczywistym.",
];

const stats = [
  { label: "Awarie pod kontrolą", value: 90 },
  { label: "Sprawna organizacja sprzątania", value: 85 },
  { label: "Przejrzystość dla kierownictwa", value: 100 },
];

const plans = [
  {
    name: "START",
    price: 50,
    featured: false,
    features: [
      "Zgłoszenia awarii",
      "Podstawowy housekeeping",
      "Statusy zadań",
      "Dostęp mobilny",
      "Historia zgłoszeń",
    ],
  },
  {
    name: "STANDARD",
    price: 99,
    featured: true,
    features: [
      "Wszystko z planu START",
      "Plan sprzątania (dzień / tydzień)",
      "Przypisywanie zadań do pracowników",
      "Raporty dla kierownika",
      "Statusy pokoi",
    ],
  },
  {
    name: "PREMIUM",
    price: 149,
    featured: false,
    features: [
      "Wszystko z planu STANDARD",
      "Zaawansowane raporty",
      "SLA / priorytety",
      "Indywidualne dostosowania",
      "Wsparcie priorytetowe",
    ],
  },
];

function AccentLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-[#e07a66]">
      <span className="inline-block h-5 w-1 rounded-full bg-[#e07a66]" aria-hidden />
      {children}
    </p>
  );
}

export function OdartHotelOpsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div id="top" className="min-h-screen bg-white text-slate-800">
        {/* Top bar */}
        <div className="bg-[#1e2a44] text-white">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-2.5 text-sm lg:px-6">
            <span className="rounded bg-white/10 px-2.5 py-1 text-xs tracking-wide text-white/90">
              hotele/pensjonaty/aparthotele
            </span>
            <div className="flex flex-wrap items-center gap-4">
              <a href="tel:+48695432415" className="inline-flex items-center gap-2 hover:text-[#e07a66]">
                <Phone className="h-3.5 w-3.5" aria-hidden />
                +48 695 432 415
              </a>
              <a href="mailto:biuro@odart.pl" className="inline-flex items-center gap-2 hover:text-[#e07a66]">
                <Mail className="h-3.5 w-3.5" aria-hidden />
                biuro@odart.pl
              </a>
            </div>
          </div>
        </div>

        {/* Nav */}
        <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/95 shadow-sm backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 lg:px-6">
            <Link href={`${SITE}/`} className="flex items-center gap-3">
              <Image
                src="/hotelops/odart-logo.webp"
                alt="ODART"
                width={48}
                height={48}
                className="h-10 w-10 object-contain"
              />
              <span className="hidden text-[11px] font-semibold uppercase leading-tight tracking-wide text-[#1e2a44] sm:block">
                Ostry Dyżur
                <br />
                Artystyczny
              </span>
            </Link>
            <nav className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1 text-sm font-medium text-[#1e2a44]">
              {nav.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="hover:text-[#e07a66]"
                  {...(item.href.startsWith("http")
                    ? { rel: "noopener noreferrer" }
                    : {})}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </header>

        {/* Hero */}
        <section className="relative overflow-hidden bg-[#1e2a44] text-white">
          <div
            className="pointer-events-none absolute -left-24 top-16 h-64 w-64 rounded-full border-[28px] border-[#e07a66]/40"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-10 right-0 h-40 w-40 rotate-45 bg-[#7ec8c0]/25"
            aria-hidden
          />
          <div className="pointer-events-none absolute inset-0 opacity-30" aria-hidden>
            <div className="absolute left-[12%] top-[28%] h-px w-40 rotate-12 bg-violet-300/50" />
            <div className="absolute right-[30%] top-[18%] h-16 w-16 rounded-lg border border-white/10" />
            <div className="absolute bottom-[20%] left-[40%] h-10 w-10 rotate-45 border border-white/10" />
          </div>

          <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 lg:grid-cols-2 lg:gap-12 lg:px-6 lg:py-24">
            <div>
              <AccentLabel>
                <span className="normal-case tracking-normal text-white/90">
                  Aplikacja hotelowa HotelOps
                </span>
              </AccentLabel>
              <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                Zarządzaj awariami i housekeepingiem w hotelu
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
                Jedno miejsce do zgłoszeń usterek, zadań dla housekeepingu i raportów. Zespół wie
                co robić, gdzie i na kiedy — a Ty masz kontrolę w czasie rzeczywistym.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={`${APP}/demo/`}
                  className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/10 px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-[0_0_24px_rgba(224,122,102,0.35)] backdrop-blur transition hover:bg-white/20"
                  rel="noopener noreferrer"
                >
                  Demo
                </a>
                <a
                  href="#demo"
                  className="inline-flex items-center justify-center rounded-full bg-[#e07a66] px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:brightness-110"
                >
                  Umów demo
                </a>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <Image
                src="/hotelops/hero-phone.png"
                alt="HotelOps — podgląd aplikacji na telefonie"
                width={792}
                height={808}
                priority
                className="mx-auto h-auto w-full max-w-md drop-shadow-2xl"
              />
            </div>
          </div>

          <svg
            className="relative block w-full text-white"
            viewBox="0 0 1440 80"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path
              fill="currentColor"
              d="M0,48 C240,96 480,0 720,32 C960,64 1200,96 1440,40 L1440,80 L0,80 Z"
            />
          </svg>
        </section>

        {/* Pillars */}
        <section className="relative z-10 -mt-6 bg-white px-4 pb-16 lg:px-6">
          <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_12px_40px_rgba(30,42,68,0.08)]"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#1e2a44]/5 text-[#e07a66]">
                  <item.icon className="h-5 w-5" aria-hidden />
                </div>
                <h2 className="text-lg font-bold text-[#1e2a44]">{item.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section className="bg-white px-4 py-8 lg:px-6 lg:py-12">
          <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
            <div className="relative mx-auto w-full max-w-sm">
              <Image
                src="/hotelops/feature-1.png"
                alt=""
                width={782}
                height={852}
                className="h-auto w-full"
              />
            </div>
            <div>
              <AccentLabel>Korzyści dla hotelu</AccentLabel>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#1e2a44] sm:text-4xl">
                Jedno narzędzie, jeden porządek, pełna kontrola
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                HotelOps łączy recepcję, housekeeping i technicznych w jednym systemie. Zgłoszenia
                awarii, sprzątanie i statusy pokoi są zawsze aktualne — bez telefonów, karteczek i
                nieporozumień.
              </p>
              <p className="mt-3 text-base leading-relaxed text-slate-600">
                Kierownik i właściciel mają pełen wgląd w to, co dzieje się w obiekcie.
              </p>
            </div>
          </div>

          <div className="mx-auto mt-12 grid max-w-6xl gap-4 sm:grid-cols-2">
            {benefits.map((item) => (
              <article
                key={item.n}
                className="rounded-2xl bg-gradient-to-br from-[#1e2a44] to-[#c96a5a] p-6 text-white shadow-lg"
              >
                <p className="text-sm font-semibold tracking-wide text-white/70">
                  {item.n}{" "}
                  <span className="ml-1 text-base font-bold text-white">{item.title}</span>
                </p>
                <p className="mt-3 text-sm leading-relaxed text-white/90">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Why */}
        <section className="bg-slate-50 px-4 py-16 lg:px-6 lg:py-20">
          <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
            <div>
              <AccentLabel>Dlaczego Hotel Ops działa</AccentLabel>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#1e2a44] sm:text-4xl">
                Pełna kontrola nad tym, co dzieje się w hotelu
              </h2>
              <ul className="mt-6 space-y-3">
                {whyPoints.map((point) => (
                  <li key={point} className="flex gap-3 text-base leading-relaxed text-slate-700">
                    <span className="mt-1.5 h-5 w-1 shrink-0 rounded-full bg-[#7ec8c0]" aria-hidden />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-10 space-y-5">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <div className="mb-1.5 flex items-center justify-between text-sm font-medium text-[#1e2a44]">
                      <span>{stat.label}</span>
                      <span>{stat.value}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#1e2a44] to-[#e07a66]"
                        style={{ width: `${stat.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-sm">
              <div
                className="absolute right-4 top-8 h-48 w-48 rounded-full bg-[#e07a66]/25"
                aria-hidden
              />
              <Image
                src="/hotelops/feature-2.png"
                alt=""
                width={462}
                height={600}
                className="relative mx-auto h-auto w-full"
              />
            </div>
          </div>
        </section>

        {/* Demo CTA */}
        <section id="demo" className="scroll-mt-24 px-4 py-16 lg:px-6">
          <div className="mx-auto max-w-5xl rounded-3xl bg-gradient-to-r from-[#1e2a44] via-[#6b4a6a] to-[#e07a66] px-6 py-12 text-center shadow-xl sm:px-10">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Umów demo HotelOps (15 minut)
            </h2>
            <div className="mt-8">
              <OdartHotelOpsDemoForm />
            </div>
            <p className="mt-5 text-sm text-white/75">
              Albo od razu otwórz{" "}
              <a
                href={`${APP}/demo/`}
                className="font-semibold text-white underline underline-offset-2 hover:no-underline"
                rel="noopener noreferrer"
              >
                interaktywne demo
              </a>
              .
            </p>
          </div>
        </section>

        {/* Pricing */}
        <section className="bg-white px-4 pb-20 lg:px-6">
          <div className="mx-auto max-w-6xl text-center">
            <p className="inline-flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-[#e07a66]">
              <span className="inline-block h-5 w-1 rounded-full bg-[#e07a66]" aria-hidden />
              Cennik Hotel Ops
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#1e2a44] sm:text-4xl">
              Prosty cennik dopasowany do wielkości obiektu
            </h2>
          </div>

          <div className="mx-auto mt-12 grid max-w-6xl gap-6 lg:grid-cols-3">
            {plans.map((plan) => (
              <article
                key={plan.name}
                className={`relative flex flex-col rounded-3xl p-8 shadow-[0_16px_40px_rgba(30,42,68,0.1)] ${
                  plan.featured
                    ? "bg-[#1e2a44] text-white ring-2 ring-[#e07a66]"
                    : "bg-white text-[#1e2a44]"
                }`}
              >
                {plan.featured ? (
                  <span className="absolute -top-3 right-6 rounded-full bg-[#e07a66] px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                    Best
                  </span>
                ) : null}
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] opacity-80">
                  {plan.name}
                </h3>
                <p className="mt-4 flex items-end gap-2">
                  <span className="text-sm font-medium opacity-70">PLN</span>
                  <span className="text-5xl font-bold leading-none">{plan.price}</span>
                  <span className={`text-sm ${plan.featured ? "text-white/60" : "text-slate-500"}`}>
                    / miesiąc
                  </span>
                </p>
                <ul className="mt-8 flex-1 space-y-3 text-sm">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check
                        className={`mt-0.5 h-4 w-4 shrink-0 ${
                          plan.featured ? "text-[#7ec8c0]" : "text-emerald-500"
                        }`}
                        aria-hidden
                      />
                      <span className={plan.featured ? "text-white/90" : "text-slate-700"}>{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#demo"
                  className={`mt-8 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-wide transition ${
                    plan.featured
                      ? "bg-[#e07a66] text-white hover:brightness-110"
                      : "bg-[#1e2a44] text-white hover:bg-[#152036]"
                  }`}
                >
                  Wybierz
                </a>
              </article>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-[#1e2a44] text-white">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
            <div>
              <p className="text-lg font-semibold">Aplikacja dla hoteli</p>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                HotelOps — awarie, housekeeping i raporty w jednym systemie. Produkt ODART,
                Kołobrzeg.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-white/60">Linki</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <a href="#top" className="hover:text-[#e07a66]">
                    Strona główna
                  </a>
                </li>
                <li>
                  <a href={`${APP}/awarie-w-hotelu/`} className="hover:text-[#e07a66]" rel="noopener noreferrer">
                    Awarie
                  </a>
                </li>
                <li>
                  <a href={`${APP}/housekeeping/`} className="hover:text-[#e07a66]" rel="noopener noreferrer">
                    Housekeeping
                  </a>
                </li>
                <li>
                  <a href={`${APP}/demo/`} className="hover:text-[#e07a66]" rel="noopener noreferrer">
                    Demo
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-white/60">ODART</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <Link href={`${SITE}/polityka-prywatnosci/`} className="hover:text-[#e07a66]">
                    Polityka prywatności
                  </Link>
                </li>
                <li>
                  <Link href={`${SITE}/regulamin/`} className="hover:text-[#e07a66]">
                    Regulamin
                  </Link>
                </li>
                <li>
                  <Link href={`${SITE}/kontakt/`} className="hover:text-[#e07a66]">
                    Kontakt
                  </Link>
                </li>
                <li>
                  <Link href={`${SITE}/it-dla-hoteli/`} className="hover:text-[#e07a66]">
                    IT dla hoteli
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-white/60">Kontakt</p>
              <ul className="mt-3 space-y-3 text-sm text-white/80">
                <li className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#e07a66]" aria-hidden />
                  Kołobrzeg
                </li>
                <li className="flex items-start gap-2">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#e07a66]" aria-hidden />
                  <a href="mailto:biuro@odart.pl" className="hover:text-[#e07a66]">
                    biuro@odart.pl
                  </a>
                </li>
                <li className="flex items-start gap-2">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#e07a66]" aria-hidden />
                  <a href="tel:+48695432415" className="hover:text-[#e07a66]">
                    +48 695 432 415
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
            ODART © {new Date().getFullYear()} All Rights Reserved
          </div>
        </footer>
      </div>
    </>
  );
}
