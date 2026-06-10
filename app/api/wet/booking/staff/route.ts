import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const vetSlug = request.nextUrl.searchParams.get("vet_slug")?.trim();
  if (!vetSlug) {
    return NextResponse.json({ staff: [] });
  }
  const prisma = getPrisma();
  const clinic = await prisma.vetClinic.findUnique({
    where: { slug: vetSlug },
    select: { id: true },
  });
  if (!clinic) return NextResponse.json({ staff: [] });
  const doctors = await prisma.vetDoctor.findMany({
    where: { vetClinicId: clinic.id, active: true },
    orderBy: [{ order: "asc" }, { name: "asc" }],
  });
  return NextResponse.json({
    staff: doctors.map((d, i) => ({
      id: d.id,
      name: d.name,
      phone: d.phone,
    })),
  });
}
