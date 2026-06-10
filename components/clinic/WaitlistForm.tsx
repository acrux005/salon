"use client";

import { useState } from "react";
const BASE = typeof window !== "undefined" ? (process.env.NEXT_PUBLIC_BASE_PATH ?? "") : "";

export function WaitlistForm({
  clinicSlug,
  className = "",
}: {
  clinicSlug: string;
  className?: string;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = email.trim().toLowerCase();
    if (!val || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      setStatus("error");
      setMessage("Podaj poprawny adres e-mail.");
      return;
    }
    setStatus("sending");
    setMessage("");
    try {
      const res = await fetch(`${BASE}/api/waitlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clinicSlug, email: val }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus("ok");
        setMessage((data as { message?: string }).message ?? "Dodano do listy. Powiadomimy Cię e-mailem.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage((data as { error?: string }).error ?? "Nie udało się zapisać.");
      }
    } catch {
      setStatus("error");
      setMessage("Błąd połączenia. Spróbuj ponownie.");
    }
  };

  return (
    <div className={className}>
      <p className="text-[13px] font-medium text-[#6F5E64]">
        Brak wolnych terminów? Podaj e-mail — powiadomimy Cię, gdy zwolni się miejsce.
      </p>
      {status === "ok" && <p className="mt-2 text-[13px] text-green-700">{message}</p>}
      {status === "error" && <p className="mt-2 text-[13px] text-red-600">{message}</p>}
      {status !== "ok" && (
        <form onSubmit={submit} className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="twoj@email.pl"
            className="min-w-0 flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-[14px] placeholder-neutral-400 focus:border-pink-300 focus:outline-none focus:ring-1 focus:ring-pink-200"
            disabled={status === "sending"}
          />
          <button
            type="submit"
            disabled={status === "sending"}
            className="rounded-full border border-pink-200 px-4 py-2 text-[14px] font-medium text-pink-600 hover:bg-pink-50 disabled:opacity-50"
          >
            {status === "sending" ? "Zapisuję…" : "Powiadom mnie"}
          </button>
        </form>
      )}
    </div>
  );
}
