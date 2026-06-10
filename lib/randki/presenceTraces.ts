import { getPrisma } from "@/lib/db";
import { reactionById } from "@/lib/randki/presenceInteractions";
import { notifyPresenceResonance } from "@/lib/randki/notifications";

const TRACE_TTL_MS = 48 * 60 * 60 * 1000;

export type PresenceTraceRow = {
  id: string;
  traceLabel: string;
  reactionId: string;
  guestAlias: string | null;
  fromAccountId: string | null;
  targetType: string;
  momentId: string | null;
  replyToTraceId: string | null;
  createdAt: Date;
  isReply: boolean;
};

export type PresenceDialogEntry = PresenceTraceRow & {
  replies: PresenceTraceRow[];
  canReply: boolean;
};

export type RecordTraceInput = {
  roomAccountId: string;
  fromAccountId: string | null;
  guestAlias?: string | null;
  reactionId: string;
  targetType?: "room" | "moment";
  momentId?: string | null;
  replyToTraceId?: string | null;
};

function mapRow(r: {
  id: string;
  traceLabel: string;
  reactionId: string;
  guestAlias: string | null;
  fromAccountId: string | null;
  targetType: string;
  momentId: string | null;
  replyToTraceId: string | null;
  createdAt: Date;
}): PresenceTraceRow {
  return {
    id: r.id,
    traceLabel: r.traceLabel,
    reactionId: r.reactionId,
    guestAlias: r.guestAlias,
    fromAccountId: r.fromAccountId,
    targetType: r.targetType,
    momentId: r.momentId,
    replyToTraceId: r.replyToTraceId,
    createdAt: r.createdAt,
    isReply: !!r.replyToTraceId,
  };
}

export async function recordPresenceTrace(input: RecordTraceInput): Promise<PresenceTraceRow | null> {
  const reaction = reactionById(input.reactionId);
  if (!reaction) return null;

  const prisma = getPrisma();

  if (input.replyToTraceId) {
    const parent = await prisma.datingPresenceTrace.findUnique({ where: { id: input.replyToTraceId } });
    if (!parent) return null;
    if (input.fromAccountId && parent.fromAccountId === input.fromAccountId) {
      return null;
    }
  }

  if (input.momentId) {
    const moment = await prisma.datingDailyMoment.findUnique({ where: { id: input.momentId } });
    if (!moment || moment.accountId !== input.roomAccountId) return null;
  }

  const row = await prisma.datingPresenceTrace.create({
    data: {
      roomAccountId: input.roomAccountId,
      fromAccountId: input.fromAccountId,
      guestAlias: input.guestAlias ?? null,
      reactionId: input.reactionId,
      traceLabel: reaction.trace,
      targetType: input.momentId ? "moment" : input.targetType ?? "room",
      momentId: input.momentId ?? null,
      replyToTraceId: input.replyToTraceId ?? null,
    },
  });

  if (input.fromAccountId && input.roomAccountId !== input.fromAccountId) {
    notifyPresenceResonance(input.roomAccountId, input.fromAccountId, {
      isReply: !!input.replyToTraceId,
      isMoment: !!input.momentId,
    }).catch(() => {});
  }

  return mapRow(row);
}

