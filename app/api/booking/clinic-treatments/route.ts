import { NextRequest, NextResponse } from "next/server";
import { getClinicBySlugAsync } from "@/lib/skinmatch/clinics";
import { getTreatmentsByIdsAsync } from "@/lib/skinmatch/treatmentsDb";
import { canStaffDoTreatmentByStaffIdAsync } from "@/lib/skinmatch/subCabinetDb";

/**
 * GET /api/booking/clinic-treatments?clinicSlug=...&staffId=... (opcjonalnie)
 * staffId = Staff.id z panelu — filtruje zabiegi przypisane do tego pracownika.
 */
export async function GET(request: NextRequest) {
  const clinicSlug = request.nextUrl.searchParams.get("clinicSlug")?.trim();
  const staffIdParam = request.nextUrl.searchParams.get("staffId")?.trim();

  if (!clinicSlug) {
    return NextResponse.json(
      { error: "Wymagane: clinicSlug.", items: [] },
      { status: 400 }
    );
  }

  try {
    const clinic = await getClinicBySlugAsync(clinicSlug);
    if (!clinic) {
      return NextResponse.json({ items: [] });
    }

    const treatmentIds = clinic.treatmentIds ?? [];
    if (treatmentIds.length === 0) {
      return NextResponse.json({ items: [] });
    }

    const treatments = await getTreatmentsByIdsAsync(treatmentIds);
    let items = treatments.map((t) => ({ id: t.id, nazwa: t.nazwa }));

    if (staffIdParam) {
      const allowed = await Promise.all(
        items.map((t) => canStaffDoTreatmentByStaffIdAsync(staffIdParam, t.id))
      );
      items = items.filter((_, i) => allowed[i]);
    }

    return NextResponse.json({ items });
  } catch (e) {
    console.error("[api/booking/clinic-treatments]", e);
    return NextResponse.json({ error: "Błąd pobierania zabiegów.", items: [] }, { status: 500 });
  }
}
