"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { addVetPetAction, importPetVaccinationsFromScanAction } from "@/app/actions/vetAnimals";
import { WetPanelPageHeader } from "@/components/wet/WetPanelPageHeader";
import { WetSpeciesSelect } from "@/components/wet/WetSpeciesSelect";
import { WetPetDocumentScan, applyExtractedPetToForm } from "@/components/wet/WetPetDocumentScan";
import type { ExtractedPetVaccination } from "@/lib/vet/petDocumentExtract";
import { PET_SEX_OPTIONS } from "@/lib/vet/safeAnimal";
import { WetSafeAnimalChipLink } from "@/components/wet/WetSafeAnimalChipLink";
import { CAT_LIFESTYLE_OPTIONS } from "@/lib/vet/catLifestyle";

type OwnerOption = { id: string; name: string; phone: string };
type HerdOption = { id: string; name: string; species: string };

export default function WetZwierzetaNowePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedHerdId = searchParams.get("herdId") ?? "";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [owners, setOwners] = useState<OwnerOption[]>([]);
  const [herds, setHerds] = useState<HerdOption[]>([]);
  const [pendingVaccinations, setPendingVaccinations] = useState<ExtractedPetVaccination[]>([]);
  const [form, setForm] = useState({
    ownerId: "",
    name: "",
    species: "pies",
    breed: "",
    sex: "",
    coatColor: "",
    birthDate: "",
    chipNumber: "",
    chipDate: "",
    chipManufacturer: "",
    notes: "",
    pedigreeNotes: "",
    pedigreeLines: "",
    herdId: "",
    catLifestyle: "",
  });

  useEffect(() => {
    fetch("/api/wet/panel/patients")
      .then((r) => r.json())
      .then((d) => {
        const list: OwnerOption[] = (d.owners ?? []).map(
          (o: { id: string; name: string; phone: string }) => ({
            id: o.id,
            name: o.name,
            phone: o.phone,
          })
        );
        setOwners(list);
        if (list.length === 1) setForm((p) => ({ ...p, ownerId: list[0].id }));
      });
    fetch("/api/wet/panel/herds")
      .then((r) => r.json())
      .then((d) => {
        setHerds(d.herds ?? []);
        if (preselectedHerdId) {
          setForm((p) => ({ ...p, herdId: preselectedHerdId }));
        }
      });
  }, [preselectedHerdId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fd = new FormData();
    fd.set("ownerId", form.ownerId);
    fd.set("name", form.name);
    fd.set("species", form.species);
    fd.set("breed", form.breed);
    fd.set("sex", form.sex);
    fd.set("coatColor", form.coatColor);
    fd.set("birthDate", form.birthDate);
    fd.set("chipNumber", form.chipNumber);
    fd.set("chipDate", form.chipDate);
    fd.set("chipManufacturer", form.chipManufacturer);
    fd.set("notes", form.notes);
    fd.set("pedigreeNotes", form.pedigreeNotes);
    fd.set("pedigreeLines", form.pedigreeLines);
    if (form.herdId) fd.set("herdId", form.herdId);
    if (form.species === "kot" && form.catLifestyle) fd.set("catLifestyle", form.catLifestyle);
    const result = await addVetPetAction(fd);
    if (result.ok && result.id && pendingVaccinations.length > 0) {
      const vfd = new FormData();
      vfd.set("petId", result.id);
      vfd.set("vaccinationsJson", JSON.stringify(pendingVaccinations));
      await importPetVaccinationsFromScanAction(vfd);
    }
    setLoading(false);
    if (result.ok) {
      if (result.id) {
        router.push(`/wet/panel/zwierzeta/${result.id}`);
      } else {
        router.push("/wet/panel/zwierzeta/lista");
      }
      router.refresh();
      return;
    }
    setError(result.error);
  }

  return (
    <>
      <WetPanelPageHeader
        title="Nowe zwierzę"
        description="Zarejestruj pacjenta i przypisz go do właściciela z bazy klientów."
      />
      <div className="px-4 py-6 lg:px-8">
        <form onSubmit={handleSubmit} className="mx-auto max-w-lg space-y-4">
          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-[14px] text-red-700" role="alert">
              {error}
            </p>
          )}

          <WetPetDocumentScan
            onDecoded={(data) => {
              applyExtractedPetToForm(data, (fn) => setForm((p) => fn(p) as typeof form));
              setPendingVaccinations(data.vaccinations);
            }}
          />

          <div>
            <label className="block text-[14px] font-medium">Właściciel *</label>
            {owners.length === 0 ? (
              <p className="mt-2 text-[14px] text-wet-navy-muted">
                Brak klientów w bazie.{" "}
                <Link href="/wet/panel/klienci/nowy" className="font-medium text-wet-teal hover:underline">
                  Dodaj klienta
                </Link>{" "}
                najpierw.
              </p>
            ) : (
              <select
                className="wet-input mt-1"
                required
                value={form.ownerId}
                onChange={(e) => setForm((p) => ({ ...p, ownerId: e.target.value }))}
              >
                <option value="">Wybierz właściciela…</option>
                {owners.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name} ({o.phone})
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-[14px] font-medium">Imię zwierzęcia *</label>
            <input
              className="wet-input mt-1"
              required
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[14px] font-medium">Gatunek</label>
              <WetSpeciesSelect
                value={form.species}
                onChange={(species) => setForm((p) => ({ ...p, species }))}
              />
            </div>
            <div>
              <label className="block text-[14px] font-medium">Rasa</label>
              <input
                className="wet-input mt-1"
                value={form.breed}
                onChange={(e) => setForm((p) => ({ ...p, breed: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[14px] font-medium">Płeć</label>
              <select
                className="wet-input mt-1"
                value={form.sex}
                onChange={(e) => setForm((p) => ({ ...p, sex: e.target.value }))}
              >
                <option value="">Nie podano</option>
                {PET_SEX_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[14px] font-medium">Umaszczenie</label>
              <input
                className="wet-input mt-1"
                value={form.coatColor}
                onChange={(e) => setForm((p) => ({ ...p, coatColor: e.target.value }))}
              />
            </div>
          </div>

          {form.species === "kot" && (
            <div>
              <label className="block text-[14px] font-medium">Tryb życia kota</label>
              <select
                className="wet-input mt-1"
                value={form.catLifestyle}
                onChange={(e) => setForm((p) => ({ ...p, catLifestyle: e.target.value }))}
              >
                <option value="">Nie określono — pełny plan</option>
                {CAT_LIFESTYLE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="rounded-xl border border-wet-teal-100 bg-wet-teal-50/40 p-4">
            <p className="text-[13px] font-semibold text-wet-teal-800">Identyfikacja / SAFE-ANIMAL</p>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-[14px] font-medium">Data urodzenia</label>
                <input
                  type="date"
                  className="wet-input mt-1"
                  value={form.birthDate}
                  onChange={(e) => setForm((p) => ({ ...p, birthDate: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-[14px] font-medium">Numer chipu</label>
                <input
                  className="wet-input mt-1 font-mono text-[13px]"
                  value={form.chipNumber}
                  onChange={(e) => setForm((p) => ({ ...p, chipNumber: e.target.value }))}
                />
                <WetSafeAnimalChipLink chipNumber={form.chipNumber} className="mt-1.5" />
              </div>
              <div>
                <label className="block text-[14px] font-medium">Data chipowania</label>
                <input
                  type="date"
                  className="wet-input mt-1"
                  value={form.chipDate}
                  onChange={(e) => setForm((p) => ({ ...p, chipDate: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-[14px] font-medium">Producent chipu</label>
                <input
                  className="wet-input mt-1"
                  placeholder="np. BackHome, Datamars"
                  value={form.chipManufacturer}
                  onChange={(e) => setForm((p) => ({ ...p, chipManufacturer: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {herds.length > 0 && (
            <div>
              <label className="block text-[14px] font-medium">Stado (opcjonalnie)</label>
              <select
                className="wet-input mt-1"
                value={form.herdId}
                onChange={(e) => setForm((p) => ({ ...p, herdId: e.target.value }))}
              >
                <option value="">Bez stada</option>
                {herds.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-[14px] font-medium">Uwagi</label>
            <textarea
              className="wet-input mt-1"
              rows={2}
              value={form.notes}
              onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
            />
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              disabled={loading || owners.length === 0}
              className="wet-btn-primary disabled:opacity-60"
            >
              {loading ? "Zapisuję…" : "Zapisz zwierzę"}
            </button>
            <Link
              href="/wet/panel/zwierzeta/lista"
              className="rounded-lg border border-slate-200 px-5 py-2.5 text-[14px] font-medium hover:bg-slate-50"
            >
              Anuluj
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
