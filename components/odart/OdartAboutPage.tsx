import Link from "next/link";
import Image from "next/image";
import {
  ChevronRight,
  Sparkles,
  Headphones,
  Cpu,
  Globe,
  Server,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { ODART_SITE_URL } from "@/lib/odartSite";
import { OdartPublicShell } from "@/components/odart/OdartPublicShell";

const SITE = ODART_SITE_URL;
const CANONICAL = `${SITE}/o-mnie/`;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "@id": `${CANONICAL}#webpage`,
      url: CANONICAL,
      name: "O mnie | ODART — aplikacje webowe i strony WWW",
      isPartOf: { "@id": `${SITE}/#website` },
      inLanguage: "pl-PL",
    },
    {
      "@type": "Person",
      "@id": `${CANONICAL}#person`,
      name: "Rafał Kowalkowski",
      jobTitle: "Web developer, product manager",
      worksFor: { "@id": `${SITE}/#org` },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Kołobrzeg",
        addressCountry: "PL",
      },
    },
    {
      "@type": "Organization",
      "@id": `${SITE}/#org`,
      name: "ODART — Ostry Dyżur Artystyczny",
      url: SITE,
      email: "biuro@odart.pl",
      telephone: "+48695432415",
    },
  ],
};

const services = [
  {
    title: "Aplikacje webowe",
    subtitle: "React, Next.js, produkcja",
    desc: "Nowoczesne aplikacje na zamówienie — architektura, UX, TypeScript i wdrożenia pod realny ruch.",
    href: "/produkt/nowoczesne-aplikacje-webowe/",
  },
  {
    title: "Panele i systemy dla firm",
    subtitle: "Narzędzia operacyjne",
    desc: "Wewnętrzne panele: role, raporty, workflow — mniej ręcznego przepisywania, więcej kontroli.",
    href: "/produkt/panele-i-systemy-dla-firm/",
  },
  {
    title: "Integracje i API",
    subtitle: "Łączenie systemów",
    desc: "REST, webhooki, płatności i synchronizacja danych między sklepem, CRM a logistyką.",
    href: "/produkt/integracje-api-i-automatyzacja/",
  },
  {
    title: "Strona internetowa",
    subtitle: "Budowa strony internetowej",
    desc: "Tworzenie stron na WordPressie — profesjonalna, nowoczesna witryna odzwierciedlająca markę i przyciągająca uwagę online.",
    href: "/strony-internetowe/",
  },
  {
    title: "Migracja strony internetowej",
    subtitle: "Migracja strony internetowej",
    desc: "Przeniesienie WordPressa na nowe środowisko lub zmiana hostingu — płynnie i bez utraty danych.",
    href: "/produkt/migracja-strony-internetowej-na-inny-serwer/",
  },
  {
    title: "Przywracanie strony internetowej",
    subtitle: "WordPress po infekcji",
    desc: "Czyszczenie po malware, zabezpieczenie i przywrócenie pełnej sprawności witryny.",
    href: "/produkt/przywracanie-strony-internetowej-wordpress/",
  },
  {
    title: "Wycena strony internetowej",
    subtitle: "Wycena i zakres",
    desc: "Rozmowa o motywie, funkcjach, treściach i kosztach — zanim zaczniemy realizację.",
    href: "/produkt/wycena-strony-internetowej/",
  },
  {
    title: "SEO — optymalizacja strony",
    subtitle: "SEO",
    desc: "Optymalizacja treści, struktury i linków oraz audyt techniczny pod lepszą widoczność w Google.",
    href: "/produkt/seo-optymalizacja-strony/",
  },
  {
    title: "Obsługa mediów społecznościowych",
    subtitle: "Social media",
    desc: "Spójna komunikacja, grafiki i wsparcie w budowie zaangażowania online.",
    href: "/produkt/obsluga-mediow-spolecznosciowych/",
  },
];

