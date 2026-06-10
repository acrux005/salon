import type { DayPhase } from "@/lib/randki/dayRhythm";
import { DAY_PHASE_ORDER } from "@/lib/randki/dayRhythm";
import type { LiveFeedItem } from "@/lib/randki/liveFeed";
import type { RoomClimateId } from "@/lib/randki/roomClimate";
import { getConfiguredPhase, type UserRoomPhasesMap } from "@/lib/randki/roomPhases";

export const PHASE_CLIMATE_AFFINITY: Record<DayPhase, RoomClimateId[]> = {
  morning: ["warm-cafe", "quiet-reading", "cozy-orange"],
  day: ["warm-cafe", "city-lights", "lo-fi", "quiet-reading"],
  sunset: ["night-walk", "cozy-orange", "city-lights", "warm-cafe"],
  evening: ["moonlight-blue", "city-lights", "rainy", "lo-fi", "night-walk", "cozy-orange"],
  night: ["moonlight-blue", "lo-fi", "rainy", "quiet-reading", "night-walk"],
};

export const PHASE_ACTIVITY_AFFINITY: Record<DayPhase, string[]> = {
  morning: ["coffee", "calm", "walk"],
  day: ["cowork", "walk", "coffee"],
  sunset: ["walk", "music", "coffee"],
  evening: ["chat", "walk", "music"],
  night: ["chat", "music", "walk"],
};

export const PHASE_MOOD_AFFINITY: Record<DayPhase, string[]> = {
  morning: ["calm"],
  day: ["calm", "chat"],
  sunset: ["calm", "chat"],
  evening: ["chat", "flirt", "date"],
  night: ["calm", "chat"],
};

const PHASE_SOFT_FEED: Record<DayPhase, Omit<LiveFeedItem, "id">[]> = {
  morning: [
    { emoji: "☕", text: "Ktoś parzy kawę bez pośpiechu", ago: "teraz", tone: "amber" },
    { emoji: "📖", text: "Powolny start z książką", ago: "4 min temu", tone: "violet" },
    { emoji: "🌤", text: "Miękka obecność na poranek", ago: "9 min temu", tone: "rose" },
    { emoji: "🫂", text: "Ktoś też nie lubi pośpiechu rano", ago: "12 min temu", tone: "emerald" },
  ],
  day: [
    { emoji: "💻", text: "Cowork — ktoś też pracuje w ciszy", ago: "teraz", tone: "violet" },
    { emoji: "☕", text: "Lunch break bez pośpiechu", ago: "6 min temu", tone: "amber" },
    { emoji: "🎧", text: "Muzyka do pracy w tle", ago: "11 min temu", tone: "rose" },
    { emoji: "🫂", text: "Ktoś też ma ciężki dzień", ago: "18 min temu", tone: "emerald" },
  ],
  sunset: [
    { emoji: "🌆", text: "Golden hour — ktoś wraca do domu", ago: "teraz", tone: "amber" },
    { emoji: "🚶", text: "Spacer powrotny bez planu", ago: "5 min temu", tone: "rose" },
    { emoji: "🎷", text: "Muzyka w słuchawkach po drodze", ago: "14 min temu", tone: "violet" },
    { emoji: "✨", text: "Przejście z dnia w wieczór", ago: "20 min temu", tone: "emerald" },
  ],
  evening: [
    { emoji: "🌙", text: "Ktoś też nie może spać", ago: "teraz", tone: "violet" },
    { emoji: "🎷", text: "Ktoś słucha jazzu", ago: "3 min temu", tone: "violet" },
    { emoji: "🎙", text: "Voice — ktoś właśnie dołączył", ago: "teraz", tone: "violet" },
    { emoji: "☕", text: "Spokojna rozmowa po 22", ago: "14 min temu", tone: "rose" },
    { emoji: "🫂", text: "Ktoś dziś nie chce być sam", ago: "11 min temu", tone: "emerald" },
  ],
  night: [
    { emoji: "🌌", text: "Ktoś też nie może zasnąć", ago: "teraz", tone: "violet" },
    { emoji: "🎙", text: "Ambient voice — obecność bez presji", ago: "2 min temu", tone: "violet" },
    { emoji: "🚗", text: "Nocna jazda w tle", ago: "17 min temu", tone: "amber" },
    { emoji: "🌧", text: "Cicho — deszcz za oknem", ago: "25 min temu", tone: "rose" },
  ],
};

export function hasAnyPhaseConfiguration(phases: UserRoomPhasesMap): boolean {
  return DAY_PHASE_ORDER.some((p) => {
    const cfg = phases[p];
    if (!cfg) return false;
    return getConfiguredPhase(phases, p) !== null || cfg.active === false;
  });
}

/** Rano nie widzisz wieczornych pokoi — tylko te aktywne w aktualnej porze. */
export function shouldShowProfileInPhase(phases: UserRoomPhasesMap, phase: DayPhase): boolean {
  if (!hasAnyPhaseConfiguration(phases)) return true;
  const cfg = phases[phase];
  if (cfg?.active === false) return false;
  if (getConfiguredPhase(phases, phase)) return true;
  return false;
}

export function scorePhaseAffinity(input: {
  phase: DayPhase;
  mood: string | null;
  activityIntent: string | null;
  climateId?: RoomClimateId | null;
  voiceIntroUrl?: string | null;
}): number {
  const { phase, mood, activityIntent, climateId, voiceIntroUrl } = input;
  let score = 0;
  if (climateId && PHASE_CLIMATE_AFFINITY[phase].includes(climateId)) score += 20;
  if (mood && PHASE_MOOD_AFFINITY[phase].includes(mood)) score += 12;
  if (activityIntent && PHASE_ACTIVITY_AFFINITY[phase].includes(activityIntent)) score += 10;
  if (voiceIntroUrl && (phase === "evening" || phase === "night" || phase === "sunset")) score += 8;
  if (phase === "morning" && activityIntent === "coffee") score += 15;
  if (phase === "day" && activityIntent === "cowork") score += 12;
  return score;
}

export function getPhaseSoftFeedItems(phase: DayPhase): LiveFeedItem[] {
  return PHASE_SOFT_FEED[phase].map((item, i) => ({ id: `phase-soft-${phase}-${i}`, ...item }));
}
