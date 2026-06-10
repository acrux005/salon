/** Kanał YouTube Rafała Kowalkowski (ACRUX). */
export const RAFAL_KOWALKOWSKI_YOUTUBE_CHANNEL_URL = "https://www.youtube.com/channel/UCOp3fAgkkXzEOY3PgBk29jA";

export const RAFAL_KOWALKOWSKI_YOUTUBE_CHANNEL_HANDLE = "https://www.youtube.com/@acrux_rk";

/** Wybrane realizacje — teledyski i covere na stronie /teledyski. */
export const RAFAL_KOWALKOWSKI_YOUTUBE_VIDEOS = [
  { id: "N4V3dOTg0HA", title: "Urszula — Dmuchawce, latawce, wiatr (Hanna Osadca)" },
  { id: "qfN82U_MzZ4", title: "Mary Mary — Shackles (Dreaming Kids, Rewal)" },
  { id: "PlUgJOYHC4o", title: "TGD — Gloria (cover, OPP Kołobrzeg)" },
  { id: "wDyO2O7QtY8", title: "Góra w niebie — Tomek Mackiewicz (Rafał Acrux Kowalkowski)" },
  { id: "RJ2fJSN5QE0", title: "Pan Kot — Rafał Acrux Kowalkowski" },
  { id: "9O_SQEUBa9g", title: "Sanah — 02:00 (cover, Lena Oczniew)" },
] as const;

export type RafalKowalkowskiYoutubeVideo = (typeof RAFAL_KOWALKOWSKI_YOUTUBE_VIDEOS)[number];

export function youtubeThumbnailUrl(videoId: string) {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

/** Okładka karty teledysku (hqdefault — dostępne dla każdego filmu; sddefault bywa 404). */
export function youtubeCoverThumbnailUrl(videoId: string) {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

export function youtubeWatchUrl(videoId: string) {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

export function youtubeEmbedUrl(videoId: string) {
  return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`;
}
