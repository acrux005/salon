"use client";

import { RandkiRoom } from "@/components/randki/RandkiRoom";
import { buildLiveRoomPreview, type LiveRoomPreviewInput } from "@/lib/randki/roomTypes";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type Props = {
  input: LiveRoomPreviewInput;
};

export function RandkiOwnRoomPreview({ input }: Props) {
  const room = buildLiveRoomPreview(input);

  function resolveUrl(url: string | null) {
    if (!url) return "";
    return url.startsWith("http") ? url : `${BASE_PATH}${url}`;
  }

  return (
    <div className="mb-8">
      <RandkiRoom room={room} mode="preview" resolveUrl={resolveUrl} photoRevealed />
    </div>
  );
}
