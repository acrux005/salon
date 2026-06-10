import type { DayPhase } from "@/lib/randki/dayRhythm";
import { DAY_PHASES } from "@/lib/randki/dayRhythm";
import type { LiveFeedItem } from "@/lib/randki/liveFeed";
import { getPhaseSoftFeedItems, shouldShowProfileInPhase } from "@/lib/randki/phaseDiscovery";
import { applyRoomPhaseToDiscoveryCard, parseRoomPhasesJson } from "@/lib/randki/roomPhases";
import {
  DEMO_EVENING_DISCOVERY_CARDS,
  shouldShowDemoDiscoveryRooms,
} from "@/lib/randki/demoDiscoveryCards";
import { demoPersonaFeedLine, DEMO_PERSONA_META } from "@/lib/randki/demoRoomProfiles";
import { applyDemoRoomRotation, minutesUntilNextRotation, rotationFeedLines } from "@/lib/randki/roomRotation";
import { todayStateLabel, demoTodayStateForPersona } from "@/lib/randki/todayState";

export function shouldShowDemoDayRhythm(): boolean {
  return shouldShowDemoDiscoveryRooms();
}

function phaseSortOffset(phase: DayPhase): number {
  const offsets: Record<DayPhase, number> = {
    morning: 0,
    day: 2,
    sunset: 4,
    evening: 1,
    night: 7,
  };
  return offsets[phase];
}

export function getDemoDiscoveryCardsForPhase(phase: DayPhase) {
  const offset = phaseSortOffset(phase);
  const rotated = [
    ...DEMO_EVENING_DISCOVERY_CARDS.slice(offset),
    ...DEMO_EVENING_DISCOVERY_CARDS.slice(0, offset),
  ];

  const active = rotated
    .filter((card) => {
      const phases = parseRoomPhasesJson(card.roomPhasesJson);
      return shouldShowProfileInPhase(phases, phase);
    })
    .map((card) => {
      const phases = parseRoomPhasesJson(card.roomPhasesJson);
      const n = parseInt(card.accountId.replace(/\D/g, ""), 10) || 1;
      const phased = applyRoomPhaseToDiscoveryCard(card, phases, phase);
      return { ...phased, todayState: demoTodayStateForPersona(n) };
    });

  const base =
    active.length > 0
      ? active
      : rotated.map((card) => {
          const phases = parseRoomPhasesJson(card.roomPhasesJson);
          const n = parseInt(card.accountId.replace(/\D/g, ""), 10) || 1;
          return {
            ...applyRoomPhaseToDiscoveryCard(card, phases, phase),
            todayState: demoTodayStateForPersona(n),
          };
        });

  return applyDemoRoomRotation(base, phase);
}

export function getDemoLiveFeedForPhase(phase: DayPhase): LiveFeedItem[] {
  const base = getPhaseSoftFeedItems(phase);
  const personaItems: LiveFeedItem[] = [];

  for (let round = 0; round < 2; round++) {
    for (let i = 1; i <= 10; i++) {
      personaItems.push({
        id: `demo-persona-${phase}-${round}-${i}`,
        emoji: phase === "evening" || phase === "night" ? "🎙" : phase === "morning" ? "☕" : "✨",
        text: demoPersonaFeedLine(i, phase),
        ago: round === 0 && i <= 2 ? "teraz" : `${2 + i * 2 + round * 5} min temu`,
        tone: i % 4 === 0 ? "emerald" : i % 3 === 0 ? "amber" : i % 2 === 0 ? "violet" : "rose",
      });
    }
  }

  const online = 87 + (phase === "evening" ? 40 : phase === "day" ? 21 : phase === "sunset" ? 25 : 0);

  const filler: LiveFeedItem[] = [
    { id: `demo-fill-a-${phase}`, emoji: "🫂", text: `${online} osób obecnych w tej porze`, ago: "teraz", tone: "emerald" },
    { id: `demo-fill-b-${phase}`, emoji: "🌙", text: `${DAY_PHASES[phase].label} — pokoje się wypełniają`, ago: "1 min temu", tone: "violet" },
    { id: `demo-fill-c-${phase}`, emoji: "✨", text: "Ktoś właśnie ustawił klimat pokoju", ago: "4 min temu", tone: "rose" },
    { id: `demo-fill-d-${phase}`, emoji: "🎧", text: "Muzyka w tle — ktoś dołączył", ago: "6 min temu", tone: "violet" },
    { id: `demo-fill-e-${phase}`, emoji: "📸", text: "Nowy moment w pokoju obok", ago: "9 min temu", tone: "amber" },
    { id: `demo-fill-f-${phase}`, emoji: "🚶", text: "Spacer powrotny bez planu", ago: "14 min temu", tone: "rose" },
  ];

  const rotationLines = rotationFeedLines(phase, getDemoDiscoveryCardsForPhase(phase));
  const rotationItems: LiveFeedItem[] = rotationLines.map((text, i) => ({
    id: `demo-rotation-${phase}-${i}`,
    emoji: i === 0 ? "🚪" : "🌬️",
    text,
    ago: i === 0 ? "teraz" : `${1 + i} min temu`,
    tone: "violet" as const,
  }));

  const stateItems: LiveFeedItem[] = [];
  for (let i = 1; i <= 4; i++) {
    const label = todayStateLabel(demoTodayStateForPersona(i));
    if (!label) continue;
    stateItems.push({
      id: `demo-state-${phase}-${i}`,
      emoji: "💭",
      text: `${DEMO_PERSONA_META[i]?.firstName ?? "Ktoś"}: ${label.replace(/^[^\s]+\s/, "")}`,
      ago: `${3 + i * 4} min temu`,
      tone: "rose",
    });
  }

  return [...rotationItems.slice(0, 2), ...personaItems, ...stateItems.slice(0, 2), ...base, ...filler].slice(0, 26);
}

export function getDemoOnlineCountForPhase(phase: DayPhase): number {
  const base: Record<DayPhase, number> = {
    morning: 94,
    day: 108,
    sunset: 112,
    evening: 127,
    night: 86,
  };
  const jitter = new Date().getMinutes() % 7;
  return base[phase] + jitter;
}

export function getDemoPresentCountForPhase(_phase: DayPhase, activeCards: number): number {
  return Math.min(8, Math.max(4, activeCards));
}
