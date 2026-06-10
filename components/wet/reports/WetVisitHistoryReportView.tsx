"use client";

import { useEffect } from "react";
import type { VisitHistoryReportRow } from "@/lib/vet/reports";

function visitStatusLabel(status: string): string {
  if (status === "done") return "Odbyta";
  if (status === "cancelled") return "Anulowana";
  if (status === "no_show") return "Nie stawił się";
  return "Zaplanowana";
}

export function WetVisitHistoryReportView({
  clinicName,
  rows,
  fromDate,
  toDate,
  includeArchived,
}: {
  clinicName: string;
  rows: VisitHistoryReportRow[];
  fromDate: string;
  toDate: string;
  includeArchived: boolean;
}) {
  useEffect(() => {
    const t = setTimeout(() => window.print(), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="mx-auto max-w-[210mm] bg-white p-8 text-black print:p-6">
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }
        }
      `}</style>

      <header className="border-b border-slate-300 pb-4">
        <p className="text-[11px] uppercase tracking-widest text-slate-500">Historia wizyt</p>
        <h1 className="mt-1 text-2xl font-bold">{clinicName}</h1>
        <p className="mt-1 text-[13px] text-slate-600">
          Okres: {fromDate} — {toDate}
          {includeArchived ? " · w tym anulowane" : " · bez anulowanych"}
        </p>
        <p className="text-[12px] text-slate-500">Liczba wpisów: {rows.length}</p>
      </header>

      <table className="mt-6 w-full border-collapse text-[12px]">
        <thead>
          <tr className="border-b border-slate-300 text-left text-[10px] uppercase text-slate-500">
            <th className="py-2 pr-2">Data</th>
            <th className="py-2 pr-2">Godz.</th>
            <th className="py-2 pr-2">Typ</th>
            <th className="py-2 pr-2">Zwierzę</th>
            <th className="py-2 pr-2">Właściciel</th>
            <th className="py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-6 text-center text-slate-500">
                Brak wizyt w wybranym okresie.
              </td>
            </tr>
          ) : (
            rows.map((r) => (
              <tr key={r.id} className="border-b border-slate-100">
                <td className="py-1.5 pr-2">{r.date}</td>
                <td className="py-1.5 pr-2">{r.time}</td>
                <td className="py-1.5 pr-2">{r.visitType ?? "—"}</td>
                <td className="py-1.5 pr-2">{r.petName ?? "—"}</td>
                <td className="py-1.5 pr-2">
                  {r.ownerName ?? "—"}
                  {r.ownerPhone ? ` · ${r.ownerPhone}` : ""}
                </td>
                <td className="py-1.5">{visitStatusLabel(r.status)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
