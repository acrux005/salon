"use client";

import { useRouter } from "next/navigation";
import { cancelGabAppointmentPatientAction } from "@/app/actions/gabinet";
import { visitTypeLabel } from "@/lib/gabinet/visitTypes";
import { visitStatusLabel } from "@/lib/gabinet/visitStatus";

type Appt = {
  id: string;
  date: string;
  time: string;
  visitType: string | null;
  status: string;
  clinicName: string;
  clinicPhone: string | null;
};

export function GabPatientAppointmentsList({ appointments }: { appointments: Appt[] }) {
  const router = useRouter();

  async function cancel(id: string) {
    if (!confirm("Anulować wizytę?")) return;
    const res = await cancelGabAppointmentPatientAction(id);
    if (res.ok) router.refresh();
    else alert(res.error);
  }

  if (appointments.length === 0) {
    return <p className="mt-2 text-[14px] text-slate-500">Brak zaplanowanych wizyt.</p>;
  }

  return (
    <ul className="mt-4 space-y-3">
      {appointments.map((a) => (
        <li key={a.id} className="rounded-lg border border-slate-100 px-3 py-2 text-[14px]">
          <p className="font-medium text-gab-navy">
            {a.date} · {a.time} — {a.clinicName}
          </p>
          <p className="text-slate-500">
            {visitTypeLabel(a.visitType)} · {visitStatusLabel(a.status)}
            {a.clinicPhone ? ` · tel. ${a.clinicPhone}` : ""}
          </p>
          <button type="button" onClick={() => cancel(a.id)} className="mt-2 text-[13px] text-red-600 hover:underline">
            Anuluj wizytę
          </button>
        </li>
      ))}
    </ul>
  );
}
