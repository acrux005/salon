export const TODAY_STATE_MAX_LEN = 80;
export const TODAY_STATE_TTL_MS = 24 * 60 * 60 * 1000;

export type TodayStatePreset = {
  id: string;
  label: string;
  emoji: string;
};

export const TODAY_STATE_PRESETS: TodayStatePreset[] = [
  { id: "quiet", label: "Bardziej cisza niż rozmowa", emoji: "🤫" },
  { id: "calm_people", label: "Potrzebuję spokojnych ludzi", emoji: "🫂" },
  { id: "open_chat", label: "Otwarty na rozmowę", emoji: "💬" },
  { id: "spark", label: "Dziś coś iskrzy", emoji: "✨" },
  { id: "low_energy", label: "Niska energia — obecność w tle", emoji: "🌙" },
  { id: "voice", label: "Wolę głos niż pisanie", emoji: "🎙" },
  { id: "slow", label: "Powolny start — bez pośpiechu", emoji: "☕" },
  { id: "walk_mood", label: "Spacer i rozmowa bez planu", emoji: "🚶" },
];

const PRESET_BY_ID = new Map(TODAY_STATE_PRESETS.map((p) => [p.id, p]));

export function normalizeTodayState(raw: string | null | undefined): string | null {
  if (!raw?.trim()) return null;
  const trimmed = raw.trim().slice(0, TODAY_STATE_MAX_LEN);
  const preset = PRESET_BY_ID.get(trimmed);
  return preset ? preset.id : trimmed;
}

export function todayStateLabel(raw: string | null | undefined): string | null {
  if (!raw?.trim()) return null;
  const preset = PRESET_BY_ID.get(raw);
  if (preset) return `${preset.emoji} ${preset.label}`;
  return raw.trim().slice(0, TODAY_STATE_MAX_LEN);
}

export function isTodayStateFresh(updatedAt: Date | string | null | undefined): boolean {
  if (!updatedAt) return false;
  const at = updatedAt instanceof Date ? updatedAt.getTime() : new Date(updatedAt).getTime();
  if (Number.isNaN(at)) return false;
  return Date.now() - at < TODAY_STATE_TTL_MS;
}

export function effectiveTodayState(
  state: string | null | undefined,
  updatedAt: Date | string | null | undefined
): string | null {
  if (!state?.trim()) return null;
  if (!isTodayStateFresh(updatedAt)) return null;
  return normalizeTodayState(state);
}

/** Demo mikro-statusy per persona (1–10). */
export const DEMO_TODAY_STATES: Record<number, string> = {
  1: "quiet",
  2: "slow",
  3: "calm_people",
  4: "open_chat",
  5: "quiet",
  6: "voice",
  7: "low_energy",
  8: "slow",
  9: "spark",
  10: "open_chat",
};

export function demoTodayStateForPersona(n: number): string {
  return DEMO_TODAY_STATES[n] ?? "slow";
}
