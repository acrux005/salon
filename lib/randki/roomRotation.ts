import type { DayPhase } from "@/lib/randki/dayRhythm";
import type { RandkiDiscoveryCard } from "@/lib/randki/matching";
import { climateClass, ROOM_CLIMATES, type RoomClimateId } from "@/lib/randki/roomClimate";
import { todayStateLabel } from "@/lib/randki/todayState";
import {
  type EphemeralDuration,
  EPHEMERAL_DURATION_LABELS,
  ephemeralRoomIdFromPool,
  isEphemeralExpired,
  msUntilExpiry,
  resolveEphemeralExpiresAt,
} from "@/lib/randki/ephemeralRooms";

export const ROTATION_SLOT_MINUTES = 30;

export type RoomRotationFlags = {
  rotationNew?: boolean;
  rotationClosing?: boolean;
  rotationOpensInMin?: number;
  ephemeralDuration?: EphemeralDuration;
  ephemeralDurationLabel?: string;
  ephemeralExpiresAt?: string;
};

export type RotatedDiscoveryCard = RandkiDiscoveryCard & RoomRotationFlags;

type EphemeralRoom = {
  id: string;
  displayName: string;
  climateId: RoomClimateId;
  quote: string;
  temperature: string;
  todayState: string;
  phases: DayPhase[];
  duration: EphemeralDuration;
};

const EPHEMERAL_POOL: EphemeralRoom[] = [
  {
    id: "ephemeral-dawn-brew",
    displayName: "Gość · poranek",
    climateId: "warm-cafe",
    quote: "Ktoś właśnie otworzył okno — miasto jeszcze śpi.",
    temperature: "świeże powietrze · cisza",
    todayState: "slow",
    phases: ["morning"],
    duration: "until_sunrise",
  },
  {
    id: "ephemeral-rain-read",
    displayName: "Gość · deszcz",
    climateId: "rainy",
    quote: "Deszcz na szybie — linie światła w notesie.",
    temperature: "deszcz · obecność",
    todayState: "quiet",
    phases: ["morning", "day", "evening"],
    duration: "hours_2",
  },
  {
    id: "ephemeral-sunset-walk",
    displayName: "Gość · zachód",
    climateId: "night-walk",
    quote: "Spacer bez mapy — zobaczymy dokąd.",
    temperature: "golden hour · wiatr",
    todayState: "walk_mood",
    phases: ["sunset"],
    duration: "slot_30m",
  },
  {
    id: "ephemeral-night-vinyl",
    displayName: "Gość · noc",
    climateId: "lo-fi",
    quote: "Płyta od początku do końca — nic więcej.",
    temperature: "vinyl crackle · cicho",
    todayState: "low_energy",
    phases: ["night", "evening"],
    duration: "evening",
  },
  {
    id: "ephemeral-moon-voice",
    displayName: "Gość · głos",
    climateId: "moonlight-blue",
    quote: "Voice zamiast pisania — jestem tu.",
    temperature: "głos aktywny · jazz w tle",
    todayState: "voice",
    phases: ["evening", "night"],
    duration: "slot_30m",
  },
  {
    id: "ephemeral-day-cowork",
    displayName: "Gość · cowork",
    climateId: "quiet-reading",
    quote: "Praca w ciszy, bez pośpiechu i bez kamery.",
    temperature: "cicho · obecność w tle",
    todayState: "calm_people",
    phases: ["day"],
    duration: "hours_2",
  },
];

function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function getRotationSlotKey(phase: DayPhase, at = new Date()): string {
  const day = at.toISOString().slice(0, 10);
  const minutes = at.getHours() * 60 + at.getMinutes();
  const slot = Math.floor(minutes / ROTATION_SLOT_MINUTES);
  return `${day}:${phase}:${slot}`;
}

export function minutesUntilNextRotation(at = new Date()): number {
  const minInSlot = at.getMinutes() % ROTATION_SLOT_MINUTES;
  const secPart = at.getSeconds() / 60;
  return Math.max(1, Math.ceil(ROTATION_SLOT_MINUTES - minInSlot - secPart));
}

function ephemeralToCard(room: EphemeralRoom, phase: DayPhase, flags: RoomRotationFlags, at = new Date()): RotatedDiscoveryCard {
  const climate = ROOM_CLIMATES[room.climateId];
  const stateLabel = todayStateLabel(room.todayState);
  const expiresAt = resolveEphemeralExpiresAt(room.duration, phase, room.id, at);
  const durationLabel = EPHEMERAL_DURATION_LABELS[room.duration];
  return {
    accountId: ephemeralRoomIdFromPool(room.id),
    displayName: room.displayName,
    age: 0,
    city: "obecność",
    gender: "other",
    bio: stateLabel ?? "",
    photoUrl: null,
    photoUrls: [],
    interests: [],
    prompts: [{ question: "Teraz w pokoju", answer: room.quote }],
    interestScore: 0,
    compatibilityScore: 0,
    whyReason: room.quote,
    socialProof: [],
    mood: "calm",
    intention: "relacja",
    voiceIntroUrl: null,
    activityIntent: null,
    communicationStyle: null,
    circleSlug: null,
    circleLabel: null,
    dailyMomentUrl: null,
    dailyMomentSecondaryUrl: null,
    dailyMomentAt: null,
    hasFreshMoment: false,
    vibeMaterials: [],
    auraImageUrl: null,
    auraImageUrl2: null,
    auraImageUrl3: null,
    auraCaption: null,
    recentlyActive: true,
    roomClimateId: room.climateId,
    roomTemperature: room.temperature,
    todayState: room.todayState,
    ephemeralDuration: room.duration,
    ephemeralDurationLabel: durationLabel,
    ephemeralExpiresAt: expiresAt.toISOString(),
    ...flags,
  };
}

