"use client";

import { useState } from "react";
import { requestGabPatientPasswordResetAction } from "@/app/actions/gabinetSettings";
import { GabLink } from "@/components/gabinetPlatform/GabLink";

export default function GabPatientForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await requestGabPatientPasswordResetAction(email);
    setLoading(false);
    if (!res.ok) setError(res.error);
    else setDone(true);
  }

  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <GabLink href="/klient/logowanie" className="text-[14px] text-gab-sky hover:underline">
        ← Logowanie pacjenta
      </GabLink>
      <h1 className="mt-4 text-2xl font-bold text-gab-navy">Reset hasła</h1>
      {done ? (
        <p className="mt-4 rounded-lg bg-green-50 px-4 py-3 text-green-800">Sprawdź skrzynkę e-mail.</p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && <p className="text-[14px] text-red-700">{error}</p>}
          <input type="email" required className="gab-input" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button type="submit" disabled={loading} className="gab-btn-primary w-full">
            Wyślij link
          </button>
        </form>
      )}
    </main>
  );
}
