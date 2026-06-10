import Link from "next/link";
import { redirect } from "next/navigation"
import { getWetRedirectPath } from "@/lib/wetRedirect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { VET_CLINIC_ROLE } from "@/lib/auth";
import { WetPanelPageHeader } from "@/components/wet/WetPanelPageHeader";

const EXAMPLE_PACKAGES = [
  {
    name: "Szczeniak Start",
    items: ["Szczepienie pierwsze", "Szczepienie drugie", "Kontrola po 2 tygodniach"],
  },
  {
    name: "Kot domowy",
    items: ["Szczepienie panleukopenii", "Kontrola roczna", "Odrobaczenie"],
  },
];

export default async function WetUstawieniaPakietyPage() {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== VET_CLINIC_ROLE) redirect(await getWetRedirectPath("/login"));
  if (!(session?.user as { vetClinicId?: string })?.vetClinicId) redirect(await getWetRedirectPath("/login"));

  return (
    <>
      <WetPanelPageHeader
        title="Pakiety wizyt"
        description="Schematy typu „Szczeniak Start” — uproszczone szablony, nie grupy towarów ERP."
      />
      <div className="px-4 py-6 lg:px-8">
        <div className="mx-auto max-w-xl space-y-6">
          <Link href="/wet/panel/ustawienia" className="text-[14px] font-medium text-wet-teal hover:underline">
            ← Ustawienia
          </Link>

          <div className="rounded-xl border border-wet-teal-100 bg-wet-teal-50/40 px-5 py-6">
            <p className="font-semibold text-wet-navy">W przygotowaniu</p>
            <p className="mt-2 text-[14px] text-wet-navy-muted">
              Pakiety to gotowe schematy wizyt i szczepień — bardzo pasują do VetHarmonogram. Na razie użyj{" "}
              <Link href="/wet/panel/katalog" className="font-medium text-wet-teal hover:underline">
                cennika
              </Link>{" "}
              i{" "}
              <Link href="/wet/panel/profilaktyka" className="font-medium text-wet-teal hover:underline">
                szablonów profilaktyki
              </Link>
              .
            </p>
          </div>

          <div>
            <p className="text-[13px] font-medium text-wet-navy-muted">Przykłady (docelowo edytowalne):</p>
            <ul className="mt-3 space-y-3">
              {EXAMPLE_PACKAGES.map((pkg) => (
                <li key={pkg.name} className="rounded-xl border border-wet-teal-200 bg-white p-4">
                  <p className="font-medium text-wet-navy">{pkg.name}</p>
                  <ul className="mt-2 list-disc space-y-0.5 pl-5 text-[13px] text-wet-navy-muted">
                    {pkg.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
