"use client";

import { useState } from "react";
import { resolveRandkiMediaUrl } from "@/lib/randki/visualPreview";
import { momentKindLabel, resolveMomentKindFromCard } from "@/lib/randki/momentLabels";
import type { RandkiDiscoveryCard } from "@/lib/randki/matching";
import { RandkiMomentResonance } from "@/components/randki/RandkiMomentResonance";

type Props = {
  card: RandkiDiscoveryCard;
  resolveUrl?: (url: string | null) => string;
};

export function RandkiMomentHero({ card, resolveUrl }: Props) {
  const [resonanceGlow, setResonanceGlow] = useState(false);
  if (!card.hasFreshMoment) return null;

  const kind = resolveMomentKindFromCard(card);
  const label = momentKindLabel(kind);
  const ru = resolveUrl ?? ((u: string | null) => resolveRandkiMediaUrl(u) ?? "");
  const isAudio = kind === "audio" || kind === "voice";
  const mainUrl = card.dailyMomentUrl && !card.dailyMomentUrl.includes("moment-audio.svg")
    ? ru(card.dailyMomentUrl)
    : null;
  const secondaryUrl = card.dailyMomentSecondaryUrl ? ru(card.dailyMomentSecondaryUrl) : null;
  const audioUrl = card.dailyMomentAudioUrl ? ru(card.dailyMomentAudioUrl) : null;

  return (
    <section className="randki-moment-hero relative border-b border-white/10">
      <div className={`relative overflow-hidden ${resonanceGlow ? "randki-moment-hero--felt" : ""}`}>
        {isAudio && audioUrl ? (
          <div
            className={`px-4 py-6 ${
              kind === "voice"
                ? "bg-gradient-to-br from-rose-950/70 via-violet-950/50 to-black"
                : "bg-gradient-to-br from-violet-950/60 to-black"
            }`}
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-200/80">
              Okno · {label}
            </p>
            {kind === "voice" && (
              <div className="randki-voice-presence-wave mt-3 flex h-12 items-end gap-[2px]">
                {Array.from({ length: 32 }).map((_, i) => (
                  <span
                    key={i}
                    className="randki-voice-presence-bar w-[3px] rounded-full bg-gradient-to-t from-rose-600/50 to-rose-100/70"
                    style={{ animationDelay: `${(i % 9) * 0.06}s` }}
                  />
                ))}
              </div>
            )}
            <audio controls preload="none" src={audioUrl} className="mt-3 w-full" />
          </div>
        ) : mainUrl ? (
          <div className="relative aspect-[16/10] max-h-[220px] w-full">
            <img src={mainUrl} alt="" className="h-full w-full object-cover" />
            {secondaryUrl && (
              <img
                src={secondaryUrl}
                alt=""
                className="absolute bottom-3 left-3 h-20 w-14 rotate-[-4deg] rounded-md border-2 border-white/25 object-cover shadow-lg"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/15" />
            <p className="absolute bottom-3 right-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-100/90">
              Okno · {label}
            </p>
          </div>
        ) : null}

        {resonanceGlow && (
          <div className="randki-moment-resonance-overlay pointer-events-none absolute inset-0 flex items-center justify-center">
            <p className="rounded-full border border-amber-300/30 bg-black/45 px-4 py-2 text-[12px] italic text-amber-100/90 backdrop-blur-sm">
              Ktoś poczuł ten moment
            </p>
          </div>
        )}
      </div>

      {card.dailyMomentId && (
        <div className="px-4 py-3">
          <RandkiMomentResonance
            roomAccountId={card.accountId}
            momentId={card.dailyMomentId}
            compact
            onResonated={() => setResonanceGlow(true)}
          />
        </div>
      )}
    </section>
  );
}
