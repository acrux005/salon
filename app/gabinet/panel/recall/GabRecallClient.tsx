"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteGabRecallRuleAction, saveGabRecallRuleAction, sendGabScheduledReminderNowAction } from "@/app/actions/gabinet";
import { getVisitTypesForVertical, visitTypeLabel } from "@/lib/gabinet/visitTypes";
import { useGabinetVerticalId } from "@/contexts/GabVerticalContext";

type Rule = {
  id: string;
  name: string;
  visitType: string;
  intervalDays: number;
  channel: string;
  messageTemplate: string;
  active: boolean;
};

type PendingReminder = {
  id: string;
  message: string;
  channel: string;
  sendAt: Date;
  sentAt: Date | null;
};

export function GabRecallClient({
  initialRules,
  pendingReminders,
}: {
  initialRules: Rule[];
  pendingReminders: PendingReminder[];
}) {
  const router = useRouter();
  const verticalId = useGabinetVerticalId();
  const visitTypes = getVisitTypesForVertical(verticalId);
  const [rules, setRules] = useState(initialRules);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({
    id: "",
    name: "",
    visitType: visitTypes[0]?.value ?? "konsultacja",
    intervalDays: "180",
    channel: "sms",
    messageTemplate: "{pacjent}, zapraszamy — {gabinet}.",
    active: true,
  });

  function startEdit(r: Rule) {
    setForm({
      id: r.id,
      name: r.name,
      visitType: r.visitType,
      intervalDays: String(r.intervalDays),
      channel: r.channel,
      messageTemplate: r.messageTemplate,
      active: r.active,
    });
    setMsg("");
  }

  function resetForm() {
    setForm({
      id: "",
      name: "",
      visitType: visitTypes[0]?.value ?? "konsultacja",
      intervalDays: "180",
      channel: "sms",
      messageTemplate: "{pacjent}, zapraszamy — {gabinet}.",
      active: true,
    });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.set(k, String(v)));
    fd.set("active", form.active ? "true" : "false");
    const res = await saveGabRecallRuleAction(fd);
    if (!res.ok) {
      setMsg(res.error);
      return;
    }
    setMsg("Zapisano.");
    resetForm();
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Usunąć regułę recall?")) return;
    await deleteGabRecallRuleAction(id);
    setRules((r) => r.filter((x) => x.id !== id));
  }

  async function sendNow(id: string) {
    setMsg("");
    const res = await sendGabScheduledReminderNowAction(id);
    if (!res.ok) setMsg(res.error);
    else {
      setMsg("Wysłano przypomnienie.");
      router.refresh();
    }
  }

  return (
    <div className="space-y-8">
      {pendingReminders.length > 0 && (
        <section className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
          <h2 className="font-semibold text-gab-navy">Kolejka przypomnień (najbliższe 14 dni)</h2>
          <ul className="mt-3 space-y-2 text-[13px]">
            {pendingReminders.map((r) => (
              <li key={r.id} className="flex flex-wrap items-start justify-between gap-2 rounded border border-amber-100 bg-white px-3 py-2">
                <div>
                  <p className="font-medium">{r.channel.toUpperCase()} · {new Date(r.sendAt).toLocaleString("pl-PL")}</p>
                  <p className="text-slate-600 line-clamp-2">{r.message}</p>
                </div>
                <button type="button" onClick={() => sendNow(r.id)} className="text-[12px] text-gab-sky hover:underline">
                  Wyślij teraz
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
      <ul className="space-y-3">
        {rules.map((r) => (
          <li key={r.id} className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-gab-sky/20 bg-white px-4 py-3">
            <div>
              <p className="font-semibold text-gab-navy">{r.name}</p>
              <p className="text-[13px] text-slate-500">
                co {r.intervalDays} dni · {visitTypeLabel(r.visitType)} · {r.channel.toUpperCase()}
                {!r.active && " · wyłączone"}
              </p>
            </div>
            <div className="flex gap-2 text-[13px]">
              <button type="button" onClick={() => startEdit(r)} className="text-gab-sky hover:underline">
                Edytuj
              </button>
              <button type="button" onClick={() => handleDelete(r.id)} className="text-red-600 hover:underline">
                Usuń
              </button>
            </div>
          </li>
        ))}
        {rules.length === 0 && <li className="text-[14px] text-slate-500">Brak reguł recall — dodaj poniżej.</li>}
      </ul>

      <form onSubmit={handleSave} className="max-w-lg space-y-3 rounded-xl border border-gab-sky/20 bg-white p-4">
        <h2 className="font-semibold text-gab-navy">{form.id ? "Edycja reguły" : "Nowa reguła"}</h2>
        {msg && <p className="text-[14px] text-gab-navy">{msg}</p>}
        <input type="hidden" value={form.id} readOnly />
        <input className="gab-input" placeholder="Nazwa (np. Recall higienizacji)" required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
        <select className="gab-input" value={form.visitType} onChange={(e) => setForm((f) => ({ ...f, visitType: e.target.value }))}>
          {visitTypes.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <input type="number" min={1} className="gab-input" placeholder="Interwał (dni)" required value={form.intervalDays} onChange={(e) => setForm((f) => ({ ...f, intervalDays: e.target.value }))} />
        <select className="gab-input" value={form.channel} onChange={(e) => setForm((f) => ({ ...f, channel: e.target.value }))}>
          <option value="sms">SMS</option>
          <option value="email">E-mail</option>
        </select>
        <textarea className="gab-input" rows={2} value={form.messageTemplate} onChange={(e) => setForm((f) => ({ ...f, messageTemplate: e.target.value }))} />
        <label className="flex items-center gap-2 text-[14px]">
          <input type="checkbox" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} />
          Reguła aktywna
        </label>
        <div className="flex gap-2">
          <button type="submit" className="gab-btn-primary">{form.id ? "Zapisz zmiany" : "Dodaj regułę"}</button>
          {form.id && (
            <button type="button" onClick={resetForm} className="rounded-lg border border-slate-200 px-4 py-2 text-[14px]">
              Anuluj
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
