"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveGabTreatmentPlanAction } from "@/app/actions/gabinet";
import { GabLink } from "@/components/gabinetPlatform/GabLink";
import { PLAN_STATUS_LABELS } from "@/lib/gabinet/fdiTeeth";

type Plan = { id: string; title: string; status: string; totalPln: number; patient: { name: string } };
type Patient = { id: string; name: string };

export function GabPlanyClient({ plans, patients }: { plans: Plan[]; patients: Patient[] }) {
  const router = useRouter();
  const [msg, setMsg] = useState("");
  const [patientId, setPatientId] = useState("");
  const [title, setTitle] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    const fd = new FormData();
    fd.set("patientId", patientId);
    fd.set("title", title);
    const res = await saveGabTreatmentPlanAction(fd);
    if (!res.ok) {
      setMsg(res.error);
      return;
    }
    if (res.planId) {
      router.push(`/gabinet/panel/plany-leczenia/${res.planId}`);
      return;
    }
    window.location.reload();
  }

  return (
    <div className="space-y-8">
      <ul className="space-y-2">
        {plans.map((p) => (
          <li key={p.id}>
            <GabLink
              href={`/panel/plany-leczenia/${p.id}`}
              className="block rounded-xl border border-gab-sky/15 bg-white px-4 py-3 transition hover:border-gab-sky/40"
            >
              <p className="font-medium text-gab-navy">{p.title}</p>
              <p className="text-[13px] text-slate-500">
                {p.patient.name} · {p.totalPln.toFixed(2)} PLN · {PLAN_STATUS_LABELS[p.status] ?? p.status}
              </p>
            </GabLink>
          </li>
        ))}
        {plans.length === 0 && (
          <li className="text-[14px] text-slate-500">Brak planów — utwórz pierwszy poniżej.</li>
        )}
      </ul>

      <form onSubmit={handleSubmit} className="max-w-md space-y-3 rounded-xl border border-gab-sky/20 bg-white p-4">
        <h2 className="font-semibold text-gab-navy">Nowy plan leczenia</h2>
        {msg && <p className="text-[14px] text-red-700">{msg}</p>}
        <select className="gab-input" required value={patientId} onChange={(e) => setPatientId(e.target.value)}>
          <option value="">Wybierz pacjenta…</option>
          {patients.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <input className="gab-input" required placeholder="Tytuł planu" value={title} onChange={(e) => setTitle(e.target.value)} />
        <button type="submit" className="gab-btn-primary">Utwórz plan</button>
      </form>
    </div>
  );
}
