"use client";

import { useState } from "react";
import { GabPanelPageHeader } from "@/components/gabinetPlatform/GabPanelPageHeader";
import { GabLink } from "@/components/gabinetPlatform/GabLink";

function monthAgoIso(): string {
  const d = new Date();
  d.setMonth(d.getMonth() - 1);
  return d.toISOString().slice(0, 10);
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function GabVisitHistoryReportFormPage() {
  const [from, setFrom] = useState(monthAgoIso());
  const [to, setTo] = useState(todayIso());
  const [includeArchived, setIncludeArchived] = useState(false);

  const href = `/panel/narzedzia/raporty/wizyty/druk?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&archived=${includeArchived ? "1" : "0"}`;

  return (
    <>
      <GabPanelPageHeader title="Historia wizyt" description="Raport do druku lub kontroli — wybierz okres." />
      <div className="px-4 py-6 lg:px-8">
        <div className="mx-auto max-w-xl space-y-6">
          <GabLink href="/panel/narzedzia/raporty" className="text-[14px] font-medium text-gab-sky hover:underline">
            ← Raporty
          </GabLink>

          <div className="space-y-4 rounded-xl border border-gab-sky/20 bg-white p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-[13px] font-medium text-gab-navy">Od</span>
                <input type="date" className="gab-input mt-1" value={from} onChange={(e) => setFrom(e.target.value)} />
              </label>
              <label className="block">
                <span className="text-[13px] font-medium text-gab-navy">Do</span>
                <input type="date" className="gab-input mt-1" value={to} onChange={(e) => setTo(e.target.value)} />
              </label>
            </div>

            <label className="flex items-center gap-2 text-[14px] text-gab-navy">
              <input
                type="checkbox"
                checked={includeArchived}
                onChange={(e) => setIncludeArchived(e.target.checked)}
                className="rounded border-slate-300"
              />
              Uwzględnij anulowane wizyty
            </label>

            <GabLink href={href} target="_blank" className="inline-block gab-btn-primary text-[13px]">
              Generuj raport / druk →
            </GabLink>
          </div>
        </div>
      </div>
    </>
  );
}
