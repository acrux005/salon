"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { openPrivateSpaceAction } from "@/app/actions/randki";
import { RandkiClimateScene } from "@/components/randki/RandkiClimateScene";
import { RandkiSharedListening } from "@/components/randki/RandkiSharedListening";
import { RandkiPresenceReactions } from "@/components/randki/RandkiPresenceReactions";
import { RandkiPresenceDialog } from "@/components/randki/RandkiPresenceDialog";
import { climateClass } from "@/lib/randki/roomClimate";
import { normalizeAuraPlaneImages, hasAnyAuraPlaneImage } from "@/lib/randki/auraSilhouettes";
import type { SharedListeningSource } from "@/lib/randki/sharedListening";
import { listeningScopeForMatch } from "@/lib/randki/sharedListening";
import { INTERACTION_COPY } from "@/lib/randki/presenceInteractions";
import { randkiPublicHref } from "@/lib/randkiPaths";
import { resolveRandkiMediaUrl } from "@/lib/randki/visualPreview";
import { RandkiMatchMomentHero } from "@/components/randki/RandkiMatchMomentHero";
import type { MatchMomentPane } from "@/components/randki/RandkiMatchMomentHero";

type SpacePane = MatchMomentPane & {
  climateLabel: string;
  quote: string;
};

type Props = {
  matchId: string;
  other: SpacePane;
  mine: SpacePane;
  listening: SharedListeningSource;
  otherAccountId: string;
  privateSpaceAt: string | null;
  messageCount: number;
};

function SpacePaneCard({ pane, side }: { pane: SpacePane; side: "left" | "right" }) {
  const auraUrls = normalizeAuraPlaneImages(pane.auraUrl ?? null, null, null);
  const aura = hasAnyAuraPlaneImage(auraUrls) ? resolveRandkiMediaUrl(auraUrls[0]) : null;
  const moment = resolveRandkiMediaUrl(pane.momentUrl ?? null);
  const firstName = pane.name.split(" ")[0];

  return (
    <div
      className={`randki-space-pane randki-space-pane--${side} relative min-h-[200px] overflow-hidden rounded-xl border border-white/10 ${climateClass(pane.climateId)}`}
    >
      <RandkiClimateScene climateId={pane.climateId} />
      <div className="relative flex h-full flex-col justify-between p-4">
        <div>
          <p className="text-[9px] uppercase tracking-[0.14em] text-white/40">{pane.climateLabel}</p>
          <p className="mt-1 text-[15px] font-semibold text-white">{firstName}</p>
          <p className="mt-2 line-clamp-3 text-[12px] italic text-white/65">&ldquo;{pane.quote}&rdquo;</p>
        </div>
        <div className="mt-3 flex items-end gap-2">
          {aura && (
            <div className="h-16 w-12 overflow-hidden rounded-lg border border-violet-300/20 opacity-90">
              <img src={aura} alt="" className="h-full w-full object-cover object-top mix-blend-screen" />
            </div>
          )}
          {moment && !moment.includes("moment-audio.svg") && (
            <div className="h-12 w-16 overflow-hidden rounded-lg border border-amber-200/20">
              <img src={moment} alt="" className="h-full w-full object-cover" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function RandkiPrivateSpaceClient({
  matchId,
  other,
  mine,
  listening,
  otherAccountId,
  privateSpaceAt,
  messageCount,
}: Props) {
  const [opened, setOpened] = useState(!!privateSpaceAt);
  const [momentSynced, setMomentSynced] = useState(false);
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState("");
  const firstName = other.name.split(" ")[0];

  function openSpace() {
    start(async () => {
      const res = await openPrivateSpaceAction(matchId);
      if (!res.ok) {
        setMsg(res.error);
        return;
      }
      setOpened(true);
      setMsg("");
    });
  }

  return (
    <div className={`mx-auto max-w-3xl overflow-hidden rounded-2xl border border-white/12 bg-black/20 ${momentSynced ? "randki-space--moment-synced" : ""}`}>
      <div className="p-4 sm:p-6">
        <p className="text-[10px] uppercase tracking-[0.16em] text-white/45">Spokojniejsza przestrzeń</p>
        <h1 className="mt-1 text-2xl font-bold text-white">Obok siebie · {firstName}</h1>
        <p className="mt-1 text-[12px] text-white/45">{INTERACTION_COPY.noReadReceipts}</p>

        <RandkiMatchMomentHero mine={mine} other={other} onRevealed={() => setMomentSynced(true)} />

        <div className="randki-space-split mt-5 grid gap-3 sm:grid-cols-2">
          <SpacePaneCard pane={mine} side="left" />
          <SpacePaneCard pane={other} side="right" />
        </div>

        <div className="mt-5 space-y-3">
          <RandkiSharedListening
            source={listening}
            scopeKey={listeningScopeForMatch(matchId)}
            twilight={momentSynced || opened}
          />

          {opened ? (
            <>
              <div className="rounded-xl border border-violet-400/25 bg-violet-950/35 px-4 py-3">
                <p className="text-[12px] text-violet-100/90">
                  Jesteście obok siebie — {messageCount > 0 ? "rozmawiacie już chwilę" : "zostawiliście ślady obecności"}.
                </p>
              </div>
              <RandkiPresenceReactions roomAccountId={otherAccountId} compact />
              <RandkiPresenceDialog roomAccountId={otherAccountId} compact />
              <Link
                href={randkiPublicHref(`/czat/${matchId}`)}
                className="block text-center text-[12px] text-white/45 underline-offset-2 hover:text-rose-300 hover:underline"
              >
                {INTERACTION_COPY.writeQuietly} →
              </Link>
            </>
          ) : (
            <>
              <p className="text-[13px] text-white/50">
                {messageCount > 0
                  ? INTERACTION_COPY.matchOrganic(other.name)
                  : "Zostawcie najpierw ślad w pokoju — potem otwórzcie wspólną przestrzeń."}
              </p>
              <button type="button" disabled={pending} onClick={openSpace} className="randki-btn-primary w-full text-[14px]">
                {INTERACTION_COPY.matchCta}
              </button>
            </>
          )}
          {msg && <p className="text-[12px] text-rose-300">{msg}</p>}
        </div>
      </div>
    </div>
  );
}
