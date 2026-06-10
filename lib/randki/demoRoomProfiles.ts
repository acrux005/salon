import type { DayPhase } from "@/lib/randki/dayRhythm";
import type { RoomClimateId } from "@/lib/randki/roomClimate";
import { serializeRoomPhasesMap, type UserRoomPhasesMap } from "@/lib/randki/roomPhases";

type PhasePreset = {
  climateId: RoomClimateId;
  mood: string;
  activityIntent: string;
  quote: string;
  temperature: string;
  active?: boolean;
};

export type DemoPersonaMeta = {
  firstName: string;
  hasVoice?: boolean;
};

export const DEMO_PERSONA_META: Record<number, DemoPersonaMeta> = {
  1: { firstName: "Ania" },
  2: { firstName: "Michał" },
  3: { firstName: "Ola" },
  4: { firstName: "Tomek" },
  5: { firstName: "Zosia" },
  6: { firstName: "Kuba", hasVoice: true },
  7: { firstName: "Magda" },
  8: { firstName: "Piotr", hasVoice: true },
  9: { firstName: "Nina", hasVoice: true },
  10: { firstName: "Jan" },
};

export const DEMO_ROOM_PHASE_PRESETS: Record<number, Record<DayPhase, PhasePreset>> = {
  1: {
    morning: { climateId: "warm-cafe", mood: "calm", activityIntent: "coffee", quote: "Para unosi się wolno — dzień dopiero się budzi.", temperature: "kawa w tle · spokojnie" },
    day: { climateId: "quiet-reading", mood: "calm", activityIntent: "cowork", quote: "Praca w ciszy, bez pośpiechu i bez kamery.", temperature: "cicho · obecność w tle" },
    sunset: { climateId: "cozy-orange", mood: "calm", activityIntent: "walk", quote: "Golden hour — wracam bez planu.", temperature: "ciepłe światło · miękko" },
    evening: { climateId: "moonlight-blue", mood: "chat", activityIntent: "chat", quote: "Po 22:00 wolę głos niż small talk.", temperature: "głęboka rozmowa · jazz w tle" },
    night: { climateId: "lo-fi", mood: "calm", activityIntent: "chat", quote: "Bas cicho pulsuje — ktoś jeszcze nie śpi?", temperature: "ambient · bez presji" },
  },
  2: {
    morning: { climateId: "quiet-reading", mood: "calm", activityIntent: "coffee", quote: "Herbata, winyle i zero planów na dziś.", temperature: "powolny start · ciepło" },
    day: { climateId: "warm-cafe", mood: "chat", activityIntent: "cowork", quote: "Gitara stoi w kącie — praca może poczekać.", temperature: "szum kawiarni · spokojnie" },
    sunset: { climateId: "night-walk", mood: "calm", activityIntent: "walk", quote: "Neon po deszczu — ulice jeszcze puste.", temperature: "spacer powrotny · muzyka w słuchawkach" },
    evening: { climateId: "rainy", mood: "chat", activityIntent: "music", quote: "Thriller w tle, rozmowa ważniejsza niż fabuła.", temperature: "deszcz na szybie · głęboko" },
    night: { climateId: "lo-fi", mood: "calm", activityIntent: "music", quote: "Płyta od początku do końca — nic więcej.", temperature: "vinyl w tle · cicho" },
  },
  3: {
    morning: { climateId: "cozy-orange", mood: "calm", activityIntent: "coffee", quote: "Morze jeszcze spokojne — kawa pierwsza.", temperature: "miękka obecność · sól w powietrzu" },
    day: { climateId: "warm-cafe", mood: "chat", activityIntent: "walk", quote: "Targ rano, reszta dnia bez mapy.", temperature: "obecność · lekko" },
    sunset: { climateId: "night-walk", mood: "calm", activityIntent: "walk", quote: "Molo, wiatr i światło zachodu.", temperature: "golden hour · nostalgia" },
    evening: { climateId: "moonlight-blue", mood: "chat", activityIntent: "chat", quote: "Małe kino, potem rozmowa na molo.", temperature: "intymnie · spokojnie" },
    night: { climateId: "rainy", mood: "calm", activityIntent: "chat", quote: "Fale za oknem — ktoś jeszcze czuwa?", temperature: "deszcz · głosy w tle" },
  },
  4: {
    morning: { climateId: "warm-cafe", mood: "calm", activityIntent: "coffee", quote: "Planszówka o poranku? Tylko herbata na razie.", temperature: "śmiech w tle · ciepło" },
    day: { climateId: "city-lights", mood: "chat", activityIntent: "cowork", quote: "Cowork i dobre wino po pracy — obiecuje.", temperature: "aktywnie · bez pośpiechu" },
    sunset: { climateId: "cozy-orange", mood: "chat", activityIntent: "walk", quote: "Koc, świece i złe żarty o zachodzie.", temperature: "ciepła rozmowa · blisko" },
    evening: { climateId: "warm-cafe", mood: "flirt", activityIntent: "chat", quote: "Wino, planszówka i ktoś, kto naprawdę słucha.", temperature: "intymnie · wesoło" },
    night: { climateId: "city-lights", mood: "chat", activityIntent: "chat", quote: "Miasto nie śpi — ja też jeszcze nie.", temperature: "nocne rozmowy · światła w tle" },
  },
  5: {
    morning: { climateId: "quiet-reading", mood: "calm", activityIntent: "coffee", quote: "Deszcz na szybie — linie światła w notesie.", temperature: "cisza · estetyka" },
    day: { climateId: "quiet-reading", mood: "calm", activityIntent: "cowork", quote: "Pokój zamknięty w dzień — wracam po zmroku.", temperature: "niedostępna", active: false },
    sunset: { climateId: "rainy", mood: "calm", activityIntent: "walk", quote: "Tramwaj i pomarańczowe niebo — ulotny moment.", temperature: "deszcz · spokojnie" },
    evening: { climateId: "moonlight-blue", mood: "chat", activityIntent: "chat", quote: "Poeta po pracy — słowa wolno, bez pośpiechu.", temperature: "głęboko · cicho" },
    night: { climateId: "lo-fi", mood: "calm", activityIntent: "music", quote: "Jedna płyta, jedna rozmowa, zero multitaskingu.", temperature: "bas w tle · ambient" },
  },
  6: {
    morning: { climateId: "warm-cafe", mood: "calm", activityIntent: "coffee", quote: "Bieg o świcie — teraz kawa i cisza.", temperature: "powolny start · energia bez pośpiechu" },
    day: { climateId: "city-lights", mood: "chat", activityIntent: "cowork", quote: "Speciality coffee i dokument w tle.", temperature: "obecność · dzień" },
    sunset: { climateId: "night-walk", mood: "chat", activityIntent: "walk", quote: "Spacer bez mapy — zobaczymy dokąd.", temperature: "wiatr · miasto w złocie" },
    evening: { climateId: "city-lights", mood: "chat", activityIntent: "chat", quote: "Voice zamiast pisania — jestem tu.", temperature: "głos aktywny · obecność" },
    night: { climateId: "lo-fi", mood: "calm", activityIntent: "music", quote: "Biegnę w dzień, żyję nocą — bas w tle.", temperature: "ambient · bez presji" },
  },
  7: {
    morning: { climateId: "quiet-reading", mood: "calm", activityIntent: "coffee", quote: "Kot na kolanach, miasto budzi się wolno.", temperature: "cicho · miękko" },
    day: { climateId: "lo-fi", mood: "calm", activityIntent: "cowork", quote: "UX w dzień — slow life po godzinach.", temperature: "bas w tle · spokojnie" },
    sunset: { climateId: "cozy-orange", mood: "calm", activityIntent: "coffee", quote: "Second hand i herbata — idealny zachód.", temperature: "ciepło · blisko" },
    evening: { climateId: "moonlight-blue", mood: "chat", activityIntent: "chat", quote: "Ambient zamiast small talk — proszę.", temperature: "głęboko · spokojnie" },
    night: { climateId: "rainy", mood: "calm", activityIntent: "chat", quote: "Kot śpi, ja jeszcze nie — ktoś dołączy?", temperature: "deszcz · cicho" },
  },
  8: {
    morning: { climateId: "warm-cafe", mood: "calm", activityIntent: "coffee", quote: "Poranek zamknięty — jestem dopiero wieczorem.", temperature: "niedostępny", active: false },
    day: { climateId: "quiet-reading", mood: "calm", activityIntent: "cowork", quote: "Historia w dzień, rozmowy po zmroku.", temperature: "cicho · głęboko" },
    sunset: { climateId: "cozy-orange", mood: "calm", activityIntent: "walk", quote: "Stare kamienice w żółtym świetle.", temperature: "nostalgia · spokojnie" },
    evening: { climateId: "rainy", mood: "chat", activityIntent: "chat", quote: "Małe kino, potem długa rozmowa o niczym ważnym.", temperature: "deszcz · intymnie" },
    night: { climateId: "quiet-reading", mood: "calm", activityIntent: "chat", quote: "Książka i głos — więcej nie trzeba.", temperature: "cisza · obecność" },
  },
  9: {
    morning: { climateId: "cozy-orange", mood: "calm", activityIntent: "coffee", quote: "Joga rano — oddech zanim miasto ruszy.", temperature: "miękka obecność · ciepło" },
    day: { climateId: "warm-cafe", mood: "chat", activityIntent: "walk", quote: "Podcast w słuchawkach — dzień bez pośpiechu.", temperature: "obecność · lekko" },
    sunset: { climateId: "night-walk", mood: "chat", activityIntent: "walk", quote: "Tatuaże, zachód i rozmowa o chemii, nie checklistie.", temperature: "golden hour · otwarcie" },
    evening: { climateId: "moonlight-blue", mood: "flirt", activityIntent: "chat", quote: "Obecność ważniejsza niż perfekcyjne zdjęcie.", temperature: "intymnie · głos w tle" },
    night: { climateId: "lo-fi", mood: "calm", activityIntent: "chat", quote: "Ambient voice — słucham naprawdę.", temperature: "ambient · bez presji" },
  },
  10: {
    morning: { climateId: "quiet-reading", mood: "calm", activityIntent: "coffee", quote: "Analogowy aparat i poranek bez filtra.", temperature: "cisza · światło" },
    day: { climateId: "city-lights", mood: "chat", activityIntent: "walk", quote: "Fotografia uliczna — dzień pełen detali.", temperature: "miasto · obecność" },
    sunset: { climateId: "cozy-orange", mood: "calm", activityIntent: "walk", quote: "Golden hour to moja ulubiona godzina.", temperature: "ciepłe światło · wrażliwość" },
    evening: { climateId: "city-lights", mood: "chat", activityIntent: "music", quote: "Światło latarni na mokrym asfalcie.", temperature: "nocne rozmowy · obraz" },
    night: { climateId: "rainy", mood: "calm", activityIntent: "music", quote: "O północy patrzę w okno — ktoś jeszcze nie śpi?", temperature: "deszcz · melancholia" },
  },
};

