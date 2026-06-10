"use client";

import { useEffect, useState } from "react";
import {
  ephemeralClosingLabel,
  formatEphemeralCountdown,
  msUntilExpiry,
} from "@/lib/randki/ephemeralRooms";
import { ephemeralFadeOpacity } from "@/lib/randki/visualPreview";
import { INTERACTION_COPY } from "@/lib/randki/presenceInteractions";

type Props = {
  expiresAt: string;
  durationLabel?: string;
  compact?: boolean;
  onExpired?: () => void;
};

export function RandkiEphemeralRoomTimer({
  expiresAt,
  durationLabel = "30 min",
  compact = false,
  onExpired,
}: Props) {
  const [ms, setMs] = useState(() => msUntilExpiry(expiresAt));

  useEffect(() => {
    const tick = () => {
      const left = msUntilExpiry(expiresAt);
      setMs(left);
      if (left <= 0) onExpired?.();
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expiresAt, onExpired]);

  const expired = ms <= 0;
  const countdown = formatEphemeralCountdown(ms);
  const fadeOpacity = ephemeralFadeOpacity(ms);

  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] ${
          expired
            ? "border-white/10 text-white/35"
            : ms < 5 * 60 * 1000
              ? "border-amber-400/30 bg-amber-500/10 text-amber-200/90"
              : "border-violet-400/25 bg-violet-950/40 text-violet-200/85"
        }`}
      >
        {expired ? "· zniknął" : `⏳ ${countdown}`}
      </span>
    );
  }

  return (
    <div
      style={{ opacity: fadeOpacity }}
      className={`randki-ephemeral-timer randki-ephemeral-timer--fade rounded-xl border px-3 py-2.5 transition-opacity duration-[2000ms] ${
        expired
          ? "border-white/10 bg-black/20"
          : ms < 5 * 60 * 1000
            ? "border-amber-400/25 bg-amber-950/30"
            : "border-violet-400/20 bg-violet-950/25"
      }`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-violet-200/75">
        Spotkanie chwilowe
      </p>
      <p className={`mt-0.5 font-medium ${compact ? "text-[12px]" : "text-[14px]"} ${expired ? "text-white/40" : "text-white/90"}`}>
        {expired
          ? "Ten pokój już zniknął — dryfuj dalej."
          : ephemeralClosingLabel(ms, durationLabel)}
      </p>
      {!expired && (
        <p className="mt-1 font-mono text-[11px] tabular-nums text-white/45">
          {INTERACTION_COPY.roomEphemeral(Math.max(1, Math.ceil(ms / 60000)))} · {countdown}
        </p>
      )}
    </div>
  );
}
