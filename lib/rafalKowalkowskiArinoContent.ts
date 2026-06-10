import { RAFAL_SERVICE_IMAGE, rafalMediaUrl } from "@/lib/rafalKowalkowskiMedia";
import {
  RAFAL_KOWALKOWSKI_GALLERY_PATH,
  RAFAL_KOWALKOWSKI_PRZYGODA_FOTO_PATH,
  RAFAL_KOWALKOWSKI_TELEDYSKI_PATH,
  RAFAL_KOWALKOWSKI_USLUGI_PATH,
  RAFAL_KOWALKOWSKI_NAUKA_GITARY_PATH,
  RAFAL_KOWALKOWSKI_ZAJECIA_WOKALNE_PATH,
} from "@/lib/rafalKowalkowskiGallery";
import { rafalPublicHref } from "@/lib/rafalKowalkowskiLegacyRoutes";

export const RAFAL_ARINO_HERO = {
  titleLines: ["Fotografia, dźwięk", "i technologia"] as const,
  title: "Fotografia, dźwięk i technologia w jednym miejscu",
  lead:
    "Projektuję i realizuję usługi dla klientów indywidualnych i firm: nowoczesne strony, nagrania, teledyski, sesje zdjęciowe oraz spokojną administrację IT.",
  cta: { label: "Zapytaj o wycenę", href: "/kontakt/" },
  quote: "„Człowiek bez pasji żyje tylko jednym życiem”",
} as const;

export const RAFAL_ARINO_FUN_FACT = {
  title: "W liczbach",
  body:
    "Od 2005 roku łączę pasję do fotografii z produkcją muzyczną i technologią. ACRUX to marka studyjna, ODART — zespół i infrastruktura dla firm.",
  stats: [
    { value: "1000", label: "sfotografowanych osób" },
    { value: "50", label: "stron internetowych" },
    { value: "50", label: "produkcji muzycznych" },
    { value: "20", label: "lat doświadczenia" },
  ],
} as const;

export const RAFAL_ARINO_AWARDS = [
  {
    year: "2019",
    title: "Fotoferia",
    lines: ["Społeczność fotografów", "Projekty edukacyjne"],
  },
  {
    year: "2020",
    title: "ODART",
    lines: ["Strony WWW i IT", "Wdrożenia dla firm"],
  },
  {
    year: "2021",
    title: "ACRUX Studio",
    lines: ["Nagrania i mix", "Produkcje autorskie"],
  },
  {
    year: "2022",
    title: "Teledyski region",
    lines: ["Zachodniopomorskie", "Film i montaż"],
  },
] as const;

export const RAFAL_ARINO_PROCESS = {
  quote:
    "Każdy projekt traktuję jak szansę dopasowania kadru, dźwięku i technologii — zmiana to możliwość, nie zagrożenie.",
} as const;

export const RAFAL_ARINO_TESTIMONIALS = [
  {
    quote:
      "Komunikacja i terminowość na pierwszym miejscu — strona i sesja poszły bez tarcia.",
    name: "Klient biznesowy",
    role: "Usługi WWW + foto",
    rating: 5,
  },
  {
    quote: "Nagrania i teledysk trzymały jedną wizję — wrócę przy kolejnym singlu.",
    name: "Artysta niezależny",
    role: "Studio ACRUX",
    rating: 5,
  },
  {
    quote:
      "Od pierwszej rozmowy widać, że Rafał łączy wrażliwość artystyczną z konkretem technicznym.",
    name: "Zleceniodawca prywatny",
    role: "Sesja + social media",
    rating: 4,
  },
] as const;

export const RAFAL_ARINO_BLOG = [
  {
    title: "Jak zaczęła się moja przygoda z fotografią?",
    date: "Edukacja",
    href: rafalPublicHref(RAFAL_KOWALKOWSKI_PRZYGODA_FOTO_PATH),
    image: rafalMediaUrl(
      "https://rafalkowalkowski.pl/wp-content/uploads/2023/03/golden-ratio-photography07.jpg",
    ),
  },
  {
    title: "Nauka gry na gitarze Kołobrzeg",
    date: "Edukacja",
    href: rafalPublicHref(RAFAL_KOWALKOWSKI_NAUKA_GITARY_PATH),
    image: rafalMediaUrl(
      "https://rafalkowalkowski.pl/wp-content/uploads/2023/12/odart._A_guitarist_is_making_chords_by_looking_at_his_guitar__c43550c8-dc58-48f3-8ae8-20d37cc6374e_1.jpg",
    ),
  },
  {
    title: "Zajęcia wokalne Kołobrzeg",
    date: "Edukacja",
    href: rafalPublicHref(RAFAL_KOWALKOWSKI_ZAJECIA_WOKALNE_PATH),
    image: RAFAL_SERVICE_IMAGE.wokal.src,
  },
] as const;

export const RAFAL_ARINO_PARTNERS = ["ODART", "ACRUX", "Fotoferia", "Kołobrzeg", "Freelance"] as const;

export const RAFAL_ARINO_CTA = {
  title: "Porozmawiajmy i zróbmy coś",
  emphasis: "wyjątkowego",
  suffix: "razem",
  link: { label: "Umów spotkanie", href: "/kontakt/" },
} as const;

export const RAFAL_ARINO_LINKS = {
  servicesAll: rafalPublicHref(RAFAL_KOWALKOWSKI_USLUGI_PATH),
  gallery: rafalPublicHref(RAFAL_KOWALKOWSKI_GALLERY_PATH),
  teledyski: rafalPublicHref(RAFAL_KOWALKOWSKI_TELEDYSKI_PATH),
  blog: "/blog/",
} as const;
