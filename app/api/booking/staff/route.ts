import { NextRequest, NextResponse } from "next/server";
import { getClinicBySlugAsync } from "@/lib/skinmatch/clinics";
import { getStaffByClinicIdAsync } from "@/lib/skinmatch/staffDb";

/**
 * GET /api/booking/staff?clinic_slug=...
 * Lista pracowników gabinetu z panelu (do wyboru przy dodawaniu wizyty w kalendarzu).
 */
export async function GET(request: NextRequest) {
  const clinicSlug = request.nextUrl.searchParams.get("clinic_slug")?.trim();

  if (!clinicSlug) {
    return NextResponse.json({ items: [] });
  }

  try {
    const clinic = await getClinicBySlugAsync(clinicSlug);
    if (!clinic) return NextResponse.json({ items: [] });

    const staff = await getStaffByClinicIdAsync(clinic.id);
    const items = staff.map((s) => ({
      id: s.id,
      name: s.name,
    }));
    return NextResponse.json({ items });
  } catch (e) {
    console.error("[api/booking/staff]", e);
    return NextResponse.json({ error: "Błąd pobierania pracowników.", items: [] }, { status: 500 });
  }
}
