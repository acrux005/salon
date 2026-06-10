import { getPrisma } from "@/lib/db";

const MOMENT_TTL_MS = 24 * 60 * 60 * 1000;

export type DailyMomentKind = "photo" | "audio" | "voice";

export function isMomentFresh(createdAt: Date): boolean {
  return Date.now() - createdAt.getTime() < MOMENT_TTL_MS;
}

export function resolveMomentKind(row: {
  momentType?: string | null;
  audioUrl?: string | null;
  url?: string;
}): DailyMomentKind {
  if (row.momentType === "voice") return "voice";
  if (row.momentType === "audio" || row.audioUrl) return "audio";
  return "photo";
}

export function momentKindLabel(kind: DailyMomentKind): string {
  switch (kind) {
    case "voice":
      return "fragment głosu";
    case "audio":
      return "dźwięk chwili";
    default:
      return "fragment dnia";
  }
}

export async function getActiveDailyMoment(accountId: string) {
  const since = new Date(Date.now() - MOMENT_TTL_MS);
  return getPrisma().datingDailyMoment.findFirst({
    where: { accountId, createdAt: { gte: since } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getActiveMomentsForAccounts(accountIds: string[]): Promise<
  Map<
    string,
    {
      id: string;
      url: string;
      secondaryUrl: string | null;
      audioUrl: string | null;
      momentType: DailyMomentKind;
      caption: string;
      capturedAt: Date;
      createdAt: Date;
    }
  >
> {
  if (!accountIds.length) return new Map();
  const since = new Date(Date.now() - MOMENT_TTL_MS);
  const rows = await getPrisma().datingDailyMoment.findMany({
    where: { accountId: { in: accountIds }, createdAt: { gte: since } },
    orderBy: { createdAt: "desc" },
  });
  const map = new Map<
    string,
    {
      id: string;
      url: string;
      secondaryUrl: string | null;
      audioUrl: string | null;
      momentType: DailyMomentKind;
      caption: string;
      capturedAt: Date;
      createdAt: Date;
    }
  >();
  for (const r of rows) {
    if (!map.has(r.accountId)) {
      map.set(r.accountId, {
        id: r.id,
        url: r.url,
        secondaryUrl: r.secondaryUrl,
        audioUrl: r.audioUrl ?? null,
        momentType: resolveMomentKind(r),
        caption: r.caption,
        capturedAt: r.capturedAt,
        createdAt: r.createdAt,
      });
    }
  }
  return map;
}

export async function hasPostedMomentToday(accountId: string): Promise<boolean> {
  const moment = await getActiveDailyMoment(accountId);
  return !!moment;
}
