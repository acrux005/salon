import { ageInWeeks } from "@/lib/vet/preventionEngine";
import { getPreventionPlanForSpecies } from "@/lib/vet/preventionPlans";
import { normalizeSpeciesValue } from "@/lib/vet/speciesCatalog";

const DEWORMING_NAME_KEYWORDS = [
  "odrobacz",
  "odrob",
  "dehelm",
  "helmint",
  "endoparazyt",
  "drontal",
  "milbemax",
  "panacur",
  "fenbendazol",
  "pyrantel",
  "praziquantel",
  "worm",
];

export function isDewormingEntry(name: string): boolean {
  const hay = name.toLowerCase();
  return DEWORMING_NAME_KEYWORDS.some((kw) => hay.includes(kw));
}

export function resolveDewormItemKey(species: string, birthDate: string | null): string | null {
  const s = normalizeSpeciesValue(species);
  const ageWeeks = ageInWeeks(birthDate);
  const young = ageWeeks != null && ageWeeks <= 16;

  if (s === "kot") return young ? "kot_deworm_puppy" : "kot_deworm_adult";
  if (s === "pies") return young ? "pies_deworm_puppy" : "pies_deworm_adult";

  const plan = getPreventionPlanForSpecies(s);
  const dewormItem = plan?.items.find((i) => i.kind === "odrobaczanie");
  return dewormItem?.key ?? null;
}

export function getDewormIntervalDays(species: string, birthDate: string | null): number {
  const key = resolveDewormItemKey(species, birthDate);
  if (!key) return 90;
  const plan = getPreventionPlanForSpecies(normalizeSpeciesValue(species));
  const item = plan?.items.find((i) => i.key === key);
  return item?.repeatIntervalDays ?? 90;
}

export function dewormItemTitle(species: string, birthDate: string | null): string {
  const key = resolveDewormItemKey(species, birthDate);
  if (!key) return "Odrobaczanie";
  const plan = getPreventionPlanForSpecies(normalizeSpeciesValue(species));
  return plan?.items.find((i) => i.key === key)?.title ?? "Odrobaczanie";
}

export type BookletSection = "szczepienia" | "odrobaczanie" | "ektopasożyty" | "leczenie" | "inne";

export function normalizeBookletSection(value: string | null | undefined): BookletSection {
  if (!value) return "inne";
  const v = value.toLowerCase();
  if (v.includes("lecz") || v.includes("terapia") || v.includes("rozpoznan") || v.includes("diagnoz")) {
    return "leczenie";
  }
  if (v.includes("ektop") || v.includes("pchł") || v.includes("kleszcz") || v.includes("flea") || v.includes("tick")) {
    return "ektopasożyty";
  }
  if (v.includes("odrob") || v.includes("helmint") || v.includes("endoparazyt")) return "odrobaczanie";
  if (v.includes("szczep") || v.includes("vaccin") || v.includes("immuni")) return "szczepienia";
  return "inne";
}

export function bookletSectionLabel(section: BookletSection): string {
  if (section === "szczepienia") return "Strona szczepień";
  if (section === "odrobaczanie") return "Strona odrobaczania (endopasożyty)";
  if (section === "ektopasożyty") return "Strona ektopasożytów";
  if (section === "leczenie") return "Strona leczenia";
  return "Inna strona książeczki";
}

export type ReceptionMode = "szczepienie" | "odrobaczanie" | "ektopasożyty" | "leczenie";

export function normalizeReceptionMode(value: string | null | undefined): ReceptionMode {
  if (value === "odrobaczanie") return "odrobaczanie";
  if (value === "ektopasożyty" || value === "ektopasozyty") return "ektopasożyty";
  if (value === "leczenie") return "leczenie";
  return "szczepienie";
}