export function OdartAboutPage() {
  return (
    <OdartPublicShell activeNav="o-mnie" jsonLd={jsonLd}>
      <section className="border-b border-white/10 bg-black">
        <div className="relative mx-auto max-w-6xl px-4 py-16 lg:py-20 lg:px-6">
          <div className="flex items-center gap-2 text-odart-accent">
            <Sparkles className="h-6 w-6" aria-hidden />
            <span className="text-sm font-medium uppercase tracking-wide">Usługi internetowe</span>
          </div>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">O mnie</h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-neutral-300">
            Projektuję i wdrażam aplikacje webowe oraz rozbudowane serwisy — od UX i architektury po kod produkcyjny,
            integracje i utrzymanie.
          </p>
          <div className="mt-10 flex flex-wrap items-end gap-8">
            <div>
              <p className="text-5xl font-bold text-white">18+</p>
              <p className="mt-1 text-sm text-neutral-500">lat doświadczenia</p>
            </div>
            <span className="text-neutral-600">·</span>
            <p className="text-sm font-medium text-neutral-400">O mnie</p>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-black px-4 py-16 lg:px-6">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,1fr)_1.15fr] lg:items-center">
          <div className="relative mx-auto aspect-[3/4] w-full max-w-md overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900 lg:mx-0">
            <Image
              src="https://odart.pl/wp-content/uploads/2026/02/odart._in_office_with_monitors_and_code_around_-ar_11_-styl_66ecffcf-aeef-478d-8736-270028d15204_3.jpg"
              alt="Rafał Kowalkowski — ODART"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 28rem"
              priority
            />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-12 shrink-0 bg-odart-accent" aria-hidden />
              <span className="text-sm font-medium uppercase tracking-wide text-odart-accent">O mnie</span>
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">Ponad 10 lat doświadczenia</h2>
            <div className="mt-8 max-w-none space-y-6 text-base leading-relaxed text-neutral-400">
              <p>
                Jestem product managerem, designerem i deweloperem. Od ponad dekady buduję produkty cyfrowe — od
                własnego start-upu, przez realizacje dla klientów, po pracę przy rozwiązaniach w{" "}
                <strong className="text-neutral-200">home.pl</strong>. Dobór technologii uzależniam od problemu: aplikacje
                i panele w <strong className="text-neutral-200">React / Next.js</strong>, integracje API, a gdy projekt
                wymaga treściowego CMS lub istniejącego ekosystemu — świadomie projektuję i wdrażam też{" "}
                <strong className="text-neutral-200">WordPress</strong> czy klasyczny stack (PHP, HTML/CSS).
              </p>
              <p>
                W 2008 roku założyłem portal <strong className="text-neutral-200">fotoferia</strong> — z czasem setki
                milionów odsłon i miliony użytkowników. Odpowiadałem za strategię produktu, procesy i rozwój zgodny z
                oczekiwaniami użytkowników.
              </p>
              <p className="font-semibold text-neutral-200">
                Produkt w sieci ma nie tylko wyglądać — ma działać, zbierać zapytania i być widoczny w Google.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 lg:px-6" aria-labelledby="zakres-pomoc">
        <div className="mx-auto max-w-6xl">
          <h2 id="zakres-pomoc" className="sr-only">
            Zakres pomocy
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Headphones, t: "Konsultacje", d: "Omówienie celów i technologii." },
              { icon: Cpu, t: "Wsparcie", d: "Po wdrożeniu — na uzgodnionych zasadach." },
              { icon: Globe, t: "WWW i CMS", d: "Od aplikacji na zamówienie po WordPress — dobór stacku pod cel." },
              { icon: Server, t: "Hosting", d: "Dopasowanie infrastruktury do projektu." },
            ].map((x) => (
              <div key={x.t} className="rounded-xl border border-neutral-800 bg-white/[0.02] p-5">
                <x.icon className="h-7 w-7 text-odart-accent" aria-hidden />
                <h3 className="mt-3 text-lg font-semibold text-white">{x.t}</h3>
                <p className="mt-1 text-sm text-neutral-500">{x.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-neutral-950/50 px-4 py-20 lg:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-sm font-medium uppercase tracking-wide text-odart-accent">Usługi</p>
          <h2 className="mt-2 text-center text-3xl font-bold text-white sm:text-4xl">Poznaj moje usługi</h2>
          <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <article
                key={s.title}
                className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.02] p-6"
              >
                <h3 className="text-lg font-semibold text-white">{s.title}</h3>
                <p className="mt-1 text-sm text-odart-accent">{s.subtitle}</p>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-neutral-400">{s.desc}</p>
                <Link
                  href={`${SITE}${s.href}`}
                  className="mt-6 inline-flex items-center text-sm font-semibold text-odart-accent hover:text-orange-300"
                >
                  Więcej
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link
              href={`${SITE}/uslugi/`}
              className="inline-flex items-center rounded-lg border border-white/10 px-6 py-3 font-semibold text-white hover:bg-neutral-800"
            >
              Wybierz moje usługi
              <ChevronRight className="ml-1 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 lg:px-6">
        <div className="mx-auto max-w-6xl lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
          <div>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">ODART — Ostry Dyżur Artystyczny</h2>
            <p className="mt-6 text-neutral-400 leading-relaxed">
              Pasjonuję się technologiami internetowymi; od lat specjalizuję się w WordPressie. Projekty łączą nowoczesny
              design, intuicyjne UX i wydajność. Wspieram klientów od planu i projektu po wdrożenie.
            </p>
            <div className="mt-10 space-y-6">
              {[
                { label: "Software development", v: 87 },
                { label: "Web development", v: 94 },
                { label: "UI / UX design", v: 83 },
              ].map((row) => (
                <div key={row.label}>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-300">{row.label}</span>
                    <span className="text-odart-accent">{row.v}%</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-800">
                    <div className="h-full rounded-full bg-odart-accent" style={{ width: `${row.v}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.02] p-8 lg:mt-0">
            <p className="text-lg font-semibold text-white">Rafał Kowalkowski</p>
            <p className="text-sm text-neutral-500">Web designer, photographer</p>
            <p className="mt-6 text-sm text-neutral-400 leading-relaxed">
              Jeśli szukasz partnera do strony firmowej, sklepu lub migracji — napisz lub zadzwoń. Kołobrzeg i praca
              zdalna z całą Polską.
            </p>
            <Link
              href={`${SITE}/kontakt/`}
              className="mt-8 inline-flex w-full items-center justify-center rounded-lg bg-odart-accent py-3 font-semibold text-white hover:brightness-110"
            >
              Kontakt
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 px-4 py-16 lg:px-6">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-medium uppercase tracking-wide text-odart-accent">Blog</p>
          <h2 className="mt-2 text-2xl font-bold text-white">Ostatnie wpisy</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              { t: "Realizacje", d: "Przegląd projektów i przykładów stron." },
              { t: "Zasady pozycjonowania SEO", d: "Słowa kluczowe, struktura i dobre praktyki." },
              { t: "Strona internetowa Koszalin", d: "Spotkania i realizacje w regionie." },
            ].map((post) => (
              <article key={post.t} className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
                <h3 className="font-semibold text-white">{post.t}</h3>
                <p className="mt-2 text-sm text-neutral-400">{post.d}</p>
                <Link href={`${SITE}/blog/`} className="mt-4 inline-block text-sm font-medium text-odart-accent hover:text-orange-300">
                  czytaj dalej →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-gradient-to-br from-neutral-950/50 to-black px-4 py-20 lg:px-6">
        <div className="mx-auto max-w-6xl lg:grid lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="text-3xl font-bold text-white">Kontakt i wycena</h2>
            <p className="mt-4 text-neutral-400">Formularz na stronie lub bezpośrednio przez e-mail i telefon.</p>
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
            <p className="text-sm font-medium text-white">Napisz wiadomość</p>
            <p className="mt-2 text-sm text-neutral-500">Pełny formularz z wyborem typu projektu jest na stronie Kontakt.</p>
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
