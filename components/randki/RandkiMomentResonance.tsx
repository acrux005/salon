"use client";

import { useState, useTransition } from "react";
import { leaveMomentResonanceAction } from "@/app/actions/randki";
import { PRESENCE_REACTIONS, INTERACTION_COPY, type PresenceReactionId } from "@/lib/randki/presenceInteractions";

export function RandkiMomentResonance({
  roomAccountId,
  momentId,
  latestTrace,
  onResonated,
  compact = false,
}: {
  roomAccountId: string;
  momentId: string;
  latestTrace?: string | null;
  onResonated?: () => void;
  compact?: boolean;
}) {
  const [sent, setSent] = useState<PresenceReactionId | null>(null);
  const [localTrace, setLocalTrace] = useState(latestTrace ?? null);
  const [pending, start] = useTransition();

  function resonate(id: PresenceReactionId) {
    if (sent) return;
    start(async () => {
      const res = await leaveMomentResonanceAction(roomAccountId, momentId, id);
      if (res.ok) {
        setSent(id);
        setLocalTrace(res.trace);
        onResonated?.();
      }
    });
  }

  return (
    <div className={`randki-moment-resonance ${compact ? "mt-2" : "mt-3"}`}>
      <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-white/38">
        {INTERACTION_COPY.momentResonance}
      </p>
      {localTrace && !sent && (
        <p className="mt-1 text-[10px] italic text-white/40">
          {INTERACTION_COPY.momentResonanceHint} · ktoś {localTrace}
        </p>
      )}
      {!sent ? (
        <div className="mt-1.5 flex flex-wrap gap-1">
          {PRESENCE_REACTIONS.slice(0, 3).map((r) => (
            <button
              key={r.id}
              type="button"
              disabled={pending}
              onClick={() => resonate(r.id)}
              title={r.trace}
              className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] text-white/60 transition hover:border-amber-400/30 hover:bg-amber-500/10 disabled:opacity-40"
            >
              {r.emoji}
            </button>
          ))}
        </div>
      ) : (
        <p className="mt-1.5 text-[10px] italic text-amber-200/70">Ślad przy chwili — bez liczników.</p>
      )}
    </div>
  );
}
