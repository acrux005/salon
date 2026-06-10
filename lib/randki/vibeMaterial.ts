import { getPrisma } from "@/lib/db";
import {
  MAX_VIBE_MATERIALS,
  VIBE_MATERIAL_KINDS,
  type VibeMaterialKind,
  type VibeMaterialPlatform,
  type VibeMaterialRow,
  type VibeMaterialSlotType,
} from "@/lib/randki/vibeMaterialTypes";
import { getVibeMaterialKindConfig, normalizeVibeMaterialKind } from "@/lib/randki/vibeMaterialSlots";

export {
  MAX_VIBE_MATERIALS,
  VIBE_MATERIAL_KINDS,
  type VibeMaterialKind,
  type VibeMaterialPlatform,
  type VibeMaterialRow,
  type VibeMaterialSlotType,
} from "@/lib/randki/vibeMaterialTypes";
export { TYPED_VIBE_SLOTS } from "@/lib/randki/vibeMaterialTypes";

const PLATFORMS = new Set<VibeMaterialPlatform>(["youtube", "spotify", "tmdb", "link", "text"]);

export function parseVibeMaterialSlotType(value: unknown): VibeMaterialKind | null {
  if (typeof value !== "string") return null;
  return normalizeVibeMaterialKind(value);
}

export function detectPlatform(url: string): Exclude<VibeMaterialPlatform, "text"> {
  if (/youtube\.com|youtu\.be/i.test(url)) return "youtube";
  if (/open\.spotify\.com|spotify\.com/i.test(url)) return "spotify";
  if (/themoviedb\.org/i.test(url)) return "tmdb";
  return "link";
}

export function extractYouTubeId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1).split("/")[0] || null;
    if (u.searchParams.get("v")) return u.searchParams.get("v");
    const embed = u.pathname.match(/\/embed\/([^/?]+)/);
    if (embed) return embed[1];
    const shorts = u.pathname.match(/\/shorts\/([^/?]+)/);
    if (shorts) return shorts[1];
  } catch {
    return null;
  }
  return null;
}

export function spotifyEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    const match = u.pathname.match(/\/(track|album|playlist|episode|show)\/([a-zA-Z0-9]+)/);
    if (!match) return null;
    return `https://open.spotify.com/embed/${match[1]}/${match[2]}?utm_source=randka`;
  } catch {
    return null;
  }
}

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

async function fetchOpenGraph(url: string): Promise<{ title: string; thumbnailUrl: string | null }> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "RandkaOdartBot/1.0 (+https://randka.odart.pl)" },
      signal: AbortSignal.timeout(6000),
      redirect: "follow",
    });
    if (!res.ok) throw new Error("fetch failed");
    const html = await res.text();
    const ogTitle = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']*)["']/i)?.[1]
      ?? html.match(/<meta[^>]+content=["']([^"']*)["'][^>]+property=["']og:title["']/i)?.[1];
    const ogImage = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']*)["']/i)?.[1]
      ?? html.match(/<meta[^>]+content=["']([^"']*)["'][^>]+property=["']og:image["']/i)?.[1];
    const pageTitle = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1];
    return {
      title: decodeHtmlEntities(ogTitle ?? pageTitle ?? new URL(url).hostname),
      thumbnailUrl: ogImage ? decodeHtmlEntities(ogImage) : null,
    };
  } catch {
    try {
      return { title: new URL(url).hostname.replace(/^www\./, ""), thumbnailUrl: null };
    } catch {
      return { title: "Link", thumbnailUrl: null };
    }
  }
}

