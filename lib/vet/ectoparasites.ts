import { getPreventionPlanForSpecies } from "@/lib/vet/preventionPlans";
import { normalizeSpeciesValue } from "@/lib/vet/speciesCatalog";

const ECTOPARASITE_NAME_KEYWORDS = [
  "ektop",
  "pchł",
  "kleszcz",
  "flea",
  "tick",
  "frontline",
  "bravecto",
  "simparica",
  "nexgard",
  "stronghold",
  "advocate",
  "spot-on",
  "pipeta",
  "seresto",
  "scalibor",
  "fipronil",
];

export function isEctoparasiteEntry(name: string): boolean {
  const hay = name.toLowerCase();
  return ECTOPARASITE_NAME_KEYWORDS.some((kw) => hay.includes(kw));
}

export function resolveEctoparasiteItemKey(species: string): string | null {
  const s = normalizeSpeciesValue(species);
  if (s === "kot") return "kot_flea_tick";
  if (s === "pies") return "pies_flea_tick";

  const plan = getPreventionPlanForSpecies(s);
  const item = plan?.items.find(
    (i) => i.kind === "profilaktyka" && i.matchKeywords.some((kw) => ["pchł", "kleszcz"].some((k) => kw.includes(k)))
  );
  return item?.key ?? plan?.items.find((i) => i.matchKeywords.some((kw) => kw.includes("pchł")))?.key ?? null;
}

export function getEctoparasiteIntervalDays(species: string): number {
  const key = resolveEctoparasiteItemKey(species);
  if (!key) return 90;
  const plan = getPreventionPlanForSpecies(normalizeSpeciesValue(species));
  const item = plan?.items.find((i) => i.key === key);
  return item?.repeatIntervalDays ?? 90;
}

export function ectoparasiteItemTitle(species: string): string {
  const key = resolveEctoparasiteItemKey(species);
  if (!key) return "Profilaktyka ektopasożytów";
  const plan = getPreventionPlanForSpecies(normalizeSpeciesValue(species));
  return plan?.items.find((i) => i.key === key)?.title ?? "Profilaktyka pchły i kleszczy";
}
