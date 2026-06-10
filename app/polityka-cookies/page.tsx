import Link from "next/link";
import { HeaderPortal } from "@/components/portal/HeaderPortal";
import { FooterPortal } from "@/components/portal/FooterPortal";

const SITE_URL = "https://salon.odart.pl";

export const metadata = {
  title: "Polityka cookies | Salon Odart",
  description:
    "Zasady stosowania plików cookies w serwisie salon.odart.pl. Cookies techniczne, statystyki, zarządzanie ustawieniami.",
  alternates: { canonical: `${SITE_URL}/polityka-cookies` },
  openGraph: {
    title: "Polityka cookies | Salon Odart",
    description: "Zasady stosowania plików cookies w serwisie salon.odart.pl.",
    url: `${SITE_URL}/polityka-cookies`,
    type: "website",
    locale: "pl_PL",
  },
};

const sections = [
  {
    id: 1,
    title: "Czym są pliki cookies",
    content: (
      <p>
        Pliki cookies (ciasteczka) to niewielkie pliki tekstowe zapisywane na urządzeniu
        użytkownika podczas przeglądania stron internetowych. Służą do zapamiętywania
        informacji niezbędnych do prawidłowego działania serwisu lub ułatwienia korzystania
        z niego.
      </p>
    ),
  },
  {
    id: 2,
    title: "Rodzaje cookies stosowanych w serwisie",
    content: (
      <>
        <ul className="list-inside list-disc space-y-1">
          <li>
            <strong>Cookies techniczne (niezbędne)</strong> — umożliwiają podstawowe działanie
            strony (np. sesja, nawigacja, zachowanie ustawień). Bez nich serwis nie może działać
            poprawnie.
          </li>
          <li>
            <strong>Cookies analityczne / statystyczne</strong> — służą do zliczania odwiedzin,
            analizy ruchu oraz poprawy działania serwisu. Mogą być udostępniane dostawcom
            narzędzi analitycznych (np. Google Analytics).
          </li>
          <li>
            <strong>Cookies funkcjonalne</strong> — zapamiętują preferencje użytkownika
            (np. wybór języka, zapisane filtry).
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 3,
    title: "Zarządzanie cookies",
    content: (
      <>
        <p>
          Użytkownik może zarządzać plikami cookies w ustawieniach swojej przeglądarki
          internetowej — blokować, usuwać lub ograniczać ich zapisywanie.
        </p>
        <p className="mt-3">
          Ograniczenie lub wyłączenie cookies może wpłynąć na działanie niektórych funkcji
          serwisu.
        </p>
        <p className="mt-3">
          Szczegółowe informacje o cookies oraz przetwarzaniu danych osobowych znajdują się w{" "}
          <Link href="/polityka-prywatnosci" className="text-beauty-rose hover:underline">
            Polityce prywatności
          </Link>
          .
        </p>
      </>
    ),
  },
  {
    id: 4,
    title: "Zmiany polityki cookies",
    content: (
      <p>
        Operator serwisu zastrzega sobie prawo do wprowadzania zmian w niniejszej Polityce
        cookies. Aktualna wersja jest zawsze dostępna w serwisie salon.odart.pl.
      </p>
    ),
  },
];

export default function PolitykaCookiesPage() {
  return (
    <div className="min-h-screen bg-white">
      <HeaderPortal />
      <main className="py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-[var(--font-serif)] text-3xl font-normal text-beauty-charcoal sm:text-4xl">
            Polityka cookies serwisu salon.odart.pl
          </h1>

          <div className="mt-12 space-y-10">
            {sections.map(({ id, title, content }) => (
              <section key={id}>
                <h2 className="font-[var(--font-sans)] text-xl font-semibold text-beauty-charcoal">
                  {id}. {title}
                </h2>
                <div className="mt-4 space-y-3 font-[var(--font-sans)] text-[15px] leading-relaxed text-beauty-charcoal/90">
                  {content}
                </div>
              </section>
            ))}
          </div>

          <p className="mt-16 text-center">
            <Link
              href="/"
              className="font-[var(--font-sans)] text-beauty-rose hover:underline"
            >
              ← Wróć na stronę główną
            </Link>
          </p>
        </div>
      </main>
      <FooterPortal />
    </div>
  );
}
