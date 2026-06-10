import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/db";
import { normalizeVisitType } from "@/lib/vet/visitTypes";
import { isValidVisitStatus } from "@/lib/vet/visitStatus";

const PREFIX = "va-";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id?.startsWith(PREFIX)) {
    return NextResponse.json({ error: "Nieznany typ wizyty." }, { status: 404 });
  }
  const bookingId = id.slice(PREFIX.length);
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const status = typeof body.status === "string" ? body.status.trim() : undefined;
  const date = typeof body.date === "string" ? body.date.trim() : undefined;
  const time = typeof body.time === "string" ? body.time.trim() : undefined;
  const ownerName =
    typeof body.ownerName === "string"
      ? body.ownerName.trim()
      : typeof body.new_name === "string"
        ? body.new_name.trim()
        : undefined;
  const ownerPhone =
    typeof body.ownerPhone === "string"
      ? body.ownerPhone.trim()
      : typeof body.new_phone === "string"
        ? body.new_phone.trim()
        : undefined;
  const visitTypeRaw =
    typeof body.visitType === "string"
      ? body.visitType.trim()
      : typeof body.service_id === "string"
        ? body.service_id.trim()
        : undefined;
  const notes = typeof body.notes === "string" ? body.notes.trim() : undefined;
  const petId = typeof body.petId === "string" ? body.petId.trim() : undefined;
  const vetDoctorId =
    typeof body.vetDoctorId === "string"
      ? body.vetDoctorId.trim()
      : typeof body.staffId === "string"
        ? body.staffId.trim()
        : undefined;

  try {
    const prisma = getPrisma();
    const existing = await prisma.vetAppointment.findUnique({
      where: { id: bookingId },
      include: { vetClinic: { select: { id: true } } },
    });
    if (!existing) {
      return NextResponse.json({ error: "Nie znaleziono wizyty." }, { status: 404 });
    }

    const data: {
      status?: string;
      date?: string;
      time?: string;
      ownerName?: string | null;
      ownerPhone?: string | null;
      visitType?: string | null;
      notes?: string | null;
      petId?: string | null;
      petName?: string | null;
      vetDoctorId?: string | null;
    } = {};

    if (status !== undefined) {
      if (!isValidVisitStatus(status)) {
        return NextResponse.json({ error: "Nieprawidłowy status." }, { status: 400 });
      }
      data.status = status;
    }
    if (date !== undefined) data.date = date;
    if (time !== undefined) data.time = time;
    if (ownerName !== undefined) data.ownerName = ownerName || null;
    if (ownerPhone !== undefined) data.ownerPhone = ownerPhone || null;
    if (visitTypeRaw !== undefined) data.visitType = normalizeVisitType(visitTypeRaw);
    if (notes !== undefined) data.notes = notes || null;

    if (petId !== undefined) {
      if (!petId) {
        data.petId = null;
      } else {
        const pet = await prisma.pet.findFirst({
          where: { id: petId, owner: { vetClinicId: existing.vetClinicId } },
          include: { owner: { select: { name: true, phone: true } } },
        });
        if (!pet) {
          return NextResponse.json({ error: "Nie znaleziono zwierzęcia." }, { status: 400 });
        }
        data.petId = pet.id;
        data.petName = pet.name;
        data.ownerName = pet.owner.name;
        data.ownerPhone = pet.owner.phone;
      }
    }

    if (vetDoctorId !== undefined) {
      if (!vetDoctorId) {
        data.vetDoctorId = null;
      } else {
        const doctor = await prisma.vetDoctor.findFirst({
          where: { id: vetDoctorId, vetClinicId: existing.vetClinicId },
        });
        if (!doctor) {
          return NextResponse.json({ error: "Nie znaleziono lekarza." }, { status: 400 });
        }
        data.vetDoctorId = vetDoctorId;
      }
    }

    if (Object.keys(data).length === 0) return NextResponse.json({ ok: true });
    await prisma.vetAppointment.update({ where: { id: bookingId }, data });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[api/wet/booking/appointments]", e);
    return NextResponse.json({ error: "Błąd aktualizacji." }, { status: 500 });
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id?.startsWith(PREFIX)) {
    return NextResponse.json({ error: "Nie znaleziono." }, { status: 404 });
  }
  const bookingId = id.slice(PREFIX.length);
  try {
    const prisma = getPrisma();
    const row = await prisma.vetAppointment.findUnique({
      where: { id: bookingId },
      include: { vetDoctor: { select: { id: true, name: true } } },
    });
    if (!row) return NextResponse.json({ error: "Nie znaleziono." }, { status: 404 });
    return NextResponse.json({
      appointment: {
        id: PREFIX + row.id,
        date: row.date,
        time: row.time,
        status: row.status,
        visitType: row.visitType,
        petId: row.petId,
        petName: row.petName,
        ownerName: row.ownerName,
        ownerPhone: row.ownerPhone,
        notes: row.notes,
        doctorId: row.vetDoctorId,
        doctorName: row.vetDoctor?.name ?? null,
      },
    });
  } catch {
    return NextResponse.json({ error: "Błąd pobierania." }, { status: 500 });
  }
}
