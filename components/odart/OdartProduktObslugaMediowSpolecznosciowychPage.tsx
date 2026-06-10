import Link from "next/link";
import { BarChart3, ChevronRight, Megaphone, Share2 } from "lucide-react";
import { ODART_SITE_URL, ODART_PORTFOLIO_URL } from "@/lib/odartSite";
import { OdartPublicShell } from "@/components/odart/OdartPublicShell";

const SITE = ODART_SITE_URL;
const CANONICAL = `${SITE}/produkt/obsluga-mediow-spolecznosciowych/`;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${CANONICAL}#webpage`,
      url: CANONICAL,
      name: "Obsługa mediów społecznościowych | ODART",
      description:
        "Strategia social media, prowadzenie profili, treści, harmonogram, community management, kampanie i raporty. Kołobrzeg.",
      isPartOf: { "@id": `${SITE}/#website` },
      inLanguage: "pl-PL",
    },
    {
      "@type": "Service",
      "@id": `${CANONICAL}#service`,
      name: "Obsługa mediów społecznościowych",
      serviceType: "Social media marketing i komunikacja",
      provider: { "@id": `${SITE}/#org` },
      areaServed: { "@type": "City", name: "Kołobrzeg" },
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

const offerings: { title: string; body: string }[] = [
  {
    title: "Strategia social media",
    body:
      "Spersonalizowana strategia mediów społecznościowych z uwzględnieniem celów biznesowych, grupy docelowej i charakteru marki.",
  },
  {
    title: "Zarządzanie kontami",
    body:
      "Profesjonalne prowadzenie profili m.in. na Facebooku, Instagramie, X (Twitterze), LinkedIn i innych platformach.",
  },
  {
    title: "Kreacja treści",
    body:
      "Angażujące treści: posty, grafiki, filmy i infografiki, które przyciągają uwagę i budują zaangażowanie.",
  },
  {
    title: "Planowanie grafiku",
    body:
      "Harmonogram publikacji dopasowany do momentów, w których Twoja grupa docelowa jest najbardziej aktywna.",
  },
  {
    title: "Reakcje na bieżąco",
    body:
      "Monitoring aktywności, odpowiedzi na komentarze, pytania i opinie — utrzymanie pozytywnej interakcji z odbiorcami.",
  },
  {
    title: "Konkursy i kampanie",
    body:
      "Konkursy, kampanie reklamowe i wydarzenia online zwiększające zaangażowanie i zainteresowanie marką.",
  },
  {
    title: "Analiza danych",
    body:
      "Analiza wyników, śledzenie trendów i korekta strategii na podstawie zebranych danych.",
  },
];

const processSteps: { title: string; body: string }[] = [
  {
    title: "Konsultacja",
    body:
      "Zaczynam od rozmowy o celach biznesowych i oczekiwanych efektach działań w mediach społecznościowych.",
  },
  {
    title: "Analiza konkurencji",
    body:
      "Przegląd konkurencji — mocne i słabe strony — jako baza pod unikalną strategię.",
  },
  {
    title: "Planowanie strategii",
    body:
      "Wybór platform, rodzajów treści i planu publikacji dopasowany do marki.",
  },
  {
    title: "Realizacja planu",
    body: "Wdrożenie strategii, zarządzanie treściami i bieżący monitoring aktywności.",
  },
  {
    title: "Optymalizacja",
    body:
      "Dostosowanie działań do trendów i preferencji odbiorców na podstawie analiz.",
  },
  {
    title: "Raportowanie",
    body: "Regularne raporty z efektów kampanii — konkretne wyniki i wskaźniki.",
  },
];

export function OdartProduktObslugaMediowSpolecznosciowychPage() {
  return (
    <OdartPublicShell activeNav="uslugi" jsonLd={jsonLd}>
      <article className="border-b border-white/10 px-4 py-10 lg:px-6 lg:py-14">
        <div className="mx-auto max-w-3xl">
          <nav className="text-sm text-neutral-500" aria-label="Ścieżka nawigacji">
            <Link href={`${SITE}/`} className="hover:text-odart-accent">
              Strona główna
            </Link>
            <span className="mx-2 text-neutral-600">/</span>
            <span className="text-neutral-400">Media społecznościowe</span>
            <span className="mx-2 text-neutral-600">/</span>
            <span className="text-neutral-300">Obsługa mediów społecznościowych</span>
          </nav>

          <p className="mt-8 text-sm font-medium uppercase tracking-wide text-odart-accent">Usługa</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Obsługa mediów społecznościowych
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-neutral-300">
            W dynamicznym świecie mediów społecznościowych skuteczna obecność online to kluczowy element budowy marki i
            kontaktu z odbiorcami. Oferuję kompleksowe wsparcie, dzięki któremu Twoja firma może sprawnie komunikować się,
            budować zaangażowanie i pozyskiwać klientów w przestrzeni cyfrowej.{" "}
            <Link href={`${SITE}/kontakt/`} className="font-semibold text-odart-accent hover:text-orange-300">
              Porozmawiajmy o social media
            </Link>
            .
          </p>
          <p className="mt-4 text-sm text-neutral-500">
            Kategoria: <span className="text-neutral-400">Media społecznościowe</span>
          </p>
        </div>
      </article>

      <section className="border-b border-white/10 px-4 py-12 lg:px-6 lg:py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Opis</h2>
          <div className="prose prose-invert prose-p:text-neutral-400 prose-li:text-neutral-400 prose-strong:text-neutral-200 mt-8 max-w-none">
            <p>
              Skuteczna obecność online jest kluczowym elementem budowania marki i nawiązywania kontaktu z grupą
              docelową. Obsługa mediów społecznościowych obejmuje kompleksowe wsparcie, które pomaga firmie efektywnie
              komunikować się, budować zaangażowanie i pozyskiwać nowych klientów w przestrzeni cyfrowej.
            </p>

            <h3 className="mt-12 text-xl font-bold text-white">Co oferuję</h3>
            <ul className="mt-6 list-disc space-y-4 pl-6 marker:text-odart-accent">
              {offerings.map((item) => (
                <li key={item.title} className="pl-1">
                  <strong className="text-neutral-200">{item.title}</strong>
                  <span className="text-neutral-400"> — {item.body}</span>
                </li>
              ))}
            </ul>

            <h3 className="mt-14 text-xl font-bold text-white">Proces</h3>
            <ol className="mt-6 list-decimal space-y-5 pl-6 marker:text-odart-accent">
              {processSteps.map((step) => (
                <li key={step.title} className="pl-2">
                  <strong className="text-neutral-200">{step.title}</strong>
                  <span className="text-neutral-400"> — {step.body}</span>
                </li>
              ))}
            </ol>

            <p className="mt-12 text-neutral-400">
              Z odpowiednim prowadzeniem profili Twoja marka zyska widoczność i nawiąże interakcję z odbiorcami na
              platformach społecznościowych. Pomogę osiągnąć sukces online dzięki spójnej strategii i regularnej pracy nad
              kanałami.
            </p>

            <h3 className="mt-12 text-xl font-bold text-white">Przykłady realizacji</h3>
            <p className="text-neutral-400">
              M.in. filmy dla branży gastronomicznej, kompleksowa obsługa social media oraz montaż materiałów wideo —{" "}
              <Link href={ODART_PORTFOLIO_URL} className="text-odart-accent hover:text-orange-300">
                portfolio
              </Link>
              .
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6 marker:text-neutral-600 text-neutral-400">
              <li>Film dla restauracji</li>
              <li>Media społecznościowe — ogólnie</li>
              <li>Montaż filmów</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 px-4 py-12 lg:px-6 lg:py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Powiązane</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <Link
              href={`${SITE}/pozycjonowanie-seo/`}
              className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-odart-accent/40"
            >
              <BarChart3 className="h-8 w-8 text-odart-accent" aria-hidden />
              <h3 className="mt-4 text-lg font-bold text-white group-hover:text-orange-300">SEO i widoczność</h3>
              <p className="mt-2 text-sm text-neutral-400">Pozycjonowanie uzupełniające social media.</p>
              <span className="mt-4 inline-flex items-center text-sm font-semibold text-odart-accent">
                Zobacz
                <ChevronRight className="ml-1 h-4 w-4" aria-hidden />
              </span>
            </Link>
            <Link
              href={`${SITE}/uslugi/`}
              className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-odart-accent/40"
            >
              <Megaphone className="h-8 w-8 text-odart-accent" aria-hidden />
              <h3 className="mt-4 text-lg font-bold text-white group-hover:text-orange-300">Usługi</h3>
              <p className="mt-2 text-sm text-neutral-400">Pełna oferta ODART — strony, IT, marketing.</p>
              <span className="mt-4 inline-flex items-center text-sm font-semibold text-odart-accent">
                Oferta
                <ChevronRight className="ml-1 h-4 w-4" aria-hidden />
              </span>
            </Link>
            <Link
              href={`${SITE}/kontakt/`}
              className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-odart-accent/40"
            >
              <Share2 className="h-8 w-8 text-odart-accent" aria-hidden />
              <h3 className="mt-4 text-lg font-bold text-white group-hover:text-orange-300">Kontakt</h3>
              <p className="mt-2 text-sm text-neutral-400">Wycena i ustalenie zakresu współpracy.</p>
              <span className="mt-4 inline-flex items-center text-sm font-semibold text-odart-accent">
                Napisz
                <ChevronRight className="ml-1 h-4 w-4" aria-hidden />
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 lg:px-6">
        <div className="mx-auto max-w-6xl rounded-2xl border border-odart-accent/30 bg-gradient-to-br from-neutral-900/80 to-black p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Social media pod Twoją markę</h2>
          <p className="mt-4 max-w-2xl text-neutral-400 leading-relaxed">
            Napisz, czym się zajmujesz i na jakich platformach chcesz być obecny — zaproponuję zakres i harmonogram prac.
          </p>
          <Link
            href={`${SITE}/kontakt/`}
            className="mt-8 inline-flex items-center rounded-lg bg-odart-accent px-8 py-3.5 font-semibold text-white hover:brightness-110"
          >
            Kontakt
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
              <p className="mt-2 text-lg text-neutral-300">Kołobrzeg</p>
            </div>
          </div>
        </div>
      </section>
    </OdartPublicShell>
  );
}
