"use client";

import { useState } from "react";
import Link from "next/link";

const BASE = typeof window !== "undefined" ? (process.env.NEXT_PUBLIC_BASE_PATH ?? "") : "";
const CONTACT_EMAIL = "biuro@odart.pl";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", clinic: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Wypełnij wszystkie wymagane pola.");
      return;
    }
    setSending(true);
    setError(null);
    try {
      const res = await fetch(`${BASE}/api/contact-clinic`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError((j as { error?: string }).error ?? "Błąd wysyłania. Spróbuj ponownie.");
        return;
      }
      setSent(true);
    } catch {
      setError("Brak połączenia. Napisz bezpośrednio na " + CONTACT_EMAIL);
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 px-6 py-8 text-center">
        <p className="text-2xl">✓</p>
        <p className="mt-2 font-[var(--font-sans)] text-[16px] font-semibold text-green-800">
          Wiadomość wysłana!
        </p>
        <p className="mt-1 font-[var(--font-sans)] text-[14px] text-green-700">
          Odezwiemy się na <strong>{form.email}</strong> w ciągu 24 h.
        </p>
        <Link
          href="/portal/register"
          className="mt-5 inline-block rounded-full border border-pink-400 bg-white px-6 py-2.5 font-[var(--font-sans)] text-[14px] font-medium text-pink-600 hover:bg-pink-600 hover:text-white"
        >
          Zarejestruj gabinet od razu →
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4 text-left">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block font-[var(--font-sans)] text-[13px] font-medium text-[#1F1A1C]">
            Imię i nazwisko <span className="text-pink-500">*</span>
          </label>
          <input
            type="text"
            required
            value={form.name}
            onChange={set("name")}
            placeholder="Anna Kowalska"
            className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2.5 font-[var(--font-sans)] text-[14px] text-[#1F1A1C] focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100"
          />
        </div>
        <div>
          <label className="block font-[var(--font-sans)] text-[13px] font-medium text-[#1F1A1C]">
            E-mail <span className="text-pink-500">*</span>
          </label>
          <input
            type="email"
            required
            value={form.email}
            onChange={set("email")}
            placeholder="gabinet@example.pl"
            className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2.5 font-[var(--font-sans)] text-[14px] text-[#1F1A1C] focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100"
          />
        </div>
      </div>
      <div>
        <label className="block font-[var(--font-sans)] text-[13px] font-medium text-[#1F1A1C]">
          Nazwa gabinetu
        </label>
        <input
          type="text"
          value={form.clinic}
          onChange={set("clinic")}
          placeholder="Salon Urody ABC"
          className="mt-1 w-full rounded-xl border border-neutral-200 px-4 py-2.5 font-[var(--font-sans)] text-[14px] text-[#1F1A1C] focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100"
        />
      </div>
      <div>
        <label className="block font-[var(--font-sans)] text-[13px] font-medium text-[#1F1A1C]">
          Wiadomość <span className="text-pink-500">*</span>
        </label>
        <textarea
          required
          rows={4}
          value={form.message}
          onChange={set("message")}
          placeholder="Opisz krótko swój gabinet i specjalizacje…"
          className="mt-1 w-full resize-none rounded-xl border border-neutral-200 px-4 py-2.5 font-[var(--font-sans)] text-[14px] text-[#1F1A1C] focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100"
        />
      </div>

      {error && (
        <p className="font-[var(--font-sans)] text-[13px] text-red-500">{error}</p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={sending}
          className="rounded-full border border-pink-400 bg-white px-7 py-3 font-[var(--font-sans)] text-[15px] font-medium text-pink-600 transition-all hover:bg-pink-600 hover:text-white hover:border-pink-600 disabled:opacity-50"
        >
          {sending ? "Wysyłanie…" : "Wyślij wiadomość"}
        </button>
        <span className="font-[var(--font-sans)] text-[13px] text-neutral-400">
          lub napisz bezpośrednio:{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-medium text-pink-600 hover:underline"
          >
            {CONTACT_EMAIL}
          </a>
        </span>
      </div>
    </form>
  );
}
