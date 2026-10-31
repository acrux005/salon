import Image from "next/image";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  Camera,
  Check,
  ChevronRight,
  Globe2,
  Monitor,
} from "lucide-react";
import { ODART_PORTFOLIO_URL, ODART_SITE_URL } from "@/lib/odartSite";
import { OdartPublicShell } from "@/components/odart/OdartPublicShell";
import { OdartOpiekaKontaktBlock } from "@/components/odart/OdartOpiekaKontaktBlock";
import { OdartSnakeLineAccent } from "@/components/odart/OdartSnakeLineAccent";
import { OdartSpiralLine } from "@/components/odart/OdartSpiralLine";
import { OdartScrollToTopOnLanding } from "@/components/odart/OdartScrollToTopOnLanding";
import { OdartOpiekaTestimonialCarousel } from "@/components/odart/OdartOpiekaTestimonialCarousel";
import type { OpiekaPortfolioItem } from "@/components/odart/OdartOpiekaPortfolioGrid";
import { OdartOpiekaPortfolioGrid } from "@/components/odart/OdartOpiekaPortfolioGrid";
import { OdartBackToTopButton } from "@/components/odart/OdartBackToTopButton";

const SITE = ODART_SITE_URL;
const CANONICAL = `${SITE}/opieka-it-dla-firm-kolobrzeg/`;

/** Zdjęcia jak w demo dev.rafalkowalkowski.pl (?v=opieka-it) — z odart.pl + avatar z /demo/ */
const ABOUT_IMAGE =
  "https://odart.pl/wp-content/uploads/2026/02/odart._in_office_with_monitors_and_code_around_-ar_11_-styl_66ecffcf-aeef-478d-8736-270028d15204_3.jpg";

const CONTACT_AVATAR_IMAGE = "https://dev.rafalkowalkowski.pl/demo/developer3.jpg";

const portfolioItems: OpiekaPortfolioItem[] = [
  {
    cat: "Sklep",
    title: "Smaczna Ryba",
    href: "https://smacznaryba.pl/",
    thumb: "https://odart.pl/wp-content/uploads/2026/02/Screenshot-at-May-21-10-23-47.jpg",
  },
  {
    cat: "Deweloper",
    title: "Platforma sprzedaży mieszkań – Strona dla Dewelopera",
    href: `${SITE}/project/strona-dla-dewelopera/`,
    thumb: "https://odart.pl/wp-content/uploads/2026/02/Screenshot-at-Feb-12-16-45-55.jpg",
  },
  {
    cat: "Kancelaria",
    title: "Biuro Rachunkowe MKProfit",
    href: "https://mkprofit.com.pl/",
    thumb: "https://odart.pl/wp-content/uploads/2026/02/Screenshot-at-Feb-12-12-38-35.jpg",
  },
  {
    cat: "Aplikacje",
    title: "ProKursy-Online",
    href: "https://prokursy-online.pl/",
    thumb: "https://odart.pl/wp-content/uploads/2026/02/Screenshot-at-Feb-12-16-38-26.jpg",
  },
  {
    cat: "Aplikacje",
    title: "Aplikacja hotelowa (HotelOps)",
    href: "https://hotel.odart.pl/",
    thumb: "https://odart.pl/wp-content/uploads/2026/02/Screenshot-at-Feb-12-16-47-32.jpg",
  },
  {
    cat: "Aplikacje",
    title: "Portal fotograficzny Fotoferia",
    href: "https://fotoferia.pl/",
    thumb: "https://odart.pl/wp-content/uploads/2026/02/Screenshot-at-Feb-12-16-53-08.jpg",
  },
];

const testimonials = [
  {
    quote:
      "Właściciel ODA jest również właścicielem portalu fotograficznego Fotoferia, którego jestem uczestnikiem. Jego profesjonalizm, kompetencje, intelekt, kreatywność pomogły mu stworzyć niebanalny, profesjonalny, nowatorski portal na wysokim poziomie.",
    author: "Anna K.",
  },
  {
    quote:
      "Serdecznie polecam! ODA to konkretna i fachowa pomoc w budowie portfolio. Świetny kontakt i pełen profesjonalizm.",
    author: "Lukas K.",
  },
  {
    quote:
      "Miałam przyjemność współpracować z Panem Rafałem przy tworzeniu moich stron internetowych i jestem bardzo zadowolona z efektów. Strony zostały stworzone na szablonie, ale dzięki dbałości o szczegóły wyglądają profesjonalnie i są w pełni dostosowane do moich potrzeb.",
    author: "Milena M.",
  },
];

