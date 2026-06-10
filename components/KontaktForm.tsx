"use client";

import Link from "next/link";
import { useState } from "react";

export function KontaktForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = (fd.get("name") as string)?.trim();
    const email = (fd.get("email") as string)?.trim();
    const message = (fd.get("message") as string)?.trim();
    const consentRegulamin = fd.get("consent_regulamin") === "on";
    const consentPrzetwarzanie = fd.get("consent_przetwarzanie") === "on";

    if (!name || !email || !message) {
      setErrorMsg("Wypełnij wszystkie pola.");
      setStatus("error");
      return;
    }
    if (!consentRegulamin || !consentPrzetwarzanie) {
      setErrorMsg("Zaakceptuj regulamin, politykę prywatności oraz wyraź zgodę na przetwarzanie danych.");
      setStatus("error");
      return;
    }

    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (data.ok) {
        setStatus("ok");
        form.reset();
      } else {
        setStatus("error");
        setErrorMsg(data.error ?? "Wystąpił błąd. Spróbuj ponownie.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Wystąpił błąd połączenia. Spróbuj ponownie.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="kontakt-name" className="mb-1 block font-[var(--font-sans)] text-sm font-medium text-beauty-charcoal">
          Imię i nazwisko *
        </label>
        <input
          id="kontakt-name"
          name="name"
          type="text"
          required
          disabled={status === "sending"}
          className="w-full rounded-xl border border-beauty-pink-200/60 bg-white px-4 py-3 font-[var(--font-sans)] text-[15px] text-beauty-charcoal placeholder:text-beauty-charcoal-muted focus:border-beauty-rose focus:outline-none focus:ring-1 focus:ring-beauty-rose disabled:opacity-60"
          placeholder="Jan Kowalski"
        />
      </div>
      <div>
        <label htmlFor="kontakt-email" className="mb-1 block font-[var(--font-sans)] text-sm font-medium text-beauty-charcoal">
          E-mail *
        </label>
        <input
          id="kontakt-email"
          name="email"
          type="email"
          required
          disabled={status === "sending"}
          className="w-full rounded-xl border border-beauty-pink-200/60 bg-white px-4 py-3 font-[var(--font-sans)] text-[15px] text-beauty-charcoal placeholder:text-beauty-charcoal-muted focus:border-beauty-rose focus:outline-none focus:ring-1 focus:ring-beauty-rose disabled:opacity-60"
          placeholder="jan@example.com"
        />
      </div>
      <div>
        <label htmlFor="kontakt-message" className="mb-1 block font-[var(--font-sans)] text-sm font-medium text-beauty-charcoal">
          Wiadomość *
        </label>
        <textarea
          id="kontakt-message"
          name="message"
          required
          rows={5}
          disabled={status === "sending"}
          className="w-full rounded-xl border border-beauty-pink-200/60 bg-white px-4 py-3 font-[var(--font-sans)] text-[15px] text-beauty-charcoal placeholder:text-beauty-charcoal-muted focus:border-beauty-rose focus:outline-none focus:ring-1 focus:ring-beauty-rose disabled:opacity-60"
          placeholder="Opisz swoje zapytanie..."
        />
      </div>
      <div className="space-y-3">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="consent_regulamin"
            disabled={status === "sending"}
            className="mt-1 h-4 w-4 rounded border-beauty-pink-200/60 text-beauty-rose focus:ring-beauty-rose"
          />
          <span className="font-[var(--font-sans)] text-[14px] text-beauty-charcoal">
            Akceptuję{" "}
            <Link href="/regulamin" className="text-beauty-rose hover:underline">
              regulamin serwisu
            </Link>{" "}
            oraz{" "}
            <Link href="/polityka-prywatnosci" className="text-beauty-rose hover:underline">
              politykę prywatności
            </Link>
            . *
          </span>
        </label>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="consent_przetwarzanie"
            disabled={status === "sending"}
            className="mt-1 h-4 w-4 rounded border-beauty-pink-200/60 text-beauty-rose focus:ring-beauty-rose"
          />
          <span className="font-[var(--font-sans)] text-[14px] text-beauty-charcoal">
            Wyrażam zgodę na przetwarzanie moich danych osobowych w celu udzielenia odpowiedzi
            na zapytanie (zgodnie z{" "}
            <Link href="/polityka-prywatnosci" className="text-beauty-rose hover:underline">
              polityką prywatności
            </Link>
            ). *
          </span>
        </label>
      </div>
      {status === "error" && errorMsg && (
        <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{errorMsg}</p>
      )}
      {status === "ok" && (
        <p className="rounded-lg bg-green-50 px-4 py-2 text-sm text-green-800">
          Wiadomość została wysłana. Odpowiemy najszybciej jak to możliwe.
        </p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-full bg-beauty-rose px-8 py-3 font-[var(--font-sans)] text-[15px] font-semibold text-white transition-colors hover:bg-beauty-pink-500 disabled:opacity-60"
      >
        {status === "sending" ? "Wysyłanie…" : "Wyślij zapytanie"}
      </button>
    </form>
  );
}
