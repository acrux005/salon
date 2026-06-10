"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteGabClientAction } from "@/app/actions/gabinetClients";
import { updateGabClientAction } from "@/app/actions/gabinetSettings";
import { GabPanelPageHeader } from "@/components/gabinetPlatform/GabPanelPageHeader";
import { GabLink } from "@/components/gabinetPlatform/GabLink";

type Client = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  notes: string | null;
  smsConsent: boolean;
  emailConsent: boolean;
  marketingConsent: boolean;
  pushConsent: boolean;
};

type ConsentLog = {
  id: string;
  consentType: string;
  granted: boolean;
  source: string;
  note: string | null;
  createdAt: Date;
};

type ClientMessage = {
  id: string;
  channel: string;
  status: string;
  body: string;
  subject: string | null;
  sentAt: string;
};

const CONSENT_LABELS: Record<string, string> = {
  sms: "SMS",
  email: "E-mail",
  marketing: "Marketing",
  push: "Push",
};

export function GabKlientDetailClient({
  client,
  consentLogs,
  messages,
}: {
  client: Client;
  consentLogs: ConsentLog[];
  messages: ClientMessage[];
}) {
  const router = useRouter();
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [form, setForm] = useState({
    name: client.name,
    phone: client.phone,
    email: client.email ?? "",
    notes: client.notes ?? "",
    smsConsent: client.smsConsent,
    emailConsent: client.emailConsent,
    marketingConsent: client.marketingConsent,
    pushConsent: client.pushConsent,
  });

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setMsg("");
    const fd = new FormData();
    fd.set("id", client.id);
    fd.set("name", form.name);
    fd.set("phone", form.phone);
    fd.set("email", form.email);
    fd.set("notes", form.notes);
    fd.set("smsConsent", form.smsConsent ? "true" : "false");
    fd.set("emailConsent", form.emailConsent ? "true" : "false");
    fd.set("marketingConsent", form.marketingConsent ? "true" : "false");
    fd.set("pushConsent", form.pushConsent ? "true" : "false");
    const res = await updateGabClientAction(fd);
    if (!res.ok) setErr(res.error);
    else {
      setMsg("Zapisano.");
      router.refresh();
    }
  }

  async function remove() {
    if (!confirm("Usunąć klienta z CRM?")) return;
    const res = await deleteGabClientAction(client.id);
    if (!res.ok) {
      setErr(res.error);
      return;
    }
    router.push("/gabinet/panel/klienci/lista");
  }

  return (
    <>
      <GabPanelPageHeader title={client.name} description="Edycja klienta CRM i historia zgód." />
      <div className="px-4 py-6 lg:px-8">
        <GabLink href="/panel/klienci/lista" className="text-[14px] text-gab-sky hover:underline">
          ← Lista klientów
        </GabLink>
        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <form onSubmit={save} className="space-y-3 rounded-xl border border-gab-sky/15 bg-white p-4">
            <h2 className="font-semibold text-gab-navy">Dane klienta</h2>
            {msg && <p className="text-[14px] text-green-800">{msg}</p>}
            {err && <p className="text-[14px] text-red-700">{err}</p>}
            <input className="gab-input" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            <input className="gab-input" required value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
            <input type="email" className="gab-input" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
            <textarea className="gab-input" rows={2} value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
            <div className="space-y-2 text-[14px]">
              {(["smsConsent", "emailConsent", "marketingConsent", "pushConsent"] as const).map((key) => (
                <label key={key} className="flex items-center gap-2">
                  <input type="checkbox" checked={form[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.checked }))} />
                  Zgoda: {CONSENT_LABELS[key.replace("Consent", "")] ?? key}
                </label>
              ))}
            </div>
            <button type="submit" className="gab-btn-primary w-full">
              Zapisz
            </button>
            <button type="button" onClick={remove} className="w-full text-[14px] text-red-600 hover:underline">
              Usuń klienta
            </button>
          </form>
          <section className="rounded-xl border border-gab-sky/15 bg-white p-4">
            <h2 className="font-semibold text-gab-navy">Historia zgód</h2>
            <ul className="mt-3 max-h-80 space-y-2 overflow-y-auto text-[13px]">
              {consentLogs.map((log) => (
                <li key={log.id} className="rounded border border-slate-100 px-2 py-1.5">
                  <span className="font-medium">{CONSENT_LABELS[log.consentType] ?? log.consentType}</span>
                  {" · "}
                  {log.granted ? "udzielono" : "cofnięto"} · {log.source}
                  <span className="block text-slate-500">
                    {new Date(log.createdAt).toLocaleString("pl-PL")}
                  </span>
                </li>
              ))}
              {consentLogs.length === 0 && <li className="text-slate-500">Brak wpisów.</li>}
            </ul>
          </section>
        </div>

        <section className="mt-8 rounded-xl border border-gab-sky/15 bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-semibold text-gab-navy">Historia wiadomości</h2>
            <GabLink href="/panel/klienci/wiadomosci" className="text-[13px] text-gab-sky hover:underline">
              Wszystkie wiadomości →
            </GabLink>
          </div>
          <ul className="mt-3 max-h-80 space-y-2 overflow-y-auto text-[13px]">
            {messages.map((m) => (
              <li key={m.id} className="rounded border border-slate-100 px-2 py-1.5">
                <div className="flex flex-wrap items-center gap-2 text-[12px] text-slate-500">
                  <span>{new Date(m.sentAt).toLocaleString("pl-PL")}</span>
                  <span>{m.channel.toUpperCase()}</span>
                  <span className={m.status === "failed" ? "text-red-600" : "text-green-700"}>{m.status}</span>
                </div>
                {m.subject && <p className="font-medium text-gab-navy">{m.subject}</p>}
                <p className="text-slate-700">{m.body}</p>
              </li>
            ))}
            {messages.length === 0 && <li className="text-slate-500">Brak wysłanych wiadomości.</li>}
          </ul>
        </section>
      </div>
    </>
  );
}
