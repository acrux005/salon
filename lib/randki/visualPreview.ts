import type { RandkiDiscoveryCard } from "@/lib/randki/matching";
import { hasAnyAuraPlaneImage, normalizeAuraPlaneImages } from "@/lib/randki/auraSilhouettes";
import type { RandkiRoomData } from "@/lib/randki/roomTypes";

export type PreviewVisualKind = "moment-photo" | "moment-audio" | "moment-voice" | "aura" | "none";

export type PreviewVisual = {
  kind: PreviewVisualKind;
  url: string | null;
  secondaryUrl?: string | null;
};

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function resolveRandkiMediaUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  return url.startsWith("http") ? url : `${BASE_PATH}${url}`;
}

export function pickCardPreviewVisual(card: RandkiDiscoveryCard): PreviewVisual {
  if (card.hasFreshMoment) {
    if (card.dailyMomentType === "voice") {
      return { kind: "moment-voice", url: null };
    }
    if (card.dailyMomentAudioUrl || card.dailyMomentType === "audio") {
      return { kind: "moment-audio", url: null };
    }
    if (card.dailyMomentUrl && !card.dailyMomentUrl.includes("moment-audio.svg")) {
      return {
        kind: "moment-photo",
        url: card.dailyMomentUrl,
        secondaryUrl: card.dailyMomentSecondaryUrl,
      };
    }
  }
  const auraUrls = normalizeAuraPlaneImages(card.auraImageUrl, card.auraImageUrl2, card.auraImageUrl3);
  if (hasAnyAuraPlaneImage(auraUrls)) {
    return { kind: "aura", url: auraUrls[0] ?? auraUrls[1] ?? auraUrls[2] };
  }
  return { kind: "none", url: null };
}

export function pickRoomPreviewVisual(room: RandkiRoomData): PreviewVisual {
  if (room.dailyMomentUrl || room.dailyMomentAudioUrl) {
    if (room.dailyMomentType === "voice") return { kind: "moment-voice", url: null };
    if (room.dailyMomentAudioUrl) return { kind: "moment-audio", url: null };
    if (room.dailyMomentUrl && !room.dailyMomentUrl.includes("moment-audio.svg")) {
      return {
        kind: "moment-photo",
        url: room.dailyMomentUrl,
        secondaryUrl: room.dailyMomentSecondaryUrl,
      };
    }
  }
  const auraUrls = normalizeAuraPlaneImages(room.auraImageUrl, room.auraImageUrl2, room.auraImageUrl3);
  if (hasAnyAuraPlaneImage(auraUrls)) {
    return { kind: "aura", url: auraUrls[0] ?? auraUrls[1] ?? auraUrls[2] };
  }
  return { kind: "none", url: null };
}

/** Opacity 0.45–1 for ephemeral room fade in last 10 min. */
export function ephemeralFadeOpacity(msLeft: number): number {
  if (msLeft <= 0) return 0.42;
  const tenMin = 10 * 60 * 1000;
  if (msLeft >= tenMin) return 1;
  return 0.45 + 0.55 * (msLeft / tenMin);
}
