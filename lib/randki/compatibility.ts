import { parseInterests, parsePrompts } from "@/lib/randki/constants";
import { parseOnboardingJson, type OnboardingAnswers } from "@/lib/randki/onboarding";
import { buildEmotionalWhyReason } from "@/lib/randki/emotionalMoments";
import type { VibeMaterialRow } from "@/lib/randki/vibeMaterialTypes";

type ProfileSlice = {
  interests: string;
  promptsJson: string;
  onboardingJson: string;
  intention: string;
  mood: string | null;
  activityIntent?: string | null;
  communicationStyle: string | null;
  bio: string;
  displayName?: string;
  circleSlug?: string | null;
};

function overlap(a: string[], b: string[]): number {
  const set = new Set(a);
  return b.filter((x) => set.has(x)).length;
}

function choiceMatch(a: unknown, b: unknown): number {
  if (!a || !b || typeof a !== "string" || typeof b !== "string") return 0;
  if (a === b) return 3;
  const similar: Record<string, string[]> = {
    planned: ["mix"],
    spontaneous: ["mix"],
    mix: ["planned", "spontaneous"],
    slow: ["medium"],
    medium: ["slow", "fast"],
    fast: ["medium"],
    planner: ["expressive"],
    expressive: ["planner", "humor"],
    humor: ["expressive"],
    introvert: ["ambivert"],
    ambivert: ["introvert", "extrovert"],
    extrovert: ["ambivert"],
  };
  return similar[a]?.includes(b) ? 1 : 0;
}

function valuesOverlap(a: OnboardingAnswers, b: OnboardingAnswers): number {
  const va = Array.isArray(a.values) ? a.values : [];
  const vb = Array.isArray(b.values) ? b.values : [];
  return overlap(va, vb);
}

export function computeCompatibilityScore(my: ProfileSlice, their: ProfileSlice): number {
  const myOn = parseOnboardingJson(my.onboardingJson);
  const theirOn = parseOnboardingJson(their.onboardingJson);
  let score = 0;

  score += overlap(parseInterests(my.interests), parseInterests(their.interests)) * 2;
  score += valuesOverlap(myOn, theirOn) * 3;
  score += choiceMatch(myOn.pace, theirOn.pace) * 2;
  score += choiceMatch(myOn.weekend, theirOn.weekend) * 2;
  score += choiceMatch(myOn.communication, theirOn.communication) * 2;
  score += choiceMatch(myOn.socialEnergy, theirOn.socialEnergy);
  score += choiceMatch(myOn.dateStyle, theirOn.dateStyle);

  if (my.intention === their.intention) score += 4;
  if (my.mood && their.mood && my.mood === their.mood) score += 5;

  const myPrompts = parsePrompts(my.promptsJson);
  const theirPrompts = parsePrompts(their.promptsJson);
  if (myPrompts.length && theirPrompts.length) score += 2;

  return score;
}

type WhyReasonProfile = ProfileSlice & { displayName?: string };

export function buildFallbackWhyReason(
  my: WhyReasonProfile,
  their: WhyReasonProfile,
  score: number,
  options?: { vibeMaterials?: VibeMaterialRow[] }
): string {
  const sharedActivity = !!(
    my.activityIntent &&
    their.activityIntent &&
    my.activityIntent === their.activityIntent
  );
  const emotional = buildEmotionalWhyReason(
    {
      displayName: their.displayName,
      interests: their.interests,
      mood: their.mood,
      activityIntent: their.activityIntent ?? null,
      circleSlug: their.circleSlug,
      communicationStyle: their.communicationStyle,
    },
    { vibeMaterials: options?.vibeMaterials, sharedActivity }
  );
  if (emotional) return emotional;

  const shared = overlap(parseInterests(my.interests), parseInterests(their.interests));
  if (shared >= 2) return `${shared} wspólne tematy — dobry wieczór na start.`;
  if (score >= 12) return "Podobny rytm — warto zajrzeć głębiej.";
  if (score >= 8) return "Inna perspektywa — może właśnie dlatego ciekawie.";
  return "Obecność zamiast checklisty — zajrzyj do pokoju.";
}

export function profileSummaryForAi(p: ProfileSlice & { displayName: string; city: string }): string {
  const on = parseOnboardingJson(p.onboardingJson);
  const interests = parseInterests(p.interests).join(", ");
  const prompts = parsePrompts(p.promptsJson)
    .map((x) => `${x.question} ${x.answer}`)
    .join("; ");
  return [
    `${p.displayName}, ${p.city}`,
    `Intencja: ${p.intention}`,
    p.mood ? `Nastrój: ${p.mood}` : "",
    interests ? `Klimat / tagi: ${interests}` : "",
    p.bio ? `Bio: ${p.bio.slice(0, 200)}` : "",
    prompts ? `Prompty: ${prompts}` : "",
    on.dealbreaker ? `Dealbreaker: ${String(on.dealbreaker).slice(0, 100)}` : "",
    on.redFlag ? `Red flag: ${String(on.redFlag).slice(0, 80)}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}