export async function listRecentPresenceTraces(roomAccountId: string, limit = 8): Promise<PresenceTraceRow[]> {
  const since = new Date(Date.now() - TRACE_TTL_MS);
  const rows = await getPrisma().datingPresenceTrace.findMany({
    where: { roomAccountId, createdAt: { gte: since }, replyToTraceId: null },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return rows.map(mapRow);
}

export async function listPresenceDialog(
  roomAccountId: string,
  viewerAccountId: string | null,
  limit = 6
): Promise<PresenceDialogEntry[]> {
  const since = new Date(Date.now() - TRACE_TTL_MS);
  const prisma = getPrisma();
  const roots = await prisma.datingPresenceTrace.findMany({
    where: { roomAccountId, createdAt: { gte: since }, replyToTraceId: null },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  if (!roots.length) return [];

  const rootIds = roots.map((r) => r.id);
  const replies = await prisma.datingPresenceTrace.findMany({
    where: { replyToTraceId: { in: rootIds }, createdAt: { gte: since } },
    orderBy: { createdAt: "asc" },
  });
  const repliesByRoot = new Map<string, PresenceTraceRow[]>();
  for (const r of replies) {
    if (!r.replyToTraceId) continue;
    const list = repliesByRoot.get(r.replyToTraceId) ?? [];
    list.push(mapRow(r));
    repliesByRoot.set(r.replyToTraceId, list);
  }

  return roots.map((root) => {
    const mapped = mapRow(root);
    const isOwn = viewerAccountId && root.fromAccountId === viewerAccountId;
    return {
      ...mapped,
      replies: repliesByRoot.get(root.id) ?? [],
      canReply: !!viewerAccountId && !isOwn && root.fromAccountId !== viewerAccountId,
    };
  });
}

export async function listHostPresenceInbox(hostAccountId: string, limit = 8): Promise<PresenceDialogEntry[]> {
  return listPresenceDialog(hostAccountId, hostAccountId, limit);
}

export async function latestMomentResonance(momentId: string): Promise<string | null> {
  const since = new Date(Date.now() - TRACE_TTL_MS);
  const row = await getPrisma().datingPresenceTrace.findFirst({
    where: { momentId, targetType: "moment", createdAt: { gte: since } },
    orderBy: { createdAt: "desc" },
  });
  return row?.traceLabel ?? null;
}

export async function countPresenceTracesToday(roomAccountId: string): Promise<number> {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  return getPrisma().datingPresenceTrace.count({
    where: { roomAccountId, createdAt: { gte: start } },
  });
}

export async function listLatestTraceByRooms(roomAccountIds: string[]): Promise<Map<string, string>> {
  if (!roomAccountIds.length) return new Map();
  const since = new Date(Date.now() - TRACE_TTL_MS);
  const prisma = getPrisma();
  const rows = await prisma.datingPresenceTrace.findMany({
    where: { roomAccountId: { in: roomAccountIds }, createdAt: { gte: since }, replyToTraceId: null },
    orderBy: { createdAt: "desc" },
  });
  const map = new Map<string, string>();
  for (const r of rows) {
    if (!map.has(r.roomAccountId)) map.set(r.roomAccountId, r.traceLabel);
  }
  return map;
}

export async function openPrivateSpace(matchId: string, accountId: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const prisma = getPrisma();
  const match = await prisma.datingMatch.findUnique({ where: { id: matchId } });
  if (!match || match.status !== "active") return { ok: false, error: "Brak dopasowania." };
  if (match.accountAId !== accountId && match.accountBId !== accountId) {
    return { ok: false, error: "Brak dostępu." };
  }

  const msgCount = await prisma.datingMessage.count({ where: { matchId } });
  const traceCount = await prisma.datingPresenceTrace.count({
    where: {
      OR: [
        { roomAccountId: match.accountAId, fromAccountId: match.accountBId },
        { roomAccountId: match.accountBId, fromAccountId: match.accountAId },
      ],
    },
  });
  if (msgCount < 1 && traceCount < 1 && !match.privateSpaceAt) {
    return { ok: false, error: "Najpierw zostawcie ślad obecności w pokoju." };
  }

  if (!match.privateSpaceAt) {
    await prisma.datingMatch.update({
      where: { id: matchId },
      data: { privateSpaceAt: new Date() },
    });
  }
  return { ok: true };
}

export async function getPrivateSpaceMeta(matchId: string, accountId: string) {
  const prisma = getPrisma();
  const match = await prisma.datingMatch.findUnique({ where: { id: matchId } });
  if (!match || match.status !== "active") return null;
  if (match.accountAId !== accountId && match.accountBId !== accountId) return null;
  const otherId = match.accountAId === accountId ? match.accountBId : match.accountAId;
  const other = await prisma.datingProfile.findUnique({ where: { accountId: otherId } });
  if (!other) return null;
  return { match, otherId, other, privateSpaceAt: match.privateSpaceAt };
}
