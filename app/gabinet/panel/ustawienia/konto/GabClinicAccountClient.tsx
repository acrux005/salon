"use client";

import { useState } from "react";
import { changeGabClinicPasswordAction, resendGabClinicVerificationAction } from "@/app/actions/gabinetSettings";
import { GabLink } from "@/components/gabinetPlatform/GabLink";

export function GabClinicAccountClient({
  email,
  emailVerified,
}: {
  email: string;
  emailVerified: boolean;
}) {
  const [passwords, setPasswords] = useState({ current: "", next: "" });
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function savePassword(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    setErr("");
    const fd = new FormData();
    fd.set("currentPassword", passwords.current);
    fd.set("newPassword", passwords.next);
    const res = await changeGabClinicPasswordAction(fd);
    if (!res.ok) setErr(res.error);
    else {
      setMsg("Hasło zostało zmienione.");
      setPasswords({ current: "", next: "" });
    }
  }

  async function resendVerify() {
    setMsg("");
    setErr("");
    const res = await resendGabClinicVerificationAction();
    if (!res.ok) setErr(res.error);
    else setMsg("Wysłano link weryfikacyjny na " + email);
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <GabLink href="/panel/ustawienia" className="text-[14px] text-gab-sky hover:underline">
        ← Ustawienia
      </GabLink>

      <div className="rounded-xl border border-gab-sky/15 bg-white p-5">
        <h2 className="font-semibold text-gab-navy">Konto administratora</h2>
        <p className="mt-2 text-[14px] text-slate-600">
          E-mail: {email} {emailVerified ? "✓ potwierdzony" : "· niepotwierdzony"}
        </p>
        {!emailVerified && (
          <button type="button" onClick={resendVerify} className="mt-2 text-[14px] text-gab-sky hover:underline">
            Wyślij ponownie link weryfikacyjny
          </button>
        )}
      </div>

      {msg && <p className="rounded-lg bg-green-50 px-3 py-2 text-[14px] text-green-800">{msg}</p>}
      {err && <p className="rounded-lg bg-red-50 px-3 py-2 text-[14px] text-red-700">{err}</p>}

      <form onSubmit={savePassword} className="space-y-3 rounded-xl border border-gab-sky/15 bg-white p-5">
        <h2 className="font-semibold text-gab-navy">Zmiana hasła</h2>
        <input
          type="password"
          className="gab-input"
          placeholder="Obecne hasło"
          value={passwords.current}
          onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
          required
        />
        <input
          type="password"
          minLength={10}
          className="gab-input"
          placeholder="Nowe hasło (min. 10 znaków)"
          value={passwords.next}
          onChange={(e) => setPasswords((p) => ({ ...p, next: e.target.value }))}
          required
        />
        <button type="submit" className="gab-btn-primary w-full">
          Zmień hasło
        </button>
      </form>

      <p className="text-[13px] text-slate-500">
        <GabLink href="/zapomniane-haslo" className="text-gab-sky hover:underline">
          Nie pamiętasz hasła?
        </GabLink>
      </p>
    </div>
  );
}
