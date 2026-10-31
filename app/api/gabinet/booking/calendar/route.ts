import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/db";
import { mapGabAppointmentRow } from "@/lib/gabinet/appointmentDisplay";
import { requireGabClinicSession } from "@/lib/requireClinicApiSession";

export async function GET(request: NextRequest) {
  const gate = await requireGabClinicSession();
  if (!gate.ok) return gate.response;

  const month = request.nextUrl.searchParams.get("month")?.trim() || new Date().toISOString().slice(0, 7);
  const singleDate = request.nextUrl.searchParams.get("date")?.trim();
  const staffId = request.nextUrl.searchParams.get("staff_id")?.trim();
  const gabSlug =
    request.nextUrl.searchParams.get("gab_slug")?.trim() ||
    request.nextUrl.searchParams.get("clinic_slug")?.trim();

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

  let gabClinicId: string | null = gate.session.admin ? null : gate.session.gabClinicId;
  if (gate.session.admin && gabSlug) {
    const clinic = await getPrisma().gabClinic.findFirst({
      where: { slug: gabSlug },
      select: { id: true },
    });
    if (clinic) gabClinicId = clinic.id;
  } else if (!gate.session.admin) {
    gabClinicId = gate.session.gabClinicId;
  }

  const appointments: Record<string, ReturnType<typeof mapGabAppointmentRow>[]> = {};
  if (gabClinicId) {
    const rows = await getPrisma().gabAppointment.findMany({
      where: {
        gabClinicId,
        date: { gte: dateFrom, lte: dateTo },
        ...(staffId ? { gabStaffId: staffId } : {}),
      },
      include: { gabStaff: { select: { name: true } } },
      orderBy: [{ date: "asc" }, { time: "asc" }],
    });
    for (const b of rows) {
      if (!appointments[b.date]) appointments[b.date] = [];
      appointments[b.date].push(mapGabAppointmentRow(b));
    }
  }

  return NextResponse.json({
    ok: true,
    month: singleDate ? singleDate.slice(0, 7) : month,
    date: singleDate ?? undefined,
    appointments,
  });
}
