import { getPrisma } from "@/lib/db";
import { calcAge, genderCompatible, parseInterests, parseLookingFor, parsePrompts } from "@/lib/randki/constants";
import { areAccountsBlocked, getBlockedAccountIds } from "@/lib/randki/blocks";
import { countVisiblePhotos, getPhotoUrlsForAccount } from "@/lib/randki/photos";
import { chatMessagePreview } from "@/lib/randki/chatMessage";
import { notifyDatingMatch, notifyDatingMessage } from "@/lib/randki/notifications";

import { computeCompatibilityScore, buildFallbackWhyReason } from "@/lib/randki/compatibility";
import { persistMatchConversationAnalytics } from "@/lib/randki/matchAnalytics";
import { generateIcebreakers, generateMatchCompatibilityNote, moderateDatingMessage } from "@/lib/randki/ai";
import { formatSocialProof, refreshResponseStatsForAccount } from "@/lib/randki/responseStats";
import { getActiveMomentsForAccounts } from "@/lib/randki/dailyMoment";
import { circleLabel } from "@/lib/randki/circles";
import { getDailyDiscoveryLimit } from "@/lib/randki/premium";
import { getVibeMaterialsForAccounts, type VibeMaterialRow } from "@/lib/randki/vibeMaterial";
import { sortVibeMaterials } from "@/lib/randki/vibeMaterialSlots";
import { resolveDayPhase } from "@/lib/randki/dayRhythm";
import { applyRoomPhaseToDiscoveryCard, parseRoomPhasesJson, resolveCardClimateId } from "@/lib/randki/roomPhases";
import { scorePhaseAffinity, shouldShowProfileInPhase } from "@/lib/randki/phaseDiscovery";
import type { RoomClimateId } from "@/lib/randki/roomClimate";
import { effectiveTodayState } from "@/lib/randki/todayState";

/** Dzienny limit śladów rezonansu (zostawania w pokoju). */
export const DAILY_RESONANCE_LIMIT = 15;
/** @deprecated use DAILY_RESONANCE_LIMIT */
export const DAILY_LIKE_LIMIT = DAILY_RESONANCE_LIMIT;
export const DAILY_DISCOVERY_LIMIT = 1;
export { BASE_DAILY_DISCOVERY_LIMIT, PREMIUM_DAILY_DISCOVERY_LIMIT, getDailyDiscoveryLimit } from "@/lib/randki/premium";

export type RandkiDiscoveryCard = {
  accountId: string;
  displayName: string;
  age: number;
  city: string;
  gender: string;
  bio: string;
  photoUrl: string | null;
  photoUrls: string[];
  interests: string[];
  prompts: { question: string; answer: string }[];
  interestScore: number;
  compatibilityScore: number;
  whyReason: string;
  socialProof: string[];
  mood: string | null;
  intention: string;
  voiceIntroUrl: string | null;
  activityIntent: string | null;
  communicationStyle: string | null;
  circleSlug: string | null;
  circleLabel: string | null;
  dailyMomentUrl: string | null;
  dailyMomentSecondaryUrl: string | null;
  dailyMomentAudioUrl?: string | null;
  dailyMomentAt: Date | null;
  dailyMomentId?: string | null;
  hasFreshMoment: boolean;
  /** Ostatni ślad obecności w pokoju (bez liczników). */
  presenceTrace?: string | null;
  vibeMaterials: VibeMaterialRow[];
  auraImageUrl: string | null;
  auraImageUrl2: string | null;
  auraImageUrl3: string | null;
  auraCaption: string | null;
  recentlyActive: boolean;
  /** Nadpisanie klimatu z konfiguracji pory dnia. */
  roomClimateId?: RoomClimateId | null;
  roomTemperature?: string | null;
  roomPhasesJson?: string;
  /** Mikro-status na dziś (24h). */
  todayState?: string | null;
  /** Rotacja demo — nowy pokój w tej porze. */
  rotationNew?: boolean;
  rotationClosing?: boolean;
  rotationOpensInMin?: number;
  ephemeralDuration?: import("@/lib/randki/ephemeralRooms").EphemeralDuration;
  ephemeralDurationLabel?: string;
  ephemeralExpiresAt?: string;
  /** Typ aktywnego momentu. */
  dailyMomentType?: "photo" | "audio" | "voice" | null;
};

