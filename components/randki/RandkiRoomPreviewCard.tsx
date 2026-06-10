"use client";

import { useEffect, useState } from "react";
import type { RandkiDiscoveryCard } from "@/lib/randki/matching";
import { RandkiClimateScene } from "@/components/randki/RandkiClimateScene";
import { climateClass, getRoomClimateForCard, getRoomTemperatureForCard } from "@/lib/randki/roomClimate";
import { demoPresenceTraceForRoom } from "@/lib/randki/presenceInteractions";
import { todayStateLabel } from "@/lib/randki/todayState";
import { momentKindLabel, resolveMomentKindFromCard } from "@/lib/randki/momentLabels";
import { isEphemeralRoomId } from "@/lib/randki/roomRotation";
import { pickCardPreviewVisual, ephemeralFadeOpacity } from "@/lib/randki/visualPreview";
import { msUntilExpiry } from "@/lib/randki/ephemeralRooms";
import { RandkiRoomPresenceTrace } from "@/components/randki/RandkiPresenceReactions";
import { RandkiMiniWindow } from "@/components/randki/RandkiMiniWindow";
import { RandkiEphemeralRoomTimer } from "@/components/randki/RandkiEphemeralRoomTimer";

function isEphemeralRoom(card: { accountId: string; rotationNew?: boolean }) {
  return card.rotationNew || isEphemeralRoomId(card.accountId);
}

export function RandkiRoomPreviewCard({
  card,
  selected,
  onSelect,
}: {
  card: RandkiDiscoveryCard;
  selected?: boolean;
  onSelect: () => void;
}) {
  const climate = getRoomClimateForCard(card);
  const temperature = getRoomTemperatureForCard(card);
  const quote = card.prompts[0]?.answer?.slice(0, 64) ?? card.whyReason;
  const name = card.displayName.split(" ")[0];
  const microState = todayStateLabel(card.todayState);
  const presenceTrace = card.presenceTrace ?? demoPresenceTraceForRoom(card.accountId);
  const momentKind = resolveMomentKindFromCard(card);
  const previewVisual = pickCardPreviewVisual(card);
  const [fadeOpacity, setFadeOpacity] = useState(1);

  useEffect(() => {
    if (!card.ephemeralExpiresAt) {
      setFadeOpacity(1);
      return;
    }
    const tick = () => setFadeOpacity(ephemeralFadeOpacity(msUntilExpiry(card.ephemeralExpiresAt!)));
    tick();
    const id = setInterval(tick, 2000);
    return () => clearInterval(id);
  }, [card.ephemeralExpiresAt]);

  return (
    <button
      type="button"
      onClick={onSelect}
      style={card.ephemeralExpiresAt ? { opacity: fadeOpacity } : undefined}
      className={`randki-room-preview-card group relative overflow-hidden rounded-2xl border text-left transition ${climateClass(climate.id)} ${
        selected ? "ring-2 ring-rose-400/60" : "hover:border-white/25"
      } ${card.rotationNew ? "randki-room-preview-card--new" : ""} ${card.rotationClosing ? "randki-room-preview-card--closing" : ""}`}
    >
      <RandkiClimateScene climateId={climate.id} />
      <div className="randki-room-preview-card-vignette absolute inset-0" />
      <RandkiMiniWindow visual={previewVisual} />
      <div className="relative flex min-h-[148px] flex-col justify-between p-3.5 sm:min-h-[156px]">
        <div className="flex flex-wrap items-center gap-1.5 pr-12 sm:pr-14">
          <span className="rounded-full border border-white/15 bg-black/35 px-2 py-0.5 text-[10px] font-medium text-white/85 backdrop-blur-sm">
            {climate.emoji} {climate.label}
          </span>
          {card.rotationNew && (
            <span className="rounded-full border border-emerald-400/30 bg-emerald-500/15 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-emerald-200">
              nowy · {card.ephemeralDurationLabel ?? "chwilowy"}
            </span>
          )}
          {card.rotationClosing && card.ephemeralExpiresAt && (
            <RandkiEphemeralRoomTimer
              expiresAt={card.ephemeralExpiresAt}
              durationLabel={card.ephemeralDurationLabel}
              compact
            />
          )}
          {card.rotationClosing && !card.ephemeralExpiresAt && (
            <span className="rounded-full border border-amber-400/25 bg-amber-500/10 px-2 py-0.5 text-[9px] text-amber-200/90">
              zamyka się
            </span>
          )}
          <span className="randki-room-temperature rounded-full border border-white/10 bg-white/[0.06] px-2 py-0.5 text-[9px] uppercase tracking-wide text-white/50">
            {temperature}
          </span>
          {card.hasFreshMoment && (
            <span className="ml-auto shrink-0 rounded-full border border-amber-400/20 bg-amber-500/10 px-1.5 py-0.5 text-[8px] text-amber-200/80">
              {momentKind === "voice" ? "🎙" : momentKind === "audio" ? "🔊" : "✦"} {momentKindLabel(momentKind)}
            </span>
          )}
          {card.ephemeralExpiresAt && isEphemeralRoom(card) && !card.rotationClosing && (
            <RandkiEphemeralRoomTimer
              expiresAt={card.ephemeralExpiresAt}
              durationLabel={card.ephemeralDurationLabel ?? "30 min"}
              compact
            />
          )}
        </div>
        <div>
          {microState && (
            <p className="mb-1 line-clamp-1 text-[10px] text-amber-200/75">{microState}</p>
          )}
          <p className="line-clamp-2 text-[12px] leading-snug text-white/75">„{quote}”</p>
          <p className="mt-2.5 flex items-baseline justify-between gap-2">
            <span className="text-[13px] font-medium text-white/90">{name}</span>
            <span className="text-[10px] text-white/35">{climate.tagline}</span>
          </p>
          <RandkiRoomPresenceTrace trace={presenceTrace} />
        </div>
      </div>
    </button>
  );
}
