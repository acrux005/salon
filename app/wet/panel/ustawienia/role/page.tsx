import Link from "next/link";
import { redirect } from "next/navigation"
import { getWetRedirectPath } from "@/lib/wetRedirect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { VET_CLINIC_ROLE } from "@/lib/auth";
import { WetPanelPageHeader } from "@/components/wet/WetPanelPageHeader";

export default async function WetUstawieniaRolePage() {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== VET_CLINIC_ROLE) redirect(await getWetRedirectPath("/login"));
  if (!(session?.user as { vetClinicId?: string })?.vetClinicId) redirect(await getWetRedirectPath("/login"));

  return (
    <>
      <WetPanelPageHeader title="Role pracowników" description="Recepcja, lekarz, admin — bez ERP i magazynu." />
      <div className="px-4 py-6 lg:px-8">
        <div className="mx-auto max-w-xl space-y-6">
          <Link href="/wet/panel/ustawienia" className="text-[14px] font-medium text-wet-teal hover:underline">
            ← Ustawienia
          </Link>
          <div className="rounded-xl border border-wet-teal-100 bg-wet-teal-50/40 px-5 py-8 text-center">
            <p className="font-semibold text-wet-navy">Wkrótce</p>
            <p className="mt-2 text-[14px] text-wet-navy-muted">
              Na razie każda przychodnia ma jedno konto logowania. Lekarze są w module{" "}
              <Link href="/wet/panel/lekarze" className="font-medium text-wet-teal hover:underline">
                Pracownicy
              </Link>{" "}
              — przypisani do kalendarza, bez osobnych haseł i bez magazynu.
            </p>
            <p className="mt-4 text-[13px] text-wet-navy-muted">
              Role (recepcja / lekarz / właściciel) dodamy, gdy pojawi się multi-user — nadal lekko, nie jak
              Veterinaro.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
