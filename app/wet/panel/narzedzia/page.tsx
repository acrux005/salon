import Link from "next/link";
import { redirect } from "next/navigation"
import { getWetRedirectPath } from "@/lib/wetRedirect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { VET_CLINIC_ROLE } from "@/lib/auth";
import { getClinicLightStats } from "@/lib/vet/clinicStats";
import { WetPanelPageHeader } from "@/components/wet/WetPanelPageHeader";
import {
  BarChart3,
  Download,
  FileText,
} from "lucide-react";

const TOOLS = [
  {
    href: "/wet/panel/narzedzia/raporty",
    label: "Raporty medyczne",
    description: "Historia szczepień, raport stada, historia wizyt — do druku lub kontroli.",
    icon: FileText,
  },
  {
    href: "/wet/panel/ustawienia",
    label: "Import, eksport, archiwum",
    description: "Dane i backup — w sekcji Ustawienia → Dane.",
    icon: Download,
  },
] as const;

export default async function WetNarzedziaPage() {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== VET_CLINIC_ROLE) redirect(await getWetRedirectPath("/login"));
  const vetClinicId = (session?.user as { vetClinicId?: string })?.vetClinicId;
  if (!vetClinicId) redirect(await getWetRedirectPath("/login"));

  const stats = await getClinicLightStats(vetClinicId);

  return (
    <>
      <WetPanelPageHeader
        title="Narzędzia"
        description="Import, eksport, raporty i archiwum — bez ERP, bez księgowości."
      />
      <div className="px-4 py-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-8">
          <section className="rounded-xl border border-wet-teal-100 bg-wet-teal-50/40 p-4">
            <div className="mb-3 flex items-center gap-2 text-wet-teal-900">
              <BarChart3 className="h-5 w-5" aria-hidden />
              <h2 className="font-semibold">Statystyki gabinetu</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <StatBox label="Aktywne zwierzęta" value={stats.petsActive} />
              <StatBox label="Właściciele" value={stats.owners} />
              <StatBox label="Szczepienia (30 dni)" value={stats.vaccinationsLast30Days} />
              <StatBox label="Wizyty (30 dni)" value={stats.appointmentsLast30Days} />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <StatBox label="SMS wysłane" value={stats.smsSent} sub={`${stats.smsScheduled} zaplanowanych`} />
              <StatBox label="E-mail wysłane" value={stats.emailSent} />
              <StatBox label="W archiwum" value={stats.petsArchived} sub="zmarłe / przeniesione" />
            </div>
            {(stats.topVisitTypes.length > 0 || stats.topVaccines.length > 0) && (
              <div className="mt-4 grid gap-4 sm:grid-cols-2 text-[13px]">
                {stats.topVisitTypes.length > 0 && (
                  <div>
                    <p className="font-medium text-wet-navy">Popularne wizyty</p>
                    <ul className="mt-1 space-y-0.5 text-wet-navy-muted">
                      {stats.topVisitTypes.map((v) => (
                        <li key={v.type}>
                          {v.type}: <strong>{v.count}</strong>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {stats.topVaccines.length > 0 && (
                  <div>
                    <p className="font-medium text-wet-navy">Szczepionki (30 dni)</p>
                    <ul className="mt-1 space-y-0.5 text-wet-navy-muted">
                      {stats.topVaccines.map((v) => (
                        <li key={v.name}>
                          {v.name}: <strong>{v.count}</strong>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </section>

          <div className="grid gap-4 sm:grid-cols-2">
            {TOOLS.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group rounded-xl border border-wet-teal-200 bg-white p-5 transition hover:border-wet-teal-400 hover:shadow-md"
              >
                <tool.icon className="h-6 w-6 text-wet-teal" aria-hidden />
                <h3 className="mt-3 font-semibold text-wet-navy group-hover:text-wet-teal-800">{tool.label}</h3>
                <p className="mt-1 text-[13px] text-wet-navy-muted">{tool.description}</p>
              </Link>
            ))}
          </div>

          <p className="text-[12px] text-wet-navy-muted">
            Raporty sprzedażowe, magazyn i księgowość celowo nie są w VetHarmonogram — to moduł harmonogramu, historii
            medycznej i komunikacji z klientem.
          </p>
        </div>
      </div>
    </>
  );
}

function StatBox({ label, value, sub }: { label: string; value: number; sub?: string }) {
  return (
    <div className="rounded-lg border border-white bg-white/80 px-3 py-2">
      <p className="text-[11px] uppercase tracking-wide text-wet-navy-muted">{label}</p>
      <p className="text-xl font-bold text-wet-navy">{value.toLocaleString("pl-PL")}</p>
      {sub && <p className="text-[11px] text-wet-navy-muted">{sub}</p>}
    </div>
  );
}
