import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { GAB_CLINIC_ROLE } from "@/lib/auth";
import { getPrisma } from "@/lib/db";
import { GabTeamClient } from "./GabTeamClient";

export default async function GabTeamPage() {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== GAB_CLINIC_ROLE) redirect("/gabinet/login");
  if ((session?.user as { gabMemberId?: string })?.gabMemberId) redirect("/gabinet/panel/ustawienia");

  const gabClinicId = (session?.user as { gabClinicId?: string })?.gabClinicId ?? "";
  const members = gabClinicId
    ? await getPrisma().gabClinicMember.findMany({
        where: { gabClinicId, active: true },
        orderBy: { createdAt: "asc" },
        select: { id: true, name: true, email: true, role: true, active: true },
      })
    : [];

  return <GabTeamClient members={members} />;
}
