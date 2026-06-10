import path from "path";
import { config as loadEnv } from "dotenv";
import { getPrisma } from "@/lib/db";
import type { VibeCatalogMood, VibeCatalogPlatform } from "@/lib/randki/vibeCatalogTypes";
import {
  VIBE_CATALOG_LIMITS,
  VIBE_CATALOG_QUERIES,
  type CatalogSeedItem,
} from "@/lib/randki/vibeCatalogConfig";
import { seedVibeCatalogIfEmpty } from "@/lib/randki/vibeCatalog";
import { getTmdbAuthHeaders, tmdbFetch, tmdbMovieUrl, tmdbPosterUrl } from "@/lib/randki/tmdb";

function ensureCatalogEnv(): void {
  const roots = [process.cwd(), path.join(process.cwd(), "..")];
  for (const root of roots) {
    loadEnv({ path: path.join(root, ".env") });
    loadEnv({ path: path.join(root, ".env.production.local"), override: true });
    loadEnv({ path: path.join(root, ".env.local"), override: true });
  }
}

export type VibeCatalogRefreshResult = {
  ok: true;
  spotify: number;
  youtube: number;
  tmdb: number;
  deactivated: number;
  seeded: number;
  errors: string[];
};

type CatalogUpsertItem = CatalogSeedItem;

let spotifyToken: { value: string; expiresAt: number } | null = null;

async function getSpotifyToken(): Promise<string | null> {
  const clientId = process.env.SPOTIFY_CLIENT_ID?.trim();
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) return null;

  if (spotifyToken && spotifyToken.expiresAt > Date.now() + 60_000) return spotifyToken.value;

  const body = new URLSearchParams({ grant_type: "client_credentials" });
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { access_token?: string; expires_in?: number };
  if (!data.access_token) return null;
  spotifyToken = {
    value: data.access_token,
    expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000,
  };
  return spotifyToken.value;
}

async function fetchSpotifyTracks(mood: VibeCatalogMood, query: string): Promise<CatalogUpsertItem[]> {
  const token = await getSpotifyToken();
  if (!token) return [];

  const url = new URL("https://api.spotify.com/v1/search");
  url.searchParams.set("q", query);
  url.searchParams.set("type", "track");
  url.searchParams.set("limit", String(VIBE_CATALOG_LIMITS.spotifyPerMood));

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(12_000),
  });
  if (!res.ok) return [];

  const data = (await res.json()) as {
    tracks?: {
      items?: Array<{
        id: string;
        name: string;
        external_urls?: { spotify?: string };
        album?: { images?: Array<{ url: string }> };
        artists?: Array<{ name: string }>;
      }>;
    };
  };

  return (data.tracks?.items ?? [])
    .filter((t) => t.id && t.external_urls?.spotify)
    .map((t) => ({
      mood,
      platform: "spotify" as const,
      externalId: t.id,
      url: t.external_urls!.spotify!,
      title: t.name,
      embedUrl: `https://open.spotify.com/embed/track/${t.id}?utm_source=randka`,
      thumbnailUrl: t.album?.images?.[0]?.url ?? null,
      artistName: t.artists?.map((a) => a.name).join(", ") ?? null,
    }));
}

