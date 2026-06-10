"use client";

import { useEffect, useState } from "react";
import { addVetSettlementAction, markVetSettlementPaidAction } from "@/app/actions/vetClients";
import { WetPanelPageHeader } from "@/components/wet/WetPanelPageHeader";

type OwnerOption = { id: string; name: string };
type SettlementRow = {
  id: string;
  amountPln: number;
  description: string;
  status: string;
  dueAt: string | null;
  paidAt: string | null;
  createdAt: string;
  owner: { name: string; phone: string };
};

export default function WetKlienciRozliczeniaPage() {
  const [owners, setOwners] = useState<OwnerOption[]>([]);
  const [settlements, setSettlements] = useState<SettlementRow[]>([]);
  const [ownerId, setOwnerId] = useState("");
  const [amountPln, setAmountPln] = useState("");
  const [description, setDescription] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [filter, setFilter] = useState<"all" | "open" | "paid">("all");

  async function reload() {
    const [oRes, sRes] = await Promise.all([
      fetch("/api/wet/panel/patients"),
      fetch("/api/wet/panel/clients/settlements"),
    ]);
    const oData = await oRes.json();
    const sData = await sRes.json();
    setOwners((oData.owners ?? []).map((o: { id: string; name: string }) => ({ id: o.id, name: o.name })));
    setSettlements(sData.settlements ?? []);
  }

  useEffect(() => {
    reload();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    const fd = new FormData();
    fd.set("ownerId", ownerId);
    fd.set("amountPln", amountPln);
    fd.set("description", description);
    fd.set("dueAt", dueAt);
    const result = await addVetSettlementAction(fd);
    setLoading(false);
    if (result.ok) {
      setAmountPln("");
      setDescription("");
      setDueAt("");
      setMsg("Rozliczenie dodane.");
      reload();
    } else setMsg(result.error);
  }

  const visible = settlements.filter((s) => filter === "all" || s.status === filter);
  const openSum = settlements.filter((s) => s.status === "open").reduce((a, s) => a + s.amountPln, 0);

  return (
    <>
      <WetPanelPageHeader
        title="Rozliczenia"
        description={`Należności otwarte: ${openSum.toFixed(2)} zł`}
      />
      <div className="grid gap-8 px-4 py-6 lg:grid-cols-2 lg:px-8">
        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-wet-teal-200 bg-white p-4">
          <p className="font-medium text-wet-teal-800">Nowe rozliczenie</p>
          {msg && <p className="text-[14px] text-wet-teal-700">{msg}</p>}
          <div>
            <label className="block text-[14px] font-medium">Klient *</label>
            <select
              className="wet-input mt-1"
              required
              value={ownerId}
              onChange={(e) => setOwnerId(e.target.value)}
            >
              <option value="">— wybierz —</option>
              {owners.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[14px] font-medium">Kwota (PLN) *</label>
              <input
                type="number"
                min={0}
                step={0.01}
                className="wet-input mt-1"
                required
                value={amountPln}
                onChange={(e) => setAmountPln(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[14px] font-medium">Termin płatności</label>
              <input type="date" className="wet-input mt-1" value={dueAt} onChange={(e) => setDueAt(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-[14px] font-medium">Opis *</label>
            <input
              className="wet-input mt-1"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Np. wizyta + szczepienie"
            />
          </div>
          <button type="submit" disabled={loading} className="wet-btn-primary w-full disabled:opacity-60">
            {loading ? "Zapisuję…" : "Dodaj rozliczenie"}
          </button>
        </form>

        <div>
          <div className="mb-3 flex flex-wrap gap-2">
            {(["all", "open", "paid"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`rounded-full px-3 py-1 text-[13px] font-medium ${
                  filter === f ? "bg-wet-teal text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                {f === "all" ? "Wszystkie" : f === "open" ? "Otwarte" : "Opłacone"}
              </button>
            ))}
          </div>
          <ul className="max-h-[28rem] space-y-3 overflow-y-auto">
            {visible.length === 0 ? (
              <li className="text-[14px] text-wet-navy-muted">Brak rozliczeń.</li>
            ) : (
              visible.map((s) => (
                <li key={s.id} className="rounded-lg border border-wet-teal-100 bg-white p-4 text-[14px]">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-wet-navy">
                        {s.owner.name} · {s.amountPln.toFixed(2)} zł
                      </p>
                      <p className="text-wet-navy-muted">{s.description}</p>
                      <p className="mt-1 text-[12px] text-wet-navy-muted">
                        {s.status === "paid"
                          ? `Opłacono ${s.paidAt ? new Date(s.paidAt).toLocaleDateString("pl-PL") : ""}`
                          : s.dueAt
                            ? `Termin: ${new Date(s.dueAt).toLocaleDateString("pl-PL")}`
                            : "Bez terminu"}
                      </p>
                    </div>
                    {s.status === "open" && (
                      <button
                        type="button"
                        onClick={async () => {
                          await markVetSettlementPaidAction(s.id);
                          reload();
                        }}
                        className="shrink-0 rounded-lg bg-green-600 px-3 py-1.5 text-[12px] font-medium text-white hover:bg-green-700"
                      >
                        Opłacone
                      </button>
                    )}
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </>
  );
}
