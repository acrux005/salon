import Link from "next/link";
import { HeaderPortal } from "@/components/portal/HeaderPortal";
import { FooterPortal } from "@/components/portal/FooterPortal";

const sections = [
  {
    id: 1,
    title: "Informacje ogólne",
    content: (
      <>
        <p>
          Niniejsza Polityka prywatności określa zasady przetwarzania danych osobowych użytkowników
          korzystających z serwisu internetowego salon.odart.pl.
        </p>
        <p>
          Serwis umożliwia użytkownikom wyszukiwanie zabiegów kosmetycznych, dopasowanie usług do
          problemów skóry oraz kontakt z gabinetami kosmetycznymi oferującymi wybrane usługi.
        </p>
        <p className="font-semibold">Administratorem danych osobowych jest:</p>
        <p className="mt-2">
          ODART Rafał Kowalkowski
          <br />
          ul. Makowskiego 3
          <br />
          78-100 Kołobrzeg
          <br />
          NIP: 5791020696
        </p>
        <p className="mt-4">
          Kontakt w sprawach dotyczących danych osobowych:
          <br />
          e-mail:{" "}
          <a href="mailto:biuro@odart.pl" className="text-beauty-rose hover:underline">
            biuro@odart.pl
          </a>
          <br />
          tel.: 695 432 415
        </p>
      </>
    ),
  },
  {
    id: 2,
    title: "Zakres zbieranych danych",
    content: (
      <>
        <p>Podczas korzystania z serwisu mogą być zbierane następujące dane osobowe:</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>imię i nazwisko</li>
          <li>numer telefonu</li>
          <li>adres e-mail</li>
          <li>informacje dotyczące wybranego zabiegu lub problemu skóry</li>
          <li>preferowany termin wizyty</li>
          <li>adres IP</li>
          <li>dane techniczne dotyczące urządzenia i przeglądarki</li>
        </ul>
        <p className="mt-4">
          Podanie danych jest dobrowolne, jednak może być niezbędne do skorzystania z funkcji
          kontaktu z gabinetem lub rezerwacji wizyty.
        </p>
      </>
    ),
  },
  {
    id: 3,
    title: "Cele przetwarzania danych",
    content: (
      <>
        <p>Dane osobowe przetwarzane są w celu:</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>umożliwienia kontaktu pomiędzy użytkownikiem a wybranym gabinetem</li>
          <li>przekazania zapytania o zabieg lub wizytę do gabinetu</li>
          <li>obsługi zapytań użytkowników</li>
          <li>poprawy działania serwisu</li>
          <li>prowadzenia statystyk oraz analizy ruchu na stronie</li>
          <li>zapewnienia bezpieczeństwa usług</li>
        </ul>
        <p className="mt-4 font-semibold">Podstawą prawną przetwarzania danych jest:</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>
            art. 6 ust. 1 lit. b RODO – realizacja działań na żądanie użytkownika przed zawarciem
            umowy
          </li>
          <li>
            art. 6 ust. 1 lit. f RODO – prawnie uzasadniony interes administratora polegający na
            prowadzeniu i rozwoju serwisu
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 4,
    title: "Przekazywanie danych do gabinetów",
    content: (
      <>
        <p>
          W przypadku wysłania zapytania o zabieg lub wizytę dane użytkownika mogą zostać przekazane
          do gabinetu kosmetycznego wybranego przez użytkownika.
        </p>
        <p>
          Gabinet otrzymuje dane wyłącznie w zakresie niezbędnym do kontaktu z użytkownikiem i
          realizacji zapytania.
        </p>
        <p>
          Gabinet staje się odrębnym administratorem danych osobowych w zakresie dalszego
          przetwarzania danych związanych z realizacją usługi lub wizyty.
        </p>
      </>
    ),
  },
  {
    id: 5,
    title: "Odbiorcy danych",
    content: (
      <>
        <p>Dane osobowe mogą być przekazywane:</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>gabinetom kosmetycznym wybranym przez użytkownika</li>
          <li>dostawcom hostingu i infrastruktury IT</li>
          <li>podmiotom świadczącym usługi techniczne związane z utrzymaniem serwisu</li>
        </ul>
        <p>
          Podmioty te przetwarzają dane wyłącznie w zakresie niezbędnym do świadczenia usług na
          rzecz administratora.
        </p>
      </>
    ),
  },
  {
    id: 6,
    title: "Okres przechowywania danych",
    content: (
      <>
        <p>Dane osobowe przechowywane są przez okres:</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>niezbędny do obsługi zapytania lub kontaktu z gabinetem</li>
          <li>wynikający z przepisów prawa</li>
          <li>do czasu przedawnienia ewentualnych roszczeń</li>
        </ul>
      </>
    ),
  },
  {
    id: 7,
    title: "Prawa użytkownika",
    content: (
      <>
        <p>Użytkownik ma prawo do:</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>dostępu do swoich danych</li>
          <li>sprostowania danych</li>
          <li>usunięcia danych</li>
          <li>ograniczenia przetwarzania</li>
          <li>sprzeciwu wobec przetwarzania</li>
          <li>przenoszenia danych</li>
        </ul>
        <p>
          W celu realizacji powyższych praw użytkownik może skontaktować się z administratorem
          danych.
        </p>
        <p>
          Użytkownik ma również prawo wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych.
        </p>
      </>
    ),
  },
  {
    id: 8,
    title: "Pliki cookies",
    content: (
      <>
        <p>Serwis korzysta z plików cookies w celu:</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>zapewnienia prawidłowego działania strony</li>
          <li>zapamiętywania ustawień użytkownika</li>
          <li>prowadzenia statystyk odwiedzin</li>
        </ul>
        <p>
          Użytkownik może zarządzać plikami cookies w ustawieniach swojej przeglądarki
          internetowej.
        </p>
      </>
    ),
  },
  {
    id: 9,
    title: "Bezpieczeństwo danych",
    content: (
      <p>
        Administrator stosuje odpowiednie środki techniczne i organizacyjne zapewniające ochronę
        przetwarzanych danych osobowych przed nieuprawnionym dostępem, utratą lub nieuprawnionym
        ujawnieniem.
      </p>
    ),
  },
  {
    id: 10,
    title: "Zmiany polityki prywatności",
    content: (
      <>
        <p>
          Administrator zastrzega sobie prawo do wprowadzania zmian w niniejszej Polityce
          prywatności.
        </p>
        <p>Aktualna wersja dokumentu jest zawsze dostępna w serwisie salon.odart.pl.</p>
      </>
    ),
  },
];

export function SalonPolitykaPrywatnosciPage() {
  return (
    <div className="min-h-screen bg-white">
      <HeaderPortal />
      <main className="py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-[var(--font-serif)] text-3xl font-normal text-beauty-charcoal sm:text-4xl">
            Polityka prywatności serwisu salon.odart.pl
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
            <Link href="/" className="font-[var(--font-sans)] text-beauty-rose hover:underline">
              ← Wróć na stronę główną
            </Link>
          </p>
        </div>
      </main>
      <FooterPortal />
    </div>
  );
}
