import type { VibeMaterialKind, VibeMaterialSlotType } from "@/lib/randki/vibeMaterialTypes";
import { VIBE_MATERIAL_KINDS } from "@/lib/randki/vibeMaterialTypes";
import type { VibeCatalogRow } from "@/lib/randki/vibeCatalogTypes";

export type VibeMaterialKindConfig = {
  kind: VibeMaterialKind;
  emoji: string;
  label: string;
  hint: string;
  urlPlaceholder: string;
  quotePlaceholder: string;
  captionPlaceholder: string;
  catalog: "music" | "film" | "youtube" | null;
  allowsLink: boolean;
  allowsQuote: boolean;
};

export const VIBE_MATERIAL_KIND_CONFIG: VibeMaterialKindConfig[] = [
  {
    kind: "music",
    emoji: "🎵",
    label: "Muzyka",
    hint: "Wybierz utwór, potem dopisz jeden moment — np. „nocny spacer”.",
    urlPlaceholder: "https://open.spotify.com/track/… lub playlist/…",
    quotePlaceholder: "",
    captionPlaceholder: "piosenka na nocny spacer",
    catalog: "music",
    allowsLink: true,
    allowsQuote: false,
  },
  {
    kind: "film",
    emoji: "🎬",
    label: "Film",
    hint: "Film albo scena — potem jeden obraz z Twojego życia.",
    urlPlaceholder: "Link opcjonalny (katalog TMDB wystarczy)",
    quotePlaceholder: "",
    captionPlaceholder: "film do oglądania w deszcz",
    catalog: "film",
    allowsLink: true,
    allowsQuote: false,
  },
  {
    kind: "youtube",
    emoji: "📺",
    label: "Scena YouTube",
    hint: "Jeden link — potem krótki fragment, dlaczego to zostaje.",
    urlPlaceholder: "https://youtube.com/watch?v=…",
    quotePlaceholder: "",
    captionPlaceholder: "oglądam to gdy potrzebuję ciszy",
    catalog: "youtube",
    allowsLink: true,
    allowsQuote: false,
  },
  {
    kind: "quote",
    emoji: "✍",
    label: "Cytat",
    hint: "Zdanie które wraca — bez poezji, bez presji.",
    urlPlaceholder: "",
    quotePlaceholder: "zdanie które dziś do Ciebie trafia…",
    captionPlaceholder: "opcjonalnie — dlaczego to zdanie",
    catalog: null,
    allowsLink: false,
    allowsQuote: true,
  },
  {
    kind: "book",
    emoji: "📖",
    label: "Książka",
    hint: "Tytuł i autor — potem jedno wspomnienie, nie recenzja.",
    urlPlaceholder: "Link do Goodreads (opcjonalnie)",
    quotePlaceholder: "Tytuł — autor",
    captionPlaceholder: "wracam do niej po trudnym dniu",
    catalog: null,
    allowsLink: true,
    allowsQuote: true,
  },
  {
    kind: "mood",
    emoji: "🌙",
    label: "Mood",
    hint: "Jeden ułamek wspomnienia — scena, moment, skojarzenie.",
    urlPlaceholder: "",
    quotePlaceholder: "miejsce, do którego wracasz myślami…",
    captionPlaceholder: "",
    catalog: null,
    allowsLink: false,
    allowsQuote: true,
  },
];

const KIND_MAP = new Map(VIBE_MATERIAL_KIND_CONFIG.map((c) => [c.kind, c]));

const LEGACY_KIND: Record<string, VibeMaterialKind> = {
  song: "music",
  playlist: "music",
  anthem: "music",
  mood_today: "mood",
  define: "mood",
  place: "mood",
  moment: "mood",
};

export function normalizeVibeMaterialKind(value: string | null | undefined): VibeMaterialKind | null {
  if (!value) return null;
  if (KIND_MAP.has(value as VibeMaterialKind)) return value as VibeMaterialKind;
  return LEGACY_KIND[value] ?? null;
}

export function getVibeMaterialKindConfig(kind: VibeMaterialKind | VibeMaterialSlotType): VibeMaterialKindConfig | undefined {
  const normalized = normalizeVibeMaterialKind(kind);
  return normalized ? KIND_MAP.get(normalized) : undefined;
}

export function getVibeMaterialSlotConfig(type: VibeMaterialSlotType): VibeMaterialKindConfig | undefined {
  return getVibeMaterialKindConfig(type);
}

export function kindLabel(kind: VibeMaterialKind | VibeMaterialSlotType): string {
  const cfg = getVibeMaterialKindConfig(kind);
  if (cfg) return `${cfg.emoji} ${cfg.label}`;
  return kind;
}

export function sortVibeMaterials<T extends { slotType: VibeMaterialSlotType; sortOrder: number }>(items: T[]): T[] {
  const order = (type: VibeMaterialSlotType) => {
    const k = normalizeVibeMaterialKind(type);
    const idx = k ? VIBE_MATERIAL_KINDS.indexOf(k) : 99;
    return idx >= 0 ? idx : 99;
  };
  return [...items].sort((a, b) => order(a.slotType) - order(b.slotType) || a.sortOrder - b.sortOrder);
}

export const VIBE_MATERIAL_SLOTS = VIBE_MATERIAL_KIND_CONFIG.map((c) => ({
  type: c.kind as VibeMaterialSlotType,
  emoji: c.emoji,
  label: c.label,
  hint: c.hint,
  urlPlaceholder: c.urlPlaceholder,
  quotePlaceholder: c.quotePlaceholder,
  captionPlaceholder: c.captionPlaceholder,
  sortOrder: VIBE_MATERIAL_KINDS.indexOf(c.kind),
}));

export function slotLabel(type: VibeMaterialSlotType): string {
  return kindLabel(type);
}

export function filterCatalogForKind(catalog: VibeCatalogRow[], kind: VibeMaterialKind): VibeCatalogRow[] {
  const cfg = getVibeMaterialKindConfig(kind);
  if (cfg?.catalog === "film") return catalog.filter((c) => c.platform === "tmdb");
  if (cfg?.catalog === "music") return catalog.filter((c) => c.platform === "spotify");
  if (cfg?.catalog === "youtube") return catalog.filter((c) => c.platform === "youtube");
  return [];
}
