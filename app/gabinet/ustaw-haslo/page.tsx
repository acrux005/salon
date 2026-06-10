"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { resetGabPasswordAction } from "@/app/actions/gabinetSettings";
import { GabLink } from "@/components/gabinetPlatform/GabLink";

export default function GabSetPasswordPage() {
  const token = useSearchParams().get("token") ?? "";
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const fd = new FormData();
    fd.set("token", token);
    fd.set("password", password);
    fd.set("accountType", "clinic");
    const res = await resetGabPasswordAction(fd);
    setLoading(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setDone(true);
  }

  if (!token) {
    return (
      <main className="mx-auto max-w-md px-4 py-16">
        <p className="text-red-700">Brak tokenu w linku.</p>
        <GabLink href="/zapomniane-haslo" className="mt-4 inline-block text-gab-sky hover:underline">
          Wyślij link ponownie
        </GabLink>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-bold text-gab-navy">Ustaw nowe hasło</h1>
      {done ? (
        <p className="mt-4 text-[15px] text-green-800">
          Hasło zmienione.{" "}
          <GabLink href="/login" className="font-medium text-gab-sky hover:underline">
            Zaloguj się
          </GabLink>
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-[14px] text-red-700">{error}</p>}
          <input type="password" required minLength={10} className="gab-input" placeholder="Nowe hasło (min. 10 znaków)" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit" disabled={loading} className="gab-btn-primary w-full disabled:opacity-60">
            {loading ? "Zapisuję…" : "Zapisz hasło"}
          </button>
        </form>
      )}
    </main>
  );
}
