"use client";

import { useState } from "react";
import Link from "next/link";
import { WetPanelPageHeader } from "@/components/wet/WetPanelPageHeader";

function monthAgoIso(): string {
  const d = new Date();
  d.setMonth(d.getMonth() - 1);
  return d.toISOString().slice(0, 10);
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function WetVisitHistoryReportFormPage() {
  const [from, setFrom] = useState(monthAgoIso());
  const [to, setTo] = useState(todayIso());
  const [includeArchived, setIncludeArchived] = useState(false);

  const href = `/wet/panel/narzedzia/raporty/wizyty/druk?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&archived=${includeArchived ? "1" : "0"}`;

  return (
    <>
      <WetPanelPageHeader title="Historia wizyt" description="Raport do druku lub kontroli — wybierz okres." />
      <div className="px-4 py-6 lg:px-8">
        <div className="mx-auto max-w-xl space-y-6">
          <Link href="/wet/panel/narzedzia/raporty" className="text-[14px] font-medium text-wet-teal hover:underline">
            ← Raporty
          </Link>

          <div className="rounded-xl border border-wet-teal-200 bg-white p-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-[13px] font-medium text-wet-navy">Od</span>
                <input type="date" className="wet-input mt-1" value={from} onChange={(e) => setFrom(e.target.value)} />
              </label>
              <label className="block">
                <span className="text-[13px] font-medium text-wet-navy">Do</span>
                <input type="date" className="wet-input mt-1" value={to} onChange={(e) => setTo(e.target.value)} />
              </label>
            </div>

            <label className="flex items-center gap-2 text-[14px] text-wet-navy">
              <input
                type="checkbox"
                checked={includeArchived}
                onChange={(e) => setIncludeArchived(e.target.checked)}
                className="rounded border-slate-300"
              />
              Uwzględnij anulowane wizyty
            </label>

            <Link href={href} target="_blank" className="inline-block wet-btn-primary text-[13px]">
              Generuj raport / druk →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
