"use client";

import { resolveRandkiMediaUrl } from "@/lib/randki/visualPreview";
import { normalizeAuraPlaneImages, hasAnyAuraPlaneImage } from "@/lib/randki/auraSilhouettes";
import type { RandkiRoomData } from "@/lib/randki/roomTypes";

type Props = {
  room: RandkiRoomData | null;
  photoUrl?: string | null;
  displayName: string;
  size?: "sm" | "md";
};

export function RandkiAuraThumb({ room, photoUrl, displayName, size = "md" }: Props) {
  const dim = size === "sm" ? "h-11 w-11" : "h-14 w-14";
  const firstName = displayName.split(" ")[0];

  const auraUrls = room
    ? normalizeAuraPlaneImages(room.auraImageUrl, room.auraImageUrl2, room.auraImageUrl3)
    : null;
  const auraSrc = auraUrls && hasAnyAuraPlaneImage(auraUrls)
    ? resolveRandkiMediaUrl(auraUrls[0] ?? auraUrls[1] ?? auraUrls[2])
    : null;
  const fallbackPhoto = resolveRandkiMediaUrl(photoUrl ?? room?.photoUrls[0] ?? null);

  if (auraSrc) {
    return (
      <div
        className={`randki-aura-thumb ${dim} relative overflow-hidden rounded-xl border border-violet-400/25 bg-violet-950/50 ring-1 ring-violet-300/15`}
      >
        <img src={auraSrc} alt="" className="h-full w-full object-cover object-top mix-blend-screen opacity-95" />
        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-1 py-0.5 text-center text-[8px] text-violet-100/80">
          {firstName}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`${dim} overflow-hidden rounded-xl border border-white/10 bg-black/30 ring-1 ring-white/10`}
    >
      {fallbackPhoto ? (
        <img src={fallbackPhoto} alt="" className="h-full w-full object-cover opacity-80" />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-violet-900/40 to-rose-900/30 text-[11px] text-white/50">
          {firstName.slice(0, 1)}
        </div>
      )}
    </div>
  );
}
