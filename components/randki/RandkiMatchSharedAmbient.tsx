"use client";

import { useEffect, useRef } from "react";
import type { DayPhase } from "@/lib/randki/dayRhythm";
import { ambientTrackUrl } from "@/lib/randki/ambientTracks";

const MATCH_AMBIENT_VOLUME = 0.09;

type Props = {
  active: boolean;
  phase: DayPhase;
};

/** Wspólny ambient po reveal — jeden pulse, jeden noise layer. */
export function RandkiMatchSharedAmbient({ active, phase }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    if (!active) {
      el.pause();
      return;
    }

    el.src = ambientTrackUrl(phase);
    el.loop = true;
    el.volume = 0;
    const fadeIn = window.setInterval(() => {
      if (!audioRef.current) return;
      const next = Math.min(MATCH_AMBIENT_VOLUME, audioRef.current.volume + 0.012);
      audioRef.current.volume = next;
      if (next >= MATCH_AMBIENT_VOLUME) window.clearInterval(fadeIn);
    }, 80);

    void el.play().catch(() => {
      window.clearInterval(fadeIn);
    });

    return () => {
      window.clearInterval(fadeIn);
      el.pause();
      el.volume = 0;
    };
  }, [active, phase]);

  if (!active) return null;

  return (
    <>
      <audio ref={audioRef} preload="none" className="hidden" aria-hidden />
      <div className="randki-match-shared-pulse pointer-events-none absolute inset-0" aria-hidden>
        <span className="randki-match-pulse-ring" />
        <span className="randki-match-pulse-ring randki-match-pulse-ring--delay" />
      </div>
    </>
  );
}
