"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { registerDatingAccountAction } from "@/app/actions/randki";
import { resendDatingVerificationAction } from "@/app/actions/randkiAuth";
import { randkiPublicHref } from "@/lib/randkiPaths";

export default function RandkiRegisterClient({ isRandkiPortal }: { isRandkiPortal?: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [emailSent, setEmailSent] = useState(true);
  const [resendLoading, setResendLoading] = useState(false);
  const [info, setInfo] = useState("");
  const [form, setForm] = useState({ email: "", password: "", displayName: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fd = new FormData();
    fd.set("email", form.email);
    fd.set("password", form.password);
    fd.set("displayName", form.displayName);
    const res = await registerDatingAccountAction(fd);
    if (!res.ok) {
      setLoading(false);
      setError(res.error);
      return;
    }
    if (res.needsEmailVerification) {
      setLoading(false);
      setEmailSent(!!res.emailSent);
      setDone(true);
      return;
    }
    const login = await signIn("credentials", {
      email: form.email.trim().toLowerCase(),
      password: form.password,
      loginAs: "randki",
      redirect: false,
    });
    setLoading(false);
    if (login?.error) {
      setError("Konto utworzone, ale logowanie nie powiodło się. Zaloguj się ręcznie.");
      return;
    }
    router.push(randkiPublicHref("/profil", isRandkiPortal));
    router.refresh();
  }

  if (done) {
    return (
      <main className="mx-auto max-w-md px-4 py-12">
        <h1 className="text-2xl font-bold text-randki-navy">Sprawdź e-mail</h1>
        {emailSent ? (
          <p className="mt-4 text-[14px] text-randki-muted">
            Wysłaliśmy link potwierdzający na <strong>{form.email.trim()}</strong>. Po potwierdzeniu zaloguj się i uzupełnij profil.
            Sprawdź też folder spam.
          </p>
        ) : (
          <p className="mt-4 text-[14px] text-red-700">
            Konto utworzone, ale mail nie wyszedł. Kliknij poniżej, aby wysłać link ponownie.
          </p>
        )}
        {info && <p className="mt-3 rounded-lg bg-green-50 px-3 py-2 text-[14px] text-green-800">{info}</p>}
        <button
          type="button"
          disabled={resendLoading}
          onClick={async () => {
            setResendLoading(true);
            setInfo("");
            const res = await resendDatingVerificationAction(form.email);
            setResendLoading(false);
            if (res.ok) {
              setEmailSent(true);
              setInfo("Link wysłany — sprawdź skrzynkę i spam.");
            } else setError(res.error);
          }}
          className="randki-btn-outline mt-4 w-full text-[13px]"
        >
          {resendLoading ? "Wysyłanie…" : "Wyślij link weryfikacyjny"}
        </button>
        <Link href={randkiPublicHref("/logowanie", isRandkiPortal)} className="randki-btn-primary mt-4 inline-block w-full text-center">
          Przejdź do logowania
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-md px-4 py-12">
      <Link href={randkiPublicHref("/", isRandkiPortal)} className="text-[14px] font-medium text-rose-600 hover:underline">
        ← Randki Odart
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-randki-navy">Rejestracja</h1>
      <p className="mt-2 text-[14px] text-randki-muted">
        Po rejestracji potwierdzisz e-mail i uzupełnisz profil. Akceptujesz{" "}
        <Link href={randkiPublicHref("/regulamin", isRandkiPortal)} className="text-rose-600 hover:underline">
          regulamin
        </Link>
        .
      </p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-[14px] text-red-700">{error}</p>}
        <div>
          <label className="block text-[14px] font-medium">Imię / pseudonim</label>
          <input className="randki-input" value={form.displayName} onChange={(e) => setForm((p) => ({ ...p, displayName: e.target.value }))} required />
        </div>
        <div>
          <label className="block text-[14px] font-medium">E-mail</label>
          <input type="email" className="randki-input" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} required />
        </div>
        <div>
          <label className="block text-[14px] font-medium">Hasło (min. 8 znaków)</label>
          <input type="password" className="randki-input" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} minLength={8} required />
        </div>
        <button type="submit" disabled={loading} className="randki-btn-primary w-full">
          {loading ? "Tworzenie konta…" : "Załóż konto"}
        </button>
      </form>
    </main>
  );
}
