"use client";

import { useEffect } from "react";
import { speciesLabel } from "@/lib/vet/species";
import type { HerdVaccinationReport } from "@/lib/vet/reports";

function formatDate(value: string): string {
  const d = value.includes("T") ? new Date(value) : new Date(`${value}T12:00:00`);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("pl-PL");
}

function statusLabel(status: string): string {
  if (status === "overdue") return "Zaległe";
  if (status === "due_soon") return "Wkrótce";
  if (status === "never") return "Brak szczepień";
  return "OK";
}

export function WetHerdVaccinationReportView({
  data,
  clinicName,
}: {
  data: HerdVaccinationReport;
  clinicName: string;
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
        <p className="text-[11px] uppercase tracking-widest text-slate-500">Raport szczepień stada</p>
        <h1 className="mt-1 text-2xl font-bold">{data.herdName}</h1>
        <p className="mt-1 text-[14px] text-slate-600">
          {speciesLabel(data.species)}
          {data.ownerName ? ` · ${data.ownerName}` : ""}
        </p>
        <p className="text-[12px] text-slate-500">{clinicName}</p>
      </header>

      <div className="mt-4 grid grid-cols-2 gap-3 text-[13px] sm:grid-cols-4">
        <div className="rounded border border-slate-200 p-2">
          <p className="text-[11px] text-slate-500">Zwierząt w stadzie</p>
          <p className="text-lg font-bold">{data.totalPets}</p>
        </div>
        <div className="rounded border border-slate-200 p-2">
          <p className="text-[11px] text-slate-500">Ze szczepieniami</p>
          <p className="text-lg font-bold">{data.vaccinatedCount}</p>
        </div>
        <div className="rounded border border-red-200 bg-red-50 p-2">
          <p className="text-[11px] text-red-700">Zaległe terminy</p>
          <p className="text-lg font-bold text-red-800">{data.overdueCount}</p>
        </div>
        <div className="rounded border border-amber-200 bg-amber-50 p-2">
          <p className="text-[11px] text-amber-800">W ciągu 30 dni</p>
          <p className="text-lg font-bold text-amber-900">{data.dueSoonCount}</p>
        </div>
      </div>

      {data.neverVaccinated.length > 0 && (
        <p className="mt-4 text-[13px] text-red-800">
          <strong>Bez zapisanych szczepień ({data.neverVaccinated.length}):</strong>{" "}
          {data.neverVaccinated.join(", ")}
        </p>
      )}

      <table className="mt-6 w-full border-collapse text-[12px]">
        <thead>
          <tr className="border-b border-slate-300 text-left text-[10px] uppercase text-slate-500">
            <th className="py-2 pr-1">Zwierzę</th>
            <th className="py-2 pr-1">Preparat</th>
            <th className="py-2 pr-1">Podano</th>
            <th className="py-2 pr-1">Termin</th>
            <th className="py-2 pr-1">Seria</th>
            <th className="py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.rows.map((r, i) => (
            <tr key={i} className="border-b border-slate-100">
              <td className="py-1.5 pr-1 font-medium">{r.petName}</td>
              <td className="py-1.5 pr-1">{r.vaccineName}</td>
              <td className="py-1.5 pr-1">{formatDate(r.administeredAt)}</td>
              <td className="py-1.5 pr-1">{formatDate(r.nextDueAt)}</td>
              <td className="py-1.5 pr-1 font-mono">{r.batchNumber ?? "—"}</td>
              <td className="py-1.5">{statusLabel(r.status)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
