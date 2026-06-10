"use client";

import { useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import {
  RAFAL_MUZYKA_HERO_VIDEO_ID,
  youtubeEmbedAutoplayUrl,
  youtubeEmbedHeroBackgroundUrl,
} from "@/lib/rafalKowalkowskiMuzyka";

type Props = {
  /** `background` — pełnoekranowe tło hero; `inline` — kafel z ramką (legacy). */
  variant?: "background" | "inline";
};

export function OdartRafalKowalkowskiMuzykaHeroVideo({ variant = "background" }: Props) {
  const [muted, setMuted] = useState(true);
  const videoId = RAFAL_MUZYKA_HERO_VIDEO_ID;
  const src =
    variant === "background"
      ? youtubeEmbedHeroBackgroundUrl(videoId, muted)
      : youtubeEmbedAutoplayUrl(videoId, muted);

  if (variant === "background") {
    return (
      <>
        <div className="absolute inset-0 overflow-hidden" aria-hidden>
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[56.25vw] min-h-full min-w-[177.78vh] w-[177.78vh] -translate-x-1/2 -translate-y-1/2">
            <iframe
              key={muted ? "muted" : "unmuted"}
              src={src}
              title=""
              tabIndex={-1}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={() => setMuted((m) => !m)}
          className="absolute bottom-28 right-4 z-20 flex items-center gap-2 rounded-full border border-white/20 bg-black/60 px-4 py-2 text-xs font-semibold text-white backdrop-blur transition hover:border-odart-accent/60 hover:bg-black/80 sm:bottom-32 sm:right-8 lg:bottom-36"
          aria-pressed={!muted}
        >
          {muted ? <VolumeX className="h-4 w-4" aria-hidden /> : <Volume2 className="h-4 w-4" aria-hidden />}
          {muted ? "Dźwięk" : "Wycisz"}
        </button>
      </>
    );
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl shadow-black/60 sm:rounded-3xl">
      <iframe
        key={muted ? "muted" : "unmuted"}
        src={src}
        title="Rafał Kowalkowski — Pan Kot (teledysk)"
        className="absolute inset-0 h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
      <button
        type="button"
        onClick={() => setMuted((m) => !m)}
        className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full border border-white/20 bg-black/70 px-4 py-2 text-xs font-semibold text-white backdrop-blur transition hover:border-odart-accent/60 hover:bg-black/90"
        aria-pressed={!muted}
      >
        {muted ? <VolumeX className="h-4 w-4" aria-hidden /> : <Volume2 className="h-4 w-4" aria-hidden />}
        {muted ? "Włącz dźwięk" : "Wycisz"}
      </button>
    </div>
  );
}
