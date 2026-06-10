"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import type { RafalGalleryLightboxItem } from "@/components/odart/OdartRafalKowalkowskiGalleryLightboxGrid";
import { RAFAL_GALLERY_SLIDESHOW_AUDIO_URL } from "@/lib/rafalKowalkowskiGallery";

const SLIDE_MS = 5500;

type Props = {
  items: readonly RafalGalleryLightboxItem[];
  className?: string;
};

export function OdartRafalKowalkowskiGallerySlideshow({ items, className = "" }: Props) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const len = items.length;
  const current = len > 0 ? items[index] : null;

  const go = useCallback(
    (delta: number) => {
      if (len === 0) return;
      setIndex((i) => (i + delta + len) % len);
    },
    [len],
  );

  useEffect(() => {
    if (!playing || len === 0) return;
    const id = window.setInterval(() => go(1), SLIDE_MS);
    return () => window.clearInterval(id);
  }, [playing, len, go]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.muted = muted;
    if (playing) {
      void a.play().catch(() => {});
    } else {
      a.pause();
    }
  }, [playing, muted]);

  const togglePlay = () => setPlaying((p) => !p);

  if (len === 0 || !current) return null;

  return (
    <section
      className={`rounded-2xl border border-white/10 bg-black/40 p-4 shadow-xl shadow-black/40 sm:p-6 ${className}`.trim()}
      aria-label="Slideshow galerii z muzyką"
    >
      <audio ref={audioRef} src={RAFAL_GALLERY_SLIDESHOW_AUDIO_URL} loop preload="none" />

      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-black sm:aspect-[16/10]">
        <Image
          key={current.src}
          src={current.src}
          alt={current.title}
          fill
          className="object-contain transition-opacity duration-500"
          sizes="(max-width: 768px) 100vw, 1152px"
          priority={index === 0}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent px-4 pb-3 pt-12 sm:px-6 sm:pb-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-odart-accent">{current.cat}</p>
          <p className="mt-1 line-clamp-2 text-sm font-medium text-white sm:text-base">{current.title}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => go(-1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition hover:border-odart-accent/50 hover:bg-white/5"
            aria-label="Poprzednie zdjęcie"
          >
            <SkipBack className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={togglePlay}
            className="inline-flex h-11 min-w-[7.5rem] items-center justify-center gap-2 rounded-full bg-odart-accent px-5 text-sm font-semibold text-white shadow-md shadow-orange-950/30 transition hover:brightness-110"
            aria-pressed={playing}
          >
            {playing ? (
              <>
                <Pause className="h-4 w-4 shrink-0" />
                Pauza
              </>
            ) : (
              <>
                <Play className="h-4 w-4 shrink-0" />
                Start z muzyką
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition hover:border-odart-accent/50 hover:bg-white/5"
            aria-label="Następne zdjęcie"
          >
            <SkipForward className="h-4 w-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => setMuted((m) => !m)}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-medium text-neutral-300 transition hover:border-white/25 hover:text-white"
          aria-pressed={muted}
        >
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          {muted ? "Włącz dźwięk" : "Wycisz"}
        </button>
      </div>

      <p className="mt-3 text-center text-xs text-neutral-600">
        Slajd co {Math.round(SLIDE_MS / 1000)} s · muzyka w pętli
      </p>
    </section>
  );
}
