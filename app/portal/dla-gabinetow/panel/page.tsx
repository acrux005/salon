import Link from "next/link";
import { HeaderPortal } from "@/components/portal/HeaderPortal";
import { FooterPortal } from "@/components/portal/FooterPortal";
import { PORTAL_LOCALE } from "@/content/portalLocale";
import {
  Calendar,
  Building2,
  Users,
  LayoutGrid,
  MessageSquare,
  Bell,
  Settings,
  Eye,
  Mail,
  UserCheck,
  Star,
  Heart,
  Clock,
} from "lucide-react";

const REGION = PORTAL_LOCALE.region;
const REGION_IN = PORTAL_LOCALE.regionIn;
const SITE_URL = "https://salon.odart.pl";

export const metadata = {
  title: `Jak korzystać z panelu gabinetu | Zabiegi Odart — przewodnik dla właścicieli`,
  description: `Przewodnik po panelu gabinetu Zabiegi Odart: kalendarz, rezerwacje, pracownicy, ustawienia, wiadomości. Dowiedz się, co możesz zrobić w panelu.`,
  alternates: { canonical: `${SITE_URL}/portal/dla-gabinetow/panel` },
  openGraph: {
    title: `Jak korzystać z panelu gabinetu | Zabiegi Odart`,
    description: `Przewodnik dla właścicieli gabinetów — kalendarz, dane gabinetu, pracownicy, ustawienia.`,
    url: `${SITE_URL}/portal/dla-gabinetow/panel`,
    type: "website",
    locale: "pl_PL",
  },
};

const SECTIONS = [
  {
    id: "wejscie",
    icon: Building2,
    title: "Wejście do panelu",
    body: "Po zalogowaniu na konto gabinetu (e-mail i hasło podane przy rejestracji) trafiasz do Panelu gabinetu. Stąd masz dostęp do wszystkich funkcji. Link do logowania: Portal → Zaloguj się (wybierz konto gabinetu).",
    link: "/portal/login",
    linkLabel: "Zaloguj się do portalu",
  },
  {
    id: "kalendarz",
    icon: Calendar,
    title: "Kalendarz wizyt",
    body: "W jednym miejscu widzisz rezerwacje z portalu. Możesz wybrać pracownika, żeby zobaczyć jego terminy. Przy każdej wizycie możesz: oznaczyć ją jako Zrealizowana, Anulować lub Przenieść na inny termin. Po przeniesieniu klient dostaje e-mail z nową datą. Gdy oznaczysz wizytę jako Zrealizowana, klient automatycznie otrzymuje e-mail z prośbą o opinię.",
    link: "/portal/panel/kalendarz",
    linkLabel: "Otwórz Kalendarz (po zalogowaniu)",
  },
  {
    id: "dane-gabinetu",
    icon: Building2,
    title: "Edytuj dane gabinetu",
    body: "Tutaj ustawiasz nazwę, miasto, opis, zdjęcie (avatar), dane kontaktowe (telefon, e-mail, adres, link do rezerwacji, Instagram, Facebook). Możesz też przypisać gabinet do zabiegów z katalogu i podać własne ceny oraz czasy trwania. Dzięki temu klientki widzą na Twojej stronie aktualny cennik. Możesz także zgłaszać propozycje nowych zabiegów do katalogu — po akceptacji przez administratora trafią one do Twojej oferty.",
    link: "/portal/panel/klinika",
    linkLabel: "Edycja danych gabinetu",
  },
  {
    id: "pracownicy",
    icon: Users,
    title: "Pracownicy",
    body: "Dodajesz kosmetyczki i innych pracowników, którzy wykonują zabiegi. Przypisujesz pracowników do podgabinetów oraz do konkretnych zabiegów — wtedy klient przy rezerwacji wybiera osobę i widzi jej wolne terminy.",
    link: "/portal/panel/kosmetyczki",
    linkLabel: "Zarządzaj pracownikami",
  },
  {
    id: "podgabinety",
    icon: LayoutGrid,
    title: "Podgabinety",
    body: "Jeśli w jednym lokalu masz np. „Gabinet stopy”, „Gabinet twarzy” czy „Gabinet rzęs”, możesz je dodać jako podgabinety. Do każdego podgabinetu przypisujesz zabiegi (np. w jednym jest sprzęt do stóp, w drugim do twarzy). Pracownicy są przypisywani do podgabinetów — to porządkuje rezerwacje i dopasowanie.",
    link: "/portal/panel/podgabinety",
    linkLabel: "Podgabinety",
  },
  {
    id: "zabiegi",
    icon: Star,
    title: "Zabiegi i cennik",
    body: "W sekcji „Edycja danych gabinetu” (Klinika) wybierasz zabiegi z katalogu portalu i ustawiasz własne ceny oraz opcjonalnie czas trwania. Możesz też zgłaszać propozycje nowych zabiegów. Im pełniejszy i doprecyzowany cennik, tym lepiej klientki dopasowują się do Twojej oferty.",
    link: "/portal/panel/klinika",
    linkLabel: "Dane gabinetu i zabiegi",
  },
  {
    id: "wiadomosci",
    icon: MessageSquare,
    title: "Wiadomości",
    body: "Wszystkie rozmowy z klientkami w jednym miejscu. Klient może napisać do Ciebie z poziomu rezerwacji lub strony gabinetu. Odpowiadasz w panelu — wiadomość trafia do klienta. Dzięki temu nie gubisz zapytań w różnych skrzynkach.",
    link: "/portal/panel/wiadomosci",
    linkLabel: "Skrzynka wiadomości",
  },
  {
    id: "powiadomienia",
    icon: Bell,
    title: "Powiadomienia",
    body: "Tu zobaczysz informacje o nowych rezerwacjach, wiadomościach od klientów oraz innych zdarzeniach (np. zmiana terminu przez klienta). Możesz włączyć też powiadomienia push w przeglądarce, żeby na bieżąco dostawać sygnał o nowych rezerwacjach.",
    link: "/portal/panel/powiadomienia",
    linkLabel: "Powiadomienia",
  },
  {
    id: "ustawienia",
    icon: Settings,
    title: "Ustawienia",
    body: "Godziny pracy — ustawiasz, w które dni i w jakich godzinach gabinet jest otwarty; to wpływa na dostępne terminy w kalendarzu. Możesz też zablokować konkretne dni (np. święta). Sekcja „O nas” — tekst i zdjęcia wyświetlane na stronie gabinetu. Sekcja „Efekty” — opisy efektów terapii (problem → terapia → efekt). FAQ — często zadawane pytania i odpowiedzi. Opcja „Tylko rezerwacje telefoniczne” — jeśli wyłączysz kalendarz online, klientki zobaczą przycisk do dzwonienia zamiast wyboru terminu.",
    link: "/portal/panel/ustawienia",
    linkLabel: "Ustawienia",
  },
  {
    id: "profil-publiczny",
    icon: Eye,
    title: "Profil publiczny",
    body: "Z panelu możesz w każdej chwili wejść na „Zobacz publiczny profil” — to dokładnie ta strona, którą widzą klientki w wyszukiwarce. Sprawdź, czy opis, zdjęcia, cennik i dane kontaktowe wyświetlają się poprawnie.",
    link: null,
    linkLabel: "Link pojawia się na stronie Panel (po zalogowaniu)",
  },
];

