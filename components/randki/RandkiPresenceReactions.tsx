"use client";

import { useState, useTransition } from "react";
import { leavePresenceReactionAction, leaveGuestPresenceReactionAction } from "@/app/actions/randki";
import { PRESENCE_REACTIONS, type PresenceReactionId } from "@/lib/randki/presenceInteractions";

export function RandkiPresenceReactions({
  roomAccountId,
  compact = false,
  guestMode = false,
  replyToTraceId,
  momentId,
  onTrace,
}: {
  roomAccountId: string;
  compact?: boolean;
  guestMode?: boolean;
  replyToTraceId?: string;
  momentId?: string;
  onTrace?: (trace: string) => void;
}) {
  const [sent, setSent] = useState<PresenceReactionId | null>(null);
  const [pending, start] = useTransition();

  function send(id: PresenceReactionId) {
    if (sent === id) return;
    start(async () => {
      const res = guestMode
        ? await leaveGuestPresenceReactionAction(roomAccountId, id)
        : await leavePresenceReactionAction(roomAccountId, id, {
            replyToTraceId,
            momentId,
          });
      if (res.ok) {
        setSent(id);
        onTrace?.(res.trace);
      }
    });
  }

  const label = replyToTraceId
    ? "Odpowiedz śladem"
    : momentId
      ? "Rezonans z chwilą"
      : "Zostaw ślad — nie ocenę";

  return (
    <div className={`randki-presence-reactions ${compact ? "randki-presence-reactions--compact" : ""}`}>
      <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.12em] text-white/38">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {PRESENCE_REACTIONS.map((r) => {
          const active = sent === r.id;
          return (
            <button
              key={r.id}
              type="button"
              disabled={pending || (sent !== null && !active)}
              onClick={() => send(r.id)}
              title={r.trace}
              className={`rounded-full border px-2.5 py-1 text-[11px] transition ${
                active
                  ? "border-amber-400/35 bg-amber-500/15 text-amber-100"
                  : "border-white/10 bg-white/[0.04] text-white/65 hover:border-white/20 hover:bg-white/[0.08] disabled:opacity-40"
              }`}
            >
              {r.emoji} {(compact || replyToTraceId || momentId) ? null : r.label}
            </button>
          );
        })}
      </div>
      {sent && (
        <p className="mt-2 text-[10px] italic text-white/35">Ślad zostawiony — bez liczników, bez presji.</p>
      )}
    </div>
  );
}

export function RandkiRoomPresenceTrace({ trace }: { trace: string }) {
  return (
    <p className="randki-room-presence-trace text-[10px] text-white/40">
      <span className="text-white/25">·</span> ktoś {trace}
    </p>
  );
}
