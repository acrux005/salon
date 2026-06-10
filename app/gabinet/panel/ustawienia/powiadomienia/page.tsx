import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getPrisma } from "@/lib/db";
import { gabPrisma } from "@/lib/gabinet/prismaGab";
import { getGabNotifyDeliveryLog } from "@/lib/gabinet/notifyLog";
import { getGabNotifyStatus } from "@/lib/gabinet/notifyStatus";
import { GabLink } from "@/components/gabinetPlatform/GabLink";
import { GabPanelPageHeader } from "@/components/gabinetPlatform/GabPanelPageHeader";
import { GabPowiadomieniaClient } from "./GabPowiadomieniaClient";

export default async function GabPowiadomieniaPage() {
  const session = await getServerSession(authOptions);
  const gabClinicId = (session?.user as { gabClinicId?: string })?.gabClinicId ?? "";

  const status = getGabNotifyStatus();
  const log = gabClinicId ? await getGabNotifyDeliveryLog(gabClinicId) : [];

  let defaultPhone = "";
  let defaultEmail = "";
  if (gabClinicId) {
    const [clinic, account] = await Promise.all([
      gabPrisma().gabClinic.findUnique({ where: { id: gabClinicId }, select: { phone: true, email: true } }),
      getPrisma().gabClinicAccount.findFirst({ where: { gabClinicId }, select: { email: true } }),
    ]);
    defaultPhone = clinic?.phone ?? "";
    defaultEmail = account?.email ?? clinic?.email ?? "";
  }

  return (
    <>
      <GabPanelPageHeader
        title="Powiadomienia"
        description="Status kanałów, test wysyłki i log dostarczeń."
      />
      <div className="px-4 py-6 lg:px-8">
        <GabLink href="/panel/ustawienia" className="mb-6 inline-block text-[14px] font-medium text-gab-sky hover:underline">
          ← Ustawienia
        </GabLink>
        <GabPowiadomieniaClient
          status={status}
          log={log}
          defaultPhone={defaultPhone}
          defaultEmail={defaultEmail}
        />
      </div>
    </>
  );
}
