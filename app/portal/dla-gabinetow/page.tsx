import Link from "next/link";
import { HeaderPortal } from "@/components/portal/HeaderPortal";
import { FooterPortal } from "@/components/portal/FooterPortal";
import { PORTAL_LOCALE } from "@/content/portalLocale";
import { ContactForm } from "./ContactForm";

const SITE_URL = "https://salon.odart.pl";
const CONTACT_EMAIL = "biuro@odart.pl";

export const metadata = {
  title: "gabinet kosmetyczny w Polsce – pozyskuj klientki przez Zabiegi Odart",
  description: `Zabiegi Odart to platforma dopasowania gabinetów kosmetycznych w Polsce. Klientki trafiają do Ciebie z konkretnym problemem skóry lub usługą — bez wojen cenowych, bez katalogu ogłoszeń. Dołącz gabinet.`,
  keywords: [
    "gabinet kosmetyczny Polska",
    "kosmetolog Polska",
    "marketing gabinetu kosmetycznego",
    "leady dla salonu beauty",
    "platforma dla gabinetów kosmetycznych",
    "Zabiegi Odart",
    "pozyskiwanie klientek salon kosmetyczny",
    "widoczność gabinetu w Google",
    "strona internetowa dla gabinetu kosmetycznego",
    "strona internetowa dla kosmetyczek",
  ].join(", "),
  alternates: {
    canonical: `${SITE_URL}/portal/dla-gabinetow`,
  },
  openGraph: {
    title: "Gabinet kosmetyczny w Polsce – pozyskuj klientki przez Zabiegi Odart",
    description: `Klientki trafiają do Ciebie z konkretnym problemem lub usługą. Bez wojen cenowych — dopasowanie jakości, nie reklama na ślepo.`,
    url: `${SITE_URL}/portal/dla-gabinetow`,
    type: "website",
    locale: "pl_PL",
  },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": `${SITE_URL}/portal/dla-gabinetow#service`,
      name: `Zabiegi Odart — platforma pozyskiwania klientek dla gabinetów kosmetycznych w Polsce`,
      description: `Zabiegi Odart dopasowuje klientki do gabinetów kosmetycznych na podstawie problemu skóry lub wybranej usługi. Gabinety otrzymują kwalifikowane leady — klientki z konkretnym problemem i budżetem.`,
      provider: {
        "@type": "Organization",
        name: "Zabiegi Odart",
        url: `${SITE_URL}/portal`,
      },
      areaServed: {
        "@type": "Country",
        name: "Polska",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Ile kosztuje dołączenie do Zabiegi Odart?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Model współpracy ustalamy indywidualnie — w zależności od zakresu i funkcji (profil, kalendarz, dodatkowa widoczność). Skontaktuj się z nami — odpowiemy w ciągu 24 godzin.",
          },
        },
        {
          "@type": "Question",
          name: "Jak szybko pojawię się w wynikach wyszukiwania na Zabiegi Odart?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Po rejestracji i akceptacji profilu gabinet jest widoczny dla klientek zwykle w ciągu 24–48 godzin. Kompletny profil ze specjalizacjami pojawia się wyżej w wynikach dopasowania.",
          },
        },
        {
          "@type": "Question",
          name: "Czym Zabiegi Odart różni się od Booksy lub Google Maps?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Zabiegi Odart to platforma dopasowania, nie katalog ani system rezerwacji. Klientka wybiera problem skóry lub usługę, a algorytm wskazuje gabinety, które faktycznie specjalizują się w danym zabiegu. Trafiają do Ciebie klientki z konkretną intencją — nie przypadkowi przeglądacze.",
          },
        },
        {
          "@type": "Question",
          name: "Czy muszę mieć system rezerwacji online?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Nie. Możesz przyjmować zapytania telefonicznie lub mailowo. Integracja z kalendarzem online jest opcjonalna.",
          },
        },
      ],
    },
  ],
};

