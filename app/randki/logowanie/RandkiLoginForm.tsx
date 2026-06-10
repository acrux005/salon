"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { checkDatingLoginAction, resendDatingVerificationAction } from "@/app/actions/randkiAuth";
import { resolveRandkiLoginCallback, randkiPublicHref } from "@/lib/randkiPaths";

export function RandkiLoginForm({ isRandkiPortal }: { isRandkiPortal: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const verified = searchParams.get("verified");
  const reset = searchParams.get("reset");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });

  async function resendVerification() {
    if (!form.email.trim()) {
      setError("Podaj e-mail użyty przy rejestracji.");
      return;
    }
    setResendLoading(true);
    setError("");
    setInfo("");
    const res = await resendDatingVerificationAction(form.email);
    setResendLoading(false);
    if (!res.ok) setError(res.error);
    else setInfo("Link weryfikacyjny wysłany — sprawdź skrzynkę i folder spam.");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);
    const hint = await checkDatingLoginAction(form.email, form.password);
    if (hint.status === "unverified") {
      setLoading(false);
      setError("Potwierdź adres e-mail przed logowaniem. Użyj przycisku poniżej, aby wysłać link ponownie.");
      return;
    }
    if (hint.status === "banned") {
      setLoading(false);
      setError("Konto zostało zablokowane. Napisz na kontakt@odart.pl");
      return;
    }
    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      loginAs: "randki",
      redirect: false,
    });
    setLoading(false);
    if (result?.error || hint.status === "invalid") {
      setError("Nieprawidłowy e-mail lub hasło.");
      return;
    }
    router.push(resolveRandkiLoginCallback(callbackUrl, "/randki/panel", isRandkiPortal));
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <Link href={randkiPublicHref("/", isRandkiPortal)} className="text-[14px] font-medium text-rose-600 hover:underline">
        ← Randki Odart
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-randki-navy">Logowanie</h1>
      <p className="mt-2 text-[14px] text-randki-muted">
        Po rejestracji potwierdź e-mail — bez tego logowanie jest zablokowane.
      </p>
      {verified && (
        <p className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-[14px] text-green-800">E-mail potwierdzony — możesz się zalogować.</p>
      )}
      {reset && (
        <p className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-[14px] text-green-800">Hasło zmienione — zaloguj się.</p>
      )}
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-[14px] text-red-700">{error}</p>}
        {info && <p className="rounded-lg bg-green-50 px-3 py-2 text-[14px] text-green-800">{info}</p>}
        <div>
          <label htmlFor="randki-email" className="block text-[14px] font-medium">E-mail</label>
          <input id="randki-email" type="email" className="randki-input" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} required />
        </div>
        <div>
          <label htmlFor="randki-password" className="block text-[14px] font-medium">Hasło</label>
          <input id="randki-password" type="password" className="randki-input" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} required />
        </div>
        <button type="submit" disabled={loading} className="randki-btn-primary w-full">
          {loading ? "Logowanie…" : "Zaloguj się"}
        </button>
      </form>
      <button
        type="button"
        disabled={resendLoading || !form.email.trim()}
        onClick={resendVerification}
        className="mt-3 w-full text-[13px] text-rose-600 underline disabled:opacity-50"
      >
        {resendLoading ? "Wysyłanie linku…" : "Wyślij ponownie link weryfikacyjny"}
      </button>
      <p className="mt-4 text-[14px]">
        <Link href={randkiPublicHref("/zapomniane-haslo", isRandkiPortal)} className="text-rose-600 hover:underline">
          Zapomniałeś hasła?
        </Link>
      </p>
      <p className="mt-6 text-[14px] text-randki-muted">
        Nie masz konta?{" "}
        <Link href={randkiPublicHref("/rejestracja", isRandkiPortal)} className="font-medium text-rose-600 hover:underline">
          Rejestracja
        </Link>
      </p>
    </main>
  );
}
