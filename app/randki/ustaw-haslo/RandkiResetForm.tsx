"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { resetDatingPasswordAction } from "@/app/actions/randkiAuth";
import { randkiPublicHref } from "@/lib/randkiPaths";

export function RandkiResetPasswordForm({ isRandkiPortal }: { isRandkiPortal?: boolean }) {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await resetDatingPasswordAction(token, password);
    setLoading(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    router.push(randkiPublicHref("/logowanie?reset=1", isRandkiPortal));
  }

  if (!token) {
    return (
      <main className="mx-auto max-w-md px-4 py-12">
        <p className="text-red-600">Brak tokenu resetu.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-bold text-randki-navy">Ustaw nowe hasło</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-[14px] text-red-700">{error}</p>}
        <input
          type="password"
          required
          minLength={8}
          className="randki-input"
          placeholder="Nowe hasło (min. 8 znaków)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={loading} className="randki-btn-primary w-full">
          {loading ? "Zapisywanie…" : "Zapisz hasło"}
        </button>
      </form>
    </main>
  );
}
