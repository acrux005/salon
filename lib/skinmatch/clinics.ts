// lib/skinmatch/clinics.ts — server-safe (uses DB). Client: use clinicsSeed.
import type { ClinicRecord, ProblemId, QuizTag, WorkingHoursDay } from "./schema";
import { tagsToProblemIds } from "./schema";
import { getTreatmentsByIdsAsync } from "./treatmentsDb";
import { prismaClinicToRecord } from "./clinicDb";
import { CLINICS_SEED, getAllClinicRecords, getClinicBySlug } from "./clinicsSeed";

export { CLINICS_SEED, getAllClinicRecords, getClinicBySlug };

/** DB first (isPublished), fallback seed. City match is case-insensitive; accepts one city or a list. */
export async function getAllClinicRecordsAsync(
  city?: string | string[]
): Promise<ClinicRecord[]> {
  const cities = Array.isArray(city)
    ? city.map((c) => c.trim().toLowerCase()).filter(Boolean)
    : city?.trim()
      ? [city.trim().toLowerCase()]
      : [];

  try {
    const { getPrisma } = await import("@/lib/db");
    const prisma = getPrisma();
    const rows = await prisma.clinic.findMany({
      where: { isPublished: true },
      orderBy: { name: "asc" },
    });
    if (rows.length > 0) {
      const mapped = rows.map((r) =>
        prismaClinicToRecord(r as Parameters<typeof prismaClinicToRecord>[0])
      );
      if (cities.length === 0) return mapped;
      return mapped.filter((c) => cities.includes(c.city.toLowerCase()));
    }
  } catch {
    // no DB or not configured
  }
  if (cities.length === 0) return getAllClinicRecords();
  if (cities.length === 1) return getAllClinicRecords(cities[0]);
  const merged = new Map<string, ClinicRecord>();
  for (const c of cities) {
    for (const clinic of getAllClinicRecords(c)) merged.set(clinic.id, clinic);
  }
  return Array.from(merged.values()).sort((a, b) => a.name.localeCompare(b.name, "pl"));
}

/** Polecane na homepage — najpierw kompletniejsze profile (zdjęcie, opinie, specjalizacje). */
export async function getFeaturedClinicRecordsAsync(limit = 6): Promise<ClinicRecord[]> {
  const all = await getAllClinicRecordsAsync();
  const score = (c: ClinicRecord) =>
    (c.avatarUrl ? 4 : 0) +
    (c.specializations.length > 0 ? 2 : 0) +
    (c.reviewCount > 0 ? 3 : 0) +
    (c.rating || 0);
  return [...all]
    .sort((a, b) => score(b) - score(a) || b.reviewCount - a.reviewCount || a.name.localeCompare(b.name, "pl"))
    .slice(0, limit);
}

/** DB first, fallback seed. */
export async function getClinicBySlugAsync(slug: string): Promise<ClinicRecord | undefined> {
  try {
    const { getPrisma } = await import("@/lib/db");
    const prisma = getPrisma();
    const row = await prisma.clinic.findFirst({ where: { slug, isPublished: true } });
    if (row) return prismaClinicToRecord(row as Parameters<typeof prismaClinicToRecord>[0]);
  } catch {
    // no DB
  }
  return getClinicBySlug(slug);
}

/** Get clinic by ID (for panel — no isPublished filter). */
export async function getClinicByIdAsync(clinicId: string): Promise<ClinicRecord | null> {
  try {
    const { getPrisma } = await import("@/lib/db");
    const prisma = getPrisma();
    const row = await prisma.clinic.findUnique({ where: { id: clinicId } });
    return row ? prismaClinicToRecord(row as Parameters<typeof prismaClinicToRecord>[0]) : null;
  } catch {
    return null;
  }
}

