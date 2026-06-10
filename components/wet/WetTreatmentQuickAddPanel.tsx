"use client";

import { useState } from "react";
import { recordTreatmentAction } from "@/app/actions/vetAppointment";
import { formatDatePl, todayIso } from "@/lib/vet/vaccinationQuickAddUtils";
import { TREATMENT_QUICK_LABELS } from "@/lib/vet/treatment";

export function WetTreatmentQuickAddPanel({
  petId,
  onSaved,
}: {
  petId: string;
  onSaved?: () => void;
}) {
  const [date] = useState(todayIso());
  const [summary, setSummary] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [medications, setMedications] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function submit() {
    if (!summary.trim()) {
      setError("Opisz leczenie — choć jednym zdaniem.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    const fd = new FormData();
    fd.set("petId", petId);
    fd.set("doneAt", date);
    fd.set("summary", summary.trim());
    if (diagnosis.trim()) fd.set("diagnosis", diagnosis.trim());
    if (medications.trim()) fd.set("medications", medications.trim());
    const result = await recordTreatmentAction(fd);
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setSuccess(`✅ Leczenie zapisane · ${formatDatePl(date)}`);
    setSummary("");
    setDiagnosis("");
    setMedications("");
    setTimeout(() => {
      setSuccess("");
      onSaved?.();
    }, 1400);
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[12px] font-medium uppercase tracking-wide text-wet-navy-muted">Leczenie</p>
        <p className="mt-1 text-[14px] font-medium text-wet-navy">Strona leczenia w książeczce</p>
        <p className="text-[12px] text-wet-navy-muted">Trafia do historii wizyt i timeline — nie do szczepień.</p>
      </div>

      <div>
        <p className="text-[12px] font-medium uppercase tracking-wide text-wet-navy-muted">Szybki wybór</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {TREATMENT_QUICK_LABELS.map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => setSummary((s) => (s ? `${s}, ${label}` : label))}
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-medium text-wet-navy hover:border-rose-200"
            >
              💊 {label}
            </button>
          ))}
        </div>
      </div>

      <label className="block">
        <span className="text-[12px] font-medium text-wet-navy-muted">Co wykonano / rozpoznanie *</span>
        <input
          className="wet-input mt-1 text-[13px]"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="np. Zapalenie uszu — leczenie miejscowe"
        />
      </label>

      <label className="block">
        <span className="text-[12px] font-medium text-wet-navy-muted">Leki / preparaty (opcjonalnie)</span>
        <input
          className="wet-input mt-1 text-[13px]"
          value={medications}
          onChange={(e) => setMedications(e.target.value)}
          placeholder="np. Otomax 7 dni"
        />
      </label>

      <div className="rounded-xl bg-rose-50/70 px-3 py-3 text-[13px] text-wet-navy">
        <p>
          📅 <strong>Dziś</strong>
          <span className="text-wet-navy-muted"> · {formatDatePl(date)}</span>
        </p>
        <p className="mt-1 text-wet-navy-muted">📋 Wpis w historii życia zwierzęcia (wizyta odbyta)</p>
      </div>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-[13px] text-red-700">{error}</p>}
      {success && <p className="rounded-lg bg-green-50 px-3 py-2 text-[13px] text-green-800">{success}</p>}

      <button
        type="button"
        disabled={loading}
        onClick={submit}
        className="rounded-lg bg-rose-600 px-6 py-2.5 text-[14px] font-semibold text-white hover:bg-rose-700 disabled:opacity-60"
      >
        {loading ? "Zapisuję…" : "💊 Zapisz leczenie"}
      </button>
    </div>
  );
}
