"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { WetVaccinationQuickAddPanel } from "@/components/wet/WetVaccinationQuickAddPanel";
import { WetDewormingQuickAddPanel } from "@/components/wet/WetDewormingQuickAddPanel";
import { WetEctoparasiteQuickAddPanel } from "@/components/wet/WetEctoparasiteQuickAddPanel";
import { WetTreatmentQuickAddPanel } from "@/components/wet/WetTreatmentQuickAddPanel";
import type { ReceptionMode } from "@/lib/vet/deworming";
import { normalizeReceptionMode } from "@/lib/vet/deworming";
import { speciesLabel } from "@/lib/vet/species";
import type { VaccineOption } from "@/lib/vet/vaccinationQuickAddUtils";

export type ReceptionPet = {
  id: string;
  name: string;
  species: string;
  birthDate: string | null;
  ownerName: string;
  ownerPhone: string;
  smsConsent: boolean;
  emailConsent: boolean;
};

export function WetVaccinationReception({
  pets,
  vaccineTypes,
  defaultPetId,
  defaultMode = "szczepienie",
}: {
  pets: ReceptionPet[];
  vaccineTypes: VaccineOption[];
  defaultPetId?: string;
  defaultMode?: ReceptionMode;
}) {
  const router = useRouter();
  const initialPetId =
    defaultPetId && pets.some((p) => p.id === defaultPetId) ? defaultPetId : (pets[0]?.id ?? "");
  const [petId, setPetId] = useState(initialPetId);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [mode, setMode] = useState<ReceptionMode>(normalizeReceptionMode(defaultMode));

  const selectedPet = pets.find((p) => p.id === petId);

  const filteredPets = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return pets.slice(0, 8);
    return pets
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.ownerName.toLowerCase().includes(q) ||
          p.ownerPhone.includes(q)
      )
      .slice(0, 8);
  }, [pets, search]);

  if (pets.length === 0) {
    return (
      <p className="mt-8 rounded-xl bg-amber-50 px-4 py-4 text-[14px] text-amber-900">
        Najpierw dodaj pacjenta w{" "}
        <Link href="/wet/panel/zwierzeta/lista" className="font-medium underline">
          Pacjenci
        </Link>
        .
      </p>
    );
  }

  return (
    <section className="mt-8 overflow-hidden rounded-2xl border border-wet-teal-200 bg-white shadow-sm">
      <div className="border-b border-wet-teal-100 bg-gradient-to-r from-wet-teal-50 to-white px-5 py-4">
        <h2 className="text-lg font-semibold text-wet-navy">Recepcja — szybkie szczepienie</h2>
        <p className="mt-1 text-[13px] text-wet-navy-muted">
          Wybierz pacjenta, kliknij schemat, zapisz. Termin i SMS robi system.
        </p>
      </div>

      <div className="space-y-5 p-5">
        <div className="relative">
          <label className="text-[12px] font-medium uppercase tracking-wide text-wet-navy-muted">
            Pacjent
          </label>
          {selectedPet && !searchOpen ? (
            <button
              type="button"
              onClick={() => {
                setSearchOpen(true);
                setSearch("");
              }}
              className="mt-2 flex w-full items-center justify-between rounded-xl border border-wet-teal-200 bg-wet-teal-50/40 px-4 py-3 text-left"
            >
              <div>
                <p className="font-semibold text-wet-navy">{selectedPet.name}</p>
                <p className="text-[13px] text-wet-navy-muted">
                  {selectedPet.ownerName} · {selectedPet.ownerPhone} · {speciesLabel(selectedPet.species)}
                </p>
              </div>
              <span className="text-[12px] text-wet-teal">Zmień</span>
            </button>
          ) : (
            <div className="mt-2">
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setSearchOpen(true)}
                placeholder="Szukaj po imieniu, właścicielu lub telefonie…"
                className="wet-input text-[14px]"
                autoFocus={searchOpen}
              />
              <ul className="mt-2 max-h-48 overflow-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                {filteredPets.map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setPetId(p.id);
                        setSearchOpen(false);
                        setSearch("");
                      }}
                      className={`flex w-full flex-col px-4 py-2.5 text-left text-[13px] hover:bg-wet-teal-50 ${
                        p.id === petId ? "bg-wet-teal-50" : ""
                      }`}
                    >
                      <span className="font-medium text-wet-navy">{p.name}</span>
                      <span className="text-wet-navy-muted">
                        {p.ownerName} · {p.ownerPhone} · {speciesLabel(p.species)}
                      </span>
                    </button>
                  </li>
                ))}
                {filteredPets.length === 0 && (
                  <li className="px-4 py-3 text-[13px] text-wet-navy-muted">Brak wyników.</li>
                )}
              </ul>
            </div>
          )}
        </div>

        {selectedPet && (
          <>
            <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-50 p-1 sm:grid-cols-4">
              <button
                type="button"
                onClick={() => setMode("szczepienie")}
                className={`rounded-lg px-2 py-2 text-[11px] font-medium sm:text-[12px] ${
                  mode === "szczepienie" ? "bg-white text-wet-navy shadow-sm" : "text-wet-navy-muted"
                }`}
              >
                💉 Szczepienie
              </button>
              <button
                type="button"
                onClick={() => setMode("odrobaczanie")}
                className={`rounded-lg px-2 py-2 text-[11px] font-medium sm:text-[12px] ${
                  mode === "odrobaczanie" ? "bg-white text-wet-navy shadow-sm" : "text-wet-navy-muted"
                }`}
              >
                🪱 Endopasożyty
              </button>
              <button
                type="button"
                onClick={() => setMode("ektopasożyty")}
                className={`rounded-lg px-2 py-2 text-[11px] font-medium sm:text-[12px] ${
                  mode === "ektopasożyty" ? "bg-white text-wet-navy shadow-sm" : "text-wet-navy-muted"
                }`}
              >
                🦟 Ektopasożyty
              </button>
              <button
                type="button"
                onClick={() => setMode("leczenie")}
                className={`rounded-lg px-2 py-2 text-[11px] font-medium sm:text-[12px] ${
                  mode === "leczenie" ? "bg-white text-wet-navy shadow-sm" : "text-wet-navy-muted"
                }`}
              >
                💊 Leczenie
              </button>
            </div>

            {mode === "szczepienie" ? (
              <WetVaccinationQuickAddPanel
                key={`vac-${selectedPet.id}`}
                petId={selectedPet.id}
                petName={selectedPet.name}
                petSpecies={selectedPet.species}
                vaccineTypes={vaccineTypes}
                ownerSmsConsent={selectedPet.smsConsent}
                ownerEmailConsent={selectedPet.emailConsent}
                onSaved={() => router.refresh()}
              />
            ) : mode === "odrobaczanie" ? (
              <WetDewormingQuickAddPanel
                key={`dew-${selectedPet.id}`}
                petId={selectedPet.id}
                petName={selectedPet.name}
                petSpecies={selectedPet.species}
                birthDate={selectedPet.birthDate}
                ownerSmsConsent={selectedPet.smsConsent}
                ownerEmailConsent={selectedPet.emailConsent}
                onSaved={() => router.refresh()}
              />
            ) : mode === "ektopasożyty" ? (
              <WetEctoparasiteQuickAddPanel
                key={`ecto-${selectedPet.id}`}
                petId={selectedPet.id}
                petSpecies={selectedPet.species}
                ownerSmsConsent={selectedPet.smsConsent}
                ownerEmailConsent={selectedPet.emailConsent}
                onSaved={() => router.refresh()}
              />
            ) : (
              <WetTreatmentQuickAddPanel
                key={`tx-${selectedPet.id}`}
                petId={selectedPet.id}
                onSaved={() => router.refresh()}
              />
            )}
          </>
        )}
      </div>
    </section>
  );
}
