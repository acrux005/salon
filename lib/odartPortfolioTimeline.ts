/** Wpis na osi czasu portfolio (Next.js — treści z wcześniejszego archiwum, bez WordPressa). */
export type PortfolioTimelineEntry = {
  id: string;
  /** Etykieta przy węźle (np. rok lub etap). */
  label: string;
  title: string;
  description: string;
  /** Opcjonalny link zewnętrzny lub wewnętrzny. */
  href?: string;
};

/**
 * Kolejność: od najnowszych / produktów webowych w górę, potem realizacje starsze.
 * Opisy skrócone z oferty — bez odwołań do szablonów WP.
 */
export const ODART_PORTFOLIO_TIMELINE: PortfolioTimelineEntry[] = [
  {
    id: "salon",
    label: "Produkt",
    title: "Portal salonu beauty — rezerwacje",
    description:
      "Rezerwacje wizyt, katalog gabinetów i ścieżka klienta — serwis pod branżę beauty i wellness (Next.js).",
    href: "https://salon.odart.pl/",
  },
  {
    id: "zamow",
    label: "Produkt",
    title: "Zamów — zamówienia online",
    description: "Składanie zamówień z telefonu lub komputera — menu, koszyk i obsługa pod gastronomię.",
    href: "https://zamow.odart.pl/",
  },
  {
    id: "prokursy",
    label: "Produkt",
    title: "Prokursy — platforma kursów",
    description: "Platforma e-learning: treści, materiały i logika pod sprzedaż szkoleń w sieci.",
    href: "https://prokursy-online.pl/",
  },
  {
    id: "harmonogram",
    label: "Produkt",
    title: "Harmonogram — warsztat / zlecenia",
    description:
      "Zlecenia, pojazdy, klienci, opony (harmonogram.odart.pl/demo) oraz profil firmowy / produkcja (harmonogram.odart.pl/demo/produkcja).",
    href: "https://harmonogram.odart.pl/demo",
  },
  {
    id: "deweloper-demo",
    label: "Demo",
    title: "Strona inwestycji deweloperskiej",
    description:
      "Interfejs inwestycji mieszkaniowej: mieszkania, filtry, galeria, kontakt — wzorzec pod sprzedaż lokali.",
    href: "https://stronadewelopera.pl/demo/inwestycja/",
  },
  {
    id: "nft",
    label: "WWW",
    title: "NFT Marketplace (Polygon)",
    description:
      "Platforma do tworzenia NFT na blockchainie Polygon ze smart kontraktem; rejestracja przez Metamask.",
  },
  {
    id: "rezerwacje-blik",
    label: "WWW",
    title: "Rezerwacje i płatności Blik",
    description: "Strona demo dla gabinetu z systemem rezerwacji i panelem administracyjnym.",
  },
  {
    id: "szkolenia",
    label: "WWW",
    title: "Szkolenia i warsztaty",
    description: "Strona firmowa pod szkolenia — treści, copy i grafiki w jednym zakresie.",
  },
  {
    id: "ksiegowy",
    label: "WWW",
    title: "Strony dla biur księgowych",
    description:
      "Profesjonalna obecność online dla księgowych i doradców podatkowych — zaufanie i jasna oferta.",
  },
  {
    id: "rafal-www",
    label: "WWW",
    title: "Strona dla fotografa, muzyka, filmowca",
    description: "Propozycja layoutu i treści na przykładzie prywatnej strony autora.",
    href: "https://rafalkowalkowski.pl",
  },
  {
    id: "egifteria",
    label: "E-commerce",
    title: "Egifteria — sklep z upominkami",
    description: "Sklep z grami planszowymi, kartami, szachami i klasycznymi grami.",
  },
  {
    id: "ui-mobile",
    label: "UI",
    title: "Interfejs mobilny",
    description:
      "Po ustaleniu UX — dobór kolorystyki, czcionek, ikon i grafik dla spójnego wizerunku aplikacji.",
  },
  {
    id: "logo-anim",
    label: "Motion",
    title: "Animacja logo",
    description: "Przygotowanie grafiki do animacji: proporcje, format i optymalizacja pod ruch.",
  },
  {
    id: "figma-portal",
    label: "Prototyp",
    title: "Figma — odtworzenie interfejsu portalu",
    description: "Odtworzenie interfejsu w Figma / Illustrator oraz animacje pod onboarding.",
  },
  {
    id: "logo-design",
    label: "Branding",
    title: "Projektowanie logo",
    description: "Symbol graficzny dopasowany do marki — od koncepcji po pliki wdrożeniowe.",
  },
  {
    id: "ux-badania",
    label: "UX",
    title: "Badania UX i odkrywanie produktu",
    description: "Eksploracja potrzeb użytkowników jako baza dla researchu i product managementu.",
  },
  {
    id: "smaczna-klip",
    label: "Wideo",
    title: "Klip — Smaczna Ryba i Złota",
    description: "Realizacja wideo z pracą na głębi ostrości i świetle (obiektywy jasne).",
  },
  {
    id: "smaczna-www",
    label: "WWW",
    title: "Smaczna Ryba — rozwój strony",
    description: "Rozwój i administracja stroną ze świeżą rybą prosto z łodzi.",
    href: "https://smacznaryba.pl",
  },
  {
    id: "karty-pilkarskie",
    label: "Druk",
    title: "Projekt kart piłkarskich",
    description: "Kompleksowa praca od koncepcji graficznej po przygotowanie pod druk.",
  },
  {
    id: "foto-produkty",
    label: "Foto",
    title: "Sesje produktowe",
    description: "Ujęcia pod marketing — podkreślenie charakteru i estetyki produktu.",
  },
  {
    id: "social",
    label: "Marketing",
    title: "Media społecznościowe i mailing",
    description: "Spójne treści i obecność online — m.in. dla Fotoferii i projektów autorskich.",
  },
  {
    id: "video-muzyka",
    label: "Audio / wideo",
    title: "Montaż wideo i produkcja muzyki",
    description: "Teledyski, montaż i praca studyjna — dźwięk i obraz w jednym procesie.",
  },
  {
    id: "fotoferia-marketing",
    label: "Fotoferia",
    title: "Fotoferia — marketing i rozwój",
    description: "Rozwój portalu, kampanie, współpraca z instytucjami i widoczność w sieci.",
    href: "https://fotoferia.pl/",
  },
  {
    id: "fotoferia-ui",
    label: "Fotoferia",
    title: "Fotoferia — projekt interfejsu (Yii)",
    description: "UX od koncepcji do wdrożenia we współpracy z zespołem; portal na frameworku Yii.",
    href: "https://fotoferia.pl/",
  },
];
