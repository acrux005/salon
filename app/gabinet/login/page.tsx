"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { GAB_CLINIC_ROLE } from "@/lib/auth";
import { useIsGabinetPortal } from "@/contexts/GabHostContext";
import { resolveGabinetLoginCallback } from "@/lib/gabinetPlatform/paths";
import { useGabinetBrand } from "@/components/gabinetPlatform/useGabinetBrand";
import { GabLink } from "@/components/gabinetPlatform/GabLink";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isGabinetPortal = useIsGabinetPortal();
  const brand = useGabinetBrand();
  const callbackUrl = searchParams.get("callbackUrl");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", {
      email: email.trim().toLowerCase(),
      password,
      loginAs: "gab_clinic",
      redirect: false,
    });
    if (res?.error) {
      setError("Nieprawidłowy e-mail lub hasło.");
      setLoading(false);
      return;
    }
    const session = await getSession();
    const role = (session?.user as { role?: string })?.role;
    router.push(
      resolveGabinetLoginCallback(
        callbackUrl,
        role === GAB_CLINIC_ROLE ? "/gabinet/panel" : "/gabinet",
        isGabinetPortal
      )
    );
    router.refresh();
  }

  return (
    <main className="mx-auto min-w-0 max-w-md px-4 py-12">
      <GabLink href="/" className="text-[14px] font-medium text-sky-700 hover:underline">
        ← {brand.brandName}
      </GabLink>
      <h1 className="mt-4 text-pretty text-2xl font-bold text-gab-navy">Logowanie gabinetu</h1>
      <p className="mt-1 text-pretty text-[14px] text-slate-600">Konto administratora {brand.clinicLabel.toLowerCase()}</p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-[14px] text-red-700" role="alert">
            {error}
          </p>
        )}
        <div>
          <label className="block text-[14px] font-medium">E-mail</label>
          <input
            type="email"
            className="gab-input"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-[14px] font-medium">Hasło</label>
          <input
            type="password"
            className="gab-input"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading} className="gab-btn-primary w-full disabled:opacity-60">
          {loading ? "Logowanie…" : "Zaloguj się"}
        </button>
        <p className="text-center text-[13px] text-slate-500">
          <GabLink href="/zapomniane-haslo" className="text-gab-sky hover:underline">
            Nie pamiętasz hasła?
          </GabLink>
        </p>
        <p className="text-center text-[14px] text-slate-600">
          Nie masz konta?{" "}
          <GabLink href="/register" className="font-medium text-sky-700 hover:underline">
            Załóż darmowe konto
          </GabLink>
        </p>
      </form>
    </main>
  );
}

export default function GabinetLoginPage() {
  return (
    <Suspense fallback={<main className="px-4 py-12"><p>Ładowanie…</p></main>}>
      <LoginForm />
    </Suspense>
  );
}