const scopeCards: {
  title: string;
  subtitle: string;
  bullets: string[];
  icon: typeof Building2;
}[] = [
  {
    title: "Sprawna firma zamiast przestojów",
    subtitle: "Pilnuję systemów zanim coś przestanie działać.",
    bullets: [
      "Pracownicy zawsze mają dostęp",
      "Programy księgowe działają stabilnie",
      "Problemy wykrywane zanim je zobaczysz",
      "Masz jedną osobę odpowiedzialną",
    ],
    icon: Building2,
  },
  {
    title: "Strona, która zdobywa klientów",
    subtitle: "Twoja strona pracuje kiedy Ty pracujesz.",
    bullets: [
      "Zapytania trafiają do Ciebie",
      "Strona szybka i aktualna",
      "Widoczność w Google",
      "Nic nie trzeba pilnować",
    ],
    icon: Globe2,
  },
  {
    title: "Dowód zamiast domysłów",
    subtitle: "Monitoring który pomaga — nie tylko nagrywa.",
    bullets: [
      "Zdalny podgląd z telefonu",
      "Nagrania gdy coś się wydarzy",
      "Integracja z firmową siecią",
      "Spokój i kontrola",
    ],
    icon: Camera,
  },
];

const itPackages: {
  name: string;
  subtitle?: string;
  highlight?: boolean;
  features: string[];
}[] = [
  {
    name: "Basic",
    features: [
      "Reaguję, gdy coś się zepsuje",
      "Wsparcie e-mail",
      "1 wizyta lub zdalna interwencja miesięcznie",
      "Podstawowe kopie zapasowe",
      "Aktualizacje systemu",
      "Drobne naprawy",
    ],
  },
  {
    name: "Standard",
    subtitle: "Najczęściej to właśnie to",
    highlight: true,
    features: [
      "Pilnuję, żeby się nie psuło",
      "Wsparcie e-mail i telefon",
      "2 interwencje miesięcznie",
      "Codzienne kopie zapasowe",
      "Monitoring — widzę problem zanim Ty",
      "Szybka reakcja na awarie",
    ],
  },
  {
    name: "Professional",
    features: [
      "Przejmuję odpowiedzialność za IT",
      "Wsparcie całodobowe",
      "Nieograniczone interwencje",
      "Backupy w chmurze",
      "Audyty bezpieczeństwa",
      "Ty się zajmujesz biznesem — ja IT",
    ],
  },
];

