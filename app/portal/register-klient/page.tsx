"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { HeaderPortal } from "@/components/portal/HeaderPortal";
import { FooterPortal } from "@/components/portal/FooterPortal";
import { RecaptchaWidget, getRecaptchaTokenAsync, hasRecaptcha } from "@/components/portal/RecaptchaWidget";
import { registerClientAction } from "@/app/actions/client";

function RegisterKlientForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawCallbackUrl = searchParams.get("callbackUrl") ?? "";
  const callbackUrl =
    rawCallbackUrl && !rawCallbackUrl.startsWith("http")
      ? rawCallbackUrl
      : "";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fd = new FormData();
    fd.set("email", form.email.trim().toLowerCase());
    fd.set("password", form.password);
    if (form.name.trim()) fd.set("name", form.name.trim());
    if (form.phone.trim()) fd.set("phone", form.phone.trim());
    if (hasRecaptcha()) {
      try {
        const token = await getRecaptchaTokenAsync();
        fd.set("captchaToken", token);
      } catch {
        setError("Nie udało się zweryfikować (CAPTCHA). Odśwież stronę i spróbuj ponownie.");
        setLoading(false);
        return;
      }
    }
    const result = await registerClientAction(fd);
    setLoading(false);
    if (result.ok) {
      setSuccessMessage(result.message ?? "Konto utworzone. Sprawdź e-mail i potwierdź adres.");
      return;
    }
    setError(result.error);
  }

  return (
    <>
      <HeaderPortal />
      <main className="min-h-screen bg-white py-16">
        <div className="mx-auto max-w-md px-4">
          <h1 className="font-[var(--font-serif)] text-2xl font-normal text-[#1F1A1C]">
            Rejestracja klienta
          </h1>
          <p className="mt-2 font-[var(--font-sans)] text-[15px] text-[#6F5E64]">
            Załóż konto, aby rezerwować wizyty i mieć w jednym miejscu historię rezerwacji.
          </p>
          {!successMessage && (
            <div className="mt-6">
              <button
                type="button"
                onClick={() =>
                  signIn("google", {
                    callbackUrl: callbackUrl || "/portal",
                  })
                }
                className="w-full rounded-full border border-neutral-300 bg-white py-3 text-[15px] font-medium text-[#1F1A1C] hover:bg-neutral-50"
              >
                Zarejestruj się przez Google
              </button>
              <p className="mt-3 text-center text-[13px] text-[#6F5E64]">lub wypełnij formularz poniżej</p>
            </div>
          )}
          {successMessage ? (
            <div className="mt-8 rounded-xl border border-green-200 bg-green-50 px-4 py-4 text-[15px] text-green-800">
              <p className="font-medium">Rejestracja zakończona</p>
              <p className="mt-1">{successMessage}</p>
              <Link
                href={callbackUrl ? `/portal/login?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/portal/login"}
                className="mt-4 inline-block font-medium text-green-700 hover:underline"
              >
                Przejdź do logowania →
              </Link>
            </div>
          ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {error && (
              <p className="rounded-lg bg-red-50 px-4 py-2 text-[14px] text-red-700" role="alert">
                {error}
              </p>
            )}
            <div>
              <label htmlFor="reg-email" className="block text-[14px] font-medium text-[#1F1A1C]">
                Email
              </label>
              <input
                id="reg-email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-[15px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
              />
            </div>
            <div>
              <label htmlFor="reg-password" className="block text-[14px] font-medium text-[#1F1A1C]">
                Hasło (min. 10 znaków)
              </label>
              <input
                id="reg-password"
                type="password"
                required
                minLength={10}
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-[15px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
              />
            </div>
            <div>
              <label htmlFor="reg-name" className="block text-[14px] font-medium text-[#1F1A1C]">
                Imię i nazwisko (opcjonalnie)
              </label>
              <input
                id="reg-name"
                type="text"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-[15px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
              />
            </div>
            <div>
              <label htmlFor="reg-phone" className="block text-[14px] font-medium text-[#1F1A1C]">
                Telefon (opcjonalnie)
              </label>
              <input
                id="reg-phone"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-[15px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
              />
            </div>
            <RecaptchaWidget onToken={() => {}} />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-pink-500 py-3 text-[15px] font-medium text-white hover:bg-pink-600 disabled:opacity-60"
            >
              {loading ? "Rejestracja…" : "Zarejestruj się"}
            </button>
          </form>
          )}
          <p className="mt-6 text-center text-[14px] text-[#6F5E64]">
            Masz już konto?{" "}
            <Link href="/portal/login" className="font-medium text-pink-600 hover:underline">
              Zaloguj się
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

export default function RegisterKlientPage() {
  return (
    <Suspense fallback={
      <>
        <HeaderPortal />
        <main className="min-h-screen bg-white py-16">
          <div className="mx-auto max-w-md px-4">
            <p className="text-[15px] text-[#6F5E64]">Ładowanie…</p>
          </div>
        </main>
        <FooterPortal />
      </>
    }>
      <RegisterKlientForm />
    </Suspense>
  );
}
