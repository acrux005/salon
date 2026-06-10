import { NextRequest, NextResponse } from "next/server";
import { canStaffDoTreatmentByStaffIdAsync } from "@/lib/skinmatch/subCabinetDb";

/**
 * GET /api/booking/check-treatment?clinicSlug=...&treatmentId=...&staffId=... (opcjonalnie)
 * staffId = Staff.id z panelu. Gdy brak staffId — zwracamy allowed: true.
 */
export async function GET(request: NextRequest) {
  const staffIdParam = request.nextUrl.searchParams.get("staffId")?.trim();
  const treatmentId = request.nextUrl.searchParams.get("treatmentId")?.trim();
  if (!treatmentId) {
    return NextResponse.json(
      { error: "Wymagane: treatmentId." },
      { status: 400 }
    );
  }
  try {
    if (staffIdParam) {
      const allowed = await canStaffDoTreatmentByStaffIdAsync(staffIdParam, treatmentId);
      return NextResponse.json({ allowed });
    }
    return NextResponse.json({ allowed: true });
  } catch (e) {
    console.error("[api/booking/check-treatment]", e);
    return NextResponse.json({ allowed: true });
  }
}
