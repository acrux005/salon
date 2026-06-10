"use client";

import { useState } from "react";
import {
  acceptGabTreatmentPlanPatientAction,
  rejectGabTreatmentPlanPatientAction,
} from "@/app/actions/gabinet";
import { GabFdiDiagram } from "@/components/gabinet/GabFdiDiagram";
import { GabLink } from "@/components/gabinetPlatform/GabLink";
import { buildToothStateMap, formatFdiLabel, PLAN_STATUS_LABELS } from "@/lib/gabinet/fdiTeeth";

type Item = {
  id: string;
  title: string;
  toothFdi: string | null;
  pricePln: number;
  status: string;
};

const ITEM_STATUS_LABELS: Record<string, string> = {
  planned: "Zaplanowany",
  in_progress: "W trakcie",
  done: "Wykonany",
  cancelled: "Anulowany",
};

export function GabPatientPlanClient({
  planId,
  title,
  status,
  totalPln,
  clinicName,
  notes,
  presentedAt,
  items,
}: {
  planId: string;
  title: string;
  status: string;
  totalPln: number;
  clinicName: string;
  notes: string | null;
  presentedAt: string | null;
  items: Item[];
}) {
  const [msg, setMsg] = useState("");
  const [rejectNote, setRejectNote] = useState("");
  const [busy, setBusy] = useState(false);
  const toothStates = buildToothStateMap(items);
  const canRespond = status === "pending_acceptance";

  async function accept() {
    setBusy(true);
    setMsg("");
    const res = await acceptGabTreatmentPlanPatientAction(planId);
    setBusy(false);
    if (!res.ok) {
      setMsg(res.error);
      return;
    }
    window.location.reload();
  }

  async function reject(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    const fd = new FormData();
    fd.set("planId", planId);
    if (rejectNote.trim()) fd.set("note", rejectNote.trim());
    const res = await rejectGabTreatmentPlanPatientAction(fd);
    setBusy(false);
    if (!res.ok) {
      setMsg(res.error);
      return;
    }
    window.location.reload();
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <GabLink href="/klient/panel" className="text-[14px] text-gab-sky hover:underline">
        ← Panel pacjenta
      </GabLink>

      <div className="mt-6 rounded-xl border border-gab-sky/20 bg-white p-6">
        <h1 className="text-2xl font-bold text-gab-navy">{title}</h1>
        <p className="mt-2 text-[15px] text-slate-600">
          {clinicName} · {totalPln.toFixed(2)} PLN
        </p>
        <p className="mt-1 text-[14px] font-medium text-gab-sky">
          {PLAN_STATUS_LABELS[status] ?? status}
        </p>
        {presentedAt && (
          <p className="mt-1 text-[13px] text-slate-500">
            Data przedstawienia: {new Date(presentedAt).toLocaleString("pl-PL")}
          </p>
        )}
        {notes && <p className="mt-3 text-[14px] text-slate-600">{notes}</p>}
      </div>

      {items.length > 0 && (
        <section className="mt-8 rounded-xl border border-gab-sky/15 bg-white p-6">
          <h2 className="font-semibold text-gab-navy">Diagram zębów (FDI)</h2>
          <div className="mt-4">
            <GabFdiDiagram toothStates={toothStates} readOnly showLegend />
          </div>
        </section>
      )}

      <section className="mt-8 rounded-xl border border-gab-sky/15 bg-white p-6">
        <h2 className="font-semibold text-gab-navy">Etapy planu</h2>
        <ul className="mt-4 space-y-3">
          {items.map((item) => (
            <li key={item.id} className="rounded-lg border border-slate-100 px-3 py-2 text-[14px]">
              <p className="font-medium text-gab-navy">{item.title}</p>
              <p className="text-slate-500">
                {formatFdiLabel(item.toothFdi)} · {item.pricePln.toFixed(2)} PLN ·{" "}
                {ITEM_STATUS_LABELS[item.status] ?? item.status}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {canRespond && (
        <section className="mt-8 rounded-xl border border-amber-200 bg-amber-50/50 p-6">
          <h2 className="font-semibold text-gab-navy">Twoja decyzja</h2>
          <p className="mt-2 text-[14px] text-slate-600">
            Zaakceptuj plan leczenia lub odrzuć go z krótką uwagą dla gabinetu.
          </p>
          {msg && <p className="mt-2 text-[14px] text-red-700">{msg}</p>}
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={busy}
              onClick={accept}
              className="gab-btn-primary disabled:opacity-50"
            >
              Akceptuję plan
            </button>
          </div>
          <form onSubmit={reject} className="mt-4 space-y-2">
            <textarea
              className="gab-input min-h-[80px]"
              placeholder="Opcjonalna uwaga przy odrzuceniu…"
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
            />
            <button
              type="submit"
              disabled={busy}
              className="rounded-lg border border-red-300 px-4 py-2 text-[14px] font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
            >
              Odrzucam plan
            </button>
          </form>
        </section>
      )}
    </main>
  );
}
