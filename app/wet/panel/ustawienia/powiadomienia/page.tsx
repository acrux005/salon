import Link from "next/link";
import { redirect } from "next/navigation"
import { getWetRedirectPath } from "@/lib/wetRedirect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { VET_CLINIC_ROLE } from "@/lib/auth";
import { getVetSettingsSnapshot } from "@/app/actions/vetSettings";
import { WetAlertPolicyForm } from "@/components/wet/settings/WetAlertPolicyForm";
import { WetPanelPageHeader } from "@/components/wet/WetPanelPageHeader";

export default async function WetUstawieniaPowiadomieniaPage() {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== VET_CLINIC_ROLE) redirect(await getWetRedirectPath("/login"));
  const vetClinicId = (session?.user as { vetClinicId?: string })?.vetClinicId;
  if (!vetClinicId) redirect(await getWetRedirectPath("/login"));

  const snapshot = await getVetSettingsSnapshot(vetClinicId);

  return (
    <>
      <WetPanelPageHeader
        title="SMS i przypomnienia"
        description="Treść przypomnień, dni wysyłki, kanały — bez faktur i bramki ERP."
      />
      <div className="px-4 py-6 lg:px-8">
        <div className="mx-auto max-w-xl space-y-6">
          <Link href="/wet/panel/ustawienia" className="text-[14px] font-medium text-wet-teal hover:underline">
            ← Ustawienia
          </Link>
          <div className="rounded-xl border border-wet-teal-200 bg-white p-5">
            <WetAlertPolicyForm initial={snapshot.alertPolicy} />
          </div>
        </div>
      </div>
    </>
  );
}
