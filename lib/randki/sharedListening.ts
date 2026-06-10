import type { VibeMaterialRow } from "@/lib/randki/vibeMaterialTypes";
import type { DayPhase } from "@/lib/randki/dayRhythm";
import { ambientTrackUrl } from "@/lib/randki/ambientTracks";
import type { RandkiDiscoveryCard } from "@/lib/randki/matching";

export type SharedListeningSource = {
  title: string;
  embedUrl: string | null;
  platform: "spotify" | "ambient" | "youtube";
  caption?: string;
};

const DEMO_SHARED_TRACKS: Record<DayPhase, SharedListeningSource> = {
  morning: {
    title: "Poranek · las",
    embedUrl: null,
    platform: "ambient",
    caption: "wspólna cisza na start dnia",
  },
  day: {
    title: "Dzień · rzeka",
    embedUrl: null,
    platform: "ambient",
    caption: "obecność w tle · bez presji",
  },
  sunset: {
    title: "Zachód · góry",
    embedUrl: null,
    platform: "ambient",
    caption: "wspólne wyciszenie",
  },
  evening: {
    title: "Wieczór · las",
    embedUrl: null,
    platform: "ambient",
    caption: "głęboka cisza w tle",
  },
  night: {
    title: "Noc · dzwonki",
    embedUrl: null,
    platform: "ambient",
    caption: "cisza przed snem",
  },
};

export function pickSharedListeningFromMaterials(
  materials: VibeMaterialRow[],
  phase: DayPhase
): SharedListeningSource {
  const music = materials.find((m) => m.platform === "spotify" && m.embedUrl);
  if (music?.embedUrl) {
    return {
      title: music.title,
      embedUrl: music.embedUrl,
      platform: "spotify",
      caption: music.caption || "wspólne słuchanie",
    };
  }
  const yt = materials.find((m) => m.platform === "youtube" && m.embedUrl);
  if (yt?.embedUrl) {
    return {
      title: yt.title,
      embedUrl: yt.embedUrl,
      platform: "youtube",
      caption: yt.caption || "wspólne słuchanie",
    };
  }
  const demo = DEMO_SHARED_TRACKS[phase];
  return {
    ...demo,
    embedUrl: demo.platform === "ambient" ? ambientTrackUrl(phase) : demo.embedUrl,
  };
}

export function pickSharedListeningFromCard(card: RandkiDiscoveryCard, phase: DayPhase): SharedListeningSource {
  return pickSharedListeningFromMaterials(card.vibeMaterials, phase);
}

export function ambientAudioUrlForPhase(phase: DayPhase): string {
  return ambientTrackUrl(phase);
}

export function listeningScopeForRoom(roomAccountId: string): string {
  return `room:${roomAccountId}`;
}

export function listeningScopeForMatch(matchId: string): string {
  return `match:${matchId}`;
}