const DLA_KLIENTA = [
  {
    icon: Mail,
    title: "Przypomnienie przed wizytą",
    body: "Na dobę przed wizytą klientka dostaje e-mail z przypomnieniem (data, godzina, zabieg). Może wyłączyć przypomnienia w ustawieniach konta.",
  },
  {
    icon: UserCheck,
    title: "Potwierdzenie przyjścia",
    body: "W mailu potwierdzającym rezerwację jest link „Potwierdź, że przyjdziesz”. Gdy klientka kliknie, w systemie zapisuje się potwierdzenie — widzisz to przy wizycie, mniej no-show.",
  },
  {
    icon: Star,
    title: "Prośba o opinię po wizycie",
    body: "Gdy w kalendarzu oznaczysz wizytę jako Zrealizowana, klientka automatycznie dostaje e-mail z linkiem do dodania opinii. Opinie pojawiają się na Twojej stronie gabinetu.",
  },
  {
    icon: Heart,
    title: "Ulubione gabinety",
    body: "Klientka może dodać Twój gabinet do ulubionych i szybko wracać do rezerwacji. W „Moje rezerwacje” ma listę ulubionych z linkami.",
  },
  {
    icon: Clock,
    title: "Lista oczekujących",
    body: "Gdy brak wolnych terminów, na stronie gabinetu klientka może podać e-mail: „Powiadom mnie, gdy zwolni się termin”. Gdy w kalendarzu pojawią się wolne sloty, system wysyła do niej e-mail (cron uruchamiany codziennie).",
  },
];

