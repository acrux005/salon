import { getPrisma } from "@/lib/db";
import { getDayPhase, isEveningPhase } from "@/lib/randki/dayRhythm";

export type CommunityPulse = {
  momentsToday: number;
  walkToday: number;
  coffeeToday: number;
  voiceWaiting: number;
  isEvening: boolean;
  cityLabel: string | null;
};

/** Sygnały aktywności — realne liczniki + miękki floor, żeby appka nie wyglądała na pustą. */
export async function getCommunityPulse(accountId: string): Promise<CommunityPulse> {
  const prisma = getPrisma();
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const phase = getDayPhase();
  const isEvening = isEveningPhase(phase);

  const profile = await prisma.datingProfile.findUnique({
    where: { accountId },
    select: { city: true },
  });
  const city = profile?.city?.trim() || null;

  const cityFilter = city ? { city, active: true, completed: true } : { active: true, completed: true };

  const [momentsRaw, walkRaw, coffeeRaw, voiceRaw] = await Promise.all([
    prisma.datingDailyMoment.count({ where: { createdAt: { gte: since } } }),
    prisma.datingProfile.count({ where: { ...cityFilter, activityIntent: "walk" } }),
    prisma.datingProfile.count({ where: { ...cityFilter, activityIntent: "coffee" } }),
    prisma.datingVoiceMatchQueue.count({
      where: { status: "waiting", expiresAt: { gt: new Date() } },
    }),
  ]);

  const daySeed = Math.floor(Date.now() / (24 * 60 * 60 * 1000)) % 97;
  const floor = 18 + daySeed % 40;

  return {
    momentsToday: Math.max(momentsRaw, floor + (city ? 12 : 8)),
    walkToday: Math.max(walkRaw, 3 + (daySeed % 9)),
    coffeeToday: Math.max(coffeeRaw, 5 + (daySeed % 11)),
    voiceWaiting: Math.max(voiceRaw, isEvening ? 2 + (daySeed % 4) : voiceRaw),
    isEvening,
    cityLabel: city,
  };
}
