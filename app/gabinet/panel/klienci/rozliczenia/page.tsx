"use client";

import { useEffect, useState } from "react";
import { addGabSettlementAction, markGabSettlementPaidAction } from "@/app/actions/gabinetClients";
import { GabPanelPageHeader } from "@/components/gabinetPlatform/GabPanelPageHeader";

type ClientOption = { id: string; name: string };
type SettlementRow = {
  id: string;
  amountPln: number;
  description: string;
  status: string;
  dueAt: string | null;
  client?: { name: string; phone: string };
};

export default function GabKlienciRozliczeniaPage() {
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [settlements, setSettlements] = useState<SettlementRow[]>([]);
  const [clientId, setClientId] = useState("");
  const [amountPln, setAmountPln] = useState("");
  const [description, setDescription] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function reload() {
    const [cRes, sRes] = await Promise.all([
      fetch("/api/gabinet/panel/clients"),
      fetch("/api/gabinet/panel/clients/settlements"),
    ]);
    const cData = await cRes.json();
    const sData = await sRes.json();
    setClients((cData.clients ?? []).map((c: ClientOption) => ({ id: c.id, name: c.name })));
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
    fd.set("clientId", clientId);
    fd.set("amountPln", amountPln);
    fd.set("description", description);
    fd.set("dueAt", dueAt);
    const result = await addGabSettlementAction(fd);
    setLoading(false);
    setMsg(result.ok ? "Dodano rozliczenie." : result.error);
    if (result.ok) {
      setAmountPln("");
      setDescription("");
      setDueAt("");
      reload();
    }
  }

  return (
    <>
      <GabPanelPageHeader title="Rozliczenia" description="Proste rozliczenia z klientami — bez ERP." />
      <div className="px-4 py-6 lg:px-8">
        <form onSubmit={handleSubmit} className="mb-8 max-w-lg space-y-3 rounded-xl border border-gab-sky/20 bg-white p-4">
          {msg && <p className="text-[14px] text-gab-navy">{msg}</p>}
          <select className="gab-input" required value={clientId} onChange={(e) => setClientId(e.target.value)}>
            <option value="">Wybierz klienta</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <input
            className="gab-input"
            placeholder="Kwota PLN"
            required
            value={amountPln}
            onChange={(e) => setAmountPln(e.target.value)}
          />
          <input
            className="gab-input"
            placeholder="Opis"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input type="date" className="gab-input" value={dueAt} onChange={(e) => setDueAt(e.target.value)} />
          <button type="submit" disabled={loading} className="gab-btn-primary disabled:opacity-60">
            Dodaj rozliczenie
          </button>
        </form>
        <ul className="space-y-2">
          {settlements.map((s) => (
            <li
              key={s.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-100 bg-white px-4 py-3 text-[14px]"
            >
              <span>
                <strong>{s.client?.name ?? "—"}</strong> — {s.description} ({s.amountPln} PLN) —{" "}
                <span className={s.status === "paid" ? "text-green-700" : "text-amber-700"}>{s.status}</span>
              </span>
              {s.status !== "paid" && (
                <button
                  type="button"
                  className="text-[13px] font-medium text-gab-sky hover:underline"
                  onClick={async () => {
                    await markGabSettlementPaidAction(s.id);
                    reload();
                  }}
                >
                  Oznacz opłacone
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
