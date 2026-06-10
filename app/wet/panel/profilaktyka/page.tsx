import { redirect } from "next/navigation"
import { getWetRedirectPath } from "@/lib/wetRedirect";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { VET_CLINIC_ROLE } from "@/lib/auth";
import { WetPanelPageHeader } from "@/components/wet/WetPanelPageHeader";
import {
  PREVENTION_CATALOG_TEMPLATES,
  PREVENTION_KIND_LABELS,
  PREVENTION_PLANS,
  PREVENTION_PRIORITY_LABELS,
} from "@/lib/vet/preventionPlans";
import { WetSeedPreventionCatalogButton } from "@/components/wet/WetSeedPreventionCatalogButton";

export default async function WetProfilaktykaPage() {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== VET_CLINIC_ROLE) redirect(await getWetRedirectPath("/login"));

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <Link href="/wet/panel" className="text-[14px] font-medium text-wet-teal hover:underline">
        ← Panel
      </Link>
      <WetPanelPageHeader
        title="Wytyczne profilaktyki"
        description="Plany szczepień, badań i odrobaczeń dla większości gatunków — WSAVA, PIWet, programy PGWIR i przepisy PL."
      />

      <div className="mb-8 rounded-xl border border-wet-teal-100 bg-wet-teal-50/40 px-4 py-4 text-[14px] text-wet-navy">
        <p className="font-medium text-wet-teal-900">Źródła</p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-wet-navy-muted">
          <li>WSAVA — szczepienia psów i kotów</li>
          <li>PIWet — małe zwierzęta, egzoty, konie, drób</li>
          <li>Program zwalczania wścieklizny, brucelozy i CSF (ARiMR / PGWIR)</li>
        </ul>
        <p className="mt-3 text-[13px] text-wet-navy-muted">
          Klient widzi plan w portalu właściciela. Plany są punktem wyjścia — ostateczny protokół ustala lekarz.
        </p>
        <p className="mt-2 text-[13px] font-medium text-wet-teal-800">
          {PREVENTION_PLANS.length} planów m.in. dla: psa, kota, królika, fretki, alpak, żółwia, konia, bydła, owcy, świni, drobiu i innych.
        </p>
      </div>

      <WetSeedPreventionCatalogButton templateCount={PREVENTION_CATALOG_TEMPLATES.length} />

      {PREVENTION_PLANS.map((plan) => (
        <section key={plan.id} className="mb-10">
          <h2 className="text-xl font-bold text-wet-navy">{plan.label}</h2>
          <p className="mt-2 text-[15px] text-wet-navy-muted">{plan.summary}</p>
          {plan.sources.length > 0 && (
            <p className="mt-1 text-[12px] text-wet-navy-muted">Źródła: {plan.sources.join(" · ")}</p>
          )}
          <div className="mt-4 overflow-hidden rounded-xl border border-wet-teal-200 bg-white">
            <table className="w-full text-left text-[14px]">
              <thead className="border-b border-wet-teal-100 bg-wet-teal-50/80 text-[12px] font-semibold uppercase tracking-wide text-wet-navy-muted">
                <tr>
                  <th className="px-4 py-3">Pozycja</th>
                  <th className="hidden px-4 py-3 sm:table-cell">Typ</th>
                  <th className="px-4 py-3">Priorytet</th>
                </tr>
              </thead>
              <tbody>
                {plan.items.map((item) => (
                  <tr key={item.key} className="border-b border-wet-teal-50 last:border-0">
                    <td className="px-4 py-3">
                      <p className="font-medium">{item.title}</p>
                      <p className="mt-0.5 text-[12px] text-wet-navy-muted">{item.description}</p>
                      {item.doseWeeks && (
                        <p className="mt-0.5 text-[12px] text-wet-teal-700">
                          Terminy: {item.doseWeeks.map((w) => `${w}. tydz.`).join(", ")}
                          {item.repeatIntervalDays ? ` · potem co ${item.repeatIntervalDays} dni` : ""}
                        </p>
                      )}
                      {!item.doseWeeks && item.repeatIntervalDays && (
                        <p className="mt-0.5 text-[12px] text-wet-teal-700">Co {item.repeatIntervalDays} dni</p>
                      )}
                    </td>
                    <td className="hidden px-4 py-3 text-[13px] sm:table-cell">{PREVENTION_KIND_LABELS[item.kind]}</td>
                    <td className="px-4 py-3 text-[13px]">{PREVENTION_PRIORITY_LABELS[item.priority]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </main>
  );
}
