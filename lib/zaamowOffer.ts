/** Oferta sklepu zaamow.pl — treść ODART (nie kopia homepage zaamow), linki kanoniczne na produkt. */

export const ZAAMOW_ORIGIN = "https://zaamow.pl";
export const ZAAMOW_ODART_PATH = "/zaamow/";

export type ZaamowOfferGroupId = "start" | "aplikacje" | "miasto";

export type ZaamowOffer = {
  id: string;
  group: ZaamowOfferGroupId;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  href: string;
  cta: string;
  ctaEn: string;
  featured?: boolean;
};

export const ZAAMOW_GROUPS: {
  id: ZaamowOfferGroupId;
  heading: string;
  headingEn: string;
  intro: string;
  introEn: string;
}[] = [
  {
    id: "start",
    heading: "Domena, poczta i strona WWW",
    headingEn: "Domain, business email and a website",
    intro:
      "Domena .pl, skrzynki biuro@ i strona. Zamawiasz na zaamow.pl.",
    introEn:
      "A company starter kit: your own .pl domain, contact@ mailboxes and a site people can write from. Order on zaamow.pl.",
  },
  {
    id: "aplikacje",
    heading: "Aplikacje ODART",
    headingEn: "ODART apps",
    intro:
      "Gotowe panele, które utrzymuję: harmonogram, ERP, Hub, gabinety, zamówienia jedzenia. Katalog i status każdej aplikacji jest na zaamow.pl/aplikacje.",
    introEn:
      "Live panels I maintain: scheduling, ERP, Hub, clinics and food ordering. Full catalogue on zaamow.pl/aplikacje.",
  },
  {
    id: "miasto",
    heading: "Miasto, turystyka i bezpieczeństwo",
    headingEn: "City, tourism and security",
    intro:
      "Przewodnik Kołobrzeg, ścieżki rowerowe, wycena mieszkań i audyt cyber — rzeczy, które działają publicznie i da się wdrożyć pod inne miasto albo firmę.",
    introEn:
      "Kolobrzeg city guide, bike paths, property estimate and a cyber audit — public demos, white-label on request.",
  },
];

