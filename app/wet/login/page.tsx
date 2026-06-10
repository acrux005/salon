"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { VET_CLINIC_ROLE } from "@/lib/auth";
import { resendVetVerificationEmailAction } from "@/app/actions/vet";
import { WetAuthShell } from "@/components/wet/WetAuthShell";
import { useIsWetPortal } from "@/contexts/WetHostContext";
import { resolveWetLoginCallback } from "@/lib/wetPaths";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isWetPortal = useIsWetPortal();
  const callbackUrl = searchParams.get("callbackUrl");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", {
      email: email.trim().toLowerCase(),
      password,
      loginAs: "vet",
      redirect: false,
    });
    if (res?.error) {
      setError("Nieprawidłowy e-mail lub hasło — albo konto nie zostało jeszcze potwierdzone.");
      setLoading(false);
      return;
    }
    const session = await getSession();
    const role = (session?.user as { role?: string })?.role;
    const redirectTo = resolveWetLoginCallback(
      callbackUrl,
      role === VET_CLINIC_ROLE ? "/wet/panel" : "/wet",
      isWetPortal
    );
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <WetAuthShell variant="login">
      <h2 className="text-xl font-bold tracking-tight text-wet-navy lg:hidden">Zaloguj się</h2>
      <p className="mt-1 text-[15px] text-wet-navy-muted lg:hidden">
        Konto administratora przychodni
      </p>

      <div className="hidden lg:block">
        <h2 className="text-xl font-bold tracking-tight text-wet-navy">Zaloguj się</h2>
        <p className="mt-1 text-[15px] text-wet-navy-muted">Konto administratora przychodni</p>
      </div>

      {searchParams.get("verified") === "1" && (
        <p className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-2.5 text-[14px] text-green-800">
          E-mail potwierdzony. Możesz się zalogować.
        </p>
      )}
      {searchParams.get("reset") === "1" && (
        <p className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-2.5 text-[14px] text-green-800">
          Hasło zostało zmienione. Zaloguj się nowym hasłem.
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-2.5 text-[14px] text-red-700" role="alert">
            {error}
          </p>
        )}
        <div>
          <label htmlFor="wet-email" className="block text-[14px] font-medium text-wet-navy">
            E-mail
          </label>
          <input
            id="wet-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="wet-input"
            placeholder="np. recepcja@przychodnia.pl"
          />
        </div>
        <div>
          <div className="flex items-center justify-between gap-2">
            <label htmlFor="wet-pass" className="block text-[14px] font-medium text-wet-navy">
              Hasło
            </label>
            <Link
              href="/wet/zapomniane-haslo"
              className="text-[13px] font-medium text-wet-teal hover:underline"
            >
              Zapomniałem hasła
            </Link>
          </div>
          <input
            id="wet-pass"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="wet-input"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="wet-btn-primary w-full rounded-xl py-3.5 text-[16px] shadow-lg shadow-wet-teal/20 disabled:opacity-60"
        >
          {loading ? "Logowanie…" : "Zaloguj się"}
        </button>
      </form>

      {resendMsg && (
        <p className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-2.5 text-[13px] text-green-800">
          {resendMsg}
        </p>
      )}

      <p className="mt-4 text-[13px] leading-relaxed text-wet-navy-muted">
        Nie dostałeś maila po rejestracji?{" "}
        <button
          type="button"
          disabled={resendLoading || !email.trim()}
          className="font-medium text-wet-teal hover:underline disabled:opacity-50"
          onClick={async () => {
            setResendMsg("");
            setResendLoading(true);
            const r = await resendVetVerificationEmailAction(email);
            setResendLoading(false);
            setResendMsg(r.ok ? "Link weryfikacyjny wysłany — sprawdź także spam." : r.error);
          }}
        >
          {resendLoading ? "Wysyłanie…" : "Wyślij ponownie link aktywacyjny"}
        </button>
      </p>

      <p className="mt-6 text-center text-[14px] text-wet-navy-muted">
        Nie masz konta?{" "}
        <Link href="/wet/register" className="font-semibold text-wet-teal hover:underline">
          Załóż darmowe konto
        </Link>
      </p>
    </WetAuthShell>
  );
}

function LoginFallback() {
  return (
    <section className="wet-auth-hero flex flex-1 items-center justify-center px-4 py-24">
      <p className="text-[15px] text-wet-navy-muted">Ładowanie…</p>
    </section>
  );
}

export default function WetLoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}