export async function resolveVibeMaterialFromUrl(url: string): Promise<{
  title: string;
  platform: Exclude<VibeMaterialPlatform, "text">;
  embedUrl: string | null;
  thumbnailUrl: string | null;
}> {
  const platform = detectPlatform(url);
  if (platform === "youtube") {
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
    try {
      const res = await fetch(oembedUrl, { signal: AbortSignal.timeout(6000) });
      if (res.ok) {
        const data = (await res.json()) as { title?: string; thumbnail_url?: string };
        const videoId = extractYouTubeId(url);
        return {
          title: data.title ?? "YouTube",
          platform,
          embedUrl: videoId ? `https://www.youtube.com/embed/${videoId}` : null,
          thumbnailUrl: data.thumbnail_url ?? null,
        };
      }
    } catch {
      /* fallback */
    }
    const videoId = extractYouTubeId(url);
    return {
      title: "YouTube",
      platform,
      embedUrl: videoId ? `https://www.youtube.com/embed/${videoId}` : null,
      thumbnailUrl: videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null,
    };
  }

  if (platform === "spotify") {
    const oembedUrl = `https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`;
    try {
      const res = await fetch(oembedUrl, { signal: AbortSignal.timeout(6000) });
      if (res.ok) {
        const data = (await res.json()) as { title?: string; thumbnail_url?: string };
        return {
          title: data.title ?? "Spotify",
          platform,
          embedUrl: spotifyEmbedUrl(url),
          thumbnailUrl: data.thumbnail_url ?? null,
        };
      }
    } catch {
      /* fallback */
    }
    return { title: "Spotify", platform, embedUrl: spotifyEmbedUrl(url), thumbnailUrl: null };
  }

  const og = await fetchOpenGraph(url);
  return { title: og.title, platform: platform === "tmdb" ? "tmdb" : "link", embedUrl: null, thumbnailUrl: og.thumbnailUrl };
}

function mapRow(row: {
  id: string;
  url: string | null;
  title: string;
  platform: string;
  embedUrl: string | null;
  thumbnailUrl: string | null;
  caption: string;
  slotType: string;
  sortOrder: number;
}): VibeMaterialRow {
  const platform = PLATFORMS.has(row.platform as VibeMaterialPlatform)
    ? (row.platform as VibeMaterialPlatform)
    : "link";
  const kind = normalizeVibeMaterialKind(row.slotType) ?? "mood";
  return {
    id: row.id,
    url: row.url,
    title: row.title,
    platform,
    embedUrl: row.embedUrl,
    thumbnailUrl: row.thumbnailUrl,
    caption: row.caption,
    slotType: kind,
    sortOrder: row.sortOrder,
  };
}

