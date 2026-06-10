"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { registerVetOwnerAction } from "@/app/actions/vetOwnerAuth";
import { WetOwnerNotificationPrefs } from "@/components/wet/WetOwnerNotificationPrefs";

type ClinicOption = { slug: string; name: string; city: string };

export default function WetOwnerRegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedSlug = searchParams.get("clinic") ?? "";
  const [clinics, setClinics] = useState<ClinicOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    vetClinicSlug: preselectedSlug,
    smsConsent: true,
    emailConsent: true,
    pushConsent: false,
    marketingConsent: false,
  });

  useEffect(() => {
    fetch("/api/wet/clinic?list=published")
      .then((r) => r.json())
      .then((d) => setClinics(d.clinics ?? []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (preselectedSlug) setForm((p) => ({ ...p, vetClinicSlug: preselectedSlug }));
  }, [preselectedSlug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.set(k, typeof v === "boolean" ? (v ? "true" : "false") : String(v)));
    const result = await registerVetOwnerAction(fd);
    if (!result.ok) {
      setLoading(false);
      setError(result.error);
      return;
    }
    const signInResult = await signIn("credentials", {
      email: form.email,
      password: form.password,
      loginAs: "vet_owner",
      redirect: false,
    });
    setLoading(false);
    if (signInResult?.error) {
      setError("Konto utworzone, ale logowanie nie powiodło się. Zaloguj się ręcznie.");
      return;
    }
    router.push("/wet/klient/panel");
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-12">
      <Link href="/wet" className="text-[14px] font-medium text-wet-teal hover:underline">
        ← VetHarmonogram
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-wet-navy">Konto właściciela zwierzęcia</h1>
      <p className="mt-2 text-[15px] text-wet-navy-muted">
        Zarejestruj się samodzielnie i wybierz przychodnię. Historia badań zwierzaka podąża za Tobą — gabinet możesz
        zmienić w każdej chwili.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-[14px] text-red-700" role="alert">
            {error}
          </p>
        )}

        <div>
          <label className="block text-[14px] font-medium">Przychodnia *</label>
          <select
            className="wet-input mt-1"
            required
            value={form.vetClinicSlug}
            onChange={(e) => setForm((p) => ({ ...p, vetClinicSlug: e.target.value }))}
          >
            <option value="">Wybierz przychodnię…</option>
            {clinics.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name} ({c.city})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[14px] font-medium">Imię i nazwisko *</label>
          <input className="wet-input mt-1" required value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-[14px] font-medium">Telefon *</label>
            <input className="wet-input mt-1" required value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
          </div>
          <div>
            <label className="block text-[14px] font-medium">E-mail *</label>
            <input type="email" className="wet-input mt-1" required value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
          </div>
        </div>
        <div>
          <label className="block text-[14px] font-medium">Hasło *</label>
          <input type="password" className="wet-input mt-1" required minLength={8} value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} />
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

        <button type="submit" disabled={loading} className="wet-btn-primary w-full disabled:opacity-60">
          {loading ? "Tworzę konto…" : "Utwórz konto"}
        </button>
        <p className="text-center text-[14px] text-wet-navy-muted">
          Masz konto?{" "}
          <Link href="/wet/klient/logowanie" className="font-medium text-wet-teal hover:underline">
            Zaloguj się
          </Link>
        </p>
      </form>
    </main>
  );
}
