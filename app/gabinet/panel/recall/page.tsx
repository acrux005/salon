import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getPrisma } from "@/lib/db";
import { GabPanelPageHeader } from "@/components/gabinetPlatform/GabPanelPageHeader";
import { GabRecallClient } from "./GabRecallClient";

export default async function GabRecallPage() {
  const session = await getServerSession(authOptions);
  const gabClinicId = (session?.user as { gabClinicId?: string })?.gabClinicId;
  const rules = gabClinicId
    ? await getPrisma().gabRecallRule.findMany({
        where: { gabClinicId },
        orderBy: { name: "asc" },
      })
    : [];
  const pendingReminders = gabClinicId
    ? await getPrisma().gabScheduledReminder.findMany({
        where: {
          gabClinicId,
          sentAt: null,
          sendAt: { lte: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) },
        },
        orderBy: { sendAt: "asc" },
        take: 20,
      })
    : [];

  return (
    <>
      <GabPanelPageHeader
        title="Recall"
        description="Automatyczne przypomnienia po zakończonej wizycie — SMS lub e-mail."
      />
      <div className="px-4 py-6 lg:px-8">
        <GabRecallClient initialRules={rules} pendingReminders={pendingReminders} />
      </div>
    </>
  );
}
