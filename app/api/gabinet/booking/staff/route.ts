import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const gabSlug =
    request.nextUrl.searchParams.get("gab_slug")?.trim() ||
    request.nextUrl.searchParams.get("clinic_slug")?.trim();
  if (!gabSlug) {
    return NextResponse.json({ staff: [] });
  }
  const clinic = await getPrisma().gabClinic.findUnique({
    where: { slug: gabSlug },
    select: { id: true },
  });
  if (!clinic) return NextResponse.json({ staff: [] });
  const staff = await getPrisma().gabStaff.findMany({
    where: { gabClinicId: clinic.id, active: true },
    orderBy: [{ order: "asc" }, { name: "asc" }],
  });
  return NextResponse.json({
    staff: staff.map((s) => ({ id: s.id, name: s.name, phone: s.phone })),
  });
}
