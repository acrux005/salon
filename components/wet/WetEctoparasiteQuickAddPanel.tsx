"use client";

import { useMemo, useState } from "react";
import { recordEctoparasiteAction } from "@/app/actions/vetPrevention";
import { addDaysIso, formatDatePl, todayIso } from "@/lib/vet/vaccinationQuickAddUtils";
import { ectoparasiteItemTitle, getEctoparasiteIntervalDays } from "@/lib/vet/ectoparasites";

const COMMON_PRODUCTS = ["Frontline", "Bravecto", "Simparica", "Nexgard", "Stronghold"];

export function WetEctoparasiteQuickAddPanel({
  petId,
  petSpecies,
  ownerSmsConsent,
  ownerEmailConsent,
  onSaved,
}: {
  petId: string;
  petSpecies: string;
  ownerSmsConsent: boolean;
  ownerEmailConsent: boolean;
  onSaved?: () => void;
}) {
  const [date] = useState(todayIso());
  const [productName, setProductName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const title = useMemo(() => ectoparasiteItemTitle(petSpecies), [petSpecies]);
  const intervalDays = useMemo(() => getEctoparasiteIntervalDays(petSpecies), [petSpecies]);
  const nextDuePreview = addDaysIso(date, intervalDays);

  async function submit() {
    setLoading(true);
    setError("");
    setSuccess("");
    const fd = new FormData();
    fd.set("petId", petId);
    fd.set("doneAt", date);
    if (productName.trim()) fd.set("productName", productName.trim());
    const result = await recordEctoparasiteAction(fd);
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setSuccess(`✅ ${result.title} · następne ${formatDatePl(result.nextDueAt)}`);
    setProductName("");
    setTimeout(() => {
      setSuccess("");
      onSaved?.();
    }, 1400);
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[12px] font-medium uppercase tracking-wide text-wet-navy-muted">Ektopasożyty</p>
        <p className="mt-1 text-[14px] font-medium text-wet-navy">{title}</p>
        <p className="text-[12px] text-wet-navy-muted">Osobna strona w książeczce — pchły, kleszcze.</p>
      </div>

      <div>
        <p className="text-[12px] font-medium uppercase tracking-wide text-wet-navy-muted">Preparat (opcjonalnie)</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {COMMON_PRODUCTS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setProductName(p)}
              className={`rounded-full px-3 py-1.5 text-[12px] font-medium transition ${
                productName === p
                  ? "bg-amber-600 text-white"
                  : "border border-slate-200 bg-white text-wet-navy hover:border-amber-200"
              }`}
            >
              🦟 {p}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-amber-50/70 px-3 py-3 text-[13px] text-wet-navy">
        <p>
          📅 <strong>Dziś</strong>
          <span className="text-wet-navy-muted"> · {formatDatePl(date)}</span>
        </p>
        <p className="mt-1">
          🔁 Następne: <strong>{formatDatePl(nextDuePreview)}</strong>
          <span className="text-wet-navy-muted"> (auto · {intervalDays} dni)</span>
        </p>
        <p className="mt-1">
          📩{" "}
          {ownerSmsConsent || ownerEmailConsent ? (
            <>
              Profilaktyka + przypomnienia{" "}
              <strong>{[ownerSmsConsent && "SMS", ownerEmailConsent && "e-mail"].filter(Boolean).join(" + ")}</strong>
            </>
          ) : (
            <span className="text-amber-700">Brak zgód — przypomnienia wyłączone</span>
          )}
        </p>
      </div>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-[13px] text-red-700">{error}</p>}
      {success && <p className="rounded-lg bg-green-50 px-3 py-2 text-[13px] text-green-800">{success}</p>}

      <button
        type="button"
        disabled={loading}
        onClick={submit}
        className="rounded-lg bg-amber-600 px-6 py-2.5 text-[14px] font-semibold text-white hover:bg-amber-700 disabled:opacity-60"
      >
        {loading ? "Zapisuję…" : "🦟 Zapisz ektopasożyty"}
      </button>
    </div>
  );
}
