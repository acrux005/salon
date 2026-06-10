import { redirect } from "next/navigation"
import { getWetRedirectPath } from "@/lib/wetRedirect";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { VET_CLINIC_ROLE } from "@/lib/auth";
import { getVetClinicByIdAsync, getVetDoctorsByClinicIdAsync } from "@/lib/vet/clinics";
import { WetPanelKalendarzClient } from "./WetPanelKalendarzClient";
import { WetCalendarSyncPanel } from "@/components/wet/WetCalendarSyncPanel";

export default async function WetPanelKalendarzPage() {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== VET_CLINIC_ROLE) redirect(await getWetRedirectPath("/login"));
  const vetClinicId = (session?.user as { vetClinicId?: string })?.vetClinicId;
  if (!vetClinicId) redirect(await getWetRedirectPath("/login"));

  const [clinic, doctors] = await Promise.all([
    getVetClinicByIdAsync(vetClinicId),
    getVetDoctorsByClinicIdAsync(vetClinicId),
  ]);
  if (!clinic) redirect(await getWetRedirectPath("/login"));

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <Link href="/wet/panel" className="text-[14px] font-medium text-wet-teal hover:underline">
        ← Panel
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-wet-navy">Kalendarz wizyt</h1>
      <p className="mt-2 text-[15px] text-wet-navy-muted">
        Recepcja-first: plan dnia, szybkie dodawanie, typy wizyt i statusy. Kliknij wizytę → karta zwierzęcia.
      </p>
      <div className="mt-8">
        <WetPanelKalendarzClient
          vetSlug={clinic.slug}
          doctors={doctors.map((d) => ({ id: d.id, name: d.name }))}
          noOrderDays={clinic.noOrderDays ?? []}
        />
      </div>
      <WetCalendarSyncPanel />
    </main>
  );
}
