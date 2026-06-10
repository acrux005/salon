import type { DayPhase } from "@/lib/randki/dayRhythm";
import { DAY_PHASE_ORDER } from "@/lib/randki/dayRhythm";

export const AMBIENT_STORAGE_KEY = "randki-ambient-enabled";
export const AMBIENT_VOLUME_KEY = "randki-ambient-volume";

export const AMBIENT_CROSSFADE_MS = 2800;
export const AMBIENT_DEFAULT_VOLUME = 0.14;
export const AMBIENT_MIN_VOLUME = 0.04;
export const AMBIENT_MAX_VOLUME = 0.28;

export type AmbientTrackMeta = {
  label: string;
  mood: string;
};

export const AMBIENT_TRACK_META: Record<DayPhase, AmbientTrackMeta> = {
  morning: { label: "Poranek", mood: "las · mgła · powolny start" },
  day: { label: "Dzień", mood: "rzeka · strumień · obecność" },
  sunset: { label: "Zachód", mood: "góry · wiatr · golden hour" },
  evening: { label: "Wieczór", mood: "las · zmierzch · głęboka cisza" },
  night: { label: "Noc", mood: "dzwonki · oddalenie · bez pośpiechu" },
};

/** Źródłowe pliki z uploads → faza dnia (morning, river, mountain, evening, dzwonki). */
export const AMBIENT_LOOP_SEC = 48;

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function ambientTrackUrl(phase: DayPhase): string {
  return `${BASE_PATH}/randki/ambient/${phase}.ogg`;
}

export function isDayPhase(value: string): value is DayPhase {
  return (DAY_PHASE_ORDER as string[]).includes(value);
}
