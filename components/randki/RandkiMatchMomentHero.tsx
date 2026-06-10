"use client";

import { useState, type CSSProperties } from "react";
import { resolveRandkiMediaUrl } from "@/lib/randki/visualPreview";
import { momentKindLabel } from "@/lib/randki/momentLabels";
import { climateClass } from "@/lib/randki/roomClimate";
import type { RoomClimateId } from "@/lib/randki/roomClimate";
import { matchBlendBackground, matchBlendCssVars } from "@/lib/randki/climateBlend";
import { useRandkiDayPhase } from "@/lib/randki/useRandkiDayPhase";
import { RandkiMatchSharedAmbient } from "@/components/randki/RandkiMatchSharedAmbient";

export type MatchMomentPane = {
  name: string;
  climateId: RoomClimateId;
  momentUrl?: string | null;
  momentAudioUrl?: string | null;
  momentType?: "photo" | "audio" | "voice" | null;
  auraUrl?: string | null;
};

type Props = {
  mine: MatchMomentPane;
  other: MatchMomentPane;
  onRevealed?: () => void;
};

function AuraGhost({ url, side }: { url: string | null; side: "left" | "right" }) {
  if (!url) return null;
  return (
    <img
      src={url}
      alt=""
      className={`randki-match-aura-ghost randki-match-aura-ghost--${side} h-24 w-16 object-cover object-top opacity-50 mix-blend-screen`}
    />
  );
}

function PaneMoment({ pane, side }: { pane: MatchMomentPane; side: "left" | "right" }) {
  const firstName = pane.name.split(" ")[0];
  const kind = pane.momentType ?? (pane.momentAudioUrl ? "voice" : "photo");
  const label = momentKindLabel(kind);
  const isAudio = kind === "audio" || kind === "voice";
  const mainUrl =
    pane.momentUrl && !pane.momentUrl.includes("moment-audio.svg")
      ? resolveRandkiMediaUrl(pane.momentUrl)
      : null;
  const audioUrl = pane.momentAudioUrl ? resolveRandkiMediaUrl(pane.momentAudioUrl) : null;
  const aura = pane.auraUrl ? resolveRandkiMediaUrl(pane.auraUrl) : null;
  const hasMoment = !!(mainUrl || audioUrl);

  if (!hasMoment) {
    return (
      <div
        className={`randki-match-moment-pane randki-match-moment-pane--${side} flex min-h-[140px] flex-col justify-end rounded-xl border border-white/10 p-4 ${climateClass(pane.climateId)}`}
      >
        {aura && (
          <img src={aura} alt="" className="mb-3 h-20 w-14 object-cover object-top opacity-70 mix-blend-screen" />
        )}
        <p className="text-[10px] uppercase tracking-[0.14em] text-white/40">{firstName}</p>
        <p className="mt-1 text-[12px] italic text-white/50">Bez momentu dziś — sama obecność</p>
      </div>
    );
  }

  return (
    <div
      className={`randki-match-moment-pane randki-match-moment-pane--${side} relative overflow-hidden rounded-xl border border-white/10 ${climateClass(pane.climateId)}`}
    >
      {isAudio && audioUrl ? (
        <div className="px-4 py-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-200/80">
            {firstName} · {label}
          </p>
          {kind === "voice" && (
            <div className="randki-voice-presence-wave mt-2 flex h-8 items-end gap-[2px]">
              {Array.from({ length: 20 }).map((_, i) => (
                <span
                  key={i}
                  className="randki-voice-presence-bar w-[2px] rounded-full bg-gradient-to-t from-rose-600/40 to-rose-100/60"
                  style={{ animationDelay: `${(i % 7) * 0.07}s` }}
                />
              ))}
            </div>
          )}
          <audio controls preload="none" src={audioUrl} className="mt-3 w-full" />
        </div>
      ) : mainUrl ? (
        <div className="relative aspect-[4/5] max-h-[200px] w-full">
          <img src={mainUrl} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
          {aura && (
            <img
              src={aura}
              alt=""
              className="absolute -bottom-2 left-3 h-16 w-12 rotate-[-3deg] rounded-md border border-violet-300/25 object-cover object-top opacity-85 mix-blend-screen"
            />
          )}
          <p className="absolute bottom-2 right-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-100/90">
            {firstName} · {label}
          </p>
        </div>
      ) : null}
    </div>
  );
}

