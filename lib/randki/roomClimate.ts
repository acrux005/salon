import type { RandkiDiscoveryCard } from "@/lib/randki/matching";

export type RoomClimateId =
  | "rainy"
  | "warm-cafe"
  | "city-lights"
  | "lo-fi"
  | "quiet-reading"
  | "night-walk"
  | "cozy-orange"
  | "moonlight-blue";

export type RoomClimateMeta = {
  id: RoomClimateId;
  emoji: string;
  label: string;
  tagline: string;
  /** Atmosferyczne stany — bez liczb, tylko klimat. */
  temperatures: string[];
};

export const ROOM_CLIMATE_ORDER: RoomClimateId[] = [
  "moonlight-blue",
  "city-lights",
  "rainy",
  "warm-cafe",
  "lo-fi",
  "night-walk",
  "cozy-orange",
  "quiet-reading",
];

export const ROOM_CLIMATES: Record<RoomClimateId, RoomClimateMeta> = {
  rainy: {
    id: "rainy",
    emoji: "🌧",
    label: "Deszczowy",
    tagline: "deszcz za oknem",
    temperatures: ["cicho", "spokojnie", "głosy w tle", "deszcz na szybie"],
  },
  "warm-cafe": {
    id: "warm-cafe",
    emoji: "☕",
    label: "Ciepła kawiarnia",
    tagline: "spokojna rozmowa",
    temperatures: ["spokojnie", "szum kawiarni", "ciepła rozmowa", "ktoś właśnie dołączył"],
  },
  "city-lights": {
    id: "city-lights",
    emoji: "🌃",
    label: "Neon miasta",
    tagline: "światła w tle",
    temperatures: ["nocne rozmowy", "aktywnie", "światła w tle", "miasto nie śpi"],
  },
  "lo-fi": {
    id: "lo-fi",
    emoji: "🎧",
    label: "Lo-fi",
    tagline: "bas i cisza",
    temperatures: ["cicho", "bas w tle", "spokojnie", "vinyl w tle"],
  },
  "quiet-reading": {
    id: "quiet-reading",
    emoji: "📖",
    label: "Czytanie",
    tagline: "cisza i obecność",
    temperatures: ["cicho", "cisza", "obecność bez słów", "lampka przy fotelu"],
  },
  "night-walk": {
    id: "night-walk",
    emoji: "🚶",
    label: "Nocny spacer",
    tagline: "bez planu",
    temperatures: ["bez pośpiechu", "ulica nocą", "spacer w tle", "kroki w oddali"],
  },
  "cozy-orange": {
    id: "cozy-orange",
    emoji: "🔥",
    label: "Przytulny",
    tagline: "ciepłe światło",
    temperatures: ["przytulnie", "spokojnie", "ciepłe światło", "ktoś też nie śpi"],
  },
  "moonlight-blue": {
    id: "moonlight-blue",
    emoji: "🌙",
    label: "Księżyc",
    tagline: "spokojna energia",
    temperatures: ["spokojna energia", "cicho", "noc bez pośpiechu", "ktoś właśnie dołączył"],
  },
};

const INTEREST_CLIMATE: [RegExp, RoomClimateId][] = [
  [/jazz|vinyl|ambient|muzyk/i, "lo-fi"],
  [/kawiarn|kawa|coffee/i, "warm-cafe"],
  [/nocne spacer|spacer|walk/i, "night-walk"],
  [/książ|czyt|book/i, "quiet-reading"],
  [/deszcz|tramwaj/i, "rainy"],
  [/miasto|neon|noc/i, "city-lights"],
  [/morze|gór|zachód/i, "moonlight-blue"],
];

export function getRoomClimateForCard(card: RandkiDiscoveryCard): RoomClimateMeta {
  if (card.roomClimateId && card.roomClimateId in ROOM_CLIMATES) {
    return ROOM_CLIMATES[card.roomClimateId];
  }
  if (card.accountId.startsWith("demo-room-")) {
    const n = parseInt(card.accountId.slice(-2), 10) || 1;
    const id = ROOM_CLIMATE_ORDER[(n - 1) % ROOM_CLIMATE_ORDER.length];
    return ROOM_CLIMATES[id];
  }
  const hay = [...card.interests, card.bio, card.auraCaption ?? ""].join(" ").toLowerCase();
  for (const [re, id] of INTEREST_CLIMATE) {
    if (re.test(hay)) return ROOM_CLIMATES[id];
  }
  const moodMap: Record<string, RoomClimateId> = {
    calm: "moonlight-blue",
    chat: "warm-cafe",
    flirt: "city-lights",
    date: "cozy-orange",
    curious: "lo-fi",
    warm: "cozy-orange",
    playful: "warm-cafe",
    thoughtful: "quiet-reading",
    energetic: "night-walk",
  };
  if (card.mood && moodMap[card.mood]) return ROOM_CLIMATES[moodMap[card.mood]];
  return ROOM_CLIMATES["moonlight-blue"];
}

export function climateClass(id: RoomClimateId): string {
  return `randki-climate--${id}`;
}

function stableIndex(seed: string, mod: number): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return mod > 0 ? h % mod : 0;
}

/** Atmosfera pokoju — deterministyczna per karta, bez liczb. */
export function getRoomTemperatureForCard(card: RandkiDiscoveryCard): string {
  if (card.roomTemperature?.trim()) return card.roomTemperature.trim();
  const climate = getRoomClimateForCard(card);
  const pool = climate.temperatures;
  return pool[stableIndex(card.accountId, pool.length)] ?? pool[0];
}
