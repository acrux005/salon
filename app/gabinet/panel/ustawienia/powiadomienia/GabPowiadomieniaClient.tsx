"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { sendGabNotifyTestAction } from "@/app/actions/gabinetSettings";
import type { GabNotifyLogEntry } from "@/lib/gabinet/notifyLog";
import type { GabNotifyStatus } from "@/lib/gabinet/notifyStatus";
import { CheckCircle2, XCircle } from "lucide-react";

function StatusRow({ ok, label, detail }: { ok: boolean; label: string; detail?: string | null }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-slate-100 px-4 py-3">
      {ok ? (
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" aria-hidden />
      ) : (
        <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden />
      )}
      <div>
        <p className="font-medium text-gab-navy">{label}</p>
        <p className="text-[13px] text-slate-500">
          {ok ? "Skonfigurowane" : "Brak konfiguracji — w dev trybie wiadomości trafiają do logów serwera."}
          {detail ? ` · ${detail}` : ""}
        </p>
      </div>
    </div>
  );
}

const STATUS_LABELS: Record<string, string> = {
  sent: "Wysłano",
  failed: "Błąd",
  queued: "W kolejce",
  logged: "Zapisano",
};

export function GabPowiadomieniaClient({
  status,
  log,
  defaultPhone,
  defaultEmail,
}: {
  status: GabNotifyStatus;
  log: GabNotifyLogEntry[];
  defaultPhone: string;
  defaultEmail: string;
}) {
  const router = useRouter();
  const [channel, setChannel] = useState<"sms" | "email">("sms");
  const [target, setTarget] = useState(defaultPhone || defaultEmail);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendTest(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    setErr("");
    const fd = new FormData();
    fd.set("channel", channel);
    fd.set("target", target);
    const res = await sendGabNotifyTestAction(fd);
    setLoading(false);
    if (!res.ok) setErr(res.error);
    else {
      setMsg("Test wysłany — wpis pojawi się w logu poniżej.");
      router.refresh();
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-3 rounded-xl border border-gab-sky/15 bg-white p-5">
        <StatusRow ok={status.smtpConfigured} label="E-mail (SMTP)" detail={status.mailFrom} />
        <StatusRow ok={status.smsConfigured} label="SMS (SMSAPI)" detail={status.smsFrom} />
      </div>

      <form onSubmit={sendTest} className="space-y-3 rounded-xl border border-gab-sky/15 bg-white p-5">
        <h2 className="font-semibold text-gab-navy">Test wysyłki</h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              setChannel("sms");
              setTarget(defaultPhone);
            }}
            className={`rounded-lg px-3 py-1.5 text-[13px] ${channel === "sms" ? "bg-gab-sky text-white" : "border border-slate-200"}`}
          >
            SMS
          </button>
          <button
            type="button"
            onClick={() => {
              setChannel("email");
              setTarget(defaultEmail);
            }}
            className={`rounded-lg px-3 py-1.5 text-[13px] ${channel === "email" ? "bg-gab-sky text-white" : "border border-slate-200"}`}
          >
            E-mail
          </button>
        </div>
        <input
          className="gab-input"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder={channel === "sms" ? "Numer telefonu" : "Adres e-mail"}
          required
        />
        {msg && <p className="text-[14px] text-green-700">{msg}</p>}
        {err && <p className="text-[14px] text-red-700">{err}</p>}
        <button type="submit" disabled={loading} className="gab-btn-primary disabled:opacity-60">
          {loading ? "Wysyłam…" : "Wyślij test"}
        </button>
      </form>

      <section className="rounded-xl border border-gab-sky/15 bg-white p-5">
        <h2 className="font-semibold text-gab-navy">Log dostarczeń</h2>
        {log.length === 0 ? (
          <p className="mt-3 text-[14px] text-slate-500">Brak wpisów — wyślij test lub poczekaj na cron recall.</p>
        ) : (
          <ul className="mt-4 space-y-2 text-[13px]">
            {log.map((entry) => (
              <li key={entry.id} className="rounded-lg border border-slate-100 px-3 py-2">
                <div className="flex flex-wrap items-center gap-2 text-[12px] text-slate-500">
                  <span>{new Date(entry.at).toLocaleString("pl-PL")}</span>
                  <span>{entry.channel.toUpperCase()}</span>
                  <span>{entry.kind}</span>
                  <span className={entry.status === "failed" ? "text-red-600" : "text-green-700"}>
                    {STATUS_LABELS[entry.status] ?? entry.status}
                  </span>
                </div>
                <p className="mt-1 text-gab-navy">{entry.summary}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
