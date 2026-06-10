"use client";

import { useState, useTransition } from "react";
import { setDatingMoodAction } from "@/app/actions/randki";
import { RANDKI_MOODS } from "@/lib/randki/onboarding";

export function RandkiMoodPicker({ initialMood }: { initialMood: string | null }) {
  const [mood, setMood] = useState(initialMood);
  const [pending, start] = useTransition();

  function pick(value: string) {
    const next = mood === value ? null : value;
    setMood(next);
    start(async () => {
      await setDatingMoodAction(next);
    });
  }

  return (
    <div className="mb-6">
      <p className="mb-2 text-center text-[12px] font-medium uppercase tracking-wide text-white/50">Twój nastrój dziś</p>
      <div className="flex flex-wrap justify-center gap-2">
        {RANDKI_MOODS.map((m) => (
          <button
            key={m.value}
            type="button"
            disabled={pending}
            onClick={() => pick(m.value)}
            className={`rounded-full px-3 py-1.5 text-[12px] font-medium transition ${mood === m.value ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30" : "bg-white/10 text-white/70 hover:bg-white/15"}`}
          >
            {m.emoji} {m.label}
          </button>
        ))}
      </div>
    </div>
  );
}
