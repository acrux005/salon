// lib/skinmatch/legacyQuiz.ts
import type { QuizTag } from "./schema";

/** Stała kolejność tagów — deterministyczne wyniki. */
export const QUIZ_TAG_ORDER: readonly QuizTag[] = [
  "acne",
  "pores",
  "blackheads",
  "pigmentation",
  "antiaging",
  "wrinkles",
  "redness",
  "couperose",
  "dryness",
  "dehydration",
  "sensitivity",
  "firmness",
  "sagging_oval",
];

const VALID_TAG_SET = new Set<string>(QUIZ_TAG_ORDER);

/**
 * Usuwa duplikaty, filtruje tylko poprawne QuizTag, sortuje wg QUIZ_TAG_ORDER.
 */
export function sortTags(tags: readonly string[] | QuizTag[]): QuizTag[] {
  const seen = new Set<QuizTag>();
  const filtered: QuizTag[] = [];
  for (const t of tags) {
    const s = String(t).trim().toLowerCase();
    if (VALID_TAG_SET.has(s) && !seen.has(s as QuizTag)) {
      seen.add(s as QuizTag);
      filtered.push(s as QuizTag);
    }
  }
  return QUIZ_TAG_ORDER.filter((tag) => seen.has(tag));
}

export type LegacyAnalyzePayload = {
  /** sucha: true / "dry" | tłusta: "oily" | normal: "normal" / false */
  dryness?: boolean | number | "dry" | "normal" | "oily";
  reactive?: boolean | number;
  issues?: string[]; // np. ["pory", "pores", "zaskorniki", "tradzik", "przebarwienia", "zmarszczki", "naczynka"]
};

function asBool(v: unknown): boolean {
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v > 0;
  if (typeof v === "string") return ["1", "true", "yes", "tak"].includes(v.toLowerCase());
  return false;
}

/**
 * Normalizuje stary quiz do nowego świata tagów.
 * Zwraca stabilny zestaw QuizTag[] (bez duplikatów).
 */
export function legacyToQuizTags(payload: LegacyAnalyzePayload): QuizTag[] {
  const out = new Set<QuizTag>();

  // 1) dryness: "dry"|"normal"|"oily" lub boolean
  const dry = payload.dryness === "dry" || asBool(payload.dryness);
  const oily = payload.dryness === "oily";
  if (dry) {
    out.add("dryness");
    out.add("dehydration");
  }
  if (oily) {
    out.add("acne");
    out.add("pores");
    out.add("blackheads");
  }
  if (asBool(payload.reactive)) {
    out.add("sensitivity");
    out.add("redness");
  }

  // 2) issues[] -> tagi
  const issues = (payload.issues ?? []).map((s) => String(s).trim().toLowerCase());

  for (const i of issues) {
    if (["tradzik", "wypryski", "acne"].includes(i)) out.add("acne");
    if (["pory", "pores", "rozszerzone pory", "pore"].includes(i)) out.add("pores");
    if (["zaskorniki", "blackheads", "wągry", "wagry"].includes(i)) out.add("blackheads");

    if (["przebarwienia", "pigmentacja", "pigmentation", "plamy"].includes(i))
      out.add("pigmentation");

    if (["antiaging", "anti-aging", "starzenie", "aging"].includes(i)) out.add("antiaging");
    if (["zmarszczki", "wrinkles", "linie"].includes(i)) out.add("wrinkles");

    if (["naczynka", "rumien", "rumień", "redness", "couperose"].includes(i)) {
      out.add("redness");
      out.add("couperose");
    }

    if (["jedrnosc", "jędrność", "firmness", "utrata jędrności"].includes(i)) out.add("firmness");
    if (["owal", "opadajacy owal", "opadający owal", "sagging"].includes(i)) out.add("sagging_oval");
  }

  return sortTags(Array.from(out));
}

/**
 * Jeśli FE dostaje już tags[] — zostawia,
 * jeśli nie — próbuje z legacy pól.
 */
export function normalizeTags(input: {
  tags?: QuizTag[] | readonly string[];
  dryness?: boolean | number | "dry" | "normal" | "oily";
  reactive?: boolean | number;
  issues?: string[];
}): QuizTag[] {
  if (Array.isArray(input.tags) && input.tags.length > 0) {
    return sortTags(input.tags);
  }
  return legacyToQuizTags({
    dryness: input.dryness,
    reactive: input.reactive,
    issues: input.issues,
  });
}
