import type { DayPhase } from "@/lib/randki/dayRhythm";
import { DAY_PHASES } from "@/lib/randki/dayRhythm";
import { DEMO_EVENING_DISCOVERY_CARDS } from "@/lib/randki/demoDiscoveryCards";
import { getRoomClimateForCard } from "@/lib/randki/roomClimate";
import type { RoomClimateId } from "@/lib/randki/roomClimate";
import { applyRoomPhaseToDiscoveryCard, parseRoomPhasesJson } from "@/lib/randki/roomPhases";

export type LandingPeekRoom = {
  id: string;
  firstName: string;
  timeLabel: string;
  climateId: RoomClimateId;
  climateEmoji: string;
  climateLabel: string;
  quote: string;
  musicLine: string;
  lampLabel: string;
  momentUrl: string | null;
  auraUrl: string | null;
};

const PEEK_SLOT = [0, 4, 7] as const;

const PHASE_TIMES: Record<DayPhase, [string, string, string]> = {
  morning: ["06:48", "07:15", "08:02"],
  day: ["13:05", "14:20", "15:44"],
  sunset: ["18:37", "19:12", "20:01"],
  evening: ["21:08", "22:41", "23:15"],
  night: ["00:52", "01:34", "02:18"],
};

const PHASE_LAMPS: Record<DayPhase, [string, string, string]> = {
  morning: ["para unosi się", "światło wchodzi powoli", "cicho · bez pośpiechu"],
  day: ["okno otwarte", "obecność w tle", "spokojny rytm"],
  sunset: ["golden hour", "przygaszone", "wiatr za oknem"],
  evening: ["świeci", "przy stoliku", "głęboka cisza"],
  night: ["przygaszona", "nocne okno", "bas w tle"],
};

function firstName(displayName: string): string {
  return displayName.split(" ")[0] ?? displayName;
}

function musicLineFromCard(card: (typeof DEMO_EVENING_DISCOVERY_CARDS)[number]): string {
  const track = card.vibeMaterials.find((m) => m.platform === "spotify" && m.title);
  if (track?.title) {
    const artist = track.caption?.split(",")[0]?.trim();
    return artist ? `${track.title} — ${artist}` : track.title;
  }
  return "ambient w tle · bez playlisty";
}

function cardsForPhase(phase: DayPhase) {
  const pool = DEMO_EVENING_DISCOVERY_CARDS.map((card) => {
    const phases = parseRoomPhasesJson(card.roomPhasesJson);
    return applyRoomPhaseToDiscoveryCard(card, phases, phase);
  });
  return PEEK_SLOT.map((i) => pool[i % pool.length]).filter(Boolean);
}

/** Max 3 pokoje na landing — controlled voyeurism, bez pełnych profili. */
export function getLandingPeekRooms(phase: DayPhase): LandingPeekRoom[] {
  const times = PHASE_TIMES[phase];
  const lamps = PHASE_LAMPS[phase];

  return cardsForPhase(phase).slice(0, 3).map((card, i) => {
    const climate = getRoomClimateForCard(card);
    const quote =
      card.prompts[0]?.answer?.replace(/^„|”$/g, "").slice(0, 64) ??
      card.whyReason.split("—").pop()?.trim()?.slice(0, 64) ??
      "cisza przed rozmową";

    return {
      id: card.accountId,
      firstName: firstName(card.displayName),
      timeLabel: times[i] ?? times[0],
      climateId: climate.id,
      climateEmoji: climate.emoji,
      climateLabel: climate.label,
      quote,
      musicLine: musicLineFromCard(card),
      lampLabel: lamps[i] ?? lamps[0],
      momentUrl: card.hasFreshMoment ? card.dailyMomentSecondaryUrl ?? card.dailyMomentUrl : card.auraImageUrl,
      auraUrl: card.auraImageUrl ?? card.dailyMomentUrl,
    };
  });
}

export function landingPeekSectionTitle(phase: DayPhase): string {
  const label = DAY_PHASES[phase].label.toLowerCase();
  if (phase === "evening" || phase === "night") return `${label} pokoje`;
  return `${label} · pokoje`;
}
