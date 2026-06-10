"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useIsGabinetPortal } from "@/contexts/GabHostContext";
import { resolveGabinetLoginCallback } from "@/lib/gabinetPlatform/paths";
import { GabLink } from "@/components/gabinetPlatform/GabLink";
import { checkGabPatientLoginAction, resendGabPatientVerificationByEmailAction } from "@/app/actions/gabinetSettings";

function PatientLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isPortal = useIsGabinetPortal();
  const callbackUrl = searchParams.get("callbackUrl");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [form, setForm] = useState({ email: "", password: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);
    const hint = await checkGabPatientLoginAction(form.email, form.password);
    if (hint.status === "unverified") {
      setLoading(false);
      setError("Potwierdź adres e-mail przed logowaniem. Użyj przycisku poniżej, aby wysłać link ponownie.");
      return;
    }
    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      loginAs: "gab_patient",
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      setError("Nieprawidłowy e-mail lub hasło.");
      return;
    }
    router.push(resolveGabinetLoginCallback(callbackUrl, "/gabinet/klient/panel", isPortal));
    router.refresh();
  }

  async function resendVerification() {
    if (!form.email.trim()) {
      setError("Podaj e-mail użyty przy rejestracji.");
      return;
    }
    setResendLoading(true);
    setError("");
    setInfo("");
    const fd = new FormData();
    fd.set("email", form.email);
    const res = await resendGabPatientVerificationByEmailAction(fd);
    setResendLoading(false);
    if (!res.ok) setError(res.error);
    else setInfo("Link weryfikacyjny został wysłany — sprawdź skrzynkę (i spam).");
  }

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <GabLink href="/" className="text-[14px] font-medium text-gab-sky hover:underline">
        ← DentHarmonogram
      </GabLink>
      <h1 className="mt-4 text-2xl font-bold text-gab-navy">Logowanie pacjenta</h1>
      <p className="mt-2 text-[14px] text-slate-600">
        Po rejestracji potwierdź adres e-mail — link wysyłamy na skrzynkę. Bez weryfikacji logowanie jest zablokowane.
      </p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-[14px] text-red-700">{error}</p>}
        {info && <p className="rounded-lg bg-green-50 px-3 py-2 text-[14px] text-green-800">{info}</p>}
        <div>
          <label className="block text-[14px] font-medium">E-mail</label>
          <input
            type="email"
            className="gab-input"
            required
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-[14px] font-medium">Hasło</label>
          <input
            type="password"
            className="gab-input"
            required
            value={form.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
          />
        </div>
        <button type="submit" disabled={loading} className="gab-btn-primary w-full disabled:opacity-60">
          {loading ? "Loguję…" : "Zaloguj się"}
        </button>
        <button
          type="button"
          onClick={resendVerification}
          disabled={resendLoading}
          className="w-full text-[14px] text-gab-sky hover:underline disabled:opacity-60"
        >
          {resendLoading ? "Wysyłam link…" : "Wyślij ponownie link weryfikacyjny"}
        </button>
        <p className="text-center text-[13px] text-slate-500">
          <GabLink href="/klient/zapomniane-haslo" className="text-gab-sky hover:underline">
            Nie pamiętasz hasła?
          </GabLink>
        </p>
        <p className="text-center text-[14px] text-slate-600">
          Nie masz konta?{" "}
          <GabLink href="/klient/rejestracja" className="font-medium text-gab-sky hover:underline">
            Zarejestruj się
          </GabLink>
        </p>
      </form>
    </main>
  );
}

export default function GabPatientLoginPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-md px-4 py-12">
          <p className="text-slate-500">Ładowanie…</p>
        </main>
      }
    >
      <PatientLoginForm />
    </Suspense>
  );
}
