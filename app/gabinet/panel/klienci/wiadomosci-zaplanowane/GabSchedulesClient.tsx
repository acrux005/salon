"use client";

import { useState } from "react";
import { deleteGabMessageScheduleAction, saveGabMessageScheduleAction } from "@/app/actions/gabinetClients";
import { GabLink } from "@/components/gabinetPlatform/GabLink";

type Schedule = {
  id: string;
  name: string;
  channel: string;
  scheduleKind: string;
  intervalDays: number | null;
  runAt: Date | null;
  active: boolean;
};

export function GabSchedulesClient({ schedules }: { schedules: Schedule[] }) {
  const [list, setList] = useState(schedules);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({
    name: "",
    body: "Cześć {imie}, przypominamy o wizycie w naszym gabinecie.",
    channel: "sms",
    scheduleKind: "cyclic",
    intervalDays: "30",
    runAt: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.set(k, v));
    const res = await saveGabMessageScheduleAction(fd);
    if (!res.ok) {
      setMsg(res.error);
      return;
    }
    setMsg("Harmonogram utworzony.");
    window.location.reload();
  }

  async function handleDelete(id: string) {
    if (!confirm("Usunąć harmonogram?")) return;
    await deleteGabMessageScheduleAction(id);
    setList((s) => s.filter((x) => x.id !== id));
  }

  return (
    <div className="space-y-8">
      <GabLink href="/panel/klienci/wiadomosci" className="text-[14px] text-gab-sky hover:underline">
        ← Wiadomości jednorazowe
      </GabLink>
      <ul className="space-y-2">
        {list.map((s) => (
          <li key={s.id} className="flex justify-between gap-3 rounded-xl border border-gab-sky/15 bg-white px-4 py-3 text-[14px]">
            <div>
              <p className="font-medium text-gab-navy">{s.name}</p>
              <p className="text-slate-500">
                {s.scheduleKind === "once" ? "jednorazowo" : `co ${s.intervalDays ?? "?"} dni`} · {s.channel}
              </p>
            </div>
            <button type="button" onClick={() => handleDelete(s.id)} className="text-red-600 hover:underline">
              Usuń
            </button>
          </li>
        ))}
        {list.length === 0 && <li className="text-slate-500">Brak harmonogramów.</li>}
      </ul>
      <form onSubmit={handleSubmit} className="max-w-lg space-y-3 rounded-xl border border-gab-sky/20 bg-white p-4">
        <h2 className="font-semibold text-gab-navy">Nowy harmonogram</h2>
        {msg && <p className="text-[14px] text-gab-navy">{msg}</p>}
        <input className="gab-input" required placeholder="Nazwa kampanii" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
        <textarea className="gab-input" rows={3} required value={form.body} onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))} />
        <select className="gab-input" value={form.scheduleKind} onChange={(e) => setForm((f) => ({ ...f, scheduleKind: e.target.value }))}>
          <option value="cyclic">Cyklicznie</option>
          <option value="once">Jednorazowo</option>
        </select>
        {form.scheduleKind === "cyclic" ? (
          <input type="number" min={1} className="gab-input" value={form.intervalDays} onChange={(e) => setForm((f) => ({ ...f, intervalDays: e.target.value }))} />
        ) : (
          <input type="date" className="gab-input" value={form.runAt} onChange={(e) => setForm((f) => ({ ...f, runAt: e.target.value }))} />
        )}
        <button type="submit" className="gab-btn-primary">Zapisz harmonogram</button>
        <p className="text-[12px] text-slate-500">Cron: GET /api/cron/gab-client-messages?secret=…</p>
      </form>
    </div>
  );
}
