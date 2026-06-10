import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/db";

/** Format rezerwacji z Next (ClinicBooking) — id jako "cb-"+cuid. */
function clinicBookingToAppointment(b: {
  id: string;
  date: string;
  time: string;
  clientName: string | null;
  clientPhone: string | null;
  treatmentName: string | null;
  status: string;
}) {
  return {
    id: "cb-" + b.id,
    client: b.clientName ?? "",
    phone: b.clientPhone ?? null,
    service: b.treatmentName ?? null,
    staff: null as string | null,
    time: b.time,
    status: b.status,
  };
}

export async function GET(request: NextRequest) {
  const month = request.nextUrl.searchParams.get("month")?.trim() || new Date().toISOString().slice(0, 7);
  const staffIdParam = request.nextUrl.searchParams.get("staff_id")?.trim();
  const clinicSlug = request.nextUrl.searchParams.get("clinic_slug")?.trim();

  if (!/^\d{4}-\d{2}$/.test(month)) {
    return NextResponse.json({ error: "Nieprawidłowy parametr month (YYYY-MM)." }, { status: 400 });
  }

  const [year, monthNum] = month.split("-").map(Number);
  const firstDay = `${month}-01`;
  const lastDay = new Date(year, monthNum, 0);
  const lastDayStr = `${year}-${String(monthNum).padStart(2, "0")}-${String(lastDay.getDate()).padStart(2, "0")}`;

  let clinicId: string | null = null;
  if (clinicSlug) {
    const prisma = getPrisma();
    const clinic = await prisma.clinic.findFirst({
      where: { slug: clinicSlug },
      select: { id: true },
    });
    if (clinic) clinicId = clinic.id;
  }

  const appointments: Record<string, unknown[]> = {};

  if (clinicId) {
    const prisma = getPrisma();
    const bookings = await prisma.clinicBooking.findMany({
      where: {
        clinicId,
        date: { gte: firstDay, lte: lastDayStr },
        ...(staffIdParam ? { staffId: staffIdParam } : {}),
      },
      orderBy: [{ date: "asc" }, { time: "asc" }],
    });
    for (const b of bookings) {
      const dateKey = b.date;
      if (!appointments[dateKey]) appointments[dateKey] = [];
      appointments[dateKey].push(clinicBookingToAppointment(b));
    }
  }

  return NextResponse.json({
    ok: true,
    month,
    appointments,
  });
}
