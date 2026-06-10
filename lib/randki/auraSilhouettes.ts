/** Kontury Aury — 3 płaszczyzny (głowa / serce / korzenie) + PNG dla kobiety i mężczyzny. */

export type AuraSilhouetteKind = "woman" | "man" | "neutral";

export type AuraPlaneId = "head" | "heart" | "roots";

export type AuraPlaneDef = {
  id: AuraPlaneId;
  label: string;
  hint: string;
  maskPath: string;
  contourPath: string;
};

export type AuraKonturySet = {
  image: string;
  mask: string;
  aspect: number;
  planes: readonly AuraPlaneDef[];
};

const PLANE_META: Pick<AuraPlaneDef, "id" | "label" | "hint">[] = [
  {
    id: "head",
    label: "Głowa",
    hint: "Co dziś chodzi Ci po głowie.",
  },
  {
    id: "heart",
    label: "Serce",
    hint: "To, co czujesz pod skórą.",
  },
  {
    id: "roots",
    label: "Korzenie",
    hint: "Miejsca, wspomnienia, rzeczy które Cię trzymają.",
  },
];

function buildPlanes(prefix: string): readonly AuraPlaneDef[] {
  return PLANE_META.map((meta) => ({
    ...meta,
    maskPath: `/uploads/randki/${prefix}-mask-${meta.id}.png`,
    contourPath: `/uploads/randki/${prefix}-plane-${meta.id}.png`,
  }));
}

export const AURA_KONTURY_WOMAN: AuraKonturySet = {
  image: "/uploads/randki/kontury1.png",
  mask: "/uploads/randki/kontury1-mask.png",
  aspect: 660 / 1009,
  planes: buildPlanes("kontury1"),
};

export const AURA_KONTURY_MAN: AuraKonturySet = {
  image: "/uploads/randki/konturyman.png",
  mask: "/uploads/randki/konturyman-mask.png",
  aspect: 605 / 1065,
  planes: buildPlanes("konturyman"),
};

/** @deprecated użyj getAuraKonturySet */
export const AURA_KONTURY_ASPECT = AURA_KONTURY_WOMAN.aspect;
/** @deprecated użyj getAuraKonturySet */
export const AURA_KONTURY_IMAGE = AURA_KONTURY_WOMAN.image;
/** @deprecated użyj getAuraKonturySet */
export const AURA_KONTURY_MASK = AURA_KONTURY_WOMAN.mask;
/** @deprecated użyj getAuraKonturySet */
export const AURA_PLANES = AURA_KONTURY_WOMAN.planes;

export function auraSilhouetteKind(gender: string | null | undefined): AuraSilhouetteKind {
  if (gender === "woman") return "woman";
  if (gender === "man") return "man";
  return "neutral";
}

export function getAuraKonturySet(kind: AuraSilhouetteKind): AuraKonturySet {
  return kind === "man" ? AURA_KONTURY_MAN : AURA_KONTURY_WOMAN;
}

export function usesAuraKonturyImage(_kind: AuraSilhouetteKind): boolean {
  return true;
}

export function getAuraKonturyUrl(kind: AuraSilhouetteKind, basePath = ""): string {
  return `${basePath}${getAuraKonturySet(kind).image}`;
}

export function getAuraKonturyMaskUrl(kind: AuraSilhouetteKind, basePath = ""): string {
  return `${basePath}${getAuraKonturySet(kind).mask}`;
}

export function auraPlaneAssetUrl(basePath: string, path: string): string {
  return `${basePath}${path}`;
}

export type AuraPlaneImages = [string | null, string | null, string | null];

export function normalizeAuraPlaneImages(
  url1?: string | null,
  url2?: string | null,
  url3?: string | null
): AuraPlaneImages {
  return [url1 ?? null, url2 ?? null, url3 ?? null];
}

export function hasAnyAuraPlaneImage(urls: AuraPlaneImages): boolean {
  return urls.some(Boolean);
}

export function auraPlanesAreDistinct(urls: AuraPlaneImages): boolean {
  const filled = urls.filter((u) => !!u) as string[];
  return new Set(filled).size > 1;
}

export function pickAuraBaseUrl(urls: AuraPlaneImages): string | null {
  return urls[1] ?? urls[0] ?? urls[2] ?? null;
}

/** Wsteczna zgodność: jedno zdjęcie wypełnia brakujące płaszczyzny. */
export function resolveAuraPlaneImages(urls: AuraPlaneImages): AuraPlaneImages {
  const filled = [...urls] as AuraPlaneImages;
  const fallback = filled.find(Boolean) ?? null;
  if (!fallback) return filled;
  for (let i = 0; i < 3; i++) {
    if (!filled[i]) filled[i] = fallback;
  }
  return filled;
}

/** @deprecated stary SVG — zastąpiony konturyman.png */
export const AURA_SILHOUETTE_MAN =
  "M120 12 C82 12 52 50 52 96 C52 114 62 128 72 136 L58 152 C38 172 32 210 32 252 L32 320 L208 320 L208 252 C208 210 202 172 182 152 L168 136 C178 128 188 114 188 96 C188 50 158 12 120 12 Z";

/** @deprecated stary SVG — zastąpiony konturyman.png */
export const AURA_MAN_VIEWBOX = "0 0 240 320";

export const AURA_RULES_HINT =
  "Aura nie pokazuje twarzy. Pokazuje klimat.";