/** Update clinic by slug (Prisma). */
export async function updateClinicBySlug(
  slug: string,
  patch: {
    slug?: string;
    name?: string;
    city?: string;
    description?: string;
    rating?: number;
    reviewCount?: number;
    specializations?: ProblemId[];
    matchingTags?: QuizTag[];
    treatmentIds?: string[];
    kontakt?: Record<string, unknown>;
    avatarUrl?: string | null;
    isPublished?: boolean;
    cosmoStaffId?: number | null;
    workingHours?: WorkingHoursDay[] | null;
    bookingPhoneOnly?: boolean;
  }
): Promise<ClinicRecord | null> {
  try {
    const { getPrisma } = await import("@/lib/db");
    const prisma = getPrisma();
    const existing = await prisma.clinic.findFirst({ where: { slug } });
    if (!existing) return null;
    const data: Record<string, unknown> = {};
    if (patch.slug !== undefined && patch.slug !== slug) {
      const taken = await prisma.clinic.findUnique({ where: { slug: patch.slug } });
      if (taken) return null;
      data.slug = patch.slug;
    }
    if (patch.name !== undefined) data.name = patch.name;
    if (patch.city !== undefined) data.city = patch.city;
    if (patch.description !== undefined) data.description = patch.description;
    if (patch.rating !== undefined) data.rating = patch.rating;
    if (patch.reviewCount !== undefined) data.reviewCount = patch.reviewCount;
    if (patch.specializations !== undefined) data.specializations = JSON.stringify(patch.specializations);
    if (patch.matchingTags !== undefined) data.matchingTags = JSON.stringify(patch.matchingTags);
    if (patch.treatmentIds !== undefined) data.treatmentIds = JSON.stringify(patch.treatmentIds);
    if (patch.kontakt !== undefined) data.kontakt = JSON.stringify(patch.kontakt);
    if (patch.avatarUrl !== undefined) data.avatarUrl = patch.avatarUrl;
    if (patch.isPublished !== undefined) data.isPublished = patch.isPublished;
    if (patch.cosmoStaffId !== undefined) data.cosmoStaffId = patch.cosmoStaffId;
    if (patch.workingHours !== undefined)
      data.workingHours = patch.workingHours === null ? null : JSON.stringify(patch.workingHours);
    if (patch.bookingPhoneOnly !== undefined) data.bookingPhoneOnly = patch.bookingPhoneOnly;
    const updated = await prisma.clinic.update({ where: { id: existing.id }, data: data as never });
    return prismaClinicToRecord(updated as Parameters<typeof prismaClinicToRecord>[0]);
  } catch {
    return null;
  }
}

export async function buildClinicDataFromRecord(record: ClinicRecord) {
  const treatments = await getTreatmentsByIdsAsync(record.treatmentIds);
  return {
    ...record,
    treatments,
  };
}

export type MatchingClinic = ClinicRecord & {
  matchScore: number; // number of matched ProblemIds
  matchedProblemIds: ProblemId[];
};

export async function findMatchingClinicsAsync(tags: QuizTag[], city?: string): Promise<MatchingClinic[]> {
  const problemIds = tagsToProblemIds(tags);
  const wanted = new Set(problemIds);

  const clinics = await getAllClinicRecordsAsync(city);
  const allIds = Array.from(new Set(clinics.flatMap((c) => c.treatmentIds)));
  const allTreatments = await getTreatmentsByIdsAsync(allIds);
  const treatmentMap = new Map(allTreatments.map((t) => [t.id, t]));

  const scored: MatchingClinic[] = clinics
    .map((c) => {
      const treatments = c.treatmentIds.map((id) => treatmentMap.get(id)).filter(Boolean) as import("./schema").Treatment[];
      const clinicProblems = new Set<ProblemId>();
      for (const t of treatments) for (const p of t.problemy) clinicProblems.add(p);

      const matched = Array.from(clinicProblems).filter((p) => wanted.has(p));

      return {
        ...c,
        matchScore: matched.length,
        matchedProblemIds: matched,
      };
    })
    .filter((c) => c.matchScore > 0)
    .sort((a, b) => {
      // ranking: score DESC, rating DESC, reviewCount DESC
      if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
      if (b.rating !== a.rating) return b.rating - a.rating;
      return b.reviewCount - a.reviewCount;
    });

  return scored.slice(0, 6);
}
