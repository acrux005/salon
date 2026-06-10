"use client";

import { useMemo, useState } from "react";
import { RandkiRoom } from "@/components/randki/RandkiRoom";
import { buildEmotionalWhyReason } from "@/lib/randki/emotionalMoments";
import type { RandkiRoomData } from "@/lib/randki/roomTypes";

type Props = {
  room: RandkiRoomData & { previewClimateId?: string; previewTemperature?: string };
  resolveUrl: (url: string | null) => string;
  view: "guest" | "edit";
  onViewChange: (view: "guest" | "edit") => void;
  phaseLabel?: string;
};

export function RandkiProfileRoomPreview({ room, resolveUrl, view, onViewChange, phaseLabel }: Props) {
  const [photoRevealed, setPhotoRevealed] = useState(false);

  const guestRoom = useMemo(
    () => ({
      ...room,
      whyReason: buildEmotionalWhyReason(
        {
          displayName: room.displayName,
          interests: JSON.stringify(room.interests),
          mood: room.mood ?? null,
          activityIntent: null,
        },
        { vibeMaterials: room.vibeMaterials }
      ),
    }),
    [room]
  );

  function showGuestView() {
    onViewChange("guest");
    setPhotoRevealed(false);
  }

  return (
    <div id="podglad" className="randki-room-live-preview scroll-mt-24">
      <div className="mb-3 space-y-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-white/40">
            {view === "guest"
              ? phaseLabel
                ? `Tak widzą Cię — ${phaseLabel.toLowerCase()}`
                : "Tak widzą Cię goście"
              : "Układanie pokoju"}
          </p>
          <p className="mt-0.5 text-[12px] leading-relaxed text-white/45">
            {view === "guest"
              ? "Aura, emocja, zasłonięte polaroidy — zanim zobaczą twarz."
              : "Wszystko na raz — gdy coś w pokoju zmieniasz."}
          </p>
        </div>
        <div
          className="flex w-full rounded-full border border-white/10 bg-black/30 p-1 text-[13px] sm:max-w-[220px]"
          role="tablist"
          aria-label="Podgląd pokoju"
        >
          <button
            type="button"
            role="tab"
            aria-selected={view === "guest"}
            onClick={showGuestView}
            className={`flex-1 rounded-full py-2.5 font-medium transition ${
              view === "guest" ? "bg-violet-600/90 text-white shadow-sm" : "text-white/55"
            }`}
          >
            Gość
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={view === "edit"}
            onClick={() => onViewChange("edit")}
            className={`flex-1 rounded-full py-2.5 font-medium transition ${
              view === "edit" ? "bg-violet-600/90 text-white shadow-sm" : "text-white/55"
            }`}
          >
            Edycja
          </button>
        </div>
      </div>
      {view === "guest" ? (
        <RandkiRoom
          room={guestRoom}
          mode="visit"
          resolveUrl={resolveUrl}
          photoRevealed={photoRevealed}
          onRevealPhotos={() => setPhotoRevealed(true)}
        />
      ) : (
        <RandkiRoom room={room} mode="preview" resolveUrl={resolveUrl} photoRevealed />
      )}
    </div>
  );
}