export type RandkiMatchRow = {
  matchId: string;
  otherAccountId: string;
  displayName: string;
  photoUrl: string | null;
  city: string;
  lastMessage: string | null;
  lastMessageAt: Date | null;
  compatibilityNote: string | null;
  vibeSnippet: string | null;
};

export type RandkiLikeReceivedRow = {
  fromAccountId: string;
  displayName: string;
  age: number;
  city: string;
  photoUrl: string | null;
  likedAt: Date;
};

function normalizePair(a: string, b: string): [string, string] {
  return a < b ? [a, b] : [b, a];
}

function interestScore(myInterests: string[], theirInterests: string[]): number {
  const mine = new Set(myInterests);
  return theirInterests.filter((i) => mine.has(i)).length;
}

function ageInRange(age: number, min: number, max: number): boolean {
  return age >= min && age <= max;
}

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function countDailyImpressions(accountId: string): Promise<number> {
  return getPrisma().datingDiscoveryImpression.count({
    where: { viewerAccountId: accountId, createdAt: { gte: startOfToday() } },
  });
}

export async function countDailyResonances(accountId: string): Promise<number> {
  return getPrisma().datingLike.count({
    where: { fromAccountId: accountId, liked: true, createdAt: { gte: startOfToday() } },
  });
}

/** @deprecated use countDailyResonances */
export const countDailyLikes = countDailyResonances;

export async function getMyProfile(accountId: string) {
  return getPrisma().datingProfile.findUnique({ where: { accountId } });
}

export async function profileReadyForDiscovery(accountId: string): Promise<boolean> {
  const profile = await getMyProfile(accountId);
  if (!profile?.completed || !profile.active || !profile.onboardingDone) return false;
  const photos = await countVisiblePhotos(accountId);
  return photos >= 1;
}

export async function needsOnboarding(accountId: string): Promise<boolean> {
  const profile = await getMyProfile(accountId);
  return !profile?.onboardingDone;
}

