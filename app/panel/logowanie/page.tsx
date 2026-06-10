"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function PanelLogowaniePage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/panel";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        callbackUrl,
        redirect: false,
      });
      if (res?.error) {
        setError("Nieprawidłowy email lub hasło. Sprawdź też, czy konto jest potwierdzone (e-mail).");
        setLoading(false);
        return;
      }
      const targetUrl = res?.url ?? callbackUrl;
      if (targetUrl.startsWith("/panel")) {
        await new Promise((r) => setTimeout(r, 150));
        const sessionRes = await fetch("/api/auth/session", { credentials: "include" });
        const session = await sessionRes.json();
        const role = session?.user?.role;
        const clinicId = session?.user?.clinicId;
        if (role === "clinic" || clinicId) {
          window.location.replace("/portal/panel");
          return;
        }
        if (role === "client") {
          window.location.replace("/portal");
          return;
        }
      }
      window.location.replace(targetUrl);
    } catch {
      setError("Błąd logowania. Spróbuj ponownie.");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm">
      <h1 className="text-xl font-semibold text-stone-900">Logowanie do panelu</h1>
      <p className="mt-1 text-sm text-stone-600">
        Zaloguj się kontem gabinetu, restauracji lub admina.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {error && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
        )}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-stone-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-stone-700">
            Hasło
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-zamow-orange-600 py-2.5 font-medium text-white hover:bg-zamow-orange-500 disabled:opacity-50"
        >
          {loading ? "Logowanie…" : "Zaloguj się"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-stone-500">
        <Link href="/" className="text-zamow-orange-600 hover:underline">
          ← Strona główna
        </Link>
      </p>
    </div>
  );
}
