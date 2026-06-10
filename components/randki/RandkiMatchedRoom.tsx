"use client";

import { useState } from "react";
import { RandkiRoom } from "@/components/randki/RandkiRoom";
import type { RandkiRoomData } from "@/lib/randki/roomTypes";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type Props = {
  room: RandkiRoomData;
  ownerName: string;
};

export function RandkiMatchedRoom({ room, ownerName }: Props) {
  const [open, setOpen] = useState(false);

  function resolveUrl(url: string | null) {
    if (!url) return "";
    return url.startsWith("http") ? url : `${BASE_PATH}${url}`;
  }

  return (
    <details
      className="randki-glass mt-4 overflow-hidden rounded-2xl"
      open={open}
      onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}
    >
      <summary className="cursor-pointer list-none px-4 py-3 [&::-webkit-details-marker]:hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-violet-300">Pokój</p>
            <p className="text-[14px] font-medium text-white">Wejdź ponownie do świata {ownerName}</p>
          </div>
          <span className="text-[12px] text-white/40">{open ? "Zwiń ↑" : "Otwórz ↓"}</span>
        </div>
      </summary>
      <div className="border-t border-white/10 p-3">
        <RandkiRoom room={room} mode="visit" resolveUrl={resolveUrl} photoRevealed />
      </div>
    </details>
  );
}
