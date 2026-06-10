"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { recordVaccinationAction } from "@/app/actions/vet";
import { formatCatalogPrice } from "@/lib/vet/catalog";

type CatalogOption = {
  id: string;
  name: string;
  manufacturer: string | null;
  defaultIntervalDays: number;
  defaultPrice: number | null;
  trackStock: boolean;
  stockDoses: number | null;
};

export function WetVaccinationForm({
  pets,
  vaccineTypes,
  defaultPetId,
}: {
  pets: { id: string; label: string }[];
  vaccineTypes: CatalogOption[];
  defaultPetId?: string;
}) {
  const initialPetId =
    defaultPetId && pets.some((p) => p.id === defaultPetId) ? defaultPetId : (pets[0]?.id ?? "");
  const [petId, setPetId] = useState(initialPetId);
  const [vaccineTypeId, setVaccineTypeId] = useState(vaccineTypes[0]?.id ?? "");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [batchNumber, setBatchNumber] = useState("");
  const [batchExpiryDate, setBatchExpiryDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const selectedVaccine = useMemo(
    () => vaccineTypes.find((v) => v.id === vaccineTypeId),
    [vaccineTypes, vaccineTypeId]
  );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData();
    fd.set("petId", petId);
    fd.set("vaccineTypeId", vaccineTypeId);
    fd.set("administeredAt", date);
    if (batchNumber.trim()) fd.set("batchNumber", batchNumber.trim());
    if (batchExpiryDate.trim()) fd.set("batchExpiryDate", batchExpiryDate.trim());
    const result = await recordVaccinationAction(fd);
    setLoading(false);
    setMsg(result.ok ? "Zapisano szczepienie i zaplanowano przypomnienia." : result.error);
    if (result.ok) {
      setBatchNumber("");
      setBatchExpiryDate("");
    }
  }

  if (pets.length === 0) {
    return (
      <p className="mt-8 rounded-lg bg-amber-50 px-4 py-3 text-[14px] text-amber-900">
        Najpierw dodaj pacjenta w zakładce{" "}
        <Link href="/wet/panel/zwierzeta/lista" className="font-medium underline">
          Pacjenci
        </Link>
        .
      </p>
    );
  }

  if (vaccineTypes.length === 0) {
    return (
      <p className="mt-8 rounded-lg bg-wet-teal-50 px-4 py-3 text-[14px] text-wet-teal-900">
        Dodaj preparaty w{" "}
        <Link href="/wet/panel/katalog" className="font-medium underline">
          Cennik i preparaty
        </Link>
        , aby zapisywać szczepienia z serią i terminem ważności.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="mt-8 space-y-3 rounded-xl border border-wet-teal-200 bg-white p-4">
      <p className="font-medium text-wet-teal-800">Zapisz podany szczep</p>
      {msg && <p className="text-[14px] text-wet-teal-700">{msg}</p>}
      <select value={petId} onChange={(e) => setPetId(e.target.value)} className="wet-input" required>
        {pets.map((p) => (
          <option key={p.id} value={p.id}>
            {p.label}
          </option>
        ))}
      </select>
      <select
        value={vaccineTypeId}
        onChange={(e) => setVaccineTypeId(e.target.value)}
        className="wet-input"
        required
      >
        {vaccineTypes.map((v) => (
          <option key={v.id} value={v.id}>
            {v.name}
            {v.manufacturer ? ` (${v.manufacturer})` : ""}
          </option>
        ))}
      </select>
      {selectedVaccine && (
        <p className="text-[12px] text-wet-navy-muted">
          Następne przypomnienie za {selectedVaccine.defaultIntervalDays} dni
          {selectedVaccine.defaultPrice != null ? ` · ${formatCatalogPrice(selectedVaccine.defaultPrice)}` : ""}
          {selectedVaccine.trackStock && selectedVaccine.stockDoses != null && (
            <> · pozostało <strong>{selectedVaccine.stockDoses}</strong> dawek</>
          )}
        </p>
      )}
      <div>
        <label className="block text-[14px] font-medium">Data podania</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="wet-input" required />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-[14px] font-medium">Numer serii (partii)</label>
          <input
            type="text"
            value={batchNumber}
            onChange={(e) => setBatchNumber(e.target.value)}
            className="wet-input"
            placeholder="np. A123BC"
          />
        </div>
        <div>
          <label className="block text-[14px] font-medium">Ważność partii</label>
          <input
            type="date"
            value={batchExpiryDate}
            onChange={(e) => setBatchExpiryDate(e.target.value)}
            className="wet-input"
          />
        </div>
      </div>
      <button type="submit" disabled={loading} className="wet-btn-primary w-full disabled:opacity-60">
        Zapisz i zaplanuj przypomnienia
      </button>
    </form>
  );
}