const BENEFITS = [
  {
    icon: "🎯",
    title: "Kwalifikowane leady",
    body: `Klientka trafia do Ciebie z konkretnym problemem, wybraną usługą, określonym budżetem oraz miastem/regionem. To nie są osoby „rozglądające się" — to osoby gotowe na decyzję.`,
  },
  {
    icon: "📍",
    title: `Widoczność lokalna w Google`,
    body: `Wspieramy SEO lokalne pod frazy typu „gabinet kosmetyczny + miasto” oraz landingi dla głównych miast — bez konieczności budowania całej infrastruktury contentowej od zera.`,
  },
  {
    icon: "🏆",
    title: "Wyżej dzięki specjalizacji",
    body: "W Zabiegi Odart nie wygrywa najniższa cena. Im dokładniej określisz specjalizacje, typy zabiegów i problemy — tym wyżej pojawiasz się w dopasowaniu. Jakość i precyzja mają znaczenie.",
  },
  {
    icon: "🚫",
    title: "Bez wojen cenowych",
    body: "Nie musisz obniżać cen, by konkurować z 50 salonami. Klientki wybierają gabinet dopasowany do ich potrzeb, z realnym doświadczeniem i jasno określoną specjalizacją.",
  },
  {
    icon: "🖼️",
    title: "Profesjonalny profil gabinetu",
    body: "Każdy gabinet otrzymuje własną stronę z opisem działalności, listą zabiegów, cenami, specjalizacjami, zdjęciami, danymi kontaktowymi i możliwością rezerwacji lub zapytania.",
  },
  {
    icon: "📊",
    title: "Panel gabinetu",
    body: "Edytuj profil, zarządzaj zabiegami, aktualizuj specjalizacje, obsługuj zapytania i korzystaj z kalendarza — wszystko w jednym miejscu, dostępne po zalogowaniu.",
  },
];

const STEPS = [
  {
    n: "1",
    title: "Rejestrujesz gabinet",
    body: `Tworzysz profil: nazwa, miasto, opis, specjalizacje, zabiegi. Wypełnienie zajmuje ok. 10 minut.`,
  },
  {
    n: "2",
    title: "Określasz swoją specjalizację",
    body: `Wskazujesz, z jakimi problemami lub usługami pracujesz najlepiej: trądzik dorosłych, przebarwienia, anti-aging, masaże terapeutyczne, manicure hybrydowy, podologia, stylizacja brwi i rzęs. Im dokładniej określisz zakres — tym lepsze dopasowanie.`,
  },
  {
    n: "3",
    title: "Klientki trafiają do Ciebie",
    body: `Algorytm wyświetla Twój gabinet osobom w całej Polsce, które szukają dokładnie tego, co oferujesz. To dopasowanie — nie przypadek.`,
  },
];

const FAQS = [
  {
    q: "Ile kosztuje dołączenie?",
    a: `Model współpracy ustalamy indywidualnie — w zależności od zakresu i funkcji (profil, kalendarz, dodatkowa widoczność). Skontaktuj się z nami — odpowiemy w ciągu 24 godzin.`,
  },
  {
    q: "Jak szybko będę widoczna/widoczny?",
    a: "Po rejestracji i akceptacji profilu — zwykle w ciągu 24–48 h. Kompletny profil ze specjalizacjami pojawia się wyżej w dopasowaniu.",
  },
  {
    q: "Czy muszę mieć system rezerwacji online?",
    a: "Nie. Możesz przyjmować zapytania telefonicznie lub mailowo. Kalendarz online jest opcjonalny.",
  },
  {
    q: `Jakie gabinety mogą dołączyć?`,
    a: `Gabinety kosmetyczne, medycyny estetycznej, salony urody, podologiczne, masażu i fryzjerskie działające w Polsce. Warunek: konkretna specjalizacja i jakość obsługi.`,
  },
  {
    q: "Czym Zabiegi Odart różni się od Booksy i Google Maps?",
    a: "Zabiegi Odart to platforma dopasowania, nie katalog. Klientka wybiera problem lub usługę, algorytm wskazuje gabinety z realną specjalizacją. Trafiają do Ciebie klientki z konkretną intencją — nie przypadkowi przeglądacze.",
  },
];

