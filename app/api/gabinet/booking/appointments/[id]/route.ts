import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/db";
import { GAB_APPOINTMENT_PREFIX } from "@/lib/gabinet/appointmentDisplay";
import { normalizeVisitType } from "@/lib/gabinet/visitTypes";
import { isValidVisitStatus } from "@/lib/gabinet/visitStatus";
import { scheduleRecallAfterCompletedVisit } from "@/lib/gabinet/recallReminders";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id?.startsWith(GAB_APPOINTMENT_PREFIX)) {
    return NextResponse.json({ error: "Nieznany typ wizyty." }, { status: 404 });
  }
  const bookingId = id.slice(GAB_APPOINTMENT_PREFIX.length);
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;

  const status = typeof body.status === "string" ? body.status.trim() : undefined;
  const date = typeof body.date === "string" ? body.date.trim() : undefined;
  const time = typeof body.time === "string" ? body.time.trim() : undefined;
  const patientName = typeof body.patientName === "string" ? body.patientName.trim() : undefined;
  const patientPhone = typeof body.patientPhone === "string" ? body.patientPhone.trim() : undefined;
  const visitTypeRaw = typeof body.visitType === "string" ? body.visitType.trim() : undefined;
  const notes = typeof body.notes === "string" ? body.notes.trim() : undefined;
  const patientId = typeof body.patientId === "string" ? body.patientId.trim() : undefined;
  const gabStaffId =
    typeof body.gabStaffId === "string"
      ? body.gabStaffId.trim()
      : typeof body.staffId === "string"
        ? body.staffId.trim()
        : undefined;

  try {
    const prisma = getPrisma();
    const existing = await prisma.gabAppointment.findUnique({ where: { id: bookingId } });
    if (!existing) {
      return NextResponse.json({ error: "Nie znaleziono wizyty." }, { status: 404 });
    }

    const data: {
      status?: string;
      date?: string;
      time?: string;
      patientName?: string | null;
      patientPhone?: string | null;
      visitType?: string | null;
      notes?: string | null;
      patientId?: string | null;
      gabStaffId?: string | null;
    } = {};

    if (status !== undefined) {
      if (!isValidVisitStatus(status)) {
        return NextResponse.json({ error: "Nieprawidłowy status." }, { status: 400 });
      }
      data.status = status;
    }
    if (date !== undefined) data.date = date;
    if (time !== undefined) data.time = time;
    if (patientName !== undefined) data.patientName = patientName || null;
    if (patientPhone !== undefined) data.patientPhone = patientPhone || null;
    if (visitTypeRaw !== undefined) data.visitType = normalizeVisitType(visitTypeRaw);
    if (notes !== undefined) data.notes = notes || null;

    if (patientId !== undefined) {
      if (!patientId) {
        data.patientId = null;
      } else {
        const patient = await prisma.gabPatient.findFirst({
          where: { id: patientId, gabClinicId: existing.gabClinicId },
        });
        if (!patient) {
          return NextResponse.json({ error: "Nie znaleziono pacjenta." }, { status: 400 });
        }
        data.patientId = patient.id;
        data.patientName = patient.name;
        data.patientPhone = patient.phone;
      }
    }

    if (gabStaffId !== undefined) {
      if (!gabStaffId) {
        data.gabStaffId = null;
      } else {
        const staff = await prisma.gabStaff.findFirst({
          where: { id: gabStaffId, gabClinicId: existing.gabClinicId },
        });
        if (!staff) {
          return NextResponse.json({ error: "Nie znaleziono personelu." }, { status: 400 });
        }
        data.gabStaffId = gabStaffId;
      }
    }

    if (Object.keys(data).length === 0) return NextResponse.json({ ok: true });

    await prisma.gabAppointment.update({ where: { id: bookingId }, data });

    if (data.status === "completed" && existing.status !== "completed") {
      await scheduleRecallAfterCompletedVisit(
        existing.gabClinicId,
        data.patientId ?? existing.patientId,
        existing.clientId,
        data.visitType ?? existing.visitType,
        data.date ?? existing.date
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[api/gabinet/booking/appointments]", e);
    return NextResponse.json({ error: "Błąd aktualizacji." }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id?.startsWith(GAB_APPOINTMENT_PREFIX)) {
    return NextResponse.json({ error: "Nie znaleziono." }, { status: 404 });
  }
  const bookingId = id.slice(GAB_APPOINTMENT_PREFIX.length);
  try {
    const existing = await getPrisma().gabAppointment.findUnique({ where: { id: bookingId } });
    if (!existing) return NextResponse.json({ error: "Nie znaleziono wizyty." }, { status: 404 });
    await getPrisma().gabAppointment.update({
      where: { id: bookingId },
      data: { status: "cancelled" },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Błąd anulowania." }, { status: 500 });
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id?.startsWith(GAB_APPOINTMENT_PREFIX)) {
    return NextResponse.json({ error: "Nie znaleziono." }, { status: 404 });
  }
  const bookingId = id.slice(GAB_APPOINTMENT_PREFIX.length);
  try {
    const row = await getPrisma().gabAppointment.findUnique({
      where: { id: bookingId },
      include: { gabStaff: { select: { id: true, name: true } } },
    });
    if (!row) return NextResponse.json({ error: "Nie znaleziono." }, { status: 404 });
    return NextResponse.json({
      appointment: {
        id: GAB_APPOINTMENT_PREFIX + row.id,
        date: row.date,
        time: row.time,
        status: row.status,
        visitType: row.visitType,
        patientId: row.patientId,
        patientName: row.patientName,
        patientPhone: row.patientPhone,
        notes: row.notes,
        staffId: row.gabStaffId,
        staffName: row.gabStaff?.name ?? null,
      },
    });
  } catch {
    return NextResponse.json({ error: "Błąd pobierania." }, { status: 500 });
  }
}
