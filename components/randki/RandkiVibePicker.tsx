"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { setDatingActivityIntentAction, setDatingMoodAction } from "@/app/actions/randki";
import { RANDKI_ACTIVITY_INTENTS, RANDKI_MOODS } from "@/lib/randki/onboarding";
import { randkiPublicHref } from "@/lib/randkiPaths";

const EVENING_QUICK = [
  { emoji: "💬", label: "Mam ochotę pogadać", mood: "chat" as const },
  { emoji: "🚶", label: "Wieczorny spacer?", activity: "walk" as const },
  { emoji: "🎙", label: "Ktoś na voice?", href: "/voice-match" as const },
];

export function RandkiVibePicker({
  initialMood,
  initialActivity,
  isEvening = false,
}: {
  initialMood: string | null;
  initialActivity: string | null;
  isEvening?: boolean;
}) {
  const [mood, setMood] = useState(initialMood);
  const [activity, setActivity] = useState(initialActivity);
  const [pending, start] = useTransition();
  const [clientEvening, setClientEvening] = useState(isEvening);

  useEffect(() => {
    const h = new Date().getHours();
    setClientEvening(h >= 18 || h < 1);
  }, []);

  function pickMood(value: string) {
    const next = mood === value ? null : value;
    setMood(next);
    start(async () => {
      await setDatingMoodAction(next);
    });
  }

  function pickActivity(value: string) {
    const next = activity === value ? null : value;
    setActivity(next);
    start(async () => {
      await setDatingActivityIntentAction(next);
    });
  }

  function pickEvening(item: (typeof EVENING_QUICK)[number]) {
    if (item.href) return;
    start(async () => {
      if (item.mood) {
        setMood(item.mood);
        await setDatingMoodAction(item.mood);
      }
      if (item.activity) {
        setActivity(item.activity);
        await setDatingActivityIntentAction(item.activity);
      }
    });
  }

  return (
    <div className="mb-5 space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      {clientEvening && (
        <div className="rounded-xl border border-violet-500/20 bg-violet-500/10 p-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-violet-200">Wieczorny mood</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {EVENING_QUICK.map((item) =>
              item.href ? (
                <Link
                  key={item.label}
                  href={randkiPublicHref(item.href)}
                  className="rounded-full border border-rose-400/30 bg-rose-500/20 px-2.5 py-1 text-[11px] font-medium text-rose-100 transition hover:bg-rose-500/30"
                >
                  {item.emoji} {item.label}
                </Link>
              ) : (
                <button
                  key={item.label}
                  type="button"
                  disabled={pending}
                  onClick={() => pickEvening(item)}
                  className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-white/80 transition hover:bg-white/10"
                >
                  {item.emoji} {item.label}
                </button>
              )
            )}
          </div>
        </div>
      )}

      <div>
        <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-white/45">Twój vibe</p>
        <div className="flex flex-wrap gap-1.5">
          {RANDKI_MOODS.map((m) => (
            <button
              key={m.value}
              type="button"
              disabled={pending}
              onClick={() => pickMood(m.value)}
              className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition ${mood === m.value ? "bg-rose-500 text-white shadow-md shadow-rose-500/30" : "bg-white/10 text-white/70 hover:bg-white/15"}`}
            >
              {m.emoji} {m.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-white/45">Chcesz dziś…</p>
        <div className="flex flex-wrap gap-1.5">
          {RANDKI_ACTIVITY_INTENTS.map((a) => (
            <button
              key={a.value}
              type="button"
              disabled={pending}
              onClick={() => pickActivity(a.value)}
              className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition ${activity === a.value ? "bg-violet-500 text-white shadow-md shadow-violet-500/30" : "bg-white/10 text-white/70 hover:bg-white/15"}`}
            >
              {a.emoji} {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
