import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { VET_CLINIC_ROLE } from "@/lib/auth";
import { getPrisma } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== VET_CLINIC_ROLE) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const vetClinicId = (session?.user as { vetClinicId?: string })?.vetClinicId;
  if (!vetClinicId) return NextResponse.json({ pets: [] });

  const prisma = getPrisma();
  const pets = await prisma.pet.findMany({
    where: { owner: { vetClinicId } },
    include: {
      owner: { select: { id: true, name: true, phone: true } },
      herd: { select: { id: true, name: true } },
    },
    orderBy: [{ name: "asc" }],
  });

  return NextResponse.json({
    pets: pets.map((p) => ({
      id: p.id,
      name: p.name,
      species: p.species,
      photoUrl: p.photoUrl,
      breed: p.breed,
      sex: p.sex,
      coatColor: p.coatColor,
      birthDate: p.birthDate,
      chipNumber: p.chipNumber,
      chipDate: p.chipDate,
      chipManufacturer: p.chipManufacturer,
      safeAnimalStatus: p.safeAnimalStatus,
      safeAnimalSyncedAt: p.safeAnimalSyncedAt,
      notes: p.notes,
      status: p.status,
      owner: p.owner,
      herd: p.herd,
    })),
  });
}