export async function discoverProfiles(
  accountId: string,
  limit = DAILY_DISCOVERY_LIMIT,
  offset = 0
): Promise<RandkiDiscoveryCard[]> {
  const prisma = getPrisma();
  if (!(await profileReadyForDiscovery(accountId))) return [];

  const impressionsToday = await countDailyImpressions(accountId);
  const dailyLimit = await getDailyDiscoveryLimit(accountId);
  if (impressionsToday >= dailyLimit && offset === 0) {
    return [];
  }

  const myProfile = await prisma.datingProfile.findUnique({ where: { accountId } });
  if (!myProfile) return [];

  const myLookingFor = parseLookingFor(myProfile.lookingFor);
  const myInterests = parseInterests(myProfile.interests);
  const blockedIds = await getBlockedAccountIds(accountId);
  const seen = await prisma.datingLike.findMany({
    where: { fromAccountId: accountId },
    select: { toAccountId: true },
  });
  const seenIds = new Set(seen.map((s) => s.toAccountId));
  const alreadyShown = await prisma.datingDiscoveryImpression.findMany({
    where: { viewerAccountId: accountId, createdAt: { gte: startOfToday() } },
    select: { targetAccountId: true },
  });
  const shownToday = new Set(alreadyShown.map((s) => s.targetAccountId));

  const remaining = Math.max(0, dailyLimit - impressionsToday);
  const effectiveLimit = Math.min(limit, remaining);

  const candidates = await prisma.datingProfile.findMany({
    where: {
      accountId: { not: accountId },
      active: true,
      completed: true,
      onboardingDone: true,
      ghostScore: { gte: 35 },
      ...(myProfile.searchAllCities || !myProfile.city ? {} : { city: myProfile.city }),
    },
    orderBy: { updatedAt: "desc" },
    take: 200,
  });

  type Scored = RandkiDiscoveryCard & { _score: number };
  const scored: Scored[] = [];
  const candidateIds = candidates.map((c) => c.accountId);
  const moments = await getActiveMomentsForAccounts(candidateIds);
  const vibeMaterialsMap = await getVibeMaterialsForAccounts(candidateIds);

  const viewerPhase = resolveDayPhase();

  for (const p of candidates) {
    if (seenIds.has(p.accountId) || blockedIds.has(p.accountId) || shownToday.has(p.accountId)) continue;
    const photoCount = await countVisiblePhotos(p.accountId);
    if (photoCount < 1) continue;

    const theirLooking = parseLookingFor(p.lookingFor);
    if (!genderCompatible(myProfile.gender, myLookingFor, p.gender, theirLooking)) continue;
    const age = calcAge(p.birthYear);
    if (!ageInRange(age, myProfile.ageMinPref, myProfile.ageMaxPref)) continue;
    const myAge = calcAge(myProfile.birthYear);
    if (!ageInRange(myAge, p.ageMinPref, p.ageMaxPref)) continue;

    const phases = parseRoomPhasesJson((p as { roomPhasesJson?: string }).roomPhasesJson);
    if (!shouldShowProfileInPhase(phases, viewerPhase)) continue;

    const theirInterests = parseInterests(p.interests);
    const compat = computeCompatibilityScore(myProfile, p);
    const interest = interestScore(myInterests, theirInterests);
    let totalScore = compat + interest + Math.floor((p.ghostScore ?? 100) / 20);
    if (p.voiceIntroUrl) totalScore += 8;
    const vibeMaterials = sortVibeMaterials(vibeMaterialsMap.get(p.accountId) ?? []);
    if (vibeMaterials.length > 0) totalScore += 4 + vibeMaterials.length;
    if (p.communicationStyle && myProfile.communicationStyle === p.communicationStyle) totalScore += 5;
    if (myProfile.mood && p.mood && p.mood === myProfile.mood) totalScore += 12;
    else if (myProfile.mood && p.mood) totalScore -= 2;
    if (myProfile.activityIntent && p.activityIntent && p.activityIntent === myProfile.activityIntent) totalScore += 15;
    else if (myProfile.activityIntent && p.activityIntent) totalScore += 4;
    if (myProfile.circleSlug && p.circleSlug && p.circleSlug === myProfile.circleSlug) totalScore += 18;
    const moment = moments.get(p.accountId);
    if (moment) totalScore += 10;
    if (p.auraStatus === "uploaded" && (p.auraImageUrl || p.auraImageUrl2 || p.auraImageUrl3)) totalScore += 6;
    if (p.auraImageUrl && p.auraImageUrl2 && p.auraImageUrl3) totalScore += 4;
    const photoUrls = await getPhotoUrlsForAccount(p.accountId);
    const whyReason = buildFallbackWhyReason(myProfile, { ...p, displayName: p.displayName }, compat, {
      vibeMaterials,
    });

    const baseCard: RandkiDiscoveryCard = {
      accountId: p.accountId,
      displayName: p.displayName,
      age,
      city: p.city,
      gender: p.gender,
      bio: p.bio,
      photoUrl: photoUrls[0] ?? p.photoUrl,
      photoUrls,
      interests: theirInterests,
      prompts: parsePrompts(p.promptsJson),
      interestScore: interest,
      compatibilityScore: compat,
      whyReason,
      socialProof: formatSocialProof(p),
      mood: p.mood,
      intention: p.intention,
      voiceIntroUrl: p.voiceIntroUrl,
      activityIntent: p.activityIntent,
      communicationStyle: p.communicationStyle,
      circleSlug: p.circleSlug,
      circleLabel: circleLabel(p.circleSlug),
      dailyMomentUrl: moment?.url ?? null,
      dailyMomentSecondaryUrl: moment?.secondaryUrl ?? null,
      dailyMomentAudioUrl: moment?.audioUrl ?? null,
      dailyMomentAt: moment?.capturedAt ?? null,
      dailyMomentId: moment?.id ?? null,
      dailyMomentType: moment?.momentType ?? null,
      hasFreshMoment: !!moment,
      vibeMaterials,
      auraImageUrl: p.auraStatus === "uploaded" ? p.auraImageUrl : null,
      auraImageUrl2: p.auraStatus === "uploaded" ? p.auraImageUrl2 : null,
      auraImageUrl3: p.auraStatus === "uploaded" ? p.auraImageUrl3 : null,
      auraCaption: p.auraCaption || null,
      recentlyActive: p.updatedAt >= new Date(Date.now() - 2 * 60 * 60 * 1000),
      roomPhasesJson: (p as { roomPhasesJson?: string }).roomPhasesJson,
      todayState: effectiveTodayState(
        (p as { todayState?: string | null }).todayState,
        (p as { todayStateUpdatedAt?: Date | null }).todayStateUpdatedAt
      ),
    };

    const phasedCard = applyRoomPhaseToDiscoveryCard(baseCard, phases, viewerPhase);
    totalScore += scorePhaseAffinity({
      phase: viewerPhase,
      mood: phasedCard.mood ?? null,
      activityIntent: phasedCard.activityIntent ?? null,
      climateId: resolveCardClimateId(phasedCard),
      voiceIntroUrl: p.voiceIntroUrl,
    });

    scored.push({
      ...phasedCard,
      _score: totalScore,
    });
  }

  scored.sort((a, b) => b._score - a._score || b.accountId.localeCompare(a.accountId));
  const slice = scored.slice(offset, offset + effectiveLimit);

  const { listLatestTraceByRooms } = await import("@/lib/randki/presenceTraces");
  const traceMap = await listLatestTraceByRooms(slice.map((c) => c.accountId));

  for (const card of slice) {
    await prisma.datingDiscoveryImpression.create({
      data: {
        viewerAccountId: accountId,
        targetAccountId: card.accountId,
        whyReason: card.whyReason,
        compatibilityScore: card.compatibilityScore,
      },
    });
  }

  return slice.map(({ _score: _, ...card }) => ({
    ...card,
    presenceTrace: traceMap.get(card.accountId) ?? null,
  }));
}

