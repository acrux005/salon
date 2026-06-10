"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveOnboardingAction } from "@/app/actions/randki";
import { RANDKI_INTENTIONS, RANDKI_ONBOARDING_QUESTIONS } from "@/lib/randki/onboarding";
import { randkiPublicHref } from "@/lib/randkiPaths";

export function RandkiOnboardingClient({ isRandkiPortal }: { isRandkiPortal: boolean }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [intention, setIntention] = useState("relationship");
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  const totalSteps = RANDKI_ONBOARDING_QUESTIONS.length + 1;
  const isIntentionStep = step === 0;
  const question = !isIntentionStep ? RANDKI_ONBOARDING_QUESTIONS[step - 1] : null;

  function submit() {
    start(async () => {
      setError("");
      const fd = new FormData();
      fd.set("intention", intention);
      for (const [k, v] of Object.entries(answers)) {
        if (Array.isArray(v)) v.forEach((x) => fd.append(`q_${k}`, x));
        else fd.set(`q_${k}`, v);
      }
      const res = await saveOnboardingAction(fd);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      router.push(randkiPublicHref("/panel", isRandkiPortal));
      router.refresh();
    });
  }

  function next() {
    if (isIntentionStep) {
      setStep(1);
      return;
    }
    if (!question) return;
    const val = answers[question.id];
    if (question.type !== "multi" && (!val || (typeof val === "string" && !val.trim()))) {
      setError("Odpowiedz, żeby przejść dalej.");
      return;
    }
    setError("");
    if (step >= totalSteps - 1) submit();
    else setStep((s) => s + 1);
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-6">
        <p className="text-[12px] font-medium uppercase tracking-wider text-violet-400">
          Krok {step + 1} / {totalSteps}
        </p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-gradient-to-r from-rose-500 to-violet-500 transition-all" style={{ width: `${((step + 1) / totalSteps) * 100}%` }} />
        </div>
      </div>

      <div className="randki-glass p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-white">
          {isIntentionStep ? "Czego szukasz?" : question?.question}
        </h1>
        <p className="mt-2 text-[14px] text-white/60">
          {isIntentionStep
            ? "Pomaga nam dopasować osoby o podobnych intencjach — mniej przypadkowych rozmów."
            : "Lepsze dopasowanie niż samo zdjęcie."}
        </p>

        <div className="mt-6 space-y-3">
          {isIntentionStep &&
            RANDKI_INTENTIONS.map((i) => (
              <label
                key={i.value}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition ${intention === i.value ? "border-rose-400 bg-rose-500/20" : "border-white/10 hover:border-white/20"}`}
              >
                <input type="radio" name="intention" checked={intention === i.value} onChange={() => setIntention(i.value)} className="accent-rose-500" />
                <span className="text-[15px] text-white">{i.label}</span>
              </label>
            ))}

          {question?.type === "choice" &&
            question.options.map((o) => (
              <label
                key={o.value}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition ${answers[question.id] === o.value ? "border-rose-400 bg-rose-500/20" : "border-white/10 hover:border-white/20"}`}
              >
                <input
                  type="radio"
                  checked={answers[question.id] === o.value}
                  onChange={() => setAnswers((p) => ({ ...p, [question.id]: o.value }))}
                  className="accent-rose-500"
                />
                <span className="text-[15px] text-white">{o.label}</span>
              </label>
            ))}

          {question?.type === "text" && (
            <textarea
              className="randki-input-dark min-h-[100px]"
              placeholder={question.placeholder}
              value={(answers[question.id] as string) ?? ""}
              onChange={(e) => setAnswers((p) => ({ ...p, [question.id]: e.target.value }))}
            />
          )}

          {question?.type === "multi" && (
            <div className="flex flex-wrap gap-2">
              {question.options.map((o) => {
                const selected = Array.isArray(answers[question.id]) && answers[question.id].includes(o.value);
                return (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() =>
                      setAnswers((p) => {
                        const cur = Array.isArray(p[question.id]) ? (p[question.id] as string[]) : [];
                        return {
                          ...p,
                          [question.id]: cur.includes(o.value) ? cur.filter((x) => x !== o.value) : [...cur, o.value].slice(0, 4),
                        };
                      })
                    }
                    className={`rounded-full px-4 py-2 text-[13px] font-medium transition ${selected ? "bg-rose-500 text-white" : "bg-white/10 text-white/80 hover:bg-white/15"}`}
                  >
                    {o.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {error && <p className="mt-4 text-[14px] text-rose-300">{error}</p>}

        <div className="mt-8 flex gap-3">
          {step > 0 && (
            <button type="button" onClick={() => setStep((s) => s - 1)} className="randki-btn-ghost flex-1">
              Wstecz
            </button>
          )}
          <button type="button" disabled={pending} onClick={next} className="randki-btn-primary flex-1">
            {pending ? "Zapisuję…" : step >= totalSteps - 1 ? "Zaczynam odkrywać" : "Dalej"}
          </button>
        </div>
      </div>
    </div>
  );
}
