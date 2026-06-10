import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { ADMIN_ROLE } from "@/lib/auth";
import { getClinicByIdAsync } from "@/lib/skinmatch/clinics";
import { getStaffByClinicIdAsync } from "@/lib/skinmatch/staffDb";
import { HeaderPortal } from "@/components/portal/HeaderPortal";
import { FooterPortal } from "@/components/portal/FooterPortal";
import { PanelKalendarzClient } from "./PanelKalendarzClient";
import { KalendarzStaffSelector } from "./KalendarzStaffSelector";
import { CalendarOrPhoneOnly } from "./CalendarOrPhoneOnly";

export default async function PanelKalendarzPage() {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role === ADMIN_ROLE) redirect("/portal/admin");
  const clinicId = (session?.user as { clinicId?: string } | undefined)?.clinicId;
  if (!clinicId) redirect("/portal/login");

  const [clinic, staff] = await Promise.all([
    getClinicByIdAsync(clinicId),
    getStaffByClinicIdAsync(clinicId),
  ]);
  if (!clinic) redirect("/portal/login");

  return (
    <>
      <HeaderPortal />
      <main className="min-h-screen bg-white py-12">
        <div className="mx-auto max-w-4xl px-4">
          <Link href="/portal/panel" className="text-[14px] font-medium text-pink-600 hover:underline">
            ← Panel
          </Link>
          <h1 className="mt-4 font-[var(--font-serif)] text-2xl font-normal text-[#1F1A1C]">
            Kalendarz wizyt
          </h1>
          <p className="mt-2 font-[var(--font-sans)] text-[15px] text-[#6F5E64]">
            {staff.length > 0
              ? "Wybierz pracownika, aby zobaczyć jego kalendarz. Oznacz wizytę jako zrealizowaną lub anuluj."
              : "Wizyty z kalendarza gabinetu. Oznacz jako zrealizowaną lub anuluj."}
          </p>

          <div className="mt-8">
            <CalendarOrPhoneOnly
              bookingPhoneOnly={clinic.bookingPhoneOnly ?? false}
              phone={clinic.kontakt?.phone}
            >
              {staff.length > 0 ? (
                <KalendarzStaffSelector
                  clinicSlug={clinic.slug}
                  staff={staff}
                  noOrderDays={clinic.kontakt?.noOrderDays ?? []}
                />
              ) : (
                <PanelKalendarzClient clinicSlug={clinic.slug} noOrderDays={clinic.kontakt?.noOrderDays ?? []} />
              )}
            </CalendarOrPhoneOnly>
          </div>
        </div>
      </main>
      <FooterPortal />
    </>
  );
}
