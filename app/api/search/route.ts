import { NextRequest, NextResponse } from "next/server";
import { getAllClinicRecordsAsync } from "@/lib/skinmatch/clinics";
import { getCatalogAsync } from "@/lib/skinmatch/treatmentsDb";

const MAX_CLINICS = 8;
const MAX_TREATMENTS = 8;

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) return NextResponse.json({ clinics: [], treatments: [] });

  const qLower = q.toLowerCase();

  try {
    const [clinicsRaw, treatmentsRaw] = await Promise.all([
      getAllClinicRecordsAsync(),
      getCatalogAsync(),
    ]);

    const clinics = clinicsRaw
      .filter(
        (c) =>
          c.name.toLowerCase().includes(qLower) ||
          c.city.toLowerCase().includes(qLower)
      )
      .slice(0, MAX_CLINICS)
      .map((c) => ({ id: c.id, slug: c.slug, name: c.name, city: c.city }));

    const treatments = treatmentsRaw
      .filter(
        (t) =>
          t.nazwa.toLowerCase().includes(qLower) ||
          t.id.toLowerCase().includes(qLower)
      )
      .slice(0, MAX_TREATMENTS)
      .map((t) => ({ id: t.id, nazwa: t.nazwa }));

    return NextResponse.json({ clinics, treatments });
  } catch (e) {
    console.error("[api/search]", e);
    return NextResponse.json({ clinics: [], treatments: [] });
  }
}
