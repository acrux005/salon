import Link from "next/link";
import { HeaderPortal } from "@/components/portal/HeaderPortal";
import { FooterPortal } from "@/components/portal/FooterPortal";

const sections = [
  {
    id: 1,
    title: "Postanowienia ogólne",
    content: (
      <>
        <p>1. Niniejszy regulamin określa zasady korzystania z serwisu internetowego salon.odart.pl.</p>
        <p>
          2. Serwis umożliwia użytkownikom wyszukiwanie zabiegów kosmetycznych, zapoznanie się z ofertą gabinetów oraz
          kontakt z wybranym gabinetem w celu umówienia wizyty.
        </p>
        <p className="font-semibold">3. Operatorem serwisu jest:</p>
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
          e-mail:{" "}
          <a href="mailto:biuro@odart.pl" className="text-beauty-rose hover:underline">
            biuro@odart.pl
          </a>
          <br />
          tel.: 695 432 415
        </p>
        <p>4. Korzystanie z serwisu oznacza akceptację niniejszego regulaminu.</p>
      </>
    ),
  },
  {
    id: 2,
    title: "Definicje",
    content: (
      <>
        <p>Użyte w regulaminie pojęcia oznaczają:</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>
            <strong>Serwis</strong> – platforma internetowa salon.odart.pl
          </li>
          <li>
            <strong>Operator</strong> – właściciel i administrator serwisu
          </li>
          <li>
            <strong>Gabinet</strong> – przedsiębiorca oferujący usługi kosmetyczne prezentowane w serwisie
          </li>
          <li>
            <strong>Użytkownik</strong> – osoba korzystająca z serwisu
          </li>
          <li>
            <strong>Usługa</strong> – zabieg kosmetyczny oferowany przez gabinet
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 3,
    title: "Zakres usług serwisu",
    content: (
      <>
        <p>1. Serwis umożliwia:</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>przeglądanie informacji o zabiegach kosmetycznych</li>
          <li>zapoznanie się z ofertą gabinetów</li>
          <li>wysyłanie zapytań o zabieg lub wizytę</li>
          <li>uzyskanie rekomendacji zabiegów na podstawie wybranego problemu skóry</li>
        </ul>
        <p>2. Serwis ma charakter informacyjny i pośredniczący.</p>
        <p>3. Operator serwisu nie świadczy usług kosmetycznych ani medycznych.</p>
        <p>4. Operator nie jest stroną umowy pomiędzy użytkownikiem a gabinetem.</p>
      </>
    ),
  },
  {
    id: 4,
    title: "Rezerwacja wizyty",
    content: (
      <>
        <p>
          1. Użytkownik może wysłać zapytanie o zabieg lub wizytę do wybranego gabinetu za pośrednictwem formularza
          dostępnego w serwisie.
        </p>
        <p>
          2. Dane podane przez użytkownika mogą zostać przekazane do gabinetu w celu umożliwienia kontaktu i ustalenia
          terminu wizyty.
        </p>
        <p>
          3. Ostateczne ustalenie terminu wizyty oraz warunków realizacji usługi odbywa się bezpośrednio pomiędzy
          użytkownikiem a gabinetem.
        </p>
      </>
    ),
  },
  {
    id: 5,
    title: "Odpowiedzialność za usługi",
    content: (
      <>
        <p>1. Za realizację usług kosmetycznych odpowiada wyłącznie gabinet wykonujący usługę.</p>
        <p>2. Gabinet odpowiada w szczególności za:</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>jakość wykonywanych zabiegów</li>
          <li>kwalifikacje personelu</li>
          <li>bezpieczeństwo usług</li>
          <li>przestrzeganie przepisów sanitarnych</li>
        </ul>
        <p>3. Operator serwisu nie ponosi odpowiedzialności za:</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>przebieg wizyty w gabinecie</li>
          <li>efekty zabiegów</li>
          <li>termin realizacji wizyty</li>
          <li>jakość usług świadczonych przez gabinet</li>
        </ul>
        <p>
          4. Wszelkie reklamacje dotyczące usług należy kierować bezpośrednio do gabinetu wykonującego usługę.
        </p>
      </>
    ),
  },
  {
    id: 6,
    title: "Korzystanie z serwisu",
    content: (
      <>
        <p>
          1. Użytkownik zobowiązuje się do korzystania z serwisu w sposób zgodny z prawem oraz niniejszym regulaminem.
        </p>
        <p>2. Zabronione jest wykorzystywanie serwisu w sposób mogący zakłócić jego działanie.</p>
        <p>
          3. Operator zastrzega sobie prawo do czasowego ograniczenia dostępności serwisu w związku z pracami
          technicznymi.
        </p>
      </>
    ),
  },
  {
    id: 7,
    title: "Dane osobowe",
    content: (
      <>
        <p>
          1. Dane osobowe użytkowników przetwarzane są zgodnie z{" "}
          <Link href="/polityka-prywatnosci" className="text-beauty-rose hover:underline">
            Polityką prywatności serwisu
          </Link>
          .
        </p>
        <p>
          2. Dane mogą być przekazywane gabinetom wybranym przez użytkownika w celu umożliwienia kontaktu w sprawie
          wizyty.
        </p>
      </>
    ),
  },
  {
    id: 8,
    title: "Prawa autorskie",
    content: (
      <>
        <p>
          1. Wszystkie treści znajdujące się w serwisie, w tym teksty, grafiki, układ strony oraz oprogramowanie,
          podlegają ochronie prawnej.
        </p>
        <p>2. Zabronione jest kopiowanie lub wykorzystywanie treści serwisu bez zgody operatora.</p>
      </>
    ),
  },
  {
    id: 9,
    title: "Postanowienia końcowe",
    content: (
      <>
        <p>1. Operator zastrzega sobie prawo do zmiany niniejszego regulaminu.</p>
        <p>2. Aktualna wersja regulaminu jest zawsze dostępna w serwisie salon.odart.pl.</p>
        <p>3. W sprawach nieuregulowanych niniejszym regulaminem zastosowanie mają przepisy prawa polskiego.</p>
        <p>4. Regulamin obowiązuje od dnia publikacji w serwisie.</p>
      </>
    ),
  },
];

export function SalonRegulaminPage() {
  return (
    <div className="min-h-screen bg-white">
      <HeaderPortal />
      <main className="py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-[var(--font-serif)] text-3xl font-normal text-beauty-charcoal sm:text-4xl">
            Regulamin serwisu salon.odart.pl
          </h1>
          <p className="mt-3 font-[var(--font-sans)] text-[15px] text-beauty-charcoal/80">
            Regulamin korzystania z serwisu dla użytkowników (klientów)
          </p>

          <div className="mt-12 space-y-10">
            {sections.map(({ id, title, content }) => (
              <section key={id}>
                <h2 className="font-[var(--font-sans)] text-xl font-semibold text-beauty-charcoal">
                  §{id} {title}
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