export default function DlaGabinetowPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <HeaderPortal />
      <main>

        {/* ── HERO ── */}
        <section className="border-b border-neutral-200/60 bg-white py-16 lg:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <p className="mb-4 font-[var(--font-sans)] text-[13px] font-medium uppercase tracking-widest text-pink-500">
              Dla gabinetów w Polsce
            </p>
            <h1 className="font-[var(--font-serif)] text-3xl font-normal leading-tight text-[#1F1A1C] sm:text-4xl lg:text-[2.6rem]">
              Gabinet kosmetyczny w Polsce –<br className="hidden sm:block" />
              pozyskuj klientki przez Zabiegi Odart
            </h1>
            <div className="mt-6 max-w-2xl space-y-3 font-[var(--font-sans)] text-[16px] leading-relaxed text-[#6F5E64]">
              <p>
                Prowadzisz gabinet kosmetyczny w Polsce? Chcesz pozyskiwać klientki,
                które <strong className="font-semibold text-[#1F1A1C]">już wiedzą, czego potrzebują</strong> —
                zamiast przypadkowych osób przeglądających katalog?
              </p>
              <p>
                Zabiegi Odart to platforma dopasowania zabiegów i gabinetów kosmetycznych
                w całej Polsce. Łączymy realne potrzeby klientek z konkretną
                specjalizacją gabinetów.
              </p>
              <ul className="mt-2 space-y-1 text-[15px]">
                <li className="flex items-center gap-2"><span className="text-pink-400">✗</span> Nie jesteśmy kolejnym katalogiem ogłoszeń.</li>
                <li className="flex items-center gap-2"><span className="text-pink-400">✗</span> Nie promujemy najtańszych ofert.</li>
                <li className="flex items-center gap-2"><span className="text-emerald-500">✓</span> Dopasowujemy jakość do problemu.</li>
              </ul>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/portal/register"
                className="rounded-full bg-pink-600 px-6 py-3 font-[var(--font-sans)] text-[15px] font-medium text-white transition-all hover:bg-pink-700"
              >
                Dołącz gabinet — zarejestruj się
              </Link>
              <Link
                href="/portal/dla-gabinetow/panel"
                className="rounded-full border border-pink-200 px-5 py-3 font-[var(--font-sans)] text-[14px] font-medium text-pink-600 transition-colors hover:bg-pink-50"
              >
                Jak korzystać z panelu? (przewodnik)
              </Link>
              <a
                href="#jak-dziala"
                className="rounded-full border border-neutral-300 px-5 py-3 font-[var(--font-sans)] text-[14px] font-medium text-[#6F5E64] transition-colors hover:border-pink-200 hover:bg-pink-50 hover:text-pink-600"
              >
                Jak to działa?
              </a>
              <Link
                href="/strona-internetowa-dla-gabinetu-kosmetycznego"
                className="rounded-full border border-neutral-300 px-5 py-3 font-[var(--font-sans)] text-[14px] font-medium text-[#6F5E64] transition-colors hover:border-pink-200 hover:bg-pink-50 hover:text-pink-600"
              >
                Strona WWW dla gabinetu
              </Link>
            </div>
          </div>
        </section>

        {/* ── RYNEK ── */}
        <section className="border-b border-neutral-200/60 py-14 lg:py-18" style={{ background: "#F9F9FB" }}>
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-6 font-[var(--font-serif)] text-2xl font-normal text-[#1F1A1C] sm:text-3xl">
              Dlaczego gabinet kosmetyczny w Polsce potrzebuje dopasowania, a nie katalogu?
            </h2>
            <div className="space-y-4 font-[var(--font-sans)] text-[15px] leading-relaxed text-[#4a3f42]">
              <p>
                Rynek usług beauty w Polsce dynamicznie rośnie.
                Kosmetologia, manicure, masaże, medycyna estetyczna — konkurencja
                jest coraz większa, szczególnie w sezonie turystycznym.
              </p>
              <p>Większość klientek trafia do gabinetów przez Google Maps, Booksy lub katalogi ogłoszeń. Tam wygrywa cena albo liczba opinii.</p>
              <p className="font-semibold text-[#1F1A1C]">Zabiegi Odart działa inaczej.</p>
              <p>Klientka zaczyna od problemu skóry (np. trądzik, przebarwienia, anti-aging) albo konkretnej usługi (np. manicure hybrydowy, masaż relaksacyjny). System dopasowuje ją do gabinetów w Polsce, które <em>rzeczywiście specjalizują się w danym obszarze</em>.</p>
              <p>To oznacza: mniej przypadkowych zapytań, więcej świadomych klientek, większą skuteczność rezerwacji.</p>
            </div>
          </div>
        </section>

        {/* ── CO ZYSKUJESZ ── */}
        <section className="border-b border-neutral-200/60 py-16 lg:py-20" style={{ background: "#FFF8FB" }}>
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-3 text-center font-[var(--font-serif)] text-2xl font-normal text-[#1F1A1C] sm:text-3xl">
              Co zyskuje Twój gabinet kosmetyczny?
            </h2>
            <p className="mx-auto mb-12 max-w-xl text-center font-[var(--font-sans)] text-[15px] text-[#6F5E64]">
              Więcej niż reklama — dopasowanie i jakość.
            </p>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {BENEFITS.map((b) => (
                <div
                  key={b.title}
                  className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
                >
                  <span className="text-2xl" aria-hidden>{b.icon}</span>
                  <h3 className="mt-3 font-[var(--font-sans)] text-[16px] font-semibold text-[#1F1A1C]">
                    {b.title}
                  </h3>
                  <p className="mt-2 font-[var(--font-sans)] text-[14px] leading-relaxed text-[#6F5E64]">
                    {b.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FUNKCJE PANELU ── */}
        <section className="border-b border-neutral-200/60 py-14 lg:py-16" style={{ background: "#F0F9F4" }}>
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-3 font-[var(--font-serif)] text-2xl font-normal text-[#1F1A1C] sm:text-3xl">
              Co oferuje panel gabinetu?
            </h2>
            <p className="mb-10 font-[var(--font-sans)] text-[15px] text-[#6F5E64]">
              Kalendarz, rezerwacje, przypomnienia i więcej — w jednym miejscu.
            </p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {[
                "Kalendarz rezerwacji",
                "Przypomnienia e-mail do klientów 24h przed wizytą",
                "Lista oczekujących — powiadom klienta, gdy zwolni się termin",
                "Potwierdzenie przyjścia — klient klika link z maila, mniej no-show",
                "Opinie po wizycie — automatyczny e-mail z prośbą o opinię",
                "Ulubione gabinety — klient zapisuje Cię i wraca do rezerwacji",
                "Eksport do kalendarza (.ics) — klient dodaje wizytę do Google/Outlook",
                "Wiadomości z klientami w jednej skrzynce",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 font-[var(--font-sans)] text-[15px] text-[#2d2629]"
                >
                  <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── JAK DZIAŁA WSPÓŁPRACA ── */}
        <section id="jak-dziala" className="border-b border-neutral-200/60 bg-white py-16 lg:py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-3 font-[var(--font-serif)] text-2xl font-normal text-[#1F1A1C] sm:text-3xl">
              Jak działa współpraca z Zabiegi Odart?
            </h2>
            <p className="mb-12 max-w-xl font-[var(--font-sans)] text-[15px] text-[#6F5E64]">
              Trzy kroki od rejestracji do pierwszych klientek z dopasowaniem.
            </p>
            <ol className="space-y-8">
              {STEPS.map((s) => (
                <li key={s.n} className="flex gap-6">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-[var(--font-sans)] text-[15px] font-semibold text-white"
                    style={{ background: "#e8789e" }}
                    aria-hidden
                  >
                    {s.n}
                  </span>
                  <div>
                    <h3 className="font-[var(--font-sans)] text-[16px] font-semibold text-[#1F1A1C]">
                      {s.title}
                    </h3>
                    <p className="mt-1 font-[var(--font-sans)] text-[14px] leading-relaxed text-[#6F5E64]">
                      {s.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── DLA KOGO ── */}
        <section className="border-b border-neutral-200/60 py-16 lg:py-20" style={{ background: "#F9F9FB" }}>
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-4 font-[var(--font-serif)] text-2xl font-normal text-[#1F1A1C] sm:text-3xl">
              Dla jakich gabinetów w Polsce?
            </h2>
            <p className="mb-8 max-w-2xl font-[var(--font-sans)] text-[15px] leading-relaxed text-[#6F5E64]">
              Zabiegi Odart to platforma dla gabinetów z konkretną specjalizacją — nie dla wszystkich po trochu.
              Działamy w całej Polsce – od największych miast po lokalne miejscowości.
            </p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {[
                "Gabinety kosmetyczne i kosmetologii estetycznej",
                "Gabinety medycyny estetycznej",
                "Salony manicure i pedicure",
                "Gabinety podologiczne",
                "Salony masażu i SPA",
                "Salony depilacji laserowej i woskiem",
                "Gabinety stylizacji brwi i rzęs",
                "Salony fryzjerskie",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 font-[var(--font-sans)] text-[15px] text-[#2d2629]"
                >
                  <span className="h-2 w-2 shrink-0 rounded-full bg-pink-400" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── BEZ WOJNY CENOWEJ ── */}
        <section className="border-b border-neutral-200/60 bg-white py-16 lg:py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-6 font-[var(--font-serif)] text-2xl font-normal text-[#1F1A1C] sm:text-3xl">
              Gabinet kosmetyczny w Polsce – jak zdobywać klientki bez wojny cenowej?
            </h2>
            <p className="mb-6 font-[var(--font-sans)] text-[15px] leading-relaxed text-[#4a3f42]">
              W lokalnym rynku beauty wygrywają dziś trzy rzeczy:
            </p>
            <ol className="mb-8 space-y-3">
              {["Specjalizacja", "Widoczność w Google", "Intencja klientki"].map((item, i) => (
                <li key={item} className="flex items-center gap-4 font-[var(--font-sans)] text-[15px] text-[#1F1A1C]">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pink-100 font-semibold text-pink-600 text-[14px]">
                    {i + 1}
                  </span>
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ol>
            <p className="mb-4 font-[var(--font-sans)] text-[15px] leading-relaxed text-[#4a3f42]">
              Zabiegi Odart łączy te trzy elementy. Zamiast inwestować wyłącznie w reklamy, możesz budować:
            </p>
            <ul className="mb-6 space-y-2">
              {[
                "stabilne źródło zapytań",
                "rozpoznawalność specjalizacji",
                "lepszą jakość klientek",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 font-[var(--font-sans)] text-[15px] text-[#4a3f42]">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-pink-400" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
            <p className="font-[var(--font-sans)] text-[15px] leading-relaxed text-[#6F5E64]">
              To rozwiązanie dla gabinetów, które chcą rozwijać się długofalowo — nie walczyć rabatami.
            </p>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section id="wspolpraca" className="border-b border-neutral-200/60 py-16 lg:py-20" style={{ background: "#F9F9FB" }}>
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-10 font-[var(--font-serif)] text-2xl font-normal text-[#1F1A1C] sm:text-3xl">
              Najczęstsze pytania gabinetów
            </h2>
            <dl className="space-y-8">
              {FAQS.map((faq) => (
                <div key={faq.q} className="border-b border-neutral-200 pb-8 last:border-0 last:pb-0">
                  <dt className="font-[var(--font-sans)] text-[16px] font-semibold text-[#1F1A1C]">
                    {faq.q}
                  </dt>
                  <dd className="mt-2 font-[var(--font-sans)] text-[15px] leading-relaxed text-[#6F5E64]">
                    {faq.a}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── CTA / FORMULARZ KONTAKTOWY ── */}
        <section className="py-20 lg:py-28" style={{ background: "#FFF8FB" }}>
          <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 text-center">
              <h2 className="font-[var(--font-serif)] text-2xl font-normal text-[#1F1A1C] sm:text-3xl">
                Gotowy/a dołączyć do Zabiegi Odart?
              </h2>
              <p className="mx-auto mt-4 max-w-lg font-[var(--font-sans)] text-[15px] leading-relaxed text-[#6F5E64]">
                Jeśli prowadzisz gabinet kosmetyczny w Polsce i chcesz pozyskiwać klientki
                z konkretną intencją — dołącz do Zabiegi Odart. Napisz do nas, omówimy warunki.
                Możesz też od razu{" "}
                <Link href="/portal/register" className="font-medium text-pink-600 hover:underline">
                  zarejestrować gabinet
                </Link>
                .
              </p>
            </div>
            <ContactForm />
            <p className="mt-6 text-center font-[var(--font-sans)] text-[13px] text-neutral-400">
              Działamy w {PORTAL_LOCALE.regionLabel} — platforma jakościowa, nie katalog ogłoszeń.
            </p>
          </div>
        </section>

      </main>
      <FooterPortal />
    </>
  );
}
