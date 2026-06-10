export type DayPhase = "morning" | "day" | "sunset" | "evening" | "night";

export type DayPhaseMeta = {
  id: DayPhase;
  emoji: string;
  label: string;
  energy: string;
  actionEyebrow: string;
  actionTitle: string;
  heroRoomLabel: string;
  heroTitle: string;
  discoveryEyebrow: string;
  discoveryTitle: string;
  liveFeedHint: string;
  /** Nagłówek prawej kolumny panelu. */
  liveFeedTitle: string;
  ambientChips: [string, string, string];
  /** Tagline pod logo w menu. */
  brandTagline: string;
  /** Voice w górnym/dolnym menu — głównie wieczór i noc. */
  voiceInNav: boolean;
  /** Etykieta linku voice (np. „Ambient” w nocy). */
  voiceNavLabel: string;
};

export const DAY_PHASES: Record<DayPhase, DayPhaseMeta> = {
  morning: {
    id: "morning",
    emoji: "🌤",
    label: "Poranek",
    energy: "spokojny start · miękka obecność",
    actionEyebrow: "Twój poranek",
    actionTitle: "Powolny start",
    heroRoomLabel: "poranny",
    heroTitle: "Kawa bez pośpiechu",
    discoveryEyebrow: "Pokoje poranka",
    discoveryTitle: "Wybierz klimat",
    liveFeedHint: "kto też zaczyna dzień spokojnie",
    liveFeedTitle: "Dzieje się teraz",
    ambientChips: ["☕ kawa w tle", "📖 powolny start", "🌤 miękka obecność"],
    brandTagline: "powolny start",
    voiceInNav: false,
    voiceNavLabel: "Voice",
  },
  day: {
    id: "day",
    emoji: "☀️",
    label: "Dzień",
    energy: "obecność · mikro kontakt",
    actionEyebrow: "Twój dzień",
    actionTitle: "Jesteś tu",
    heroRoomLabel: "dzienny",
    heroTitle: "Kto też ma ciężki dzień",
    discoveryEyebrow: "Pokoje dnia",
    discoveryTitle: "Wybierz klimat",
    liveFeedHint: "wspólna codzienność w tle",
    liveFeedTitle: "Dzieje się teraz",
    ambientChips: ["💻 cowork w tle", "🎧 muzyka do pracy", "☕ lunch break"],
    brandTagline: "obecność · dzień",
    voiceInNav: false,
    voiceNavLabel: "Voice",
  },
  sunset: {
    id: "sunset",
    emoji: "🌆",
    label: "Zachód",
    energy: "przejście · wyciszenie",
    actionEyebrow: "Twój zachód",
    actionTitle: "Golden hour",
    heroRoomLabel: "zachodu",
    heroTitle: "Powrót bez pośpiechu",
    discoveryEyebrow: "Pokoje zachodu",
    discoveryTitle: "Wybierz klimat",
    liveFeedHint: "spacery i muzyka w tle",
    liveFeedTitle: "Dzieje się teraz",
    ambientChips: ["🌆 golden hour", "🚶 spacer powrotny", "🎷 muzyka w tle"],
    brandTagline: "golden hour",
    voiceInNav: true,
    voiceNavLabel: "Voice",
  },
  evening: {
    id: "evening",
    emoji: "🌙",
    label: "Wieczór",
    energy: "intymność · głos · obecność",
    actionEyebrow: "Twój wieczór",
    actionTitle: "Otwórz pokój",
    heroRoomLabel: "wieczorny",
    heroTitle: "Po 22:00",
    discoveryEyebrow: "Inne pokoje wieczoru",
    discoveryTitle: "Wybierz klimat",
    liveFeedHint: "kto dziś nie śpi",
    liveFeedTitle: "Dzieje się teraz",
    ambientChips: ["🎧 jazz w tle", "☕ spokojna rozmowa", "🌙 obecność"],
    brandTagline: "slow intimacy",
    voiceInNav: true,
    voiceNavLabel: "Voice",
  },
  night: {
    id: "night",
    emoji: "🌌",
    label: "Noc",
    energy: "cisza · ambient · bez presji",
    actionEyebrow: "Twoja noc",
    actionTitle: "Nie śpię jeszcze",
    heroRoomLabel: "nocny",
    heroTitle: "Kto też nie może zasnąć",
    discoveryEyebrow: "Pokoje nocy",
    discoveryTitle: "Wybierz klimat",
    liveFeedHint: "obecność bez pośpiechu",
    liveFeedTitle: "Dzieje się teraz",
    ambientChips: ["🌌 cisza", "🎙 ambient voice", "🚗 nocna jazda w tle"],
    brandTagline: "bez pośpiechu",
    voiceInNav: true,
    voiceNavLabel: "Ambient",
  },
};

export function getDayPhase(date = new Date()): DayPhase {
  const h = date.getHours();
  if (h >= 5 && h < 9) return "morning";
  if (h >= 9 && h < 17) return "day";
  if (h >= 17 && h < 20) return "sunset";
  if (h >= 20 && h < 24) return "evening";
  return "night";
}

export function getDayPhaseMeta(date = new Date()): DayPhaseMeta {
  return DAY_PHASES[getDayPhase(date)];
}

export const DAY_PHASE_ORDER: DayPhase[] = ["morning", "day", "sunset", "evening", "night"];

export function parseDayPhaseOverride(value: string | undefined | null): DayPhase | null {
  if (!value) return null;
  return DAY_PHASE_ORDER.includes(value as DayPhase) ? (value as DayPhase) : null;
}

export function resolveDayPhase(override?: string | null, date = new Date()): DayPhase {
  return parseDayPhaseOverride(override) ?? getDayPhase(date);
}

export function resolveDayPhaseMeta(override?: string | null, date = new Date()): DayPhaseMeta {
  return DAY_PHASES[resolveDayPhase(override, date)];
}

export function isEveningPhase(phase: DayPhase): boolean {
  return phase === "sunset" || phase === "evening" || phase === "night";
}

export function isVoicePeakPhase(phase: DayPhase): boolean {
  return phase === "evening" || phase === "night";
}

export function dayPhaseClass(phase: DayPhase): string {
  return `randki-day-phase--${phase}`;
}
