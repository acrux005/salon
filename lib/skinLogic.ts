/**
 * Logika profilu skóry i mapa zabiegów (bez AI).
 */

export type TypSkory = "sucha" | "normalna" | "tlusta";
export type Problem =
  | "pory_zaskorniki"
  | "przebarwienia"
  | "zmarszczki"
  | "wrazliwosc_naczynkowa";

export interface SkinProfile {
  typ_skory: TypSkory;
  problemy: Problem[];
  reaktywna: boolean;
  jezyk: string;
}

/** Wartości P1 → typ skóry */
const P1_TO_TYP: Record<string, TypSkory> = {
  "sciagnieta_sucha": "sucha",
  "komfortowa": "normalna",
  "swiecąca_tlusta": "tlusta",
};

/** Wartości P2 (multi) → problemy */
const P2_TO_PROBLEM: Record<string, Problem> = {
  pory_zaskorniki: "pory_zaskorniki",
  przebarwienia_szarosc: "przebarwienia",
  zmarszczki_jedrnosc: "zmarszczki",
  rumien_pieczenie: "wrazliwosc_naczynkowa",
};

/** Mapa zabiegów (stała w kodzie) */
export const MAPA_ZABIEGOW: Record<string, string[]> = {
  sucha: [
    "Mezoterapia bezigłowa",
    "Infuzja tlenowa",
    "Zabieg z kwasem hialuronowym",
  ],
  normalna: [
    "Mezoterapia bezigłowa",
    "Infuzja tlenowa",
    "Zabieg z kwasem hialuronowym",
  ],
  tlusta: [
    "Peeling kawitacyjny",
    "Mikrodermabrazja",
    "Peeling chemiczny AHA/BHA",
  ],
  zmarszczki: [
    "Radiofrekwencja mikroigłowa",
    "Mezoterapia igłowa",
    "Zabiegi stymulujące kolagen",
  ],
  przebarwienia: [
    "Peeling azelainowy",
    "Terapia wit. C",
    "IPL (jeśli dostępne i po kwalifikacji)",
  ],
  pory_zaskorniki: [
    "Peeling kawitacyjny",
    "Mikrodermabrazja",
    "Peeling chemiczny AHA/BHA",
  ],
  wrazliwa: [
    "Zabiegi łagodzące",
    "Maska algowa chłodząca",
    "Wyciszenie i odbudowa bariery",
  ],
};

/**
 * Buduje profil z odpowiedzi quizu.
 */
export function buildProfile(answers: {
  p1: string;
  p2: string[];
  p3: string;
}): SkinProfile {
  const typ_skory = P1_TO_TYP[answers.p1] ?? "normalna";
  const problemy = answers.p2
    .map((v) => P2_TO_PROBLEM[v])
    .filter((p): p is Problem => p != null);
  const reaktywna = answers.p3 === "tak";

  return {
    typ_skory,
    problemy,
    reaktywna,
    jezyk: "pl",
  };
}

/**
 * Zwraca listę rekomendowanych zabiegów na podstawie profilu (deduplikacja).
 */
export function getTreatmentsFromProfile(profile: SkinProfile): string[] {
  const keys: string[] = [profile.typ_skory, ...profile.problemy];
  if (profile.reaktywna) keys.push("wrazliwa");

  const set = new Set<string>();
  for (const key of keys) {
    const list = MAPA_ZABIEGOW[key];
    if (list) list.forEach((z) => set.add(z));
  }
  return Array.from(set);
}

export const VALID_TYP_SKORY: TypSkory[] = ["sucha", "normalna", "tlusta"];
