import { getPrisma } from "@/lib/db";
import { AMBIENT_LOOP_SEC } from "@/lib/randki/ambientTracks";
import type { SharedListeningSource } from "@/lib/randki/sharedListening";

export type ListeningSessionPayload = {
  scopeKey: string;
  trackKey: string;
  title: string;
  platform: string;
  embedUrl: string | null;
  startedAt: string;
  loopSec: number;
  syncedSec: number;
};

export function listeningScopeForRoom(roomAccountId: string): string {
  return `room:${roomAccountId}`;
}

export function listeningScopeForMatch(matchId: string): string {
  return `match:${matchId}`;
}

function trackKeyFromSource(source: SharedListeningSource): string {
  return `${source.platform}:${source.title}:${source.embedUrl ?? "none"}`;
}

export function syncedPositionSec(startedAt: Date, loopSec: number, at = new Date()): number {
  const elapsed = Math.max(0, (at.getTime() - startedAt.getTime()) / 1000);
  return elapsed % loopSec;
}

export async function getOrCreateListeningSession(
  scopeKey: string,
  source: SharedListeningSource
): Promise<ListeningSessionPayload> {
  const prisma = getPrisma();
  const trackKey = trackKeyFromSource(source);
  const loopSec = source.platform === "ambient" ? AMBIENT_LOOP_SEC : 0;

  let row = await prisma.datingListeningSession.findUnique({ where: { scopeKey } });
  const now = new Date();

  if (!row || row.trackKey !== trackKey) {
    row = await prisma.datingListeningSession.upsert({
      where: { scopeKey },
      create: {
        scopeKey,
        trackKey,
        title: source.title,
        platform: source.platform,
        embedUrl: source.embedUrl,
        startedAt: now,
        loopSec,
      },
      update: {
        trackKey,
        title: source.title,
        platform: source.platform,
        embedUrl: source.embedUrl,
        startedAt: now,
        loopSec,
      },
    });
  }

  return {
    scopeKey: row.scopeKey,
    trackKey: row.trackKey,
    title: row.title,
    platform: row.platform,
    embedUrl: row.embedUrl,
    startedAt: row.startedAt.toISOString(),
    loopSec: row.loopSec,
    syncedSec: syncedPositionSec(row.startedAt, row.loopSec || AMBIENT_LOOP_SEC, now),
  };
}

export async function getListeningSession(scopeKey: string): Promise<ListeningSessionPayload | null> {
  const row = await getPrisma().datingListeningSession.findUnique({ where: { scopeKey } });
  if (!row) return null;
  return {
    scopeKey: row.scopeKey,
    trackKey: row.trackKey,
    title: row.title,
    platform: row.platform,
    embedUrl: row.embedUrl,
    startedAt: row.startedAt.toISOString(),
    loopSec: row.loopSec,
    syncedSec: syncedPositionSec(row.startedAt, row.loopSec || AMBIENT_LOOP_SEC),
  };
}
