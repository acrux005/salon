import path from "path";
import { config as loadEnv } from "dotenv";

export type SpotifySearchType = "track" | "album" | "playlist" | "artist";

export type SpotifySearchHit = {
  id: string;
  type: SpotifySearchType;
  title: string;
  artistName: string | null;
  url: string;
  embedUrl: string;
  thumbnailUrl: string | null;
};

let spotifyToken: { value: string; expiresAt: number } | null = null;

function ensureSpotifyEnv(): void {
  if (process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET) return;
  for (const root of [process.cwd(), path.join(process.cwd(), "..")]) {
    loadEnv({ path: path.join(root, ".env") });
    loadEnv({ path: path.join(root, ".env.production.local"), override: true });
    loadEnv({ path: path.join(root, ".env.local"), override: true });
  }
}

export async function getSpotifyAccessToken(): Promise<string | null> {
  ensureSpotifyEnv();
  const clientId = process.env.SPOTIFY_CLIENT_ID?.trim();
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) return null;

  if (spotifyToken && spotifyToken.expiresAt > Date.now() + 60_000) return spotifyToken.value;

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "client_credentials" }),
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

function mapTrack(item: {
  id: string;
  name: string;
  external_urls?: { spotify?: string };
  album?: { images?: Array<{ url: string }> };
  artists?: Array<{ name: string }>;
}): SpotifySearchHit {
  return {
    id: item.id,
    type: "track",
    title: item.name,
    artistName: item.artists?.map((a) => a.name).join(", ") ?? null,
    url: item.external_urls?.spotify ?? `https://open.spotify.com/track/${item.id}`,
    embedUrl: `https://open.spotify.com/embed/track/${item.id}?utm_source=randka`,
    thumbnailUrl: item.album?.images?.[0]?.url ?? null,
  };
}

function mapAlbum(item: {
  id: string;
  name: string;
  external_urls?: { spotify?: string };
  images?: Array<{ url: string }>;
  artists?: Array<{ name: string }>;
}): SpotifySearchHit {
  return {
    id: item.id,
    type: "album",
    title: item.name,
    artistName: item.artists?.map((a) => a.name).join(", ") ?? null,
    url: item.external_urls?.spotify ?? `https://open.spotify.com/album/${item.id}`,
    embedUrl: `https://open.spotify.com/embed/album/${item.id}?utm_source=randka`,
    thumbnailUrl: item.images?.[0]?.url ?? null,
  };
}

function mapPlaylist(item: {
  id: string;
  name: string;
  external_urls?: { spotify?: string };
  images?: Array<{ url: string }>;
  owner?: { display_name?: string };
}): SpotifySearchHit {
  return {
    id: item.id,
    type: "playlist",
    title: item.name,
    artistName: item.owner?.display_name ?? null,
    url: item.external_urls?.spotify ?? `https://open.spotify.com/playlist/${item.id}`,
    embedUrl: `https://open.spotify.com/embed/playlist/${item.id}?utm_source=randka`,
    thumbnailUrl: item.images?.[0]?.url ?? null,
  };
}

function mapArtist(item: {
  id: string;
  name: string;
  external_urls?: { spotify?: string };
  images?: Array<{ url: string }>;
}): SpotifySearchHit {
  return {
    id: item.id,
    type: "artist",
    title: item.name,
    artistName: null,
    url: item.external_urls?.spotify ?? `https://open.spotify.com/artist/${item.id}`,
    embedUrl: `https://open.spotify.com/embed/artist/${item.id}?utm_source=randka`,
    thumbnailUrl: item.images?.[0]?.url ?? null,
  };
}

/** Wyszukuje w całym katalogu Spotify (bez logowania użytkownika). */
export async function searchSpotifyCatalog(
  query: string,
  searchType: SpotifySearchType = "track",
  limit = 10
): Promise<SpotifySearchHit[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  const token = await getSpotifyAccessToken();
  if (!token) return [];

  if (searchType === "artist") {
    const url = new URL("https://api.spotify.com/v1/search");
    url.searchParams.set("q", q);
    url.searchParams.set("type", "artist");
    url.searchParams.set("limit", String(limit));
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(12_000),
    });
    if (!res.ok) return [];
    const data = (await res.json()) as {
      artists?: { items?: Parameters<typeof mapArtist>[0][] };
    };
    return (data.artists?.items ?? []).filter((a) => a.id).map(mapArtist);
  }

  const spotifyType = searchType === "track" ? "track" : searchType;
  const url = new URL("https://api.spotify.com/v1/search");
  url.searchParams.set("q", q);
  url.searchParams.set("type", spotifyType);
  url.searchParams.set("limit", String(limit));

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(12_000),
  });
  if (!res.ok) return [];

  const data = (await res.json()) as {
    tracks?: { items?: Parameters<typeof mapTrack>[0][] };
    albums?: { items?: Parameters<typeof mapAlbum>[0][] };
    playlists?: { items?: Parameters<typeof mapPlaylist>[0][] };
  };

  if (searchType === "album") return (data.albums?.items ?? []).filter((a) => a.id).map(mapAlbum);
  if (searchType === "playlist") return (data.playlists?.items ?? []).filter((p) => p.id).map(mapPlaylist);
  return (data.tracks?.items ?? []).filter((t) => t.id).map(mapTrack);
}