export function applyDemoRoomRotation(cards: RandkiDiscoveryCard[], phase: DayPhase, at = new Date()): RotatedDiscoveryCard[] {
  const slotKey = getRotationSlotKey(phase, at);
  const seed = hashSeed(slotKey);
  const eligible = EPHEMERAL_POOL.filter((r) => r.phases.includes(phase));
  if (eligible.length === 0) return cards.map((c) => ({ ...c }));

  const pickCount = phase === "evening" || phase === "night" ? 2 : 1;
  const picked: EphemeralRoom[] = [];
  for (let i = 0; i < pickCount; i++) {
    picked.push(eligible[(seed + i * 7) % eligible.length]);
  }

  const closingIdx = seed % Math.max(1, cards.length);
  const rotated: RotatedDiscoveryCard[] = cards.map((card, idx) => {
    const closing = idx === closingIdx && cards.length > 6;
    const expiresAt = closing ? resolveEphemeralExpiresAt("slot_30m", phase, card.accountId, at) : undefined;
    return {
      ...card,
      rotationClosing: closing,
      rotationNew: false,
      ephemeralDuration: closing ? "slot_30m" : undefined,
      ephemeralDurationLabel: closing ? EPHEMERAL_DURATION_LABELS.slot_30m : undefined,
      ephemeralExpiresAt: expiresAt?.toISOString(),
    };
  });

  const ephemeralCards = picked
    .map((room, i) => {
      const expiresAt = resolveEphemeralExpiresAt(room.duration, phase, room.id, at);
      if (isEphemeralExpired(expiresAt, at)) return null;
      return ephemeralToCard(
        room,
        phase,
        { rotationNew: true, rotationOpensInMin: i === 0 ? minutesUntilNextRotation(at) : undefined },
        at
      );
    })
    .filter((c): c is RotatedDiscoveryCard => c !== null);

  const insertAt = (seed % 3) + 1;
  const out = [...rotated.filter((c) => !c.ephemeralExpiresAt || !isEphemeralExpired(c.ephemeralExpiresAt, at))];
  out.splice(insertAt, 0, ...ephemeralCards);
  return out;
}

export function findEphemeralCardById(roomId: string, phase: DayPhase, at = new Date()): RotatedDiscoveryCard | null {
  const poolId = roomId.startsWith("rotation-") ? roomId.slice("rotation-".length) : null;
  if (!poolId) return null;
  const room = EPHEMERAL_POOL.find((r) => r.id === poolId);
  if (!room || !room.phases.includes(phase)) return null;
  const expiresAt = resolveEphemeralExpiresAt(room.duration, phase, room.id, at);
  if (isEphemeralExpired(expiresAt, at)) return null;
  return ephemeralToCard(room, phase, { rotationNew: true }, at);
}

export function filterExpiredEphemeralCards<T extends RandkiDiscoveryCard>(cards: T[], at = new Date()): T[] {
  return cards.filter((c) => {
    const exp = (c as RotatedDiscoveryCard).ephemeralExpiresAt;
    if (exp) return !isEphemeralExpired(exp, at);
    return true;
  });
}

export function ephemeralRemainingMs(card: RandkiDiscoveryCard, at = new Date()): number | null {
  const exp = (card as RotatedDiscoveryCard).ephemeralExpiresAt;
  if (!exp) return null;
  return msUntilExpiry(exp, at);
}

export function rotationFeedLines(phase: DayPhase, cards: RotatedDiscoveryCard[]): string[] {
  const lines: string[] = [];
  const opening = cards.filter((c) => c.rotationNew);
  const closing = cards.filter((c) => c.rotationClosing);
  if (opening.length > 0) {
    const name = opening[0].displayName.split("·")[0]?.trim() ?? "Ktoś";
    const dur = opening[0].ephemeralDurationLabel ?? "chwilę";
    lines.push(`${name} otworzył pokój na ${dur}`);
  }
  if (closing.length > 0) {
    const dur = closing[0].ephemeralDurationLabel ?? `${minutesUntilNextRotation()} min`;
    lines.push(`${closing[0].displayName.split(" ")[0]} zamyka pokój · ${dur}`);
  }
  lines.push(`Portal oddycha — następna rotacja za ${minutesUntilNextRotation()} min`);
  return lines;
}

export function isEphemeralRoomId(accountId: string): boolean {
  return accountId.startsWith("rotation-");
}

export function climateClassForCard(card: RandkiDiscoveryCard): string {
  const id = card.roomClimateId;
  return id && id in ROOM_CLIMATES ? climateClass(id) : "";
}
