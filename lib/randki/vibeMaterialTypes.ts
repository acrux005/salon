export type VibeMaterialPlatform = "youtube" | "spotify" | "tmdb" | "link" | "text";

/** Emocjonalny artefakt — nie integracja social. Max 3 na profilu. */
export type VibeMaterialKind = "music" | "film" | "youtube" | "quote" | "book" | "mood";

/** @deprecated — mapowane w normalizeVibeMaterialKind */
export type VibeMaterialSlotType =
  | VibeMaterialKind
  | "song"
  | "playlist"
  | "place"
  | "moment"
  | "anthem"
  | "mood_today"
  | "define";

export type VibeMaterialRow = {
  id: string;
  url: string | null;
  title: string;
  platform: VibeMaterialPlatform;
  embedUrl: string | null;
  thumbnailUrl: string | null;
  caption: string;
  slotType: VibeMaterialSlotType;
  sortOrder: number;
};

export const MAX_VIBE_MATERIALS = 3;

export const VIBE_MATERIAL_KINDS: VibeMaterialKind[] = ["music", "film", "youtube", "quote", "book", "mood"];

export const TYPED_VIBE_SLOTS = VIBE_MATERIAL_KINDS;
