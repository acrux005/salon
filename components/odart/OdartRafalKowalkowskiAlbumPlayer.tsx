"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play, SkipBack, SkipForward, Volume2 } from "lucide-react";
import {
  RAFAL_ALBUM_FOTOGRAFIA,
  RAFAL_ALBUM_FOTOGRAFIA_COVER,
  RAFAL_ALBUM_PLAYABLE,
  type RafalAlbumTrack,
} from "@/lib/rafalKowalkowskiAlbumFotografia";

function formatTime(sec: number) {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function OdartRafalKowalkowskiAlbumPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentId, setCurrentId] = useState(RAFAL_ALBUM_PLAYABLE[0]?.id ?? "");
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const current = useMemo(
    () => RAFAL_ALBUM_PLAYABLE.find((t) => t.id === currentId) ?? RAFAL_ALBUM_PLAYABLE[0],
    [currentId],
  );

  const playableIndex = useMemo(
    () => RAFAL_ALBUM_PLAYABLE.findIndex((t) => t.id === current?.id),
    [current?.id],
  );

  const playTrack = useCallback((track: RafalAlbumTrack & { mp3: string }) => {
    setCurrentId(track.id);
    setPlaying(true);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !current?.mp3) return;
    if (audio.src !== current.mp3) {
      audio.src = current.mp3;
      audio.load();
    }
    if (playing) {
      void audio.play().catch(() => setPlaying(false));
    } else {
      audio.pause();
    }
  }, [current?.mp3, current?.id, playing]);

  const togglePlay = () => {
    if (!current?.mp3) return;
    setPlaying((p) => !p);
  };

  const skip = (delta: number) => {
    const next = RAFAL_ALBUM_PLAYABLE[playableIndex + delta];
    if (next) playTrack(next);
  };

  const onSeek = (value: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = value;
    setCurrentTime(value);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-black/40">
      <audio
        ref={audioRef}
        preload="metadata"
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => skip(1)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      <div className="flex flex-col gap-8 p-6 sm:flex-row sm:p-8">
        <div className="flex shrink-0 flex-col items-center sm:w-44">
          <div className="relative h-40 w-40 overflow-hidden rounded-xl border border-white/10 shadow-2xl shadow-black/60 sm:h-44 sm:w-44">
            <Image src={RAFAL_ALBUM_FOTOGRAFIA_COVER} alt="Okładka albumu Fotografia" fill className="object-cover" sizes="176px" />
          </div>
          <p className="mt-4 text-center text-xs font-semibold uppercase tracking-[0.28em] text-odart-accent">Album</p>
          <p className="mt-1 text-center text-lg font-semibold text-white">Fotografia</p>
          <p className="mt-1 text-center text-xs text-neutral-500">Rafał Kowalkowski · 2020</p>
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm text-neutral-500">Teraz odtwarzane</p>
          <p className="mt-1 truncate text-xl font-semibold text-white">{current?.title ?? "—"}</p>

          <div className="mt-6">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={(e) => onSeek(Number(e.target.value))}
              className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-odart-accent"
              aria-label="Postęp utworu"
            />
            <div className="mt-2 flex justify-between text-xs tabular-nums text-neutral-500">
              <span>{formatTime(currentTime)}</span>
              <span>{duration > 0 ? formatTime(duration) : current?.duration ?? "—"}</span>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-4 sm:justify-start">
            <button
              type="button"
              onClick={() => skip(-1)}
              disabled={playableIndex <= 0}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition hover:border-white/40 disabled:opacity-30"
              aria-label="Poprzedni utwór"
            >
              <SkipBack className="h-5 w-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={togglePlay}
              disabled={!current?.mp3}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-odart-accent text-white shadow-lg shadow-orange-950/40 transition hover:brightness-110 disabled:opacity-40"
              aria-label={playing ? "Pauza" : "Odtwórz"}
            >
              {playing ? <Pause className="h-6 w-6" aria-hidden /> : <Play className="ml-0.5 h-6 w-6 fill-current" aria-hidden />}
            </button>
            <button
              type="button"
              onClick={() => skip(1)}
              disabled={playableIndex >= RAFAL_ALBUM_PLAYABLE.length - 1}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition hover:border-white/40 disabled:opacity-30"
              aria-label="Następny utwór"
            >
              <SkipForward className="h-5 w-5" aria-hidden />
            </button>
            <Volume2 className="ml-2 hidden h-5 w-5 text-neutral-600 sm:block" aria-hidden />
          </div>
        </div>
      </div>

      <ol className="divide-y divide-white/[0.06] border-t border-white/10">
        {RAFAL_ALBUM_FOTOGRAFIA.map((track, index) => {
          const isActive = track.id === currentId;
          const canPlay = Boolean(track.mp3);
          return (
            <li key={track.id}>
              <button
                type="button"
                disabled={!canPlay}
                onClick={() => track.mp3 && playTrack(track as RafalAlbumTrack & { mp3: string })}
                className={`flex w-full items-center gap-4 px-5 py-3.5 text-left transition sm:px-8 ${
                  canPlay ? "hover:bg-white/[0.04]" : "cursor-not-allowed opacity-45"
                } ${isActive ? "bg-odart-accent/10" : ""}`}
              >
                <span className="w-6 shrink-0 text-center text-sm tabular-nums text-neutral-600">{index + 1}</span>
                <span className={`min-w-0 flex-1 truncate text-sm ${isActive ? "font-semibold text-white" : "text-neutral-300"}`}>
                  {track.title}
                </span>
                {canPlay ? (
                  <span className="shrink-0 text-xs text-neutral-500">{isActive && playing ? "▶" : track.duration ?? ""}</span>
                ) : (
                  <span className="shrink-0 text-[10px] uppercase tracking-wider text-neutral-600">brak pliku</span>
                )}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
