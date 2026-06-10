import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { GAB_CLINIC_ROLE } from "@/lib/auth";
import { getPrisma } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== GAB_CLINIC_ROLE) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const gabClinicId = (session?.user as { gabClinicId?: string })?.gabClinicId;
  if (!gabClinicId) return NextResponse.json({ patients: [] });

  const patients = await getPrisma().gabPatient.findMany({
    where: { gabClinicId, status: "active" },
    orderBy: { name: "asc" },
    select: { id: true, name: true, phone: true, email: true },
  });

  return NextResponse.json({ patients });
}
