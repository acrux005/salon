"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { recordVaccinationAction } from "@/app/actions/vet";
import {
  addDaysIso,
  formatDatePl,
  todayIso,
  type VaccineOption,
} from "@/lib/vet/vaccinationQuickAddUtils";
import {
  filterVaccinesByTemplate,
  getDefaultTemplateId,
  getTemplatesForSpecies,
  resolveTemplateSlots,
  type VaccinationTemplate,
} from "@/lib/vet/vaccinationTemplates";

type Props = {
  petId: string;
  petName: string;
  petSpecies?: string;
  vaccineTypes: VaccineOption[];
  ownerSmsConsent: boolean;
  ownerEmailConsent: boolean;
  onSuccess?: (message: string) => void;
  onSaved?: () => void;
  compact?: boolean;
};

export function WetVaccinationQuickAddPanel({
  petId,
  petName,
  petSpecies,
  vaccineTypes,
  ownerSmsConsent,
  ownerEmailConsent,
  onSuccess,
  onSaved,
  compact = false,
}: Props) {
  const templates = useMemo(() => getTemplatesForSpecies(petSpecies), [petSpecies]);
  const [templateId, setTemplateId] = useState<string | null>(() => getDefaultTemplateId(petSpecies));
  const activeTemplate = useMemo(
    () => templates.find((t) => t.id === templateId) ?? null,
    [templates, templateId]
  );
  const filteredVaccines = useMemo(
    () => filterVaccinesByTemplate(activeTemplate, vaccineTypes),
    [activeTemplate, vaccineTypes]
  );
  const [vaccineTypeId, setVaccineTypeId] = useState(filteredVaccines[0]?.id ?? vaccineTypes[0]?.id ?? "");
  const [date] = useState(todayIso());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [batchNumber, setBatchNumber] = useState("");

  const selectedVaccine = useMemo(
    () => vaccineTypes.find((v) => v.id === vaccineTypeId),
    [vaccineTypes, vaccineTypeId]
  );

  const nextDuePreview = selectedVaccine ? addDaysIso(date, selectedVaccine.defaultIntervalDays) : null;

  const templateSlots = useMemo(
    () => (activeTemplate ? resolveTemplateSlots(activeTemplate, vaccineTypes) : []),
    [activeTemplate, vaccineTypes]
  );

  function selectTemplate(template: VaccinationTemplate) {
    setTemplateId(template.id);
    const resolved = resolveTemplateSlots(template, vaccineTypes);
    const first = resolved.find((r) => r.vaccine)?.vaccine;
    if (first) setVaccineTypeId(first.id);
  }

  async function submit() {
    if (!petId || !vaccineTypeId) return;
    setLoading(true);
    setError("");
    setSuccess("");
    const fd = new FormData();
    fd.set("petId", petId);
    fd.set("vaccineTypeId", vaccineTypeId);
    fd.set("administeredAt", date);
    if (batchNumber.trim()) fd.set("batchNumber", batchNumber.trim());
    const result = await recordVaccinationAction(fd);
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    const channels: string[] = [];
    if (result.smsEnabled) channels.push("SMS");
    if (result.emailEnabled) channels.push("e-mail");
    const message = `✅ ${result.vaccineName} · następny ${formatDatePl(result.nextDueAt)}${
      channels.length ? ` · ${channels.join(" + ")}` : ""
    }`;
    setSuccess(message);
    onSuccess?.(message);
    setBatchNumber("");

    const currentIndex = templateSlots.findIndex((s) => s.vaccine?.id === vaccineTypeId);
    const nextSlot = currentIndex >= 0 ? templateSlots.slice(currentIndex + 1).find((s) => s.vaccine) : null;
    if (nextSlot?.vaccine) {
      setTimeout(() => {
        setVaccineTypeId(nextSlot.vaccine!.id);
        setSuccess(`Zapisano. Następny ze schematu: ${nextSlot.slot.label}`);
      }, 800);
    } else {
      setTimeout(() => {
        setSuccess("");
        onSaved?.();
      }, 1400);
    }
  }

  if (vaccineTypes.length === 0) {
    return (
      <p className="text-[13px] text-wet-navy-muted">
        Dodaj preparaty w{" "}
        <Link href="/wet/panel/katalog" className="font-medium text-wet-teal hover:underline">
          katalogu
        </Link>
        .
      </p>
    );
  }

  return (
    <div className={compact ? "space-y-3" : "space-y-4"}>
      {!compact && (
        <div>
          <p className="text-[12px] font-medium uppercase tracking-wide text-wet-navy-muted">Pacjent</p>
          <p className="mt-1 text-[15px] font-semibold text-wet-navy">{petName}</p>
        </div>
      )}

      {templates.length > 0 && (
        <div>
          <p className="text-[12px] font-medium uppercase tracking-wide text-wet-navy-muted">Schemat</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {templates.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => selectTemplate(t)}
                className={`rounded-full px-3 py-1.5 text-[12px] font-medium transition ${
                  templateId === t.id
                    ? "bg-wet-navy text-white"
                    : "border border-slate-200 bg-white text-wet-navy hover:border-wet-teal-200"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="text-[12px] font-medium uppercase tracking-wide text-wet-navy-muted">Szczepionka</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {filteredVaccines.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setVaccineTypeId(v.id)}
              className={`rounded-full px-3 py-1.5 text-[12px] font-medium transition ${
                vaccineTypeId === v.id
                  ? "bg-wet-teal text-white"
                  : "border border-slate-200 bg-white text-wet-navy hover:border-wet-teal-200"
              }`}
            >
              💉 {v.name}
            </button>
          ))}
        </div>
        {filteredVaccines.length === 0 && (
          <select
            className="wet-input mt-2 text-[13px]"
            value={vaccineTypeId}
            onChange={(e) => setVaccineTypeId(e.target.value)}
          >
            {vaccineTypes.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {selectedVaccine && nextDuePreview && (
        <div className="rounded-xl bg-wet-teal-50/70 px-3 py-3 text-[13px] text-wet-navy">
          <p>
            📅 <strong>Dziś</strong>
            <span className="text-wet-navy-muted"> · {formatDatePl(date)}</span>
          </p>
          <p className="mt-1">
            🔁 Następny: <strong>{formatDatePl(nextDuePreview)}</strong>
            <span className="text-wet-navy-muted"> (auto)</span>
          </p>
          <p className="mt-1">
            📩{" "}
            {ownerSmsConsent || ownerEmailConsent ? (
              <>
                Przypomnienia:{" "}
                <strong>{[ownerSmsConsent && "SMS", ownerEmailConsent && "e-mail"].filter(Boolean).join(" + ")}</strong>
                <span className="text-wet-navy-muted"> (auto)</span>
              </>
            ) : (
              <span className="text-amber-700">Brak zgód — przypomnienia wyłączone</span>
            )}
          </p>
        </div>
      )}

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-[13px] text-red-700">{error}</p>}
      {success && <p className="rounded-lg bg-green-50 px-3 py-2 text-[13px] text-green-800">{success}</p>}

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={loading || !vaccineTypeId}
          onClick={submit}
          className="wet-btn-primary flex-1 text-[14px] disabled:opacity-60 sm:flex-none sm:px-8"
        >
          {loading ? "Zapisuję…" : "Zapisz"}
        </button>
        {!compact && (
          <button
            type="button"
            onClick={() => setShowAdvanced((v) => !v)}
            className="text-[12px] text-wet-navy-muted hover:text-wet-teal"
          >
            {showAdvanced ? "Mniej opcji" : "Seria (opcjonalnie)"}
          </button>
        )}
      </div>

      {showAdvanced && (
        <label className="block">
          <span className="text-[12px] font-medium text-wet-navy-muted">Numer serii</span>
          <input
            type="text"
            value={batchNumber}
            onChange={(e) => setBatchNumber(e.target.value)}
            className="wet-input mt-1 text-[13px]"
            placeholder="Opcjonalnie"
          />
        </label>
      )}
    </div>
  );
}
