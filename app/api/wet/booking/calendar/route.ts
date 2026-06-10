import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/db";
import { mapVetAppointmentRow } from "@/lib/vet/appointmentDisplay";

export async function GET(request: NextRequest) {
  const month = request.nextUrl.searchParams.get("month")?.trim() || new Date().toISOString().slice(0, 7);
  const singleDate = request.nextUrl.searchParams.get("date")?.trim();
  const vetDoctorId = request.nextUrl.searchParams.get("staff_id")?.trim();
  const vetSlug = request.nextUrl.searchParams.get("vet_slug")?.trim();

  if (singleDate && !/^\d{4}-\d{2}-\d{2}$/.test(singleDate)) {
    return NextResponse.json({ error: "Nieprawidłowy parametr date (YYYY-MM-DD)." }, { status: 400 });
  }
  if (!singleDate && !/^\d{4}-\d{2}$/.test(month)) {
    return NextResponse.json({ error: "Nieprawidłowy parametr month (YYYY-MM)." }, { status: 400 });
  }

  let dateFrom: string;
  let dateTo: string;
  if (singleDate) {
    dateFrom = singleDate;
    dateTo = singleDate;
  } else {
    const [year, monthNum] = month.split("-").map(Number);
    dateFrom = `${month}-01`;
    const lastDay = new Date(year, monthNum, 0);
    dateTo = `${year}-${String(monthNum).padStart(2, "0")}-${String(lastDay.getDate()).padStart(2, "0")}`;
  }

  let vetClinicId: string | null = null;
  if (vetSlug) {
    const prisma = getPrisma();
    const clinic = await prisma.vetClinic.findFirst({
      where: { slug: vetSlug },
      select: { id: true },
    });
    if (clinic) vetClinicId = clinic.id;
  }

  const appointments: Record<string, ReturnType<typeof mapVetAppointmentRow>[]> = {};
  if (vetClinicId) {
    const prisma = getPrisma();
    const rows = await prisma.vetAppointment.findMany({
      where: {
        vetClinicId,
        date: { gte: dateFrom, lte: dateTo },
        ...(vetDoctorId ? { vetDoctorId } : {}),
      },
      include: { vetDoctor: { select: { name: true } }, catalogItem: { select: { name: true } } },
      orderBy: [{ date: "asc" }, { time: "asc" }],
    });
    for (const b of rows) {
      if (!appointments[b.date]) appointments[b.date] = [];
      appointments[b.date].push(mapVetAppointmentRow(b));
    }
  }

  return NextResponse.json({
    ok: true,
    month: singleDate ? singleDate.slice(0, 7) : month,
    date: singleDate ?? undefined,
    appointments,
  });
}
