import Link from "next/link";
import { HeaderPortal } from "@/components/portal/HeaderPortal";
import { FooterPortal } from "@/components/portal/FooterPortal";
import { ContactForm } from "@/app/portal/dla-gabinetow/ContactForm";
import { Check, Globe, Calendar, Search, Sparkles } from "lucide-react";

const SITE_URL = "https://salon.odart.pl";

type Props = {
  /** Np. „dla gabinetu kosmetycznego” / „dla kosmetyczek”. */
  audiencePhrase: string;
  /** Wariant H1 — domyślnie audiencePhrase. */
  h1Suffix?: string;
};

const FEATURES = [
  {
    icon: Globe,
    title: "Strona pod gabinet — nie szablon z branży budowlanej",
    text: "Projekt dopasowany do beauty: usługi, cennik zabiegów, zespół, galeria efektów, opinie i wyraźne wezwanie do rezerwacji.",
  },
  {
    icon: Search,
    title: "SEO lokalne: „gabinet kosmetyczny + miasto”",
    text: "Optymalizacja pod frazy, które wpisują klientki w Google — oraz integracja z profilem w Zabiegi Odart (osobne landingi miast).",
  },
  {
    icon: Calendar,
    title: "Rezerwacje i kontakt",
    text: "Formularz, telefon, mapa dojazdu — opcjonalnie powiązanie z kalendarzem w portalu Zabiegi Odart.",
  },
  {
    icon: Sparkles,
    title: "Połączenie ze Zabiegi Odart",
    text: "Profil w portalu + własna strona = więcej wejść z wyszukiwarki i dopasowanych klientek z platformy.",
  },
];

const FAQ = [
  {
    q: "Ile kosztuje strona internetowa dla gabinetu kosmetycznego?",
    a: "Wycena zależy od zakresu: wizytówka one-page, rozbudowany cennik zabiegów, blog, integracje. Podstawowe strony realizujemy już od ok. 1500 zł — po krótkiej rozmowie dostaniesz konkretną propozycję.",
  },
  {
    q: "Czy strona będzie widoczna w Google na „gabinet kosmetyczny” i moje miasto?",
    a: "Tak — konfigurujemy SEO techniczne i treści pod frazy lokalne. Dodatkowo profil w Zabiegi Odart wzmacnia widoczność na zapytania typu „gabinet kosmetyczny Koszalin” i podobne.",
  },
  {
    q: "Czy mogę mieć tylko profil w Zabiegi Odart bez osobnej strony?",
    a: "Tak — dołączenie do portalu jest osobną ścieżką. Strona WWW ma sens, gdy chcesz własną markę, blog, pełny cennik i niezależność od platformy.",
  },
  {
    q: "Kto robi strony — Salon Odart / Zabiegi Odart?",
    a: "Strony i aplikacje tworzy zespół ODART (Ostry Dyżur Artystyczny) — partner technologiczny Zabiegów Odart. Jeden kontakt: biuro@odart.pl.",
  },
];

