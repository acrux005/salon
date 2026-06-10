"use client";

import { useEffect, useState } from "react";
import {
  addVetMessageScheduleAction,
  toggleVetMessageScheduleAction,
} from "@/app/actions/vetClients";
import { WetPanelPageHeader } from "@/components/wet/WetPanelPageHeader";

type ScheduleRow = {
  id: string;
  name: string;
  channel: string;
  body: string;
  scheduleKind: string;
  intervalDays: number | null;
  runAt: string | null;
  active: boolean;
  lastRunAt: string | null;
};

export default function WetKlienciWiadomosciZaplanowanePage() {
  const [schedules, setSchedules] = useState<ScheduleRow[]>([]);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [channel, setChannel] = useState("sms");
  const [scheduleKind, setScheduleKind] = useState<"cyclic" | "once">("cyclic");
  const [intervalDays, setIntervalDays] = useState("30");
  const [runAt, setRunAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function reload() {
    const r = await fetch("/api/wet/panel/clients/schedules");
    const d = await r.json();
    setSchedules(d.schedules ?? []);
  }

  useEffect(() => {
    reload();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    const fd = new FormData();
    fd.set("name", name);
    fd.set("body", body);
    fd.set("channel", channel);
    fd.set("scheduleKind", scheduleKind);
    fd.set("intervalDays", intervalDays);
    fd.set("runAt", runAt);
    const result = await addVetMessageScheduleAction(fd);
    setLoading(false);
    if (result.ok) {
      setName("");
      setBody("");
      setMsg("Harmonogram dodany.");
      reload();
    } else setMsg(result.error);
  }

  async function toggle(id: string, active: boolean) {
    await toggleVetMessageScheduleAction(id, active);
    reload();
  }

  return (
    <>
      <WetPanelPageHeader
        title="Wiadomości cykliczne i zaplanowane"
        description="Automatyczne przypomnienia SMS/e-mail według harmonogramu. W treści możesz użyć {imie} i {nazwa} klienta."
      />
      <section className="grid gap-8 px-4 py-6 lg:grid-cols-2 lg:px-8">
        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-wet-teal-200 bg-white p-4">
          <p className="font-medium text-wet-teal-800">Nowy harmonogram</p>
          {msg ? <p className="text-[14px] text-wet-teal-700">{msg}</p> : null}
          <p>
            <label className="block text-[14px] font-medium">Nazwa *</label>
            <input className="wet-input mt-1" required value={name} onChange={(e) => setName(e.target.value)} />
          </p>
          <p>
            <label className="block text-[14px] font-medium">Typ</label>
            <select
              className="wet-input mt-1"
              value={scheduleKind}
              onChange={(e) => setScheduleKind(e.target.value as "cyclic" | "once")}
            >
              <option value="cyclic">Cykliczna (co X dni)</option>
              <option value="once">Jednorazowa (data)</option>
            </select>
          </p>
          {scheduleKind === "cyclic" ? (
            <p>
              <label className="block text-[14px] font-medium">Co ile dni</label>
              <input
                type="number"
                min={1}
                className="wet-input mt-1"
                value={intervalDays}
                onChange={(e) => setIntervalDays(e.target.value)}
              />
            </p>
          ) : (
            <p>
              <label className="block text-[14px] font-medium">Data wysyłki</label>
              <input type="date" className="wet-input mt-1" value={runAt} onChange={(e) => setRunAt(e.target.value)} />
            </p>
          )}
          <p>
            <label className="block text-[14px] font-medium">Treść *</label>
            <textarea className="wet-input mt-1" rows={3} required value={body} onChange={(e) => setBody(e.target.value)} />
          </p>
          <button type="submit" disabled={loading} className="wet-btn-primary w-full disabled:opacity-60">
            {loading ? "Zapisuję…" : "Dodaj harmonogram"}
          </button>
        </form>

        <section>
          <p className="mb-3 font-medium text-wet-navy">Aktywne harmonogramy</p>
          <ul className="space-y-3">
            {schedules.length === 0 ? (
              <li className="text-[14px] text-wet-navy-muted">Brak harmonogramów.</li>
            ) : (
              schedules.map((s) => (
                <li key={s.id} className="rounded-lg border border-wet-teal-100 bg-white p-4 text-[14px]">
                  <article className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-wet-navy">{s.name}</p>
                      <p className="text-[12px] text-wet-navy-muted">
                        {s.scheduleKind === "cyclic"
                          ? `Co ${s.intervalDays} dni · ${s.channel}`
                          : `Jednorazowo ${s.runAt ? new Date(s.runAt).toLocaleDateString("pl-PL") : "—"} · ${s.channel}`}
                        {s.lastRunAt
                          ? ` · ostatnio ${new Date(s.lastRunAt).toLocaleString("pl-PL")}`
                          : " · jeszcze nie wysłano"}
                      </p>
                      <p className="mt-2 line-clamp-2 text-wet-navy-muted">{s.body}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggle(s.id, !s.active)}
                      className={`shrink-0 rounded-full px-3 py-1 text-[12px] font-medium ${
                        s.active ? "bg-wet-teal text-white" : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {s.active ? "Wł." : "Wył."}
                    </button>
                  </article>
                </li>
              ))
            )}
          </ul>
        </section>
      </section>
    </>
  );
}
