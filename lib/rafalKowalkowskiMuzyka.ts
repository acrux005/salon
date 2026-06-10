import { ODART_SITE_URL } from "@/lib/odartSite";
import { youtubeCoverThumbnailUrl, youtubeEmbedUrl, youtubeWatchUrl } from "@/lib/rafalKowalkowskiYoutube";

const SITE = ODART_SITE_URL.replace(/\/$/, "");

export const RAFAL_KOWALKOWSKI_MUZYKA_PATH = "/rafal-kowalkowski/muzyka-autorska";

export const RAFAL_KOWALKOWSKI_MUZYKA_ODART_HREF = `${SITE}${RAFAL_KOWALKOWSKI_MUZYKA_PATH}`;

export const RAFAL_KOWALKOWSKI_MUZYKA_WP_SOURCE =
  "https://rafalkowalkowski.pl/muzyka-autorska-rafal-kowalkowski-kolobrzeg/";

export const RAFAL_KOWALKOWSKI_SPOTIFY_ARTIST_URL =
  "https://open.spotify.com/artist/6K6Oz5t1sDyELfpt3zKmSx";

/** Teledysk w hero (autoodtwarzanie, wyciszony — zgodnie z polityką przeglądarek). */
export const RAFAL_MUZYKA_HERO_VIDEO_ID = "RJ2fJSN5QE0";

export function youtubeEmbedAutoplayUrl(videoId: string, muted = true) {
  const base = youtubeEmbedUrl(videoId);
  const sep = base.includes("?") ? "&" : "?";
  return `${base}${sep}autoplay=1&playsinline=1${muted ? "&mute=1" : ""}`;
}

/** Pełnoekranowe tło hero (loop, bez UI playera). */
export function youtubeEmbedHeroBackgroundUrl(videoId: string, muted = true) {
  const base = youtubeEmbedUrl(videoId);
  return `${base}&autoplay=1&playsinline=1&loop=1&playlist=${videoId}&controls=0&disablekb=1&fs=0&iv_load_policy=3&modestbranding=1${muted ? "&mute=1" : ""}`;
}

export const RAFAL_MUZYKA_TELEDYSKI = [
  {
    id: "pan-kot",
    title: "Pan Kot",
    youtubeId: "RJ2fJSN5QE0",
    image: youtubeCoverThumbnailUrl("RJ2fJSN5QE0"),
  },
  {
    id: "az-do-smierci",
    title: "Aż do śmierci",
    youtubeId: "SI2aq7tmg2g",
    image: youtubeCoverThumbnailUrl("SI2aq7tmg2g"),
  },
  {
    id: "od-h",
    title: "Od H",
    youtubeId: "QXrVdFW3_2M",
    image: youtubeCoverThumbnailUrl("QXrVdFW3_2M"),
  },
] as const;

export const RAFAL_ALBUM_FOTOGRAFIA_TRACKS = [
  "Zła miłość",
  "Przyjdź balkonem",
  "Piosenka z takim dźwiękiem",
  "Pan Kot",
  "Krajobraz",
  "Od H",
  "Fotografia",
  "Góra w niebie",
] as const;

export { youtubeWatchUrl };
