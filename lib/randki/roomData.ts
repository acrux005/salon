import { parseInterests, parsePrompts, calcAge } from "@/lib/randki/constants";
import { circleLabel } from "@/lib/randki/circles";
import { getActiveDailyMoment, isMomentFresh, resolveMomentKind } from "@/lib/randki/dailyMoment";
import { getPrisma } from "@/lib/db";
import { getPhotoUrlsForAccount } from "@/lib/randki/photos";
import { listVibeMaterials } from "@/lib/randki/vibeMaterial";
import type { RandkiRoomData } from "@/lib/randki/roomTypes";

export type { RandkiRoomData, LiveRoomPreviewInput } from "@/lib/randki/roomTypes";
export { buildLiveRoomPreview, DEMO_LANDING_ROOM } from "@/lib/randki/roomTypes";

export async function getRoomDataForAccount(
  accountId: string,
  options?: { whyReason?: string; includeDailyMoment?: boolean }
): Promise<RandkiRoomData | null> {
  const profile = await getPrisma().datingProfile.findUnique({ where: { accountId } });
  if (!profile) return null;

  const [photoUrls, vibeMaterials, moment] = await Promise.all([
    getPhotoUrlsForAccount(accountId),
    listVibeMaterials(accountId),
    options?.includeDailyMoment !== false ? getActiveDailyMoment(accountId) : null,
  ]);

  const freshMoment = moment && isMomentFresh(moment.createdAt) ? moment : null;

  return {
    displayName: profile.displayName,
    age: calcAge(profile.birthYear),
    city: profile.city,
    whyReason: options?.whyReason,
    mood: profile.mood,
    voiceIntroUrl: profile.voiceIntroUrl,
    vibeMaterials,
    interests: parseInterests(profile.interests),
    prompts: parsePrompts(profile.promptsJson),
    photoUrls,
    bio: profile.bio,
    dailyMomentUrl: freshMoment?.url ?? null,
    dailyMomentSecondaryUrl: freshMoment?.secondaryUrl ?? null,
    dailyMomentAudioUrl: freshMoment?.audioUrl ?? null,
    dailyMomentType: freshMoment ? resolveMomentKind(freshMoment) : null,
    dailyMomentAt: freshMoment?.createdAt ?? null,
    circleLabel: circleLabel(profile.circleSlug),
    gender: profile.gender,
    auraImageUrl: profile.auraStatus === "uploaded" ? profile.auraImageUrl : null,
    auraImageUrl2: profile.auraStatus === "uploaded" ? profile.auraImageUrl2 : null,
    auraImageUrl3: profile.auraStatus === "uploaded" ? profile.auraImageUrl3 : null,
    auraCaption: profile.auraCaption || null,
    auraPrompt: profile.auraPrompt || null,
  };
}
