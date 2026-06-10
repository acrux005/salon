import { getPrisma } from "@/lib/db";
import { circleLabel } from "@/lib/randki/circles";
import { buildLiveFeedEmotionalText } from "@/lib/randki/emotionalMoments";
import { getDayPhase, isEveningPhase } from "@/lib/randki/dayRhythm";
import { getPhaseSoftFeedItems } from "@/lib/randki/phaseDiscovery";

export type LiveFeedItem = {
  id: string;
  emoji: string;
  text: string;
  ago: string;
  tone: "rose" | "violet" | "amber" | "emerald";
};

function minutesAgo(d: Date): string {
  const m = Math.max(1, Math.floor((Date.now() - d.getTime()) / 60000));
  if (m < 60) return `${m} min temu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} h temu`;
  return "dziś";
}

/** Live feed aktywności — DB + uzupełnienie, żeby sidebar żył. */
export async function getLiveFeed(accountId: string): Promise<{
  items: LiveFeedItem[];
  onlineInCity: number;
  isEvening: boolean;
  cityLabel: string | null;
}> {
  const prisma = getPrisma();
  const since = new Date(Date.now() - 6 * 60 * 60 * 1000);

  const phase = getDayPhase();
  const isEvening = isEveningPhase(phase);

  const myProfile = await prisma.datingProfile.findUnique({
    where: { accountId },
    select: { city: true },
  });
  const city = myProfile?.city?.trim() || null;
  const cityWhere = city ? { city, active: true } : { active: true };

  const [recentMoments, intentProfiles, voicePaired, activeToday] = await Promise.all([
    prisma.datingDailyMoment.findMany({
      where: { createdAt: { gte: since }, accountId: { not: accountId } },
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { account: { include: { profile: { select: { displayName: true, city: true } } } } },
    }),
    prisma.datingProfile.findMany({
      where: {
        ...cityWhere,
        accountId: { not: accountId },
        activityIntent: { not: null },
        updatedAt: { gte: since },
      },
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: { displayName: true, activityIntent: true, updatedAt: true, circleSlug: true, mood: true, interests: true },
    }),
    prisma.datingVoiceMatchQueue.count({
      where: { status: "paired", createdAt: { gte: since } },
    }),
    prisma.datingProfile.count({
      where: { ...cityWhere, updatedAt: { gte: new Date(Date.now() - 2 * 60 * 60 * 1000) } },
    }),
  ]);

  const items: LiveFeedItem[] = [];
  let i = 0;

  if (voicePaired > 0) {
    items.push({
      id: `voice-${i++}`,
      emoji: "🎙",
      text: voicePaired === 1 ? "Ktoś właśnie rozpoczął voice chat" : `${voicePaired} rozmów głosem dziś`,
      ago: "teraz",
      tone: "violet",
    });
  }

  for (const m of recentMoments.slice(0, 4)) {
    const name = m.account.profile?.displayName?.split(" ")[0] ?? "Ktoś";
    items.push({
      id: `moment-${m.id}`,
      emoji: "📸",
      text: `${name} opublikował/a moment`,
      ago: minutesAgo(m.createdAt),
      tone: "amber",
    });
  }

  for (const p of intentProfiles) {
    items.push({
      id: `intent-${p.displayName}-${p.activityIntent}`,
      emoji: "✨",
      text: buildLiveFeedEmotionalText(p.displayName, p.activityIntent, p.mood, p.interests),
      ago: minutesAgo(p.updatedAt),
      tone: "rose",
    });
    const cl = circleLabel(p.circleSlug);
    if (cl && items.length < 8) {
      items.push({
        id: `circle-${p.displayName}`,
        emoji: "🫂",
        text: `${p.displayName.split(" ")[0]} · ${cl}`,
        ago: minutesAgo(p.updatedAt),
        tone: "emerald",
      });
    }
  }

  const daySeed = Math.floor(Date.now() / (24 * 60 * 60 * 1000)) % 12;
  const softPool = getPhaseSoftFeedItems(phase).map(({ id: _id, ...rest }) => rest);

  for (const s of softPool) {
    if (items.length >= 10) break;
    if (items.some((x) => x.text === s.text)) continue;
    items.push({ id: `soft-${items.length}`, ...s });
  }

  const onlineFloor =
    phase === "morning"
      ? 6 + (daySeed % 8)
      : phase === "day"
        ? 10 + (daySeed % 10)
        : phase === "night"
          ? 5 + (daySeed % 6)
          : city
            ? 8 + (daySeed % 12)
            : 5 + (daySeed % 8);
  const onlineInCity = Math.max(activeToday, onlineFloor);

  return { items: items.slice(0, 10), onlineInCity, isEvening, cityLabel: city };
}
