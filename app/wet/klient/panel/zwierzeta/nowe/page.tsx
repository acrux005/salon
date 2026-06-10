"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { addOwnerPetAction } from "@/app/actions/vetOwnerAuth";
import { WetSpeciesSelect } from "@/components/wet/WetSpeciesSelect";
import { WetPetDocumentScan, applyExtractedPetToForm } from "@/components/wet/WetPetDocumentScan";
import { PET_SEX_OPTIONS } from "@/lib/vet/safeAnimal";
import { WetSafeAnimalChipLink } from "@/components/wet/WetSafeAnimalChipLink";

export default function WetOwnerNewPetPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    species: "pies",
    breed: "",
    sex: "",
    coatColor: "",
    birthDate: "",
    chipNumber: "",
    chipDate: "",
    chipManufacturer: "",
    pedigreeNotes: "",
    pedigreeLines: "",
    notes: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.set(k, v));
    const result = await addOwnerPetAction(fd);
    setLoading(false);
    if (result.ok) {
      router.push(`/wet/klient/panel/zwierzeta/${result.petId}`);
      router.refresh();
      return;
    }
    setError(result.error);
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-10">
      <Link href="/wet/klient/panel" className="text-[14px] font-medium text-wet-teal hover:underline">
        ← Panel
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-wet-navy">Nowe zwierzę</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-[14px] text-red-700">{error}</p>}

        <WetPetDocumentScan
          onDecoded={(data) => applyExtractedPetToForm(data, (fn) => setForm((p) => fn(p) as typeof form))}
        />

        <input className="wet-input" required placeholder="Imię zwierzęcia" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
        <WetSpeciesSelect value={form.species} onChange={(species) => setForm((p) => ({ ...p, species }))} />
        <input className="wet-input" placeholder="Rasa" value={form.breed} onChange={(e) => setForm((p) => ({ ...p, breed: e.target.value }))} />
        <select className="wet-input" value={form.sex} onChange={(e) => setForm((p) => ({ ...p, sex: e.target.value }))}>
          <option value="">Płeć</option>
          {PET_SEX_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        <input className="wet-input" placeholder="Umaszczenie" value={form.coatColor} onChange={(e) => setForm((p) => ({ ...p, coatColor: e.target.value }))} />
        <div className="grid gap-3 sm:grid-cols-2">
          <input type="date" className="wet-input" value={form.birthDate} onChange={(e) => setForm((p) => ({ ...p, birthDate: e.target.value }))} />
          <div>
            <input className="wet-input font-mono text-[13px]" placeholder="Numer chipu" value={form.chipNumber} onChange={(e) => setForm((p) => ({ ...p, chipNumber: e.target.value }))} />
            <WetSafeAnimalChipLink chipNumber={form.chipNumber} className="mt-1.5" />
          </div>
        </div>
        <textarea className="wet-input" rows={3} placeholder="Rodowód (linie przodków)" value={form.pedigreeLines} onChange={(e) => setForm((p) => ({ ...p, pedigreeLines: e.target.value }))} />
        <textarea className="wet-input" rows={2} placeholder="Uwagi medyczne" value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} />

        <button type="submit" disabled={loading} className="wet-btn-primary w-full disabled:opacity-60">
          {loading ? "Zapisuję…" : "Zapisz zwierzę"}
        </button>
      </form>
    </main>
  );
}
