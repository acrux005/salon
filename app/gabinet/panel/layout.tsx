import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { GAB_CLINIC_ROLE } from "@/lib/auth";
import { getPrisma } from "@/lib/db";
import { getGabinetRedirectPath } from "@/lib/gabinetRedirect";
import { GabPanelLayoutClient } from "@/components/gabinetPlatform/GabPanelLayoutClient";

export default async function GabPanelLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role;
  if (role !== GAB_CLINIC_ROLE) {
    redirect(await getGabinetRedirectPath("/login?callbackUrl=/gabinet/panel"));
  }
  const gabClinicId = (session?.user as { gabClinicId?: string })?.gabClinicId;
  if (!gabClinicId) redirect(await getGabinetRedirectPath("/login"));

  const account = await getPrisma().gabClinicAccount.findFirst({
    where: { gabClinicId },
    select: { emailVerifiedAt: true },
  });
  const emailUnverified = !!account && !account.emailVerifiedAt;

  return (
    <GabPanelLayoutClient emailUnverified={emailUnverified}>
      {children}
    </GabPanelLayoutClient>
  );
}
