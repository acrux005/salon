import Link from "next/link";
import { HeaderPortal } from "@/components/portal/HeaderPortal";
import { FooterPortal } from "@/components/portal/FooterPortal";

const SITE_URL = "https://salon.odart.pl";

export const metadata = {
  title: "Regulamin współpracy z gabinetami | Salon Odart",
  description:
    "Zasady współpracy między operatorem serwisu salon.odart.pl a gabinetami kosmetycznymi. Abonament, publikacja oferty, odpowiedzialność.",
  alternates: { canonical: `${SITE_URL}/regulamin-wspolpracy` },
  openGraph: {
    title: "Regulamin współpracy z gabinetami | Salon Odart",
    description: "Zasady współpracy z gabinetami kosmetycznymi w serwisie salon.odart.pl.",
    url: `${SITE_URL}/regulamin-wspolpracy`,
    type: "website",
    locale: "pl_PL",
  },
};

const sections = [
  {
    id: 1,
    title: "Postanowienia ogólne",
    content: (
      <>
        <p>
          1. Niniejszy regulamin określa zasady współpracy pomiędzy operatorem serwisu
          salon.odart.pl a gabinetami kosmetycznymi korzystającymi z platformy.
        </p>
        <p className="font-semibold mt-4">2. Operatorem serwisu jest:</p>
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
        <p className="mt-4">
          3. Gabinetem w rozumieniu regulaminu jest przedsiębiorca prowadzący działalność w
          zakresie usług kosmetycznych, który prezentuje swoją ofertę w serwisie salon.odart.pl.
        </p>
        <p>4. Rejestracja gabinetu w serwisie oznacza akceptację niniejszego regulaminu.</p>
      </>
    ),
  },
  {
    id: 2,
    title: "Zakres usług serwisu",
    content: (
      <>
        <p>1. Serwis salon.odart.pl umożliwia gabinetom:</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>prezentację profilu gabinetu</li>
          <li>publikację oferty zabiegów</li>
          <li>pozyskiwanie zapytań od klientów</li>
          <li>promocję gabinetu w wynikach wyszukiwania serwisu</li>
          <li>udostępnienie danych kontaktowych gabinetu</li>
        </ul>
        <p className="mt-4">
          2. Serwis może przekazywać gabinetowi zapytania klientów dotyczące wizyty lub zabiegu.
        </p>
        <p>3. Serwis nie świadczy usług kosmetycznych ani medycznych.</p>
        <p>
          4. Umowa na wykonanie zabiegu zawierana jest bezpośrednio pomiędzy gabinetem a klientem.
        </p>
      </>
    ),
  },
  {
    id: 3,
    title: "Model współpracy",
    content: (
      <>
        <p>
          1. Korzystanie z serwisu może odbywać się w modelu abonamentowym lub innym modelu
          współpracy ustalonym pomiędzy operatorem a gabinetem.
        </p>
        <p className="mt-4">2. Operator może pobierać opłatę za:</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>utworzenie i konfigurację profilu gabinetu</li>
          <li>abonament za obecność w serwisie</li>
          <li>promowanie gabinetu w serwisie</li>
          <li>inne usługi marketingowe</li>
        </ul>
        <p>3. Szczegółowe warunki finansowe ustalane są indywidualnie z gabinetem.</p>
        <p>
          4. Brak uregulowania opłaty abonamentowej może skutkować zawieszeniem lub usunięciem
          profilu gabinetu z serwisu.
        </p>
      </>
    ),
  },
  {
    id: 4,
    title: "Obowiązki gabinetu",
    content: (
      <>
        <p>Gabinet zobowiązuje się do:</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>podawania prawdziwych informacji o swojej działalności</li>
          <li>utrzymywania aktualnej oferty zabiegów</li>
          <li>realizacji usług zgodnie z obowiązującymi przepisami prawa</li>
          <li>przestrzegania zasad higieny i bezpieczeństwa usług</li>
          <li>kontaktowania się z klientem w sprawie zapytania lub wizyty</li>
        </ul>
        <p className="mt-4">
          Gabinet ponosi pełną odpowiedzialność za jakość i bezpieczeństwo świadczonych usług.
        </p>
      </>
    ),
  },
  {
    id: 5,
    title: "Dane klientów",
    content: (
      <>
        <p>
          1. Dane klientów przekazywane przez serwis mogą być wykorzystywane wyłącznie w celu
          kontaktu z klientem w sprawie wizyty lub zapytania o usługę.
        </p>
        <p>
          2. Gabinet zobowiązuje się do przetwarzania danych osobowych klientów zgodnie z
          obowiązującymi przepisami prawa, w szczególności RODO.
        </p>
        <p>
          3. Gabinet staje się administratorem danych osobowych klienta w zakresie dalszej
          obsługi wizyty.
        </p>
      </>
    ),
  },
  {
    id: 6,
    title: "Odpowiedzialność",
    content: (
      <>
        <p className="font-semibold">1. Operator serwisu nie ponosi odpowiedzialności za:</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>jakość usług wykonywanych przez gabinet</li>
          <li>efekty zabiegów kosmetycznych</li>
          <li>relacje pomiędzy gabinetem a klientem</li>
          <li>reklamacje klientów</li>
        </ul>
        <p>2. Gabinet ponosi pełną odpowiedzialność za realizację usług oferowanych w serwisie.</p>
        <p>3. Operator odpowiada wyłącznie za prawidłowe działanie serwisu.</p>
      </>
    ),
  },
  {
    id: 7,
    title: "Zakończenie współpracy",
    content: (
      <>
        <p>1. Gabinet może w każdej chwili zrezygnować z korzystania z serwisu.</p>
        <p className="mt-4">2. Operator może zawiesić lub zakończyć współpracę z gabinetem w przypadku:</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>naruszenia regulaminu</li>
          <li>podawania nieprawdziwych informacji</li>
          <li>działania na szkodę serwisu</li>
        </ul>
        <p className="mt-4">
          3. W przypadku zakończenia współpracy profil gabinetu może zostać usunięty z serwisu.
        </p>
      </>
    ),
  },
  {
    id: 8,
    title: "Postanowienia końcowe",
    content: (
      <>
        <p>1. Operator zastrzega sobie prawo do zmiany niniejszego regulaminu.</p>
        <p>2. Aktualna wersja regulaminu jest dostępna w serwisie salon.odart.pl.</p>
        <p>
          3. W sprawach nieuregulowanych niniejszym regulaminem zastosowanie mają przepisy prawa
          polskiego.
        </p>
        <p>4. Regulamin obowiązuje od dnia publikacji w serwisie.</p>
      </>
    ),
  },
];

export default function RegulaminWspolpracyPage() {
  return (
    <div className="min-h-screen bg-white">
      <HeaderPortal />
      <main className="py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-[var(--font-serif)] text-3xl font-normal text-beauty-charcoal sm:text-4xl">
            Regulamin współpracy z gabinetami kosmetycznymi
          </h1>
          <p className="mt-2 font-[var(--font-sans)] text-[15px] text-beauty-charcoal/80">
            Serwis salon.odart.pl
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

          <div className="mt-16 flex flex-wrap gap-4">
            <Link
              href="/portal/dla-gabinetow"
              className="font-[var(--font-sans)] text-beauty-rose hover:underline"
            >
              ← Dla gabinetów
            </Link>
            <Link href="/" className="font-[var(--font-sans)] text-beauty-rose hover:underline">
              Strona główna
            </Link>
          </div>
        </div>
      </main>
      <FooterPortal />
    </div>
  );
}
