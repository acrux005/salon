"use client";

import { useMemo } from "react";
import type { VibeMaterialRow } from "@/lib/randki/vibeMaterialTypes";
import { normalizeVibeMaterialKind } from "@/lib/randki/vibeMaterialSlots";

type Props = {
  vibeMaterials: VibeMaterialRow[];
  voiceIntroUrl?: string | null;
  isPresent?: boolean;
};

export function RandkiRoomLiveStrip({ vibeMaterials, voiceIntroUrl, isPresent = true }: Props) {
  const nowPlaying = useMemo(() => {
    for (const m of vibeMaterials) {
      const kind = normalizeVibeMaterialKind(m.slotType);
      if (kind === "mood") continue;
      if (m.platform === "spotify" || m.platform === "youtube") {
        return m.title?.trim() || m.caption?.trim() || "Coś gra w tle";
      }
    }
    return null;
  }, [vibeMaterials]);

  if (!nowPlaying && !voiceIntroUrl && !isPresent) return null;

  return (
    <div className="randki-room-live-strip" aria-live="polite">
      {isPresent && (
        <span className="randki-room-live-presence">
          <span className="randki-room-live-lamp" aria-hidden />
          Lampka świeci
        </span>
      )}
      {nowPlaying && (
        <span className="randki-room-live-now">
          <span className="randki-room-live-bars" aria-hidden>
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="randki-room-live-bar" style={{ animationDelay: `${i * 0.12}s` }} />
            ))}
          </span>
          Teraz: {nowPlaying}
        </span>
      )}
      {!nowPlaying && voiceIntroUrl && (
        <span className="randki-room-live-voice">
          <span className="randki-room-live-pulse" aria-hidden />
          Głos czeka przy gramofonie
        </span>
      )}
    </div>
  );
}
