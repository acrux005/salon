import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/db";
import { findVetClinicIdByCalendarToken } from "@/lib/vet/calendarFeed";
import { buildVetCalendarIcs } from "@/lib/vet/ical";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token")?.trim();
  if (!token) {
    return NextResponse.json({ error: "Brak tokenu." }, { status: 400 });
  }

  const vetClinicId = await findVetClinicIdByCalendarToken(token);
  if (!vetClinicId) {
    return NextResponse.json({ error: "Nieprawidłowy token." }, { status: 404 });
  }

  const prisma = getPrisma();
  const today = new Date();
  const fromDate = new Date(today);
  fromDate.setMonth(fromDate.getMonth() - 1);
  const toDate = new Date(today);
  toDate.setMonth(toDate.getMonth() + 6);
  const fromStr = fromDate.toISOString().slice(0, 10);
  const toStr = toDate.toISOString().slice(0, 10);

  const [clinic, appointments] = await Promise.all([
    prisma.vetClinic.findUnique({
      where: { id: vetClinicId },
      select: { name: true, slotDurationMinutes: true },
    }),
    prisma.vetAppointment.findMany({
      where: {
        vetClinicId,
        date: { gte: fromStr, lte: toStr },
        status: { not: "cancelled" },
      },
      orderBy: [{ date: "asc" }, { time: "asc" }],
      include: { vetDoctor: { select: { name: true } } },
    }),
  ]);

  if (!clinic) {
    return NextResponse.json({ error: "Nie znaleziono przychodni." }, { status: 404 });
  }

  const ics = buildVetCalendarIcs({
    clinicName: clinic.name,
    slotDurationMinutes: clinic.slotDurationMinutes,
    appointments: appointments.map((a) => ({
      id: a.id,
      date: a.date,
      time: a.time,
      status: a.status,
      visitType: a.visitType,
      ownerName: a.ownerName,
      petName: a.petName,
      notes: a.notes,
      doctorName: a.vetDoctor?.name ?? null,
    })),
  });

  return new NextResponse(ics, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="vetharmonogram-wizyty.ics"',
      "Cache-Control": "private, max-age=300",
    },
  });
}
