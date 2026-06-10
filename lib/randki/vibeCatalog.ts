import { getPrisma } from "@/lib/db";
import type { VibeCatalogMood, VibeCatalogRow } from "@/lib/randki/vibeCatalogTypes";
import { parseVibeCatalogMood, VIBE_CATALOG_SEED } from "@/lib/randki/vibeCatalogConfig";

function mapRow(row: {
  id: string;
  mood: string;
  platform: string;
  externalId: string;
  url: string;
  title: string;
  embedUrl: string | null;
  thumbnailUrl: string | null;
  artistName: string | null;
}): VibeCatalogRow {
  return {
    id: row.id,
    mood: row.mood as VibeCatalogMood,
    platform: row.platform as VibeCatalogRow["platform"],
    externalId: row.externalId,
    url: row.url,
    title: row.title,
    embedUrl: row.embedUrl,
    thumbnailUrl: row.thumbnailUrl,
    artistName: row.artistName,
  };
}

export async function countVibeCatalog(): Promise<number> {
  return getPrisma().datingVibeCatalog.count({ where: { active: true } });
}

export async function listVibeCatalogForMood(mood: string | null | undefined): Promise<VibeCatalogRow[]> {
  const parsed = parseVibeCatalogMood(mood ?? null);
  const prisma = getPrisma();
  if (parsed) {
    const rows = await prisma.datingVibeCatalog.findMany({
      where: { active: true, mood: parsed },
      orderBy: [{ platform: "asc" }, { sortOrder: "asc" }, { title: "asc" }],
    });
    if (rows.length > 0) return rows.map(mapRow);
  }
  const rows = await prisma.datingVibeCatalog.findMany({
    where: { active: true },
    orderBy: [{ mood: "asc" }, { platform: "asc" }, { sortOrder: "asc" }],
    take: 40,
  });
  return rows.map(mapRow);
}

export async function getVibeCatalogById(id: string): Promise<VibeCatalogRow | null> {
  const row = await getPrisma().datingVibeCatalog.findFirst({ where: { id, active: true } });
  return row ? mapRow(row) : null;
}

export async function seedVibeCatalogIfEmpty(): Promise<number> {
  const prisma = getPrisma();
  const existing = await prisma.datingVibeCatalog.count();
  if (existing > 0) return 0;

  let sort = 0;
  for (const item of VIBE_CATALOG_SEED) {
    await prisma.datingVibeCatalog.upsert({
      where: { platform_externalId: { platform: item.platform, externalId: item.externalId } },
      create: {
        mood: item.mood,
        platform: item.platform,
        externalId: item.externalId,
        url: item.url,
        title: item.title,
        embedUrl: item.embedUrl,
        thumbnailUrl: item.thumbnailUrl,
        artistName: item.artistName,
        sortOrder: sort++,
        active: true,
        source: "seed",
        fetchedAt: new Date(),
      },
      update: {
        mood: item.mood,
        url: item.url,
        title: item.title,
        embedUrl: item.embedUrl,
        thumbnailUrl: item.thumbnailUrl,
        artistName: item.artistName,
        active: true,
        source: "seed",
        fetchedAt: new Date(),
      },
    });
  }
  return VIBE_CATALOG_SEED.length;
}
