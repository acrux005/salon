import { NextRequest, NextResponse } from "next/server";
import { getClinicBySlugAsync } from "@/lib/skinmatch/clinics";
import { getStaffByClinicIdAsync } from "@/lib/skinmatch/staffDb";

/**
 * GET /api/booking/clinic-staff?clinicSlug=...
 * Zwraca wszystkich pracowników z panelu gabinetu (działa bez ID Cosmo).
 * Zwraca: [ { id: Staff.id (cuid), name, cosmoStaffId: number | null } ]
 */
export async function GET(request: NextRequest) {
  const clinicSlug = request.nextUrl.searchParams.get("clinicSlug")?.trim();

  if (!clinicSlug) {
    return NextResponse.json(
      { error: "Wymagane: clinicSlug.", items: [] },
      { status: 400 }
    );
  }

  try {
    const clinic = await getClinicBySlugAsync(clinicSlug);
    if (!clinic) {
      return NextResponse.json([]);
    }

    const staff = await getStaffByClinicIdAsync(clinic.id);
    const items = staff.map((s) => ({
      id: s.id,
      name: s.name,
      cosmoStaffId: s.cosmoStaffId ?? null,
    }));

    return NextResponse.json(items);
  } catch (e) {
    console.error("[api/booking/clinic-staff]", e);
    return NextResponse.json({ error: "Błąd pobierania pracowników.", items: [] }, { status: 500 });
  }
}
