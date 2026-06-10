import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getPrisma } from "@/lib/db";
import { PLAN_STATUS_LABELS, formatFdiLabel } from "@/lib/gabinet/fdiTeeth";
import { GabPrintButton } from "./GabPrintButton";

export default async function GabPlanPrintPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const gabClinicId = (session?.user as { gabClinicId?: string })?.gabClinicId;
  if (!gabClinicId) notFound();

  const plan = await getPrisma().gabTreatmentPlan.findFirst({
    where: { id, gabClinicId },
    include: {
      patient: { select: { name: true, phone: true } },
      gabClinic: { select: { name: true, phone: true, address: true, city: true } },
      items: { orderBy: { sortOrder: "asc" } },
    },
  });
  if (!plan) notFound();

  return (
    <main className="mx-auto max-w-2xl px-6 py-10 print:p-4">
      <style>{`@media print { body { print-color-adjust: exact; } }`}</style>
      <p className="text-[12px] uppercase tracking-wide text-slate-500">{plan.gabClinic.name}</p>
      <h1 className="mt-2 text-2xl font-bold text-gab-navy">Plan leczenia</h1>
      <p className="mt-1 text-[14px] text-slate-600">
        Pacjent: {plan.patient.name} · {plan.patient.phone}
      </p>
      <p className="text-[14px] text-slate-600">
        {plan.gabClinic.city}
        {plan.gabClinic.address ? ` · ${plan.gabClinic.address}` : ""}
        {plan.gabClinic.phone ? ` · tel. ${plan.gabClinic.phone}` : ""}
      </p>
      <p className="mt-4 font-semibold text-gab-navy">{plan.title}</p>
      <p className="text-[13px] text-slate-500">
        Status: {PLAN_STATUS_LABELS[plan.status] ?? plan.status} · Suma: {plan.totalPln.toFixed(2)} PLN
      </p>
      <table className="mt-6 w-full text-left text-[14px]">
        <thead>
          <tr className="border-b border-slate-200 text-[12px] uppercase text-slate-500">
            <th className="py-2">Etap</th>
            <th className="py-2">Ząb</th>
            <th className="py-2 text-right">Cena</th>
          </tr>
        </thead>
        <tbody>
          {plan.items.map((item) => (
            <tr key={item.id} className="border-b border-slate-100">
              <td className="py-2">{item.title}</td>
              <td className="py-2">{item.toothFdi ? formatFdiLabel(item.toothFdi) : "—"}</td>
              <td className="py-2 text-right">{item.pricePln.toFixed(2)} PLN</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-6 text-[12px] text-slate-400">
        Wygenerowano {new Date().toLocaleString("pl-PL")} · GabinetHarmonogram
      </p>
      <GabPrintButton />
    </main>
  );
}