export const ZAAMOW_OFFERS: ZaamowOffer[] = [
  {
    id: "domeny",
    group: "start",
    title: "Domeny .pl i globalne",
    titleEn: ".pl and global domains",
    description:
      "Sprawdź wolną nazwę, zarejestruj albo przenieś domenę. DNS i SSL w pakiecie.",
    descriptionEn: "Check availability, register or transfer. DNS and SSL included.",
    href: `${ZAAMOW_ORIGIN}/domeny`,
    cta: "Sprawdź domenę na zaamow.pl",
    ctaEn: "Check a domain on zaamow.pl",
    featured: true,
  },
  {
    id: "poczta",
    group: "start",
    title: "Poczta firmowa",
    titleEn: "Business email",
    description:
      "Skrzynki biuro@ i kontakt@ przy domenie i stronie. Lead Inbox (wyróżnianie zapytań) to osobna aplikacja w katalogu.",
    descriptionEn: "biuro@ / kontakt@ mailboxes with the domain and site. Lead Inbox is a separate app.",
    href: `${ZAAMOW_ORIGIN}/poczta`,
    cta: "Warianty poczty na zaamow.pl",
    ctaEn: "Email options on zaamow.pl",
    featured: true,
  },
  {
    id: "strony",
    group: "start",
    title: "Strony internetowe",
    titleEn: "Websites",
    description:
      "Wizytówka, landing albo sklep. WordPress lub Next.js. Szybki start na zaamow.pl/strony, indywidualny projekt na odart.pl.",
    descriptionEn: "Brochure, landing or shop. WordPress or Next.js. Bespoke work stays on odart.pl; quick start is on zaamow.pl.",
    href: `${ZAAMOW_ORIGIN}/strony`,
    cta: "Zamów stronę na zaamow.pl",
    ctaEn: "Order a website on zaamow.pl",
    featured: true,
  },
  {
    id: "opieka",
    group: "start",
    title: "Opieka nad stroną",
    titleEn: "Website care",
    description: "Aktualizacje, kopie, drobne zmiany treści.",
    descriptionEn: "Updates, backups and small content changes on a regular cadence.",
    href: `${ZAAMOW_ORIGIN}/strony/opieka`,
    cta: "Opieka WWW na zaamow.pl",
    ctaEn: "Website care on zaamow.pl",
  },
  {
    id: "sklep",
    group: "start",
    title: "Sklep internetowy",
    titleEn: "Online shop",
    description: "Własny sklep pod marką: katalog, koszyk, zamówienia. Przykłady i zakres na zaamow.pl/strony/sklep.",
    descriptionEn: "Your own branded shop: catalogue, cart, orders.",
    href: `${ZAAMOW_ORIGIN}/strony/sklep`,
    cta: "Sklepy na zaamow.pl",
    ctaEn: "Shops on zaamow.pl",
  },
  {
    id: "aplikacje",
    group: "aplikacje",
    title: "Katalog aplikacji",
    titleEn: "App catalogue",
    description:
      "Harmonogram, Mini ERP, Hub, gabinety, zamówienia, Tablica, Randki — status dostępności przy każdej pozycji.",
    descriptionEn: "Scheduling, ERP, Hub, clinics, food ordering and more, with availability on each card.",
    href: `${ZAAMOW_ORIGIN}/aplikacje`,
    cta: "Katalog aplikacji na zaamow.pl",
    ctaEn: "App catalogue on zaamow.pl",
    featured: true,
  },
  {
    id: "harmonogram",
    group: "aplikacje",
    title: "Harmonogram",
    titleEn: "Scheduling",
    description: "Kanban, terminy i przypomnienia dla agencji, warsztatu albo produkcji.",
    descriptionEn: "Kanban, deadlines and reminders for an agency, workshop or production floor.",
    href: `${ZAAMOW_ORIGIN}/harmonogram`,
    cta: "Harmonogram na zaamow.pl",
    ctaEn: "Scheduling on zaamow.pl",
  },
  {
    id: "erp",
    group: "aplikacje",
    title: "Mini ERP",
    titleEn: "Mini ERP",
    description: "Magazyn, PZ/WZ, faktury VAT, KSeF i import z Optimy.",
    descriptionEn: "Stock, warehouse docs, VAT invoices, KSeF and Optima import.",
    href: `${ZAAMOW_ORIGIN}/erp`,
    cta: "Mini ERP na zaamow.pl",
    ctaEn: "Mini ERP on zaamow.pl",
    featured: true,
  },
  {
    id: "hub",
    group: "aplikacje",
    title: "Hub sprzedażowy",
    titleEn: "Sales Hub",
    description: "Allegro, Amazon i eBay w jednym panelu. Bez opłaty od zamówienia.",
    descriptionEn: "Allegro / Amazon / eBay in one panel. No per-order fee.",
    href: `${ZAAMOW_ORIGIN}/hub`,
    cta: "Cennik Huba na zaamow.pl",
    ctaEn: "Hub pricing on zaamow.pl",
    featured: true,
  },
  {
    id: "zamowienia",
    group: "aplikacje",
    title: "Zamówienia jedzenia",
    titleEn: "Food ordering",
    description: "Menu, odbiór albo dostawa, panel restauracji. Aplikacja: zamow.odart.pl.",
    descriptionEn: "Menu, pickup or delivery, restaurant panel. App: zamow.odart.pl.",
    href: `${ZAAMOW_ORIGIN}/zamowienia`,
    cta: "Zamówienia na zaamow.pl",
    ctaEn: "Food ordering on zaamow.pl",
  },
  {
    id: "gabinety",
    group: "aplikacje",
    title: "Gabinety i salony",
    titleEn: "Clinics and salons",
    description: "Dentysta, weterynaria, fizjo, psycho, salon beauty — kalendarz, kartoteki, portal pacjenta.",
    descriptionEn: "Dental, vet, physio, psychology, beauty — calendar, records, patient portal.",
    href: `${ZAAMOW_ORIGIN}/dentysta`,
    cta: "Gabinety na zaamow.pl",
    ctaEn: "Clinics on zaamow.pl",
  },
  {
    id: "cyber",
    group: "miasto",
    title: "Cyberbezpieczeństwo",
    titleEn: "Cybersecurity",
    description: "Audyt SZBI (KSC, NIS2, ISO 27001) albo krótki obchód małej firmy: router, firewall, serwer, PC.",
    descriptionEn: "ISMS audit (KSC, NIS2, ISO 27001) or a short small-business walkthrough.",
    href: `${ZAAMOW_ORIGIN}/cyber`,
    cta: "Cyber na zaamow.pl",
    ctaEn: "Cyber on zaamow.pl",
    featured: true,
  },
  {
    id: "przewodnik",
    group: "miasto",
    title: "Przewodnik Kołobrzeg",
    titleEn: "Kolobrzeg city guide",
    description: "Mapa, atrakcje, trasy, audio i gra terenowa. White-label pod inne miasto — na zapytanie.",
    descriptionEn: "Map, attractions, routes, audio and a GPS quest. White-label for another city on request.",
    href: `${ZAAMOW_ORIGIN}/przewodnik`,
    cta: "Przewodnik na zaamow.pl",
    ctaEn: "City guide on zaamow.pl",
  },
  {
    id: "sciezki",
    group: "miasto",
    title: "Ścieżki rowerowe Kołobrzeg",
    titleEn: "Kolobrzeg bike paths",
    description: "Opis tras R-10 / Velo Baltica, Grzybowo, Dźwirzyno. Mapa na żywo: zaamow.pl/sciezki.",
    descriptionEn: "R-10 / Velo Baltica, Grzybowo, Dzwirzyno. Live map: zaamow.pl/sciezki.",
    href: `${ZAAMOW_ORIGIN}/sciezki-rowerowe-kolobrzeg`,
    cta: "Ścieżki rowerowe na zaamow.pl",
    ctaEn: "Bike paths on zaamow.pl",
    featured: true,
  },
  {
    id: "wycena",
    group: "miasto",
    title: "Wycena mieszkań",
    titleEn: "Apartment estimate",
    description: "Orientacyjny kalkulator RCN (Kraków). Nie zastępuje operatu.",
    descriptionEn: "Indicative RCN calculator (Krakow). Not a formal appraisal.",
    href: `${ZAAMOW_ORIGIN}/wycena`,
    cta: "Kalkulator na zaamow.pl",
    ctaEn: "Calculator on zaamow.pl",
  },
];