const cooperationBullets = [
  "Komputery działają. Ty zajmujesz się sprzedażą.",
  "Strona zbiera zapytania zamiast leżeć.",
  "Dane są bezpieczne. Wiesz, że masz kopie.",
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${CANONICAL}#webpage`,
      url: CANONICAL,
      name: "Opieka IT dla firm Kołobrzeg | ODART",
      description:
        "Zewnętrzny dział IT dla firm w Kołobrzegu — opieka nad systemami, siecią i bezpieczeństwem. Pakiety wsparcia, helpdesk, backup.",
      isPartOf: { "@id": `${SITE}/#website` },
      inLanguage: "pl-PL",
    },
    {
      "@type": "Service",
      "@id": `${CANONICAL}#service`,
      name: "Opieka IT dla firm",
      serviceType: "Outsourcing IT / opieka informatyczna",
      provider: { "@id": `${SITE}/#org` },
      areaServed: [{ "@type": "City", name: "Kołobrzeg" }, { "@type": "City", name: "Koszalin" }],
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

export function OdartOpiekaItDlaFirmKolobrzegPage() {
  return (
    <OdartPublicShell activeNav="uslugi" jsonLd={jsonLd}>
      <OdartScrollToTopOnLanding />
      <OdartBackToTopButton />
      <OdartSpiralLine mode="page" />
      <div className="relative z-10">
        <section className="relative overflow-hidden border-b border-white/10 bg-gradient-to-b from-neutral-950 via-black to-black px-4 py-16 lg:px-6 lg:py-24">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(249,115,22,0.12),transparent)]"
            aria-hidden
          />
          <OdartSnakeLineAccent side="left" />
          <OdartSnakeLineAccent side="right" phaseDelay />
          <div className="relative mx-auto max-w-4xl text-center">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-odart-accent">ODART</p>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-[3.1rem] lg:leading-tight">
              Rafał Kowalkowski — zewnętrzny dział IT dla firm w Kołobrzegu
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-neutral-400">
              Opiekuję się systemami, siecią i bezpieczeństwem, żeby Twoja firma działała bez przestojów.
            </p>
            <p className="mt-4 text-sm text-neutral-500">
              Małe i średnie firmy · reakcja tego samego dnia · wsparcie zdalne i na miejscu
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href={`${ODART_SITE_URL}/pogotowie-it/#zgloszenie`}
                className="inline-flex items-center gap-2 rounded-lg border border-red-500/80 px-8 py-3.5 text-[15px] font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300"
                aria-label="Zgłoś awarię IT"
              >
                <AlertTriangle className="h-5 w-5 shrink-0" aria-hidden />
                Zgłoś awarię
              </Link>
              <a
                href="#kontakt-opieka-it"
                className="inline-flex items-center rounded-lg bg-odart-accent px-8 py-3.5 text-[15px] font-semibold text-white hover:brightness-110"
              >
                Porozmawiajmy o Twojej firmie
                <ChevronRight className="ml-1 h-5 w-5" aria-hidden />
              </a>
              <Link
                href={ODART_PORTFOLIO_URL}
                className="inline-flex items-center rounded-lg border border-white/15 px-8 py-3.5 text-[15px] font-semibold text-white hover:bg-white/5"
              >
                Zobacz realizacje
                <ArrowRight className="ml-1 h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </section>

        {/* O mnie — układ 2 kolumny jak na demo */}
        <section className="border-b border-white/10 px-4 py-16 lg:px-6">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
            <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-white/10 lg:mx-0 lg:max-w-none">
              <div className="relative aspect-square w-full">
                <Image
                  src={ABOUT_IMAGE}
                  alt="Rafał Kowalkowski — opieka IT dla firm"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  priority
                />
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-odart-accent">O mnie</p>
              <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">Ponad 10 lat opieki IT nad firmami</h2>
              <p className="mt-6 text-lg leading-relaxed text-neutral-400">
                Nie sprzedaję godzin pracy — przejmuję odpowiedzialność za działanie Twojej firmy.
              </p>
              <p className="mt-4 text-neutral-400 leading-relaxed">
                Obsługuję małe i średnie firmy, które nie potrzebują etatu informatyka, ale nie mogą pozwolić sobie na
                przestoje. Znam realne problemy biur: program księgowy przestaje działać, nowy pracownik nie ma dostępu,
                kopie zapasowe są, ale nikt nie wie czy działają.
              </p>
              <p className="mt-4 text-neutral-400 leading-relaxed">Najpierw porządkuję systemy, dostęp i kopie bezpieczeństwa.</p>
              <p className="mt-4 text-neutral-400 leading-relaxed">Potem pilnuję, żeby problemy nie wracały.</p>
              <p className="mt-4 text-neutral-400 leading-relaxed">
                Nie reaguję dopiero gdy coś się zepsuje — zapobiegam zanim przestój zacznie kosztować.
              </p>
              <p className="mt-6 font-semibold text-white">Masz jedną osobę odpowiedzialną za IT.</p>
            </div>
          </div>
        </section>

        {/* Dwie karty + pasek benefitów (demo) */}
        <section className="border-b border-white/10 bg-neutral-950/40 px-4 py-16 lg:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-6 lg:grid-cols-2">
              <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 shadow-sm shadow-black/20">
                <h2 className="text-xl font-bold text-white sm:text-2xl">Z czym zgłaszają się firmy</h2>
                <p className="mt-6 text-sm leading-relaxed text-neutral-400 sm:text-base">
                  System działa wolno, nikt nie wie dlaczego. Nie ma kopii zapasowych albo nikt ich nie sprawdza. Program
                  księgowy blokuje pracę biura. Nowy pracownik nie ma dostępu do systemów. Strona przestała wysyłać
                  zapytania. Firma rośnie szybciej niż jej infrastruktura.{" "}
                  <span className="text-neutral-200">To nie są pojedyncze awarie — to brak opieki IT.</span>
                </p>
              </article>
              <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 shadow-sm shadow-black/20">
                <h2 className="text-xl font-bold text-white sm:text-2xl">Jak wygląda współpraca</h2>
                <p className="mt-6 text-sm leading-relaxed text-neutral-400 sm:text-base">
                  Nie działam jak serwis na wezwanie. Przejmuję odpowiedzialność za IT w firmie. Najpierw poznaję
                  środowisko i zagrożenia. Potem porządkujemy dostęp, kopie i bezpieczeństwo. Na końcu pilnuję, żeby
                  problemy nie wracały. Twoja firma działa — zanim coś się zepsuje.
                </p>
              </article>
            </div>
            <div className="mt-10 flex flex-wrap justify-center gap-x-10 gap-y-3 border-t border-white/10 pt-10 text-center text-sm text-neutral-400">
              {cooperationBullets.map((line) => (
                <span key={line} className="inline-flex items-center gap-2">
                  <span className="text-odart-accent" aria-hidden>
                    •
                  </span>
                  {line}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-white/10 px-4 py-16 lg:px-6">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-3xl font-bold text-white sm:text-4xl">Co dokładnie biorę na siebie</h2>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {scopeCards.map((card) => {
                const Icon = card.icon;
                return (
                  <article
                    key={card.title}
                    className="flex flex-col rounded-2xl border border-white/10 bg-neutral-950/60 p-8 shadow-inner shadow-black/30"
                  >
                    <Icon className="h-10 w-10 text-odart-accent" aria-hidden />
                    <h3 className="mt-6 text-xl font-bold text-white">{card.title}</h3>
                    <p className="mt-2 text-sm text-neutral-500">{card.subtitle}</p>
                    <ul className="mt-6 flex-1 space-y-2 text-sm text-neutral-400">
                      {card.bullets.map((b) => (
                        <li key={b} className="flex gap-2">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-odart-accent" aria-hidden />
                          {b}
                        </li>
                      ))}
                    </ul>
                    <a
                      href="#kontakt-opieka-it"
                      className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-white py-3 text-center text-sm font-semibold text-black transition hover:bg-neutral-200"
                    >
                      Zapytaj o wycenę
                    </a>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-b border-white/10 bg-neutral-950/30 px-4 py-14 lg:px-6">
          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
            <article className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <h2 className="text-xl font-bold text-white">IT dla hoteli i pensjonatów</h2>
              <p className="mt-3 text-neutral-400 leading-relaxed">
                W sezonie obiekt nie może stać bez Wi-Fi i kasy. Oddzielam sieć gości od recepcji, pilnuję łącza i POS —
                a opiekę IT biorę na abonament, żeby awarie nie wracały.
              </p>
              <Link
                href={`${SITE}/it-dla-hoteli/`}
                className="mt-4 inline-flex items-center text-sm font-semibold text-odart-accent hover:text-orange-300"
              >
                Oferta dla hoteli
                <ChevronRight className="ml-1 h-4 w-4" aria-hidden />
              </Link>
            </article>
            <article className="rounded-2xl border border-odart-accent/25 bg-odart-accent/5 p-6">
              <h2 className="text-xl font-bold text-white">Awaria teraz — pogotowie IT</h2>
              <p className="mt-3 text-neutral-400 leading-relaxed">
                Opieka zapobiega przestojom. Gdy już stoi praca — dzwoń{" "}
                <a href="tel:+48695432415" className="font-semibold text-odart-accent hover:text-orange-300">
                  695 432 415
                </a>
                . Krótka ścieżka awaryjna, bez fałszywego systemu ticketów.
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

        {/* Tworzenie stron — duża karta 2 kolumny jak demo */}
        <section className="border-b border-white/10 px-4 py-16 lg:px-6">
          <div className="mx-auto max-w-6xl">
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-neutral-900/90 to-black p-8 lg:p-12">
              <div className="grid items-center gap-10 lg:grid-cols-2">
                <div>
                  <h2 className="text-2xl font-bold text-white sm:text-3xl md:text-4xl">
                    Tworzenie <span className="text-odart-accent">stron</span> internetowych
                  </h2>
                  <p className="mt-4 text-neutral-400">
                    Tworzę strony od podstaw — strona firmowa, sklep, formularze i integracje. Strona pracuje, kiedy Ty
                    pracujesz.
                  </p>
                  <ul className="mt-6 space-y-2 text-neutral-300">
                    {["Strony i sklepy", "Formularze i zapytania", "Widoczność w Google"].map((x) => (
                      <li key={x} className="flex gap-2 text-sm">
                        <span className="text-odart-accent">•</span>
                        {x}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <a
                      href="tel:+48695432415"
                      className="inline-flex items-center rounded-full bg-odart-accent px-6 py-3 text-sm font-semibold text-white hover:brightness-110"
                    >
                      Zadzwoń
                    </a>
                    <a href="tel:+48695432415" className="text-lg font-semibold text-white hover:text-odart-accent">
                      +48 695 432 415
                    </a>
                  </div>
                  <Link
                    href={`${SITE}/strony-internetowe/`}
                    className="mt-6 inline-flex items-center text-sm font-semibold text-odart-accent hover:text-orange-300"
                  >
                    Zobacz ofertę stron WWW <ChevronRight className="ml-1 h-4 w-4" aria-hidden />
                  </Link>
                </div>
                <div className="flex justify-center lg:justify-end">
                  <div className="flex h-56 w-56 items-center justify-center rounded-2xl border border-odart-accent/20 bg-black/50 sm:h-64 sm:w-64">
                    <Monitor className="h-28 w-28 text-odart-accent/90 sm:h-32 sm:w-32" strokeWidth={1.25} aria-hidden />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-white/10 px-4 py-16 lg:px-6">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-3xl font-bold text-white sm:text-4xl">Zakres opieki</h2>
            <p className="mx-auto mt-4 max-w-xl text-center text-neutral-400">
              Trzy typowe warianty. Kwotę ustalamy po rozmowie o liczbie stanowisk i tym, co już macie.
            </p>
            <div className="mt-12 grid gap-8 lg:grid-cols-3">
              {itPackages.map((pkg) => (
                <article
                  key={pkg.name}
                  className={`flex flex-col rounded-2xl border p-8 ${
                    pkg.highlight
                      ? "border-odart-accent/40 bg-gradient-to-b from-odart-accent/10 to-transparent"
                      : "border-white/10 bg-white/[0.02]"
                  }`}
                >
                  {pkg.subtitle ? (
                    <p className="text-xs font-semibold uppercase tracking-wide text-odart-accent/90">{pkg.subtitle}</p>
                  ) : null}
                  <h3 className={`text-xl font-bold text-white ${pkg.subtitle ? "mt-2" : ""}`}>{pkg.name}</h3>
                  <ul className="mt-6 flex-1 space-y-3 text-sm text-neutral-400">
                    {pkg.features.map((f) => (
                      <li key={f} className="flex gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-odart-accent" aria-hidden />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#kontakt-opieka-it"
                    className={`mt-8 inline-flex items-center justify-center rounded-full py-3 text-center text-sm font-semibold ${
                      pkg.highlight
                        ? "bg-white text-black hover:bg-neutral-200"
                        : "border border-white/20 text-white hover:bg-white/10"
                    }`}
                  >
                    Zamów
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-white/10 px-4 py-16 lg:px-6">
          <OdartOpiekaPortfolioGrid items={portfolioItems} />
        </section>

        <section className="border-b border-white/10 bg-neutral-950/30 px-4 py-16 lg:px-6">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center text-3xl font-bold text-white sm:text-4xl">Opinie</h2>
            <p className="mt-2 text-center text-neutral-500">Co mówią klienci</p>
            <div className="mt-12">
              <OdartOpiekaTestimonialCarousel items={testimonials} />
            </div>
          </div>
        </section>

        <section id="kontakt-opieka-it" className="border-t border-white/10 px-4 py-16 lg:px-6">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-3xl font-bold text-white sm:text-4xl">Kontakt</h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-neutral-400">
              Zostaw numer lub e-mail — oddzwonię z ofertą dopasowaną do potrzeb.
            </p>

            <OdartOpiekaKontaktBlock
              contextPath="/opieka-it-dla-firm-kolobrzeg/"
              contactAvatarSrc={CONTACT_AVATAR_IMAGE}
            />

            <p className="mt-12 text-center text-sm text-neutral-600">
              <Link href={`${SITE}/polityka-prywatnosci/`} className="hover:text-neutral-400">
                Polityka prywatności
              </Link>
              {" · "}
              <Link href={`${SITE}/regulamin/`} className="hover:text-neutral-400">
                Regulamin
              </Link>
            </p>
            <p className="mt-6 text-center text-sm text-neutral-500">
              <span className="text-neutral-400">Rafał Kowalkowski</span> · ODART — Ostry Dyżur Artystyczny · Kołobrzeg
            </p>
          </div>
        </section>
      </div>
    </OdartPublicShell>
  );
}
