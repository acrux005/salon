import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/db";
import { requirePortalClinicSession } from "@/lib/requireClinicApiSession";

/**
 * GET /api/booking/appointments?status=planned|done|cancelled&staff_id=...&clinic_slug=...
 * Lista wizyt z kalendarza gabinetu (tylko ClinicBooking). Wymaga sesji gabinetu/admina.
 */
export async function GET(request: NextRequest) {
  const gate = await requirePortalClinicSession();
  if (!gate.ok) return gate.response;

  const status = request.nextUrl.searchParams.get("status")?.trim() || "planned";
  const staffId = request.nextUrl.searchParams.get("staff_id")?.trim();
  const clinicSlug = request.nextUrl.searchParams.get("clinic_slug")?.trim();

  try {
    const prisma = getPrisma();
    let clinicId = gate.session.clinicId;
    if (gate.session.admin && clinicSlug) {
      const clinic = await prisma.clinic.findFirst({
        where: { slug: clinicSlug },
        select: { id: true },
      });
      if (!clinic) return NextResponse.json({ items: [] });
      clinicId = clinic.id;
    }
    if (!clinicId) return NextResponse.json({ items: [] });
    const clinic = { id: clinicId };

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
