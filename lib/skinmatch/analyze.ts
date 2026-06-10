import type { Tag } from "./types";

const TAG_SET = new Set<string>([
  "HYDRATION", "CALMING", "PORES", "SEBUM", "ACNE",
  "PIGMENTATION", "ANTI_AGE", "VASCULAR",
]);

function assertTag(s: string): Tag {
  if (!TAG_SET.has(s)) throw new Error(`Invalid tag: ${s}`);
  return s as Tag;
}

export interface SkinProfileInput {
  dryness: "dry" | "normal" | "oily";
  issues: string[];
  reactive: boolean;
}

/**
 * Analiza odpowiedzi quizu → unikalna lista tagów.
 * AI nie wybiera — tylko ta logika określa potrzeby skóry.
 */
export function analyzeSkinProfile(answers: SkinProfileInput): Tag[] {
  const tags = new Set<Tag>();

  if (answers.dryness === "dry") tags.add(assertTag("HYDRATION"));
  if (answers.dryness === "oily") tags.add(assertTag("SEBUM"));

  if (answers.issues.includes("pores")) tags.add(assertTag("PORES"));
  if (answers.issues.includes("pigmentation")) tags.add(assertTag("PIGMENTATION"));
  if (answers.issues.includes("wrinkles")) tags.add(assertTag("ANTI_AGE"));
  if (answers.issues.includes("redness")) tags.add(assertTag("VASCULAR"));

  if (answers.reactive === true) tags.add(assertTag("CALMING"));

  if (tags.has(assertTag("SEBUM")) && tags.has(assertTag("PORES"))) {
    tags.add(assertTag("ACNE"));
  }

  return Array.from(tags);
}

const LABELS_PL: Record<string, string> = {
  HYDRATION: "nawilżenie",
  CALMING: "wyciszenie / reaktywność",
  PORES: "oczyszczanie porów",
  SEBUM: "regulacja sebum",
  ACNE: "trądzik",
  PIGMENTATION: "przebarwienia",
  ANTI_AGE: "stymulacja / zmarszczki",
  VASCULAR: "naczynka",
};

const DRYNESS_PL: Record<string, string> = {
  dry: "sucha",
  normal: "normalna",
  oily: "tłusta",
};

/**
 * Buduje kontekst techniczny dla AI (po polsku).
 * AI używa tylko tego opisu do wygenerowania human_readable_description.
 */
export function buildExplanationContext(
  tags: Tag[],
  answers: SkinProfileInput
): string {
  const parts: string[] = [];

  parts.push(`Typ cery: ${DRYNESS_PL[answers.dryness] ?? answers.dryness}.`);

  if (answers.reactive) {
    parts.push("Skóra reaktywna — wymaga wyciszenia i łagodnych procedur.");
  }

  const tagLabels = tags.map((t) => LABELS_PL[t] ?? t).filter(Boolean);
  if (tagLabels.length) {
    parts.push(`Zidentyfikowane potrzeby: ${tagLabels.join(", ")}.`);
  }

  if (tags.includes("HYDRATION")) {
    parts.push("Priorytet: odbudowa bariery hydrolipidowej i nawilżenie.");
  }
  if (tags.includes("SEBUM") || tags.includes("PORES")) {
    parts.push("Priorytet: delikatne oczyszczanie i regulacja sebum.");
  }
  if (tags.includes("CALMING")) {
    parts.push("Unikać agresywnych zabiegów — najpierw wyciszenie.");
  }

  return parts.join(" ");
}