export function demoRoomPhasesJson(demoIndex: number): string {
  const presets = DEMO_ROOM_PHASE_PRESETS[demoIndex];
  if (!presets) return "{}";
  const map: UserRoomPhasesMap = {};
  for (const [phase, cfg] of Object.entries(presets) as [DayPhase, PhasePreset][]) {
    map[phase] = {
      climateId: cfg.climateId,
      mood: cfg.mood,
      activityIntent: cfg.activityIntent,
      quote: cfg.quote,
      temperature: cfg.temperature,
      active: cfg.active !== false,
    };
  }
  return serializeRoomPhasesMap(map);
}

export function demoPersonaFeedLine(demoIndex: number, phase: DayPhase): string {
  const name = DEMO_PERSONA_META[demoIndex]?.firstName ?? "Ktoś";
  const quote = DEMO_ROOM_PHASE_PRESETS[demoIndex]?.[phase]?.quote;
  const lines: Record<DayPhase, string[]> = {
    morning: [`${name} parzy kawę bez pośpiechu`, `${name} — powolny start`, `${name} otworzyła pokój poranka`],
    day: [`${name} — cowork w ciszy`, `${name} dodała moment dnia`, `${name} jest obecna w tle`],
    sunset: [`${name} wraca ze spaceru`, `${name} — golden hour w pokoju`, `${name} puszcza muzykę w tle`],
    evening: [`${name} właśnie dołączyła do voice`, `${name} — głębsza rozmowa`, `${name} otworzyła pokój wieczoru`],
    night: [`${name} też nie może spać`, `${name} — ambient voice aktywny`, `${name} zostaje w pokoju nocy`],
  };
  const pool = lines[phase];
  if (quote && demoIndex % 2 === 0) return `${name}: „${quote.slice(0, 52)}…”`;
  return pool[demoIndex % pool.length];
}
