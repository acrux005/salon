import Link from "next/link";
import Image from "next/image";
import {
  ChevronRight,
  Code2,
  LayoutDashboard,
  Plug,
  Layers,
  ArrowRightLeft,
  ShieldAlert,
  Calculator,
  Search,
  Share2,
  Camera,
  Sparkles,
  PenLine,
  Settings,
  TrendingUp,
  Monitor,
  Globe,
  Mail,
  Phone,
  MapPin,
  Building2,
} from "lucide-react";
import { ODART_SITE_URL } from "@/lib/odartSite";
import { OdartPublicShell } from "@/components/odart/OdartPublicShell";

const SITE = ODART_SITE_URL;
const CANONICAL = `${SITE}/uslugi/`;

const services: {
  icon: typeof Layers;
  title: string;
  lead: string;
  body: string;
  href: string;
}[] = [
  {
    icon: Globe,
    title: "zaamow.pl — domeny, poczta, strony, aplikacje",
    lead: "Sklep ODART do zamówienia online",
    body:
      "Rejestracja domen .pl, poczta firmowa, strony WWW z katalogu oraz aplikacje: Harmonogram, Mini ERP, Hub, gabinety, zamówienia jedzenia. Pełna mapa oferty na odart.pl/zaamow — zakupy na zaamow.pl.",
    href: "/zaamow/",
  },
  {
    icon: Code2,
    title: "Nowoczesne aplikacje webowe",
    lead: "React, Next.js, aplikacje na zamówienie",
    body:
      "Projektuję i wdrażam produkty webowe dopasowane do procesów: od UX i architektury po kod produkcyjny, wydajność, bezpieczeństwo i utrzymanie — z myślą o skalowaniu i kolejnych iteracjach.",
    href: "/produkt/nowoczesne-aplikacje-webowe/",
  },
  {
    icon: LayoutDashboard,
    title: "Panele i systemy dla firm",
    lead: "Narzędzia wewnętrzne i B2B",
    body:
      "Panele administracyjne, zlecenia, raporty i role użytkowników — żeby zespół pracował z jednego miejsca zamiast z arkuszy i maili. Integruję z istniejącymi systemami tam, gdzie to ma sens.",
    href: "/produkt/panele-i-systemy-dla-firm/",
  },
  {
    icon: Plug,
    title: "Integracje API i automatyzacja",
    lead: "Łączenie usług i synchronizacja danych",
    body:
      "REST, webhooki, kolejki zadań: zamówienia, stany magazynowe, kurierzy, płatności i księgowość — projektuję przepływy tak, by minimalizować ręczną pracę i błędy.",
    href: "/produkt/integracje-api-i-automatyzacja/",
  },
  {
    icon: Layers,
    title: "Strona internetowa",
    lead: "Budowa i rozwój witryny na WordPressie",
    body:
      "Projektuję i wdrażam strony dopasowane do branży: szablon, motyw, treści, integracje i szkolenie z panelu. Stawiam na szybkość ładowania, czytelny UX oraz fundamenty pod SEO — tak, aby witryna realnie wspierała marketing i kontakt z klientem.",
    href: "/strony-internetowe/",
  },
  {
    icon: Sparkles,
    title: "Strona one page",
    lead: "Jedna strona, konkretny zakres",
    body:
      "Krótka strona firmowa: oferta, kontakt, działa na telefonie. Projekt, wdrożenie i publikacja. Na start albo na jedną kampanię.",
    href: "/profesjonalna-strona-internetowa-dla-ciebie-juz-od-1500-zl",
  },
  {
    icon: PenLine,
    title: "Tworzenie stron WordPress",
    lead: "Strona, którą sam edytujesz",
    body:
      "WordPress: treści, motyw, integracje i szkolenie z panelu. Żebyś nie dzwonił do mnie przy każdej zmianie godziny otwarcia.",
    href: "/tworzenie-stron-internetowych-na-wordpressie",
  },
  {
    icon: Settings,
    title: "Administracja WordPress",
    lead: "Utrzymanie, aktualizacje i zarządzanie treścią",
    body:
      "Kompleksowa obsługa WordPress: regularne aktualizacje, monitoring błędów, zarządzanie treścią, kopie zapasowe i zabezpieczenia — żebyś mógł skupić się na biznesie.",
    href: "/administracja-stron-internetowych-wordpress",
  },
  {
    icon: ArrowRightLeft,
    title: "Migracja strony internetowej",
    lead: "Przeniesienie WordPressa bez utraty danych",
    body:
      "Planujesz zmianę hostingu lub domeny? Przygotuję migrację kopii, baz i plików, sprawdzę linki i przekierowania 301, zminimalizuję przestój i zadbam o certyfikat SSL oraz poprawne DNS.",
    href: "/produkt/migracja-strony-internetowej-na-inny-serwer/",
  },
  {
    icon: ShieldAlert,
    title: "Przywracanie strony po infekcji",
    lead: "WordPress po malware i atakach",
    body:
      "Identyfikacja zagrożeń, czyszczenie plików i bazy, aktualizacja rdzenia i wtyczek, twarde hasła i zasady backupów — przywracam działanie witryny i zabezpieczam ją przed powrotem problemu.",
    href: "/produkt/przywracanie-strony-internetowej-wordpress/",
  },
  {
    icon: Calculator,
    title: "Wycena strony internetowej",
    lead: "Zakres, funkcje, koszt",
    body:
      "Omawiamy cele, strukturę podstron, integracje (formularze, analityka, sklep), terminy i budżet. Dostajesz jasny opis, co jest w cenie i co ewentualnie jako kolejny etap — bez ukrytych dopłat.",
    href: "/produkt/wycena-strony-internetowej/",
  },
  {
    icon: Search,
    title: "SEO — optymalizacja strony",
    lead: "Widoczność w Google",
    body:
      "Audyt techniczny, struktura nagłówków i treści, meta dane, mapa strony, dane strukturalne oraz linkowanie wewnętrzne. Działania dopasowuję do fraz i lokalizacji (np. Kołobrzeg, Koszalin, cała Polska).",
    href: "/produkt/seo-optymalizacja-strony/",
  },
  {
    icon: TrendingUp,
    title: "Pozycjonowanie SEO",
    lead: "Strategie i zasady pozycjonowania stron",
    body:
      "Słowa kluczowe, struktura URL, treści merytoryczne i optymalizacja obrazków — zbiór praktyk i zasad, które poprawiają widoczność strony w wynikach wyszukiwania organicznego.",
    href: "/pozycjonowanie-seo",
  },
  {
    icon: Share2,
    title: "Obsługa mediów społecznościowych",
    lead: "Spójna komunikacja marki",
    body:
      "Grafiki, harmonogram publikacji, dopasowanie tonu do grupy docelowej — tak, by social media wspierały stronę i budowały zaufanie.",
    href: "/produkt/obsluga-mediow-spolecznosciowych/",
  },
  {
    icon: Camera,
    title: "Monitoring i kamery Kołobrzeg",
    lead: "Montaż i konfiguracja systemów monitoringu",
    body:
      "Profesjonalny montaż i konfiguracja systemów monitoringu wizyjnego w Kołobrzegu i okolicach. Rozwiązania dla domów, firm i obiektów turystycznych — od projektu, przez instalację, po zdalny podgląd i serwis.",
    href: "/monitoring-i-kamery-kolobrzeg",
  },
  {
    icon: Monitor,
    title: "Informatyk Kołobrzeg",
    lead: "Usługi IT dla firm i klientów indywidualnych",
    body:
      "Projektowanie i instalacja sieci, konfiguracja sprzętu, zabezpieczenia, ERP Comarch Optima i Enova, backup w chmurze, audyt IT. Bezpieczeństwo, wydajność i niezawodność infrastruktury w Kołobrzegu i okolicach.",
    href: "/informatyk-kolobrzeg",
  },
  {
    icon: Settings,
    title: "Opieka IT dla firm Kołobrzeg",
    lead: "Zewnętrzny dział IT — abonament",
    body:
      "Helpdesk, sieć, backup i monitoring systemów. Pakiety Basic, Standard, Professional. Rafał Kowalkowski — jedna osoba odpowiedzialna za IT.",
    href: "/opieka-it-dla-firm-kolobrzeg/",
  },
  {
    icon: Building2,
    title: "IT dla hoteli i pensjonatów",
    lead: "Wi-Fi gości, sieć recepcji, sezon, POS",
    body:
      "IT pod obiekty noclegowe w Kołobrzegu: oddzielone Wi-Fi gości, sezonowe szczyty, monitoring i terminale. Bez farmy stron pod każde miasto.",
    href: "/it-dla-hoteli/",
  },
  {
    icon: Phone,
    title: "Pogotowie IT — awaria",
    lead: "Praca stoi? Dzwoń 695 432 415",
    body:
      "Awaria sieci, Wi-Fi, stanowiska albo kasy. Krótka ścieżka awaryjna bez fałszywego systemu ticketów — Rafał Kowalkowski, Kołobrzeg.",
    href: "/pogotowie-it/",
  },
  {
    icon: Monitor,
    title: "Informatyk Koszalin",
    lead: "Usługi IT dla firm i klientów indywidualnych",
    body:
      "Projektowanie i instalacja sieci, konfiguracja sprzętu, zabezpieczenia, ERP Comarch Optima i Enova, backup w chmurze, audyt IT. Bezpieczeństwo, wydajność i niezawodność infrastruktury w Koszalinie i okolicach.",
    href: "/informatyk-koszalin",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${CANONICAL}#webpage`,
      url: CANONICAL,
      name: "Usługi | ODART — strony internetowe, WordPress, SEO, zaamow.pl",
      description:
        "Strony WWW, domeny i poczta (zaamow.pl), WordPress, migracje, SEO, monitoring, usługi IT. Kołobrzeg, Koszalin.",
      isPartOf: { "@id": `${SITE}/#website` },
      inLanguage: "pl-PL",
    },
    {
      "@type": "ProfessionalService",
      "@id": `${SITE}/#org`,
      name: "ODART — Ostry Dyżur Artystyczny",
      url: SITE,
      email: "biuro@odart.pl",
      telephone: "+48695432415",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Kołobrzeg",
        addressCountry: "PL",
      },
      sameAs: ["https://zaamow.pl"],
    },
  ],
};

