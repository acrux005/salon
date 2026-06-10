import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getPrisma } from "@/lib/db";
import { GabPanelPageHeader } from "@/components/gabinetPlatform/GabPanelPageHeader";
import { GabSchedulesClient } from "./GabSchedulesClient";

export default async function GabSchedulesPage() {
  const session = await getServerSession(authOptions);
  const gabClinicId = (session?.user as { gabClinicId?: string })?.gabClinicId;
  const schedules = gabClinicId
    ? await getPrisma().gabClientMessageSchedule.findMany({
        where: { gabClinicId },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <>
      <GabPanelPageHeader
        title="Wiadomości cykliczne"
        description="Kampanie SMS/e-mail do wszystkich klientów gabinetu."
      />
      <div className="px-4 py-6 lg:px-8">
        <GabSchedulesClient schedules={schedules} />
      </div>
    </>
  );
}
