import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { VET_CLINIC_ROLE } from "@/lib/auth";
import { getVetClinicBySlugAsync } from "@/lib/vet/clinics";
import { getPrisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const list = request.nextUrl.searchParams.get("list");
  if (list === "published") {
    const prisma = getPrisma();
    const clinics = await prisma.vetClinic.findMany({
      where: { isPublished: true },
      select: { slug: true, name: true, city: true },
      orderBy: [{ city: "asc" }, { name: "asc" }],
    });
    return NextResponse.json({ clinics });
  }

  const slug = request.nextUrl.searchParams.get("slug")?.trim();
  if (!slug) return NextResponse.json({ error: "Brak slug" }, { status: 400 });
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role;
  const sessionSlug = (session?.user as { vetClinicSlug?: string })?.vetClinicSlug;
  if (role !== VET_CLINIC_ROLE || sessionSlug !== slug) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const clinic = await getVetClinicBySlugAsync(slug);
  if (!clinic) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ clinic });
}