export async function undoLastPass(accountId: string, toAccountId: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const like = await getPrisma().datingLike.findUnique({
    where: { fromAccountId_toAccountId: { fromAccountId: accountId, toAccountId } },
  });
  if (!like || like.liked) return { ok: false, error: "Nie można cofnąć." };
  await getPrisma().datingLike.delete({
    where: { fromAccountId_toAccountId: { fromAccountId: accountId, toAccountId } },
  });
  return { ok: true };
}

export async function listLikesReceived(accountId: string): Promise<RandkiLikeReceivedRow[]> {
  const prisma = getPrisma();
  const blockedIds = await getBlockedAccountIds(accountId);
  const likes = await prisma.datingLike.findMany({
    where: { toAccountId: accountId, liked: true },
    orderBy: { createdAt: "desc" },
  });

  const rows: RandkiLikeReceivedRow[] = [];
  for (const like of likes) {
    if (blockedIds.has(like.fromAccountId)) continue;

    const reverse = await prisma.datingLike.findUnique({
      where: { fromAccountId_toAccountId: { fromAccountId: accountId, toAccountId: like.fromAccountId } },
    });
    if (reverse?.liked) continue;

    const [accountAId, accountBId] = normalizePair(accountId, like.fromAccountId);
    const activeMatch = await prisma.datingMatch.findFirst({
      where: { accountAId, accountBId, status: "active" },
    });
    if (activeMatch) continue;

    const profile = await prisma.datingProfile.findUnique({
      where: { accountId: like.fromAccountId },
      select: { displayName: true, birthYear: true, city: true, photoUrl: true, active: true, completed: true },
    });
    if (!profile?.active || !profile.completed) continue;

    rows.push({
      fromAccountId: like.fromAccountId,
      displayName: profile.displayName,
      age: calcAge(profile.birthYear),
      city: profile.city,
      photoUrl: profile.photoUrl,
      likedAt: like.createdAt,
    });
  }
  return rows;
}