export function OdartUslugiPage() {
  return (
    <OdartPublicShell activeNav="uslugi" jsonLd={jsonLd}>
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 hidden lg:block">
          <Image
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&q=80"
            alt=""
            fill
            className="object-cover object-center opacity-30"
            sizes="100vw"
            priority
            role="presentation"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/95 to-transparent" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-16 lg:py-20 lg:px-6">
          <p className="text-sm font-medium uppercase tracking-wide text-odart-accent">ODART · Kołobrzeg</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">Usługi</h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-neutral-300">
            Strony, WordPress, migracje, sprzątanie po wirusie, SEO, kamery i opieka IT. Domenę, pocztę i aplikacje
            zamawiasz też na{" "}
            <Link href={`${SITE}/zaamow/`} className="text-odart-accent hover:text-orange-300">
              zaamow.pl
            </Link>
            . Kołobrzeg, Koszalin, zdalnie.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href={`${SITE}/kontakt/`}
              className="inline-flex items-center rounded-lg bg-odart-accent px-6 py-3 font-semibold text-white hover:brightness-110"
            >
              Wycena
              <ChevronRight className="ml-1 h-5 w-5" aria-hidden />
            </Link>
            <Link
              href={`${SITE}/zaamow/`}
              className="inline-flex items-center rounded-lg border border-white/10 px-6 py-3 font-semibold text-white hover:bg-neutral-800"
            >
              zaamow.pl
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-white/[0.02] px-4 py-12 lg:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="sr-only">Region</h2>
          <p className="text-center text-neutral-400">
            Realizacje dla firm w <strong className="text-neutral-200">Kołobrzegu</strong> i{" "}
            <strong className="text-neutral-200">Koszalinie</strong> oraz online — spotkania możliwe po uzgodnieniu.
          </p>
        </div>
      </section>

      <section className="px-4 py-20 lg:px-6" aria-labelledby="lista-uslug">
        <div className="mx-auto max-w-6xl">
          <h2 id="lista-uslug" className="text-3xl font-bold text-white sm:text-4xl">
            Poznaj ofertę
          </h2>
          <p className="mt-4 max-w-2xl text-neutral-400">
            Każdą usługę dostosowuję do Twojej branży, budżetu i harmonogramu. Poniżej skrót — szczegóły ustalamy na
            konsultacji.
          </p>
          <div className="mt-14 space-y-16">
            {services.map((s) => (
              <article
                key={s.title}
                className="grid gap-8 border-b border-white/10 pb-16 last:border-0 last:pb-0 lg:grid-cols-[auto_1fr]"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-odart-accent/40 bg-odart-accent/10">
                  <s.icon className="h-7 w-7 text-odart-accent" aria-hidden />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{s.title}</h3>
                  <p className="mt-2 text-lg text-odart-accent">{s.lead}</p>
                  <p className="mt-4 text-neutral-400 leading-relaxed">{s.body}</p>
                  <Link
                    href={`${SITE}${s.href}`}
                    className="mt-6 inline-flex items-center text-sm font-semibold text-odart-accent hover:text-orange-300"
                  >
                    Więcej
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-gradient-to-br from-neutral-950/50 to-black px-4 py-20 lg:px-6">
        <div className="mx-auto max-w-6xl lg:grid lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="text-3xl font-bold text-white">Kontakt</h2>
            <p className="mt-4 text-neutral-400">Napisz lub zadzwoń — umówimy krótką rozmowę o projekcie.</p>
            <ul className="mt-8 space-y-4 text-neutral-300">
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-odart-accent" aria-hidden />
                <a href="tel:+48695432415" className="hover:text-white">
                  +48 695 432 415
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-odart-accent" aria-hidden />
                <a href="mailto:biuro@odart.pl" className="hover:text-white">
                  biuro@odart.pl
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 shrink-0 text-odart-accent mt-0.5" aria-hidden />
                Kołobrzeg
              </li>
            </ul>
          </div>
          <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.02] p-8 lg:mt-0">
            <p className="text-sm font-medium text-white">Formularz kontaktowy</p>
            <p className="mt-2 text-sm text-neutral-500">Pełny formularz z wyborem typu projektu znajdziesz na stronie Kontakt.</p>
            <Link
              href={`${SITE}/kontakt/`}
              className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-odart-accent py-3 font-semibold text-white hover:brightness-110"
            >
              Przejdź do formularza
            </Link>
          </div>
        </div>
      </section>
    </OdartPublicShell>
  );
}
