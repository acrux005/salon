import { parseInterests } from "@/lib/randki/constants";
import { RANDKI_ACTIVITY_INTENTS, RANDKI_MOODS } from "@/lib/randki/onboarding";
import type { VibeMaterialRow } from "@/lib/randki/vibeMaterialTypes";

type ProfileSlice = {
  displayName?: string;
  interests: string;
  mood: string | null;
  activityIntent: string | null;
  circleSlug?: string | null;
  communicationStyle?: string | null;
};

function firstName(displayName: string | undefined): string {
  if (!displayName?.trim()) return "Ktoś";
  return displayName.trim().split(/\s+/)[0] ?? "Ktoś";
}

function activityPhrase(value: string | null): string | null {
  if (!value) return null;
  const map: Record<string, string> = {
    walk: "chce spacer",
    coffee: "szuka kawy",
    food: "myśli o kolacji",
    culture: "chce wyjść — kino albo koncert",
    sport: "ma energię na ruch",
    cowork: "szuka ciszy i obecności",
  };
  return map[value] ?? RANDKI_ACTIVITY_INTENTS.find((a) => a.value === value)?.label.toLowerCase() ?? null;
}

function moodPhrase(value: string | null, hour: number): string | null {
  if (!value) return null;
  const isLate = hour >= 22 || hour < 2;
  const isEvening = hour >= 18 || hour < 1;
  const map: Record<string, string> = {
    chat: isLate ? "też nie może spać" : isEvening ? "szuka rozmowy na wieczór" : "ma ochotę pogadać",
    flirt: "ma lekki, wieczorny nastrój",
    date: "chce wyjść z domu",
    calm: isEvening ? "niesie spokojną energię" : "woli spokojne tempo",
  };
  return map[value] ?? RANDKI_MOODS.find((m) => m.value === value)?.label.toLowerCase() ?? null;
}

function listeningPhrase(interests: string[], materials: VibeMaterialRow[]): string | null {
  const hay = [
    ...interests.map((i) => i.toLowerCase()),
    ...materials.map((m) => `${m.title ?? ""} ${m.caption ?? ""}`.toLowerCase()),
  ].join(" ");
  if (/jazz|satie|coltrane|piano/.test(hay)) return "słucha jazzu";
  if (/techno|club|disco/.test(hay)) return "ma włączony bas";
  if (/rock|guitar|gitar/.test(hay)) return "puszcza coś z gitarą";
  if (materials.some((m) => m.platform === "spotify" || m.platform === "youtube")) return "coś gra w tle";
  return null;
}

function interestMoment(interests: string[], hour: number): string | null {
  const set = new Set(interests.map((i) => i.toLowerCase()));
  if (set.has("koncerty na żywo") || set.has("kino")) {
    return hour >= 19 ? "wrócił z koncertu albo myśli o wyjściu" : "planuje coś kulturalnego";
  }
  if (set.has("ksiazki") || set.has("książki")) return "ma głowę w książce";
  if (set.has("nocne spacery")) return hour >= 20 ? "myśli o nocnym spacerze" : "lubi spokojne chodzenie";
  return null;
}

/** Krótka linia emocji pod imieniem w pokoju — nie checklista, nie dystans. */
export function buildEmotionalWhyReason(
  their: ProfileSlice,
  options?: { vibeMaterials?: VibeMaterialRow[]; hour?: number; sharedActivity?: boolean }
): string {
  const hour = options?.hour ?? new Date().getHours();
  const name = firstName(their.displayName);
  const interests = parseInterests(their.interests);
  const materials = options?.vibeMaterials ?? [];

  if (options?.sharedActivity && their.activityIntent) {
    const shared: Record<string, string> = {
      walk: "Oboje dziś chcecie spaceru",
      coffee: "Oboje szukacie kawy",
      food: "Oboje myślicie o kolacji",
      culture: "Oboje chcecie wyjść — kino albo koncert",
      sport: "Oboje macie energię na ruch",
      cowork: "Oboje szukacie ciszy i obecności",
    };
    const line = shared[their.activityIntent];
    if (line) return line;
  }

  const act = activityPhrase(their.activityIntent);
  if (act) return `${name} dziś ${act}`;

  const listen = listeningPhrase(interests, materials);
  if (listen) return `${name} ${listen}`;

  const mood = moodPhrase(their.mood, hour);
  if (mood) return `${name} ${mood}`;

  const moment = interestMoment(interests, hour);
  if (moment) return `${name} ${moment}`;

  if (their.circleSlug === "introverts" && (hour >= 20 || hour < 3)) {
    return `${name} dziś nie chce być sam`;
  }

  if (their.communicationStyle === "expressive") return `${name} ma ciężki dzień — szuka obecności`;

  const soft = [
    `${name} jest dziś obecny/a w pokoju`,
    `${name} zostawił/a światło włączone`,
    `${name} — dobry wieczór na powolny start`,
  ];
  const seed = (name.length + hour) % soft.length;
  return soft[seed] ?? soft[0];
}

export type PulseLine = { dot: string; text: string };

/** Rozszerzone mikro-sygnały obok panelu — nocny social, nie marketplace. */
export function buildEmotionalPulseLines(input: {
  momentsToday: number;
  walkToday: number;
  coffeeToday: number;
  voiceWaiting: number;
  isEvening: boolean;
  cityLabel: string | null;
  hour?: number;
}): PulseLine[] {
  const hour = input.hour ?? new Date().getHours();
  const isLate = hour >= 22 || hour < 2;
  const lines: PulseLine[] = [];

  if (input.isEvening) {
    lines.push({ dot: "bg-indigo-400", text: "Ktoś też nie może spać" });
  }
  if (input.walkToday > 0) {
    lines.push({ dot: "bg-emerald-400", text: `${input.walkToday} ${input.walkToday === 1 ? "osoba szuka" : "osób szuka"} spaceru dziś` });
  }
  if (input.coffeeToday > 0) {
    lines.push({
      dot: "bg-amber-400",
      text: `${input.coffeeToday} na kawę${input.cityLabel ? ` · ${input.cityLabel}` : ""}`,
    });
  }
  lines.push({ dot: "bg-violet-400", text: "Ktoś słucha jazzu" });
  if (input.momentsToday > 0) {
    lines.push({ dot: "bg-rose-400", text: `${input.momentsToday} opublikowało moment` });
  }
  if (isLate) {
    lines.push({ dot: "bg-slate-400", text: "Ktoś wrócił z koncertu" });
  }
  if (input.isEvening && input.voiceWaiting > 0) {
    lines.push({ dot: "bg-rose-400 animate-pulse", text: `${input.voiceWaiting} w kolejce voice` });
  }
  lines.push({ dot: "bg-amber-300/80", text: "Ktoś ma ciężki dzień — szuka obecności" });

  return lines.slice(0, 5);
}

export function buildLiveFeedEmotionalText(
  displayName: string,
  activityIntent: string | null,
  mood: string | null,
  interests: string
): string {
  const name = firstName(displayName);
  const reason = buildEmotionalWhyReason(
    { displayName, interests, mood, activityIntent },
    { hour: new Date().getHours() }
  );
  if (reason.startsWith(name)) return reason;
  return `${name} — ${reason.toLowerCase()}`;
}