export async function recordLike(
  fromAccountId: string,
  toAccountId: string,
  liked: boolean,
  host?: string
): Promise<{ ok: true; matched: boolean; matchId?: string } | { ok: false; error: string }> {
  if (fromAccountId === toAccountId) return { ok: false, error: "Nie można zostawić śladu u siebie." };
  if (await areAccountsBlocked(fromAccountId, toAccountId)) {
    return { ok: false, error: "Nie można wykonać tej akcji." };
  }
  const prisma = getPrisma();

  if (liked) {
    const daily = await countDailyResonances(fromAccountId);
    if (daily >= DAILY_RESONANCE_LIMIT) {
      return { ok: false, error: `Dzienny limit obecności (${DAILY_RESONANCE_LIMIT}). Wróć jutro.` };
    }
  }

  await prisma.datingLike.upsert({
    where: { fromAccountId_toAccountId: { fromAccountId, toAccountId } },
    create: { fromAccountId, toAccountId, liked },
    update: { liked },
  });

  if (!liked) return { ok: true, matched: false };

  const reverse = await prisma.datingLike.findUnique({
    where: { fromAccountId_toAccountId: { fromAccountId: toAccountId, toAccountId: fromAccountId } },
  });
  if (!reverse?.liked) return { ok: true, matched: false };

  const [accountAId, accountBId] = normalizePair(fromAccountId, toAccountId);
  const existing = await prisma.datingMatch.findFirst({
    where: { accountAId, accountBId },
  });
  if (existing?.status === "active") return { ok: true, matched: true, matchId: existing.id };

  if (existing) {
    await prisma.datingMatch.update({
      where: { id: existing.id },
      data: { status: "active", unmatchedAt: null, unmatchedByAccountId: null },
    });
    await ensureMatchAiPayload(existing.id, fromAccountId, toAccountId);
    notifyDatingMatch(accountAId, accountBId, host).catch((e) => console.error("notifyDatingMatch:", e));
    return { ok: true, matched: true, matchId: existing.id };
  }

  const match = await prisma.datingMatch.create({
    data: { accountAId, accountBId, status: "active" },
  });

  await ensureMatchAiPayload(match.id, fromAccountId, toAccountId);
  notifyDatingMatch(accountAId, accountBId, host).catch((e) => console.error("notifyDatingMatch:", e));

  return { ok: true, matched: true, matchId: match.id };
}

async function ensureMatchAiPayload(matchId: string, accountAId: string, accountBId: string) {
  const prisma = getPrisma();
  const [a, b] = await Promise.all([
    prisma.datingProfile.findUnique({ where: { accountId: accountAId } }),
    prisma.datingProfile.findUnique({ where: { accountId: accountBId } }),
  ]);
  if (!a || !b) return;
  const score = computeCompatibilityScore(a, b);
  const note = await generateMatchCompatibilityNote(
    { ...a, displayName: a.displayName, city: a.city },
    { ...b, displayName: b.displayName, city: b.city },
    score
  );
  const icebreakers = await generateIcebreakers(
    { ...a, displayName: a.displayName, city: a.city },
    { ...b, displayName: b.displayName, city: b.city }
  );
  await prisma.datingMatch.update({
    where: { id: matchId },
    data: {
      compatibilityNote: note,
      icebreakersJson: JSON.stringify(icebreakers),
    },
  });
}

export async function listMatches(accountId: string): Promise<RandkiMatchRow[]> {
  const prisma = getPrisma();
  const blockedIds = await getBlockedAccountIds(accountId);
  const matches = await prisma.datingMatch.findMany({
    where: {
      status: "active",
      OR: [{ accountAId: accountId }, { accountBId: accountId }],
    },
    orderBy: { createdAt: "desc" },
  });

  const rows: RandkiMatchRow[] = [];
  for (const m of matches) {
    const otherAccountId = m.accountAId === accountId ? m.accountBId : m.accountAId;
    if (blockedIds.has(otherAccountId)) continue;

    const profile = await prisma.datingProfile.findUnique({
      where: { accountId: otherAccountId },
      select: { displayName: true, photoUrl: true, city: true, active: true },
    });
    if (!profile?.active) continue;

    const [lastMsg, vibeMaterials] = await Promise.all([
      prisma.datingMessage.findFirst({
        where: { matchId: m.id },
        orderBy: { createdAt: "desc" },
      }),
      getVibeMaterialsForAccounts([otherAccountId]).then((map) => map.get(otherAccountId) ?? []),
    ]);

    const vibeSnippet =
      vibeMaterials.find((v) => v.caption)?.caption ??
      vibeMaterials.find((v) => v.title)?.title ??
      null;

    rows.push({
      matchId: m.id,
      otherAccountId,
      displayName: profile.displayName,
      photoUrl: profile.photoUrl,
      city: profile.city,
      lastMessage: lastMsg ? chatMessagePreview(lastMsg.body) : null,
      lastMessageAt: lastMsg?.createdAt ?? m.createdAt,
      compatibilityNote: m.compatibilityNote,
      vibeSnippet,
    });
  }
  rows.sort((a, b) => (b.lastMessageAt?.getTime() ?? 0) - (a.lastMessageAt?.getTime() ?? 0));
  return rows;
}

