import { NextRequest, NextResponse } from "next/server";
import { getGabClinicBySlugAsync, getWeekdayIndex } from "@/lib/gabinet/clinics";
import { getPrisma } from "@/lib/db";
import { normalizeVisitType } from "@/lib/gabinet/visitTypes";

type Body = {
  gabSlug: string;
  date: string;
  time: string;
  gabStaffId?: string;
  patientName?: string;
  patientPhone?: string;
  patientEmail?: string;
  patientId?: string;
  visitType?: string;
  notes?: string;
};

function parseBody(body: unknown): Body | null {
  if (!body || typeof body !== "object") return null;
  const o = body as Record<string, unknown>;
  const gabSlug =
    typeof o.gabSlug === "string"
      ? o.gabSlug.trim()
      : typeof o.clinicSlug === "string"
        ? o.clinicSlug.trim()
        : "";
  const date = typeof o.date === "string" ? o.date.trim() : "";
  const time = typeof o.time === "string" ? o.time.trim() : "";
  if (!gabSlug || !date || !time) return null;
  return {
    gabSlug,
    date,
    time,
    gabStaffId:
      typeof o.gabStaffId === "string"
        ? o.gabStaffId.trim() || undefined
        : typeof o.staffId === "string"
          ? o.staffId.trim() || undefined
          : undefined,
    patientName:
      typeof o.patientName === "string"
        ? o.patientName.trim()
        : typeof o.name === "string"
          ? o.name.trim()
          : undefined,
    patientPhone:
      typeof o.patientPhone === "string"
        ? o.patientPhone.trim()
        : typeof o.phone === "string"
          ? o.phone.trim()
          : undefined,
    patientEmail:
      typeof o.patientEmail === "string"
        ? o.patientEmail.trim()
        : typeof o.email === "string"
          ? o.email.trim()
          : undefined,
    patientId: typeof o.patientId === "string" ? o.patientId.trim() || undefined : undefined,
    visitType: typeof o.visitType === "string" ? o.visitType.trim() : undefined,
    notes: typeof o.notes === "string" ? o.notes.trim() : undefined,
  };
}

export async function POST(request: NextRequest) {
  try {
    const raw = await request.json().catch(() => null);
    const body = parseBody(raw);
    if (!body) {
      return NextResponse.json(
        { error: "Wymagane pola: gabSlug, date (YYYY-MM-DD), time (HH:mm)" },
        { status: 400 }
      );
    }

    const clinic = await getGabClinicBySlugAsync(body.gabSlug);
    if (!clinic) {
      return NextResponse.json({ error: "Nie znaleziono gabinetu." }, { status: 400 });
    }

    const isBlockedSlot =
      body.patientName === "— Zablokowane —" || body.patientPhone === "—";
    if (!isBlockedSlot) {
      const noOrderDays = new Set(clinic.noOrderDays ?? []);
      if (noOrderDays.has(body.date)) {
        return NextResponse.json({ error: "Wybrany dzień jest niedostępny." }, { status: 400 });
      }
      const dayHours = clinic.workingHours?.[getWeekdayIndex(body.date)];
      if (dayHours && (!dayHours.open || !dayHours.close)) {
        return NextResponse.json({ error: "Gabinet jest zamknięty w tym dniu." }, { status: 400 });
      }
    }

    const prisma = getPrisma();
    let gabStaffId = body.gabStaffId;
    if (!gabStaffId) {
      const first = await prisma.gabStaff.findFirst({
        where: { gabClinicId: clinic.id, active: true },
        select: { id: true },
      });
      gabStaffId = first?.id;
    }
    if (!gabStaffId) {
      return NextResponse.json({ error: "Brak personelu w gabinecie." }, { status: 400 });
    }

    const staff = await prisma.gabStaff.findFirst({
      where: { id: gabStaffId, gabClinicId: clinic.id },
    });
    if (!staff) {
      return NextResponse.json({ error: "Nie znaleziono personelu." }, { status: 400 });
    }

    let patientId: string | null = body.patientId ?? null;
    let patientName = body.patientName ?? null;
    let patientPhone = body.patientPhone ?? null;

    if (patientId) {
      const patient = await prisma.gabPatient.findFirst({
        where: { id: patientId, gabClinicId: clinic.id },
      });
      if (!patient) {
        return NextResponse.json({ error: "Nie znaleziono pacjenta." }, { status: 400 });
      }
      patientName = patient.name;
      patientPhone = patient.phone;
    }

    if (!isBlockedSlot && (!patientName || !patientPhone)) {
      return NextResponse.json({ error: "Imię i telefon pacjenta są wymagane." }, { status: 400 });
    }

    const conflict = await prisma.gabAppointment.findFirst({
      where: {
        gabClinicId: clinic.id,
        gabStaffId,
        date: body.date,
        time: body.time,
        status: { in: ["planned", "confirmed"] },
      },
    });
    if (conflict) {
      return NextResponse.json({ error: "Ten termin jest już zajęty." }, { status: 409 });
    }

    const noteParts = [body.notes?.trim(), body.patientEmail ? `E-mail: ${body.patientEmail}` : null].filter(Boolean);

    const appointment = await prisma.gabAppointment.create({
      data: {
        gabClinicId: clinic.id,
        gabStaffId,
        patientId,
        date: body.date,
        time: body.time,
        patientName,
        patientPhone,
        visitType: normalizeVisitType(body.visitType),
        notes: noteParts.length > 0 ? noteParts.join("\n") : null,
        status: "planned",
      },
    });

    return NextResponse.json({ ok: true, id: "ga-" + appointment.id });
  } catch (e) {
    console.error("[api/gabinet/booking]", e);
    return NextResponse.json({ error: "Błąd zapisu rezerwacji." }, { status: 500 });
  }
}
