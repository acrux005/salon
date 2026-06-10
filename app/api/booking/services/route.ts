import { NextResponse } from "next/server";
import { getCatalogAsync } from "@/lib/skinmatch/treatmentsDb";

/**
 * GET /api/booking/services
 * Lista zabiegów z katalogu (do wyboru przy dodawaniu wizyty w kalendarzu).
 */
export async function GET() {
  try {
    const catalog = await getCatalogAsync();
    const items = catalog.map((t) => ({ id: t.id, name: t.nazwa }));
    return NextResponse.json({ items });
  } catch (e) {
    console.error("[api/booking/services]", e);
    return NextResponse.json({ error: "Błąd pobierania zabiegów.", items: [] }, { status: 500 });
  }
}