export function RandkiMatchMomentHero({ mine, other, onRevealed }: Props) {
  const [revealed, setRevealed] = useState(false);
  const dayPhase = useRandkiDayPhase();
  const hasAnyMoment =
    !!(mine.momentUrl || mine.momentAudioUrl || other.momentUrl || other.momentAudioUrl);

  const mineAura = mine.auraUrl ? resolveRandkiMediaUrl(mine.auraUrl) : null;
  const otherAura = other.auraUrl ? resolveRandkiMediaUrl(other.auraUrl) : null;
  const blendStyle = {
    ...matchBlendCssVars(mine.climateId, other.climateId),
    background: matchBlendBackground(mine.climateId, other.climateId),
  } as CSSProperties;

  function reveal() {
    setRevealed(true);
    onRevealed?.();
  }

  if (!hasAnyMoment) return null;

  return (
    <section
      className={`randki-match-moment-hero relative mb-5 overflow-hidden rounded-2xl border border-amber-300/20 bg-black/25 ${
        revealed ? "randki-match-moment-hero--synced" : ""
      }`}
      style={revealed ? blendStyle : undefined}
    >
      <RandkiMatchSharedAmbient active={revealed} phase={dayPhase.id} />

      {!revealed ? (
        <button
          type="button"
          onClick={reveal}
          className="relative flex w-full flex-col items-center px-6 py-8 text-center transition hover:bg-white/[0.03]"
        >
          <div className="randki-match-blend-preview pointer-events-none relative mb-4 flex h-28 w-full max-w-xs items-center justify-center">
            <div
              className="absolute inset-0 rounded-2xl opacity-70"
              style={{ background: matchBlendBackground(mine.climateId, other.climateId) }}
            />
            <AuraGhost url={mineAura} side="left" />
            <div className="randki-match-blend-core z-[1] h-14 w-14 rounded-full border border-amber-200/25 bg-amber-100/10 shadow-[0_0_40px_rgba(251,191,36,0.15)]" />
            <AuraGhost url={otherAura} side="right" />
          </div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-200/75">
            Spotkanie dwóch przestrzeni
          </p>
          <p className="mt-2 text-[15px] font-medium text-white/90">
            {mine.name.split(" ")[0]} i {other.name.split(" ")[0]} — oba momenty dziś
          </p>
          <p className="mt-1 text-[12px] text-white/45">Dotknij — wspólne światło i ambient</p>
        </button>
      ) : (
        <div className="randki-match-moment-hero--revealed relative p-4">
          <div className="randki-match-blend-layer pointer-events-none absolute inset-0 opacity-90" aria-hidden />
          <div className="relative">
            <p className="mb-3 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-200/70">
              Dwa momenty · jedna przestrzeń
            </p>
            <div className="randki-match-aura-sync pointer-events-none absolute left-1/2 top-1/2 z-[2] hidden h-20 w-20 -translate-x-1/2 -translate-y-1/2 sm:block">
              {mineAura && (
                <img
                  src={mineAura}
                  alt=""
                  className="absolute left-0 top-0 h-full w-1/2 object-cover object-top opacity-80 mix-blend-screen"
                />
              )}
              {otherAura && (
                <img
                  src={otherAura}
                  alt=""
                  className="absolute right-0 top-0 h-full w-1/2 object-cover object-top opacity-80 mix-blend-screen"
                />
              )}
            </div>
            <div className="relative z-[1] grid gap-3 sm:grid-cols-2">
              <PaneMoment pane={mine} side="left" />
              <PaneMoment pane={other} side="right" />
            </div>
            <p className="randki-match-sync-caption mt-3 text-center text-[11px] italic text-white/45">
              Słuchacie tego samego ambientu — bez pośpiechu
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
