"use client";

import { useState } from "react";
import { requestGabClinicPasswordResetAction } from "@/app/actions/gabinetSettings";
import { GabLink } from "@/components/gabinetPlatform/GabLink";

export default function GabForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await requestGabClinicPasswordResetAction(email);
    setLoading(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setDone(true);
  }

  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <GabLink href="/login" className="text-[14px] text-gab-sky hover:underline">
        ← Logowanie gabinetu
      </GabLink>
      <h1 className="mt-4 text-2xl font-bold text-gab-navy">Reset hasła</h1>
      {done ? (
        <p className="mt-4 rounded-lg bg-green-50 px-4 py-3 text-[15px] text-green-800">
          Jeśli konto istnieje, wysłaliśmy link resetujący na <strong>{email}</strong>.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-[14px] text-red-700">{error}</p>}
          <input type="email" required className="gab-input" placeholder="E-mail konta gabinetu" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button type="submit" disabled={loading} className="gab-btn-primary w-full disabled:opacity-60">
            {loading ? "Wysyłanie…" : "Wyślij link"}
          </button>
        </form>
      )}
    </main>
  );
}
