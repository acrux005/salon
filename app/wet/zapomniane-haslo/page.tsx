"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requestVetPasswordResetAction } from "@/app/actions/vet";
import { WetAuthShell } from "@/components/wet/WetAuthShell";

export default function WetForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await requestVetPasswordResetAction(email);
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setDone(true);
  }

  return (
    <WetAuthShell variant="forgot" showTrust={!done}>
      <Link
        href="/wet/login"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-wet-navy-muted transition hover:text-wet-teal"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Wróć do logowania
      </Link>

      <h2 className="mt-4 text-xl font-bold tracking-tight text-wet-navy">Reset hasła</h2>
      <p className="mt-1 text-[15px] text-wet-navy-muted">
        Wyślemy link na e-mail konta administratora (ważny 1 godzinę).
      </p>

      {done ? (
        <div className="mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-4 text-[15px] leading-relaxed text-green-800">
          <p className="font-semibold">Sprawdź skrzynkę</p>
          <p className="mt-2">
            Jeśli konto <strong>{email.trim()}</strong> istnieje, wysłaliśmy instrukcję resetu. Zajrzyj
            też do folderu spam.
          </p>
          <Link
            href="/wet/login"
            className="mt-4 inline-flex rounded-xl bg-green-800/10 px-4 py-2 text-[14px] font-semibold text-green-900 hover:bg-green-800/15"
          >
            Przejdź do logowania
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-2.5 text-[14px] text-red-700" role="alert">
              {error}
            </p>
          )}
          <div>
            <label htmlFor="reset-email" className="block text-[14px] font-medium text-wet-navy">
              E-mail konta przychodni
            </label>
            <input
              id="reset-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="wet-input"
              placeholder="ten sam co przy rejestracji"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="wet-btn-primary w-full rounded-xl py-3.5 text-[16px] shadow-lg shadow-wet-teal/20 disabled:opacity-60"
          >
            {loading ? "Wysyłanie…" : "Wyślij link resetujący"}
          </button>
        </form>
      )}
    </WetAuthShell>
  );
}