export async function assertMatchParticipant(matchId: string, accountId: string): Promise<boolean> {
  const m = await getPrisma().datingMatch.findUnique({ where: { id: matchId } });
  if (!m || m.status !== "active") return false;
  if (m.accountAId !== accountId && m.accountBId !== accountId) return false;
  const other = m.accountAId === accountId ? m.accountBId : m.accountAId;
  if (await areAccountsBlocked(accountId, other)) return false;
  return true;
}

export async function getMatchMessages(matchId: string, accountId: string) {
  const ok = await assertMatchParticipant(matchId, accountId);
  if (!ok) return null;
  return getPrisma().datingMessage.findMany({
    where: { matchId },
    orderBy: { createdAt: "asc" },
    select: { id: true, senderAccountId: true, body: true, createdAt: true },
  });
}

export async function sendMatchMessage(
  matchId: string,
  senderAccountId: string,
  body: string,
  host?: string
) {
  const ok = await assertMatchParticipant(matchId, senderAccountId);
  if (!ok) return { ok: false as const, error: "Brak dostępu do rozmowy lub użytkownik zablokowany." };
  const trimmed = body.trim();
  if (!trimmed) return { ok: false as const, error: "Wiadomość nie może być pusta." };
  if (trimmed.length > 2000) return { ok: false as const, error: "Wiadomość jest za długa." };
  const { isVoiceChatMessage, chatMessagePreview } = await import("@/lib/randki/chatMessage");
  if (!isVoiceChatMessage(trimmed)) {
    const mod = await moderateDatingMessage(trimmed);
    if (!mod.ok) return { ok: false as const, error: mod.reason };
  }
  const msg = await getPrisma().datingMessage.create({
    data: { matchId, senderAccountId, body: trimmed },
  });
  refreshResponseStatsForAccount(senderAccountId).catch((e) => console.error("refreshResponseStats:", e));
  persistMatchConversationAnalytics(matchId).catch((e) => console.error("matchAnalytics:", e));
  notifyDatingMessage(matchId, senderAccountId, chatMessagePreview(trimmed), host).catch((e) =>
    console.error("notifyDatingMessage:", e)
  );
  return { ok: true as const, messageId: msg.id };
}

export async function getOtherAccountIdInMatch(matchId: string, myAccountId: string): Promise<string | null> {
  const m = await getPrisma().datingMatch.findUnique({ where: { id: matchId } });
  if (!m || m.status !== "active") return null;
  if (m.accountAId === myAccountId) return m.accountBId;
  if (m.accountBId === myAccountId) return m.accountAId;
  return null;
}

export async function getMatchChatPayload(matchId: string, accountId: string) {
  if (!(await assertMatchParticipant(matchId, accountId))) return null;
  const prisma = getPrisma();
  const match = await prisma.datingMatch.findUnique({ where: { id: matchId } });
  const [messages, proposals] = await Promise.all([
    getMatchMessages(matchId, accountId),
    prisma.datingDateProposal.findMany({
      where: { matchId },
      orderBy: { createdAt: "desc" },
    }),
  ]);
  let icebreakers: string[] = [];
  try {
    icebreakers = JSON.parse(match?.icebreakersJson ?? "[]") as string[];
    if (!Array.isArray(icebreakers)) icebreakers = [];
  } catch {
    icebreakers = [];
  }

  return {
    messages: messages ?? [],
    proposals,
    compatibilityNote: match?.compatibilityNote ?? null,
    icebreakers,
  };
}
