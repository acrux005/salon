import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getPrisma } from "@/lib/db";
import { GabPanelPageHeader } from "@/components/gabinetPlatform/GabPanelPageHeader";
import { GabPlanyClient } from "./GabPlanyClient";

export default async function GabPlanyLeczeniaPage() {
  const session = await getServerSession(authOptions);
  const gabClinicId = (session?.user as { gabClinicId?: string })?.gabClinicId;

  const [plans, patients] = gabClinicId
    ? await Promise.all([
        getPrisma().gabTreatmentPlan.findMany({
          where: { gabClinicId },
          include: { patient: { select: { name: true } } },
          orderBy: { updatedAt: "desc" },
          take: 50,
        }),
        getPrisma().gabPatient.findMany({
          where: { gabClinicId, status: "active" },
          select: { id: true, name: true },
          orderBy: { name: "asc" },
        }),
      ])
    : [[], []];

  return (
    <>
      <GabPanelPageHeader
        title="Plany leczenia"
        description="Etapy leczenia i kosztorysy przypisane do pacjentów."
      />
      <div className="px-4 py-6 lg:px-8">
        <GabPlanyClient plans={plans} patients={patients} />
      </div>
    </>
  );
}
