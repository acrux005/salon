"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { HeaderPortal } from "@/components/portal/HeaderPortal";
import { FooterPortal } from "@/components/portal/FooterPortal";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawCallbackUrl = searchParams.get("callbackUrl") ?? "";
  const verified = searchParams.get("verified") === "1";
  const oauthError = searchParams.get("error") ?? "";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const safeCallback =
    rawCallbackUrl && !rawCallbackUrl.startsWith("http")
      ? rawCallbackUrl
      : null;

  const oauthErrorMessage =
    oauthError === "google_account_type"
      ? "To konto należy do gabinetu lub admina. Zaloguj się hasłem."
      : "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });
      if (res?.error) {
        setError("Nieprawidłowy email lub hasło.");
        setLoading(false);
        return;
      }

      // Pobierz sesję żeby znać rolę
      const session = await getSession();
      const role = (session?.user as { role?: string })?.role;

      // Użyj callbackUrl tylko jeśli jest względny (lokalny) — odrzuć absolutne URL
      let redirectTo: string;
      if (safeCallback) {
        redirectTo = safeCallback;
      } else if (role === "admin") {
        redirectTo = "/portal/admin";
      } else if (role === "clinic") {
        redirectTo = "/portal/panel";
      } else {
        redirectTo = "/portal";
      }

      router.push(redirectTo);
      router.refresh();
    } catch {
      setError("Wystąpił błąd. Spróbuj ponownie.");
      setLoading(false);
    }
  }

  return (
    <>
      <HeaderPortal />
      <main className="min-h-screen bg-white py-16">
        <div className="mx-auto max-w-md px-4">
          <h1 className="font-[var(--font-serif)] text-2xl font-normal text-[#1F1A1C]">
            Logowanie
          </h1>
          <p className="mt-2 font-[var(--font-sans)] text-[15px] text-[#6F5E64]">
            Zaloguj się jako klient (rezerwacje, historia) lub jako gabinet (panel, kalendarz). Po zalogowaniu zostaniesz przekierowany we właściwe miejsce.
          </p>
          {verified && (
            <p className="mt-4 rounded-lg bg-green-50 px-4 py-2 text-[14px] text-green-800" role="status">
              Adres e-mail potwierdzony. Możesz się zalogować.
            </p>
          )}
          {oauthErrorMessage && (
            <p className="mt-4 rounded-lg bg-amber-50 px-4 py-2 text-[14px] text-amber-800" role="alert">
              {oauthErrorMessage}
            </p>
          )}
          <div className="mt-6">
            <button
              type="button"
              onClick={() =>
                signIn("google", {
                  callbackUrl: safeCallback ?? "/portal",
                })
              }
              className="w-full rounded-full border border-neutral-300 bg-white py-3 font-[var(--font-sans)] text-[15px] font-medium text-[#1F1A1C] hover:bg-neutral-50"
            >
              Kontynuuj przez Google
            </button>
            <p className="mt-2 text-center font-[var(--font-sans)] text-[13px] text-[#6F5E64]">
              Google jest dostępne tylko dla kont klientów. Gabinet i admin logują się e-mailem i hasłem.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {error && (
              <p className="rounded-lg bg-red-50 px-4 py-2 text-[14px] text-red-700" role="alert">
                {error}
              </p>
            )}
            <div>
              <label htmlFor="login-email" className="block font-[var(--font-sans)] text-[14px] font-medium text-[#1F1A1C]">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-[15px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
              />
            </div>
            <div>
              <label htmlFor="login-password" className="block font-[var(--font-sans)] text-[14px] font-medium text-[#1F1A1C]">
                Hasło
              </label>
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-[15px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-pink-500 py-3 font-[var(--font-sans)] text-[15px] font-medium text-white hover:bg-pink-600 disabled:opacity-60"
            >
              {loading ? "Logowanie…" : "Zaloguj się"}
            </button>
          </form>
          <p className="mt-6 text-center font-[var(--font-sans)] text-[14px] text-[#6F5E64]">
            Nie masz konta?{" "}
            <Link href="/portal/register-klient" className="font-medium text-pink-600 hover:underline">
              Rejestracja klienta
            </Link>
            {" · "}
            <Link href="/portal/register" className="font-medium text-pink-600 hover:underline">
              Rejestracja gabinetu
            </Link>
          </p>
        </div>
      </main>
      <FooterPortal />
    </>
  );
}

export default function PortalLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <LoginForm />
    </Suspense>
  );
}
