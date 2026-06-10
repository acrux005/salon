export type InterestTagCategory = "vibe" | "everyday" | "culture" | "temperament";

export type InterestTagCategoryMeta = {
  id: InterestTagCategory;
  label: string;
  hint: string;
};

export const MAX_INTEREST_TAGS = 10;

export const RANDKI_INTEREST_CATEGORIES: InterestTagCategoryMeta[] = [
  { id: "vibe", label: "Klimat", hint: "estetyka, obrazy, nastrój" },
  { id: "everyday", label: "Codzienność", hint: "miejsca, zwierzęta, rytuały" },
  { id: "culture", label: "Kultura", hint: "muzyka, kino, książki — konkretnie" },
  { id: "temperament", label: "Temperament", hint: "jak jesteś, nie kim jesteś" },
];

/** Kuratorskie sugestie — mikrotożsamość, nie kategorie 2016. */
export const RANDKI_INTEREST_TAG_SUGGESTIONS: Record<InterestTagCategory, readonly string[]> = {
  vibe: [
    "nocne spacery",
    "deszcz i tramwaje",
    "slow mornings",
    "morze zimą",
    "zachody słońca",
    "roadtripy",
    "winyle",
    "ambient",
    "minimalizm",
    "analogowe aparaty",
    "tatuaże",
  ],
  everyday: [
    "kawiarnie",
    "małe kina",
    "second handy",
    "psy",
    "koty",
    "rośliny",
    "sushi",
    "planszówki",
    "góry poza sezonem",
    "technologia",
    "gotowanie w weekend",
  ],
  culture: [
    "jazz",
    "thrillery psychologiczne",
    "festiwale",
    "fotografia uliczna",
    "vinyle",
    "dokumenty",
    "krótkie opowiadania",
    "live session",
    "stare kino",
  ],
  temperament: [
    "cisza",
    "spontan",
    "powolne tempo",
    "rozmowy do rana",
    "solo time",
    "małe grupy",
    "bez pośpiechu",
    "ciekawość",
    "introwertyczne wieczory",
    "jazda bez celu",
  ],
};

/** @deprecated — stara lista; zostawiona dla migracji odczytu. */
export const RANDKI_INTERESTS_LEGACY = [
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

const ALL_SUGGESTIONS: { tag: string; category: InterestTagCategory }[] = (() => {
  const seen = new Set<string>();
  const out: { tag: string; category: InterestTagCategory }[] = [];
  for (const cat of RANDKI_INTEREST_CATEGORIES) {
    for (const tag of RANDKI_INTEREST_TAG_SUGGESTIONS[cat.id]) {
      const key = tag.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ tag, category: cat.id });
    }
  }
  return out;
})();

export function normalizeInterestTag(raw: string): string | null {
  const t = raw.trim().replace(/\s+/g, " ");
  if (t.length < 2 || t.length > 32) return null;
  if (/[<>{}[\]\\]/.test(t)) return null;
  return t;
}

export function sanitizeInterestTags(raw: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const r of raw) {
    const n = normalizeInterestTag(r);
    if (!n) continue;
    const key = n.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(n);
    if (out.length >= MAX_INTEREST_TAGS) break;
  }
  return out;
}

export function searchInterestSuggestions(
  query: string,
  selected: string[],
  limit = 8
): { tag: string; category: InterestTagCategory }[] {
  const q = query.trim().toLowerCase();
  const selectedLower = new Set(selected.map((s) => s.toLowerCase()));
  const scored: { tag: string; category: InterestTagCategory; score: number }[] = [];

  for (const { tag, category } of ALL_SUGGESTIONS) {
    if (selectedLower.has(tag.toLowerCase())) continue;
    if (!q) {
      scored.push({ tag, category, score: 0 });
      continue;
    }
    const lower = tag.toLowerCase();
    if (!lower.includes(q)) continue;
    let score = 1;
    if (lower.startsWith(q)) score = 3;
    else if (lower.split(/\s+/).some((w) => w.startsWith(q))) score = 2;
    scored.push({ tag, category, score });
  }

  scored.sort((a, b) => b.score - a.score || a.tag.localeCompare(b.tag, "pl"));
  return scored.slice(0, limit).map(({ tag, category }) => ({ tag, category }));
}

export function getCategoryLabel(category: InterestTagCategory): string {
  return RANDKI_INTEREST_CATEGORIES.find((c) => c.id === category)?.label ?? category;
}
