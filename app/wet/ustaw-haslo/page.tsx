"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { resetVetPasswordAction } from "@/app/actions/vet";
import { WetAuthShell } from "@/components/wet/WetAuthShell";

function SetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== password2) {
      setError("Hasła nie są identyczne.");
      return;
    }
    setError("");
    setLoading(true);
    const result = await resetVetPasswordAction(token, password);
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push("/wet/login?reset=1");
    router.refresh();
  }

  if (!token) {
    return (
      <WetAuthShell variant="reset" showTrust={false}>
        <h2 className="text-xl font-bold tracking-tight text-wet-navy">Nieprawidłowy link</h2>
        <p className="mt-2 text-[15px] text-red-700">
          Brak tokenu w adresie. Poproś o nowy link resetu hasła.
        </p>
        <Link
          href="/wet/zapomniane-haslo"
          className="mt-6 inline-flex rounded-xl bg-wet-teal px-5 py-2.5 text-[14px] font-semibold text-white shadow-sm hover:bg-wet-teal-700"
        >
          Wyślij nowy link
        </Link>
        <Link
          href="/wet/login"
          className="mt-4 block text-center text-[14px] font-medium text-wet-teal hover:underline"
        >
          Wróć do logowania
        </Link>
      </WetAuthShell>
    );
  }

  return (
    <WetAuthShell variant="reset">
      <Link
        href="/wet/login"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-wet-navy-muted transition hover:text-wet-teal"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Logowanie
      </Link>

      <h2 className="mt-4 text-xl font-bold tracking-tight text-wet-navy">Ustaw nowe hasło</h2>
      <p className="mt-1 text-[15px] text-wet-navy-muted">Minimum 10 znaków.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-2.5 text-[14px] text-red-700" role="alert">
            {error}
          </p>
        )}
        <div>
          <label htmlFor="new-pass" className="block text-[14px] font-medium text-wet-navy">
            Nowe hasło
          </label>
          <input
            id="new-pass"
            type="password"
            required
            minLength={10}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="wet-input"
          />
        </div>
        <div>
          <label htmlFor="new-pass2" className="block text-[14px] font-medium text-wet-navy">
            Powtórz hasło
          </label>
          <input
            id="new-pass2"
            type="password"
            required
            minLength={10}
            autoComplete="new-password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            className="wet-input"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="wet-btn-primary w-full rounded-xl py-3.5 text-[16px] shadow-lg shadow-wet-teal/20 disabled:opacity-60"
        >
          {loading ? "Zapisywanie…" : "Zapisz i zaloguj się"}
        </button>
      </form>
    </WetAuthShell>
  );
}

function SetPasswordFallback() {
  return (
    <section className="wet-auth-hero flex flex-1 items-center justify-center px-4 py-24">
      <p className="text-[15px] text-wet-navy-muted">Ładowanie…</p>
    </section>
  );
}

export default function WetSetPasswordPage() {
  return (
    <Suspense fallback={<SetPasswordFallback />}>
      <SetPasswordForm />
    </Suspense>
  );
}
