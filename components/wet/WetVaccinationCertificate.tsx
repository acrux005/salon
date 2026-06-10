"use client";

import { useEffect } from "react";
import { speciesLabel } from "@/lib/vet/species";

export type WetVaccinationCertificateData = {
  clinic: {
    name: string;
    address: string | null;
    phone: string | null;
    email: string | null;
  };
  pet: {
    name: string;
    species: string;
    breed: string | null;
    birthDate: string | null;
    chipNumber: string | null;
  };
  owner: {
    name: string;
    phone: string;
  };
  vaccination: {
    vaccineName: string;
    administeredAt: string;
    nextDueAt: string;
    batchNumber: string | null;
    batchExpiryDate: string | null;
    vetName: string | null;
    notes: string | null;
  };
};

function formatDate(value: string | null): string {
  if (!value) return "—";
  const d = value.includes("T") ? new Date(value) : new Date(`${value}T12:00:00`);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("pl-PL", { day: "numeric", month: "long", year: "numeric" });
}

export function WetVaccinationCertificate({ data }: { data: WetVaccinationCertificateData }) {
  useEffect(() => {
    const t = setTimeout(() => window.print(), 400);
    return () => clearTimeout(t);
  }, []);

  const { clinic, pet, owner, vaccination } = data;

  return (
    <div className="mx-auto max-w-[210mm] bg-white p-10 text-black print:p-8">
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }
        }
      `}</style>

      <header className="border-b-2 border-slate-800 pb-5 text-center">
        <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Zaświadczenie o szczepieniu</p>
        <h1 className="mt-2 text-2xl font-bold">{clinic.name}</h1>
        {clinic.address && <p className="mt-1 text-[14px] text-slate-600">{clinic.address}</p>}
        {(clinic.phone || clinic.email) && (
          <p className="mt-1 text-[12px] text-slate-500">
            {[clinic.phone, clinic.email].filter(Boolean).join(" · ")}
          </p>
        )}
      </header>

      <section className="mt-8 space-y-6 text-[14px] leading-relaxed">
        <p>
          Niniejszym zaświadcza się, że w dniu{" "}
          <strong>{formatDate(vaccination.administeredAt)}</strong> w przychodni weterynaryjnej{" "}
          <strong>{clinic.name}</strong> podano szczepienie:
        </p>

        <div className="rounded-lg border border-slate-300 bg-slate-50 px-5 py-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Szczepionka</p>
          <p className="mt-1 text-lg font-bold">{vaccination.vaccineName}</p>
          {vaccination.batchNumber && (
            <p className="mt-2 text-[13px]">
              Seria / partia: <span className="font-mono">{vaccination.batchNumber}</span>
            </p>
          )}
          {vaccination.batchExpiryDate && (
            <p className="mt-1 text-[13px]">
              Ważność partii: <strong>{formatDate(vaccination.batchExpiryDate)}</strong>
            </p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-[11px] font-semibold uppercase text-slate-500">Pacjent</p>
            <p className="mt-1 font-medium">{pet.name}</p>
            <p className="text-[13px] text-slate-600">
              {speciesLabel(pet.species)}
              {pet.breed ? ` · ${pet.breed}` : ""}
            </p>
            {pet.birthDate && (
              <p className="text-[13px] text-slate-600">Ur.: {formatDate(pet.birthDate)}</p>
            )}
            {pet.chipNumber && (
              <p className="mt-1 font-mono text-[12px]">Chip: {pet.chipNumber}</p>
            )}
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase text-slate-500">Właściciel</p>
            <p className="mt-1 font-medium">{owner.name}</p>
            <p className="text-[13px] text-slate-600">{owner.phone}</p>
          </div>
        </div>

        <p>
          Termin kolejnego szczepienia / przypomnienia:{" "}
          <strong>{formatDate(vaccination.nextDueAt)}</strong>
        </p>

        {vaccination.notes && (
          <p className="text-[13px] text-slate-600">
            Uwagi: {vaccination.notes}
          </p>
        )}
      </section>

      <footer className="mt-12 flex items-end justify-between border-t border-slate-300 pt-8 text-[13px]">
        <div>
          <p className="text-slate-500">Data wydruku: {new Date().toLocaleDateString("pl-PL")}</p>
        </div>
        <div className="text-right">
          <div className="mb-1 h-px w-48 bg-slate-400" />
          <p>{vaccination.vetName || "Lekarz weterynarii"}</p>
          <p className="text-[11px] text-slate-500">podpis i pieczątka</p>
        </div>
      </footer>
    </div>
  );
}
