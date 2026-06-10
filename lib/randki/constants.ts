export const RANDKI_GENDERS = [
  { value: "woman", label: "Kobieta" },
  { value: "man", label: "Mężczyzna" },
  { value: "other", label: "Inna" },
] as const;

export const RANDKI_LOOKING_FOR = [
  { value: "woman", label: "Kobiety" },
  { value: "man", label: "Mężczyzn" },
  { value: "other", label: "Inne" },
] as const;

/** @deprecated Użyj lib/randki/interestTags — mikrotożsamość zamiast kategorii 2016. */
export const RANDKI_INTERESTS = [
  "Podróże",
  "Sport",
  "Muzyka",
  "Kino",
  "Gotowanie",
  "Książki",
  "Natura",
  "Sztuka",
  "Gry",
  "Taniec",
  "Fotografia",
  "Kawa",
] as const;

/** Sytuacyjne prompty — wymuszają obraz/scenę, nie checklistę cech. */
export const RANDKI_PROMPT_TEMPLATES = [
  "Idealna sobota to…",
  "Z kim chciał(a)byś utknąć na stacji o 1 w nocy?",
  "Po czym poznajesz, że dobrze się przy kimś czujesz?",
  "Jak wygląda spokojny wieczór idealny?",
  "Czyja obecność Cię uspokaja?",
  "Co jest bardziej intymne niż randka?",
  "Z kim można jechać bez celu?",
  "Najlepsza randka, jaką miałem/am to…",
  "Kiedy ostatnio poczułeś/aś, że ktoś naprawdę Cię słucha?",
  "Gdzie jesteś myślami, gdy wszystko jest za głośne?",
  "Co robisz, gdy nie chcesz nic planować?",
  "Jaki moment z ostatniego tygodnia zostaje?",
] as const;

export const RANDKI_PROMPT_ANSWER_HINTS: Partial<Record<(typeof RANDKI_PROMPT_TEMPLATES)[number], string>> = {
  "Idealna sobota to…": "np. kawa o 9, targ, wieczorny film bez planu",
  "Z kim chciał(a)byś utknąć na stacji o 1 w nocy?": "np. z kim milczenie nie jest dziwne",
  "Po czym poznajesz, że dobrze się przy kimś czujesz?": "np. nie muszę nic udawać",
  "Jak wygląda spokojny wieczór idealny?": "np. herbata, koc, rozmowa bez pośpiechu",
  "Czyja obecność Cię uspokaja?": "np. kto umie usiąść obok i nie grać nikogo",
  "Co jest bardziej intymne niż randka?": "np. wspólna cisza albo powrót nocnym tramwajem",
  "Z kim można jechać bez celu?": "np. kto nie pyta dokąd",
  "Najlepsza randka, jaką miałem/am to…": "np. spacer bez mapy i lody o północy",
  "Kiedy ostatnio poczułeś/aś, że ktoś naprawdę Cię słucha?": "np. jedna konkretna rozmowa, nie ogólnik",
  "Gdzie jesteś myślami, gdy wszystko jest za głośne?": "np. pusty tramwaj o 23:00",
  "Co robisz, gdy nie chcesz nic planować?": "np. film w tle i zero harmonogramu",
  "Jaki moment z ostatniego tygodnia zostaje?": "np. jeden obraz — nie lista dni",
};

export function getPromptAnswerHint(question: string): string {
  return (
    RANDKI_PROMPT_ANSWER_HINTS[question as (typeof RANDKI_PROMPT_TEMPLATES)[number]] ??
    "Jeden obraz albo jedna scena — nie lista cech"
  );
}

export type RandkiGender = (typeof RANDKI_GENDERS)[number]["value"];

export function parseLookingFor(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function parseInterests(raw: string | null | undefined): string[] {
  return parseLookingFor(raw);
}

export type RandkiPrompt = { question: string; answer: string };

export function parsePrompts(raw: string | null | undefined): RandkiPrompt[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((x) => x && typeof x === "object")
      .map((x) => {
        const o = x as { question?: string; answer?: string };
        return { question: String(o.question ?? ""), answer: String(o.answer ?? "") };
      })
      .filter((p) => p.question.trim() && p.answer.trim())
      .slice(0, 3);
  } catch {
    return [];
  }
}

export function calcAge(birthYear: number): number {
  return new Date().getFullYear() - birthYear;
}

export function genderCompatible(
  myGender: string,
  myLookingFor: string[],
  theirGender: string,
  theirLookingFor: string[]
): boolean {
  const iWantThem = myLookingFor.length === 0 || myLookingFor.includes(theirGender);
  const theyWantMe = theirLookingFor.length === 0 || theirLookingFor.includes(myGender);
  return iWantThem && theyWantMe;
}
