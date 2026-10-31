import {
  RAFAL_KOWALKOWSKI_BUDOWA_STRONY_ODART_HREF,
  RAFAL_KOWALKOWSKI_BUDOWA_STRONY_PATH,
  RAFAL_KOWALKOWSKI_BUDOWA_STRONY_WP_SOURCE,
  RAFAL_KOWALKOWSKI_GALLERY_PATH,
  RAFAL_KOWALKOWSKI_MESKA_SESJA_PATH,
  RAFAL_KOWALKOWSKI_NAGRANIE_PODKLAD_PATH,
  RAFAL_KOWALKOWSKI_NAGRANIE_TELEDYSK_PATH,
  RAFAL_KOWALKOWSKI_NAGRANIE_WOKALU_ODART_HREF,
  RAFAL_KOWALKOWSKI_NAGRANIE_WOKALU_PATH,
  RAFAL_KOWALKOWSKI_NAGRANIE_WOKALU_WP_SOURCE,
  RAFAL_KOWALKOWSKI_OBSLUGA_MEDIOW_ODART_HREF,
  RAFAL_KOWALKOWSKI_OBSLUGA_MEDIOW_PATH,
  RAFAL_KOWALKOWSKI_OBSLUGA_MEDIOW_WP_SOURCE,
  RAFAL_KOWALKOWSKI_PREZENT_WOKALNY_PATH,
  RAFAL_KOWALKOWSKI_SESJA_BIZNESOWA_ODART_HREF,
  RAFAL_KOWALKOWSKI_SESJA_BIZNESOWA_PATH,
  RAFAL_KOWALKOWSKI_SESJA_BIZNESOWA_WP_SOURCE,
  RAFAL_KOWALKOWSKI_SESJA_DZIECIECA_ODART_HREF,
  RAFAL_KOWALKOWSKI_SESJA_DZIECIECA_PATH,
  RAFAL_KOWALKOWSKI_SESJA_DZIECIECA_WP_SOURCE,
  RAFAL_KOWALKOWSKI_SESJA_PLENER_ODART_HREF,
  RAFAL_KOWALKOWSKI_SESJA_PLENER_PATH,
  RAFAL_KOWALKOWSKI_SESJA_PLENER_WP_SOURCE,
  RAFAL_KOWALKOWSKI_SESJA_PRODUKTOWA_ODART_HREF,
  RAFAL_KOWALKOWSKI_SESJA_PRODUKTOWA_PATH,
  RAFAL_KOWALKOWSKI_SESJA_PRODUKTOWA_WP_SOURCE,
  RAFAL_KOWALKOWSKI_SESJA_PRZYJACIOLKA_PATH,
  RAFAL_KOWALKOWSKI_TUNING_WOKALU_ODART_HREF,
  RAFAL_KOWALKOWSKI_TUNING_WOKALU_PATH,
  RAFAL_KOWALKOWSKI_TUNING_WOKALU_WP_SOURCE,
  RAFAL_KOWALKOWSKI_USLUGI_INFORMATYCZNE_PATH,
} from "@/lib/rafalKowalkowskiGallery";
import { RAFAL_SERVICE_IMAGE } from "@/lib/rafalKowalkowskiMedia";

export type RafalRelatedItem =
  | { title: string; price: string; href: string; image: string }
  | { title: string; price: string; contact: true; image: string };

export type RafalProductOffer = {
  slug: string;
  categoryLabel: string;
  breadcrumbLabel: string;
  title: string;
  priceLabel: string;
  priceSchema: string;
  hero: { src: string; w: number; h: number };
  /** Pełna szerokość kolumny, proporcje z `hero.w` × `hero.h` (bez max-w-md). */
  heroLayout?: "card" | "banner";
  heroAspect?: string;
  lead: string;
  sections?: { title: string; paragraphs: string[] }[];
  steps?: { title: string; text: string }[];
  stepsHeading?: string;
  footerNote?: string;
  wpSource: string;
  odartHref: string;
  jsonLdDescription: string;
  related: RafalRelatedItem[];
};

