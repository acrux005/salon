// lib/skinmatch/catalog.ts — katalog zabiegów (sync, hardcoded). Nie importuj treatmentsDb tutaj (używane w client).
import type { ProblemId, Treatment } from "./schema";
import { TREATMENTS_CATALOG_FULL } from "./treatmentsCatalog";

/** Pełny katalog (hardcoded) — używany gdy DB niedostępna lub do problemIdsToTreatmentIds (sync). */
export const TREATMENTS_CATALOG: Treatment[] = TREATMENTS_CATALOG_FULL;

export function getTreatmentById(id: string): Treatment | undefined {
  return TREATMENTS_CATALOG.find((t) => t.id === id);
}

export function getTreatmentsByIds(ids: string[]): Treatment[] {
  const map = new Map(TREATMENTS_CATALOG.map((t) => [t.id, t]));
  return ids.map((id) => map.get(id)).filter(Boolean) as Treatment[];
}

export function problemIdsToTreatmentIds(problemIds: ProblemId[]): string[] {
  const wanted = new Set(problemIds);
  const ids = new Set<string>();
  for (const t of TREATMENTS_CATALOG) {
    if (t.problemy.some((p) => wanted.has(p))) ids.add(t.id);
  }
  return Array.from(ids);
}
