"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { resolveDatingReportAction } from "@/app/actions/randkiAdmin";
import type { DatingReportRow } from "@/app/actions/randkiAdmin";
import { RandkiAdminRoomPreview } from "./RandkiAdminRoomPreview";

export function RandkiReportsList({ initialRows }: { initialRows: DatingReportRow[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(initialRows);
  const [pending, start] = useTransition();
  const [error, setError] = useState("");

  function resolve(reportId: string, action: "dismiss" | "warn" | "suspend" | "ban") {
    start(async () => {
      setError("");
      const res = await resolveDatingReportAction(reportId, action);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setRows((prev) => prev.filter((r) => r.id !== reportId));
      router.refresh();
    });
  }

  if (rows.length === 0) {
    return <p className="text-[15px] text-neutral-600">Brak oczekujących zgłoszeń.</p>;
  }

  return (
    <div className="space-y-4">
      {error && <p className="text-red-600">{error}</p>}
      {rows.map((r) => (
        <article key={r.id} className="rounded-xl border border-neutral-200 p-4">
          <p className="text-[13px] text-neutral-500">{r.createdAt.toLocaleString("pl-PL")}</p>
          <p className="mt-2 font-medium">
            Zgłoszony: {r.reportedName} ({r.reportedAccountId.slice(0, 8)}…)
          </p>
          <p className="text-[14px] text-neutral-600">Od: {r.reporterEmail}</p>
          <p className="mt-2 text-[15px]">{r.reason}</p>
          <RandkiAdminRoomPreview accountId={r.reportedAccountId} displayName={r.reportedName} />
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" disabled={pending} onClick={() => resolve(r.id, "dismiss")} className="rounded-lg border px-3 py-1.5 text-[13px]">
              Odrzuć
            </button>
            <button type="button" disabled={pending} onClick={() => resolve(r.id, "warn")} className="rounded-lg border px-3 py-1.5 text-[13px]">
              Ostrzeżenie
            </button>
            <button type="button" disabled={pending} onClick={() => resolve(r.id, "suspend")} className="rounded-lg bg-red-600 px-3 py-1.5 text-[13px] text-white">
              Zawieś profil
            </button>
            <button type="button" disabled={pending} onClick={() => resolve(r.id, "ban")} className="rounded-lg bg-red-900 px-3 py-1.5 text-[13px] text-white">
              Ban konta
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
