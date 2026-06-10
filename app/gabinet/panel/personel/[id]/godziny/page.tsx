import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getPrisma } from "@/lib/db";
import { parseGabWorkingHours } from "@/lib/gabinet/workingHours";
import { GabStaffHoursClient } from "./GabStaffHoursClient";

export default async function GabStaffHoursPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const gabClinicId = (await getServerSession(authOptions))?.user as { gabClinicId?: string };
  const clinicId = gabClinicId?.gabClinicId ?? "";

  const staff = await getPrisma().gabStaff.findFirst({ where: { id, gabClinicId: clinicId } });
  if (!staff) notFound();

  const initialHours = staff.workingHours ? parseGabWorkingHours(staff.workingHours) ?? null : null;

  return (
    <GabStaffHoursClient
      staffId={staff.id}
      staffName={staff.name}
      useClinicHours={!staff.workingHours}
      initialHours={initialHours}
    />
  );
}
