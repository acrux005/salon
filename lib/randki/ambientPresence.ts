import type { DayPhase } from "@/lib/randki/dayRhythm";
import { resolveDayPhaseMeta } from "@/lib/randki/dayRhythm";
import type { LiveFeedItem } from "@/lib/randki/liveFeed";
import { getPhaseSoftFeedItems } from "@/lib/randki/phaseDiscovery";
import type { RoomClimateId } from "@/lib/randki/roomClimate";
import { ROOM_CLIMATES } from "@/lib/randki/roomClimate";

/** Klimatyczna vignette — portal żyje bez fake profili. */
export type AmbientRoomVignette = {
  id: string;
  climateId: RoomClimateId;
  emoji: string;
  label: string;
  line: string;
  trace: string;
};

const AMBIENT_VIGNETTES: Record<DayPhase, Omit<AmbientRoomVignette, "id">[]> = {
  morning: [
    { climateId: "warm-cafe", emoji: "☕", label: "Poranek bez pośpiechu", line: "Para unosi się w ciszy", trace: "ktoś był tu dziś rano" },
    { climateId: "quiet-reading", emoji: "📖", label: "Powolny start", line: "Lampka przy fotelu", trace: "został chwilę przy oknie" },
    { climateId: "cozy-orange", emoji: "🌤", label: "Miękka obecność", line: "Światło wchodzi powoli", trace: "poczuł poranny klimat" },
  ],
  day: [
    { climateId: "lo-fi", emoji: "🎧", label: "Cowork w tle", line: "Bas i cisza — bez rozmowy", trace: "słuchał w tle" },
    { climateId: "warm-cafe", emoji: "☕", label: "Lunch break", line: "Przerwa bez planu", trace: "zatrzymał się na chwilę" },
    { climateId: "city-lights", emoji: "🌃", label: "Miasto w południe", line: "Ruch za szybą", trace: "dryfował obok" },
  ],
  sunset: [
    { climateId: "night-walk", emoji: "🌆", label: "Golden hour", line: "Przejście dnia w wieczór", trace: "wrócił o zachodzie" },
    { climateId: "cozy-orange", emoji: "🔥", label: "Ciepłe światło", line: "Dom woła powoli", trace: "poczuł ten klimat" },
    { climateId: "city-lights", emoji: "✨", label: "Neony budzą się", line: "Miasto zmienia barwę", trace: "został chwilę" },
  ],
  evening: [
    { climateId: "moonlight-blue", emoji: "🌙", label: "Wieczorna cisza", line: "Ktoś też nie śpieszy się spać", trace: "dołączył do ciszy" },
    { climateId: "rainy", emoji: "🌧", label: "Deszcz za oknem", line: "Krople na szybie", trace: "słuchał deszczu" },
    { climateId: "lo-fi", emoji: "🎷", label: "Jazz w tle", line: "Muzyka bez słów", trace: "słuchał w tle" },
  ],
  night: [
    { climateId: "moonlight-blue", emoji: "🌌", label: "Noc bez planu", line: "Portal oddycha wolno", trace: "ktoś był tu w nocy" },
    { climateId: "rainy", emoji: "🌧", label: "Cicho — deszcz", line: "Obecność bez twarzy", trace: "został przy oknie" },
    { climateId: "quiet-reading", emoji: "📚", label: "Nocne czytanie", line: "Strona po stronie", trace: "dołączył do ciszy" },
  ],
};

const AMBIENT_QUOTES: Record<DayPhase, string[]> = {
  morning: [
    "Nie musisz dziś nikogo spotkać — wystarczy obecność.",
    "Poranek jest dla tych, którzy nie lubią pośpiechu.",
  ],
  day: [
    "Portal oddycha — pokoje budzą się powoli.",
    "Ktoś zostawił ślad dziś rano. Ty też możesz.",
  ],
  sunset: [
    "Przejście — najspokojniejsza pora na obecność.",
    "Zachód to zaproszenie, nie deadline.",
  ],
  evening: [
    "Wieczór nie wymaga rozmowy — wystarczy klimat.",
    "Obecność bez oceny. Tempo bez presji.",
  ],
  night: [
    "Nocne pokoje nie oczekują odpowiedzi.",
    "Cisza też jest formą obecności.",
  ],
};

export type AmbientPanelContext = {
  phase: DayPhase;
  phaseLabel: string;
  vignettes: AmbientRoomVignette[];
  feedItems: LiveFeedItem[];
  quote: string;
  headline: string;
  subline: string;
};

export function getAmbientPanelContext(phaseOverride?: string): AmbientPanelContext {
  const phaseMeta = resolveDayPhaseMeta(phaseOverride);
  const phase = phaseMeta.id;
  const raw = AMBIENT_VIGNETTES[phase];
  const vignettes: AmbientRoomVignette[] = raw.map((v, i) => ({
    ...v,
    id: `ambient-${phase}-${i}`,
    label: v.label || ROOM_CLIMATES[v.climateId].label,
  }));
  const feedItems = getPhaseSoftFeedItems(phase);
  const quotes = AMBIENT_QUOTES[phase];
  const quote = quotes[Math.floor(Date.now() / (1000 * 60 * 47)) % quotes.length] ?? quotes[0];

  return {
    phase,
    phaseLabel: phaseMeta.label,
    vignettes,
    feedItems,
    quote,
    headline: "Portal oddycha — obecność bez pośpiechu",
    subline: `${phaseMeta.emoji} ${phaseMeta.label.toLowerCase()} · pokoje budzą się powoli`,
  };
}
