"use client";

import Link from "next/link";
import { useState } from "react";
import { RandkiRoom } from "@/components/randki/RandkiRoom";
import type { RandkiRoomData } from "@/lib/randki/roomTypes";
import { INTERACTION_COPY } from "@/lib/randki/presenceInteractions";
import { randkiPublicHref } from "@/lib/randkiPaths";
import { RandkiAuraThumb } from "@/components/randki/RandkiAuraThumb";

export type MatchListItem = {
  matchId: string;
  displayName: string;
  photoUrl: string | null;
  city: string;
  lastMessage: string | null;
  compatibilityNote: string | null;
  vibeSnippet: string | null;
  room: RandkiRoomData | null;
};

export function RandkiMatchesList({ matches }: { matches: MatchListItem[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  function resolvePhoto(url: string | null) {
    if (!url) return null;
    return url.startsWith("http") ? url : `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${url}`;
  }

  return (
    <ul className="mt-8 space-y-3">
      {matches.map((m) => {
        const photo = resolvePhoto(m.photoUrl);
        const showRoom = expandedId === m.matchId && m.room;
        const firstName = m.displayName.split(" ")[0];

        return (
          <li key={m.matchId} className="overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03]">
            <div className="flex items-start gap-4 p-4">
              <Link href={randkiPublicHref(`/przestrzen/${m.matchId}`)} className="shrink-0">
                <RandkiAuraThumb room={m.room} photoUrl={photo} displayName={m.displayName} />
              </Link>
              <div className="min-w-0 flex-1">
                <Link href={randkiPublicHref(`/przestrzen/${m.matchId}`)} className="block hover:opacity-90">
                  <p className="font-semibold text-white">{m.displayName}</p>
                  <p className="mt-0.5 text-[12px] text-white/45">
                    {m.lastMessage ? `Ostatnio · ${m.lastMessage}` : m.city}
                  </p>
                </Link>
                {m.compatibilityNote && (
                  <p className="mt-1.5 line-clamp-2 text-[12px] italic text-violet-300/75">&ldquo;{m.compatibilityNote}&rdquo;</p>
                )}
                {m.vibeSnippet && !m.compatibilityNote && (
                  <p className="mt-1 line-clamp-1 text-[12px] text-white/40">&ldquo;{m.vibeSnippet}&rdquo;</p>
                )}
                <div className="mt-2 flex flex-wrap gap-3 text-[12px]">
                  <Link href={randkiPublicHref(`/przestrzen/${m.matchId}`)} className="font-medium text-violet-300 hover:underline">
                    {INTERACTION_COPY.openSpace} →
                  </Link>
                  <Link href={randkiPublicHref(`/czat/${m.matchId}`)} className="text-white/40 hover:text-white/65">
                    {INTERACTION_COPY.writeQuietly} →
                  </Link>
                  {m.room && (
                    <button
                      type="button"
                      onClick={() => setExpandedId((id) => (id === m.matchId ? null : m.matchId))}
                      className="text-white/40 hover:text-white/65"
                    >
                      {showRoom ? "Zwiń pokój" : `Pokój ${firstName}`}
                    </button>
                  )}
                </div>
              </div>
            </div>
            {showRoom && m.room && (
              <div className="border-t border-white/10 px-3 pb-3 pt-2">
                <RandkiRoom
                  room={m.room}
                  mode="visit"
                  resolveUrl={(url) => {
                    if (!url) return "";
                    return url.startsWith("http") ? url : `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${url}`;
                  }}
                  photoRevealed
                  compact
                />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