export const ZAAMOW_FEATURED = ZAAMOW_OFFERS.filter((item) => item.featured);

export const ZAAMOW_FAQ = [
  {
    q: "Czym zaamow.pl różni się od odart.pl?",
    a: "odart.pl to agencja: indywidualna strona, aplikacja na zamówienie, opieka IT. zaamow.pl to sklep, w którym zamawiasz domenę, pocztę, stronę z katalogu i gotowe aplikacje ODART — bez briefu od zera.",
  },
  {
    q: "Czy mogę wziąć samą domenę?",
    a: "Domenę sprawdzasz i zamawiasz na zaamow.pl/domeny. Poczta firmowa idzie w pakiecie z domeną i stroną WWW. Sam hosting i SSL ogarniam przy starcie.",
  },
  {
    q: "Chcę unikalną stronę, nie szablon z katalogu.",
    a: "Pisz na biuro@odart.pl albo przez formularz na odart.pl/kontakt. Katalog na zaamow.pl/strony jest na szybki start; większy serwis projektujemy tutaj.",
  },
  {
    q: "Gdzie jest lista aplikacji?",
    a: "Pełny katalog z statusem (dostępne / demo / w przygotowaniu) jest na zaamow.pl/aplikacje. Stamtąd wchodzisz w Harmonogram, ERP, Hub, gabinety i zamówienia jedzenia.",
  },
];

export function zaamowItemListJsonLd() {
  return {
    "@type": "ItemList",
    name: "Oferta zaamow.pl — ODART",
    itemListElement: ZAAMOW_OFFERS.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.title,
      url: item.href,
      description: item.description,
    })),
  };
}
