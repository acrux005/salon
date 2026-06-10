import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { GAB_CLINIC_ROLE } from "@/lib/auth";
import { getPrisma } from "@/lib/db";
import { getGabinetRedirectPath } from "@/lib/gabinetRedirect";
import { GabPanelPageHeader } from "@/components/gabinetPlatform/GabPanelPageHeader";
import { GabClinicAccountClient } from "./GabClinicAccountClient";

export default async function GabClinicAccountPage() {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== GAB_CLINIC_ROLE) {
    redirect(await getGabinetRedirectPath("/login"));
  }
  const gabClinicId = (session?.user as { gabClinicId?: string })?.gabClinicId;
  if (!gabClinicId) redirect(await getGabinetRedirectPath("/login"));

  const account = await getPrisma().gabClinicAccount.findFirst({ where: { gabClinicId } });
  if (!account) redirect(await getGabinetRedirectPath("/login"));

  return (
    <>
      <GabPanelPageHeader title="Moje konto" description="Hasło administratora i weryfikacja e-mail." />
      <div className="px-4 py-6 lg:px-8">
        <GabClinicAccountClient email={account.email} emailVerified={!!account.emailVerifiedAt} />
      </div>
    </>
  );
}
