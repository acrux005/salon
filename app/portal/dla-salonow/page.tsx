import type { Metadata } from "next";
import Link from "next/link";
import { HeaderPortal } from "@/components/portal/HeaderPortal";
import { FooterPortal } from "@/components/portal/FooterPortal";

const SITE_URL = "https://salon.odart.pl";
const PATH = "/portal/dla-salonow";

export const metadata: Metadata = {
  title: "Dla salonów — profil, kalendarz i panel | Salon Odart",
  description:
    "Bezpłatny profil salonu w Salon Odart: usługi, cennik, kalendarz rezerwacji, wiadomości, pracownicy, przypomnienia i opinie. Poznaj wszystkie funkcje panelu.",
  alternates: { canonical: `${SITE_URL}${PATH}` },
  openGraph: {
    title: "Dla salonów — funkcje portalu Salon Odart",
    description:
      "Profil w katalogu, panel właściciela, rezerwacje, wiadomości i automatyzacje dla klientek. Dołącz salon lub przejmij istniejący wpis.",
    url: `${SITE_URL}${PATH}`,
    locale: "pl_PL",
    type: "website",
  },
};

const FEATURE_GROUPS: {
  title: string;
  intro: string;
  items: { title: string; body: string }[];
}[] = [
  {
    title: "Profil publiczny",
    intro: "To strona Twojego salonu, którą widzą klientki w wyszukiwarce i katalogu.",
    items: [
      {
        title: "Strona salonu w portalu",
        body: "Nazwa, miasto, opis, zdjęcie, specjalizacje, galeria oraz dane kontaktowe — telefon, e-mail, adres, Instagram i Facebook.",
      },
      {
        title: "Usługi i cennik",
        body: "Wybierasz zabiegi z katalogu, ustawiasz własne ceny i czasy trwania. Możesz zgłaszać nowe usługi do katalogu.",
      },
      {
        title: "Sekcje O nas, efekty i FAQ",
        body: "Uzupełniasz treść o salonie, opisy efektów terapii oraz najczęściej zadawane pytania — wszystko widoczne na profilu publicznym.",
      },
      {
        title: "Widoczność w katalogu",
        body: "Salon pojawia się w wyszukiwaniu po mieście i kategorii. Potwierdzony przez właściciela profil jest wyraźnie oznaczony.",
      },
    ],
  },
  {
    title: "Rezerwacje i kalendarz",
    intro: "Kalendarz online jest opcjonalny — możesz też przyjmować tylko telefony.",
    items: [
      {
        title: "Kalendarz wizyt",
        body: "Widzisz rezerwacje z portalu, filtrujesz po pracowniku, oznaczasz wizytę jako zrealizowaną, anulujesz lub przenosisz termin.",
      },
      {
        title: "Godziny pracy i blokady",
        body: "Ustawiasz dni i godziny otwarcia oraz blokujesz konkretne daty (np. święta). To wpływa na dostępne terminy dla klientek.",
      },
      {
        title: "Rezerwacja telefoniczna",
        body: "Jeśli wyłączysz kalendarz online, na profilu zostaje wyraźny kontakt telefoniczny zamiast wyboru terminu.",
      },
      {
        title: "Lista oczekujących",
        body: "Gdy nie ma wolnych terminów, klientka może zostawić e-mail. Gdy pojawią się sloty, system wysyła powiadomienie.",
      },
    ],
  },
  {
    title: "Zespół i organizacja",
    intro: "Dla salonów z więcej niż jednym stanowiskiem lub specjalizacją.",
    items: [
      {
        title: "Pracownicy",
        body: "Dodajesz osoby wykonujące usługi i przypisujesz je do zabiegów. Klientka przy rezerwacji wybiera osobę i widzi jej wolne terminy.",
      },
      {
        title: "Podgabinety",
        body: "Dzielisz lokal na stanowiska (np. stopy, twarz, rzęsy), przypisujesz zabiegi i pracowników — rezerwacje zostają uporządkowane.",
      },
    ],
  },
  {
    title: "Komunikacja",
    intro: "Zapytania nie giną w skrzynce — są w panelu salonu.",
    items: [
      {
        title: "Wiadomości",
        body: "Klientka pisze z profilu lub rezerwacji. Odpowiadasz w panelu — rozmowa zostaje w jednym wątku.",
      },
      {
        title: "Powiadomienia",
        body: "Informacje o nowych rezerwacjach, wiadomościach i zmianach terminu. Opcjonalnie powiadomienia push w przeglądarce.",
      },
    ],
  },
  {
    title: "Automatyzacje dla klientek",
    intro: "Mniej no-show i więcej opinii — bez ręcznej obsługi każdej wiadomości.",
    items: [
      {
        title: "Przypomnienie przed wizytą",
        body: "Na dobę przed wizytą klientka dostaje e-mail z datą, godziną i zabiegiem.",
      },
      {
        title: "Potwierdzenie przyjścia",
        body: "W mailu potwierdzającym rezerwację jest link „Potwierdź, że przyjdziesz”. Status widać przy wizycie w kalendarzu.",
      },
      {
        title: "Prośba o opinię",
        body: "Po oznaczeniu wizyty jako zrealizowanej klientka dostaje e-mail z linkiem do opinii na Twoim profilu.",
      },
      {
        title: "Ulubione salony",
        body: "Klientka może zapisać salon i szybko wracać do rezerwacji z panelu „Moje rezerwacje”.",
      },
      {
        title: "Eksport do kalendarza",
        body: "Klientka może dodać wizytę do Google Calendar lub Outlook (.ics).",
      },
    ],
  },
];

