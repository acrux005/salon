"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useIsWetPortal } from "@/contexts/WetHostContext";
import { resolveWetLoginCallback } from "@/lib/wetPaths";

function OwnerLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isWetPortal = useIsWetPortal();
  const callbackUrl = searchParams.get("callbackUrl");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      loginAs: "vet_owner",
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      setError("Nieprawidłowy e-mail lub hasło.");
      return;
    }
    router.push(resolveWetLoginCallback(callbackUrl, "/wet/klient/panel", isWetPortal));
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <Link href="/wet" className="text-[14px] font-medium text-wet-teal hover:underline">
        ← VetHarmonogram
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-wet-navy">Logowanie właściciela</h1>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-[14px] text-red-700">{error}</p>}
        <div>
          <label className="block text-[14px] font-medium">E-mail</label>
          <input type="email" className="wet-input mt-1" required value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
        </div>
        <div>
          <label className="block text-[14px] font-medium">Hasło</label>
          <input type="password" className="wet-input mt-1" required value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} />
        </div>
        <button type="submit" disabled={loading} className="wet-btn-primary w-full disabled:opacity-60">
          {loading ? "Loguję…" : "Zaloguj się"}
        </button>
        <p className="text-center text-[14px] text-wet-navy-muted">
          Nie masz konta?{" "}
          <Link href="/wet/klient/rejestracja" className="font-medium text-wet-teal hover:underline">
            Zarejestruj się
          </Link>
        </p>
      </form>
    </main>
  );
}

export default function WetOwnerLoginPage() {
  return (
    <Suspense fallback={<main className="mx-auto max-w-md px-4 py-12"><p className="text-wet-navy-muted">Ładowanie…</p></main>}>
      <OwnerLoginForm />
    </Suspense>
  );
}
