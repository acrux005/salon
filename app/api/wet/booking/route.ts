import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { getVetClinicBySlugAsync } from "@/lib/vet/clinics";
import { getPrisma } from "@/lib/db";
import { normalizeVisitType } from "@/lib/vet/visitTypes";
import { resolveVisitTypeFromCatalog } from "@/lib/vet/catalog";

type Body = {
  vetSlug: string;
  date: string;
  time: string;
  vetDoctorId?: string;
  ownerName?: string;
  email?: string;
  phone?: string;
  petId?: string;
  petName?: string;
  visitType?: string;
  notes?: string;
  catalogItemId?: string;
};

function getWeekdayIndex(dateStr: string): number {
  const d = new Date(`${dateStr}T12:00:00`);
  const jsDay = d.getDay();
  return jsDay === 0 ? 6 : jsDay - 1;
}

function parseBody(body: unknown): Body | null {
  if (!body || typeof body !== "object") return null;
  const o = body as Record<string, unknown>;
  const vetSlug =
    typeof o.vetSlug === "string"
      ? o.vetSlug.trim()
      : typeof o.clinicSlug === "string"
        ? o.clinicSlug.trim()
        : "";
  const date = typeof o.date === "string" ? o.date.trim() : "";
  const time = typeof o.time === "string" ? o.time.trim() : "";
  if (!vetSlug || !date || !time) return null;
  return {
    vetSlug,
    date,
    time,
    vetDoctorId:
      typeof o.vetDoctorId === "string"
        ? o.vetDoctorId.trim() || undefined
        : typeof o.staffId === "string"
          ? o.staffId.trim() || undefined
          : undefined,
    ownerName:
      typeof o.ownerName === "string"
        ? o.ownerName.trim()
        : typeof o.name === "string"
          ? o.name.trim()
          : undefined,
    email: typeof o.email === "string" ? o.email.trim() : undefined,
    phone: typeof o.phone === "string" ? o.phone.trim() : undefined,
    petId: typeof o.petId === "string" ? o.petId.trim() || undefined : undefined,
    petName: typeof o.petName === "string" ? o.petName.trim() : undefined,
    visitType: typeof o.visitType === "string" ? o.visitType.trim() : undefined,
    notes: typeof o.notes === "string" ? o.notes.trim() : undefined,
    catalogItemId: typeof o.catalogItemId === "string" ? o.catalogItemId.trim() || undefined : undefined,
  };
}

export async function POST(request: NextRequest) {
  try {
    const raw = await request.json().catch(() => null);
    const body = parseBody(raw);
    if (!body) {
      return NextResponse.json(
        { error: "Wymagane pola: vetSlug, date (YYYY-MM-DD), time (HH:mm)" },
        { status: 400 }
      );
    }

    const clinic = await getVetClinicBySlugAsync(body.vetSlug);
    if (!clinic) {
      return NextResponse.json({ error: "Nie znaleziono przychodni." }, { status: 400 });
    }

    const isBlockedSlot =
      body.ownerName === "— Zablokowane —" || body.phone === "—";
    if (!isBlockedSlot) {
      const noOrderDays = new Set(clinic.noOrderDays ?? []);
      if (noOrderDays.has(body.date)) {
        return NextResponse.json({ error: "Wybrany dzień jest niedostępny." }, { status: 400 });
      }
      const dayHours = clinic.workingHours?.[getWeekdayIndex(body.date)];
      if (dayHours && (!dayHours.open || !dayHours.close)) {
        return NextResponse.json({ error: "Przychodnia jest zamknięta w tym dniu." }, { status: 400 });
      }
    }

    const prisma = getPrisma();
    let vetDoctorId = body.vetDoctorId;
    if (!vetDoctorId) {
      const first = await prisma.vetDoctor.findFirst({
        where: { vetClinicId: clinic.id, active: true },
        select: { id: true },
      });
      vetDoctorId = first?.id;
    }
    if (!vetDoctorId) {
      return NextResponse.json({ error: "Brak lekarza w przychodni." }, { status: 400 });
    }

    const doctor = await prisma.vetDoctor.findFirst({
      where: { id: vetDoctorId, vetClinicId: clinic.id },
    });
    if (!doctor) {
      return NextResponse.json({ error: "Nie znaleziono lekarza." }, { status: 400 });
    }

    let petId: string | null = body.petId ?? null;
    let petName = body.petName ?? null;
    let ownerName = body.ownerName ?? null;
    let ownerPhone = body.phone ?? null;

    if (petId) {
      const pet = await prisma.pet.findFirst({
        where: { id: petId, owner: { vetClinicId: clinic.id } },
        include: { owner: { select: { name: true, phone: true } } },
      });
      if (!pet) {
        return NextResponse.json({ error: "Nie znaleziono zwierzęcia." }, { status: 400 });
      }
      petName = pet.name;
      ownerName = pet.owner.name;
      ownerPhone = pet.owner.phone;
    }

    const conflict = await prisma.vetAppointment.findFirst({
      where: {
        vetClinicId: clinic.id,
        vetDoctorId,
        date: body.date,
        time: body.time,
        status: "planned",
      },
    });
    if (conflict) {
      return NextResponse.json({ error: "Ten termin jest już zajęty." }, { status: 409 });
    }

    let visitType = normalizeVisitType(body.visitType);
    let catalogItemId: string | null = body.catalogItemId ?? null;
    let notes = body.notes ?? null;

    if (catalogItemId) {
      const catalogItem = await prisma.vaccineType.findFirst({
        where: { id: catalogItemId, vetClinicId: clinic.id, active: true },
      });
      if (!catalogItem) {
        return NextResponse.json({ error: "Nie znaleziono pozycji katalogu." }, { status: 400 });
      }
      visitType = resolveVisitTypeFromCatalog(catalogItem);
      if (!notes) notes = catalogItem.name;
    }

    const confirmToken = randomBytes(24).toString("hex");
    const appointment = await prisma.vetAppointment.create({
      data: {
        vetClinicId: clinic.id,
        vetDoctorId,
        petId,
        catalogItemId,
        date: body.date,
        time: body.time,
        ownerName,
        ownerPhone,
        petName,
        visitType,
        notes,
        status: "planned",
        confirmToken,
      },
    });

    return NextResponse.json({ ok: true, id: "va-" + appointment.id });
  } catch (e) {
    console.error("[api/wet/booking]", e);
    return NextResponse.json({ error: "Błąd zapisu rezerwacji." }, { status: 500 });
  }
}
