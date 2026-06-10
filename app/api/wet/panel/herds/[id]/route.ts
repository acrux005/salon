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

  const herd = await prisma.vetHerd.findFirst({
    where: { id, vetClinicId },
    include: {
      owner: { select: { id: true, name: true, phone: true, email: true } },
      pets: {
        include: { owner: { select: { id: true, name: true } } },
        orderBy: { name: "asc" },
      },
    },
  });

  if (!herd) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    herd: {
      id: herd.id,
      name: herd.name,
      species: herd.species,
      location: herd.location,
      headCount: herd.headCount,
      notes: herd.notes,
      owner: herd.owner,
      pets: herd.pets.map((p) => ({
        id: p.id,
        name: p.name,
        species: p.species,
        breed: p.breed,
        chipNumber: p.chipNumber,
        status: p.status,
        ownerName: p.owner.name,
      })),
    },
  });
}
