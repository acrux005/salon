"use client";

import { useState } from "react";
import Link from "next/link";
import { requestDatingPasswordResetAction } from "@/app/actions/randkiAuth";
import { randkiPublicHref } from "@/lib/randkiPaths";

export default function RandkiForgotForm({ isRandkiPortal }: { isRandkiPortal?: boolean }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const loginHref = randkiPublicHref("/logowanie", isRandkiPortal);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await requestDatingPasswordResetAction(email);
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setDone(true);
  }

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <Link href={loginHref} className="text-[14px] font-medium text-rose-600 hover:underline">
        ← Logowanie
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-randki-navy">Reset hasła</h1>
      {done ? (
        <p className="mt-4 rounded-xl bg-green-50 px-4 py-3 text-[14px] text-green-800">
          Jeśli konto istnieje, wysłaliśmy link resetujący (ważny 1 godzinę).
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-[14px] text-red-700">{error}</p>}
          <input
            type="email"
            required
            className="randki-input"
            placeholder="Twój e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit" disabled={loading} className="randki-btn-primary w-full">
            {loading ? "Wysyłanie…" : "Wyślij link"}
          </button>
        </form>
      )}
    </main>
  );
}
