"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import type { VibeMaterialKind } from "@/lib/randki/vibeMaterialTypes";
import { getVibeInspiration } from "@/lib/randki/vibeCaptionInspiration";
import type { VibeInspirationField } from "@/lib/randki/vibeCaptionInspiration";
import { getVibeInspirationBatchAction, inspireVibeCaptionAction } from "@/app/actions/randki";

type Props = {
  kind: VibeMaterialKind;
  field?: VibeInspirationField;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  label?: string;
  showAi?: boolean;
};

const FALLBACK_CHIPS = ["nocne miasto", "jazz i deszcz", "powrót autem nocą", "kawa o 6 rano"];
const FALLBACK_EXAMPLES = ["ciepły tramwaj zimą", "film w tle o 1:40", "powrót autem nocą"];

export function RandkiVibeCaptionHelper({
  kind,
  field = "caption",
  value,
  onChange,
  rows = 2,
  label,
  showAi = true,
}: Props) {
  const pack = useMemo(() => getVibeInspiration(kind, field), [kind, field]);
  const [chips, setChips] = useState(FALLBACK_CHIPS);
  const [examples, setExamples] = useState(FALLBACK_EXAMPLES);
  const [placeholder, setPlaceholder] = useState("jedno zdanie wystarczy");
  const [activePrompt, setActivePrompt] = useState<string | null>(null);
  const [poolSize, setPoolSize] = useState<number | null>(null);
  const [aiSeed, setAiSeed] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [pending, startTransition] = useTransition();
  const [loadingBatch, setLoadingBatch] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoadingBatch(true);
    getVibeInspirationBatchAction(kind).then((res) => {
      if (cancelled || !res.ok) return;
      setChips(res.batch.chips);
      setExamples(res.batch.examples);
      setPlaceholder(res.batch.placeholder);
      setPoolSize(res.batch.poolSize);
      setLoadingBatch(false);
    });
    return () => {
      cancelled = true;
    };
  }, [kind]);

  function insertChip(text: string) {
    onChange(value.trim() ? `${value.trim()} ${text}` : text);
  }

  function inspireMe() {
    startTransition(async () => {
      const res = await getVibeInspirationBatchAction(kind);
      if (!res.ok) return;
      setChips(res.batch.chips);
      setExamples(res.batch.examples);
      setPlaceholder(res.batch.placeholder);
      setActivePrompt(res.batch.prompt);
      setPoolSize(res.batch.poolSize);
    });
  }

  function shuffleChips() {
    startTransition(async () => {
      const res = await getVibeInspirationBatchAction(kind);
      if (res.ok) {
        setChips(res.batch.chips);
        setExamples(res.batch.examples);
        setPlaceholder(res.batch.placeholder);
        setPoolSize(res.batch.poolSize);
      }
    });
  }

  function expandWithAi() {
    startTransition(async () => {
      const res = await inspireVibeCaptionAction(kind, aiSeed || value);
      if (res.ok) setAiSuggestions(res.suggestions);
    });
  }

  const aiPlaceholder = pack.aiSeedPlaceholders[Math.floor(Math.random() * pack.aiSeedPlaceholders.length)];

  return (
    <div className="space-y-2.5">
      <div>
        <p className="text-[13px] font-medium text-white/90">{label ?? pack.question}</p>
        <p className="mt-1 text-[11px] text-white/45">{pack.reassurance}</p>
        {poolSize !== null && (
          <p className="mt-0.5 text-[10px] text-white/30">{poolSize.toLocaleString("pl-PL")}+ podpowiedzi w puli</p>
        )}
      </div>

      <div className="rounded-lg border border-white/5 bg-black/15 px-3 py-2">
        <p className="text-[10px] uppercase tracking-wide text-white/35">Inni piszą np.</p>
        <ul className="mt-1 space-y-0.5">
          {examples.map((ex) => (
            <li key={ex}>
              <button
                type="button"
                onClick={() => onChange(ex.replace(/^„|”$/g, ""))}
                className="text-left text-[12px] text-violet-200/80 underline decoration-white/10 underline-offset-2 hover:text-violet-100"
              >
                „{ex.replace(/^„|”$/g, "")}”
              </button>
            </li>
          ))}
        </ul>
      </div>

      <textarea
        className="randki-input w-full"
        rows={rows}
        placeholder={activePrompt ?? placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

      <div className="flex flex-wrap gap-1.5">
        {(loadingBatch ? FALLBACK_CHIPS : chips).map((chip) => (
          <button
            key={chip}
            type="button"
            onClick={() => insertChip(chip)}
            className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/70 transition hover:border-violet-400/40 hover:bg-violet-500/10 hover:text-white"
          >
            ✨ {chip}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={pending}
          onClick={inspireMe}
          className="text-[12px] text-violet-300 underline decoration-white/10 underline-offset-2 hover:text-violet-200 disabled:opacity-50"
        >
          🎲 Nie wiem — zainspiruj mnie
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={shuffleChips}
          className="text-[12px] text-white/45 underline decoration-white/10 underline-offset-2 hover:text-white/70 disabled:opacity-50"
        >
          ↻ Więcej podpowiedzi
        </button>
      </div>

      {activePrompt && (
        <p className="rounded-lg bg-violet-500/10 px-3 py-2 text-[12px] italic text-violet-100/90">{activePrompt}</p>
      )}

      {showAi && (
        <div className="rounded-xl border border-white/8 bg-black/20 p-3">
          <p className="text-[11px] text-white/50">Masz luźny pomysł? Rozwiń go jednym kliknięciem.</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <input
              className="randki-input min-w-[160px] flex-1 text-[13px]"
              placeholder={aiPlaceholder}
              value={aiSeed}
              onChange={(e) => setAiSeed(e.target.value)}
            />
            <button
              type="button"
              disabled={pending}
              onClick={expandWithAi}
              className="rounded-full bg-white/10 px-3 py-1.5 text-[11px] text-white/80 hover:bg-white/15 disabled:opacity-50"
            >
              {pending ? "…" : "Rozwiń pomysł"}
            </button>
          </div>
          {aiSuggestions.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {aiSuggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => onChange(s)}
                  className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-left text-[11px] text-emerald-100/90 hover:bg-emerald-500/20"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
