// Server-only: CRUD zabiegów z bazy (admin), mapowanie DB → typy.
import type { ProblemId, Treatment, TreatmentWithSeo, TreatmentFaqItem, ClinicOfferingTreatment } from "./schema";
import { getPrisma } from "@/lib/db";
import { TREATMENTS_CATALOG_FULL } from "./treatmentsCatalog";
import { LONG_DESCRIPTIONS } from "@/content/longDescriptions";
import { getAllClinicRecordsAsync } from "./clinics";
import { getClinicTreatmentPricesAsync } from "@/lib/clinicTreatmentPrices";

function parseProblemIds(json: string): ProblemId[] {
  try {
    const arr = JSON.parse(json);
    return Array.isArray(arr) ? (arr as ProblemId[]) : [];
  } catch {
    return [];
  }
}

function parseStringArray(json: string | null | undefined): string[] {
  if (json == null || json === "") return [];
  try {
    const arr = JSON.parse(json);
    return Array.isArray(arr) ? arr.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function parseFaq(json: string | null | undefined): TreatmentFaqItem[] {
  if (json == null || json === "") return [];
  try {
    const arr = JSON.parse(json);
    if (!Array.isArray(arr)) return [];
    return arr
      .filter((x): x is { question?: string; answer?: string } => x != null && typeof x === "object")
      .map((x) => ({ question: String(x.question ?? ""), answer: String(x.answer ?? "") }))
      .filter((x) => x.question.trim() || x.answer.trim());
  } catch {
    return [];
  }
}

type TreatmentRow = {
  id: string;
  nazwa: string;
  opis: string;
  problemIds: string;
  czas: number;
  cena_od: number;
  slug?: string | null;
  longDescription?: string | null;
  faq?: string | null;
  indications?: string | null;
  contraindications?: string | null;
  preparation?: string | null;
  heroImageUrl?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
};

function rowToTreatment(row: TreatmentRow): Treatment {
  return {
    id: row.id,
    nazwa: row.nazwa,
    opis: row.opis,
    problemy: parseProblemIds(row.problemIds),
    czas: row.czas,
    cena_od: row.cena_od,
  };
}

function rowToTreatmentWithSeo(row: TreatmentRow): TreatmentWithSeo {
  const base = rowToTreatment(row);
  return {
    ...base,
    slug: row.slug ?? undefined,
    longDescription: row.longDescription ?? undefined,
    faq: parseFaq(row.faq),
    indications: parseStringArray(row.indications),
    contraindications: parseStringArray(row.contraindications),
    preparation: row.preparation ?? undefined,
    heroImageUrl: row.heroImageUrl ?? undefined,
    metaTitle: row.metaTitle ?? undefined,
    metaDescription: row.metaDescription ?? undefined,
  };
}

/** zamow.odart.pl: brak modelu Treatment w DB. */
export async function getAllTreatmentsAsync(): Promise<Treatment[]> {
  return [];
}

/** zamow.odart.pl: tylko katalog (brak DB zabiegów). */
export async function getCatalogAsync(): Promise<Treatment[]> {
  return TREATMENTS_CATALOG_FULL;
}

/** zamow.odart.pl: tylko katalog. */
export async function getTreatmentsForAdminAsync(
  search?: string,
  problemId?: ProblemId
): Promise<Treatment[]> {
  let list = [...TREATMENTS_CATALOG_FULL];
  if (search?.trim()) {
    const q = search.trim().toLowerCase();
    list = list.filter((t) => t.nazwa.toLowerCase().includes(q) || t.id.toLowerCase().includes(q));
  }
  if (problemId) list = list.filter((t) => t.problemy.includes(problemId));
  return list;
}

/** zamow.odart.pl: z katalogu. */
export async function getTreatmentsByIdsAsync(ids: string[]): Promise<Treatment[]> {
  if (ids.length === 0) return [];
  const catalog = await getCatalogAsync();
  const map = new Map(catalog.map((t) => [t.id, t]));
  return ids.map((id) => map.get(id)).filter(Boolean) as Treatment[];
}

/** zamow.odart.pl: brak Clinic. */
export async function countClinicsUsingTreatment(_treatmentId: string): Promise<number> {
  return 0;
}

/** zamow.odart.pl: brak modelu Treatment. */
export async function createTreatmentAsync(_data: {
  id: string;
  nazwa: string;
  opis: string;
  problemy: ProblemId[];
  czas: number;
  cena_od: number;
}): Promise<Treatment | null> {
  return null;
}

/** zamow.odart.pl: brak modelu Treatment. */
export async function updateTreatmentAsync(
  _id: string,
  _data: { nazwa?: string; opis?: string; problemy?: ProblemId[]; czas?: number; cena_od?: number }
): Promise<Treatment | null> {
  return null;
}

/** zamow.odart.pl: brak modelu Treatment. */
export async function deleteTreatmentAsync(_id: string): Promise<{ ok: boolean; inUse?: number }> {
  return { ok: false };
}

const idFromSlug = (slugOrId: string) => slugOrId.trim().replace(/-/g, "_").toLowerCase();

/** Katalog + długie opisy z content/longDescriptions.ts. */
export async function getTreatmentBySlugOrIdAsync(slugOrId: string): Promise<TreatmentWithSeo | null> {
  const normalizedId = idFromSlug(slugOrId);
  const catalog = await getCatalogAsync();
  const byId = catalog.find((t) => t.id === slugOrId.trim() || t.id === normalizedId);
  if (!byId) return null;
  const longDescription = LONG_DESCRIPTIONS[byId.id]?.trim() ?? undefined;
  return {
    ...byId,
    slug: slugOrId.trim().includes("-") ? slugOrId.trim() : undefined,
    longDescription: longDescription || undefined,
  };
}

/** Salon: gabinety oferujące dany zabieg (z bazy, z cenami/czasem z gabinetu lub katalogu). */
export async function getClinicsOfferingTreatmentAsync(
  treatmentId: string,
  treatmentCenaOd: number,
  treatmentCzas: number
): Promise<ClinicOfferingTreatment[]> {
  try {
    const clinics = await getAllClinicRecordsAsync();
    const offering = clinics.filter((c) => c.treatmentIds?.includes(treatmentId) ?? false);
    if (offering.length === 0) return [];

    const out: ClinicOfferingTreatment[] = await Promise.all(
      offering.map(async (c) => {
        const { prices, durations } = await getClinicTreatmentPricesAsync(c.id);
        const cenaOd = treatmentId && prices[treatmentId] != null ? prices[treatmentId] : treatmentCenaOd;
        const czasMin = treatmentId && durations[treatmentId] != null ? durations[treatmentId] : treatmentCzas;
        return {
          id: c.id,
          slug: c.slug,
          name: c.name,
          city: c.city,
          rating: c.rating ?? null,
          reviewCount: c.reviewCount ?? null,
          cenaOd,
          czasMin,
          avatarUrl: c.avatarUrl ?? undefined,
        };
      })
    );
    return out.sort((a, b) => a.name.localeCompare(b.name, "pl"));
  } catch {
    return [];
  }
}

/** zamow.odart.pl: tylko katalog. */
export async function getTreatmentSlugsForSitemapAsync(): Promise<string[]> {
  const catalog = await getCatalogAsync();
  return catalog.map((t) => t.id.replace(/_/g, "-"));
}
