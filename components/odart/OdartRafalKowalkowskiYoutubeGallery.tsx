"use client";

import { useCallback, useEffect, useState } from "react";
import { Play, X } from "lucide-react";
import {
  RAFAL_KOWALKOWSKI_YOUTUBE_CHANNEL_URL,
  RAFAL_KOWALKOWSKI_YOUTUBE_VIDEOS,
  youtubeEmbedUrl,
  youtubeThumbnailUrl,
  youtubeWatchUrl,
  type RafalKowalkowskiYoutubeVideo,
} from "@/lib/rafalKowalkowskiYoutube";

type Props = {
  videos?: readonly RafalKowalkowskiYoutubeVideo[];
  className?: string;
};

export function OdartRafalKowalkowskiYoutubeGallery({
  videos = RAFAL_KOWALKOWSKI_YOUTUBE_VIDEOS,
  className = "",
}: Props) {
  const [active, setActive] = useState<RafalKowalkowskiYoutubeVideo | null>(null);

  const close = useCallback(() => setActive(null), []);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [active, close]);

  return (
    <>
      <ul className={`grid gap-5 sm:grid-cols-2 lg:grid-cols-3 ${className}`.trim()}>
        {videos.map((v) => (
          <li key={v.id}>
            <button
              type="button"
              onClick={() => setActive(v)}
              className="group relative block w-full overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 text-left shadow-lg shadow-black/40 transition hover:border-odart-accent/50"
            >
              <span className="relative block aspect-video w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={youtubeThumbnailUrl(v.id)}
                  alt=""
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03] group-hover:opacity-90"
                  loading="lazy"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-black/50 text-white backdrop-blur transition group-hover:scale-105 group-hover:border-odart-accent group-hover:bg-odart-accent/90">
                    <Play className="ml-1 h-6 w-6 fill-current" aria-hidden />
                  </span>
                </span>
              </span>
              <span className="block px-4 py-3">
                <span className="line-clamp-2 text-sm font-medium text-white group-hover:text-odart-accent">{v.title}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <p className="mt-8 text-center text-sm text-neutral-500">
        Więcej na kanale{" "}
        <a
          href={RAFAL_KOWALKOWSKI_YOUTUBE_CHANNEL_URL}
          className="font-medium text-odart-accent underline decoration-odart-accent/40 underline-offset-2 hover:decoration-odart-accent"
          rel="noopener noreferrer"
          target="_blank"
        >
          YouTube — Rafał Kowalkowski
        </a>
      </p>

      {active ? <VideoLightbox video={active} onClose={close} /> : null}
    </>
  );
}

function VideoLightbox({ video, onClose }: { video: RafalKowalkowskiYoutubeVideo; onClose: () => void }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={video.title}
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm sm:p-8"
      onClick={onClose}
    >
      <div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()} role="presentation">
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-12 right-0 flex items-center gap-2 text-sm font-medium text-neutral-400 transition hover:text-white sm:-right-2 sm:top-2 sm:rounded-full sm:border sm:border-white/15 sm:bg-black/80 sm:px-3 sm:py-2"
          aria-label="Zamknij odtwarzacz"
        >
          <X className="h-5 w-5" />
          <span className="hidden sm:inline">Zamknij</span>
        </button>
        <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-black shadow-2xl">
          <iframe
            src={youtubeEmbedUrl(video.id)}
            title={video.title}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <p className="mt-4 text-center text-sm text-neutral-400">
          {video.title}
          {" · "}
          <a
            href={youtubeWatchUrl(video.id)}
            className="text-odart-accent hover:underline"
            rel="noopener noreferrer"
            target="_blank"
          >
            Otwórz na YouTube
          </a>
        </p>
      </div>
    </div>
  );
}
