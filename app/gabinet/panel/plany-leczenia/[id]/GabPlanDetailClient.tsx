"use client";

import { useEffect, useMemo, useState } from "react";
import {
  deleteGabTreatmentPlanAction,
  deleteGabTreatmentPlanItemAction,
  presentGabTreatmentPlanAction,
  saveGabTreatmentPlanItemAction,
  updateGabTreatmentPlanItemAction,
  updateGabTreatmentPlanStatusAction,
  updateGabTreatmentPlanTitleAction,
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
  sortOrder: number;
};

const ITEM_STATUSES = [
  { value: "planned", label: "Zaplanowany" },
  { value: "in_progress", label: "W trakcie" },
  { value: "done", label: "Wykonany" },
  { value: "cancelled", label: "Anulowany" },
];

const PLAN_STATUSES = [
  { value: "draft", label: "Szkic" },
  { value: "pending_acceptance", label: "Oczekuje na akceptację" },
  { value: "accepted", label: "Zaakceptowany" },
  { value: "rejected", label: "Odrzucony" },
  { value: "in_progress", label: "Realizacja" },
  { value: "completed", label: "Zakończony" },
  { value: "cancelled", label: "Anulowany" },
];

export function GabPlanDetailClient({
  planId,
  title,
  status,
  totalPln,
  patientName,
  patientHasPortalAccount,
  presentedAt,
  acceptedAt,
  patientResponseNote,
  items,
}: {
  planId: string;
  title: string;
  status: string;
  totalPln: number;
  patientName: string;
  patientHasPortalAccount: boolean;
  presentedAt: string | null;
  acceptedAt: string | null;
  patientResponseNote: string | null;
  items: Item[];
}) {
  const [msg, setMsg] = useState("");
  const [planTitle, setPlanTitle] = useState(title);
  const [toothFdi, setToothFdi] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", pricePln: "0" });
  const [catalog, setCatalog] = useState<{ id: string; name: string; pricePln: number }[]>([]);
  const toothStates = useMemo(() => buildToothStateMap(items), [items]);
  const canPresent = (status === "draft" || status === "rejected") && items.length > 0;

  useEffect(() => {
    fetch("/api/gabinet/panel/catalog")
      .then((r) => r.json())
      .then((d) => setCatalog((d.items ?? []).filter((i: { active: boolean }) => i.active)));
  }, []);

  async function saveTitle() {
    setMsg("");
    const res = await updateGabTreatmentPlanTitleAction(planId, planTitle);
    if (!res.ok) setMsg(res.error);
    else setMsg("Zapisano tytuł.");
  }

  async function addItem(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    const fd = new FormData();
    fd.set("planId", planId);
    fd.set("title", form.title);
    fd.set("pricePln", form.pricePln);
    if (toothFdi) fd.set("toothFdi", toothFdi);
    const res = await saveGabTreatmentPlanItemAction(fd);
    if (!res.ok) {
      setMsg(res.error);
      return;
    }
    window.location.reload();
  }

  async function setItemStatus(itemId: string, newStatus: string) {
    const fd = new FormData();
    fd.set("id", itemId);
    fd.set("planId", planId);
    fd.set("status", newStatus);
    await updateGabTreatmentPlanItemAction(fd);
    window.location.reload();
  }

  async function removeItem(itemId: string) {
    if (!confirm("Usunąć etap?")) return;
    await deleteGabTreatmentPlanItemAction(itemId, planId);
    window.location.reload();
  }

  async function setPlanStatus(newStatus: string) {
    if (newStatus === "pending_acceptance") return;
    await updateGabTreatmentPlanStatusAction(planId, newStatus);
    window.location.reload();
  }

  async function presentToPatient() {
    setMsg("");
    const res = await presentGabTreatmentPlanAction(planId);
    if (!res.ok) {
      setMsg(res.error);
      return;
    }
    window.location.reload();
  }

  async function removePlan() {
    if (!confirm("Usunąć cały plan leczenia?")) return;
    const res = await deleteGabTreatmentPlanAction(planId);
    if (!res.ok) {
      setMsg(res.error);
      return;
    }
    window.location.href = "/gabinet/panel/plany-leczenia";
  }

  function applyCatalog(id: string) {
    const item = catalog.find((c) => c.id === id);
    if (!item) return;
    setForm({ title: item.name, pricePln: String(item.pricePln) });
  }

  return (
    <div className="space-y-8">
      <GabLink href="/panel/plany-leczenia" className="text-[14px] text-gab-sky hover:underline">
        ← Plany leczenia
      </GabLink>

      <div className="rounded-xl border border-gab-sky/20 bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            <input
              className="gab-input text-lg font-bold"
              value={planTitle}
              onChange={(e) => setPlanTitle(e.target.value)}
              disabled={status !== "draft" && status !== "rejected"}
            />
            {(status === "draft" || status === "rejected") && (
              <button type="button" onClick={saveTitle} className="text-[13px] text-gab-sky hover:underline">
                Zapisz tytuł
              </button>
            )}
          </div>
          <GabLink href={`/panel/plany-leczenia/${planId}/druk`} className="text-[13px] text-gab-sky hover:underline" target="_blank">
            Drukuj / PDF
          </GabLink>
        </div>
        <p className="mt-1 text-[14px] text-slate-600">
          Pacjent: {patientName} · suma: {totalPln.toFixed(2)} PLN
        </p>
        <p className="mt-1 text-[13px] font-medium text-gab-sky">
          Status: {PLAN_STATUS_LABELS[status] ?? status}
        </p>
        {presentedAt && (
          <p className="mt-1 text-[13px] text-slate-500">
            Wysłano do akceptacji: {new Date(presentedAt).toLocaleString("pl-PL")}
          </p>
        )}
        {acceptedAt && (
          <p className="mt-1 text-[13px] text-slate-500">
            Zaakceptowano: {new Date(acceptedAt).toLocaleString("pl-PL")}
          </p>
        )}
        {patientResponseNote && (
          <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-[13px] text-red-800">
            Uwagi pacjenta: {patientResponseNote}
          </p>
        )}
        {msg && <p className="mt-2 text-[14px] text-red-700">{msg}</p>}
        {canPresent && (
          <div className="mt-4">
            <button type="button" onClick={presentToPatient} className="gab-btn-primary">
              Wyślij do akceptacji pacjenta
            </button>
            {!patientHasPortalAccount && (
              <p className="mt-2 text-[13px] text-amber-700">
                Pacjent nie ma jeszcze konta w portalu — wysyłka nie powiedzie się bez powiązania konta.
              </p>
            )}
          </div>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          {PLAN_STATUSES.filter((s) => s.value !== "pending_acceptance").map((s) => (
            <button
              key={s.value}
              type="button"
              disabled={status === s.value}
              onClick={() => setPlanStatus(s.value)}
              className="rounded-lg border border-slate-200 px-3 py-1 text-[12px] hover:bg-slate-50 disabled:bg-sky-50 disabled:font-semibold disabled:text-gab-sky"
            >
              {s.label}
            </button>
          ))}
        </div>
        {status === "draft" && (
          <button type="button" onClick={removePlan} className="mt-4 text-[14px] text-red-600 hover:underline">
            Usuń plan leczenia
          </button>
        )}
      </div>

      {items.length > 0 && (
        <section className="rounded-xl border border-gab-sky/15 bg-white p-4">
          <h2 className="font-semibold text-gab-navy">Diagram FDI — stany zębów</h2>
          <div className="mt-3">
            <GabFdiDiagram toothStates={toothStates} readOnly showLegend />
          </div>
        </section>
      )}

      <section>
        <h2 className="font-semibold text-gab-navy">Etapy leczenia</h2>
        <ul className="mt-3 space-y-2">
          {items.map((item) => (
            <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-gab-sky/15 bg-white px-4 py-3">
              <div>
                <p className="font-medium text-gab-navy">{item.title}</p>
                <p className="text-[13px] text-slate-500">
                  {formatFdiLabel(item.toothFdi)} · {item.pricePln.toFixed(2)} PLN
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  className="rounded border border-slate-200 px-2 py-1 text-[12px]"
                  value={item.status}
                  onChange={(e) => setItemStatus(item.id, e.target.value)}
                >
                  {ITEM_STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
                <button type="button" onClick={() => removeItem(item.id)} className="text-[12px] text-red-600 hover:underline">
                  Usuń
                </button>
              </div>
            </li>
          ))}
          {items.length === 0 && <li className="text-[14px] text-slate-500">Brak etapów — dodaj poniżej.</li>}
        </ul>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <form onSubmit={addItem} className="space-y-3 rounded-xl border border-gab-sky/20 bg-white p-4">
          <h2 className="font-semibold text-gab-navy">Nowy etap</h2>
          {msg && <p className="text-[14px] text-red-700">{msg}</p>}
          {catalog.length > 0 && (
            <select className="gab-input" defaultValue="" onChange={(e) => e.target.value && applyCatalog(e.target.value)}>
              <option value="">— z katalogu zabiegów —</option>
              {catalog.map((c) => (
                <option key={c.id} value={c.id}>{c.name} ({c.pricePln.toFixed(2)} PLN)</option>
              ))}
            </select>
          )}
          <input
            className="gab-input"
            required
            placeholder="Nazwa zabiegu / etapu"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />
          <input
            type="number"
            min={0}
            step={0.01}
            className="gab-input"
            placeholder="Cena PLN"
            value={form.pricePln}
            onChange={(e) => setForm((f) => ({ ...f, pricePln: e.target.value }))}
          />
          <GabFdiDiagram
            selected={toothFdi}
            onSelect={(t) => setToothFdi(t || null)}
            toothStates={toothStates}
          />
          <button type="submit" className="gab-btn-primary w-full">Dodaj etap</button>
        </form>
      </section>
    </div>
  );
}
