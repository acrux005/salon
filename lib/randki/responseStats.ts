import { getPrisma } from "@/lib/db";

/** Aktualizuje statystyki odpowiedzi nadawcy po wysłaniu wiadomości. */
export async function refreshResponseStatsForAccount(accountId: string): Promise<void> {
  const prisma = getPrisma();
  const sent = await prisma.datingMessage.findMany({
    where: { senderAccountId: accountId },
    orderBy: { createdAt: "desc" },
    take: 40,
    select: { matchId: true, createdAt: true },
  });
  if (sent.length === 0) return;

  const responseHours: number[] = [];
  let replied = 0;

  for (const msg of sent) {
    const reply = await prisma.datingMessage.findFirst({
      where: {
        matchId: msg.matchId,
        senderAccountId: { not: accountId },
        createdAt: { gt: msg.createdAt },
      },
      orderBy: { createdAt: "asc" },
      select: { createdAt: true },
    });
    if (reply) {
      replied += 1;
      const hours = (reply.createdAt.getTime() - msg.createdAt.getTime()) / (1000 * 60 * 60);
      if (hours >= 0 && hours < 168) responseHours.push(hours);
    }
  }

  const responseRate = sent.length > 0 ? (replied / sent.length) * 100 : null;
  const avgResponseHours =
    responseHours.length > 0 ? responseHours.reduce((a, b) => a + b, 0) / responseHours.length : null;

  let ghostScore = 100;
  if (responseRate !== null) {
    if (responseRate < 20) ghostScore = 40;
    else if (responseRate < 40) ghostScore = 60;
    else if (responseRate < 60) ghostScore = 75;
    else if (responseRate >= 80) ghostScore = 100;
    else ghostScore = 85;
  }
  if (avgResponseHours !== null && avgResponseHours > 48) ghostScore = Math.min(ghostScore, 55);

  await prisma.datingProfile.updateMany({
    where: { accountId },
    data: { responseRate, avgResponseHours, ghostScore },
  });
}

export function formatSocialProof(profile: {
  responseRate: number | null;
  avgResponseHours: number | null;
  ghostScore: number;
  profileQualityScore: number;
}): string[] {
  const badges: string[] = [];
  if (profile.responseRate !== null && profile.responseRate >= 70) {
    badges.push("Często odpowiada");
  } else if (profile.avgResponseHours !== null && profile.avgResponseHours <= 6) {
    badges.push("Odpowiada szybko");
  }
  if (profile.ghostScore >= 90) badges.push("Aktywny/a w rozmowach");
  if (profile.profileQualityScore >= 90) badges.push("Kompletny profil");
  if (profile.ghostScore < 50) badges.push("Rzadko odpowiada");
  return badges;
}
