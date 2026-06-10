"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DAY_PHASE_ORDER, DAY_PHASES, type DayPhase } from "@/lib/randki/dayRhythm";

export function RandkiDayPhasePortalSync({ phase }: { phase: DayPhase }) {
  useEffect(() => {
    const el = document.querySelector(".randki-portal");
    if (!el) return;
    for (const p of DAY_PHASE_ORDER) el.classList.remove(`randki-day-phase--${p}`);
    el.classList.add(`randki-day-phase--${phase}`);
  }, [phase]);
  return null;
}

export function RandkiDayPhaseDemoBar({ currentPhase }: { currentPhase: DayPhase }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [autoPlay, setAutoPlay] = useState(false);

  const setPhase = useCallback(
    (phase: DayPhase | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (phase) params.set("phase", phase);
      else params.delete("phase");
      const q = params.toString();
      router.replace(q ? `?${q}` : "?", { scroll: false });
    },
    [router, searchParams]
  );

  useEffect(() => {
    if (!autoPlay) return;
    const t = setInterval(() => {
      const idx = DAY_PHASE_ORDER.indexOf(currentPhase);
      const next = DAY_PHASE_ORDER[(idx + 1) % DAY_PHASE_ORDER.length];
      setPhase(next);
    }, 7000);
    return () => clearInterval(t);
  }, [autoPlay, currentPhase, setPhase]);

  return (
    <div className="randki-day-demo-bar mb-4 rounded-xl border border-violet-500/30 bg-violet-950/40 p-3 backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-violet-200/90">Demo całego dnia</p>
          <p className="mt-0.5 text-[12px] text-white/50">Przełącz porę — UI, copy i klimat pokoi</p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setAutoPlay((v) => !v)}
            className={`rounded-full border px-2.5 py-1 text-[10px] font-medium transition ${
              autoPlay
                ? "border-emerald-400/40 bg-emerald-500/15 text-emerald-200"
                : "border-white/15 bg-white/5 text-white/60 hover:border-white/25"
            }`}
          >
            {autoPlay ? "⏸ Pauza" : "▶ Przewiń dzień"}
          </button>
          <button
            type="button"
            onClick={() => setPhase(null)}
            className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[10px] text-white/55 hover:border-white/25"
          >
            Teraz
          </button>
        </div>
      </div>
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {DAY_PHASE_ORDER.map((phase) => {
          const meta = DAY_PHASES[phase];
          const active = phase === currentPhase;
          return (
            <button
              key={phase}
              type="button"
              onClick={() => setPhase(phase)}
              className={`rounded-full border px-3 py-1.5 text-[11px] font-medium transition ${
                active
                  ? "border-rose-400/50 bg-rose-500/20 text-white shadow-[0_0_20px_rgba(244,63,94,0.15)]"
                  : "border-white/12 bg-black/20 text-white/65 hover:border-white/25 hover:text-white/90"
              }`}
            >
              {meta.emoji} {meta.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
