"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addGabPatientAction } from "@/app/actions/gabinet";
import { GabPanelPageHeader } from "@/components/gabinetPlatform/GabPanelPageHeader";
import { GabLink } from "@/components/gabinetPlatform/GabLink";

export default function GabPacjenciNowyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    pesel: "",
    notes: "",
    smsConsent: true,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (typeof v === "boolean") fd.set(k, v ? "true" : "false");
      else fd.set(k, v);
    });
    const result = await addGabPatientAction(fd);
    setLoading(false);
    if (result.ok && result.patientId) {
      router.push(`/gabinet/panel/pacjenci/${result.patientId}`);
      router.refresh();
      return;
    }
    if (result.ok) {
      router.push("/gabinet/panel/pacjenci/lista");
      router.refresh();
      return;
    }
    setError(result.error);
  }

  return (
    <>
      <GabPanelPageHeader title="Nowy pacjent" description="Kartoteka pacjenta w gabinecie." />
      <div className="px-4 py-6 lg:px-8">
        <form onSubmit={handleSubmit} className="mx-auto max-w-lg space-y-4">
          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-[14px] text-red-700" role="alert">
              {error}
            </p>
          )}
          <div>
            <label className="block text-[14px] font-medium">Imię i nazwisko *</label>
            <input
              className="gab-input"
              required
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[14px] font-medium">Telefon *</label>
              <input
                className="gab-input"
                required
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-[14px] font-medium">E-mail</label>
              <input
                type="email"
                className="gab-input"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              />
            </div>
          </div>
          <div>
            <label className="block text-[14px] font-medium">PESEL</label>
            <input
              className="gab-input"
              value={form.pesel}
              onChange={(e) => setForm((p) => ({ ...p, pesel: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-[14px] font-medium">Uwagi</label>
            <textarea
              className="gab-input"
              rows={2}
              value={form.notes}
              onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
            />
          </div>
          <label className="flex items-center gap-2 text-[14px]">
            <input
              type="checkbox"
              checked={form.smsConsent}
              onChange={(e) => setForm((p) => ({ ...p, smsConsent: e.target.checked }))}
              className="h-4 w-4 rounded border-slate-300 text-gab-sky"
            />
            Zgoda na SMS (przypomnienia)
          </label>
          <div className="flex flex-wrap gap-3 pt-2">
            <button type="submit" disabled={loading} className="gab-btn-primary disabled:opacity-60">
              {loading ? "Zapisuję…" : "Zapisz pacjenta"}
            </button>
            <GabLink
              href="/panel/pacjenci/lista"
              className="rounded-lg border border-slate-200 px-5 py-2.5 text-[14px] font-medium hover:bg-slate-50"
            >
              Anuluj
            </GabLink>
          </div>
        </form>
      </div>
    </>
  );
}
