"use client";

import { useState, useEffect } from "react";
import { usePortalQuiz } from "./PortalQuizContext";
import Link from "next/link";
import { X } from "lucide-react";
import { normalizeTags } from "@/lib/skinmatch/legacyQuiz";

const DRYNESS_OPTIONS = [
  { value: "dry" as const, label: "Ściągnięta / sucha" },
  { value: "normal" as const, label: "Komfortowa" },
  { value: "oily" as const, label: "Świecąca / tłusta" },
];

const ISSUES_OPTIONS = [
  { value: "pores", label: "Rozszerzone pory / zaskórniki" },
  { value: "pigmentation", label: "Przebarwienia / szarość" },
  { value: "wrinkles", label: "Zmarszczki / brak jędrności" },
  { value: "redness", label: "Rumień / pieczenie" },
];

const REACTIVE_OPTIONS = [
  { value: true, label: "Tak, często rumień lub pieczenie" },
  { value: false, label: "Nie" },
];

function getApiBase(): string {
  if (typeof window === "undefined") return "";
  return process.env.NEXT_PUBLIC_BASE_PATH || "";
}

interface AnalyzeResponse {
  tags: string[];
  human_readable_description: string;
  clinics: { slug: string; name: string; city: string; matchScore?: number }[];
}

export function QuizModal() {
  const { isOpen, closeModal, preselectedProblem } = usePortalQuiz();
  const [step, setStep] = useState(1);
  const [dryness, setDryness] = useState<"dry" | "normal" | "oily" | "">("");
  const [issues, setIssues] = useState<string[]>([]);
  const [reactive, setReactive] = useState<boolean | null>(null);
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);

  useEffect(() => {
    if (isOpen && preselectedProblem) {
      if (preselectedProblem === "tradzik" || preselectedProblem === "pory") setIssues((p) => (p.includes("pores") ? p : [...p, "pores"]));
      if (preselectedProblem === "przebarwienia") setIssues((p) => (p.includes("pigmentation") ? p : [...p, "pigmentation"]));
      if (preselectedProblem === "anti-aging") setIssues((p) => (p.includes("wrinkles") ? p : [...p, "wrinkles"]));
      if (preselectedProblem === "naczynka") setIssues((p) => (p.includes("redness") ? p : [...p, "redness"]));
    }
    if (!isOpen) {
      setStep(1);
      setDryness("");
      setIssues([]);
      setReactive(null);
      setCity("");
      setResult(null);
      setError(null);
    }
  }, [isOpen, preselectedProblem]);

  const toggleIssue = (value: string) => {
    setIssues((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };

  const handleShowResult = async () => {
    if (dryness === "" || reactive === null) {
      setError("Odpowiedz na wszystkie pytania (typ cery i reaktywność).");
      return;
    }
    setError(null);
    setLoading(true);
    setResult(null);
    try {
      const tags = normalizeTags({
        dryness,
        issues,
        reactive: reactive ?? undefined,
      });
      const base = getApiBase();
      const res = await fetch(`${base}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tags,
          city: city.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || `Błąd ${res.status}`);
        return;
      }
      setResult(data);
      setStep(3);
    } catch {
      setError("Nie udało się połączyć z serwerem.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal} aria-hidden />
      <div
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-neutral-200 bg-white shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quiz-title"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-4">
          <h2 id="quiz-title" className="font-[var(--font-serif)] text-lg font-medium text-[#1F1A1C]">
            Analiza skóry
          </h2>
          <button
            type="button"
            onClick={closeModal}
            className="rounded-full p-2 text-neutral-500 hover:bg-neutral-100 hover:text-[#1F1A1C]"
            aria-label="Zamknij"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {step === 1 && (
            <>
              <p className="mb-3 font-[var(--font-sans)] text-[15px] font-medium text-[#1F1A1C]">
                Jak czujesz skórę po myciu (bez kremu)?
              </p>
              <div className="mb-6 flex flex-wrap gap-2">
                {DRYNESS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setDryness(opt.value)}
                    className={`rounded-full border px-4 py-2.5 font-[var(--font-sans)] text-[14px] font-medium transition-all ${
                      dryness === opt.value ? "border-pink-400 bg-pink-50 text-pink-700" : "border-neutral-300 bg-white text-[#1F1A1C] hover:border-pink-300 hover:bg-pink-50/50"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <p className="mb-3 font-[var(--font-sans)] text-[15px] font-medium text-[#1F1A1C]">
                Co widzisz w lustrze? (można kilka)
              </p>
              <div className="mb-6 flex flex-wrap gap-2">
                {ISSUES_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggleIssue(opt.value)}
                    className={`rounded-full border px-4 py-2.5 font-[var(--font-sans)] text-[14px] font-medium transition-all ${
                      issues.includes(opt.value) ? "border-pink-400 bg-pink-50 text-pink-700" : "border-neutral-300 bg-white text-[#1F1A1C] hover:border-pink-300 hover:bg-pink-50/50"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <p className="mb-3 font-[var(--font-sans)] text-[15px] font-medium text-[#1F1A1C]">
                Czy skóra jest reaktywna?
              </p>
              <div className="mb-6 flex flex-wrap gap-2">
                {REACTIVE_OPTIONS.map((opt) => (
                  <button
                    key={String(opt.value)}
                    type="button"
                    onClick={() => setReactive(opt.value)}
                    className={`rounded-full border px-4 py-2.5 font-[var(--font-sans)] text-[14px] font-medium transition-all ${
                      reactive === opt.value ? "border-pink-400 bg-pink-50 text-pink-700" : "border-neutral-300 bg-white text-[#1F1A1C] hover:border-pink-300 hover:bg-pink-50/50"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="rounded-full bg-pink-500 px-5 py-2.5 font-[var(--font-sans)] text-[14px] font-medium text-white hover:bg-pink-600"
                >
                  Dalej
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <p className="mb-4 font-[var(--font-sans)] text-[15px] text-[#6F5E64]">
                W jakiej okolicy szukasz gabinetu?
              </p>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="np. Warszawa, Kraków, Gdańsk"
                className="w-full rounded-xl border border-neutral-300 px-4 py-3 font-[var(--font-sans)] text-[15px] outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-200"
              />
              {error && <p className="mt-2 text-[14px] text-red-600">{error}</p>}
              <div className="mt-6 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="rounded-full border border-neutral-300 px-5 py-2.5 font-[var(--font-sans)] text-[14px] font-medium text-[#1F1A1C] hover:bg-neutral-50"
                >
                  Wstecz
                </button>
                <button
                  type="button"
                  onClick={handleShowResult}
                  disabled={loading}
                  className="rounded-full bg-pink-500 px-5 py-2.5 font-[var(--font-sans)] text-[14px] font-medium text-white hover:bg-pink-600 disabled:opacity-70"
                >
                  {loading ? "Generowanie wyniku…" : "Pokaż wynik"}
                </button>
              </div>
            </>
          )}

          {step === 3 && result && (
            <>
              <p className="mb-2 font-[var(--font-sans)] text-[13px] font-medium uppercase tracking-wider text-pink-600">
                Czego potrzebuje Twoja skóra
              </p>
              <p className="font-[var(--font-sans)] text-[15px] leading-relaxed text-[#1F1A1C]">
                {result.human_readable_description}
              </p>
              {result.clinics.length > 0 && (
                <div className="mt-6">
                  <p className="mb-2 font-[var(--font-sans)] text-[14px] font-medium text-[#1F1A1C]">
                    Dopasowane gabinety ({result.clinics.length})
                  </p>
                  <ul className="space-y-2">
                    {result.clinics.map((c) => (
                      <li key={c.slug} className="rounded-xl border border-neutral-200 bg-neutral-50/50 px-4 py-3">
                        {c.slug ? (
                          <Link href={`/portal/gabinet/${c.slug}`} onClick={closeModal} className="block hover:opacity-90">
                            <p className="font-[var(--font-sans)] text-[15px] font-medium text-[#1F1A1C]">{c.name}</p>
                            <p className="text-[13px] text-[#6F5E64]">{c.city}</p>
                            <span className="mt-1 inline-block text-[13px] font-medium text-pink-600">Profil →</span>
                          </Link>
                        ) : (
                          <>
                            <p className="font-[var(--font-sans)] text-[15px] font-medium text-[#1F1A1C]">{c.name}</p>
                            <p className="text-[13px] text-[#6F5E64]">{c.city}</p>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="mt-6 flex flex-col gap-3">
                <Link
                  href="/portal/gabinety"
                  onClick={closeModal}
                  className="block w-full rounded-full bg-pink-500 py-3 text-center font-[var(--font-sans)] text-[15px] font-medium text-white hover:bg-pink-600"
                >
                  Zobacz wszystkie gabinety
                </Link>
                <button
                  type="button"
                  onClick={() => { setResult(null); setStep(1); setError(null); }}
                  className="font-[var(--font-sans)] text-[14px] text-pink-600 hover:underline"
                >
                  Rozpocznij od nowa
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
