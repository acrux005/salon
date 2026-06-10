import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { VET_CLINIC_ROLE } from "@/lib/auth";
import { getPrisma } from "@/lib/db";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: Request, context: RouteContext) {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== VET_CLINIC_ROLE) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const vetClinicId = (session?.user as { vetClinicId?: string })?.vetClinicId;
  if (!vetClinicId) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { id } = await context.params;
  const prisma = getPrisma();

  const pet = await prisma.pet.findFirst({
    where: { id, owner: { vetClinicId } },
    include: {
      owner: true,
      herd: true,
      vaccinations: {
        include: { vaccineType: true },
        orderBy: { administeredAt: "desc" },
      },
      appointments: {
        orderBy: [{ date: "desc" }, { time: "desc" }],
        take: 20,
        include: { vetDoctor: { select: { name: true } } },
      },
    },
  });

  if (!pet) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    pet: {
      id: pet.id,
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      sex: pet.sex,
      coatColor: pet.coatColor,
      birthDate: pet.birthDate,
      chipNumber: pet.chipNumber,
      chipDate: pet.chipDate,
      chipManufacturer: pet.chipManufacturer,
      safeAnimalStatus: pet.safeAnimalStatus,
      safeAnimalSyncedAt: pet.safeAnimalSyncedAt?.toISOString() ?? null,
      status: pet.status,
      notes: pet.notes,
      createdAt: pet.createdAt.toISOString(),
      owner: {
        id: pet.owner.id,
        name: pet.owner.name,
        phone: pet.owner.phone,
        email: pet.owner.email,
      },
      herd: pet.herd ? { id: pet.herd.id, name: pet.herd.name } : null,
      vaccinations: pet.vaccinations.map((v) => ({
        id: v.id,
        vaccineName: v.vaccineType.name,
        administeredAt: v.administeredAt.toISOString(),
        nextDueAt: v.nextDueAt.toISOString(),
        batchNumber: v.batchNumber,
        batchExpiryDate: v.batchExpiryDate,
        vetName: v.vetName,
        notes: v.notes,
      })),
      appointments: pet.appointments.map((a) => ({
        id: a.id,
        date: a.date,
        time: a.time,
        visitType: a.visitType,
        status: a.status,
        notes: a.notes,
        doctorName: a.vetDoctor?.name ?? null,
      })),
    },
  });
}
