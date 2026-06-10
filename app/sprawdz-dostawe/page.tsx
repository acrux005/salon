"use client";

import { useState } from "react";
import Link from "next/link";
import { ZamowTopHeader } from "@/components/ZamowTopHeader";

export default function SprawdzDostawePage() {
  const [postal, setPostal] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      const res = await fetch("/api/delivery-postal-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postalCode: postal.trim() }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (data.ok) {
        setMessage({ type: "ok", text: "Ten kod pocztowy znajduje się w obszarze dostaw DPD Food — możesz zamówić z dostawą na adres." });
      } else {
        setMessage({ type: "err", text: data.error || "Kod nie jest obsługiwany." });
      }
    } catch {
      setMessage({ type: "err", text: "Błąd połączenia. Spróbuj ponownie." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh bg-zamow-cream">
      <ZamowTopHeader
        showRestauracjeNavLink
        leading={
          <Link href="/restauracje" className="text-sm text-zamow-orange-600 hover:underline">
            ← Restauracje
          </Link>
        }
      />
      <main className="mx-auto max-w-lg px-4 py-10">
        <h1 className="font-display text-2xl font-semibold text-stone-900">Sprawdź kod pocztowy</h1>
        <p className="mt-2 text-sm text-stone-600">
          Wpisz kod w formacie <strong className="font-medium">XX-XXX</strong> (np. 00-950), aby sprawdzić, czy dostawa na adres jest możliwa w ramach DPD Food.
        </p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-2xl border border-stone-200 bg-white p-6">
          <div>
            <label htmlFor="postal" className="block text-sm font-medium text-stone-700">
              Kod pocztowy
            </label>
            <input
              id="postal"
              type="text"
              inputMode="numeric"
              autoComplete="postal-code"
              value={postal}
              onChange={(e) => setPostal(e.target.value)}
              className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2"
              placeholder="np. 00-950"
            />
          </div>
          {message && (
            <p
              className={
                message.type === "ok"
                  ? "rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800"
                  : "rounded-lg bg-red-50 p-3 text-sm text-red-700"
              }
            >
              {message.text}
            </p>
          )}
          <button
            type="submit"
            disabled={loading || !postal.trim()}
            className="w-full rounded-full bg-zamow-orange-600 py-3 font-medium text-white hover:bg-zamow-orange-500 disabled:opacity-50"
          >
            {loading ? "Sprawdzanie…" : "Sprawdź"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-stone-600">
          <Link href="/koszyk" className="font-medium text-zamow-orange-600 hover:underline">
            Przejdź do koszyka
          </Link>
        </p>
      </main>
    </div>
  );
}
