import { NextRequest, NextResponse } from "next/server";
import { getTreatmentsForAdminAsync } from "@/lib/skinmatch/treatmentsDb";
import {
  getTreatmentIdsByCategorySlugAsync,
  getTreatmentIdsBySubcategorySlugAsync,
  getTreatmentsTaxonomyMapAsync,
} from "@/lib/taxonomy";

export const dynamic = "force-dynamic";

/**
 * GET /api/treatments?q=...&category=...&subcategory=...
 * Lista zabiegów z katalogu. q — wyszukiwanie po nazwie; category/subcategory — filtr taksonomii.
 * Zwraca: { items: [ { id, nazwa, categorySlug?, subcategorySlug?, tagSlugs? } ] }
 */
export async function GET(request: NextRequest) {
  try {
    const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";
    const categorySlug = request.nextUrl.searchParams.get("category")?.trim() || undefined;
    const subcategorySlug = request.nextUrl.searchParams.get("subcategory")?.trim() || undefined;

    let list = await getTreatmentsForAdminAsync(q || undefined);
    let ids = list.map((t) => t.id);

    if (categorySlug) {
      const catIds = new Set(await getTreatmentIdsByCategorySlugAsync(categorySlug));
      ids = ids.filter((id) => catIds.has(id));
    }
    if (subcategorySlug) {
      const subIds = new Set(await getTreatmentIdsBySubcategorySlugAsync(subcategorySlug));
      ids = ids.filter((id) => subIds.has(id));
    }

    const ordered = ids.length ? list.filter((t) => ids.includes(t.id)) : list;
    const taxonomyMap = await getTreatmentsTaxonomyMapAsync(ordered.map((t) => t.id));

    const items = ordered.map((t) => {
      const tax = taxonomyMap.get(t.id);
      return {
        id: t.id,
        nazwa: t.nazwa,
        ...(tax && {
          categorySlug: tax.categorySlug ?? undefined,
          subcategorySlug: tax.subcategorySlug ?? undefined,
          tagSlugs: tax.tagSlugs.length ? tax.tagSlugs : undefined,
        }),
      };
    });

    return NextResponse.json({ items });
  } catch (e) {
    console.error("[api/treatments]", e);
    return NextResponse.json({ error: "Błąd pobierania zabiegów.", items: [] }, { status: 500 });
  }
}
