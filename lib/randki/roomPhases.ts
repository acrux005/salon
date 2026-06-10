import type { DayPhase } from "@/lib/randki/dayRhythm";
import { DAY_PHASE_ORDER, DAY_PHASES } from "@/lib/randki/dayRhythm";
import type { RandkiDiscoveryCard } from "@/lib/randki/matching";
import {
  ROOM_CLIMATES,
  type RoomClimateId,
  getRoomClimateForCard,
} from "@/lib/randki/roomClimate";

export type UserRoomPhaseConfig = {
  climateId?: RoomClimateId | null;
  mood?: string | null;
  activityIntent?: string | null;
  quote?: string;
  temperature?: string;
  active?: boolean;
};

export type UserRoomPhasesMap = Partial<Record<DayPhase, UserRoomPhaseConfig>>;

const DEFAULT_CLIMATE: Record<DayPhase, RoomClimateId> = {
  morning: "warm-cafe",
  day: "warm-cafe",
  sunset: "cozy-orange",
  evening: "moonlight-blue",
  night: "lo-fi",
};

export function parseRoomPhasesJson(raw: string | null | undefined): UserRoomPhasesMap {
  if (!raw?.trim()) return {};
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const out: UserRoomPhasesMap = {};
    for (const phase of DAY_PHASE_ORDER) {
      const entry = (parsed as Record<string, unknown>)[phase];
      if (!entry || typeof entry !== "object" || Array.isArray(entry)) continue;
      const e = entry as Record<string, unknown>;
      const climateId =
        typeof e.climateId === "string" && e.climateId in ROOM_CLIMATES
          ? (e.climateId as RoomClimateId)
          : undefined;
      out[phase] = {
        climateId: climateId ?? null,
        mood: typeof e.mood === "string" ? e.mood : e.mood === null ? null : undefined,
        activityIntent:
          typeof e.activityIntent === "string" ? e.activityIntent : e.activityIntent === null ? null : undefined,
        quote: typeof e.quote === "string" ? e.quote.slice(0, 160) : undefined,
        temperature: typeof e.temperature === "string" ? e.temperature.slice(0, 48) : undefined,
        active: typeof e.active === "boolean" ? e.active : undefined,
      };
    }
    return out;
  } catch {
    return {};
  }
}

export function serializeRoomPhasesMap(map: UserRoomPhasesMap): string {
  const clean: UserRoomPhasesMap = {};
  for (const phase of DAY_PHASE_ORDER) {
    const cfg = map[phase];
    if (!cfg) continue;
    const hasData =
      cfg.climateId ||
      cfg.mood ||
      cfg.activityIntent ||
      cfg.quote?.trim() ||
      cfg.temperature?.trim() ||
      cfg.active === false;
    if (!hasData) continue;
    clean[phase] = {
      climateId: cfg.climateId ?? null,
      mood: cfg.mood ?? null,
      activityIntent: cfg.activityIntent ?? null,
      quote: cfg.quote?.trim() || undefined,
      temperature: cfg.temperature?.trim() || undefined,
      active: cfg.active,
    };
  }
  return JSON.stringify(clean);
}

export function getConfiguredPhase(map: UserRoomPhasesMap, phase: DayPhase): UserRoomPhaseConfig | null {
  const cfg = map[phase];
  if (!cfg || cfg.active === false) return null;
  const hasData =
    cfg.climateId ||
    cfg.mood ||
    cfg.activityIntent ||
    cfg.quote?.trim() ||
    cfg.temperature?.trim();
  return hasData ? cfg : null;
}

export function defaultPhaseConfig(phase: DayPhase): UserRoomPhaseConfig {
  const meta = DAY_PHASES[phase];
  return {
    climateId: DEFAULT_CLIMATE[phase],
    mood: phase === "morning" || phase === "day" ? "calm" : "chat",
    activityIntent: phase === "day" ? "cowork" : phase === "morning" ? "coffee" : "walk",
    quote: "",
    temperature: meta.ambientChips[0]?.replace(/^[^\s]+\s/, "") ?? meta.energy.split("·")[0]?.trim(),
    active: true,
  };
}

export function applyRoomPhaseToDiscoveryCard(
  card: RandkiDiscoveryCard,
  phases: UserRoomPhasesMap,
  phase: DayPhase
): RandkiDiscoveryCard {
  const cfg = getConfiguredPhase(phases, phase);
  if (!cfg) return card;

  const quote = cfg.quote?.trim();
  const prompts =
    quote && card.prompts.length > 0
      ? [{ ...card.prompts[0], answer: quote }, ...card.prompts.slice(1)]
      : quote
        ? [{ question: "Teraz w pokoju", answer: quote }, ...card.prompts]
        : card.prompts;

  return {
    ...card,
    mood: cfg.mood !== undefined && cfg.mood !== null ? cfg.mood : card.mood,
    activityIntent:
      cfg.activityIntent !== undefined && cfg.activityIntent !== null ? cfg.activityIntent : card.activityIntent,
    auraCaption: quote || card.auraCaption,
    prompts,
    roomClimateId: cfg.climateId ?? card.roomClimateId,
    roomTemperature: cfg.temperature?.trim() || card.roomTemperature,
  };
}

export function resolveCardClimateId(card: RandkiDiscoveryCard): RoomClimateId {
  if (card.roomClimateId && card.roomClimateId in ROOM_CLIMATES) {
    return card.roomClimateId;
  }
  return getRoomClimateForCard(card).id;
}

export function applyRoomPhaseToLivePreview<T extends {
  mood?: string | null;
  prompts: { question: string; answer: string }[];
  auraCaption?: string | null;
}>(
  room: T,
  phases: UserRoomPhasesMap,
  phase: DayPhase
): T & { previewClimateId?: RoomClimateId; previewTemperature?: string } {
  const cfg = getConfiguredPhase(phases, phase);
  if (!cfg) return room;
  const quote = cfg.quote?.trim();
  return {
    ...room,
    mood: cfg.mood ?? room.mood,
    auraCaption: quote || room.auraCaption,
    prompts:
      quote && room.prompts.length > 0
        ? [{ ...room.prompts[0], answer: quote }, ...room.prompts.slice(1)]
        : quote
          ? [{ question: DAY_PHASES[phase].label, answer: quote }, ...room.prompts]
          : room.prompts,
    previewClimateId: cfg.climateId ?? undefined,
    previewTemperature: cfg.temperature,
  };
}

export function sanitizeRoomPhasesInput(map: UserRoomPhasesMap): UserRoomPhasesMap {
  const out: UserRoomPhasesMap = {};
  for (const phase of DAY_PHASE_ORDER) {
    const cfg = map[phase];
    if (!cfg) continue;
    out[phase] = {
      climateId:
        cfg.climateId && cfg.climateId in ROOM_CLIMATES ? cfg.climateId : cfg.climateId === null ? null : undefined,
      mood: cfg.mood ?? null,
      activityIntent: cfg.activityIntent ?? null,
      quote: cfg.quote?.slice(0, 160),
      temperature: cfg.temperature?.slice(0, 48),
      active: cfg.active,
    };
  }
  return out;
}
