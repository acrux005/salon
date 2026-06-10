import { tmdbFetch, tmdbMovieUrl, tmdbPosterUrl } from "@/lib/randki/tmdb";

export type TmdbSearchHit = {
  id: number;
  title: string;
  year: string | null;
  url: string;
  thumbnailUrl: string | null;
};

const cache = new Map<string, { at: number; items: TmdbSearchHit[] }>();
const CACHE_TTL_MS = 15 * 60 * 1000;

function cacheGet(key: string): TmdbSearchHit[] | null {
  const hit = cache.get(key);
  if (!hit || Date.now() - hit.at > CACHE_TTL_MS) return null;
  return hit.items;
}

function cacheSet(key: string, items: TmdbSearchHit[]): void {
  cache.set(key, { at: Date.now(), items });
  if (cache.size > 200) {
    const oldest = Array.from(cache.entries()).sort((a, b) => a[1].at - b[1].at)[0]?.[0];
    if (oldest) cache.delete(oldest);
  }
}

/** Wyszukuje filmy w TMDB (cache 15 min). */
export async function searchTmdbMovies(query: string, limit = 10): Promise<TmdbSearchHit[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  const key = q.toLowerCase();
  const cached = cacheGet(key);
  if (cached) return cached;

  const data = await tmdbFetch<{
    results?: Array<{
      id: number;
      title?: string;
      release_date?: string;
      poster_path?: string | null;
    }>;
  }>("/search/movie", {
    query: q,
    include_adult: "false",
    language: "pl-PL",
    page: "1",
  });

  const items = (data?.results ?? [])
    .filter((m) => m.id && m.title)
    .slice(0, limit)
    .map((m) => ({
      id: m.id,
      title: m.title!,
      year: m.release_date?.slice(0, 4) ?? null,
      url: tmdbMovieUrl(m.id),
      thumbnailUrl: tmdbPosterUrl(m.poster_path),
    }));

  cacheSet(key, items);
  return items;
}
