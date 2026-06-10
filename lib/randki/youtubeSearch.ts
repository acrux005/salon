export type YoutubeSearchHit = {
  id: string;
  title: string;
  channelTitle: string | null;
  url: string;
  embedUrl: string;
  thumbnailUrl: string | null;
};

const cache = new Map<string, { at: number; items: YoutubeSearchHit[] }>();
const CACHE_TTL_MS = 15 * 60 * 1000;

function cacheGet(key: string): YoutubeSearchHit[] | null {
  const hit = cache.get(key);
  if (!hit || Date.now() - hit.at > CACHE_TTL_MS) return null;
  return hit.items;
}

function cacheSet(key: string, items: YoutubeSearchHit[]): void {
  cache.set(key, { at: Date.now(), items });
  if (cache.size > 200) {
    const oldest = Array.from(cache.entries()).sort((a, b) => a[1].at - b[1].at)[0]?.[0];
    if (oldest) cache.delete(oldest);
  }
}

/** Wyszukuje wideo na YouTube (cache 15 min). */
export async function searchYoutubeVideos(query: string, limit = 10): Promise<YoutubeSearchHit[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  const apiKey = process.env.YOUTUBE_API_KEY?.trim();
  if (!apiKey) return [];

  const key = q.toLowerCase();
  const cached = cacheGet(key);
  if (cached) return cached;

  const url = new URL("https://www.googleapis.com/youtube/v3/search");
  url.searchParams.set("part", "snippet");
  url.searchParams.set("q", q);
  url.searchParams.set("type", "video");
  url.searchParams.set("maxResults", String(limit));
  url.searchParams.set("safeSearch", "moderate");
  url.searchParams.set("key", apiKey);

  const res = await fetch(url, { signal: AbortSignal.timeout(12_000) });
  if (!res.ok) return [];

  const data = (await res.json()) as {
    items?: Array<{
      id?: { videoId?: string };
      snippet?: {
        title?: string;
        channelTitle?: string;
        thumbnails?: { medium?: { url?: string }; high?: { url?: string } };
      };
    }>;
  };

  const items = (data.items ?? [])
    .filter((item) => item.id?.videoId)
    .map((item) => {
      const videoId = item.id!.videoId!;
      return {
        id: videoId,
        title: item.snippet?.title ?? "YouTube",
        channelTitle: item.snippet?.channelTitle ?? null,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        embedUrl: `https://www.youtube.com/embed/${videoId}`,
        thumbnailUrl:
          item.snippet?.thumbnails?.high?.url ??
          item.snippet?.thumbnails?.medium?.url ??
          `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      };
    });

  cacheSet(key, items);
  return items;
}
