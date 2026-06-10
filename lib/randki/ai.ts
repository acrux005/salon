import OpenAI from "openai";
import { buildFallbackWhyReason, profileSummaryForAi } from "@/lib/randki/compatibility";
import type { VibeMaterialKind } from "@/lib/randki/vibeMaterialTypes";
import { expandVibeSeedFromPool } from "@/lib/randki/vibeCaptionThoughts";

function getOpenAI(): OpenAI | null {
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) return null;
  return new OpenAI({ apiKey: key });
}

type ProfileForAi = Parameters<typeof profileSummaryForAi>[0];

export async function moderateDatingMessage(body: string): Promise<{ ok: true } | { ok: false; reason: string }> {
  const trimmed = body.trim();
  if (!trimmed) return { ok: false, reason: "Wiadomość nie może być pusta." };

  const blocked = [
    /\b(kurw|chuj|pierdol|jeb[aą]|suka)\b/i,
    /\b(sex|nudes|nago|porno)\b/i,
    /(bitcoin|crypto|inwestycj|wygr[aą][łl])/i,
    /(telegram|whatsapp\.com|t\.me\/)/i,
  ];
  for (const re of blocked) {
    if (re.test(trimmed)) {
      return { ok: false, reason: "Wiadomość narusza zasady bezpieczeństwa lub wygląda na spam." };
    }
  }

  const openai = getOpenAI();
  if (!openai) return { ok: true };

  try {
    const mod = await openai.moderations.create({ input: trimmed });
    const r = mod.results[0];
    if (r?.flagged) {
      return { ok: false, reason: "Wiadomość może być nieodpowiednia. Spróbuj napisać inaczej." };
    }
  } catch (e) {
    console.error("[moderateDatingMessage]", e);
  }
  return { ok: true };
}

export async function generateWhyMatchReason(
  myProfile: ProfileForAi,
  theirProfile: ProfileForAi,
  score: number
): Promise<string> {
  const fallback = buildFallbackWhyReason(myProfile, theirProfile, score);
  const openai = getOpenAI();
  if (!openai) return fallback;

  try {
    const resp = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      max_tokens: 120,
      messages: [
        {
          role: "system",
          content:
            "Jesteś asystentem randkowym Randki Odart. Napisz JEDNO zdanie po polsku dlaczego te dwie osoby mogą dobrze ze sobą rozmawiać. Bez cliché, konkretnie, ciepło. Max 120 znaków.",
        },
        {
          role: "user",
          content: `Osoba A:\n${profileSummaryForAi(myProfile)}\n\nOsoba B:\n${profileSummaryForAi(theirProfile)}\n\nScore: ${score}`,
        },
      ],
    });
    const text = resp.choices[0]?.message?.content?.trim();
    return text && text.length <= 200 ? text : fallback;
  } catch (e) {
    console.error("[generateWhyMatchReason]", e);
    return fallback;
  }
}

export async function generateIcebreakers(
  myProfile: ProfileForAi,
  theirProfile: ProfileForAi
): Promise<string[]> {
  const openai = getOpenAI();
  const sharedInterests = myProfile.bio; // fallback context
  void sharedInterests;

  const ruleBased = buildRuleIcebreakers(myProfile, theirProfile);
  if (!openai) return ruleBased;

  try {
    const resp = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.85,
      max_tokens: 400,
      messages: [
        {
          role: "system",
          content:
            "Wygeneruj dokładnie 3 krótkie pierwsze wiadomości po polsku (max 140 znaków każda) do randki. JSON array of strings only, bez markdown.",
        },
        {
          role: "user",
          content: `Ja:\n${profileSummaryForAi(myProfile)}\n\nOn/Ona:\n${profileSummaryForAi(theirProfile)}`,
        },
      ],
    });
    const raw = resp.choices[0]?.message?.content?.trim() ?? "";
    const parsed = JSON.parse(raw.replace(/^```json|```$/g, "").trim()) as unknown;
    if (Array.isArray(parsed) && parsed.every((x) => typeof x === "string")) {
      return parsed.slice(0, 3).map((s) => s.slice(0, 200));
    }
  } catch (e) {
    console.error("[generateIcebreakers]", e);
  }
  return ruleBased;
}

function buildRuleIcebreakers(my: ProfileForAi, their: ProfileForAi): string[] {
  const name = their.displayName.split(" ")[0];
  return [
    `Cześć ${name}! Co Cię ostatnio naprawdę wciągnęło — kawa, kino czy coś innego?`,
    `Hej ${name}, widzę że jesteś z ${their.city} — masz ulubione miejsce na pierwszą rozmówię?`,
    `${name}, twój profil brzmi autentycznie — jaki był Twój ostatni „idealny weekend”?`,
  ];
}

