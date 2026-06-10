"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { addVetClientAction } from "@/app/actions/vetClients";
import { WetPanelPageHeader } from "@/components/wet/WetPanelPageHeader";
import { WetOwnerNotificationPrefs } from "@/components/wet/WetOwnerNotificationPrefs";

export default function WetKlienciNowyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [savedOwnerId, setSavedOwnerId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    notes: "",
    smsConsent: true,
    emailConsent: true,
    pushConsent: false,
    marketingConsent: false,
    petName: "",
    species: "pies",
    addPet: true,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fd = new FormData();
    fd.set("name", form.name);
    fd.set("phone", form.phone);
    fd.set("email", form.email);
    fd.set("notes", form.notes);
    fd.set("smsConsent", form.smsConsent ? "true" : "false");
    fd.set("emailConsent", form.emailConsent ? "true" : "false");
    fd.set("pushConsent", form.pushConsent ? "true" : "false");
    fd.set("marketingConsent", form.marketingConsent ? "true" : "false");
    if (form.addPet && form.petName.trim()) {
      fd.set("petName", form.petName);
      fd.set("species", form.species);
    }
    const result = await addVetClientAction(fd);
    setLoading(false);
    if (result.ok) {
      if (result.ownerId && form.pushConsent) {
        setSavedOwnerId(result.ownerId);
        return;
      }
      router.push("/wet/panel/klienci/lista");
      router.refresh();
      return;
    }
    setError(result.error);
  }

  if (savedOwnerId) {
    return (
      <>
        <WetPanelPageHeader
          title="Klient zapisany"
          description="Możesz włączyć powiadomienia push na urządzeniu klienta."
        />
        <div className="px-4 py-6 lg:px-8">
          <div className="mx-auto max-w-lg space-y-4">
            <p className="rounded-lg bg-green-50 px-3 py-2 text-[14px] text-green-800">
              Klient <strong>{form.name}</strong> został dodany do bazy.
            </p>
            <WetOwnerNotificationPrefs
              value={{
                smsConsent: form.smsConsent,
                emailConsent: form.emailConsent,
                pushConsent: form.pushConsent,
                marketingConsent: form.marketingConsent,
              }}
              onChange={() => {}}
              ownerId={savedOwnerId}
              disabled
            />
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href={`/wet/panel/klienci/${savedOwnerId}`} className="wet-btn-primary text-center">
                Karta klienta
              </Link>
              <Link
                href="/wet/panel/klienci/lista"
                className="rounded-lg border border-slate-200 px-5 py-2.5 text-[14px] font-medium hover:bg-slate-50"
              >
                Lista klientów
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <WetPanelPageHeader
        title="Nowy klient"
        description="Dodaj właściciela zwierzęcia. Opcjonalnie od razu zarejestruj pierwsze zwierzę."
      />
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
              className="wet-input mt-1"
              required
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[14px] font-medium">Telefon *</label>
              <input
                className="wet-input mt-1"
                required
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-[14px] font-medium">E-mail</label>
              <input
                type="email"
                className="wet-input mt-1"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              />
            </div>
          </div>
          <div>
            <label className="block text-[14px] font-medium">Uwagi</label>
            <textarea
              className="wet-input mt-1"
              rows={2}
              value={form.notes}
              onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
            />
          </div>

        <WetOwnerNotificationPrefs
          value={{
            smsConsent: form.smsConsent,
            emailConsent: form.emailConsent,
            pushConsent: form.pushConsent,
            marketingConsent: form.marketingConsent,
          }}
          onChange={(next) => setForm((p) => ({ ...p, ...next }))}
          disabled={loading}
        />

        <p className="rounded-lg border border-wet-teal-100 bg-wet-teal-50/50 px-3 py-2 text-[13px] text-wet-navy-muted">
          Klient może też założyć konto sam:{" "}
          <Link href="/wet/klient/rejestracja" className="font-medium text-wet-teal hover:underline">
            rejestracja właściciela
          </Link>
          . Przy tym samym e-mailu profile zostaną połączone.
        </p>

          <div className="rounded-xl border border-wet-teal-100 bg-wet-teal-50/50 p-4">
            <label className="flex items-center gap-2 text-[14px] font-medium">
              <input
                type="checkbox"
                checked={form.addPet}
                onChange={(e) => setForm((p) => ({ ...p, addPet: e.target.checked }))}
                className="h-4 w-4 rounded border-slate-300 text-wet-teal"
              />
              Dodaj zwierzę
            </label>
            {form.addPet && (
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <input
                  className="wet-input"
                  placeholder="Imię zwierzęcia"
                  value={form.petName}
                  onChange={(e) => setForm((p) => ({ ...p, petName: e.target.value }))}
                />
                <select
                  className="wet-input"
                  value={form.species}
                  onChange={(e) => setForm((p) => ({ ...p, species: e.target.value }))}
                >
                  <option value="pies">Pies</option>
                  <option value="kot">Kot</option>
                  <option value="inne">Inne</option>
                </select>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button type="submit" disabled={loading} className="wet-btn-primary disabled:opacity-60">
              {loading ? "Zapisuję…" : "Zapisz klienta"}
            </button>
            <Link
              href="/wet/panel/klienci/lista"
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
