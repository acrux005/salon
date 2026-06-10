"use client";

import { useState } from "react";
import type {
  ExtractedPetDocument,
  ExtractedPetVaccination,
  ExtractedPetDeworming,
  ExtractedPetEctoparasite,
  ExtractedPetTreatment,
} from "@/lib/vet/petDocumentExtract";
import { bookletSectionLabel } from "@/lib/vet/deworming";

type Props = {
  data: ExtractedPetDocument;
  onAccept: (data: ExtractedPetDocument) => void;
  onCancel: () => void;
};

function formatField(value: string | null | undefined): string {
  return value?.trim() ? value : "—";
}

function formatDate(value: string | null): string {
  if (!value) return "brak daty";
  return new Date(`${value}T12:00:00`).toLocaleDateString("pl-PL");
}

export function WetPetScanReviewModal({ data, onAccept, onCancel }: Props) {
  const [vaccinations, setVaccinations] = useState<ExtractedPetVaccination[]>(data.vaccinations);
  const [dewormings, setDewormings] = useState<ExtractedPetDeworming[]>(data.dewormings ?? []);
  const [ectoparasites, setEctoparasites] = useState<ExtractedPetEctoparasite[]>(data.ectoparasites ?? []);
  const [treatments, setTreatments] = useState<ExtractedPetTreatment[]>(data.treatments ?? []);
  const [petFields, setPetFields] = useState({
    chipNumber: data.chipNumber ?? "",
    birthDate: data.birthDate ?? "",
    ownerName: data.ownerName ?? "",
  });

  function accept() {
    onAccept({
      ...data,
      chipNumber: petFields.chipNumber.trim() || null,
      birthDate: petFields.birthDate.trim() || null,
      ownerName: petFields.ownerName.trim() || null,
      vaccinations,
      dewormings,
      ectoparasites,
      treatments,
    });
  }

  const detected: { label: string; value: string }[] = [
    {
      label: "Strona książeczki",
      value: data.bookletSection ? bookletSectionLabel(data.bookletSection) : "—",
    },
    { label: "Chip", value: formatField(data.chipNumber) },
    { label: "Data urodzenia", value: formatField(data.birthDate) },
    { label: "Właściciel", value: formatField(data.ownerName) },
    { label: "Szczepienia", value: vaccinations.length ? `${vaccinations.length} wpisów` : "—" },
    { label: "Odrobaczanie", value: dewormings.length ? `${dewormings.length} wpisów` : "—" },
    { label: "Ektopasożyty", value: ectoparasites.length ? `${ectoparasites.length} wpisów` : "—" },
    { label: "Leczenie", value: treatments.length ? `${treatments.length} wpisów` : "—" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <button type="button" className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" aria-label="Zamknij" onClick={onCancel} />
      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-auto rounded-2xl border border-wet-teal-100 bg-white p-5 shadow-xl">
        <h3 className="text-lg font-semibold text-wet-navy">📷 Zeskanowano książeczkę</h3>
        <p className="mt-1 text-[13px] text-wet-navy-muted">
          Książeczka: szczepienia, endo-/ektopasożyty i leczenie — osobne strony.
        </p>

        <ul className="mt-4 space-y-2 rounded-xl bg-wet-teal-50/50 px-4 py-3 text-[13px]">
          {detected.map((row) => (
            <li key={row.label} className="flex justify-between gap-4">
              <span className="text-wet-navy-muted">{row.label}</span>
              <span className="font-medium text-wet-navy">{row.value}</span>
            </li>
          ))}
        </ul>

        <div className="mt-4 space-y-3">
          <p className="text-[12px] font-medium uppercase tracking-wide text-wet-navy-muted">Edytuj przed zapisem</p>
          <label className="block">
            <span className="text-[12px] text-wet-navy-muted">Numer chipu</span>
            <input
              className="wet-input mt-1 text-[13px]"
              value={petFields.chipNumber}
              onChange={(e) => setPetFields((p) => ({ ...p, chipNumber: e.target.value }))}
            />
          </label>
          <label className="block">
            <span className="text-[12px] text-wet-navy-muted">Data urodzenia</span>
            <input
              type="date"
              className="wet-input mt-1 text-[13px]"
              value={petFields.birthDate}
              onChange={(e) => setPetFields((p) => ({ ...p, birthDate: e.target.value }))}
            />
          </label>
          <label className="block">
            <span className="text-[12px] text-wet-navy-muted">Właściciel</span>
            <input
              className="wet-input mt-1 text-[13px]"
              value={petFields.ownerName}
              onChange={(e) => setPetFields((p) => ({ ...p, ownerName: e.target.value }))}
            />
          </label>
        </div>

        {vaccinations.length > 0 && (
          <div className="mt-4">
            <p className="text-[12px] font-medium uppercase tracking-wide text-wet-navy-muted">💉 Szczepienia</p>
            <ul className="mt-2 space-y-2">
              {vaccinations.map((v, i) => (
                <li key={`${v.vaccineName}-${i}`} className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 text-[13px]">
                  <div>
                    <p className="font-medium text-wet-navy">{v.vaccineName}</p>
                    <p className="text-wet-navy-muted">{formatDate(v.administeredAt)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setVaccinations((prev) => prev.filter((_, idx) => idx !== i))}
                    className="text-[12px] text-red-600 hover:underline"
                  >
                    Usuń
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {dewormings.length > 0 && (
          <div className="mt-4">
            <p className="text-[12px] font-medium uppercase tracking-wide text-wet-navy-muted">🪱 Endopasożyty (odrobaczanie)</p>
            <ul className="mt-2 space-y-2">
              {dewormings.map((d, i) => (
                <li key={`${d.productName}-${i}`} className="flex items-center justify-between rounded-lg border border-violet-100 bg-violet-50/40 px-3 py-2 text-[13px]">
                  <div>
                    <p className="font-medium text-wet-navy">{d.productName}</p>
                    <p className="text-wet-navy-muted">{formatDate(d.administeredAt)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDewormings((prev) => prev.filter((_, idx) => idx !== i))}
                    className="text-[12px] text-red-600 hover:underline"
                  >
                    Usuń
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {ectoparasites.length > 0 && (
          <div className="mt-4">
            <p className="text-[12px] font-medium uppercase tracking-wide text-wet-navy-muted">🦟 Ektopasożyty</p>
            <ul className="mt-2 space-y-2">
              {ectoparasites.map((d, i) => (
                <li key={`${d.productName}-${i}`} className="flex items-center justify-between rounded-lg border border-amber-100 bg-amber-50/40 px-3 py-2 text-[13px]">
                  <div>
                    <p className="font-medium text-wet-navy">{d.productName}</p>
                    <p className="text-wet-navy-muted">{formatDate(d.administeredAt)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEctoparasites((prev) => prev.filter((_, idx) => idx !== i))}
                    className="text-[12px] text-red-600 hover:underline"
                  >
                    Usuń
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {treatments.length > 0 && (
          <div className="mt-4">
            <p className="text-[12px] font-medium uppercase tracking-wide text-wet-navy-muted">💊 Leczenie</p>
            <ul className="mt-2 space-y-2">
              {treatments.map((t, i) => (
                <li key={`${t.summary}-${i}`} className="flex items-center justify-between rounded-lg border border-rose-100 bg-rose-50/40 px-3 py-2 text-[13px]">
                  <div>
                    <p className="font-medium text-wet-navy">{t.summary}</p>
                    <p className="text-wet-navy-muted">
                      {formatDate(t.administeredAt)}
                      {t.medications ? ` · ${t.medications}` : ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTreatments((prev) => prev.filter((_, idx) => idx !== i))}
                    className="text-[12px] text-red-600 hover:underline"
                  >
                    Usuń
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          <button type="button" onClick={accept} className="wet-btn-primary flex-1 text-[13px]">
            Zaakceptuj
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-200 px-4 py-2 text-[13px] text-wet-navy-muted hover:bg-slate-50"
          >
            Anuluj
          </button>
        </div>
      </div>
    </div>
  );
}
