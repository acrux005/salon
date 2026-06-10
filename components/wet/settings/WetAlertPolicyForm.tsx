"use client";

import { useState } from "react";
import { updateVetAlertPolicyAction } from "@/app/actions/vetSettings";
import type { VetClinicSettings } from "@/lib/vet/onboarding";

function DayChips({
  options,
  selected,
  onToggle,
  suffix,
}: {
  options: number[];
  selected: number[];
  onToggle: (d: number) => void;
  suffix: string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((d) => (
        <button
          key={d}
          type="button"
          onClick={() => onToggle(d)}
          className={`rounded-full px-3.5 py-2 text-[13px] font-medium transition ${
            selected.includes(d)
              ? "bg-wet-teal text-white shadow-sm"
              : "border border-slate-200 bg-white text-wet-navy-muted hover:border-wet-teal-200"
          }`}
        >
          {d === 0 ? "W dniu terminu" : `${d} dni`} {suffix}
        </button>
      ))}
    </div>
  );
}

function toggleDay(selected: number[], day: number, set: (v: number[]) => void) {
  set(selected.includes(day) ? selected.filter((d) => d !== day) : [...selected, day].sort((a, b) => b - a));
}

export function WetAlertPolicyForm({ initial }: { initial: NonNullable<VetClinicSettings["alertPolicy"]> }) {
  const [appointmentDays, setAppointmentDays] = useState(initial.appointmentDaysBefore);
  const [vaccinationDays, setVaccinationDays] = useState(initial.vaccinationDaysBefore);
  const [smsEnabled, setSmsEnabled] = useState(initial.smsEnabled ?? true);
  const [emailEnabled, setEmailEnabled] = useState(initial.emailEnabled ?? true);
  const [smsBranding, setSmsBranding] = useState(initial.smsBranding ?? "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    const fd = new FormData();
    appointmentDays.forEach((d) => fd.append("appointmentDays", String(d)));
    vaccinationDays.forEach((d) => fd.append("vaccinationDays", String(d)));
    fd.set("smsEnabled", smsEnabled ? "true" : "false");
    fd.set("emailEnabled", emailEnabled ? "true" : "false");
    fd.set("smsBranding", smsBranding);
    const res = await updateVetAlertPolicyAction(fd);
    setLoading(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setMessage("Zapisano ustawienia powiadomień.");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-[14px] text-red-700">{error}</p>}
      {message && <p className="rounded-lg bg-green-50 px-3 py-2 text-[14px] text-green-800">{message}</p>}

      <div>
        <p className="text-[14px] font-medium text-wet-navy">Przypomnienia o wizycie</p>
        <div className="mt-2">
          <DayChips
            options={[0, 1, 2, 7]}
            selected={appointmentDays}
            onToggle={(d) => toggleDay(appointmentDays, d, setAppointmentDays)}
            suffix="przed wizytą"
          />
        </div>
      </div>

      <div>
        <p className="text-[14px] font-medium text-wet-navy">Przypomnienia o szczepieniu</p>
        <div className="mt-2">
          <DayChips
            options={[0, 7, 14, 30]}
            selected={vaccinationDays}
            onToggle={(d) => toggleDay(vaccinationDays, d, setVaccinationDays)}
            suffix="przed terminem"
          />
        </div>
      </div>

      <div>
        <p className="text-[14px] font-medium text-wet-navy">Kanały wysyłki</p>
        <div className="mt-2 flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-[14px]">
            <input
              type="checkbox"
              checked={emailEnabled}
              onChange={(e) => setEmailEnabled(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-wet-teal"
            />
            E-mail
          </label>
          <label className="flex items-center gap-2 text-[14px]">
            <input
              type="checkbox"
              checked={smsEnabled}
              onChange={(e) => setSmsEnabled(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-wet-teal"
            />
            SMS
          </label>
        </div>
      </div>

      <div>
        <label className="block text-[14px] font-medium text-wet-navy">Podpis SMS (opcjonalnie)</label>
        <input
          className="wet-input mt-1"
          value={smsBranding}
          onChange={(e) => setSmsBranding(e.target.value)}
          placeholder="np. Przychodnia Mokry Nosek"
          maxLength={40}
        />
        <p className="mt-1 text-[12px] text-wet-navy-muted">Krótka nazwa gabinetu na końcu wiadomości SMS.</p>
      </div>

      <p className="rounded-xl bg-wet-teal-50 px-4 py-3 text-[13px] text-wet-navy-muted">
        To lekka konfiguracja — bez bramki SMS, faktur i ERP. System wysyła przypomnienia wg wybranych terminów.
      </p>

      <button type="submit" disabled={loading} className="wet-btn-primary disabled:opacity-60">
        {loading ? "Zapisuję…" : "Zapisz ustawienia"}
      </button>
    </form>
  );
}
