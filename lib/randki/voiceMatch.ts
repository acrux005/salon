import { getPrisma } from "@/lib/db";
import { calcAge, genderCompatible, parseLookingFor } from "@/lib/randki/constants";
import { getBlockedAccountIds } from "@/lib/randki/blocks";
import { getPhotoUrlsForAccount } from "@/lib/randki/photos";
import { createVoiceCall } from "@/lib/randki/voiceCall";
import { notifyVoiceMatchPaired } from "@/lib/randki/notifications";

const QUEUE_TTL_MS = 5 * 60 * 1000;

export type VoiceMatchPartner = {
  accountId: string;
  displayName: string;
  age: number;
  city: string;
  voiceIntroUrl: string | null;
  photoUrl: string | null;
  whySnippet: string;
};

export type VoiceMatchState =
  | { status: "idle" }
  | { status: "waiting"; expiresAt: Date }
  | { status: "paired"; partner: VoiceMatchPartner; callId: string; expiresAt: Date };

async function buildPartnerCard(accountId: string): Promise<VoiceMatchPartner | null> {
  const profile = await getPrisma().datingProfile.findUnique({ where: { accountId } });
  if (!profile) return null;
  const photos = await getPhotoUrlsForAccount(accountId);
  return {
    accountId,
    displayName: profile.displayName,
    age: calcAge(profile.birthYear),
    city: profile.city,
    voiceIntroUrl: profile.voiceIntroUrl,
    photoUrl: photos[0] ?? profile.photoUrl,
    whySnippet: profile.bio.slice(0, 120) || "Nowa rozmowa głosem — posłuchaj i poczuj chemię.",
  };
}

export async function getVoiceMatchState(accountId: string): Promise<VoiceMatchState> {
  const prisma = getPrisma();
  const entry = await prisma.datingVoiceMatchQueue.findUnique({ where: { accountId } });
  if (!entry || entry.expiresAt < new Date()) {
    if (entry) await prisma.datingVoiceMatchQueue.delete({ where: { accountId } }).catch(() => {});
    return { status: "idle" };
  }
  if (entry.status === "paired" && entry.pairedAccountId && entry.callId) {
    const partner = await buildPartnerCard(entry.pairedAccountId);
    if (!partner) return { status: "idle" };
    return {
      status: "paired",
      partner,
      callId: entry.callId,
      expiresAt: entry.expiresAt,
    };
  }
  return { status: "waiting", expiresAt: entry.expiresAt };
}

async function finalizePair(
  prisma: ReturnType<typeof getPrisma>,
  accountId: string,
  partnerId: string,
  expiresAt: Date,
  host?: string
): Promise<VoiceMatchState> {
  const callId = await createVoiceCall(accountId, partnerId);
  await prisma.datingVoiceMatchQueue.update({
    where: { accountId: partnerId },
    data: { status: "paired", pairedAccountId: accountId, callId },
  });
  await prisma.datingVoiceMatchQueue.create({
    data: { accountId, status: "paired", pairedAccountId: partnerId, callId, expiresAt },
  });
  notifyVoiceMatchPaired(accountId, partnerId, host).catch((e) => console.error("notifyVoiceMatchPaired:", e));
  const partner = await buildPartnerCard(partnerId);
  if (!partner) throw new Error("Partner niedostępny.");
  return { status: "paired", partner, callId, expiresAt };
}

export async function joinVoiceMatchQueue(accountId: string, host?: string): Promise<VoiceMatchState> {
  const prisma = getPrisma();
  const myProfile = await prisma.datingProfile.findUnique({ where: { accountId } });
  if (!myProfile?.completed) throw new Error("Uzupełnij profil przed voice match.");

  const expiresAt = new Date(Date.now() + QUEUE_TTL_MS);
  await prisma.datingVoiceMatchQueue.deleteMany({ where: { accountId } });

  const myLooking = parseLookingFor(myProfile.lookingFor);
  const blocked = await getBlockedAccountIds(accountId);

  const waiting = await prisma.datingVoiceMatchQueue.findMany({
    where: {
      status: "waiting",
      accountId: { not: accountId },
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "asc" },
    take: 20,
  });

  for (const candidate of waiting) {
    if (blocked.has(candidate.accountId)) continue;
    const theirProfile = await prisma.datingProfile.findUnique({ where: { accountId: candidate.accountId } });
    if (!theirProfile?.active || !theirProfile.completed) continue;
    const theirLooking = parseLookingFor(theirProfile.lookingFor);
    if (!genderCompatible(myProfile.gender, myLooking, theirProfile.gender, theirLooking)) continue;
    if (!myProfile.searchAllCities && myProfile.city && theirProfile.city !== myProfile.city) continue;

    return finalizePair(prisma, accountId, candidate.accountId, expiresAt, host);
  }

  await prisma.datingVoiceMatchQueue.create({
    data: { accountId, status: "waiting", expiresAt },
  });
  return { status: "waiting", expiresAt };
}

export async function leaveVoiceMatchQueue(accountId: string): Promise<void> {
  const prisma = getPrisma();
  const entry = await prisma.datingVoiceMatchQueue.findUnique({ where: { accountId } });
  if (!entry) return;
  if (entry.callId) {
    const { endVoiceCall } = await import("@/lib/randki/voiceCall");
    await endVoiceCall(entry.callId);
  }
  if (entry.status === "paired" && entry.pairedAccountId) {
    await prisma.datingVoiceMatchQueue.deleteMany({ where: { accountId: entry.pairedAccountId } });
  }
  await prisma.datingVoiceMatchQueue.delete({ where: { accountId } });
}

export async function skipVoiceMatchPartner(accountId: string, host?: string): Promise<VoiceMatchState> {
  await leaveVoiceMatchQueue(accountId);
  return joinVoiceMatchQueue(accountId, host);
}
