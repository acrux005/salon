import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { GAB_CLINIC_ROLE } from "@/lib/auth";
import { getGabClinicByIdAsync, getGabStaffByClinicIdAsync } from "@/lib/gabinet/clinics";
import { getGabinetRedirectPath } from "@/lib/gabinetRedirect";
import { GabPanelPageHeader } from "@/components/gabinetPlatform/GabPanelPageHeader";
import { GabPanelKalendarzClient } from "./GabPanelKalendarzClient";

export default async function GabPanelKalendarzPage() {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== GAB_CLINIC_ROLE) {
    redirect(await getGabinetRedirectPath("/login"));
  }
  const gabClinicId = (session?.user as { gabClinicId?: string })?.gabClinicId;
  if (!gabClinicId) redirect(await getGabinetRedirectPath("/login"));

  const [clinic, staff] = await Promise.all([
    getGabClinicByIdAsync(gabClinicId),
    getGabStaffByClinicIdAsync(gabClinicId),
  ]);
  if (!clinic) redirect(await getGabinetRedirectPath("/login"));

  return (
    <>
      <GabPanelPageHeader
        title="Kalendarz wizyt"
        description="Plan dnia, rezerwacje online i statusy wizyt."
      />
      <GabPanelKalendarzClient
        gabSlug={clinic.slug}
        staff={staff.map((s) => ({ id: s.id, name: s.name }))}
      />
    </>
  );
}
