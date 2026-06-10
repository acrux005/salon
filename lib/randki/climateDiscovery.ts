import type { RandkiDiscoveryCard } from "@/lib/randki/matching";
import type { RoomClimateId } from "@/lib/randki/roomClimate";
import { getRoomClimateForCard, getRoomTemperatureForCard } from "@/lib/randki/roomClimate";
import { todayStateLabel } from "@/lib/randki/todayState";

export type ClimateSearchTag = {
  id: string;
  emoji: string;
  label: string;
  hint: string;
  climates?: RoomClimateId[];
  moods?: string[];
  activities?: string[];
  todayStates?: string[];
  requiresVoice?: boolean;
  keywords?: string[];
};

/** Emocjonalne tagi — nie filtry demograficzne. */
export const CLIMATE_SEARCH_TAGS: ClimateSearchTag[] = [
  {
    id: "coffee-bg",
    emoji: "☕",
    label: "Kawa w tle",
    hint: "spokojny start · szum kawiarni",
    climates: ["warm-cafe", "cozy-orange"],
    activities: ["coffee"],
    keywords: ["kawa", "herbata", "para"],
  },
  {
    id: "night-talk",
    emoji: "🌙",
    label: "Nocne rozmowy",
    hint: "głęboko · po 22",
    climates: ["moonlight-blue", "city-lights", "lo-fi"],
    moods: ["chat", "flirt"],
    keywords: ["noc", "jazz", "głęb"],
  },
  {
    id: "quiet-presence",
    emoji: "📚",
    label: "Cisza i obecność",
    hint: "bez pośpiechu · obecność w tle",
    climates: ["quiet-reading", "rainy"],
    moods: ["calm"],
    todayStates: ["quiet", "calm_people", "low_energy"],
    keywords: ["cisza", "cicho", "obecność"],
  },
  {
    id: "walk-free",
    emoji: "🚶",
    label: "Spacer bez planu",
    hint: "ulica · wiatr · golden hour",
    climates: ["night-walk", "city-lights"],
    activities: ["walk"],
    todayStates: ["walk_mood"],
    keywords: ["spacer", "molo", "ulica"],
  },
  {
    id: "voice-first",
    emoji: "🎙",
    label: "Wolę głos niż pisanie",
    hint: "voice · ambient obecność",
    requiresVoice: true,
    todayStates: ["voice"],
    keywords: ["głos", "voice"],
  },
  {
    id: "melancholy",
    emoji: "🌧",
    label: "Melancholia",
    hint: "deszcz · miękko · nostalgia",
    climates: ["rainy", "moonlight-blue", "lo-fi"],
    moods: ["calm"],
    keywords: ["deszcz", "melanch", "notes"],
  },
  {
    id: "spark-today",
    emoji: "✨",
    label: "Dziś coś iskrzy",
    hint: "otwarty · lekka energia",
    moods: ["flirt", "chat", "date"],
    todayStates: ["spark", "open_chat"],
    keywords: ["iskr", "śmiech", "wino"],
  },
  {
    id: "cinema-talk",
    emoji: "🎬",
    label: "Kino i rozmowa",
    hint: "fabuła w tle · rozmowa ważniejsza",
    activities: ["culture", "music"],
    moods: ["chat"],
    keywords: ["kino", "thriller", "film", "winyl", "płyta"],
  },
];

export type ClimateSecondaryFilters = {
  voiceOnly: boolean;
  textPreferred: boolean;
};

export const DEFAULT_CLIMATE_SECONDARY: ClimateSecondaryFilters = {
  voiceOnly: false,
  textPreferred: false,
};

const TAG_BY_ID = new Map(CLIMATE_SEARCH_TAGS.map((t) => [t.id, t]));

export function getClimateSearchTag(id: string): ClimateSearchTag | undefined {
  return TAG_BY_ID.get(id);
}

function cardHaystack(card: RandkiDiscoveryCard): string {
  const climate = getRoomClimateForCard(card);
  const temp = getRoomTemperatureForCard(card);
  const quote = card.prompts[0]?.answer ?? "";
  const micro = todayStateLabel(card.todayState) ?? "";
  return [
    climate.label,
    climate.tagline,
    temp,
    quote,
    micro,
    card.bio,
    card.whyReason,
    card.activityIntent ?? "",
    card.mood ?? "",
  ]
    .join(" ")
    .toLowerCase();
}

export function scoreCardForClimateTag(card: RandkiDiscoveryCard, tagId: string): number {
  const tag = TAG_BY_ID.get(tagId);
  if (!tag) return 0;

  let score = 0;
  const climateId = card.roomClimateId ?? getRoomClimateForCard(card).id;
  const hay = cardHaystack(card);

  if (tag.climates?.includes(climateId)) score += 28;
  if (tag.moods?.includes(card.mood ?? "")) score += 18;
  if (tag.activities?.includes(card.activityIntent ?? "")) score += 16;
  if (tag.todayStates?.includes(card.todayState ?? "")) score += 22;
  if (tag.requiresVoice && card.voiceIntroUrl) score += 30;
  if (tag.keywords?.some((k) => hay.includes(k.toLowerCase()))) score += 12;

  return score;
}

export function scoreCardForClimateSearch(
  card: RandkiDiscoveryCard,
  activeTagIds: string[],
  secondary: ClimateSecondaryFilters
): number {
  if (activeTagIds.length === 0) {
    if (secondary.voiceOnly && !card.voiceIntroUrl) return -1;
    if (secondary.textPreferred && card.voiceIntroUrl) return -1;
    return 1;
  }

  if (secondary.voiceOnly && !card.voiceIntroUrl) return -1;
  if (secondary.textPreferred && card.voiceIntroUrl) return -1;

  const best = Math.max(...activeTagIds.map((id) => scoreCardForClimateTag(card, id)));
  return best > 0 ? best : -1;
}

export function filterCardsByClimateSearch(
  cards: RandkiDiscoveryCard[],
  activeTagIds: string[],
  secondary: ClimateSecondaryFilters = DEFAULT_CLIMATE_SECONDARY
): RandkiDiscoveryCard[] {
  const scored = cards
    .map((card) => ({
      card,
      score: scoreCardForClimateSearch(card, activeTagIds, secondary),
    }))
    .filter((s) => s.score > 0);

  if (scored.length === 0 && activeTagIds.length > 0) {
    return cards.slice(0, Math.max(3, Math.ceil(cards.length / 3)));
  }

  scored.sort((a, b) => b.score - a.score || a.card.displayName.localeCompare(b.card.displayName));
  return scored.map((s) => s.card);
}

export function activeClimateLabels(activeTagIds: string[]): string {
  if (activeTagIds.length === 0) return "";
  return activeTagIds
    .map((id) => TAG_BY_ID.get(id))
    .filter(Boolean)
    .map((t) => `${t!.emoji} ${t!.label}`)
    .join(" · ");
}