const I = RAFAL_SERVICE_IMAGE;
const IMG_PLENER = I.plener.src;
const IMG_BIZNES = I.biznes.src;
const IMG_TUNING = I.tuning.src;
const IMG_MEDIOW = I.media.src;
const IMG_WOKAL = I.wokal.src;
const IMG_PRODUKT = I.produkt.src;
const IMG_MESKA = I.meskaSesja.src;
const IMG_PRZYJACIOLKA = I.przyjaciolka.src;
const IMG_WWW = I.www.src;
const IMG_PODKLAD = I.podklad.src;
const IMG_TELEDYSK = I.teledysk.src;
const IMG_PREZENT = I.prezent.src;
const IMG_INFORMATYKA = I.informatyka.src;
const IMG_DZIECIECA = I.dziecieca.src;
const IMG_STUDIO = I.studio.src;

export const RAFAL_PRODUCT_OFFERS = {
  budowa: {
    slug: "budowa",
    categoryLabel: "Strony internetowe",
    breadcrumbLabel: "Budowa strony",
    title: "Budowa strony internetowej",
    priceLabel: "800,00 zł",
    priceSchema: "800.00",
    hero: { src: IMG_WWW, w: I.www.w, h: I.www.h },
    heroLayout: "banner",
    heroAspect: "aspect-[800/533]",
    lead:
      "Aż 40% stron internetowych w Internecie działa na WordPressie. Budowanie doskonałej strony internetowej powinno być priorytetem dla każdego przedsiębiorcy, który chce zbudować dochodową działalność internetową.",
    sections: [
      {
        title: "WordPress",
        paragraphs: [
          "WordPress oferuje panel sterowania z uproszczonym interfejsem do tworzenia stron internetowych, dostosowywania projektów i dodawania treści, które przyciągają, bawią i edukują Twoją publiczność i potencjalnych klientów.",
          "Jednakże dla początkujących, nawet najprostsze interfejsy mogą czasem wydawać się przerażające. Czy to brzmi znajomo? Jeśli tak, znalazłeś się we właściwym miejscu.",
        ],
      },
      {
        title: "Kreowanie stron pod wymagania Twojej firmy",
        paragraphs: [
          "Oferujemy kompleksowe usługi tworzenia stron internetowych opartych na WordPressie, dostosowane do unikalnych potrzeb Twojej firmy. Skupiamy się na projektowaniu stron, które nie tylko przyciągają uwagę, ale także skutecznie komunikują wartość Twojej marki.",
          "Wizualnie przyjazny design, treści angażujące odbiorców oraz integracja z mediami społecznościowymi — to elementy, które budują spójny wizerunek online.",
          "Projekt strony to równowaga między celami biznesowymi, doświadczeniem użytkownika a treścią. Strona musi działać na każdym urządzeniu — responsywny układ to dziś standard, a nie dodatek.",
        ],
      },
    ],
    footerNote:
      "Skontaktuj się z nami, aby omówić zakres projektu, wycenę i harmonogram wdrożenia strony WordPress dla Twojej firmy.",
    wpSource: RAFAL_KOWALKOWSKI_BUDOWA_STRONY_WP_SOURCE,
    odartHref: RAFAL_KOWALKOWSKI_BUDOWA_STRONY_ODART_HREF,
    jsonLdDescription: "Budowa strony internetowej na WordPressie — design, treści, SEO i integracje.",
    related: [
      {
        title: "Usługi informatyczne Kołobrzeg",
        price: "300,00 zł",
        href: RAFAL_KOWALKOWSKI_USLUGI_INFORMATYCZNE_PATH,
        image:
          IMG_INFORMATYKA,
      },
      {
        title: "Obsługa mediów społecznościowych",
        price: "500,00 zł",
        href: RAFAL_KOWALKOWSKI_OBSLUGA_MEDIOW_PATH,
        image: IMG_MEDIOW,
      },
      {
        title: "Nagranie piosenki z podkładem",
        price: "500,00 zł",
        href: RAFAL_KOWALKOWSKI_NAGRANIE_PODKLAD_PATH,
        image:
          "https://rafalkowalkowski.pl/wp-content/uploads/2023/12/odart._Woman_plays_the_modern_piano_8k_-v_4_a6266d19-ac79-423f-9a49-2b422bb1358a.jpg",
      },
      {
        title: "Sesja biznesowa",
        price: "200,00 zł",
        href: RAFAL_KOWALKOWSKI_SESJA_BIZNESOWA_PATH,
        image: IMG_BIZNES,
      },
    ],
  },
  plener: {
    slug: "plener",
    categoryLabel: "Sesje fotograficzne",
    breadcrumbLabel: "Sesja plenerowa",
    title: "Sesja portretowa plener",
    priceLabel: "200,00 zł",
    priceSchema: "200.00",
    hero: { src: IMG_PLENER, w: I.plener.w, h: I.plener.h },
    heroAspect: "aspect-square",
    lead: "Sesje portretowe Kołobrzeg. Morze, plaża i port. Chcesz mieć piękne zdjęcia na terenie Kołobrzegu lub w okolicach? Napisz do mnie.",
    sections: [
      {
        title: "Opis",
        paragraphs: [
          "Sesje portretowe Kołobrzeg. Morze, plaża i port. Chcesz mieć piękne zdjęcia na terenie Kołobrzegu lub w okolicach? Napisz do mnie.",
        ],
      },
    ],
    footerNote: "Więcej zdjęć w galerii — umów termin przez formularz kontaktowy.",
    wpSource: RAFAL_KOWALKOWSKI_SESJA_PLENER_WP_SOURCE,
    odartHref: RAFAL_KOWALKOWSKI_SESJA_PLENER_ODART_HREF,
    jsonLdDescription: "Sesja portretowa w plenerze — Kołobrzeg, morze, plaża i port.",
    related: [
      { title: "Męska sesja portretowa", price: "200,00 zł", href: RAFAL_KOWALKOWSKI_MESKA_SESJA_PATH, image: IMG_MESKA },
      { title: "Sesja biznesowa", price: "200,00 zł", href: RAFAL_KOWALKOWSKI_SESJA_BIZNESOWA_PATH, image: IMG_BIZNES },
      {
        title: "Sesja fotograficzna z przyjaciółką",
        price: "200,00 zł",
        href: RAFAL_KOWALKOWSKI_SESJA_PRZYJACIOLKA_PATH,
        image: IMG_PRZYJACIOLKA,
      },
      {
        title: "Sesja dziecięca",
        price: "200,00 zł",
        href: RAFAL_KOWALKOWSKI_SESJA_DZIECIECA_PATH,
        image: IMG_DZIECIECA,
      },
    ],
  },
  biznesowa: {
    slug: "biznesowa",
    categoryLabel: "Sesje fotograficzne",
    breadcrumbLabel: "Sesja biznesowa",
    title: "Sesja biznesowa",
    priceLabel: "200,00 zł",
    priceSchema: "200.00",
    hero: { src: IMG_BIZNES, w: I.biznes.w, h: I.biznes.h },
    heroLayout: "banner",
    heroAspect: "aspect-[800/533]",
    lead: "Twój wizerunek to Twoja wizytówka.",
    sections: [
      {
        title: "Opis",
        paragraphs: [
          "Niezależnie od tego, czy szukasz pracy, czy też masz własną firmę, to zdecydowanie potrzebujesz profesjonalnych zdjęć. W ten sposób możesz wyróżnić się na tle konkurencji i pokazać się z jak najlepszej strony.",
          "Doświadczony fotograf z łatwością podsunie Ci swoją wizję, a efekty współpracy wykorzystasz do wszelkiego rodzaju artykułów, materiałów firmowych oraz stron internetowych.",
        ],
      },
    ],
    wpSource: RAFAL_KOWALKOWSKI_SESJA_BIZNESOWA_WP_SOURCE,
    odartHref: RAFAL_KOWALKOWSKI_SESJA_BIZNESOWA_ODART_HREF,
    jsonLdDescription: "Sesja biznesowa — profesjonalne zdjęcia do CV, LinkedIn i materiałów firmowych.",
    related: [
      { title: "Sesja portretowa plener", price: "200,00 zł", href: RAFAL_KOWALKOWSKI_SESJA_PLENER_PATH, image: IMG_PLENER },
      { title: "Męska sesja portretowa", price: "200,00 zł", href: RAFAL_KOWALKOWSKI_MESKA_SESJA_PATH, image: IMG_MESKA },
      {
        title: "Budowa strony internetowej",
        price: "800,00 zł",
        href: RAFAL_KOWALKOWSKI_BUDOWA_STRONY_PATH,
        image: "https://rafalkowalkowski.pl/wp-content/uploads/2024/03/odart-mainx.jpg",
      },
      {
        title: "Sesja produktowa",
        price: "200,00 zł",
        href: RAFAL_KOWALKOWSKI_SESJA_PRODUKTOWA_PATH,
        image: IMG_PRODUKT,
      },
    ],
  },
  produktowa: {
    slug: "produktowa",
    categoryLabel: "Sesje fotograficzne",
    breadcrumbLabel: "Sesja produktowa",
    title: "Sesja produktowa",
    priceLabel: "200,00 zł",
    priceSchema: "200.00",
    hero: { src: IMG_PRODUKT, w: I.produkt.w, h: I.produkt.h },
    heroLayout: "banner",
    heroAspect: "aspect-[800/513]",
    lead:
      "Profesjonalne fotografie wzbudzają zaufanie do marki i generują większą sprzedaż produktów. Celem sesji wizerunkowo-produktowej jest przede wszystkim promowanie sklepu i marki odzieżowej.",
    sections: [
      {
        title: "Sesja wizerunkowo – produktowa",
        paragraphs: [
          "Profesjonalne fotografie wzbudzają zaufanie do marki i generują większą sprzedaż produktów. Celem sesji wizerunkowo-produktowej jest przede wszystkim promowanie sklepu i marki odzieżowej.",
          "Wizerunek firmy jest bardzo ważny — w takiej fotografii pokazujemy przede wszystkim cały zespół i jego zamiłowanie do zawodu, a także produkty firmy, których ekspozycja w dobrym świetle potrafi zdziałać marketingowe cuda.",
        ],
      },
    ],
    footerNote: "Umów sesję produktową — napisz, jaką markę i asortyment chcesz zaprezentować.",
    wpSource: RAFAL_KOWALKOWSKI_SESJA_PRODUKTOWA_WP_SOURCE,
    odartHref: RAFAL_KOWALKOWSKI_SESJA_PRODUKTOWA_ODART_HREF,
    jsonLdDescription: "Sesja produktowa — fotografia wizerunkowa i produktowa dla marek i sklepów.",
    related: [
      { title: "Sesja biznesowa", price: "200,00 zł", href: RAFAL_KOWALKOWSKI_SESJA_BIZNESOWA_PATH, image: IMG_BIZNES },
      { title: "Sesja portretowa plener", price: "200,00 zł", href: RAFAL_KOWALKOWSKI_SESJA_PLENER_PATH, image: IMG_PLENER },
      { title: "Męska sesja portretowa", price: "200,00 zł", href: RAFAL_KOWALKOWSKI_MESKA_SESJA_PATH, image: IMG_MESKA },
      {
        title: "Budowa strony internetowej",
        price: "800,00 zł",
        href: RAFAL_KOWALKOWSKI_BUDOWA_STRONY_PATH,
        image: "https://rafalkowalkowski.pl/wp-content/uploads/2024/03/odart-mainx.jpg",
      },
    ],
  },
  tuning: {
    slug: "tuning",
    categoryLabel: "Nagrania",
    breadcrumbLabel: "Tuning wokalu",
    title: "Tuning wokalu",
    priceLabel: "100,00 zł",
    priceSchema: "100.00",
    hero: { src: IMG_TUNING, w: I.tuning.w, h: I.tuning.h },
    heroLayout: "banner",
    heroAspect: "aspect-[800/533]",
    lead:
      "Nasza usługa tuningowania wokalu to profesjonalne podejście do poprawy intonacji, precyzji tonacji i ogólnej jakości dźwięku wokalu. Tuning wokalu jest używany głównie w przemyśle muzycznym, aby uzyskać doskonałe brzmienie i zoptymalizować wydajność wokalisty.",
    stepsHeading: "Co obejmuje nasza usługa tuningowania wokalu?",
    steps: [
      {
        title: "Korekta intonacji",
        text: "Skupiamy się na precyzyjnej korekcie intonacji, eliminując potencjalne nieścisłości w wysokości tonów. To pozwala na uzyskanie bardziej czystego i precyzyjnego brzmienia.",
      },
      {
        title: "Korekta timingu",
        text: "Optymalizujemy timing wokalu, dostosowując poszczególne frazy do rytmu utworu. To zapewnia płynność i spójność wykonania.",
      },
      {
        title: "Redukcja szumów i artefaktów",
        text: "Usuwamy ewentualne szumy, zniekształcenia lub inne artefakty dźwiękowe, które mogą pojawić się podczas nagrywania wokalu.",
      },
      {
        title: "Optymalizacja brzmienia",
        text: "Dostosowujemy kolor dźwięku wokalu do charakteru utworu lub preferencji artysty.",
      },
      {
        title: "Ostateczne dopracowanie",
        text: "Przeprowadzamy finalne korekty, aby uzyskać perfekcyjne brzmienie wokalu — subtelnie, z poszanowaniem charakteru głosu.",
      },
    ],
    footerNote:
      "Skorzystaj z usługi tuningowania wokalu, aby podnieść poziom profesjonalizmu swoich nagrań. Skontaktuj się z nami, aby omówić szczegóły.",
    wpSource: RAFAL_KOWALKOWSKI_TUNING_WOKALU_WP_SOURCE,
    odartHref: RAFAL_KOWALKOWSKI_TUNING_WOKALU_ODART_HREF,
    jsonLdDescription: "Tuning wokalu — korekta intonacji, timingu i brzmienia w studiu nagraniowym.",
    related: [
      { title: "Nagranie wokalu", price: "200,00 zł", href: RAFAL_KOWALKOWSKI_NAGRANIE_WOKALU_PATH, image: IMG_WOKAL },
      { title: "Nagranie piosenki z podkładem", price: "500,00 zł", href: RAFAL_KOWALKOWSKI_NAGRANIE_PODKLAD_PATH, image: IMG_PODKLAD },
      { title: "Nagranie piosenki z teledyskiem", price: "500,00 zł", href: RAFAL_KOWALKOWSKI_NAGRANIE_TELEDYSK_PATH, image: IMG_TELEDYSK },
      { title: "Prezent wokalny na ślub lub urodziny", price: "1000,00 zł", href: RAFAL_KOWALKOWSKI_PREZENT_WOKALNY_PATH, image: IMG_PREZENT },
    ],
  },
  wokal: {
    slug: "wokal",
    categoryLabel: "Nagrania",
    breadcrumbLabel: "Nagranie wokalu",
    title: "Nagranie wokalu",
    priceLabel: "200,00 zł",
    priceSchema: "200.00",
    hero: { src: IMG_WOKAL, w: I.wokal.w, h: I.wokal.h },
    heroLayout: "banner",
    heroAspect: "aspect-[800/533]",
    lead:
      "Nasza usługa „Nagranie wokalu” zapewnia profesjonalne nagrywanie wokali dla artystów muzycznych, producentów, reklamodawców i wszystkich, którzy potrzebują wysokiej jakości nagrań wokalnych.",
    stepsHeading: "Co obejmuje usługa?",
    steps: [
      {
        title: "Profesjonalne studio nagrań",
        text: "Studio wyposażone w nowoczesny sprzęt audio i technologię zapewniającą doskonałą jakość dźwięku.",
      },
      {
        title: "Doświadczeni inżynierowie dźwięku",
        text: "Kadra z wieloletnim doświadczeniem w pracy z różnymi gatunkami muzycznymi i artystami.",
      },
      {
        title: "Najnowsze technologie",
        text: "Mikrofony wysokiej jakości, preampy, oprogramowanie do edycji i korekty tonu — dla idealnego brzmienia.",
      },
      {
        title: "Dostosowanie do Twoich potrzeb",
        text: "Każda sesja jest dopasowana indywidualnie — różne style muzyczne i niestandardowe efekty dźwiękowe.",
      },
      {
        title: "Miksowanie i mastering",
        text: "Ostateczna jakość dźwięku i przygotowanie nagrań do publikacji.",
      },
      {
        title: "Ochrona Twojego dźwięku",
        text: "Zachowanie oryginalności brzmienia i ochrona praw autorskich.",
      },
      {
        title: "Szybka realizacja",
        text: "Gotowe nagrania w krótkim czasie — możesz kontynuować pracę nad muzyką lub projektem.",
      },
      {
        title: "Konkurencyjna cena",
        text: "Ceny umożliwiające korzystanie z usług artystom i projektom o różnych budżetach.",
      },
    ],
    footerNote:
      "Niezależnie od tego, czy jesteś wokalistą solowym, zespołem, producentem czy potrzebujesz wokalu do reklamy — skontaktuj się, aby umówić sesję nagraniową.",
    wpSource: RAFAL_KOWALKOWSKI_NAGRANIE_WOKALU_WP_SOURCE,
    odartHref: RAFAL_KOWALKOWSKI_NAGRANIE_WOKALU_ODART_HREF,
    jsonLdDescription:
      "Nagrywanie wokalu w studiu w Kołobrzegu — sesja, miks i mastering. Śpiew z podkładem, cover i nagranie piosenki. Rafał Kowalkowski.",
    related: [
      { title: "Tuning wokalu", price: "100,00 zł", href: RAFAL_KOWALKOWSKI_TUNING_WOKALU_PATH, image: IMG_TUNING },
      { title: "Nagranie piosenki z podkładem", price: "500,00 zł", href: RAFAL_KOWALKOWSKI_NAGRANIE_PODKLAD_PATH, image: IMG_TUNING },
      { title: "Nagranie piosenki z teledyskiem", price: "500,00 zł", href: RAFAL_KOWALKOWSKI_NAGRANIE_TELEDYSK_PATH, image: IMG_TUNING },
      { title: "Prezent wokalny na ślub lub urodziny", price: "1000,00 zł", href: RAFAL_KOWALKOWSKI_PREZENT_WOKALNY_PATH, image: IMG_TUNING },
    ],
  },
  dziecieca: {
    slug: "dziecieca",
    categoryLabel: "Sesje fotograficzne",
    breadcrumbLabel: "Sesja dziecięca",
    title: "Sesja dziecięca",
    priceLabel: "200,00 zł",
    priceSchema: "200.00",
    hero: { src: IMG_DZIECIECA, w: I.dziecieca.w, h: I.dziecieca.h },
    heroLayout: "banner",
    heroAspect: "aspect-[800/457]",
    lead:
      "Skorzystaj z moich usług fotograficznych. Potrzebujesz fotografa na event, do sesji, reportażu, sesji rodzinnej, a nawet ślubu? Przedstaw swoje plany.",
    sections: [
      {
        title: "Opis",
        paragraphs: [
          "Skorzystaj z moich usług fotograficznych. Potrzebujesz fotografa na event, do sesji, reportażu, sesji rodzinnej, a nawet ślubu? Przedstaw swoje plany.",
          "Sesje dziecięce realizuję w studio lub plenerze — w luźnej atmosferze, z uwzględnieniem wieku i temperamentu malucha.",
        ],
      },
    ],
    wpSource: RAFAL_KOWALKOWSKI_SESJA_DZIECIECA_WP_SOURCE,
    odartHref: RAFAL_KOWALKOWSKI_SESJA_DZIECIECA_ODART_HREF,
    jsonLdDescription: "Sesja dziecięca — fotografia portretowa i rodzinna, Kołobrzeg i okolice.",
    related: [
      {
        title: "Sesja fotograficzna z przyjaciółką",
        price: "200,00 zł",
        href: RAFAL_KOWALKOWSKI_SESJA_PRZYJACIOLKA_PATH,
        image: IMG_PRZYJACIOLKA,
      },
      { title: "Sesja portretowa plener", price: "200,00 zł", href: RAFAL_KOWALKOWSKI_SESJA_PLENER_PATH, image: IMG_PLENER },
      { title: "Męska sesja portretowa", price: "200,00 zł", href: RAFAL_KOWALKOWSKI_MESKA_SESJA_PATH, image: IMG_MESKA },
      { title: "Sesja biznesowa", price: "200,00 zł", href: RAFAL_KOWALKOWSKI_SESJA_BIZNESOWA_PATH, image: IMG_BIZNES },
    ],
  },
  mediow: {
    slug: "mediow",
    categoryLabel: "Media społecznościowe",
    breadcrumbLabel: "Obsługa mediów",
    title: "Obsługa mediów społecznościowych",
    priceLabel: "500,00 zł",
    priceSchema: "500.00",
    hero: { src: IMG_MEDIOW, w: I.media.w, h: I.media.h },
    heroAspect: "aspect-square",
    lead:
      "W dzisiejszym dynamicznym świecie mediów społecznościowych, skuteczna obecność online to kluczowy element budowy marki i interakcji z docelową publicznością. Nasza usługa obsługi mediów społecznościowych oferuje kompleksowe wsparcie, dzięki któremu Twoja firma może efektywnie komunikować się, budować zaangażowanie i zyskiwać nowych klientów w przestrzeni cyfrowej.",
    stepsHeading: "Co oferujemy",
    steps: [
      {
        title: "Strategia social media",
        text: "Spersonalizowana strategia z uwzględnieniem celów biznesowych, grupy docelowej i charakteru marki.",
      },
      {
        title: "Zarządzanie kontami",
        text: "Profesjonalne prowadzenie profili na Facebooku, Instagramie, X (Twitterze), LinkedIn i innych platformach.",
      },
      {
        title: "Kreacja treści",
        text: "Angażujące posty, grafiki, filmy i infografiki przyciągające uwagę i budujące zaangażowanie.",
      },
      {
        title: "Planowanie grafiku",
        text: "Harmonogram publikacji dopasowany do optymalnych momentów aktywności odbiorców.",
      },
      {
        title: "Reakcje na bieżąco",
        text: "Monitoring aktywności, odpowiedzi na komentarze i pytania — pozytywna interakcja z użytkownikami.",
      },
      {
        title: "Konkursy i kampanie",
        text: "Konkursy, kampanie reklamowe i wydarzenia online zwiększające zainteresowanie marką.",
      },
      {
        title: "Analiza danych",
        text: "Analiza efektywności kampanii, śledzenie trendów i korekta strategii na podstawie wyników.",
      },
    ],
    sections: [
      {
        title: "Proces",
        paragraphs: [
          "Konsultacja — dogłębna rozmowa o celach biznesowych i oczekiwanych efektach w social media.",
          "Analiza konkurencji — identyfikacja mocnych i słabych stron pod unikalną strategię.",
          "Planowanie strategii — wybór platform, rodzajów treści i planu publikacji.",
          "Realizacja planu — wdrożenie strategii, zarządzanie treściami i bieżący monitoring.",
          "Optymalizacja — dostosowanie działań do trendów i preferencji odbiorców.",
          "Raportowanie — regularne raporty z konkretnymi wynikami kampanii.",
        ],
      },
    ],
    footerNote:
      "Z nami Twoja marka stanie się widoczna i zaangażuje się w interakcję z publicznością na platformach społecznościowych. Skontaktuj się z nami, aby omówić obsługę mediów społecznościowych.",
    wpSource: RAFAL_KOWALKOWSKI_OBSLUGA_MEDIOW_WP_SOURCE,
    odartHref: RAFAL_KOWALKOWSKI_OBSLUGA_MEDIOW_ODART_HREF,
    jsonLdDescription:
      "Obsługa mediów społecznościowych — strategia, treści, community management, kampanie i raporty.",
    related: [
      {
        title: "Budowa strony internetowej",
        price: "800,00 zł",
        href: RAFAL_KOWALKOWSKI_BUDOWA_STRONY_PATH,
        image: "https://rafalkowalkowski.pl/wp-content/uploads/2024/03/odart-mainx.jpg",
      },
      {
        title: "Usługi informatyczne Kołobrzeg",
        price: "300,00 zł",
        href: RAFAL_KOWALKOWSKI_USLUGI_INFORMATYCZNE_PATH,
        image:
          IMG_INFORMATYKA,
      },
      { title: "Sesja biznesowa", price: "200,00 zł", href: RAFAL_KOWALKOWSKI_SESJA_BIZNESOWA_PATH, image: IMG_BIZNES },
      {
        title: "Nagranie piosenki z teledyskiem",
        price: "500,00 zł",
        href: RAFAL_KOWALKOWSKI_NAGRANIE_TELEDYSK_PATH,
        image: IMG_MEDIOW,
      },
    ],
  },
} as const satisfies Record<string, RafalProductOffer>;

export type RafalProductOfferSlug = keyof typeof RAFAL_PRODUCT_OFFERS;
