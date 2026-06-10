"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import {
  deletePetAppointmentAction,
  deletePetVaccinationAction,
} from "@/app/actions/vetPetHistory";
import { importPetTreatmentsFromScanAction } from "@/app/actions/vetAppointment";
import { updateVetPetAction, importPetVaccinationsFromScanAction, importPetDewormingsFromScanAction, importPetEctoparasitesFromScanAction } from "@/app/actions/vetAnimals";
import { WetSpeciesSelect } from "@/components/wet/WetSpeciesSelect";
import { WetPetDocumentScan, applyExtractedPetToForm } from "@/components/wet/WetPetDocumentScan";
import { WetPetScanReviewModal } from "@/components/wet/WetPetScanReviewModal";
import type { ExtractedPetDocument } from "@/lib/vet/petDocumentExtract";
import { speciesLabel } from "@/lib/vet/species";
import { VET_PET_STATUSES, petStatusBadgeClass, petStatusLabel } from "@/lib/vet/petStatus";
import {
  PET_SEX_OPTIONS,
  SAFE_ANIMAL_STATUSES,
  formatSafeAnimalSyncedAt,
  petSexLabel,
  safeAnimalStatusBadgeClass,
  safeAnimalStatusLabel,
} from "@/lib/vet/safeAnimal";
import { WetPreventionPlanPanel } from "@/components/wet/WetPreventionPlanPanel";
import type { PreventionChecklistSummary } from "@/lib/vet/preventionEngine";
import { CAT_LIFESTYLE_OPTIONS, catLifestyleLabel } from "@/lib/vet/catLifestyle";
import { WetPetPhotoUpload } from "@/components/wet/WetPetPhotoUpload";
import { WetPetVaccinationQuickAdd } from "@/components/wet/WetPetVaccinationQuickAdd";
import { WetPetTimeline } from "@/components/wet/WetPetTimeline";
import { WetSafeAnimalChipLink } from "@/components/wet/WetSafeAnimalChipLink";
import { WetPetDocumentUpload, type PetDocumentItem } from "@/components/wet/WetPetDocumentUpload";
import type { PetTimelineEvent } from "@/lib/vet/petTimeline";

export type WetPetCardData = {
  id: string;
  name: string;
  species: string;
  photoUrl: string | null;
  breed: string | null;
  sex: string | null;
  coatColor: string | null;
  birthDate: string | null;
  chipNumber: string | null;
  chipDate: string | null;
  chipManufacturer: string | null;
  safeAnimalStatus: string;
  safeAnimalSyncedAt: string | null;
  status: string;
  notes: string | null;
  catLifestyle: string | null;
  owner: { id: string; name: string; phone: string; email: string | null; smsConsent?: boolean; emailConsent?: boolean };
  herd: { id: string; name: string } | null;
  vaccinations: {
    id: string;
    vaccineName: string;
    administeredAt: string;
    nextDueAt: string;
    batchNumber: string | null;
    batchExpiryDate: string | null;
    vetName: string | null;
  }[];
  appointments: {
    id: string;
    date: string;
    time: string;
    visitType: string | null;
    status: string;
    notes: string | null;
    doctorName: string | null;
  }[];
};

type HerdOption = { id: string; name: string };

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const d = iso.includes("T") ? new Date(iso) : new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("pl-PL");
}

function visitStatusLabel(status: string): string {
  if (status === "done") return "Odbyta";
  if (status === "cancelled") return "Anulowana";
  if (status === "no_show") return "Nie przyszedł";
  return "Zaplanowana";
}

function isSafeAnimalReady(pet: WetPetCardData): boolean {
  return missingSafeAnimalFields(pet).length === 0;
}

function missingSafeAnimalFields(pet: WetPetCardData): string[] {
  const missing: string[] = [];
  if (!pet.chipNumber) missing.push("numer chipu");
  if (!pet.chipDate) missing.push("data chipowania");
  if (!pet.chipManufacturer) missing.push("producent chipu");
  if (!pet.species) missing.push("gatunek");
  if (!pet.breed) missing.push("rasa");
  if (!pet.sex) missing.push("płeć");
  if (!pet.coatColor) missing.push("umaszczenie");
  if (!pet.birthDate) missing.push("data urodzenia");
  if (!pet.owner.name) missing.push("właściciel");
  return missing;
}

