import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { GAB_PATIENT_ROLE } from "@/lib/auth";
import { getGabinetRedirectPath } from "@/lib/gabinetRedirect";

export default async function GabPatientPanelLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== GAB_PATIENT_ROLE) {
    redirect(await getGabinetRedirectPath("/klient/logowanie?callbackUrl=/gabinet/klient/panel"));
  }
  return children;
}
