import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { GAB_CLINIC_ROLE } from "@/lib/auth";
import { getPrisma } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);
  const gabClinicId = (session?.user as { gabClinicId?: string })?.gabClinicId;
  if ((session?.user as { role?: string })?.role !== GAB_CLINIC_ROLE || !gabClinicId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const items = await getPrisma().gabTreatmentCatalogItem.findMany({
    where: { gabClinicId },
    orderBy: [{ active: "desc" }, { name: "asc" }],
  });
  return NextResponse.json({ items });
}
