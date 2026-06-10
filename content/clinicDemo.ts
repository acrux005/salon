/**
 * Treść demo strony gabinetu w systemie Zabiegi Odart.
 * Profil gabinetu: problem → terapia → konkretne zabiegi → rezerwacja.
 */

export type ProblemId =
  | "tradzik"
  | "przebarwienia"
  | "anti_aging"
  | "naczynka"
  | "sucha_skora"
  | "zmarszczki"
  | "jedrnost"
  | "owal"
  | "brwi_rzesy"
  | "makijaz"
  | "wlosy"
  | "stopy"
  | "masaze"
  | "terapia_manualna"
  | "dzwiekoterapia";

export interface TreatmentItem {
  id: string;
  nazwa: string;
  opis: string;
  problemy: ProblemId[];
  czas: number; // min
  cena_od: number;
}

export interface SpecializationItem {
  id: ProblemId;
  label: string;
  count: number;
}

export interface MatchingReasons {
  title: string;
  bullets: string[];
}

export interface ProblemCard {
  title: string;
  href: string;
}

export interface Step {
  title: string;
  description: string;
}

export interface EffectCard {
  problem: string;
  terapia: string;
  wizyty: string;
  efekt: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface CategoryCard {
  title: string;
  description: string;
  href: string;
  cta: string;
}

/** Slug z URL (?problem=) → etykieta */
export const PROBLEM_LABELS: Record<ProblemId, string> = {
  tradzik: "Trądzik",
  przebarwienia: "Przebarwienia",
  anti_aging: "Anti-aging",
  naczynka: "Skóra naczynkowa",
  sucha_skora: "Sucha skóra",
  zmarszczki: "Zmarszczki",
  jedrnost: "Utrata jędrności",
  owal: "Opadający owal",
  brwi_rzesy: "Brwi i rzęsy",
  makijaz: "Makijaż",
  wlosy: "Włosy",
  stopy: "Stopy",
  masaze: "Masaże",
  terapia_manualna: "Terapia manualna",
  dzwiekoterapia: "Dźwiękoterapia",
};

export const clinicDemo = {
  siteName: "Gabinet",
  siteTagline: "Odkryj swój blask",

  /** Profil gabinetu w systemie dopasowania */
  profile: {
    name: "Gabinet Odkryj Blask",
    specializations: ["Trądzik", "Anti-aging", "Przebarwienia", "Skóra naczynkowa"] as const,
    rating: 4.9,
    reviewCount: 124,
    city: "Kołobrzeg",
    ctaPrimary: "Umów konsultację",
    ctaPrimaryHref: "/kontakt",
    ctaSecondary: "Sprawdź dopasowanie do Twojej skóry",
    ctaSecondaryHref: "/portal/quiz",
  },

  header: {
    nav: [
      { label: "Zabiegi", href: "/zabiegi" },
      { label: "Oferta", href: "/oferta" },
      { label: "Bestsellery", href: "/zabiegi#bestsellery" },
      { label: "O nas", href: "/o-nas" },
    ],
    searchPlaceholder: "Szukaj…",
    cartCount: 0,
    ctaLabel: "Umów wizytę",
    ctaHref: "/kontakt",
  },

  hero: {
    imageAlt: "Gabinet kosmetyczny — konsultacja",
  },

  /** USP — zachowane dla komponentu ClinicUSP (np. strona-kosmetyczki); na głównej ofercie nieużywane */
  usp: {
    title: "Dlaczego my",
    items: [
      { title: "Indywidualny plan terapii", short: "Plan dopasowany do Twojej skóry" },
      { title: "Certyfikowane preparaty", short: "Sprawdzone marki i protokoły" },
      { title: "Bezpieczne procedury", short: "Zgodnie z najlepszymi praktykami" },
      { title: "Widoczne efekty", short: "Realne rezultaty po serii zabiegów" },
    ],
  },

  /** Sekcja „Dlaczego ten gabinet pasuje” — tylko gdy ?problem= */
  matchingReasons: {
    tradzik: {
      title: "Dlaczego ten gabinet pasuje do Twojego problemu",
      bullets: [
        "Specjalizuje się w leczeniu trądziku dorosłych",
        "Wykonuje terapię regulującą sebum",
        "Doświadczenie: 240+ terapii",
        "Średni czas terapii: 6 tygodni",
      ],
    },
    przebarwienia: {
      title: "Dlaczego ten gabinet pasuje do Twojego problemu",
      bullets: [
        "Specjalizacja w wyrównywaniu kolorytu",
        "Peelingi chemiczne i laserowe rozjaśnianie",
        "Doświadczenie: 180+ terapii",
        "Indywidualny protokół w zależności od głębokości przebarwień",
      ],
    },
    anti_aging: {
      title: "Dlaczego ten gabinet pasuje do Twojego problemu",
      bullets: [
        "Mezoterapia igłowa i mikroigłowa, stymulacja kolagenu",
        "Doświadczenie: 320+ terapii anti-aging",
        "Połączenie zabiegów z pielęgnacją domową",
        "Średnio 3–6 zabiegów w serii",
      ],
    },
    naczynka: {
      title: "Dlaczego ten gabinet pasuje do Twojego problemu",
      bullets: [
        "Zabiegi wzmacniające naczynka i łagodzące rumień",
        "IPL / światłoterapia w ofercie",
        "Doświadczenie w skórze naczyniowej i wrażliwej",
        "Kwalifikacja podczas konsultacji",
      ],
    },
    sucha_skora: {
      title: "Dlaczego ten gabinet pasuje do Twojego problemu",
      bullets: [
        "Nawilżające mezoterapie i zabiegi odżywcze",
        "Dobór kosmetyków pod suchą i odwodnioną skórę",
        "Protokoły z kwasem hialuronowym",
      ],
    },
    zmarszczki: {
      title: "Dlaczego ten gabinet pasuje do Twojego problemu",
      bullets: [
        "Anti-aging: mezoterapia, peelingi, stymulacja",
        "320+ terapii w zakresie zmarszczek",
        "Indywidualna liczba wizyt w serii",
      ],
    },
    jedrnost: {
      title: "Dlaczego ten gabinet pasuje do Twojego problemu",
      bullets: [
        "Zabiegi ujędrniające i modelujące owal",
        "Mezoterapia, fale radiowe, masaże",
        "Plan terapii po konsultacji",
      ],
    },
    owal: {
      title: "Dlaczego ten gabinet pasuje do Twojego problemu",
      bullets: [
        "Modelowanie owalu twarzy",
        "Zabiegi liftingujące i ujędrniające",
        "Kwalifikacja i liczba zabiegów ustalane indywidualnie",
      ],
    },
    wlosy: {
      title: "Dlaczego ten gabinet pasuje",
      bullets: [
        "Oferta fryzjerska i pielęgnacja włosów",
        "Strzyżenie, koloryzacja, przedłużanie i zabiegi na włosy",
      ],
    },
  } as Record<ProblemId, MatchingReasons>,

  /** Specjalizacje z liczbą wykonanych terapii (filtr zabiegów) */
  specializations: [
    { id: "tradzik" as ProblemId, label: "Trądzik", count: 240 },
    { id: "przebarwienia" as ProblemId, label: "Przebarwienia", count: 180 },
    { id: "anti_aging" as ProblemId, label: "Anti-aging", count: 320 },
    { id: "naczynka" as ProblemId, label: "Skóra naczynkowa", count: 95 },
  ] as SpecializationItem[],

  /** Konkretne zabiegi — do filtrowania po problemie */
  treatments: [
    {
      id: "mezoterapia_ha",
      nazwa: "Mezoterapia igłowa z kwasem hialuronowym",
      opis: "Głębokie nawilżenie i odżywienie skóry. Wskazana przy suchej, odwodnionej skórze i pierwszych oznakach starzenia.",
      problemy: ["sucha_skora", "anti_aging"] as ProblemId[],
      czas: 45,
      cena_od: 350,
    },
    {
      id: "terapia_regulujaca_sebum",
      nazwa: "Terapia regulująca sebum",
      opis: "Oczyszczanie, złuszczanie i regulacja wydzielania sebum. Seria zabiegów wspiera leczenie trądziku.",
      problemy: ["tradzik"] as ProblemId[],
      czas: 60,
      cena_od: 180,
    },
    {
      id: "peeling_chemiczny",
      nazwa: "Peeling chemiczny (np. kwas glikolowy / migdałowy)",
      opis: "Wyrównanie kolorytu, rozjaśnienie przebarwień, odświeżenie skóry. Siła peelingu dobierana na konsultacji.",
      problemy: ["przebarwienia", "anti_aging"] as ProblemId[],
      czas: 45,
      cena_od: 220,
    },
    {
      id: "mikrodermabrazja",
      nazwa: "Mikrodermabrazja",
      opis: "Mechaniczne złuszczanie naskórka. Poprawa tekstury, rozjaśnienie przebarwień, przygotowanie do innych zabiegów.",
      problemy: ["przebarwienia", "tradzik"] as ProblemId[],
      czas: 45,
      cena_od: 150,
    },
    {
      id: "mezoterapia_mikroiglowa",
      nazwa: "Mezoterapia mikroigłowa (Dermapen)",
      opis: "Stymulacja kolagenu, poprawa gęstości i jędrności skóry. Stosowana w anti-aging i bliznach.",
      problemy: ["anti_aging", "zmarszczki", "jedrnost"] as ProblemId[],
      czas: 60,
      cena_od: 380,
    },
    {
      id: "zabieg_naczynkowy",
      nazwa: "Zabieg na skórę naczynkową (IPL / światło)",
      opis: "Zamykanie poszerzonych naczynek, redukcja rumienia. Wymaga konsultacji i przeciwwskazań.",
      problemy: ["naczynka"] as ProblemId[],
      czas: 30,
      cena_od: 200,
    },
    {
      id: "pielęgnacja_łagodzaca",
      nazwa: "Pielęgnacja łagodząca (skóra wrażliwa / naczynkowa)",
      opis: "Zabieg bez inwazyjnych procedur. Nawilżenie, wzmocnienie bariery, wyciszenie.",
      problemy: ["naczynka", "sucha_skora"] as ProblemId[],
      czas: 50,
      cena_od: 120,
    },
    {
      id: "masaz_limfatyczny_twarzy",
      nazwa: "Masaż limfatyczny twarzy",
      opis: "Drenaż, ujędrnienie, poprawa owalu. Uzupełnienie terapii anti-aging.",
      problemy: ["owal", "jedrnost", "anti_aging"] as ProblemId[],
      czas: 45,
      cena_od: 90,
    },
    {
      id: "peeling_retinol",
      nazwa: "Peeling z retinolem (stabilizowany)",
      opis: "Przyspieszenie odnowy, rozjaśnienie, anty-aging. W serii z innymi zabiegami.",
      problemy: ["przebarwienia", "anti_aging", "zmarszczki"] as ProblemId[],
      czas: 45,
      cena_od: 200,
    },
  ] as TreatmentItem[],

  problems: {
    title: "Z czym zgłaszają się nasi pacjenci",
    subtitle: "Wybierz obszar, który chcesz poprawić — prowadzimy do właściwego zabiegu",
    cards: [
      { title: "Trądzik", href: "/oferta?problem=tradzik" },
      { title: "Zmarszczki", href: "/oferta?problem=zmarszczki" },
      { title: "Przebarwienia", href: "/oferta?problem=przebarwienia" },
      { title: "Naczynka", href: "/oferta?problem=naczynka" },
      { title: "Utrata jędrności", href: "/oferta?problem=jedrnost" },
      { title: "Opadający owal", href: "/oferta?problem=owal" },
    ] as ProblemCard[],
  },

  firstVisit: {
    title: "Jak wygląda pierwsza wizyta",
    steps: [
      { title: "Konsultacja i wywiad", description: "Rozmowa o Twoich oczekiwaniach i historii pielęgnacji." },
      { title: "Diagnostyka skóry", description: "Ocena cery i dobór kierunku terapii." },
      { title: "Plan terapii", description: "Propozycja zabiegów i pielęgnacji domowej." },
      { title: "Decyzja o zabiegu", description: "Wspólnie decydujecie o kolejnych krokach — bez presji." },
    ] as Step[],
  },

  /** Uproszczone: Problem → Terapia → Wizyty → Efekt */
  effects: {
    title: "Realne efekty terapii",
    subtitle: "Problem → Terapia → Liczba wizyt → Efekt",
    cards: [
      { problem: "Trądzik", terapia: "Terapia regulująca sebum", wizyty: "4 wizyty", efekt: "Widoczna redukcja zmian i sebum" },
      { problem: "Anti-aging", terapia: "Mezoterapia igłowa / mikroigłowa", wizyty: "3 zabiegi", efekt: "Nawilżenie, jędrność" },
      { problem: "Przebarwienia", terapia: "Peelingi + pielęgnacja", wizyty: "seria", efekt: "Wyrównanie kolorytu" },
    ] as EffectCard[],
  },

  /** Skrócone O mnie — 5–6 zdań, profesjonalnie */
  about: {
    title: "O mnie",
    paragraphs: [
      "Kosmetolog z wieloletnim doświadczeniem w kosmetologii estetycznej.",
      "Pracuję na certyfikowanych preparatach i sprawdzonych protokołach. Pierwsza wizyta to konsultacja — diagnoza i plan terapii, bez zobowiązań.",
      "Specjalizuję się w trądziku, anti-aging i przebarwieniach. Efekty są realne po serii zabiegów, bez obietnic cudów.",
    ],
    ctaLabel: "Umów konsultację",
    ctaHref: "/kontakt",
    imageAlt: "Specjalista kosmetologii estetycznej",
  },

  faq: {
    title: "Najczęściej zadawane pytania",
    items: [
      {
        question: "Czy zabieg boli?",
        answer: "Większość zabiegów pielęgnacyjnych jest bezbolesna lub wiąże się z lekkim dyskomfortem. Zabiegi inwazyjne (np. mezoterapia igłowa) wykonujemy po wcześniejszym znieczuleniu. Na konsultacji omówimy, czego możesz się spodziewać.",
      },
      {
        question: "Ile trwa regeneracja?",
        answer: "Zależy od zabiegu. Łagodne peelingi — 1–2 dni. Zabiegi igłowe — 2–5 dni zaczerwienienia. Konkretne zalecenia dostaniesz po zabiegu.",
      },
      {
        question: "Czy efekty są trwałe?",
        answer: "Efekty utrzymują się miesiącami do roku w zależności od procedury i pielęgnacji. Regularna pielęgnacja i zabiegi podtrzymujące przedłużają rezultaty.",
      },
      {
        question: "Czy konsultacja jest obowiązkowa?",
        answer: "Tak. Pierwsza wizyta to konsultacja — bez obowiązku wykupu zabiegu. Dzięki temu dobierzemy bezpieczną i skuteczną terapię.",
      },
    ] as FAQItem[],
  },

  categories: {
    title: "Popularne kategorie",
    subtitle: "Wybierz kategorię zabiegów dopasowaną do Twoich potrzeb",
    cards: [
      { title: "Twarz", description: "Pielęgnacja i zabiegi na twarz", href: "/zabiegi/twarz", cta: "Zobacz zabiegi" },
      { title: "Ciało", description: "Masaże i zabiegi na ciało", href: "/zabiegi/cialo", cta: "Zobacz zabiegi" },
      { title: "Dłonie i stopy", description: "Manicure, pedicure, pielęgnacja", href: "/zabiegi/rece", cta: "Zobacz zabiegi" },
    ] as CategoryCard[],
  },

  /** Sidebar: rezerwacja + kontakt (sticky na desktop) */
  sidebar: {
    title: "Rezerwacja",
    ctaBook: "Umów konsultację",
    ctaBookHref: "/kontakt",
    ctaTerms: "Zobacz dostępne terminy",
    ctaTermsHref: "/kontakt#terminy",
    telLabel: "+48 123 456 789",
    telHref: "tel:+48123456789",
    address: "Kołobrzeg",
  },

  finalCta: {
    title: "Masz ten problem? Zacznij od konsultacji kwalifikacyjnej.",
    ctaBook: "Umów konsultację",
    ctaBookHref: "/kontakt",
    ctaTerms: "Zobacz dostępne terminy",
    ctaTermsHref: "/kontakt#terminy",
    telLabel: "+48 123 456 789",
    telHref: "tel:+48123456789",
  },

  footer: {
    description: "Gabinet kosmetyczny — kosmetologia estetyczna. Profil w systemie dopasowania terapii Zabiegi Odart.",
    links: [
      { label: "Zabiegi", href: "/zabiegi" },
      { label: "Cennik", href: "/cennik" },
      { label: "O nas", href: "/o-nas" },
    ],
    contact: "Kontakt",
    domain: "example.com",
    copyright: "© 2026 Gabinet. Wszelkie prawa zastrzeżone.",
  },

  seo: {
    title: "Gabinet Kosmetyczny | Zabiegi Odart — dopasowanie terapii do Twojej skóry",
    description: "Trądzik, anti-aging, przebarwienia — konkretne zabiegi i rezerwacja. Kołobrzeg. Konsultacja kwalifikacyjna przed zabiegiem.",
  },
};
