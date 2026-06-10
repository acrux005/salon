import type { DayPhase } from "@/lib/randki/dayRhythm";
import { resolveDayPhaseMeta } from "@/lib/randki/dayRhythm";
import type { RandkiDiscoveryCard } from "@/lib/randki/matching";
import {
  DEMO_EVENING_DISCOVERY_CARDS,
  isDemoDiscoveryAccountId,
  shouldShowDemoDiscoveryRooms,
} from "@/lib/randki/demoDiscoveryCards";
import { getDemoDiscoveryCardsForPhase } from "@/lib/randki/demoDayRhythm";
import { applyRoomPhaseToDiscoveryCard, parseRoomPhasesJson } from "@/lib/randki/roomPhases";
import { getRoomClimateForCard } from "@/lib/randki/roomClimate";
import { applyDemoRoomRotation, findEphemeralCardById, isEphemeralRoomId } from "@/lib/randki/roomRotation";
import { getRoomDataForAccount } from "@/lib/randki/roomData";
import { shouldShowDemoDayRhythm } from "@/lib/randki/demoDayRhythm";
import type { RandkiRoomData } from "@/lib/randki/roomTypes";

function cardToRoom(card: RandkiDiscoveryCard): RandkiRoomData {
  return {
    displayName: card.displayName,
    age: card.age,
    city: card.city,
    whyReason: card.whyReason,
    mood: card.mood,
    voiceIntroUrl: card.voiceIntroUrl,
    vibeMaterials: card.vibeMaterials,
    interests: card.interests,
    prompts: card.prompts,
    photoUrls: card.photoUrls,
    bio: card.bio,
    dailyMomentUrl: card.hasFreshMoment ? card.dailyMomentUrl : null,
    dailyMomentSecondaryUrl: card.hasFreshMoment ? card.dailyMomentSecondaryUrl : null,
    dailyMomentAt: card.hasFreshMoment ? card.dailyMomentAt : null,
    circleLabel: card.circleLabel,
    gender: card.gender,
    auraImageUrl: card.auraImageUrl ?? null,
    auraImageUrl2: card.auraImageUrl2 ?? null,
    auraImageUrl3: card.auraImageUrl3 ?? null,
    auraCaption: card.auraCaption ?? null,
    isPresent: card.recentlyActive ?? true,
  };
}

export type GuestRoomView = {
  roomId: string;
  card: RandkiDiscoveryCard;
  room: RandkiRoomData;
  climateLabel: string;
  isDemo: boolean;
  allowsGuest: boolean;
};

function findDemoCard(roomId: string, phase: DayPhase): RandkiDiscoveryCard | null {
  return getDemoDiscoveryCardsForPhase(phase).find((c) => c.accountId === roomId) ?? null;
}

export async function resolveGuestRoom(
  roomId: string,
  phaseOverride?: string
): Promise<GuestRoomView | null> {
  const dayPhase = resolveDayPhaseMeta(phaseOverride);
  const phase = dayPhase.id;

  if (isEphemeralRoomId(roomId) || roomId.startsWith("rotation-")) {
    const ephemeral = findEphemeralCardById(roomId, phase);
    if (ephemeral) {
      return {
        roomId,
        card: ephemeral,
        room: { ...cardToRoom(ephemeral), displayName: ephemeral.displayName, isPresent: true },
        climateLabel: getRoomClimateForCard(ephemeral).label,
        isDemo: true,
        allowsGuest: true,
      };
    }
    const card = getDemoDiscoveryCardsForPhase(phase).find((c) => c.accountId === roomId);
    if (!card) return null;
    return {
      roomId,
      card,
      room: { ...cardToRoom(card), displayName: card.displayName, isPresent: true },
      climateLabel: getRoomClimateForCard(card).label,
      isDemo: true,
      allowsGuest: true,
    };
  }

  if (isDemoDiscoveryAccountId(roomId) && shouldShowDemoDiscoveryRooms()) {
    const card = findDemoCard(roomId, phase) ?? DEMO_EVENING_DISCOVERY_CARDS.find((c) => c.accountId === roomId);
    if (!card) return null;
    const phases = parseRoomPhasesJson(card.roomPhasesJson);
    const phased = applyRoomPhaseToDiscoveryCard(card, phases, phase);
    return {
      roomId,
      card: phased,
      room: cardToRoom(phased),
      climateLabel: getRoomClimateForCard(phased).label,
      isDemo: true,
      allowsGuest: true,
    };
  }

  const room = await getRoomDataForAccount(roomId);
  if (!room) return null;

  const card: RandkiDiscoveryCard = {
    accountId: roomId,
    displayName: room.displayName,
    age: room.age ?? 0,
    city: room.city ?? "",
    gender: room.gender ?? "other",
    bio: room.bio ?? "",
    photoUrl: room.photoUrls[0] ?? null,
    photoUrls: room.photoUrls,
    interests: room.interests,
    prompts: room.prompts,
    interestScore: 0,
    compatibilityScore: 0,
    whyReason: room.whyReason ?? "",
    socialProof: [],
    mood: room.mood ?? null,
    intention: "relacja",
    voiceIntroUrl: room.voiceIntroUrl ?? null,
    activityIntent: null,
    communicationStyle: null,
    circleSlug: null,
    circleLabel: room.circleLabel ?? null,
    dailyMomentUrl: room.dailyMomentUrl ?? null,
    dailyMomentSecondaryUrl: room.dailyMomentSecondaryUrl ?? null,
    dailyMomentAt: room.dailyMomentAt ? new Date(room.dailyMomentAt) : null,
    hasFreshMoment: !!room.dailyMomentUrl,
    vibeMaterials: room.vibeMaterials,
    auraImageUrl: room.auraImageUrl ?? null,
    auraImageUrl2: room.auraImageUrl2 ?? null,
    auraImageUrl3: room.auraImageUrl3 ?? null,
    auraCaption: room.auraCaption ?? null,
    recentlyActive: true,
  };

  return {
    roomId,
    card,
    room: { ...room, photoUrls: [], isPresent: true },
    climateLabel: getRoomClimateForCard(card).label,
    isDemo: false,
    allowsGuest: shouldShowDemoDayRhythm() || process.env.RANDKI_GUEST_ROOMS === "1",
  };
}

export function listGuestEntryRooms(phase: DayPhase): RandkiDiscoveryCard[] {
  if (!shouldShowDemoDiscoveryRooms()) return [];
  return getDemoDiscoveryCardsForPhase(phase).slice(0, 8);
}
