/**
 * Zabiegi Odart — stały słownik potrzeb skóry (tagi).
 * AI nie wybiera zabiegów ani gabinetów — tylko generuje opis.
 */
export const SKIN_TAGS = [
  "HYDRATION",   // nawilżenie
  "CALMING",     // wyciszenie / reaktywność
  "PORES",       // oczyszczanie porów
  "SEBUM",       // regulacja sebum
  "ACNE",        // trądzik
  "PIGMENTATION",// przebarwienia
  "ANTI_AGE",    // stymulacja / zmarszczki
  "VASCULAR",    // naczynka
] as const;

export type Tag = (typeof SKIN_TAGS)[number];

export type Dryness = "dry" | "normal" | "oily";

export interface QuizAnswers {
  dryness: Dryness;
  issues: string[]; // "pores" | "pigmentation" | "wrinkles" | "redness"
  reactive: boolean;
  city?: string;
}

export interface Clinic {
  id: number;
  slug?: string; // do linków /portal/gabinet/[slug]
  name: string;
  city: string;
  description: string;
  matchingTags: Tag[]; // tagi z słownika, które gabinet obsługuje (clinic_services)
}

export interface AnalyzeResult {
  tags: Tag[];
  explanation_context: string;
  human_readable_description: string;
  clinics: Clinic[];
}

export interface MatchClinicsResult {
  clinics: Clinic[];
}
