"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { registerGabPatientAccountAction } from "@/app/actions/gabinet";
import { GabLink } from "@/components/gabinetPlatform/GabLink";

export default function GabPatientRegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.set(k, v));
    const result = await registerGabPatientAccountAction(fd);
    if (!result.ok) {
      setLoading(false);
      setError(result.error);
      return;
    }
    const signResult = await signIn("credentials", {
      email: form.email,
      password: form.password,
      loginAs: "gab_patient",
      redirect: false,
    });
    setLoading(false);
    if (signResult?.error) {
      setError("Konto utworzone, ale logowanie nie powiodło się. Zaloguj się ręcznie.");
      return;
    }
    router.push("/gabinet/klient/panel");
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <GabLink href="/klient/logowanie" className="text-[14px] font-medium text-gab-sky hover:underline">
        ← Logowanie
      </GabLink>
      <h1 className="mt-4 text-2xl font-bold text-gab-navy">Rejestracja pacjenta</h1>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-[14px] text-red-700">{error}</p>}
        <div>
          <label className="block text-[14px] font-medium">Imię i nazwisko</label>
          <input
            className="gab-input"
            required
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-[14px] font-medium">E-mail</label>
          <input
            type="email"
            className="gab-input"
            required
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-[14px] font-medium">Hasło (min. 10 znaków)</label>
          <input
            type="password"
            className="gab-input"
            required
            minLength={10}
            value={form.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
          />
        </div>
        <button type="submit" disabled={loading} className="gab-btn-primary w-full disabled:opacity-60">
          {loading ? "Tworzę konto…" : "Załóż konto"}
        </button>
      </form>
    </main>
  );
}
