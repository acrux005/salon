"use client";

import { useState } from "react";
import { normalizeTags } from "@/lib/skinmatch/legacyQuiz";

const P1_OPTIONS = [
  { value: "dry", label: "Ściągnięta / sucha" },
  { value: "normal", label: "Komfortowa" },
  { value: "oily", label: "Świecąca / tłusta" },
];

const P2_OPTIONS = [
  { value: "pores", label: "Rozszerzone pory / zaskórniki" },
  { value: "pigmentation", label: "Przebarwienia / szarość" },
  { value: "wrinkles", label: "Zmarszczki / brak jędrności" },
  { value: "redness", label: "Rumień / pieczenie" },
];

const P3_OPTIONS = [
  { value: "tak", label: "Tak, często rumień/pieczenie" },
  { value: "nie", label: "Nie" },
];

interface AnalyzeApiResult {
  tags: string[];
  human_readable_description: string;
  clinics: { slug: string; name: string; city: string; matchScore?: number }[];
}

export default function AnalizaSkoryPage() {
  const [p1, setP1] = useState<string>("");
  const [p2, setP2] = useState<string[]>([]);
  const [p3, setP3] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalyzeApiResult | null>(null);

  const toggleP2 = (value: string) => {
    setP2((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const getApiBase = () =>
    process.env.NEXT_PUBLIC_BASE_PATH || "";

  const handleSubmit = async () => {
    if (!p1 || !p3) {
      setError("Odpowiedz na wszystkie pytania (P1 i P3 są wymagane).");
      return;
    }
    setError(null);
    setLoading(true);
    setResult(null);

    try {
      const tags = normalizeTags({
        dryness: p1 as "dry" | "normal" | "oily",
        issues: p2,
        reactive: p3 === "tak",
      });
      const base = getApiBase();
      const apiUrl = `${base}/api/analyze`;
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tags }),
      });

      let data: AnalyzeApiResult | { error?: string };
      try {
        data = await res.json();
      } catch {
        setError(
          res.ok
            ? "Błąd odczytu odpowiedzi."
            : `Błąd serwera (${res.status}). Sprawdź: ${apiUrl}`
        );
        return;
      }
      if (!res.ok) {
        setError((data as { error?: string }).error || `Błąd ${res.status}`);
        return;
      }
      setResult(data as AnalyzeApiResult);
    } catch {
      setError("Nie udało się połączyć z serwerem. Sprawdź połączenie lub konfigurację proxy.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8F6]">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
        <header className="mb-12 text-center">
          <h1 className="font-[var(--font-serif)] text-3xl font-normal text-[#1F1A1C] sm:text-4xl">
            Szybka analiza skóry
          </h1>
          <p className="mt-3 font-[var(--font-sans)] text-[15px] text-[#6F5E64]">
            (bez diagnozy medycznej)
          </p>
          <p className="mt-4 font-[var(--font-sans)] text-[16px] leading-relaxed text-[#4a3f42]">
            Odpowiedz na 3 pytania, a dostaniesz sugestie i dopasowane gabinety.
          </p>
        </header>

        {!result ? (
          <div className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-10">
              <p className="mb-4 font-[var(--font-sans)] text-[15px] font-medium text-[#1F1A1C]">
                P1: Jak czujesz skórę po myciu (bez kremu)?
              </p>
              <div className="space-y-2">
                {P1_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50/50 px-4 py-3 transition-colors has-[:checked]:border-pink-300 has-[:checked]:bg-pink-50/50"
                  >
                    <input
                      type="radio"
                      name="p1"
                      value={opt.value}
                      checked={p1 === opt.value}
                      onChange={() => setP1(opt.value)}
                      className="h-4 w-4 border-neutral-300 text-pink-500 focus:ring-pink-300"
                    />
                    <span className="font-[var(--font-sans)] text-[15px] text-[#1F1A1C]">
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-10">
              <p className="mb-4 font-[var(--font-sans)] text-[15px] font-medium text-[#1F1A1C]">
                P2: Co widzisz w lustrze? (można zaznaczyć kilka)
              </p>
              <div className="space-y-2">
                {P2_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50/50 px-4 py-3 transition-colors has-[:checked]:border-pink-300 has-[:checked]:bg-pink-50/50"
                  >
                    <input
                      type="checkbox"
                      checked={p2.includes(opt.value)}
                      onChange={() => toggleP2(opt.value)}
                      className="h-4 w-4 rounded border-neutral-300 text-pink-500 focus:ring-pink-300"
                    />
                    <span className="font-[var(--font-sans)] text-[15px] text-[#1F1A1C]">
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-10">
              <p className="mb-4 font-[var(--font-sans)] text-[15px] font-medium text-[#1F1A1C]">
                P3: Czy skóra jest reaktywna?
              </p>
              <div className="space-y-2">
                {P3_OPTIONS.map((opt) => (
                  <label
                    key={opt.value}
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50/50 px-4 py-3 transition-colors has-[:checked]:border-pink-300 has-[:checked]:bg-pink-50/50"
                  >
                    <input
                      type="radio"
                      name="p3"
                      value={opt.value}
                      checked={p3 === opt.value}
                      onChange={() => setP3(opt.value)}
                      className="h-4 w-4 border-neutral-300 text-pink-500 focus:ring-pink-300"
                    />
                    <span className="font-[var(--font-sans)] text-[15px] text-[#1F1A1C]">
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {error && (
              <p className="mb-6 font-[var(--font-sans)] text-[14px] text-red-600">
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full rounded-full bg-pink-500 py-4 font-[var(--font-sans)] text-[16px] font-medium text-white shadow-md transition-all hover:bg-pink-600 disabled:opacity-70"
            >
              {loading ? "Generowanie wyniku…" : "Pokaż wynik"}
            </button>
          </div>
        ) : (
          <div className="space-y-10">
            <section className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="mb-4 font-[var(--font-serif)] text-xl font-normal text-[#1F1A1C]">
                Czego potrzebuje Twoja skóra
              </h2>
              <p className="font-[var(--font-sans)] text-[15px] leading-relaxed text-[#4a3f42] whitespace-pre-line">
                {result.human_readable_description}
              </p>
            </section>

            {result.clinics.length > 0 && (
              <section className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm sm:p-8">
                <h2 className="mb-4 font-[var(--font-serif)] text-xl font-normal text-[#1F1A1C]">
                  Dopasowane gabinety
                </h2>
                <ul className="space-y-4">
                  {result.clinics.map((c) => (
                    <li
                      key={c.slug}
                      className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-4"
                    >
                      {c.slug ? (
                        <a
                          href={`/portal/gabinet/${c.slug}`}
                          className="block hover:opacity-90"
                        >
                          <p className="font-[var(--font-sans)] text-[16px] font-medium text-[#1F1A1C]">
                            {c.name}
                          </p>
                          <p className="text-[14px] text-[#6F5E64]">{c.city}</p>
                          <span className="mt-2 inline-block text-[14px] font-medium text-pink-600">
                            Sprawdź profil →
                          </span>
                        </a>
                      ) : (
                        <>
                          <p className="font-[var(--font-sans)] text-[16px] font-medium text-[#1F1A1C]">
                            {c.name}
                          </p>
                          <p className="text-[14px] text-[#6F5E64]">{c.city}</p>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
                <a
                  href={`${getApiBase()}/portal/gabinety`}
                  className="mt-4 inline-block font-[var(--font-sans)] text-[14px] font-medium text-pink-600 hover:underline"
                >
                  Zobacz wszystkie gabinety →
                </a>
              </section>
            )}

            <p className="text-center font-[var(--font-sans)] text-[14px] text-[#6F5E64]">
              To nie jest diagnoza medyczna. W razie wątpliwości skonsultuj się z kosmetyczką lub lekarzem.
            </p>

            <section id="kontakt" className="rounded-2xl border border-pink-200 bg-pink-50/30 p-6 sm:p-8 text-center">
              <h2 className="font-[var(--font-serif)] text-xl font-normal text-[#1F1A1C]">
                Umów konsultację
              </h2>
              <p className="mt-2 font-[var(--font-sans)] text-[15px] text-[#6F5E64]">
                Chcesz dopasować zabiegi indywidualnie? Zapraszamy na wizytę.
              </p>
              <a
                href="#kontakt"
                className="mt-6 inline-block rounded-full bg-pink-500 px-6 py-3 font-[var(--font-sans)] text-[15px] font-medium text-white hover:bg-pink-600"
              >
                Umów wizytę
              </a>
            </section>

            <button
              type="button"
              onClick={() => setResult(null)}
              className="w-full rounded-full border border-neutral-300 py-3 font-[var(--font-sans)] text-[14px] font-medium text-[#1F1A1C] hover:bg-neutral-50"
            >
              Wypełnij quiz od nowa
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
