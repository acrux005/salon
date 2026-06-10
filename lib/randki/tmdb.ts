const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w342";

export function getTmdbAuthHeaders(): Record<string, string> | null {
  const token = process.env.TMDB_READ_ACCESS_TOKEN?.trim();
  const apiKey = process.env.TMDB_API_KEY?.trim();
  if (token) return { Authorization: `Bearer ${token}` };
  if (apiKey) return {};
  return null;
}

export function getTmdbApiKeyParam(): string | null {
  if (process.env.TMDB_READ_ACCESS_TOKEN?.trim()) return null;
  return process.env.TMDB_API_KEY?.trim() ?? null;
}

export function tmdbPosterUrl(posterPath: string | null | undefined): string | null {
  if (!posterPath) return null;
  return `${TMDB_IMAGE_BASE}${posterPath}`;
}

export function tmdbMovieUrl(movieId: number | string): string {
  return `https://www.themoviedb.org/movie/${movieId}`;
}

export async function tmdbFetch<T>(path: string, params: Record<string, string> = {}): Promise<T | null> {
  const headers = getTmdbAuthHeaders();
  if (!headers) return null;

  const url = new URL(`${TMDB_BASE}${path}`);
  const apiKey = getTmdbApiKeyParam();
  if (apiKey) url.searchParams.set("api_key", apiKey);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);

  const res = await fetch(url, {
    headers,
    signal: AbortSignal.timeout(12_000),
  });
  if (!res.ok) return null;
  return (await res.json()) as T;
}
