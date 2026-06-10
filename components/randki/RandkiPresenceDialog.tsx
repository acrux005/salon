"use client";

import { useEffect, useState, useTransition } from "react";
import { getPresenceDialogAction } from "@/app/actions/randki";
import { RandkiPresenceReactions } from "@/components/randki/RandkiPresenceReactions";
import { INTERACTION_COPY } from "@/lib/randki/presenceInteractions";
import { reactionById } from "@/lib/randki/presenceInteractions";

type DialogEntry = {
  id: string;
  traceLabel: string;
  reactionId: string;
  guestAlias: string | null;
  canReply: boolean;
  replies: { id: string; traceLabel: string; reactionId: string }[];
};

function formatWho(entry: DialogEntry): string {
  if (entry.guestAlias) return entry.guestAlias;
  return "ktoś";
}

export function RandkiPresenceDialog({
  roomAccountId,
  compact = false,
}: {
  roomAccountId: string;
  compact?: boolean;
}) {
  const [entries, setEntries] = useState<DialogEntry[]>([]);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [pending, start] = useTransition();

  useEffect(() => {
    start(async () => {
      const res = await getPresenceDialogAction(roomAccountId);
      if (res.ok) {
        setEntries(
          res.entries.map((e) => ({
            id: e.id,
            traceLabel: e.traceLabel,
            reactionId: e.reactionId,
            guestAlias: e.guestAlias,
            canReply: e.canReply,
            replies: e.replies.map((r) => ({
              id: r.id,
              traceLabel: r.traceLabel,
              reactionId: r.reactionId,
            })),
          }))
        );
      }
      setLoaded(true);
    });
  }, [roomAccountId]);

  function onReplied(trace: string) {
    setReplyTo(null);
    start(async () => {
      const res = await getPresenceDialogAction(roomAccountId);
      if (res.ok) {
        setEntries(
          res.entries.map((e) => ({
            id: e.id,
            traceLabel: e.traceLabel,
            reactionId: e.reactionId,
            guestAlias: e.guestAlias,
            canReply: e.canReply,
            replies: e.replies.map((r) => ({
              id: r.id,
              traceLabel: r.traceLabel,
              reactionId: r.reactionId,
            })),
          }))
        );
      }
    });
  }

  if (!loaded) return null;
  if (!entries.length) return null;

  return (
    <div className={`randki-presence-dialog ${compact ? "text-[11px]" : ""}`}>
      <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.12em] text-white/38">
        {INTERACTION_COPY.traceDialog}
      </p>
      <ul className="space-y-2">
        {entries.map((entry) => {
          const emoji = reactionById(entry.reactionId)?.emoji ?? "·";
          return (
            <li key={entry.id} className="rounded-lg border border-white/8 bg-white/[0.03] px-3 py-2">
              <p className="text-white/70">
                <span className="mr-1">{emoji}</span>
                {formatWho(entry)} {entry.traceLabel}
              </p>
              {entry.replies.map((r) => {
                const rEmoji = reactionById(r.reactionId)?.emoji ?? "·";
                return (
                  <p key={r.id} className="ml-4 mt-1 text-white/45">
                    <span className="mr-1">{rEmoji}</span>↳ {r.traceLabel}
                  </p>
                );
              })}
              {entry.canReply && !entry.replies.length && (
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => setReplyTo(replyTo === entry.id ? null : entry.id)}
                  className="mt-1.5 text-[10px] text-violet-300/90 underline-offset-2 hover:underline"
                >
                  {replyTo === entry.id ? "Anuluj" : INTERACTION_COPY.traceReply}
                </button>
              )}
            </li>
          );
        })}
      </ul>
      {replyTo && (
        <div className="mt-3 border-t border-white/10 pt-3">
          <RandkiPresenceReactions
            roomAccountId={roomAccountId}
            replyToTraceId={replyTo}
            compact
            onTrace={onReplied}
          />
        </div>
      )}
    </div>
  );
}

/** Inbox hosta — ślady w moim pokoju. */
export function RandkiPresenceInbox({
  entries,
}: {
  entries: {
    id: string;
    traceLabel: string;
    reactionId: string;
    guestAlias: string | null;
    replies: { traceLabel: string; reactionId: string }[];
  }[];
}) {
  if (!entries.length) return null;

  return (
    <div className="rounded-xl border border-amber-500/15 bg-amber-500/[0.06] p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-300/90">
        {INTERACTION_COPY.resonanceReceived}
      </p>
      <ul className="mt-2 space-y-1.5">
        {entries.slice(0, 5).map((e) => {
          const emoji = reactionById(e.reactionId)?.emoji ?? "·";
          return (
            <li key={e.id} className="text-[12px] text-white/65">
              {emoji} {e.guestAlias ?? "ktoś"} {e.traceLabel}
              {e.replies.map((r, i) => (
                <span key={i} className="ml-2 text-white/40">
                  ↳ {reactionById(r.reactionId)?.emoji} {r.traceLabel}
                </span>
              ))}
            </li>
          );
        })}
      </ul>
      <p className="mt-2 text-[10px] italic text-white/35">{INTERACTION_COPY.resonanceHint}</p>
    </div>
  );
}
