export type BeautyCategorySlug =
  | "kosmetologia"
  | "paznokcie"
  | "rzesy-brwi"
  | "makijaz-permanentny"
  | "fryzjer"
  | "barber"
  | "podologia";

export type BeautyCategory = {
  slug: BeautyCategorySlug;
  label: string;
  shortLabel: string;
};

export const BEAUTY_CATEGORIES: BeautyCategory[] = [
  { slug: "kosmetologia", label: "Kosmetologia", shortLabel: "Kosmetologia" },
  { slug: "paznokcie", label: "Paznokcie", shortLabel: "Paznokcie" },
  { slug: "rzesy-brwi", label: "Rzęsy i brwi", shortLabel: "Rzęsy i brwi" },
  { slug: "makijaz-permanentny", label: "Makijaż permanentny", shortLabel: "Makijaż permanentny" },
  { slug: "fryzjer", label: "Fryzjer", shortLabel: "Fryzjer" },
  { slug: "barber", label: "Barber", shortLabel: "Barber" },
  { slug: "podologia", label: "Podologia", shortLabel: "Podologia" },
];

export const BEAUTY_CATEGORY_BY_SLUG = Object.fromEntries(
  BEAUTY_CATEGORIES.map((c) => [c.slug, c])
) as Record<BeautyCategorySlug, BeautyCategory>;

/** Poniżej tej liczby kategorii nie indeksujemy osobnego URL-a. */
export const MIN_CATEGORY_INDEX_COUNT = 8;

function fold(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

const RULES: { slug: BeautyCategorySlug; re: RegExp }[] = [
  { slug: "paznokcie", re: /nails?|paznok|manicur|hybryd|neonail|\bmani\b/ },
  { slug: "rzesy-brwi", re: /rzes|brwi|lash|brow|\bhenna\b|nice eyes/ },
  { slug: "makijaz-permanentny", re: /permanent|\bpmu\b|makija[zż] permanent/ },
  { slug: "podologia", re: /podolog|pedicur/ },
  { slug: "barber", re: /barber/ },
  { slug: "fryzjer", re: /fryzjer|fryzur|\bhair\b/ },
  {
    slug: "kosmetologia",
    re: /kosmetolog|kosmetycz|estetyc|beauty|clinic|instytut|mezoter|\bspa\b|urod|gabinet kosmet|salon kosmet|piekn|yasumi|kacik|kącik|diamond skin|mania malowania|new look|metamorfoza|wiza[zż]|makeup|make[\s-]?up|glamour/,
  },
];

const FALLBACK_RE = /salon|studio|gabinet|glamour|wiza[zż]|makeup|make[\s-]?up|makija/;

export function inferBeautyCategories(name: string): BeautyCategory[] {
  const n = fold(name);
  const found = new Set<BeautyCategorySlug>();
  for (const rule of RULES) {
    if (rule.re.test(n)) found.add(rule.slug);
  }
  if (found.size === 0 && FALLBACK_RE.test(n)) found.add("kosmetologia");
  return BEAUTY_CATEGORIES.filter((c) => found.has(c.slug));
}

export function categoryPath(citySlug: string, categorySlug: BeautyCategorySlug): string {
  return `/portal/gabinety/${citySlug}/${categorySlug}`;
}
