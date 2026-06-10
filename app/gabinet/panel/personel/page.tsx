import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getPrisma } from "@/lib/db";
import { GabStaffClient } from "./GabStaffClient";

export default async function GabPersonelPage() {
  const gabClinicId = (await getServerSession(authOptions))?.user as { gabClinicId?: string };
  const id = gabClinicId?.gabClinicId ?? "";
  const staff = id
    ? await getPrisma().gabStaff.findMany({
        where: { gabClinicId: id },
        orderBy: [{ order: "asc" }, { name: "asc" }],
      })
    : [];
  return <GabStaffClient staff={staff} />;
}
