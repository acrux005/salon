import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/db";

/**
 * GET /api/booking/appointments?status=planned|done|cancelled&staff_id=...&clinic_slug=...
 * Lista wizyt z kalendarza gabinetu (tylko ClinicBooking).
 */
export async function GET(request: NextRequest) {
  const status = request.nextUrl.searchParams.get("status")?.trim() || "planned";
  const staffId = request.nextUrl.searchParams.get("staff_id")?.trim();
  const clinicSlug = request.nextUrl.searchParams.get("clinic_slug")?.trim();

  if (!clinicSlug) {
    return NextResponse.json({ items: [] });
  }

  try {
    const prisma = getPrisma();
    const clinic = await prisma.clinic.findFirst({
      where: { slug: clinicSlug },
      select: { id: true },
    });
    if (!clinic) return NextResponse.json({ items: [] });

    const bookings = await prisma.clinicBooking.findMany({
      where: {
        clinicId: clinic.id,
        status,
        ...(staffId ? { staffId } : {}),
      },
      orderBy: [{ date: "asc" }, { time: "asc" }],
    });
    const items = bookings.map((b) => ({
      id: "cb-" + b.id,
      date: b.date,
      time: b.time,
      client: b.clientName ?? "",
      phone: b.clientPhone ?? null,
      service: b.treatmentName ?? null,
      status: b.status,
    }));
    return NextResponse.json({ items });
  } catch (e) {
    console.error("[api/booking/appointments]", e);
    return NextResponse.json({ error: "Błąd pobierania wizyt.", items: [] }, { status: 500 });
  }
}
