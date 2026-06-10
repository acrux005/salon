"use client";

import { useEffect } from "react";
import { speciesLabel } from "@/lib/vet/species";
import type { PetVaccinationHistoryReport } from "@/lib/vet/reports";

function formatDate(value: string | null): string {
  if (!value) return "—";
  const d = value.includes("T") ? new Date(value) : new Date(`${value}T12:00:00`);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("pl-PL");
}

export function WetVaccinationHistoryReport({ data }: { data: PetVaccinationHistoryReport }) {
  useEffect(() => {
    const t = setTimeout(() => window.print(), 400);
    return () => clearTimeout(t);
  }, []);

  const { clinicName, pet, owner, vaccinations } = data;

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
        <p className="text-[11px] uppercase tracking-widest text-slate-500">Historia szczepień</p>
        <h1 className="mt-1 text-2xl font-bold">{pet.name}</h1>
        <p className="mt-1 text-[14px] text-slate-600">
          {speciesLabel(pet.species)}
          {pet.breed ? ` · ${pet.breed}` : ""}
          {pet.chipNumber ? ` · chip ${pet.chipNumber}` : ""}
        </p>
        <p className="mt-2 text-[13px] text-slate-600">
          Właściciel: <strong>{owner.name}</strong> · tel. {owner.phone}
        </p>
        <p className="text-[12px] text-slate-500">
          {clinicName} · wydruk {formatDate(data.generatedAt.slice(0, 10))}
        </p>
      </header>

      <table className="mt-6 w-full border-collapse text-[13px]">
        <thead>
          <tr className="border-b border-slate-300 text-left text-[11px] uppercase text-slate-500">
            <th className="py-2 pr-2">Data</th>
            <th className="py-2 pr-2">Preparat</th>
            <th className="py-2 pr-2">Seria</th>
            <th className="py-2 pr-2">Lekarz</th>
            <th className="py-2">Nast. termin</th>
          </tr>
        </thead>
        <tbody>
          {vaccinations.length === 0 ? (
            <tr>
              <td colSpan={5} className="py-6 text-center text-slate-500">
                Brak zapisanych szczepień.
              </td>
            </tr>
          ) : (
            vaccinations.map((v, i) => (
              <tr key={i} className="border-b border-slate-100">
                <td className="py-2 pr-2">{formatDate(v.administeredAt)}</td>
                <td className="py-2 pr-2 font-medium">{v.vaccineName}</td>
                <td className="py-2 pr-2 font-mono text-[12px]">{v.batchNumber ?? "—"}</td>
                <td className="py-2 pr-2">{v.vetName ?? "—"}</td>
                <td className="py-2">{formatDate(v.nextDueAt)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <footer className="mt-10 border-t border-slate-200 pt-4 text-[11px] text-slate-500">
        Dokument ma charakter informacyjny z systemu VetHarmonogram. Pełna dokumentacja medyczna w kartotece gabinetu.
      </footer>
    </div>
  );
}
