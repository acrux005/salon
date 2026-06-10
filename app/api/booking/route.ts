import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { getClinicBySlugAsync } from "@/lib/skinmatch/clinics";
import { getPrisma } from "@/lib/db";
import { sendBookingEmails } from "@/lib/email";
import { createNotification } from "@/lib/notificationsDb";

/**
 * POST /api/booking
 * Zapisuje rezerwację w Next (ClinicBooking). Wymagany staffId = Staff.id z panelu gabinetu.
 */

type BookingBody = {
  clinicSlug: string;
  date: string;
  time: string;
  treatmentId?: string;
  treatmentName?: string;
  staffId?: string;
  name?: string;
  email?: string;
  phone?: string;
};

function getWeekdayIndex(dateStr: string): number {
  const d = new Date(`${dateStr}T12:00:00`);
  const jsDay = d.getDay();
  return jsDay === 0 ? 6 : jsDay - 1;
}

function parseBody(body: unknown): BookingBody | null {
  if (!body || typeof body !== "object") return null;
  const o = body as Record<string, unknown>;
  const clinicSlug = typeof o.clinicSlug === "string" ? o.clinicSlug.trim() : "";
  const date = typeof o.date === "string" ? o.date.trim() : "";
  const time = typeof o.time === "string" ? o.time.trim() : "";
  if (!clinicSlug || !date || !time) return null;
  const treatmentId = typeof o.treatmentId === "string" ? o.treatmentId.trim() : undefined;
  const treatmentName = typeof o.treatmentName === "string" ? o.treatmentName.trim() : undefined;
  const staffId = typeof o.staffId === "string" ? o.staffId.trim() || undefined : undefined;
  const name = typeof o.name === "string" ? o.name.trim() : undefined;
  const email = typeof o.email === "string" ? o.email.trim() : undefined;
  const phone = typeof o.phone === "string" ? o.phone.trim() : undefined;
  return { clinicSlug, date, time, treatmentId, treatmentName, staffId, name, email, phone };
}

export async function POST(request: NextRequest) {
  try {
    const raw = await request.json().catch(() => null);
    const body = parseBody(raw);
    if (!body) {
      return NextResponse.json(
        { error: "Wymagane pola: clinicSlug, date (YYYY-MM-DD), time (HH:mm)" },
        { status: 400 }
      );
    }

    const clinic = await getClinicBySlugAsync(body.clinicSlug);
    if (!clinic) {
      return NextResponse.json({ error: "Nie znaleziono gabinetu." }, { status: 400 });
    }

    const noOrderDays = new Set((clinic.kontakt?.noOrderDays ?? []).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)));
    if (noOrderDays.has(body.date)) {
      return NextResponse.json(
        { error: "Wybrany dzień jest zablokowany przez gabinet. Wybierz inny termin." },
        { status: 400 }
      );
    }
    const dayHours = clinic.workingHours?.[getWeekdayIndex(body.date)];
    const isClosedByWorkingHours = Boolean(dayHours && (!dayHours.open || !dayHours.close));
    if (isClosedByWorkingHours) {
      return NextResponse.json(
        { error: "Gabinet jest zamknięty w tym dniu. Wybierz inny termin." },
        { status: 400 }
      );
    }

    const prisma = getPrisma();
    let staffIdToUse = body.staffId;
    if (!staffIdToUse) {
      const firstStaff = await prisma.staff.findFirst({
        where: { clinicId: clinic.id },
        select: { id: true },
      });
      staffIdToUse = firstStaff?.id ?? undefined;
    }
    if (!staffIdToUse) {
      return NextResponse.json(
        { error: "Gabinet nie ma przypisanych pracowników. Skontaktuj się z gabinetem." },
        { status: 400 }
      );
    }

    const staff = await prisma.staff.findFirst({
      where: { id: staffIdToUse, clinicId: clinic.id },
    });
    if (!staff) {
      return NextResponse.json({ error: "Nie znaleziono pracownika." }, { status: 400 });
    }

    const confirmToken = randomBytes(24).toString("base64url");
    const booking = await prisma.clinicBooking.create({
      data: {
        clinicId: clinic.id,
        staffId: staff.id,
        date: body.date,
        time: body.time,
        clientName: body.name ?? null,
        clientEmail: body.email?.trim().toLowerCase() ?? null,
        clientPhone: body.phone ?? null,
        treatmentId: body.treatmentId ?? null,
        treatmentName: body.treatmentName ?? null,
        confirmToken,
      },
    });
    sendBookingEmails({
      clinicName: clinic.name,
      clinicEmail: clinic.kontakt?.email,
      clinicPhone: clinic.kontakt?.phone,
      clientName: body.name,
      clientEmail: body.email?.trim() ?? undefined,
      clientPhone: body.phone,
      date: body.date,
      time: body.time,
      serviceName: body.treatmentName,
      staffName: staff.name,
      confirmToken,
    }).catch((e) => console.error("[api/booking] e-mail:", e));
    createNotification({
      recipientType: "clinic",
      recipientId: clinic.id,
      type: "new_booking",
      title: "Nowa rezerwacja",
      body: `${body.date} ${body.time} — ${body.treatmentName ?? "Zabieg"}${body.name ? `, ${body.name}` : ""}`,
      link: "/portal/panel/kalendarz",
    }).catch((e) => console.error("[api/booking] notification:", e));
    return NextResponse.json({ success: true, id: booking.id });
  } catch (e) {
    console.error("[api/booking]", e);
    return NextResponse.json(
      { error: "Błąd serwera podczas zapisu rezerwacji." },
      { status: 500 }
    );
  }
}
