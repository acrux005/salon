import { NextResponse } from "next/server";
import { getTaxonomyAsync } from "@/lib/taxonomy";

/**
 * GET /api/taxonomy
 * Zwraca kategorie (z podkategoriami) i tagi do filtrowania/prezentacji zabiegów.
 */
export async function GET() {
  try {
    const data = await getTaxonomyAsync();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, max-age=300, s-maxage=300" },
    });
  } catch (e) {
    console.error("[api/taxonomy]", e);
    return NextResponse.json(
      { categories: [], tags: [] },
      { status: 500 }
    );
  }
}