export async function listVibeMaterials(accountId: string): Promise<VibeMaterialRow[]> {
  const rows = await getPrisma().datingVibeMaterial.findMany({
    where: { accountId },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return rows.map(mapRow);
}

export async function getVibeMaterialsForAccounts(accountIds: string[]): Promise<Map<string, VibeMaterialRow[]>> {
  if (accountIds.length === 0) return new Map();
  const rows = await getPrisma().datingVibeMaterial.findMany({
    where: { accountId: { in: accountIds } },
    orderBy: { sortOrder: "asc" },
  });
  const map = new Map<string, VibeMaterialRow[]>();
  for (const row of rows) {
    const list = map.get(row.accountId) ?? [];
    list.push(mapRow(row));
    map.set(row.accountId, list);
  }
  return map;
}

export function validateVibeMaterialInput(input: {
  kind: VibeMaterialKind;
  url?: string | null;
  textQuote?: string | null;
  caption: string;
}): { ok: true; url: string | null; textQuote: string | null; caption: string } | { ok: false; error: string } {
  const cfg = getVibeMaterialKindConfig(input.kind);
  const caption = input.caption.trim();
  const url = input.url?.trim() || null;
  const textQuote = input.textQuote?.trim() || null;

  if (input.kind === "mood") {
    if (!textQuote) return { ok: false, error: "Wpisz krótki fragment — jedno zdanie w zupełności wystarczy." };
    if (textQuote.length < 6) return { ok: false, error: "Jeszcze kilka słów — np. „nocny spacer po deszczu”." };
    if (textQuote.length > 400) return { ok: false, error: "Fragment może mieć maks. 400 znaków." };
    return { ok: true, url: null, textQuote, caption: "" };
  }

  if (input.kind === "quote") {
    if (!textQuote) return { ok: false, error: "Wpisz cytat albo zdanie które do Ciebie trafia." };
    if (textQuote.length < 3) return { ok: false, error: "Cytat jest za krótki." };
    if (textQuote.length > 400) return { ok: false, error: "Cytat może mieć maks. 400 znaków." };
    if (caption.length > 320) return { ok: false, error: "Opis może mieć maks. 320 znaków." };
    return { ok: true, url: null, textQuote, caption };
  }

  if (caption.length < 6) return { ok: false, error: "Jedno proste zdanie wystarczy — np. „nocny spacer po deszczu”." };
  if (caption.length > 320) return { ok: false, error: "Opis może mieć maks. 320 znaków." };

  if (input.kind === "book") {
    if (!textQuote) return { ok: false, error: "Podaj tytuł i autora (np. Mały Książę — Saint-Exupéry)." };
    if (textQuote.length < 3) return { ok: false, error: "Tytuł jest za krótki." };
    if (textQuote.length > 400) return { ok: false, error: "Tytuł może mieć maks. 400 znaków." };
    if (url) {
      try {
        const parsed = new URL(url);
        if (!["http:", "https:"].includes(parsed.protocol)) return { ok: false, error: "Dozwolone są tylko linki http/https." };
      } catch {
        return { ok: false, error: "Nieprawidłowy adres URL." };
      }
    }
    return { ok: true, url, textQuote, caption };
  }

  if (cfg?.allowsQuote && !cfg.allowsLink && !url) {
    if (!textQuote) return { ok: false, error: "Wpisz cytat." };
    if (textQuote.length < 3) return { ok: false, error: "Cytat jest za krótki." };
    if (textQuote.length > 400) return { ok: false, error: "Cytat może mieć maks. 400 znaków." };
    return { ok: true, url: null, textQuote, caption };
  }

  if (!url && !textQuote) return { ok: false, error: "Podaj link, wybierz z katalogu albo wpisz tekst." };
  if (url && textQuote) return { ok: false, error: "Wybierz link albo tekst — nie oba naraz." };

  if (textQuote) {
    if (textQuote.length < 3) return { ok: false, error: "Tekst jest za krótki." };
    if (textQuote.length > 400) return { ok: false, error: "Tekst może mieć maks. 400 znaków." };
    return { ok: true, url: null, textQuote, caption };
  }

  if (url) {
    try {
      const parsed = new URL(url);
      if (!["http:", "https:"].includes(parsed.protocol)) return { ok: false, error: "Dozwolone są tylko linki http/https." };
    } catch {
      return { ok: false, error: "Nieprawidłowy adres URL." };
    }
    return { ok: true, url, textQuote: null, caption };
  }

  return { ok: false, error: "Uzupełnij materiał." };
}

async function findKindConflict(accountId: string, kind: VibeMaterialKind, excludeId?: string) {
  const prisma = getPrisma();
  const legacyTypes = [
    kind,
    ...(kind === "music" ? ["song", "playlist", "anthem"] : []),
    ...(kind === "mood" ? ["mood_today", "define", "place", "moment"] : []),
    ...(kind === "youtube" ? [] : []),
  ];
  return prisma.datingVibeMaterial.findFirst({
    where: {
      accountId,
      slotType: { in: legacyTypes },
      ...(excludeId ? { id: { not: excludeId } } : {}),
    },
  });
}

export async function saveVibeMaterial(
  accountId: string,
  kind: VibeMaterialKind,
  input: { url?: string | null; textQuote?: string | null; caption: string },
  materialId?: string | null
): Promise<{ ok: true; material: VibeMaterialRow } | { ok: false; error: string }> {
  if (!VIBE_MATERIAL_KINDS.includes(kind)) return { ok: false, error: "Nieprawidłowy typ klimatu." };

  const validated = validateVibeMaterialInput({ kind, ...input });
  if (!validated.ok) return validated;

  const prisma = getPrisma();
  let existing = materialId
    ? await prisma.datingVibeMaterial.findFirst({ where: { id: materialId, accountId } })
    : null;

  if (!existing) {
    const conflict = await findKindConflict(accountId, kind);
    if (conflict) return { ok: false, error: "Masz już ten typ klimatu — edytuj istniejącą kartę." };
    const count = await prisma.datingVibeMaterial.count({ where: { accountId } });
    if (count >= MAX_VIBE_MATERIALS) {
      return { ok: false, error: `Możesz dodać maks. ${MAX_VIBE_MATERIALS} klimaty — usuń coś, by dodać nowe.` };
    }
  }

  let title = validated.textQuote ?? "";
  let platform: string = "text";
  let embedUrl: string | null = null;
  let thumbnailUrl: string | null = null;
  const url = validated.url;

  if (kind === "book") {
    title = validated.textQuote ?? "";
    platform = url ? "link" : "text";
    if (url) {
      const meta = await resolveVibeMaterialFromUrl(url);
      thumbnailUrl = meta.thumbnailUrl;
    }
  } else if (url) {
    const meta = await resolveVibeMaterialFromUrl(url);
    title = meta.title;
    platform = meta.platform;
    embedUrl = meta.embedUrl;
    thumbnailUrl = meta.thumbnailUrl;
  }

  const sortOrder = existing?.sortOrder ?? (await prisma.datingVibeMaterial.count({ where: { accountId } }));

  const data = {
    url,
    title,
    platform,
    embedUrl,
    thumbnailUrl,
    caption: validated.caption,
    slotType: kind,
    sortOrder,
  };

  const saved = existing
    ? await prisma.datingVibeMaterial.update({ where: { id: existing.id }, data })
    : await prisma.datingVibeMaterial.create({ data: { accountId, ...data } });

  return { ok: true, material: mapRow(saved) };
}

/** @deprecated — użyj saveVibeMaterial */
export async function upsertVibeMaterialSlot(
  accountId: string,
  slotType: VibeMaterialSlotType,
  input: { url?: string | null; textQuote?: string | null; caption: string }
): Promise<{ ok: true; material: VibeMaterialRow } | { ok: false; error: string }> {
  const kind = normalizeVibeMaterialKind(slotType);
  if (!kind) return { ok: false, error: "Nieprawidłowy typ klimatu." };
  const prisma = getPrisma();
  const existing = await prisma.datingVibeMaterial.findFirst({
    where: {
      accountId,
      slotType: {
        in: [
          slotType,
          kind,
          ...(kind === "music" ? ["song", "playlist", "anthem"] : []),
          ...(kind === "mood" ? ["mood_today", "define", "place", "moment"] : []),
        ],
      },
    },
  });
  return saveVibeMaterial(accountId, kind, input, existing?.id);
}

export async function saveVibeMaterialFromCatalog(
  accountId: string,
  kind: VibeMaterialKind,
  catalogId: string,
  caption: string,
  materialId?: string | null
): Promise<{ ok: true; material: VibeMaterialRow } | { ok: false; error: string }> {
  if (!["music", "film", "youtube", "mood"].includes(kind)) {
    return { ok: false, error: "Katalog dostępny dla muzyki, filmu lub sceny YouTube." };
  }

  const trimmed = caption.trim();
  if (trimmed.length < 6) return { ok: false, error: "Jedno proste zdanie wystarczy — np. „nocny spacer po deszczu”." };
  if (trimmed.length > 320) return { ok: false, error: "Opis może mieć maks. 320 znaków." };

  const { getVibeCatalogById } = await import("@/lib/randki/vibeCatalog");
  const catalog = await getVibeCatalogById(catalogId);
  if (!catalog) return { ok: false, error: "Nie znaleziono pozycji w katalogu." };

  if (kind === "film" && catalog.platform !== "tmdb") {
    return { ok: false, error: "Do filmu wybierz pozycję z katalogu TMDB." };
  }
  if (kind === "music" && catalog.platform !== "spotify") {
    return { ok: false, error: "Do muzyki wybierz utwór z katalogu Spotify." };
  }
  if (kind === "youtube" && catalog.platform !== "youtube") {
    return { ok: false, error: "Wybierz scenę z katalogu YouTube." };
  }

  const platform: VibeMaterialPlatform =
    catalog.platform === "spotify" ? "spotify" : catalog.platform === "tmdb" ? "tmdb" : "youtube";

  const prisma = getPrisma();
  let existing = materialId
    ? await prisma.datingVibeMaterial.findFirst({ where: { id: materialId, accountId } })
    : null;

  if (!existing) {
    const conflict = await findKindConflict(accountId, kind);
    if (conflict) return { ok: false, error: "Masz już ten typ klimatu — edytuj istniejącą kartę." };
    const count = await prisma.datingVibeMaterial.count({ where: { accountId } });
    if (count >= MAX_VIBE_MATERIALS) {
      return { ok: false, error: `Możesz dodać maks. ${MAX_VIBE_MATERIALS} klimaty.` };
    }
  }

  const title =
    catalog.platform === "tmdb"
      ? catalog.title
      : catalog.artistName
        ? `${catalog.title} — ${catalog.artistName}`
        : catalog.title;

  const sortOrder = existing?.sortOrder ?? (await prisma.datingVibeMaterial.count({ where: { accountId } }));

  const data = {
    url: catalog.url,
    title,
    platform,
    embedUrl: catalog.embedUrl,
    thumbnailUrl: catalog.thumbnailUrl,
    caption: trimmed,
    slotType: kind,
    sortOrder,
  };

  const saved = existing
    ? await prisma.datingVibeMaterial.update({ where: { id: existing.id }, data })
    : await prisma.datingVibeMaterial.create({ data: { accountId, ...data } });

  return { ok: true, material: mapRow(saved) };
}

export async function saveVibeMaterialFromSpotify(
  accountId: string,
  kind: VibeMaterialKind,
  hit: import("@/lib/randki/spotifySearch").SpotifySearchHit,
  caption: string,
  materialId?: string | null
): Promise<{ ok: true; material: VibeMaterialRow } | { ok: false; error: string }> {
  if (kind !== "music") {
    return { ok: false, error: "Wyszukiwanie Spotify dotyczy muzyki." };
  }

  const trimmed = caption.trim();
  if (trimmed.length < 6) return { ok: false, error: "Jedno proste zdanie wystarczy — np. „nocny spacer po deszczu”." };
  if (trimmed.length > 320) return { ok: false, error: "Opis może mieć maks. 320 znaków." };

  const prisma = getPrisma();
  let existing = materialId
    ? await prisma.datingVibeMaterial.findFirst({ where: { id: materialId, accountId } })
    : null;

  if (!existing) {
    const conflict = await findKindConflict(accountId, kind);
    if (conflict) return { ok: false, error: "Masz już ten typ klimatu — edytuj istniejącą kartę." };
    const count = await prisma.datingVibeMaterial.count({ where: { accountId } });
    if (count >= MAX_VIBE_MATERIALS) {
      return { ok: false, error: `Możesz dodać maks. ${MAX_VIBE_MATERIALS} klimaty.` };
    }
  }

  const title = hit.artistName ? `${hit.title} — ${hit.artistName}` : hit.title;
  const sortOrder = existing?.sortOrder ?? (await prisma.datingVibeMaterial.count({ where: { accountId } }));

  const data = {
    url: hit.url,
    title,
    platform: "spotify" as const,
    embedUrl: hit.embedUrl,
    thumbnailUrl: hit.thumbnailUrl,
    caption: trimmed,
    slotType: kind,
    sortOrder,
  };

  const saved = existing
    ? await prisma.datingVibeMaterial.update({ where: { id: existing.id }, data })
    : await prisma.datingVibeMaterial.create({ data: { accountId, ...data } });

  return { ok: true, material: mapRow(saved) };
}

export async function saveVibeMaterialFromTmdb(
  accountId: string,
  kind: VibeMaterialKind,
  hit: import("@/lib/randki/tmdbSearch").TmdbSearchHit,
  caption: string,
  materialId?: string | null
): Promise<{ ok: true; material: VibeMaterialRow } | { ok: false; error: string }> {
  if (kind !== "film") return { ok: false, error: "Wyszukiwanie TMDB dotyczy filmów." };

  const trimmed = caption.trim();
  if (trimmed.length < 6) return { ok: false, error: "Jedno proste zdanie wystarczy — np. „oglądam w deszczu”." };
  if (trimmed.length > 320) return { ok: false, error: "Opis może mieć maks. 320 znaków." };

  const prisma = getPrisma();
  let existing = materialId
    ? await prisma.datingVibeMaterial.findFirst({ where: { id: materialId, accountId } })
    : null;

  if (!existing) {
    const conflict = await findKindConflict(accountId, kind);
    if (conflict) return { ok: false, error: "Masz już ten typ klimatu — edytuj istniejącą kartę." };
    const count = await prisma.datingVibeMaterial.count({ where: { accountId } });
    if (count >= MAX_VIBE_MATERIALS) {
      return { ok: false, error: `Możesz dodać maks. ${MAX_VIBE_MATERIALS} klimaty.` };
    }
  }

  const title = hit.year ? `${hit.title} (${hit.year})` : hit.title;
  const sortOrder = existing?.sortOrder ?? (await prisma.datingVibeMaterial.count({ where: { accountId } }));

  const data = {
    url: hit.url,
    title,
    platform: "tmdb" as const,
    embedUrl: null,
    thumbnailUrl: hit.thumbnailUrl,
    caption: trimmed,
    slotType: kind,
    sortOrder,
  };

  const saved = existing
    ? await prisma.datingVibeMaterial.update({ where: { id: existing.id }, data })
    : await prisma.datingVibeMaterial.create({ data: { accountId, ...data } });

  return { ok: true, material: mapRow(saved) };
}

export async function saveVibeMaterialFromYoutube(
  accountId: string,
  kind: VibeMaterialKind,
  hit: import("@/lib/randki/youtubeSearch").YoutubeSearchHit,
  caption: string,
  materialId?: string | null
): Promise<{ ok: true; material: VibeMaterialRow } | { ok: false; error: string }> {
  if (kind !== "youtube") return { ok: false, error: "Wyszukiwanie YouTube dotyczy scen wideo." };

  const trimmed = caption.trim();
  if (trimmed.length < 6) return { ok: false, error: "Jedno proste zdanie wystarczy — np. „wracam do tego wieczorem”." };
  if (trimmed.length > 320) return { ok: false, error: "Opis może mieć maks. 320 znaków." };

  const prisma = getPrisma();
  let existing = materialId
    ? await prisma.datingVibeMaterial.findFirst({ where: { id: materialId, accountId } })
    : null;

  if (!existing) {
    const conflict = await findKindConflict(accountId, kind);
    if (conflict) return { ok: false, error: "Masz już ten typ klimatu — edytuj istniejącą kartę." };
    const count = await prisma.datingVibeMaterial.count({ where: { accountId } });
    if (count >= MAX_VIBE_MATERIALS) {
      return { ok: false, error: `Możesz dodać maks. ${MAX_VIBE_MATERIALS} klimaty.` };
    }
  }

  const title = hit.channelTitle ? `${hit.title} — ${hit.channelTitle}` : hit.title;
  const sortOrder = existing?.sortOrder ?? (await prisma.datingVibeMaterial.count({ where: { accountId } }));

  const data = {
    url: hit.url,
    title,
    platform: "youtube" as const,
    embedUrl: hit.embedUrl,
    thumbnailUrl: hit.thumbnailUrl,
    caption: trimmed,
    slotType: kind,
    sortOrder,
  };

  const saved = existing
    ? await prisma.datingVibeMaterial.update({ where: { id: existing.id }, data })
    : await prisma.datingVibeMaterial.create({ data: { accountId, ...data } });

  return { ok: true, material: mapRow(saved) };
}

/** @deprecated */
export async function upsertVibeMaterialFromCatalog(
  accountId: string,
  slotType: VibeMaterialSlotType,
  catalogId: string,
  caption: string
): Promise<{ ok: true; material: VibeMaterialRow } | { ok: false; error: string }> {
  const kind = normalizeVibeMaterialKind(slotType);
  if (!kind) return { ok: false, error: "Nieprawidłowy typ klimatu." };
  const prisma = getPrisma();
  const existing = await prisma.datingVibeMaterial.findFirst({ where: { accountId, slotType: { in: [slotType, kind] } } });
  return saveVibeMaterialFromCatalog(accountId, kind, catalogId, caption, existing?.id);
}

export function filterCatalogForKind(
  catalog: import("@/lib/randki/vibeCatalogTypes").VibeCatalogRow[],
  kind: VibeMaterialKind
): import("@/lib/randki/vibeCatalogTypes").VibeCatalogRow[] {
  const cfg = getVibeMaterialKindConfig(kind);
  if (cfg?.catalog === "film") return catalog.filter((c) => c.platform === "tmdb");
  if (cfg?.catalog === "youtube") return catalog.filter((c) => c.platform === "youtube");
  if (cfg?.catalog === "music") return catalog.filter((c) => c.platform === "spotify" || c.platform === "youtube");
  return [];
}