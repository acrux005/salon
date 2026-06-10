"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SharedListeningSource } from "@/lib/randki/sharedListening";
import { INTERACTION_COPY } from "@/lib/randki/presenceInteractions";

type ListeningSession = {
  startedAt: string;
  syncedSec: number;
  loopSec: number;
};

type Props = {
  source: SharedListeningSource;
  scopeKey?: string;
  compact?: boolean;
  twilight?: boolean;
};

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function RandkiSharedListening({ source, scopeKey, compact = false, twilight = false }: Props) {
  const [listening, setListening] = useState(false);
  const [synced, setSynced] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const isAmbient = source.platform === "ambient";
  const audioSrc = isAmbient && source.embedUrl ? source.embedUrl : null;

  const applySync = useCallback((session: ListeningSession) => {
    const el = audioRef.current;
    if (!el || !isAmbient) return;
    const loop = session.loopSec || 48;
    el.currentTime = session.syncedSec % loop;
    setSynced(true);
  }, [isAmbient]);

  const joinSession = useCallback(async () => {
    if (!scopeKey) return null;
    try {
      const res = await fetch(`${BASE}/api/randki/listening`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scopeKey, source }),
      });
      if (!res.ok) return null;
      const data = (await res.json()) as { session?: ListeningSession };
      if (data.session) applySync(data.session);
      return data.session ?? null;
    } catch {
      return null;
    }
  }, [scopeKey, source, applySync]);

  const pollSync = useCallback(async () => {
    if (!scopeKey || !listening || !isAmbient) return;
    try {
      const res = await fetch(`${BASE}/api/randki/listening?scopeKey=${encodeURIComponent(scopeKey)}`);
      if (!res.ok) return;
      const data = (await res.json()) as { session?: ListeningSession | null };
      if (!data.session || !audioRef.current) return;
      const loop = data.session.loopSec || 48;
      const target = data.session.syncedSec % loop;
      if (Math.abs(audioRef.current.currentTime - target) > 2) {
        audioRef.current.currentTime = target;
      }
      setSynced(true);
    } catch {
      /* ignore */
    }
  }, [scopeKey, listening, isAmbient]);

  useEffect(() => {
    if (!scopeKey || !listening) return;
    const id = setInterval(pollSync, 8000);
    return () => clearInterval(id);
  }, [scopeKey, listening, pollSync]);

  async function toggleListen() {
    if (!listening) {
      if (scopeKey) await joinSession();
      const el = audioRef.current;
      if (el) {
        await el.play().catch(() => {});
        setListening(true);
      }
    } else {
      audioRef.current?.pause();
      setListening(false);
    }
  }

  useEffect(() => {
    if (!twilight || !listening || !synced) return;
    document.documentElement.classList.add("randki-listening-twilight");
    return () => document.documentElement.classList.remove("randki-listening-twilight");
  }, [twilight, listening, synced]);

  return (
    <div className={`randki-shared-listening rounded-xl border border-white/10 bg-black/25 ${listening && synced && twilight ? "randki-shared-listening--twilight" : ""} ${compact ? "p-2.5" : "p-3"}`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-violet-200/75">
            {INTERACTION_COPY.sharedListening}
          </p>
          <p className={`mt-0.5 font-medium text-white/90 ${compact ? "text-[12px]" : "text-[13px]"}`}>
            {isAmbient ? "🎧" : source.platform === "spotify" ? "🎵" : "▶"} {source.title}
          </p>
          {source.caption && <p className="mt-0.5 text-[10px] italic text-white/40">{source.caption}</p>}
          {synced && scopeKey && isAmbient && listening && (
            <p className="mt-0.5 text-[10px] text-violet-300/70">{INTERACTION_COPY.syncedListening}</p>
          )}
        </div>
        {isAmbient && audioSrc && (
          <button
            type="button"
            onClick={toggleListen}
            className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] transition ${
              listening
                ? "border-violet-400/40 bg-violet-500/20 text-violet-100"
                : "border-white/15 text-white/55 hover:border-white/25"
            }`}
          >
            {listening ? "⏸ pauza" : "▶ słuchaj"}
          </button>
        )}
      </div>

      {isAmbient && audioSrc && (
        <audio ref={audioRef} src={audioSrc} loop preload="none" className="hidden" />
      )}

      {source.embedUrl && source.platform === "spotify" && (
        <div className="mt-2 overflow-hidden rounded-lg bg-black/30">
          <iframe
            src={source.embedUrl}
            title={source.title}
            className="h-[80px] w-full"
            loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          />
        </div>
      )}

      {source.embedUrl && source.platform === "youtube" && !compact && (
        <div className="mt-2 overflow-hidden rounded-lg bg-black/30">
          <iframe
            src={source.embedUrl}
            title={source.title}
            className="aspect-video max-h-[120px] w-full"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      )}

      <div className="randki-shared-listening-wave mt-2 flex h-6 items-end gap-[2px] opacity-70">
        {Array.from({ length: compact ? 20 : 28 }).map((_, i) => (
          <span
            key={i}
            className={`randki-voice-presence-bar w-[2px] rounded-full bg-gradient-to-t from-violet-600/40 to-rose-200/60 ${listening || !isAmbient ? "" : "opacity-40"}`}
            style={{ animationDelay: `${(i % 9) * 0.08}s` }}
          />
        ))}
      </div>
    </div>
  );
}