export async function generateDateSuggestions(
  myProfile: ProfileForAi,
  theirProfile: ProfileForAi,
  city: string,
  restaurants: { name: string; orderUrl: string }[]
): Promise<string[]> {
  const fallback = restaurants.slice(0, 3).map((r) => `${r.name} — rezerwacja przez Zamów: ${r.orderUrl}`);
  const openai = getOpenAI();
  if (!openai) return fallback;

  try {
    const resp = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.6,
      max_tokens: 300,
      messages: [
        {
          role: "system",
          content: `Zaproponuj 3 pomysły na randkę w ${city} po polsku. Krótko (1 linia każdy). Uwzględnij profile. JSON array of strings.`,
        },
        {
          role: "user",
          content: `A: ${profileSummaryForAi(myProfile)}\nB: ${profileSummaryForAi(theirProfile)}\nRestauracje: ${restaurants.map((r) => r.name).join(", ")}`,
        },
      ],
    });
    const raw = resp.choices[0]?.message?.content?.trim() ?? "";
    const parsed = JSON.parse(raw.replace(/^```json|```$/g, "").trim()) as unknown;
    if (Array.isArray(parsed) && parsed.every((x) => typeof x === "string")) {
      return parsed.slice(0, 3);
    }
  } catch (e) {
    console.error("[generateDateSuggestions]", e);
  }
  return fallback;
}

export async function generateMatchCompatibilityNote(
  myProfile: ProfileForAi,
  theirProfile: ProfileForAi,
  score: number
): Promise<string> {
  const why = await generateWhyMatchReason(myProfile, theirProfile, score);
  return why;
}

const VIBE_KIND_LABELS: Record<VibeMaterialKind, string> = {
  music: "muzyka",
  film: "film",
  youtube: "scena YouTube",
  quote: "cytat",
  book: "książka",
  mood: "klimat / wspomnienie",
};

export async function generateVibeCaptionSuggestions(kind: VibeMaterialKind, seed: string): Promise<string[]> {
  const fallback = expandVibeSeedFromPool(kind, seed);

  const openai = getOpenAI();
  if (!openai) return fallback;

  const trimmed = seed.trim();
  if (!trimmed) return fallback;

  try {
    const resp = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.85,
      max_tokens: 220,
      messages: [
        {
          role: "system",
          content:
            "Jesteś asystentem profilu Randki Odart (slow intimacy). Użytkownik dodaje emocjonalny fragment profilu — nie bio, nie checklistę cech. Wygeneruj dokładnie 3 krótkie propozycje po polsku (max 80 znaków każda). Każda propozycja to: obraz, sytuacja, emocja albo konkretny detal — NIE cechy charakteru (humor, szczerość, empatia). Unikaj cringe'u i poezji. JSON array of strings only.",
        },
        {
          role: "user",
          content: `Typ: ${VIBE_KIND_LABELS[kind]}\nLuźny pomysł użytkownika: ${trimmed}`,
        },
      ],
    });
    const raw = resp.choices[0]?.message?.content?.trim() ?? "";
    const parsed = JSON.parse(raw.replace(/^```json|```$/g, "").trim()) as unknown;
    if (Array.isArray(parsed) && parsed.every((x) => typeof x === "string")) {
      return parsed.slice(0, 3).map((s) => s.slice(0, 120));
    }
  } catch (e) {
    console.error("[generateVibeCaptionSuggestions]", e);
  }
  return fallback;
}

export async function generateWingmanTips(
  myName: string,
  otherName: string,
  messages: { body: string; senderIsMe: boolean }[]
): Promise<string[]> {
  const fallback = buildWingmanFallback(messages, otherName);
  const openai = getOpenAI();
  if (!openai || messages.length < 2) return fallback;

  const transcript = messages
    .slice(-12)
    .map((m) => `${m.senderIsMe ? myName : otherName}: ${m.body}`)
    .join("\n");

  try {
    const resp = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      max_tokens: 350,
      messages: [
        {
          role: "system",
          content:
            "Jesteś AI wingmanem Randki Odart. Daj 2-3 krótkie, empatyczne wskazówki po polsku (max 100 znaków każda). JSON array of strings. Bez manipulacji, szacunek obu stron.",
        },
        { role: "user", content: `Rozmowa:\n${transcript}` },
      ],
    });
    const raw = resp.choices[0]?.message?.content?.trim() ?? "";
    const parsed = JSON.parse(raw.replace(/^```json|```$/g, "").trim()) as unknown;
    if (Array.isArray(parsed) && parsed.every((x) => typeof x === "string")) {
      return parsed.slice(0, 3).map((s) => s.slice(0, 150));
    }
  } catch (e) {
    console.error("[generateWingmanTips]", e);
  }
  return fallback;
}

function buildWingmanFallback(messages: { body: string; senderIsMe: boolean }[], otherName: string): string[] {
  const mine = messages.filter((m) => m.senderIsMe).length;
  const theirs = messages.length - mine;
  const tips: string[] = [];
  if (theirs === 0) tips.push("Zadaj otwarte pytanie o coś z profilu — nie tylko „hej”.");
  if (mine > theirs + 2) tips.push(`${otherName} odpowiada krócej — daj przestrzeń, jedno pytanie na raz.`);
  if (messages.length >= 6 && mine >= 2 && theirs >= 2) tips.push("Macie flow — to dobry moment na propozycję kawy bez presji.");
  if (tips.length === 0) tips.push("Bądź ciekawy/a, nie perfekcyjny/a — autentyczność wygrywa z pick-up line.");
  return tips.slice(0, 3);
}
