"use client";

import Link from "next/link";
import type { CommunityPulse } from "@/lib/randki/communityPulse";
import { buildEmotionalPulseLines } from "@/lib/randki/emotionalMoments";
import { randkiPublicHref } from "@/lib/randkiPaths";

export function RandkiPanelPulse({ pulse }: { pulse: CommunityPulse }) {
  const items = buildEmotionalPulseLines(pulse);

  return (
    <div className="randki-panel-pulse mx-auto mt-4 max-w-lg overflow-hidden rounded-2xl border border-white/15 bg-white/[0.06] px-4 py-3 backdrop-blur-xl lg:mx-0">
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.text} className="flex items-center gap-2.5 text-[13px] text-white/65">
            <span className={`h-2 w-2 shrink-0 rounded-full ${item.dot}`} />
            {item.text}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function RandkiDailyFlow({
  hasMoment,
  hasPerson,
  discoveryDone,
}: {
  hasMoment: boolean;
  hasPerson: boolean;
  discoveryDone: boolean;
}) {
  const steps = [
    {
      n: 1,
      label: "Dodaj moment",
      done: hasMoment,
      href: "#randki-moment",
      active: !hasMoment,
    },
    {
      n: 2,
      label: "Otwórz pokój",
      done: discoveryDone,
      href: "#randki-discovery",
      active: hasMoment && hasPerson && !discoveryDone,
    },
    {
      n: 3,
      label: "Voice chat",
      done: false,
      href: randkiPublicHref("/voice-match"),
      active: hasMoment,
      external: true,
    },
  ];

  return (
    <div className="randki-glass-strong randki-daily-flow mx-auto mt-6 max-w-lg rounded-2xl p-4 lg:mx-0">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/45">Twój plan na dziś</p>
      <ol className="mt-3 space-y-2">
        {steps.map((s) => (
          <li key={s.n}>
            <Link
              href={s.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition ${
                s.active ? "bg-white/10 ring-1 ring-rose-400/30" : s.done ? "bg-emerald-500/10" : "bg-white/[0.03] opacity-70"
              }`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${
                  s.done ? "bg-emerald-500 text-white" : s.active ? "bg-rose-500 text-white" : "bg-white/10 text-white/50"
                }`}
              >
                {s.done ? "✓" : s.n}
              </span>
              <span className="text-[14px] font-medium text-white/90">{s.label}</span>
              {s.active && !s.done && <span className="ml-auto text-[11px] text-rose-300">Teraz →</span>}
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
