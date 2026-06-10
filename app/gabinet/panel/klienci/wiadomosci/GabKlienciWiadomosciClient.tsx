"use client";

import { useEffect, useState } from "react";
import { sendGabClientMessageAction } from "@/app/actions/gabinetClients";
import { GabPanelPageHeader } from "@/components/gabinetPlatform/GabPanelPageHeader";

type ClientOption = { id: string; name: string };
type HistoryRow = {
  id: string;
  channel: string;
  status: string;
  body: string;
  subject: string | null;
  sentAt: string;
  clientName: string | null;
};

export function GabKlienciWiadomosciClient({ history }: { history: HistoryRow[] }) {
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [clientId, setClientId] = useState("");
  const [channel, setChannel] = useState<"sms" | "email" | "push">("sms");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/gabinet/panel/clients")
      .then((r) => r.json())
      .then((d) =>
        setClients((d.clients ?? []).map((c: ClientOption) => ({ id: c.id, name: c.name })))
      );
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    const fd = new FormData();
    fd.set("clientId", clientId);
    fd.set("channel", channel);
    fd.set("body", body);
    const result = await sendGabClientMessageAction(fd);
    setLoading(false);
    setMsg(result.ok ? "Wiadomość wysłana / zapisana." : result.error);
    if (result.ok) {
      setBody("");
      window.location.reload();
    }
  }

  return (
    <>
      <GabPanelPageHeader title="Wiadomości" description="SMS, e-mail i push do klientów CRM z historią wysyłek." />
      <div className="px-4 py-6 lg:px-8">
        <div className="mx-auto max-w-2xl space-y-8">
          <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-gab-sky/15 bg-white p-5">
            <h2 className="font-semibold text-gab-navy">Nowa wiadomość</h2>
            {msg && <p className="rounded-lg bg-sky-50 px-3 py-2 text-[14px] text-gab-navy">{msg}</p>}
            <div>
              <label className="block text-[14px] font-medium">Klient (opcjonalnie)</label>
              <select className="gab-input" value={clientId} onChange={(e) => setClientId(e.target.value)}>
                <option value="">Broadcast / bez przypisania</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[14px] font-medium">Kanał</label>
              <select
                className="gab-input"
                value={channel}
                onChange={(e) => setChannel(e.target.value as "sms" | "email" | "push")}
              >
                <option value="sms">SMS</option>
                <option value="email">E-mail</option>
                <option value="push">Push (wymaga zgody + subskrypcji)</option>
              </select>
            </div>
            <div>
              <label className="block text-[14px] font-medium">Treść *</label>
              <textarea className="gab-input" rows={4} required value={body} onChange={(e) => setBody(e.target.value)} />
            </div>
            <button type="submit" disabled={loading} className="gab-btn-primary disabled:opacity-60">
              {loading ? "Wysyłam…" : "Wyślij / zapisz"}
            </button>
          </form>

          <section className="rounded-xl border border-gab-sky/15 bg-white p-5">
            <h2 className="font-semibold text-gab-navy">Historia wysłanych</h2>
            {history.length === 0 ? (
              <p className="mt-3 text-[14px] text-slate-500">Brak wiadomości w historii.</p>
            ) : (
              <ul className="mt-4 space-y-2 text-[13px]">
                {history.map((m) => (
                  <li key={m.id} className="rounded-lg border border-slate-100 px-3 py-2">
                    <div className="flex flex-wrap gap-2 text-[12px] text-slate-500">
                      <span>{new Date(m.sentAt).toLocaleString("pl-PL")}</span>
                      <span>{m.channel.toUpperCase()}</span>
                      <span className={m.status === "failed" ? "text-red-600" : "text-green-700"}>{m.status}</span>
                      {m.clientName && <span>{m.clientName}</span>}
                    </div>
                    <p className="mt-1 text-gab-navy">{m.body.slice(0, 200)}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