export default function DlaSalonowPage() {
  return (
    <>
      <HeaderPortal />
      <main className="min-h-screen bg-white">
        <section
          className="border-b border-neutral-200/60 py-14 lg:py-20"
          style={{ background: "linear-gradient(to bottom, #FFF8FB 0%, #ffffff 100%)" }}
        >
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <p className="font-[var(--font-sans)] text-[13px] font-semibold uppercase tracking-wider text-pink-600">
              Dla salonów
            </p>
            <h1 className="mt-3 font-[var(--font-serif)] text-3xl font-normal leading-tight text-[#1F1A1C] sm:text-4xl">
              Bezpłatny profil i panel salonu w Salon Odart
            </h1>
            <p className="mt-5 font-[var(--font-sans)] text-[16px] leading-relaxed text-[#6F5E64]">
              Pokaż ofertę w katalogu beauty, prowadź rezerwacje, odpowiadaj na wiadomości i
              zbieraj opinie. Jeśli salon jest już w bazie — przejmij profil zamiast tworzyć
              duplikat.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/portal/dodaj-salon"
                className="inline-flex rounded-full bg-pink-500 px-6 py-3.5 font-[var(--font-sans)] text-[15px] font-medium text-white hover:bg-pink-600"
              >
                Dodaj lub przejmij profil
              </Link>
              <Link
                href="/portal/login"
                className="inline-flex rounded-full border border-neutral-300 px-6 py-3.5 font-[var(--font-sans)] text-[15px] font-medium text-[#1F1A1C] hover:border-pink-300 hover:bg-pink-50/50"
              >
                Zaloguj do panelu
              </Link>
            </div>
          </div>
        </section>

        <section className="border-b border-neutral-200/40 py-10">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-[var(--font-sans)] text-[15px] font-semibold text-[#1F1A1C]">
              Na tej stronie
            </h2>
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 font-[var(--font-sans)] text-[14px] text-pink-600">
              {FEATURE_GROUPS.map((group) => (
                <li key={group.title}>
                  <a href={`#${slugify(group.title)}`} className="hover:underline">
                    {group.title}
                  </a>
                </li>
              ))}
              <li>
                <a href="#strona-www" className="hover:underline">
                  Własna strona WWW
                </a>
              </li>
            </ul>
          </div>
        </section>

        <section className="py-14 lg:py-20">
          <div className="mx-auto max-w-3xl space-y-16 px-4 sm:px-6 lg:px-8">
            {FEATURE_GROUPS.map((group) => (
              <div key={group.title} id={slugify(group.title)} className="scroll-mt-24">
                <h2 className="font-[var(--font-serif)] text-2xl font-normal text-[#1F1A1C]">
                  {group.title}
                </h2>
                <p className="mt-2 font-[var(--font-sans)] text-[15px] text-[#6F5E64]">{group.intro}</p>
                <ul className="mt-8 space-y-6">
                  {group.items.map((item) => (
                    <li key={item.title} className="border-b border-neutral-100 pb-6 last:border-0 last:pb-0">
                      <h3 className="font-[var(--font-sans)] text-[16px] font-semibold text-[#1F1A1C]">
                        {item.title}
                      </h3>
                      <p className="mt-2 font-[var(--font-sans)] text-[15px] leading-relaxed text-[#6F5E64]">
                        {item.body}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div id="strona-www" className="scroll-mt-24 rounded-2xl border border-neutral-200 bg-[#F7F4F6] p-6 sm:p-8">
              <h2 className="font-[var(--font-serif)] text-2xl font-normal text-[#1F1A1C]">
                Własna strona internetowa
              </h2>
              <p className="mt-3 font-[var(--font-sans)] text-[15px] leading-relaxed text-[#6F5E64]">
                Oprócz profilu w portalu możesz zamówić osobną stronę WWW salonu — z ofertą,
                cennikiem, galerią i kontaktem. To osobna realizacja ODART, z wyceną od ok. 1500 zł.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/strona-internetowa-dla-gabinetu-kosmetycznego"
                  className="inline-flex rounded-full bg-[#1F1A1C] px-5 py-3 font-[var(--font-sans)] text-[14px] font-medium text-white hover:bg-neutral-800"
                >
                  Oferta stron WWW
                </Link>
                <Link
                  href="/strona-kosmetyczki"
                  className="inline-flex rounded-full border border-neutral-300 bg-white px-5 py-3 font-[var(--font-sans)] text-[14px] font-medium text-[#1F1A1C] hover:border-pink-300"
                >
                  Przykład realizacji
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-neutral-200/60 bg-[#FFF8FB] py-14 lg:py-16">
          <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="font-[var(--font-serif)] text-2xl font-normal text-[#1F1A1C]">
              Gotowy, żeby uzupełnić profil?
            </h2>
            <p className="mt-3 font-[var(--font-sans)] text-[15px] text-[#6F5E64]">
              Najpierw wyszukaj salon w katalogu. Jeśli go nie ma — dodaj nowy wpis.
            </p>
            <Link
              href="/portal/dodaj-salon"
              className="mt-8 inline-flex rounded-full bg-pink-500 px-6 py-3.5 font-[var(--font-sans)] text-[15px] font-medium text-white hover:bg-pink-600"
            >
              Dodaj lub przejmij profil
            </Link>
          </div>
        </section>
      </main>
      <FooterPortal />
    </>
  );
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/ł/g, "l")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
