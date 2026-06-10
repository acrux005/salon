import type { VibeCatalogMood, VibeCatalogPlatform } from "@/lib/randki/vibeCatalogTypes";

export type MoodFetchQuery = {
  mood: VibeCatalogMood;
  spotifyQuery: string;
  youtubeQuery: string;
  /** TMDB discover/movie — genre IDs (np. 18=drama, 10749=romance). */
  tmdbGenres: string;
};

/** Zapytania do API — odświeżane cronem raz dziennie. */
export const VIBE_CATALOG_QUERIES: MoodFetchQuery[] = [
  { mood: "chat", spotifyQuery: "lo-fi chill conversation evening", youtubeQuery: "lofi hip hop chill beats", tmdbGenres: "35,18" },
  { mood: "flirt", spotifyQuery: "romantic slow r&b evening", youtubeQuery: "romantic jazz dinner music", tmdbGenres: "10749,35" },
  { mood: "date", spotifyQuery: "date night jazz soul", youtubeQuery: "jazz dinner background music", tmdbGenres: "10749,10402" },
  { mood: "calm", spotifyQuery: "acoustic calm peaceful", youtubeQuery: "calm acoustic guitar instrumental", tmdbGenres: "18,10749" },
];

export const VIBE_CATALOG_LIMITS = {
  spotifyPerMood: 8,
  youtubePerMood: 5,
  tmdbPerMood: 6,
} as const;

export type CatalogSeedItem = {
  mood: VibeCatalogMood;
  platform: VibeCatalogPlatform;
  externalId: string;
  url: string;
  title: string;
  embedUrl: string | null;
  thumbnailUrl: string | null;
  artistName: string | null;
};

/** Fallback gdy brak kluczy API — kuratorski seed platformy. */
export const VIBE_CATALOG_SEED: CatalogSeedItem[] = [
  {
    mood: "calm",
    platform: "spotify",
    externalId: "4cOdK2wglTKBFrVl7gY4P7",
    url: "https://open.spotify.com/track/4cOdK2wglTKBFrVl7gY4P7",
    title: "Apocalypse",
    embedUrl: "https://open.spotify.com/embed/track/4cOdK2wglTKBFrVl7gY4P7?utm_source=randka",
    thumbnailUrl: null,
    artistName: "Cigarettes After Sex",
  },
  {
    mood: "calm",
    platform: "spotify",
    externalId: "0iO64s2UXxLrTKcEtqbWdd",
    url: "https://open.spotify.com/track/0iO64s2UXxLrTKcEtqbWdd",
    title: "Sunset Lover",
    embedUrl: "https://open.spotify.com/embed/track/0iO64s2UXxLrTKcEtqbWdd?utm_source=randka",
    thumbnailUrl: null,
    artistName: "Petit Biscuit",
  },
  {
    mood: "chat",
    platform: "spotify",
    externalId: "7qiZfU4dY1lWllzX7mPBI3",
    url: "https://open.spotify.com/track/7qiZfU4dY1lWllzX7mPBI3",
    title: "Shape of You",
    embedUrl: "https://open.spotify.com/embed/track/7qiZfU4dY1lWllzX7mPBI3?utm_source=randka",
    thumbnailUrl: null,
    artistName: "Ed Sheeran",
  },
  {
    mood: "chat",
    platform: "spotify",
    externalId: "3n3Ppam7vgaVa1iaRUc9Lp",
    url: "https://open.spotify.com/track/3n3Ppam7vgaVa1iaRUc9Lp",
    title: "Mr. Brightside",
    embedUrl: "https://open.spotify.com/embed/track/3n3Ppam7vgaVa1iaRUc9Lp?utm_source=randka",
    thumbnailUrl: null,
    artistName: "The Killers",
  },
  {
    mood: "flirt",
    platform: "spotify",
    externalId: "2vE5qZcCqB1m1J79sFNE07",
    url: "https://open.spotify.com/track/2vE5qZcCqB1m1J79sFNE07",
    title: "Redbone",
    embedUrl: "https://open.spotify.com/embed/track/2vE5qZcCqB1m1J79sFNE07?utm_source=randka",
    thumbnailUrl: null,
    artistName: "Childish Gambino",
  },
  {
    mood: "flirt",
    platform: "spotify",
    externalId: "6FBDa0IzpOUzRoziY5I63M",
    url: "https://open.spotify.com/track/6FBDa0IzpOUzRoziY5I63M",
    title: "Say It",
    embedUrl: "https://open.spotify.com/embed/track/6FBDa0IzpOUzRoziY5I63M?utm_source=randka",
    thumbnailUrl: null,
    artistName: "Flume",
  },
  {
    mood: "date",
    platform: "spotify",
    externalId: "4MjH01BHd4P7S06inPhQ5T",
    url: "https://open.spotify.com/track/4MjH01BHd4P7S06inPhQ5T",
    title: "Come Away With Me",
    embedUrl: "https://open.spotify.com/embed/track/4MjH01BHd4P7S06inPhQ5T?utm_source=randka",
    thumbnailUrl: null,
    artistName: "Norah Jones",
  },
  {
    mood: "date",
    platform: "spotify",
    externalId: "1lim79g6lQvQ6KUpLrmdjE",
    url: "https://open.spotify.com/track/1lim79g6lQvQ6KUpLrmdjE",
    title: "Fly Me To The Moon",
    embedUrl: "https://open.spotify.com/embed/track/1lim79g6lQvQ6KUpLrmdjE?utm_source=randka",
    thumbnailUrl: null,
    artistName: "Frank Sinatra",
  },
  {
    mood: "calm",
    platform: "youtube",
    externalId: "jfKfPfyJRdk",
    url: "https://www.youtube.com/watch?v=jfKfPfyJRdk",
    title: "lofi hip hop radio",
    embedUrl: "https://www.youtube.com/embed/jfKfPfyJRdk",
    thumbnailUrl: "https://img.youtube.com/vi/jfKfPfyJRdk/hqdefault.jpg",
    artistName: "Lofi Girl",
  },
  {
    mood: "chat",
    platform: "youtube",
    externalId: "5qap5aO4i9A",
    url: "https://www.youtube.com/watch?v=5qap5aO4i9A",
    title: "lofi hip hop radio — beats to relax/study to",
    embedUrl: "https://www.youtube.com/embed/5qap5aO4i9A",
    thumbnailUrl: "https://img.youtube.com/vi/5qap5aO4i9A/hqdefault.jpg",
    artistName: "Lofi Girl",
  },
  {
    mood: "date",
    platform: "youtube",
    externalId: "Dx5qFachd3A",
    url: "https://www.youtube.com/watch?v=Dx5qFachd3A",
    title: "Jazz for Dinner",
    embedUrl: "https://www.youtube.com/embed/Dx5qFachd3A",
    thumbnailUrl: "https://img.youtube.com/vi/Dx5qFachd3A/hqdefault.jpg",
    artistName: null,
  },
  {
    mood: "flirt",
    platform: "youtube",
    externalId: "n61ULEU7CO0",
    url: "https://www.youtube.com/watch?v=n61ULEU7CO0",
    title: "Smooth Jazz Romantic",
    embedUrl: "https://www.youtube.com/embed/n61ULEU7CO0",
    thumbnailUrl: "https://img.youtube.com/vi/n61ULEU7CO0/hqdefault.jpg",
    artistName: null,
  },
];

export function parseVibeCatalogMood(value: string | null | undefined): VibeCatalogMood | null {
  if (value === "chat" || value === "flirt" || value === "date" || value === "calm") return value;
  return null;
}
