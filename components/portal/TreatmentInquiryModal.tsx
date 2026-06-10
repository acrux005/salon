"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { X } from "lucide-react";

const BASE = typeof window !== "undefined" ? (process.env.NEXT_PUBLIC_BASE_PATH ?? "") : "";

type Props = {
  clinicSlug: string;
  treatmentName: string;
  prefillName?: string;
  prefillEmail?: string;
  onClose: () => void;
};

export function TreatmentInquiryModal({ clinicSlug, treatmentName, prefillName, prefillEmail, onClose }: Props) {
  const [name, setName] = useState(prefillName ?? "");
  const [email, setEmail] = useState(prefillEmail ?? "");
  const [message, setMessage] = useState("");
  const [consentGabinet, setConsentGabinet] = useState(false);
  const [consentRegulamin, setConsentRegulamin] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    firstInputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) { setError("Napisz wiadomość."); return; }
    if (!consentGabinet || !consentRegulamin) {
      setError("Zaakceptuj regulamin, politykę prywatności oraz zgodę na przekazanie danych do gabinetu.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`${BASE}/api/inquiry`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clinicSlug, treatmentName, clientName: name.trim(), clientEmail: email.trim(), message: message.trim() }),
      });
      const json = await res.json().catch(() => ({})) as { error?: string };
      if (!res.ok) { setError(json.error ?? "Nie udało się wysłać zapytania."); return; }
      setSuccess(true);
    } catch {
      setError("Błąd połączenia. Spróbuj ponownie.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-neutral-500 hover:bg-neutral-100"
          aria-label="Zamknij"
        >
          <X className="h-4 w-4" />
        </button>

        {success ? (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-pink-100 text-3xl">✉️</div>
            <h3 className="font-[var(--font-serif)] text-lg font-semibold text-[#1F1A1C]">Zapytanie wysłane!</h3>
            <p className="font-[var(--font-sans)] text-[15px] text-[#6F5E64]">
              Gabinet odpowie na podany adres e-mail.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-pink-500 px-6 py-2.5 text-[14px] font-medium text-white hover:bg-pink-600"
            >
              Zamknij
            </button>
          </div>
        ) : (
          <>
            <h3 className="font-[var(--font-serif)] text-lg font-semibold text-[#1F1A1C]">
              Zapytaj o zabieg
            </h3>
            <p className="mt-1 font-[var(--font-sans)] text-[14px] text-[#6F5E64]">
              {treatmentName}
            </p>
            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-[14px] text-red-700">{error}</p>
              )}
              <label className="block">
                <span className="mb-1 block text-[13px] font-medium text-[#6F5E64]">Imię i nazwisko *</span>
                <input
                  ref={firstInputRef}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-[15px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                  placeholder="Twoje imię i nazwisko"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-[13px] font-medium text-[#6F5E64]">E-mail *</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-[15px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                  placeholder="twoj@email.pl"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-[13px] font-medium text-[#6F5E64]">Wiadomość *</span>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={4}
                  maxLength={2000}
                  className="w-full resize-none rounded-lg border border-neutral-200 px-3 py-2 text-[15px] focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500"
                  placeholder="Napisz swoje pytanie o zabieg…"
                />
                <span className="block text-right text-[12px] text-neutral-400">{message.length}/2000</span>
              </label>
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentGabinet}
                  onChange={(e) => setConsentGabinet(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-neutral-200 text-pink-500 focus:ring-pink-500"
                />
                <span className="text-[13px] text-[#6F5E64]">
                  Wyrażam zgodę na przekazanie moich danych do wybranego gabinetu w celu kontaktu w
                  sprawie wizyty. *
                </span>
              </label>
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentRegulamin}
                  onChange={(e) => setConsentRegulamin(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-neutral-200 text-pink-500 focus:ring-pink-500"
                />
                <span className="text-[13px] text-[#6F5E64]">
                  Akceptuję{" "}
                  <Link href="/regulamin" className="text-pink-600 hover:underline" target="_blank" rel="noopener noreferrer">
                    regulamin serwisu
                  </Link>{" "}
                  oraz{" "}
                  <Link href="/polityka-prywatnosci" className="text-pink-600 hover:underline" target="_blank" rel="noopener noreferrer">
                    politykę prywatności
                  </Link>
                  . *
                </span>
              </label>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full border border-neutral-200 px-4 py-2 text-[14px] text-[#6F5E64] hover:bg-neutral-50"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 rounded-full bg-pink-500 py-2 text-[14px] font-medium text-white hover:bg-pink-600 disabled:opacity-50"
                >
                  {submitting ? "Wysyłanie…" : "Wyślij zapytanie"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