async function fetchYoutubeVideos(mood: VibeCatalogMood, query: string): Promise<CatalogUpsertItem[]> {
  const apiKey = process.env.YOUTUBE_API_KEY?.trim();
  if (!apiKey) return [];

  const url = new URL("https://www.googleapis.com/youtube/v3/search");
  url.searchParams.set("part", "snippet");
  url.searchParams.set("q", query);
  url.searchParams.set("type", "video");
  url.searchParams.set("videoCategoryId", "10");
  url.searchParams.set("maxResults", String(VIBE_CATALOG_LIMITS.youtubePerMood));
  url.searchParams.set("safeSearch", "moderate");
  url.searchParams.set("key", apiKey);

  const res = await fetch(url, { signal: AbortSignal.timeout(12_000) });
  if (!res.ok) {
    const err = (await res.json().catch(() => null)) as { error?: { message?: string } } | null;
    throw new Error(err?.error?.message ?? `HTTP ${res.status}`);
  }

  const data = (await res.json()) as {
    items?: Array<{
      id?: { videoId?: string };
      snippet?: { title?: string; channelTitle?: string; thumbnails?: { medium?: { url?: string }; high?: { url?: string } } };
    }>;
  };

  return (data.items ?? [])
    .filter((item) => item.id?.videoId)
    .map((item) => {
      const videoId = item.id!.videoId!;
      return {
        mood,
        platform: "youtube" as const,
        externalId: videoId,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        title: item.snippet?.title ?? "YouTube",
        embedUrl: `https://www.youtube.com/embed/${videoId}`,
        thumbnailUrl:
          item.snippet?.thumbnails?.high?.url ??
          item.snippet?.thumbnails?.medium?.url ??
          `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
        artistName: item.snippet?.channelTitle ?? null,
      };
    });
}

async function fetchTmdbMovies(mood: VibeCatalogMood, genreIds: string): Promise<CatalogUpsertItem[]> {
  if (!getTmdbAuthHeaders()) return [];

  const data = await tmdbFetch<{
    results?: Array<{
      id: number;
      title?: string;
      release_date?: string;
      poster_path?: string | null;
    }>;
  }>("/discover/movie", {
    with_genres: genreIds,
    sort_by: "popularity.desc",
    include_adult: "false",
    language: "pl-PL",
    "vote_count.gte": "200",
    page: "1",
  });

  return (data?.results ?? [])
    .filter((m) => m.id && m.title)
    .slice(0, VIBE_CATALOG_LIMITS.tmdbPerMood)
    .map((m) => {
      const year = m.release_date?.slice(0, 4);
      return {
        mood,
        platform: "tmdb" as const,
        externalId: String(m.id),
        url: tmdbMovieUrl(m.id),
        title: m.title!,
        embedUrl: null,
        thumbnailUrl: tmdbPosterUrl(m.poster_path),
        artistName: year ? `${year}` : null,
      };
    });
}

async function upsertCatalogBatch(items: CatalogUpsertItem[]): Promise<number> {
  const prisma = getPrisma();
  let count = 0;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    await prisma.datingVibeCatalog.upsert({
      where: { platform_externalId: { platform: item.platform, externalId: item.externalId } },
      create: {
        mood: item.mood,
        platform: item.platform,
        externalId: item.externalId,
        url: item.url,
        title: item.title,
        embedUrl: item.embedUrl,
        thumbnailUrl: item.thumbnailUrl,
        artistName: item.artistName,
        sortOrder: i,
        active: true,
        source: "auto",
        fetchedAt: new Date(),
      },
      update: {
        mood: item.mood,
        url: item.url,
        title: item.title,
        embedUrl: item.embedUrl,
        thumbnailUrl: item.thumbnailUrl,
        artistName: item.artistName,
        sortOrder: i,
        active: true,
        source: "auto",
        fetchedAt: new Date(),
      },
    });
    count++;
  }
  return count;
}

async function deactivateStale(mood: VibeCatalogMood, platform: VibeCatalogPlatform, keepIds: string[]): Promise<number> {
  const prisma = getPrisma();
  const stale = await prisma.datingVibeCatalog.findMany({
    where: {
      mood,
      platform,
      source: "auto",
      active: true,
      externalId: keepIds.length > 0 ? { notIn: keepIds } : undefined,
    },
  });
  if (keepIds.length === 0 && stale.length === 0) return 0;
  const result = await prisma.datingVibeCatalog.updateMany({
    where: {
      mood,
      platform,
      source: "auto",
      ...(keepIds.length > 0 ? { externalId: { notIn: keepIds } } : {}),
    },
    data: { active: false },
  });
  return result.count;
}

export async function refreshVibeCatalog(): Promise<VibeCatalogRefreshResult> {
  ensureCatalogEnv();
  const errors: string[] = [];
  let spotifyCount = 0;
  let youtubeCount = 0;
  let tmdbCount = 0;
  let deactivated = 0;

  const hasSpotify = !!(process.env.SPOTIFY_CLIENT_ID?.trim() && process.env.SPOTIFY_CLIENT_SECRET?.trim());
  const hasYoutube = !!process.env.YOUTUBE_API_KEY?.trim();
  const hasTmdb = !!(process.env.TMDB_READ_ACCESS_TOKEN?.trim() || process.env.TMDB_API_KEY?.trim());

  if (!hasSpotify && !hasYoutube && !hasTmdb) {
    const seeded = await seedVibeCatalogIfEmpty();
    return { ok: true, spotify: 0, youtube: 0, tmdb: 0, deactivated: 0, seeded, errors: ["Brak SPOTIFY_* / YOUTUBE_API_KEY / TMDB_* — użyto seeda."] };
  }

  await seedVibeCatalogIfEmpty();

  for (const cfg of VIBE_CATALOG_QUERIES) {
    if (hasSpotify) {
      try {
        const tracks = await fetchSpotifyTracks(cfg.mood, cfg.spotifyQuery);
        spotifyCount += await upsertCatalogBatch(tracks);
        deactivated += await deactivateStale(cfg.mood, "spotify", tracks.map((t) => t.externalId));
      } catch (e) {
        errors.push(`Spotify ${cfg.mood}: ${e instanceof Error ? e.message : "błąd"}`);
      }
    }

    if (hasYoutube) {
      try {
        const videos = await fetchYoutubeVideos(cfg.mood, cfg.youtubeQuery);
        youtubeCount += await upsertCatalogBatch(videos);
        deactivated += await deactivateStale(cfg.mood, "youtube", videos.map((v) => v.externalId));
      } catch (e) {
        errors.push(`YouTube ${cfg.mood}: ${e instanceof Error ? e.message : "błąd"}`);
      }
    }

    if (hasTmdb) {
      try {
        const movies = await fetchTmdbMovies(cfg.mood, cfg.tmdbGenres);
        tmdbCount += await upsertCatalogBatch(movies);
        deactivated += await deactivateStale(cfg.mood, "tmdb", movies.map((m) => m.externalId));
      } catch (e) {
        errors.push(`TMDB ${cfg.mood}: ${e instanceof Error ? e.message : "błąd"}`);
      }
    }
  }

  return { ok: true, spotify: spotifyCount, youtube: youtubeCount, tmdb: tmdbCount, deactivated, seeded: 0, errors };
}
