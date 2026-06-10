export type VibeCatalogPlatform = "spotify" | "youtube" | "tmdb";

export type VibeCatalogMood = "chat" | "flirt" | "date" | "calm";

export type VibeCatalogRow = {
  id: string;
  mood: VibeCatalogMood;
  platform: VibeCatalogPlatform;
  externalId: string;
  url: string;
  title: string;
  embedUrl: string | null;
  thumbnailUrl: string | null;
  artistName: string | null;
};

export const VIBE_CATALOG_MOODS: VibeCatalogMood[] = ["chat", "flirt", "date", "calm"];
