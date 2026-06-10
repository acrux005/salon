import { getPrisma } from "@/lib/db";

function normalizePair(a: string, b: string): [string, string] {
  return a < b ? [a, b] : [b, a];
}

export async function getBlockedAccountIds(accountId: string): Promise<Set<string>> {
  const prisma = getPrisma();
  const [sent, received] = await Promise.all([
    prisma.datingBlock.findMany({ where: { blockerAccountId: accountId }, select: { blockedAccountId: true } }),
    prisma.datingBlock.findMany({ where: { blockedAccountId: accountId }, select: { blockerAccountId: true } }),
  ]);
  const ids = new Set<string>();
  for (const b of sent) ids.add(b.blockedAccountId);
  for (const b of received) ids.add(b.blockerAccountId);
  return ids;
}

export async function areAccountsBlocked(accountAId: string, accountBId: string): Promise<boolean> {
  const prisma = getPrisma();
  const block = await prisma.datingBlock.findFirst({
    where: {
      OR: [
        { blockerAccountId: accountAId, blockedAccountId: accountBId },
        { blockerAccountId: accountBId, blockedAccountId: accountAId },
      ],
    },
  });
  return !!block;
}

export async function unmatchAccounts(initiatorAccountId: string, otherAccountId: string) {
  const [accountAId, accountBId] = normalizePair(initiatorAccountId, otherAccountId);
  await getPrisma().datingMatch.updateMany({
    where: { accountAId, accountBId, status: "active" },
    data: {
      status: "unmatched",
      unmatchedAt: new Date(),
      unmatchedByAccountId: initiatorAccountId,
    },
  });
}

export async function unmatchByMatchId(matchId: string, initiatorAccountId: string) {
  const match = await getPrisma().datingMatch.findUnique({ where: { id: matchId } });
  if (!match || match.status !== "active") return;
  if (match.accountAId !== initiatorAccountId && match.accountBId !== initiatorAccountId) return;
  await getPrisma().datingMatch.update({
    where: { id: matchId },
    data: {
      status: "unmatched",
      unmatchedAt: new Date(),
      unmatchedByAccountId: initiatorAccountId,
    },
  });
}

export async function blockDatingUser(blockerAccountId: string, blockedAccountId: string) {
  if (blockerAccountId === blockedAccountId) return { ok: false as const, error: "Nie można zablokować siebie." };
  await getPrisma().datingBlock.upsert({
    where: { blockerAccountId_blockedAccountId: { blockerAccountId, blockedAccountId } },
    create: { blockerAccountId, blockedAccountId },
    update: {},
  });
  await unmatchAccounts(blockerAccountId, blockedAccountId);
  return { ok: true as const };
}

export async function reportDatingUser(reporterAccountId: string, reportedAccountId: string, reason: string) {
  const trimmed = reason.trim();
  if (!trimmed) return { ok: false as const, error: "Podaj powód zgłoszenia." };
  await getPrisma().datingReport.create({
    data: { reporterAccountId, reportedAccountId, reason: trimmed.slice(0, 500) },
  });
  await blockDatingUser(reporterAccountId, reportedAccountId);
  return { ok: true as const };
}
