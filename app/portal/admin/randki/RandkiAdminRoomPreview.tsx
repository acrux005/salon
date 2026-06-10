"use client";

import { useState, useTransition } from "react";
import { adminGetDatingRoomPreviewAction } from "@/app/actions/randkiAdmin";
import { RandkiRoom } from "@/components/randki/RandkiRoom";
import type { RandkiRoomData } from "@/lib/randki/roomTypes";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type Props = {
  accountId: string;
  displayName: string;
  compact?: boolean;
};

export function RandkiAdminRoomPreview({ accountId, displayName, compact }: Props) {
  const [open, setOpen] = useState(false);
  const [room, setRoom] = useState<RandkiRoomData | null>(null);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  function toggle() {
    if (open) {
      setOpen(false);
      return;
    }
    if (room) {
      setOpen(true);
      return;
    }
    start(async () => {
      setError("");
      const res = await adminGetDatingRoomPreviewAction(accountId);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setRoom(res.room);
      setOpen(true);
    });
  }

  function resolveUrl(url: string | null) {
    if (!url) return "";
    return url.startsWith("http") ? url : `${BASE_PATH}${url}`;
  }

  return (
    <div className={compact ? "" : "mt-3"}>
      <button
        type="button"
        disabled={pending}
        onClick={toggle}
        className="rounded border border-violet-300 bg-violet-50 px-3 py-1 text-[12px] font-medium text-violet-800 hover:bg-violet-100"
      >
        {pending ? "Ładuję pokój…" : open ? "Zwiń pokój" : "Podgląd pokoju"}
      </button>
      {error && <p className="mt-1 text-[12px] text-red-600">{error}</p>}
      {open && room && (
        <div className="mt-3 max-w-md overflow-hidden rounded-xl border border-neutral-300 bg-[#0f0a1a] shadow-lg">
          <div className="border-b border-white/10 px-3 py-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-violet-300">Moderacja · pokój</p>
            <p className="text-[13px] text-white/70">
              {displayName} — pełny podgląd (admin)
            </p>
          </div>
          <RandkiRoom room={room} mode="visit" resolveUrl={resolveUrl} photoRevealed compact />
        </div>
      )}
    </div>
  );
}
