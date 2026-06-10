export type ClinicTreatmentPricesResult = {
  prices: Record<string, number>;
  durations: Record<string, number>;
};

function parseRecord(o: unknown): Record<string, number> {
  if (!o || typeof o !== "object") return {};
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(o)) {
    if (typeof k === "string" && typeof v === "number" && !Number.isNaN(v)) out[k] = v;
  }
  return out;
}

/** Salon: reads prices/durations from clinic.kontakt JSON (treatmentPrices, treatmentDurations). */
export async function getClinicTreatmentPricesAsync(clinicId: string): Promise<ClinicTreatmentPricesResult> {
  try {
    const { getPrisma } = await import("@/lib/db");
    const prisma = getPrisma();
    const row = await prisma.clinic.findUnique({
      where: { id: clinicId },
      select: { kontakt: true },
    });
    if (!row?.kontakt) return { prices: {}, durations: {} };
    const o = JSON.parse(row.kontakt) as Record<string, unknown>;
    return {
      prices: parseRecord(o.treatmentPrices),
      durations: parseRecord(o.treatmentDurations),
    };
  } catch {
    return { prices: {}, durations: {} };
  }
}

/** Czas zabiegu w minutach: nadpis z gabinetu (kontakt.treatmentDurations) lub z katalogu. */
export async function getTreatmentDurationMinutes(clinicId: string, treatmentId: string): Promise<number> {
  const { durations } = await getClinicTreatmentPricesAsync(clinicId);
  const override = treatmentId ? durations[treatmentId] : undefined;
  if (override != null && override > 0) return Math.round(override);
  if (!treatmentId) return 30;
  const { getTreatmentsByIdsAsync } = await import("@/lib/skinmatch/treatmentsDb");
  const list = await getTreatmentsByIdsAsync([treatmentId]);
  const catalogMinutes = list[0]?.czas;
  if (catalogMinutes != null && catalogMinutes > 0) return Math.round(catalogMinutes);
  return 30;
}