export function WetPetCardView({
  pet,
  herds,
  preventionChecklist,
  preventionPlanDisabled = false,
  vaccineTypes = [],
  timelineEvents = [],
  documents = [],
}: {
  pet: WetPetCardData;
  herds: HerdOption[];
  preventionChecklist?: PreventionChecklistSummary;
  preventionPlanDisabled?: boolean;
  vaccineTypes?: {
    id: string;
    name: string;
    manufacturer: string | null;
    defaultIntervalDays: number;
    defaultPrice: number | null;
    trackStock: boolean;
    stockDoses: number | null;
  }[];
  timelineEvents?: PetTimelineEvent[];
  documents?: PetDocumentItem[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [deletingVaccinationId, setDeletingVaccinationId] = useState<string | null>(null);
  const [deletingAppointmentId, setDeletingAppointmentId] = useState<string | null>(null);
  const [historyError, setHistoryError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [scanMessage, setScanMessage] = useState("");
  const [scanReview, setScanReview] = useState<ExtractedPetDocument | null>(null);
  const [form, setForm] = useState({
    name: pet.name,
    species: pet.species,
    breed: pet.breed ?? "",
    sex: pet.sex ?? "",
    coatColor: pet.coatColor ?? "",
    birthDate: pet.birthDate ?? "",
    chipNumber: pet.chipNumber ?? "",
    chipDate: pet.chipDate ?? "",
    chipManufacturer: pet.chipManufacturer ?? "",
    safeAnimalStatus: pet.safeAnimalStatus,
    status: pet.status,
    notes: pet.notes ?? "",
    catLifestyle: pet.catLifestyle ?? "",
    herdId: pet.herd?.id ?? "",
  });

  async function handleDeleteVaccination(vaccinationId: string, vaccineName: string) {
    if (!confirm(`Usunąć szczepienie „${vaccineName}” z karty zwierzęcia?`)) return;
    setDeletingVaccinationId(vaccinationId);
    setHistoryError("");
    const res = await deletePetVaccinationAction(pet.id, vaccinationId);
    setDeletingVaccinationId(null);
    if (!res.ok) {
      setHistoryError(res.error);
      return;
    }
    router.refresh();
  }

  async function handleDeleteAppointment(appointmentId: string) {
    if (!confirm("Usunąć tę wizytę z historii zwierzęcia?")) return;
    setDeletingAppointmentId(appointmentId);
    setHistoryError("");
    const res = await deletePetAppointmentAction(pet.id, appointmentId);
    setDeletingAppointmentId(null);
    if (!res.ok) {
      setHistoryError(res.error);
      return;
    }
    router.refresh();
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fd = new FormData();
    fd.set("id", pet.id);
    fd.set("name", form.name);
    fd.set("species", form.species);
    fd.set("breed", form.breed);
    fd.set("sex", form.sex);
    fd.set("coatColor", form.coatColor);
    fd.set("birthDate", form.birthDate);
    fd.set("chipNumber", form.chipNumber);
    fd.set("chipDate", form.chipDate);
    fd.set("chipManufacturer", form.chipManufacturer);
    fd.set("safeAnimalStatus", form.safeAnimalStatus);
    fd.set("status", form.status);
    fd.set("notes", form.notes);
    fd.set("catLifestyle", form.catLifestyle);
    if (form.herdId) fd.set("herdId", form.herdId);
    const result = await updateVetPetAction(fd);
    setLoading(false);
    if (result.ok) {
      setEditing(false);
      router.refresh();
      return;
    }
    setError(result.error);
  }

  const overdueVaccinations = pet.vaccinations.filter(
    (v) => new Date(v.nextDueAt).getTime() < Date.now()
  );

  function handleDocumentScan(data: ExtractedPetDocument) {
    setScanMessage("");
    setError("");
    setScanReview(data);
  }

  async function acceptDocumentScan(data: ExtractedPetDocument) {
    setScanReview(null);
    applyExtractedPetToForm(data, (fn) => setForm((p) => fn(p) as typeof form));

    const parts: string[] = [];

    if (data.vaccinations.length > 0) {
      const fd = new FormData();
      fd.set("petId", pet.id);
      fd.set("vaccinationsJson", JSON.stringify(data.vaccinations));
      const result = await importPetVaccinationsFromScanAction(fd);
      if (result.ok) {
        parts.push(`${result.imported} szczepień`);
      } else {
        setError(result.error);
        return;
      }
    }

    if (data.dewormings?.length > 0) {
      const fd = new FormData();
      fd.set("petId", pet.id);
      fd.set("dewormingsJson", JSON.stringify(data.dewormings));
      const result = await importPetDewormingsFromScanAction(fd);
      if (result.ok) {
        parts.push(`${result.imported} odrobaczeń`);
      } else {
        setError(result.error);
        return;
      }
    }

    if (data.ectoparasites?.length > 0) {
      const fd = new FormData();
      fd.set("petId", pet.id);
      fd.set("ectoparasitesJson", JSON.stringify(data.ectoparasites));
      const result = await importPetEctoparasitesFromScanAction(fd);
      if (result.ok) {
        parts.push(`${result.imported} ektopasożytów`);
      } else {
        setError(result.error);
        return;
      }
    }

    if (data.treatments?.length > 0) {
      const fd = new FormData();
      fd.set("petId", pet.id);
      fd.set("treatmentsJson", JSON.stringify(data.treatments));
      const result = await importPetTreatmentsFromScanAction(fd);
      if (result.ok) {
        parts.push(`${result.imported} leczeń`);
      } else {
        setError(result.error);
        return;
      }
    }

    if (parts.length > 0) {
      setScanMessage(`Zaimportowano: ${parts.join(", ")} ze skanu.`);
      router.refresh();
    } else {
      setScanMessage("Dane ze skanu wstawione — zapisz kartę, jeśli chcesz je utrwalić.");
    }
  }

  return (
    <div className="px-4 py-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <WetPetPhotoUpload
            petId={pet.id}
            petName={pet.name}
            species={pet.species}
            photoUrl={pet.photoUrl}
          />
          <div>
          <Link
            href="/wet/panel/zwierzeta/lista"
            className="text-[13px] font-medium text-wet-teal hover:underline"
          >
            ← Lista zwierząt
          </Link>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold text-wet-navy">{pet.name}</h2>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${petStatusBadgeClass(pet.status)}`}
            >
              {petStatusLabel(pet.status)}
            </span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${safeAnimalStatusBadgeClass(pet.safeAnimalStatus)}`}
            >
              {safeAnimalStatusLabel(pet.safeAnimalStatus)}
            </span>
          </div>
          <p className="mt-1 text-[14px] text-wet-navy-muted">
            Właściciel:{" "}
            <Link href={`/wet/panel/klienci/${pet.owner.id}`} className="font-medium text-wet-teal hover:underline">
              {pet.owner.name}
            </Link>
            {" · "}{pet.owner.phone}
            {pet.owner.email ? ` · ${pet.owner.email}` : ""}
          </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/wet/panel/szczepienia?petId=${pet.id}`}
            className="wet-btn-primary text-center text-[13px]"
          >
            + Szczepienie
          </Link>
          <Link
            href={`/wet/panel/zwierzeta/${pet.id}/druk`}
            target="_blank"
            className="rounded-lg border border-slate-200 px-4 py-2 text-[13px] font-medium hover:bg-slate-50"
          >
            Drukuj kartę
          </Link>
          <button
            type="button"
            onClick={() => setEditing((v) => !v)}
            className="rounded-lg border border-wet-teal-200 px-4 py-2 text-[13px] font-medium text-wet-teal-800 hover:bg-wet-teal-50"
          >
            {editing ? "Anuluj edycję" : "Edytuj"}
          </button>
        </div>
      </div>

      <div className="mb-8">
        <WetPetDocumentScan variant="feature" onDecoded={handleDocumentScan} hint={`Pacjent: ${pet.name}`} />
        {scanMessage && (
          <p className="mt-2 text-[13px] text-wet-teal-800">{scanMessage}</p>
        )}
      </div>

      {scanReview && (
        <WetPetScanReviewModal
          data={scanReview}
          onAccept={acceptDocumentScan}
          onCancel={() => setScanReview(null)}
        />
      )}

      {editing ? (
        <form onSubmit={handleSave} className="mb-8 max-w-xl space-y-4 rounded-xl border border-wet-teal-200 bg-white p-4">
          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-[14px] text-red-700" role="alert">
              {error}
            </p>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[14px] font-medium">Imię</label>
              <input
                className="wet-input mt-1"
                required
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-[14px] font-medium">Status</label>
              <select
                className="wet-input mt-1"
                value={form.status}
                onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
              >
                {VET_PET_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
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
          <div className="grid gap-4 sm:grid-cols-2">
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
              <label className="block text-[14px] font-medium">Status SAFE-ANIMAL</label>
              <select
                className="wet-input mt-1"
                value={form.safeAnimalStatus}
                onChange={(e) => setForm((p) => ({ ...p, safeAnimalStatus: e.target.value }))}
              >
                {SAFE_ANIMAL_STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {(form.species === "kot" || pet.species === "kot") && (
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
              <p className="mt-1 text-[12px] text-wet-navy-muted">
                Domowy: ukrywa profilaktykę outdoor (pchły, FeLV, wścieklizna). Wychodzący: ukrywa badania laboratoryjne.
              </p>
            </div>
          )}
          <div className="rounded-xl border border-wet-teal-100 bg-wet-teal-50/40 p-4">
            <p className="text-[13px] font-semibold text-wet-teal-800">Identyfikacja / chip</p>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
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
              <div className="sm:col-span-2">
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
              <label className="block text-[14px] font-medium">Stado</label>
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
              rows={3}
              value={form.notes}
              onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
            />
          </div>
          <button type="submit" disabled={loading} className="wet-btn-primary disabled:opacity-60">
            {loading ? "Zapisuję…" : "Zapisz zmiany"}
          </button>
        </form>
      ) : (
        <>
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <InfoBox label="Gatunek / rasa" value={[speciesLabel(pet.species), pet.breed].filter(Boolean).join(" · ") || "—"} />
            <InfoBox label="Płeć" value={petSexLabel(pet.sex)} />
            <InfoBox label="Umaszczenie" value={pet.coatColor || "—"} />
            <InfoBox label="Data urodzenia" value={formatDate(pet.birthDate)} />
            {pet.species === "kot" && (
              <InfoBox label="Tryb życia" value={catLifestyleLabel(pet.catLifestyle)} />
            )}
            <InfoBox
              label="Stado"
              value={
                pet.herd ? (
                  <Link href={`/wet/panel/zwierzeta/stada/${pet.herd.id}`} className="text-wet-teal hover:underline">
                    {pet.herd.name}
                  </Link>
                ) : (
                  "—"
                )
              }
            />
          </div>

          <section className="mb-8 rounded-xl border border-wet-teal-200 bg-white p-4">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-[15px] font-semibold text-wet-navy">SAFE-ANIMAL — identyfikacja</h3>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${safeAnimalStatusBadgeClass(pet.safeAnimalStatus)}`}
              >
                {safeAnimalStatusLabel(pet.safeAnimalStatus)}
              </span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <InfoBox
                label="Numer chipu"
                mono
                value={
                  pet.chipNumber ? (
                    <>
                      {pet.chipNumber}
                      <WetSafeAnimalChipLink chipNumber={pet.chipNumber} className="mt-1.5" />
                    </>
                  ) : (
                    "—"
                  )
                }
              />
              <InfoBox label="Data chipowania" value={formatDate(pet.chipDate)} />
              <InfoBox label="Producent chipu" value={pet.chipManufacturer || "—"} />
              <InfoBox
                label="Właściciel"
                value={
                  <Link href={`/wet/panel/klienci/${pet.owner.id}`} className="text-wet-teal hover:underline">
                    {pet.owner.name}
                  </Link>
                }
              />
              <InfoBox label="Data synchronizacji" value={formatSafeAnimalSyncedAt(pet.safeAnimalSyncedAt)} />
              <InfoBox
                label="Kompletność danych"
                value={isSafeAnimalReady(pet) ? "Gotowe do eksportu" : "Uzupełnij brakujące pola"}
              />
            </div>
            {!isSafeAnimalReady(pet) && (
              <p className="mt-3 text-[13px] text-amber-700">
                Do synchronizacji z SAFE-ANIMAL uzupełnij:{" "}
                {missingSafeAnimalFields(pet).join(", ")}.
              </p>
            )}
          </section>
        </>
      )}

      {pet.notes && !editing && (
        <div className="mb-8 rounded-xl border border-wet-teal-100 bg-wet-teal-50/40 px-4 py-3 text-[14px] text-wet-navy">
          <p className="font-medium text-wet-teal-800">Uwagi</p>
          <p className="mt-1 whitespace-pre-wrap">{pet.notes}</p>
        </div>
      )}

      {preventionChecklist && (
        <WetPreventionPlanPanel
          petId={pet.id}
          species={pet.species}
          checklist={preventionChecklist}
          planDisabled={preventionPlanDisabled}
          catLifestyle={pet.catLifestyle}
          birthDate={pet.birthDate}
        />
      )}

      <section className="mb-8">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-wet-navy">Historia życia zwierzęcia</h3>
            <p className="mt-0.5 text-[13px] text-wet-navy-muted">
              Szczepienia, wizyty, profilaktyka i przypomnienia — jeden timeline.
            </p>
          </div>
        </div>
        <WetPetTimeline petId={pet.id} events={timelineEvents} />
      </section>

      {historyError && (
        <p className="mb-6 rounded-lg bg-red-50 px-3 py-2 text-[13px] text-red-700">{historyError}</p>
      )}

      <section className="mb-8">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-wet-navy">
            Szczepienia
            {overdueVaccinations.length > 0 && (
              <span className="ml-2 text-[13px] font-normal text-amber-700">
                ({overdueVaccinations.length} zaległe)
              </span>
            )}
          </h3>
          <div className="flex flex-wrap items-center gap-3">
            <Link href={`/wet/panel/szczepienia?petId=${pet.id}&mode=odrobaczanie`} className="text-[13px] font-medium text-violet-700 hover:underline">
              🪱 Endopasożyty
            </Link>
            <Link href={`/wet/panel/szczepienia?petId=${pet.id}&mode=ektopasożyty`} className="text-[13px] font-medium text-amber-700 hover:underline">
              🦟 Ektopasożyty
            </Link>
            <Link href={`/wet/panel/szczepienia?petId=${pet.id}&mode=leczenie`} className="text-[13px] font-medium text-rose-700 hover:underline">
              💊 Leczenie
            </Link>
            <Link href={`/wet/panel/szczepienia?petId=${pet.id}`} className="text-[13px] font-medium text-wet-teal hover:underline">
              Recepcja →
            </Link>
          </div>
        </div>
        <WetPetVaccinationQuickAdd
          petId={pet.id}
          petName={pet.name}
          petSpecies={pet.species}
          vaccineTypes={vaccineTypes}
          ownerSmsConsent={pet.owner.smsConsent ?? false}
          ownerEmailConsent={pet.owner.emailConsent ?? false}
        />
        {pet.vaccinations.length === 0 ? (
          <div className="rounded-xl border border-dashed border-wet-teal-200 bg-wet-teal-50/20 px-6 py-8 text-center">
            <p className="text-2xl" aria-hidden>
              💉
            </p>
            <p className="mt-2 font-medium text-wet-navy">Brak zapisanych szczepień</p>
            <p className="mt-1 text-[13px] text-wet-navy-muted">
              Dodaj pierwsze szczepienie — albo użyj skanu AI książeczki powyżej.
            </p>
            <Link
              href={`/wet/panel/szczepienia?petId=${pet.id}`}
              className="mt-4 inline-block wet-btn-primary text-[13px]"
            >
              + Dodaj szczepienie
            </Link>
          </div>
        ) : (
          <ul className="space-y-2">
            {pet.vaccinations.map((v) => {
              const overdue = new Date(v.nextDueAt).getTime() < Date.now();
              return (
                <li
                  key={v.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-wet-teal-100 bg-white px-4 py-3"
                >
                  <div>
                    <p className="font-medium text-wet-navy">{v.vaccineName}</p>
                    <p className="mt-0.5 text-[12px] text-wet-navy-muted">
                      Podano {formatDate(v.administeredAt)}
                      {v.batchNumber ? ` · seria ${v.batchNumber}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-right">
                    <div>
                      <p className={`text-[13px] ${overdue ? "font-semibold text-amber-700" : "text-wet-navy-muted"}`}>
                        Nast.: {formatDate(v.nextDueAt)}
                        {overdue ? " · zaległe" : ""}
                      </p>
                      <Link
                        href={`/wet/panel/zwierzeta/${pet.id}/szczepienia/${v.id}/zaswiadczenie`}
                        target="_blank"
                        className="text-[12px] font-medium text-wet-teal hover:underline"
                      >
                        Zaświadczenie
                      </Link>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteVaccination(v.id, v.vaccineName)}
                      disabled={deletingVaccinationId === v.id}
                      className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                      aria-label={`Usuń szczepienie ${v.vaccineName}`}
                      title="Usuń"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="mb-8">
        <h3 className="mb-3 text-lg font-semibold text-wet-navy">Ostatnie wizyty</h3>
        {pet.appointments.length === 0 ? (
          <div className="rounded-xl border border-dashed border-wet-teal-200 bg-white px-6 py-8 text-center">
            <p className="text-2xl" aria-hidden>
              🩺
            </p>
            <p className="mt-2 font-medium text-wet-navy">Brak wizyt dla tego zwierzęcia</p>
            <Link href="/wet/panel/kalendarz" className="mt-4 inline-block wet-btn-primary text-[13px]">
              + Dodaj pierwszą wizytę
            </Link>
          </div>
        ) : (
          <ul className="space-y-2">
            {pet.appointments.slice(0, 5).map((a) => (
              <li
                key={a.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-wet-teal-100 bg-white px-4 py-3 text-[14px]"
              >
                <div>
                  <p className="font-medium capitalize text-wet-navy">{a.visitType || "Wizyta"}</p>
                  <p className="text-[12px] text-wet-navy-muted">
                    {formatDate(a.date)} · {a.time}
                    {a.doctorName ? ` · ${a.doctorName}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                    {visitStatusLabel(a.status)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteAppointment(a.id)}
                    disabled={deletingAppointmentId === a.id}
                    className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                    aria-label="Usuń wizytę"
                    title="Usuń"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mb-8 rounded-xl border border-wet-teal-100 bg-white p-4">
        <h3 className="text-[15px] font-semibold text-wet-navy">Dokumentacja medyczna</h3>
        <p className="mt-1 text-[13px] text-wet-navy-muted">
          Książeczka, RTG, wyniki, recepta — przy zwierzęciu, bez pełnego EDM.
        </p>
        <div className="mt-4">
          <WetPetDocumentUpload petId={pet.id} documents={documents} />
        </div>
      </section>
    </div>
  );
}

function InfoBox({
  label,
  value,
  mono,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="rounded-xl border border-wet-teal-100 bg-white px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-wet-navy-muted">{label}</p>
      <p className={`mt-1 text-[14px] text-wet-navy ${mono ? "font-mono text-[13px]" : ""}`}>{value}</p>
    </div>
  );
}
