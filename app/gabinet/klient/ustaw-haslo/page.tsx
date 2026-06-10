"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { resetGabPasswordAction } from "@/app/actions/gabinetSettings";
import { GabLink } from "@/components/gabinetPlatform/GabLink";

export default function GabPatientSetPasswordPage() {
  const token = useSearchParams().get("token") ?? "";
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData();
    fd.set("token", token);
    fd.set("password", password);
    fd.set("accountType", "patient");
    const res = await resetGabPasswordAction(fd);
    if (!res.ok) setError(res.error);
    else setDone(true);
  }

  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-bold text-gab-navy">Nowe hasło pacjenta</h1>
      {done ? (
        <GabLink href="/klient/logowanie" className="mt-4 inline-block text-gab-sky hover:underline">
          Zaloguj się
        </GabLink>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && <p className="text-red-700">{error}</p>}
          <input type="password" required minLength={10} className="gab-input" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit" className="gab-btn-primary w-full">
            Zapisz
          </button>
        </form>
      )}
    </main>
  );
}
