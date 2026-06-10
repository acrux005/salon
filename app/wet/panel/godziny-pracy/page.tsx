import { redirect } from "next/navigation"
import { getWetRedirectPath } from "@/lib/wetRedirect";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { VET_CLINIC_ROLE } from "@/lib/auth";
import { getVetClinicByIdAsync } from "@/lib/vet/clinics";
import { WetWorkingHoursForm } from "@/components/wet/WetWorkingHoursForm";

export default async function WetPanelHoursPage() {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== VET_CLINIC_ROLE) redirect(await getWetRedirectPath("/login"));
  const vetClinicId = (session?.user as { vetClinicId?: string })?.vetClinicId;
  if (!vetClinicId) redirect(await getWetRedirectPath("/login"));
  const clinic = await getVetClinicByIdAsync(vetClinicId);
  if (!clinic) redirect(await getWetRedirectPath("/login"));

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <Link href="/wet/panel" className="text-[14px] font-medium text-wet-teal hover:underline">
        ← Panel
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-wet-navy">Godziny pracy</h1>
      <p className="mt-2 text-[15px] text-wet-navy-muted">Godziny otwarcia i dni bez rezerwacji.</p>
      <div className="mt-8">
        <WetWorkingHoursForm initial={clinic.workingHours} initialNoOrderDays={clinic.noOrderDays} />
      </div>
    </main>
  );
}
