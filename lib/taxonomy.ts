export type CategoryOut = { slug: string; name: string; order: number; subcategories: SubcategoryOut[] };
export type SubcategoryOut = { slug: string; name: string; order: number };
export type TagOut = { slug: string; name: string };

export type TaxonomyOut = { categories: CategoryOut[]; tags: TagOut[] };

/** Stub: zamow.odart.pl nie ma taksonomii zabiegów. */
export async function getTaxonomyAsync(): Promise<TaxonomyOut> {
  return { categories: [], tags: [] };
}

export type TreatmentTaxonomyOut = {
  categorySlug: string | null;
  subcategorySlug: string | null;
  tagSlugs: string[];
};

export async function getTreatmentTaxonomyAsync(_treatmentId: string): Promise<TreatmentTaxonomyOut> {
  return { categorySlug: null, subcategorySlug: null, tagSlugs: [] };
}

export async function getTreatmentIdsByCategorySlugAsync(_categorySlug: string): Promise<string[]> {
  return [];
}

export async function getTreatmentIdsBySubcategorySlugAsync(_subcategorySlug: string): Promise<string[]> {
  return [];
}

export async function getTreatmentsTaxonomyMapAsync(
  treatmentIds: string[]
): Promise<Map<string, { categorySlug: string | null; subcategorySlug: string | null; tagSlugs: string[] }>> {
  const map = new Map<string, { categorySlug: string | null; subcategorySlug: string | null; tagSlugs: string[] }>();
  for (const id of treatmentIds) map.set(id, { categorySlug: null, subcategorySlug: null, tagSlugs: [] });
  return map;
}