export default function PanelTutorialPage() {
  return (
    <>
      <HeaderPortal />
      <main className="min-h-screen bg-white">
        {/* Hero */}
        <section className="border-b border-neutral-200/60 bg-[#FFF8FB] py-12 lg:py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <Link
              href="/portal/dla-gabinetow"
              className="text-[14px] font-medium text-pink-600 hover:underline"
            >
              ← Dla gabinetów
            </Link>
            <h1 className="mt-4 font-[var(--font-serif)] text-3xl font-normal text-[#1F1A1C] sm:text-4xl">
              Jak korzystać z panelu gabinetu
            </h1>
            <p className="mt-4 font-[var(--font-sans)] text-[17px] leading-relaxed text-[#6F5E64]">
              Krótki przewodnik dla właścicieli gabinetów w {REGION_IN}. Dowiedz się, co możesz
              zrobić po zalogowaniu — kalendarz, dane gabinetu, pracownicy, ustawienia i co
              dostaje Twoja klientka.
            </p>
            <div className="mt-8">
              <Link
                href="/portal/login"
                className="inline-block rounded-full bg-pink-600 px-6 py-3 font-[var(--font-sans)] text-[15px] font-medium text-white hover:bg-pink-700"
              >
                Wejdź do panelu (logowanie)
              </Link>
            </div>
          </div>
        </section>

        {/* Spis treści */}
        <section className="border-b border-neutral-200/60 py-8">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-[var(--font-sans)] text-lg font-semibold text-[#1F1A1C]">
              Spis treści
            </h2>
            <ul className="mt-3 space-y-1 font-[var(--font-sans)] text-[15px] text-pink-600">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="hover:underline">
                    {s.title}
                  </a>
                </li>
              ))}
              <li>
                <a href="#dla-klientki" className="hover:underline">
                  Co dostaje Twoja klientka
                </a>
              </li>
            </ul>
          </div>
        </section>

        {/* Sekcje */}
        <section className="py-12 lg:py-16">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="space-y-14">
              {SECTIONS.map((sec) => {
                const Icon = sec.icon;
                return (
                  <article
                    key={sec.id}
                    id={sec.id}
                    className="scroll-mt-24 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8"
                  >
                    <div className="flex items-start gap-4">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-pink-100 text-pink-600">
                        <Icon className="h-6 w-6" aria-hidden />
                      </span>
                      <div className="min-w-0 flex-1">
                        <h2 className="font-[var(--font-serif)] text-xl font-normal text-[#1F1A1C] sm:text-2xl">
                          {sec.title}
                        </h2>
                        <p className="mt-3 font-[var(--font-sans)] text-[15px] leading-relaxed text-[#6F5E64]">
                          {sec.body}
                        </p>
                        {sec.link && (
                          <Link
                            href={sec.link}
                            className="mt-4 inline-block font-[var(--font-sans)] text-[14px] font-medium text-pink-600 hover:underline"
                          >
                            {sec.linkLabel} →
                          </Link>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}

              {/* Dla klientki */}
              <article
                id="dla-klientki"
                className="scroll-mt-24 rounded-2xl border-2 border-pink-200 bg-pink-50/30 p-6 sm:p-8"
              >
                <h2 className="font-[var(--font-serif)] text-xl font-normal text-[#1F1A1C] sm:text-2xl">
                  Co dostaje Twoja klientka
                </h2>
                <p className="mt-2 font-[var(--font-sans)] text-[15px] text-[#6F5E64]">
                  Dzięki funkcjom portalu klientki mają wygodę, a Ty — mniej pustych wizyt i więcej
                  opinii.
                </p>
                <ul className="mt-6 space-y-6">
                  {DLA_KLIENTA.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.title} className="flex gap-4">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-pink-600 shadow-sm">
                          <Icon className="h-5 w-5" aria-hidden />
                        </span>
                        <div>
                          <h3 className="font-[var(--font-sans)] text-[15px] font-semibold text-[#1F1A1C]">
                            {item.title}
                          </h3>
                          <p className="mt-1 font-[var(--font-sans)] text-[14px] leading-relaxed text-[#6F5E64]">
                            {item.body}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </article>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-neutral-200/60 bg-[#FFF8FB] py-12 lg:py-16">
          <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="font-[var(--font-serif)] text-2xl font-normal text-[#1F1A1C]">
              Masz pytania?
            </h2>
            <p className="mt-3 font-[var(--font-sans)] text-[15px] text-[#6F5E64]">
              Skorzystaj z formularza na stronie „Dla gabinetów” lub zaloguj się i sprawdź panel
              na własną rękę.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link
                href="/portal/dla-gabinetow#wspolpraca"
                className="rounded-full border border-pink-200 px-6 py-3 font-[var(--font-sans)] text-[15px] font-medium text-pink-600 hover:bg-pink-50"
              >
                Napisz do nas
              </Link>
              <Link
                href="/portal/panel"
                className="rounded-full bg-pink-600 px-6 py-3 font-[var(--font-sans)] text-[15px] font-medium text-white hover:bg-pink-700"
              >
                Wejdź do panelu
              </Link>
            </div>
          </div>
        </section>
      </main>
      <FooterPortal />
    </>
  );
}
