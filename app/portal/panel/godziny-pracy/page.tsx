import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { ADMIN_ROLE } from "@/lib/auth";
import { getClinicByIdAsync } from "@/lib/skinmatch/clinics";
import { HeaderPortal } from "@/components/portal/HeaderPortal";
import { FooterPortal } from "@/components/portal/FooterPortal";
import { WorkingHoursForm } from "../kalendarz/WorkingHoursForm";

export default async function PanelGodzinyPracyPage() {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role === ADMIN_ROLE) redirect("/portal/admin");
  const clinicId = (session?.user as { clinicId?: string } | undefined)?.clinicId;
  if (!clinicId) redirect("/portal/login");

  const clinic = await getClinicByIdAsync(clinicId);
  if (!clinic) redirect("/portal/login");

  return (
    <>
      <HeaderPortal />
      <main className="min-h-screen bg-white py-12">
        <div className="mx-auto max-w-2xl px-4">
          <Link href="/portal/panel" className="text-[14px] font-medium text-pink-600 hover:underline">
            ← Panel
          </Link>
          <h1 className="mt-4 font-[var(--font-serif)] text-2xl font-normal text-[#1F1A1C]">
            Godziny pracy gabinetu
          </h1>
          <p className="mt-2 font-[var(--font-sans)] text-[15px] text-[#6F5E64]">
            Ustaw godziny otwarcia dla każdego dnia i dni bez rezerwacji (np. święta, urlop).
          </p>

          <div className="mt-8">
            <WorkingHoursForm
              initial={clinic.workingHours}
              initialNoOrderDays={clinic.kontakt?.noOrderDays}
            />
          </div>
        </div>
      </main>
      <FooterPortal />
    </>
  );
}
