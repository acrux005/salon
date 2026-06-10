/** Słownik interakcji — soft presence, nie performance social. */

export type PresenceReactionId = "feel_climate" | "stay_awhile" | "resonates" | "listening" | "quiet_energy";

export type PresenceReaction = {
  id: PresenceReactionId;
  emoji: string;
  label: string;
  /** Tekst śladu widoczny dla hosta pokoju */
  trace: string;
};

export const PRESENCE_REACTIONS: PresenceReaction[] = [
  { id: "feel_climate", emoji: "☕", label: "Czuję ten klimat", trace: "poczuł klimat" },
  { id: "stay_awhile", emoji: "🌙", label: "Zostanę chwilę", trace: "został chwilę" },
  { id: "resonates", emoji: "✨", label: "To rezonuje", trace: "zostawił ślad rezonansu" },
  { id: "listening", emoji: "🎧", label: "Słucham", trace: "słucha w tle" },
  { id: "quiet_energy", emoji: "📚", label: "Spokojna energia", trace: "dołączył do ciszy" },
];

export const PRESENCE_TRACE_VERBS = [
  "został chwilę",
  "słuchał",
  "wrócił dziś rano",
  "jest obok",
  "dołączył do ciszy",
  "poczuł klimat",
  "dryfował obok",
] as const;

export function demoPresenceTraceForRoom(accountId: string): string {
  let h = 0;
  for (let i = 0; i < accountId.length; i++) h = (h + accountId.charCodeAt(i) * (i + 3)) % PRESENCE_TRACE_VERBS.length;
  return PRESENCE_TRACE_VERBS[h];
}

export function reactionById(id: string): PresenceReaction | undefined {
  return PRESENCE_REACTIONS.find((r) => r.id === id);
}

/** Copy — organiczne przejścia, bez dopaminy */
export const INTERACTION_COPY = {
  enterRoom: "Wejdź do pokoju",
  stayInRoom: "Zostań chwilę",
  leaveRoom: "Dryfuj dalej",
  leaveQuiet: "Wyjdź cicho",
  resonanceToday: (n: number, limit: number) =>
    limit > 1 ? `Ślady rezonansu dziś · ${n}/${limit}` : `Ślady rezonansu dziś · ${n}`,
  matchOrganic: (name: string) =>
    `Rozmawiacie już chwilę z ${name.split(" ")[0]} — przejść do spokojniejszej przestrzeni?`,
  matchCta: "Otwórz wspólny pokój",
  resonanceReceived: "Kto zostawił ślad",
  resonanceHint: "Rezonuje z Twoim klimatem — zostań chwilę w odpowiedzi.",
  resonanceEmpty: "Na razie cisza — pokoje jeszcze się budzą.",
  resonanceBack: "Zostaw ślad",
  traceDialog: "Dialog obecności",
  traceReply: "Odpowiedz śladem",
  momentResonance: "Rezonans z chwilą — styk, nie lajk",
  momentResonanceHint: "Ktoś poczuł ten moment",
  syncedListening: "Słuchacie w tym samym momencie",
  voiceResonance: "Głos rezonuje — zostań chwilę.",
  roomEphemeral: (minutes: number) => `Ten pokój oddycha jeszcze ~${minutes} min`,
  sharedListening: "Wspólne słuchanie — bez konieczności pisania",
  noReadReceipts: "Bez presji — odpowiedź może poczekać",
  chatCorridor: "Korytarz — gdy poczujesz potrzebę słów",
  chatBackToSpace: "← wspólna przestrzeń",
  chatVoiceNote: "Notka głosowa",
  chatHints: "Potrzebuję podpowiedzi",
  matchesNav: "Obecni",
  openSpace: "Wejdź do wspólnej przestrzeni",
  writeQuietly: "Napisz spokojnie",
} as const;

export const NOTIFICATION_COPY = {
  resonance: (name: string) => ({
    title: "Nowa obecność",
    body: `${name.split(" ")[0]} zostawił/a ślad w Twoim klimacie.`,
  }),
  message: (name: string, preview: string) => ({
    title: `${name.split(" ")[0]} · wiadomość`,
    body: preview,
  }),
  voicePaired: (name: string) => ({
    title: "Głos w pokoju",
    body: `${name.split(" ")[0]} jest obok — dołącz, gdy poczujesz.`,
  }),
  traceReply: (name: string) => ({
    title: "Odpowiedź śladem",
    body: `${name.split(" ")[0]} odpowiedział/a obecnością w Twoim pokoju.`,
  }),
  momentResonance: (name: string) => ({
    title: "Rezonans z chwilą",
    body: `${name.split(" ")[0]} poczuł/a Twój moment — bez słów.`,
  }),
} as const;

/** Zasady produktu — guardrail dla przyszłych feature'ów */
export const INTERACTION_GUARDRAILS = {
  noSwipe: true,
  noRankings: true,
  noLikeCounts: true,
  noReadReceipts: true,
  /** readAt w DB tylko retention/anti-spam — nigdy w API ani UI */
  readAtAnalyticsOnly: true,
  noAggressiveOnlineStatus: true,
  roomFirst: true,
  voiceFirst: true,
  /** liked w DB = „został w klimacie”, nie ocena osoby */
  resonanceNotRating: true,
} as const;
