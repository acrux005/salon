export const RANDKI_INTENTIONS = [
  { value: "relationship", label: "Poważna relacja" },
  { value: "casual", label: "Lekka znajomość / randki" },
  { value: "exploring", label: "Poznaję opcje" },
  { value: "friendship", label: "Przyjaźń z chemią" },
] as const;

export const RANDKI_MOODS = [
  { value: "chat", label: "Szukam rozmowy", emoji: "💬" },
  { value: "flirt", label: "Chcę flirtu", emoji: "✨" },
  { value: "date", label: "Chcę wyjść", emoji: "🥂" },
  { value: "calm", label: "Spokojna energia", emoji: "🌿" },
] as const;

/** Real-life intent — bez GPS, tylko „co dziś robisz”. */
export const RANDKI_ACTIVITY_INTENTS = [
  { value: "coffee", label: "Kawa na mieście", emoji: "☕" },
  { value: "walk", label: "Spacer", emoji: "🚶" },
  { value: "food", label: "Kolacja / lunch", emoji: "🍽️" },
  { value: "culture", label: "Kino / koncert", emoji: "🎬" },
  { value: "sport", label: "Aktywnie", emoji: "🏃" },
  { value: "cowork", label: "Cowork / czytanie", emoji: "💻" },
] as const;

export const RANDKI_ONBOARDING_QUESTIONS = [
  {
    id: "weekend",
    question: "Idealny weekend to…",
    type: "choice" as const,
    options: [
      { value: "planned", label: "Plan i checklista" },
      { value: "spontaneous", label: "Spontan — zobaczymy" },
      { value: "mix", label: "Mix obu" },
    ],
  },
  {
    id: "pace",
    question: "Tempo relacji, które Ci pasuje:",
    type: "choice" as const,
    options: [
      { value: "slow", label: "Powoli, krok po kroku" },
      { value: "medium", label: "Naturalnie, bez pośpiechu" },
      { value: "fast", label: "Szybko wiem, czy rezonuje" },
    ],
  },
  {
    id: "communication",
    question: "Styl komunikacji:",
    type: "choice" as const,
    options: [
      { value: "planner", label: "Konkretnie, krótko, na temat" },
      { value: "expressive", label: "Emocjonalnie, z detalami" },
      { value: "humor", label: "Humor i lekkość" },
    ],
  },
  {
    id: "socialEnergy",
    question: "Energia społeczna:",
    type: "choice" as const,
    options: [
      { value: "introvert", label: "Introwertyczna — 1:1" },
      { value: "ambivert", label: "Zależy od dnia" },
      { value: "extrovert", label: "Towarzysko, dużo wrażeń" },
    ],
  },
  {
    id: "dealbreaker",
    question: "Co szybko Cię zniechęca?",
    type: "text" as const,
    placeholder: "Np. brak szacunku, ghosting, fałszywe zdjęcia…",
  },
  {
    id: "values",
    question: "Co jest dla Ciebie ważne w relacji?",
    type: "multi" as const,
    options: [
      { value: "honesty", label: "Szczerość" },
      { value: "humor", label: "Humor" },
      { value: "ambition", label: "Ambicja" },
      { value: "kindness", label: "Empatia" },
      { value: "stability", label: "Stabilność" },
      { value: "adventure", label: "Przygoda" },
    ],
  },
  {
    id: "dateStyle",
    question: "Idealna pierwsza randka:",
    type: "choice" as const,
    options: [
      { value: "coffee", label: "Kawa / spacer" },
      { value: "activity", label: "Aktywność (kino, gra…)" },
      { value: "dinner", label: "Kolacja / restauracja" },
      { value: "surprise", label: "Niespodzianka" },
    ],
  },
  {
    id: "redFlag",
    question: "Mój red flag (z humorem):",
    type: "text" as const,
    placeholder: "Np. „nie lubię kawy” albo „pisze tylko „hej””",
  },
] as const;

export type OnboardingAnswers = Record<string, string | string[]>;

export function parseOnboardingJson(raw: string | null | undefined): OnboardingAnswers {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    return parsed as OnboardingAnswers;
  } catch {
    return {};
  }
}

export function deriveCommunicationStyle(answers: OnboardingAnswers): string {
  const c = answers.communication;
  if (typeof c === "string") return c;
  const w = answers.weekend;
  if (w === "planned") return "planner";
  if (w === "spontaneous") return "expressive";
  return "humor";
}