export function BeautySalonWebsiteLanding({ audiencePhrase, h1Suffix }: Props) {
  const h1 = h1Suffix ?? audiencePhrase;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${SITE_URL}/strona-internetowa-dla-gabinetu-kosmetycznego#service`,
        name: `Strona internetowa ${audiencePhrase}`,
        description:
          "Projekt i wdrożenie strony WWW dla gabinetów kosmetycznych i salonów beauty — SEO lokalne, mobile, integracja z Zabiegi Odart.",
        provider: {
          "@type": "Organization",
          name: "ODART — Zabiegi Odart",
          url: SITE_URL,
        },
        areaServed: { "@type": "Country", name: "Polska" },
        offers: {
          "@type": "Offer",
          priceCurrency: "PLN",
          priceSpecification: {
            "@type": "PriceSpecification",
            minPrice: 1500,
            priceCurrency: "PLN",
          },
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HeaderPortal />
      <main className="bg-white">
        <section className="border-b border-neutral-200/60 bg-gradient-to-b from-pink-50/80 to-white py-16 lg:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <p className="font-[var(--font-sans)] text-[13px] font-semibold uppercase tracking-wider text-pink-600">
              Strony WWW · SEO · Zabiegi Odart
            </p>
            <h1 className="mt-4 max-w-3xl font-[var(--font-serif)] text-3xl font-medium leading-tight text-[#1F1A1C] sm:text-4xl lg:text-[2.75rem]">
              Strona internetowa {h1}
            </h1>
            <p className="mt-6 max-w-2xl font-[var(--font-sans)] text-[16px] leading-relaxed text-[#6F5E64]">
              Profesjonalna strona dla gabinetu lub salonu kosmetycznego — zoptymalizowana pod Google, telefon i
              rezerwacje. Łączymy ją z profilem w portalu{" "}
              <Link href="/portal" className="font-medium text-pink-600 hover:underline">
                Zabiegi Odart
              </Link>
              , żebyś był widoczny na zapytania typu „gabinet kosmetyczny” + Twoje miasto.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#wycena"
                className="inline-flex rounded-full bg-pink-500 px-6 py-3.5 font-[var(--font-sans)] text-[15px] font-medium text-white shadow-md hover:bg-pink-600"
              >
                Zapytaj o wycenę strony
              </a>
              <Link
                href="/portal/dla-gabinetow"
                className="inline-flex rounded-full border border-pink-300 px-6 py-3.5 font-[var(--font-sans)] text-[15px] font-medium text-pink-700 hover:bg-pink-50"
              >
                Dołącz do portalu (bez strony)
              </Link>
            </div>
          </div>
        </section>

        <section className="py-14 lg:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-[var(--font-serif)] text-2xl text-[#1F1A1C] sm:text-3xl">Co dostajesz?</h2>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2">
              {FEATURES.map(({ icon: Icon, title, text }) => (
                <li
                  key={title}
                  className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm"
                >
                  <Icon className="h-8 w-8 text-pink-500" aria-hidden />
                  <h3 className="mt-4 font-[var(--font-sans)] text-[17px] font-semibold text-[#1F1A1C]">{title}</h3>
                  <p className="mt-2 font-[var(--font-sans)] text-[14px] leading-relaxed text-[#6F5E64]">{text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-y border-neutral-200/60 bg-neutral-50/50 py-14">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-[var(--font-serif)] text-2xl text-[#1F1A1C]">Dla kogo?</h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                "Gabinet kosmetyczny i kosmetologia",
                "Salon kosmetyczny / beauty room",
                "Medycyna estetyczna (zabiegi nielekarskie)",
                "Podologia, manicure, brwi i rzęsy",
                "Masaż i SPA",
                "Fryzjer z częścią kosmetyczną",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 font-[var(--font-sans)] text-[15px] text-[#4a3f42]">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-pink-500" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-8 font-[var(--font-sans)] text-[15px] text-[#6F5E64]">
              Szukasz gabinetu w swoim mieście?{" "}
              <Link href="/portal/gabinety/koszalin" className="font-medium text-pink-600 hover:underline">
                Gabinet kosmetyczny Koszalin
              </Link>
              ,{" "}
              <Link href="/portal/gabinety/kolobrzeg" className="font-medium text-pink-600 hover:underline">
                Kołobrzeg
              </Link>
              ,{" "}
              <Link href="/portal/gabinety/warszawa" className="font-medium text-pink-600 hover:underline">
                Warszawa
              </Link>{" "}
              — pełna lista na{" "}
              <Link href="/portal/gabinety" className="font-medium text-pink-600 hover:underline">
                gabinety w Polsce
              </Link>
              .
            </p>
          </div>
        </section>

        <section id="wycena" className="py-14 lg:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <h2 className="font-[var(--font-serif)] text-2xl text-[#1F1A1C]">Bezpłatna wycena strony</h2>
                <p className="mt-4 font-[var(--font-sans)] text-[15px] leading-relaxed text-[#6F5E64]">
                  Opisz gabinet, miasto i czy potrzebujesz tylko wizytówki, czy też cennika zabiegów i bloga. Odpowiadamy
                  zwykle w 24 h na{" "}
                  <a href="mailto:biuro@odart.pl" className="text-pink-600 hover:underline">
                    biuro@odart.pl
                  </a>
                  .
                </p>
              </div>
              <ContactForm />
            </div>
          </div>
        </section>

        <section className="border-t border-neutral-200/60 bg-white py-14">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-[var(--font-serif)] text-2xl text-[#1F1A1C]">FAQ</h2>
            <dl className="mt-8 space-y-6">
              {FAQ.map((item) => (
                <div key={item.q}>
                  <dt className="font-[var(--font-sans)] text-[16px] font-semibold text-[#1F1A1C]">{item.q}</dt>
                  <dd className="mt-2 font-[var(--font-sans)] text-[15px] leading-relaxed text-[#6F5E64]">{item.a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      </main>
      <FooterPortal />
    </>
  );
}
