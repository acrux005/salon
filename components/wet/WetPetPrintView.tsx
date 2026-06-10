"use client";

import { useEffect } from "react";
import { speciesLabel } from "@/lib/vet/species";
import { petStatusLabel } from "@/lib/vet/petStatus";

export type WetPetPrintData = {
  clinicName: string;
  pet: {
    name: string;
    species: string;
    breed: string | null;
    birthDate: string | null;
    chipNumber: string | null;
    status: string;
    notes: string | null;
    owner: { name: string; phone: string; email: string | null };
    herd: { name: string } | null;
    vaccinations: {
      vaccineName: string;
      administeredAt: string;
      nextDueAt: string;
    }[];
  };
};

function formatDate(value: string | null): string {
  if (!value) return "—";
  const d = value.includes("T") ? new Date(value) : new Date(`${value}T12:00:00`);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("pl-PL");
}

export function WetPetPrintView({ data }: { data: WetPetPrintData }) {
  useEffect(() => {
    const t = setTimeout(() => window.print(), 400);
    return () => clearTimeout(t);
  }, []);

  const { clinicName, pet } = data;

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
        <p className="text-[11px] uppercase tracking-widest text-slate-500">Karta pacjenta</p>
        <h1 className="mt-1 text-2xl font-bold">{pet.name}</h1>
        <p className="mt-1 text-[14px] text-slate-600">{clinicName}</p>
        <p className="text-[12px] text-slate-500">Wydruk: {new Date().toLocaleDateString("pl-PL")}</p>
      </header>

      <section className="mt-6 grid grid-cols-2 gap-4 text-[14px]">
        <div>
          <p className="text-[11px] font-semibold uppercase text-slate-500">Gatunek</p>
          <p>{speciesLabel(pet.species)}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase text-slate-500">Rasa</p>
          <p>{pet.breed || "—"}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase text-slate-500">Data urodzenia</p>
          <p>{formatDate(pet.birthDate)}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase text-slate-500">Status</p>
          <p>{petStatusLabel(pet.status)}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase text-slate-500">Numer chipu</p>
          <p className="font-mono text-[13px]">{pet.chipNumber || "—"}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase text-slate-500">Stado</p>
          <p>{pet.herd?.name || "—"}</p>
        </div>
      </section>

      <section className="mt-6 text-[14px]">
        <p className="text-[11px] font-semibold uppercase text-slate-500">Właściciel</p>
        <p className="font-medium">{pet.owner.name}</p>
        <p>{pet.owner.phone}</p>
        {pet.owner.email && <p>{pet.owner.email}</p>}
      </section>

      {pet.notes && (
        <section className="mt-6 text-[14px]">
          <p className="text-[11px] font-semibold uppercase text-slate-500">Uwagi</p>
          <p className="whitespace-pre-wrap">{pet.notes}</p>
        </section>
      )}

      <section className="mt-8">
        <h2 className="text-[13px] font-semibold uppercase tracking-wide text-slate-600">Historia szczepień</h2>
        <table className="mt-3 w-full border-collapse text-[13px]">
          <thead>
            <tr className="border-b border-slate-300 text-left">
              <th className="py-2 pr-3">Szczepionka</th>
              <th className="py-2 pr-3">Podano</th>
              <th className="py-2">Następny termin</th>
            </tr>
          </thead>
          <tbody>
            {pet.vaccinations.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-4 text-slate-500">
                  Brak zapisanych szczepień.
                </td>
              </tr>
            ) : (
              pet.vaccinations.map((v, i) => (
                <tr key={i} className="border-b border-slate-200">
                  <td className="py-2 pr-3">{v.vaccineName}</td>
                  <td className="py-2 pr-3">{formatDate(v.administeredAt)}</td>
                  <td className="py-2">{formatDate(v.nextDueAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      <footer className="mt-10 border-t border-slate-200 pt-4 text-[11px] text-slate-500">
        Dokument wygenerowany z systemu VetHarmonogram · {clinicName}
      </footer>
    </div>
  );
}
