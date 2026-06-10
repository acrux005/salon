// lib/skinmatch/schema.ts

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

export type QuizTag =
  | "acne"
  | "pores"
  | "blackheads"
  | "pigmentation"
  | "antiaging"
  | "wrinkles"
  | "redness"
  | "couperose"
  | "dryness"
  | "dehydration"
  | "sensitivity"
  | "firmness"
  | "sagging_oval";

export type Treatment = {
  id: string;
  nazwa: string;
  opis: string;
  problemy: ProblemId[];
  czas: number; // min
  cena_od: number; // PLN
};

/** Jedno pytanie w FAQ zabiegu (SEO, featured snippets). */
export type TreatmentFaqItem = {
  question: string;
  answer: string;
};

/** Zabieg z danymi pod podstronę SEO/marketplace (long content, FAQ, wskazania). */
export type TreatmentWithSeo = Treatment & {
  slug?: string | null;
  longDescription?: string | null;
  faq?: TreatmentFaqItem[];
  indications?: string[];
  contraindications?: string[];
  preparation?: string | null;
  heroImageUrl?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
};

/** Gabinet oferujący zabieg – do sekcji marketplace na podstronie zabiegu. */
export type ClinicOfferingTreatment = {
  id: string;
  slug: string;
  name: string;
  city: string;
  rating: number | null;
  reviewCount: number | null;
  cenaOd: number; // PLN (z ClinicTreatmentPrice lub katalogu)
  czasMin: number; // min
  avatarUrl?: string;
};

export type ClinicContact = {
  phone?: string;
  email?: string;
  address?: string;
  bookingUrl?: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  /** Daty bez rezerwacji (YYYY-MM-DD), np. święta/urlopy/chorobowe */
  noOrderDays?: string[];
  effectsSection?: ClinicEffectsSectionConfig;
  aboutSection?: ClinicAboutSectionConfig;
  faqSection?: ClinicFaqSectionConfig;
};

export type ClinicEffectCard = {
  problem: string;
  terapia: string;
  wizyty: string;
  efekt: string;
};

export type ClinicEffectsSectionConfig = {
  enabled?: boolean;
  title?: string;
  subtitle?: string;
  cards?: ClinicEffectCard[];
};

export type ClinicAboutSectionConfig = {
  enabled?: boolean;
  title?: string;
  paragraphs?: string[];
  imageAlt?: string;
  imageUrl?: string;
};

export type ClinicFaqItem = {
  question: string;
  answer: string;
};

export type ClinicFaqSectionConfig = {
  enabled?: boolean;
  title?: string;
  items?: ClinicFaqItem[];
};

export type ClinicRecord = {
  id: string;
  slug: string;
  name: string;
  city: string;
  description: string;

  // references to global catalog
  treatmentIds: string[];

  // marketing + discovery
  specializations: ProblemId[];
  matchingTags: QuizTag[];

  rating: number;
  reviewCount: number;

  /** URL awatara (np. /uploads/clinics/slug.webp) */
  avatarUrl?: string | null;

  kontakt?: ClinicContact;

  /** ID kosmetyczki (staff) w Cosmo Scheduler — kalendarz gabinetu = wizyty tego staffa */
  cosmoStaffId?: number | null;

  /** Godziny pracy: 7 elementów (Pn–Nd), każdy { open: "09:00", close: "17:00" } lub pusty = zamknięte */
  workingHours?: WorkingHoursDay[];

  /** true = gabinet nie korzysta z kalendarza online, rezerwacje wyłącznie telefonicznie */
  bookingPhoneOnly?: boolean;
}

export type WorkingHoursDay = { open: string; close: string };

// Mapowanie TAG (quiz) → ProblemId[]
export const TAG_TO_PROBLEM_IDS: Record<QuizTag, ProblemId[]> = {
  acne: ["tradzik"],
  pores: ["tradzik"],
  blackheads: ["tradzik"],

  pigmentation: ["przebarwienia"],
  antiaging: ["anti_aging"],
  wrinkles: ["zmarszczki", "anti_aging"],

  redness: ["naczynka"],
  couperose: ["naczynka"],

  dryness: ["sucha_skora"],
  dehydration: ["sucha_skora"],
  sensitivity: ["sucha_skora", "naczynka"],

  firmness: ["jedrnost"],
  sagging_oval: ["owal", "jedrnost"],
};

export function tagsToProblemIds(tags: QuizTag[]): ProblemId[] {
  const set = new Set<ProblemId>();
  for (const t of tags) {
    const mapped = TAG_TO_PROBLEM_IDS[t] ?? [];
    for (const pid of mapped) set.add(pid);
  }
  return Array.from(set);
}
