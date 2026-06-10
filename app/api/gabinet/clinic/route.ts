import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { GAB_CLINIC_ROLE } from "@/lib/auth";
import { gabPrisma } from "@/lib/gabinet/prismaGab";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role;
  const sessionSlug = (session?.user as { gabClinicSlug?: string })?.gabClinicSlug;
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  if (role !== GAB_CLINIC_ROLE || !sessionSlug || sessionSlug !== slug) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const clinic = await gabPrisma().gabClinic.findUnique({ where: { slug: sessionSlug } });
    return NextResponse.json({ clinic });
  } catch {
    return NextResponse.json({ clinic: null });
  }
}
