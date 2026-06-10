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
  if (!vetClinicId) return NextResponse.json({ messages: [] });

  const prisma = getPrisma();
  const messages = await prisma.vetClientMessage.findMany({
    where: { vetClinicId },
    include: { owner: { select: { id: true, name: true, phone: true } } },
    orderBy: { sentAt: "desc" },
    take: 100,
  });
  return NextResponse.json({ messages });
}
