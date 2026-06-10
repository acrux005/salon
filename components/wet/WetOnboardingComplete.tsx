"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, Calendar, Plus } from "lucide-react";
import { completeVetOnboardingAction } from "@/app/actions/vetOnboarding";

const DONE_ITEMS = [
  "Dane zapisane",
  "Powiadomienia aktywne",
  "Cennik ustawiony",
] as const;

export function WetOnboardingComplete() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function finish(href: string) {
    setError("");
    setLoading(true);
    const result = await completeVetOnboardingAction();
    setLoading(false);
    if (!result.ok) {
      setError(result.error ?? "Nie udało się zakończyć konfiguracji.");
      return;
    }
    router.push(href);
    router.refresh();
  }

  return (
    <div className="py-4 text-center sm:py-8">
      <div
        className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-wet-teal to-teal-500 text-3xl shadow-lg shadow-wet-teal/30"
        aria-hidden
      >
        🎉
      </div>
      <h2 className="mt-6 text-2xl font-bold tracking-tight text-wet-navy sm:text-3xl">
        Twoja przychodnia jest gotowa
      </h2>
      <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-wet-navy-muted">
        Możesz zacząć przyjmować pacjentów. Kalendarz i przypomnienia są już skonfigurowane.
      </p>

      <ul className="mx-auto mt-8 max-w-sm space-y-3 text-left">
        {DONE_ITEMS.map((item) => (
          <li key={item} className="flex items-center gap-3 text-[15px] text-wet-navy">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-wet-teal/15 text-wet-teal">
              <Check className="h-4 w-4" aria-hidden />
            </span>
            {item}
          </li>
        ))}
      </ul>

      {error && (
        <p className="mt-6 rounded-xl bg-red-50 px-4 py-2.5 text-[14px] text-red-700" role="alert">
          {error}
        </p>
      )}

      <div className="mx-auto mt-10 flex max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          disabled={loading}
          onClick={() => finish("/wet/panel/kalendarz")}
          className="wet-btn-primary-lg inline-flex items-center justify-center gap-2"
        >
          <Calendar className="h-5 w-5" aria-hidden />
          {loading ? "Otwieram…" : "Przejdź do kalendarza"}
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => finish("/wet/panel/kalendarz")}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-[15px] font-semibold text-wet-navy transition hover:bg-slate-50 disabled:opacity-60"
        >
          <Plus className="h-5 w-5" aria-hidden />
          Dodaj pierwszą wizytę
        </button>
      </div>

      <p className="mt-6 text-[13px] text-wet-navy-muted">
        <Link href="/wet/panel" className="font-medium text-wet-teal hover:underline">
          Albo przejdź do panelu głównego
        </Link>
      </p>
    </div>
  );
}
