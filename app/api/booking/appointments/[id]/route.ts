import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/db";
import { requirePortalClinicSession } from "@/lib/requireClinicApiSession";

const CLINIC_BOOKING_PREFIX = "cb-";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const gate = await requirePortalClinicSession();
  if (!gate.ok) return gate.response;

  const { id } = await params;
  if (!id?.trim()) {
    return NextResponse.json({ error: "Brak id." }, { status: 400 });
  }

  if (!id.startsWith(CLINIC_BOOKING_PREFIX)) {
    return NextResponse.json({ error: "Nieznany typ wizyty." }, { status: 404 });
  }

  const bookingId = id.slice(CLINIC_BOOKING_PREFIX.length);
  const body = await request.json().catch(() => ({})) as Record<string, unknown>;
  const status = typeof body.status === "string" ? body.status.trim() : undefined;
  const date = typeof body.date === "string" ? body.date.trim() : undefined;
  const time = typeof body.time === "string" ? body.time.trim() : undefined;
  const newName = typeof body.new_name === "string" ? body.new_name.trim() : undefined;
  const newPhone = typeof body.new_phone === "string" ? body.new_phone.trim() : undefined;

  try {
    const prisma = getPrisma();
    const existing = await prisma.clinicBooking.findUnique({
      where: { id: bookingId },
    });
    if (!existing) {
      return NextResponse.json({ error: "Nie znaleziono rezerwacji." }, { status: 404 });
    }
    if (!gate.session.admin && existing.clinicId !== gate.session.clinicId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data: { status?: string; date?: string; time?: string; clientName?: string | null; clientPhone?: string | null; treatmentName?: string | null } = {};
    if (status !== undefined) {
      if (!["planned", "done", "cancelled"].includes(status)) {
        return NextResponse.json({ error: "Nieprawidłowy status." }, { status: 400 });
      }
      data.status = status;
    }
    if (date !== undefined) data.date = date;
    if (time !== undefined) data.time = time;
    if (newName !== undefined) data.clientName = newName || null;
    if (newPhone !== undefined) data.clientPhone = newPhone || null;
    if (typeof body.service_id === "string" && body.service_id.trim()) {
      data.treatmentName = body.service_id.trim();
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ ok: true });
    }

    await prisma.clinicBooking.update({
      where: { id: bookingId },
      data,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[api/booking/appointments/[id]]", e);
    return NextResponse.json({ error: "Błąd aktualizacji." }, { status: 500 });
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await params;
  return NextResponse.json({ error: "Not available." }, { status: 501 });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await params;
  return NextResponse.json({ error: "Use PATCH with status: cancelled." }, { status: 501 });
}
