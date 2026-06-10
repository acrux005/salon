import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { GAB_CLINIC_ROLE } from "@/lib/auth";
import { gabPrisma } from "@/lib/gabinet/prismaGab";

export async function GET() {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== GAB_CLINIC_ROLE) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const gabClinicId = (session?.user as { gabClinicId?: string })?.gabClinicId;
  if (!gabClinicId) return NextResponse.json({ settlements: [] });

  try {
    const settlements = await gabPrisma().gabClientSettlement.findMany({
      where: { gabClinicId },
      orderBy: { createdAt: "desc" },
      include: { client: { select: { name: true, phone: true } } },
    });
    return NextResponse.json({ settlements });
  } catch {
    return NextResponse.json({ settlements: [] });
  }
}
