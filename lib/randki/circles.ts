/** Prywatne kręgi — mniejsze społeczności zamiast globalnego katalogu. */
export const RANDKI_CIRCLES = [
  {
    slug: "creatives",
    label: "Kreatywni",
    emoji: "🎨",
    description: "Design, sztuka, muzyka",
    longDescription: "Dla ludzi z kreatywnej bańki — projektanci, muzycy, ilustratorzy. Mniejszy feed, większa szansa na głęboką rozmowę.",
    membersHint: "~120 osób w Warszawie",
    premium: false,
  },
  {
    slug: "startup",
    label: "Startup & tech",
    emoji: "🚀",
    description: "Founders, devs, product",
    longDescription: "Founders, developerzy, product — tempo, ambicja, humor o deployu o 3 w nocy.",
    membersHint: "Aktywni w coworkach",
    premium: false,
  },
  {
    slug: "gamers",
    label: "Gamerzy",
    emoji: "🎮",
    description: "Gry, streaming, e-sport",
    longDescription: "Od chill co-op po ranked — poznajesz kogoś, z kim gra ma sens, nie tylko matchmaking.",
    membersHint: "Online wieczorami",
    premium: false,
  },
  {
    slug: "photographers",
    label: "Fotografowie",
    emoji: "📷",
    description: "Foto, podróże, street",
    longDescription: "Street, portret, podróże — wspólny język światła i kadru. Premium krąg.",
    membersHint: "Premium · curated",
    premium: true,
  },
  {
    slug: "travelers",
    label: "Podróżnicy",
    emoji: "✈️",
    description: "City breaks i dalekie wyjazdy",
    longDescription: "City breaks, backpacking, slow travel — ktoś, kto rozumie, że „kocham podróże” to za mało.",
    membersHint: "Premium · global vibe",
    premium: true,
  },
  {
    slug: "fitness",
    label: "Aktywni",
    emoji: "💪",
    description: "Sport, zdrowie, ruch",
    longDescription: "Bieganie, siłownia, rower — randka albo znajomość w ruchu.",
    membersHint: "Poranki i weekendy",
    premium: false,
  },
  {
    slug: "introverts",
    label: "Spokojna energia",
    emoji: "🌿",
    description: "Introwertyczny vibe, 1:1",
    longDescription: "Bez presji na imprezy — głębokie rozmowy, spokojne tempo, szacunek do granic.",
    membersHint: "Slow intimacy",
    premium: false,
  },
] as const;

export type RandkiCircleSlug = (typeof RANDKI_CIRCLES)[number]["slug"];

export function getCircleBySlug(slug: string | null | undefined) {
  if (!slug) return null;
  return RANDKI_CIRCLES.find((c) => c.slug === slug) ?? null;
}

export function circleLabel(slug: string | null | undefined): string | null {
  const c = getCircleBySlug(slug);
  return c ? `${c.emoji} ${c.label}` : null;
}
