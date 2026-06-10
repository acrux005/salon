import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/db";
import { findGabPatientAccountIdByCalendarToken } from "@/lib/gabinet/patientCalendar";
import { buildGabPatientCalendarIcs } from "@/lib/gabinet/ical";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token")?.trim();
  if (!token) {
    return NextResponse.json({ error: "Brak tokenu." }, { status: 400 });
  }

  const accountId = await findGabPatientAccountIdByCalendarToken(token);
  if (!accountId) {
    return NextResponse.json({ error: "Nieprawidłowy token." }, { status: 404 });
  }

  const today = new Date().toISOString().slice(0, 10);
  const prisma = getPrisma();
  const appointments = await prisma.gabAppointment.findMany({
    where: {
      patient: { accountId },
      date: { gte: today },
      status: { in: ["planned", "confirmed"] },
    },
    include: {
      gabClinic: { select: { name: true, slotDurationMinutes: true } },
      gabStaff: { select: { name: true } },
    },
    orderBy: [{ date: "asc" }, { time: "asc" }],
    take: 100,
  });

  const slotDurationMinutes = appointments[0]?.gabClinic.slotDurationMinutes ?? 30;
  const ics = buildGabPatientCalendarIcs({
    calendarName: "Moje wizyty — GabinetHarmonogram",
    slotDurationMinutes,
    appointments: appointments.map((a) => ({
      id: a.id,
      date: a.date,
      time: a.time,
      status: a.status,
      visitType: a.visitType,
      patientName: a.patientName,
      clinicName: a.gabClinic.name,
      staffName: a.gabStaff?.name ?? null,
      notes: a.notes,
    })),
  });

  return new NextResponse(ics, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="gabinet-wizyty.ics"',
      "Cache-Control": "private, max-age=300",
    },
  });
}
