"use client";

import { useState, useTransition } from "react";
import { setDatingCircleAction } from "@/app/actions/randki";
import { RANDKI_CIRCLES } from "@/lib/randki/circles";

export function RandkiCirclePicker({
  initialSlug,
  isPremium,
}: {
  initialSlug: string | null;
  isPremium: boolean;
}) {
  const [slug, setSlug] = useState(initialSlug);
  const [pending, start] = useTransition();
  const [err, setErr] = useState("");

  function pick(value: string) {
    const next = slug === value ? null : value;
    setErr("");
    start(async () => {
      const res = await setDatingCircleAction(next);
      if (!res.ok) {
        setErr(res.error);
        return;
      }
      setSlug(next);
    });
  }

  return (
    <div className="space-y-3">
      <p className="text-[14px] text-white/60">
        Prywatny krąg zamiast globalnego katalogu — poznajesz ludzi ze swojego środowiska.
      </p>
      <div className="flex flex-wrap gap-2">
        {RANDKI_CIRCLES.map((c) => {
          const locked = c.premium && !isPremium;
          return (
            <button
              key={c.slug}
              type="button"
              disabled={pending || locked}
              onClick={() => pick(c.slug)}
              title={locked ? "Wymaga Premium" : c.description}
              className={`rounded-xl px-3 py-2 text-left text-[12px] transition ${
                slug === c.slug
                  ? "bg-violet-500 text-white shadow-lg shadow-violet-500/30"
                  : locked
                    ? "cursor-not-allowed bg-white/5 text-white/30"
                    : "bg-white/10 text-white/75 hover:bg-white/15"
              }`}
            >
              {c.emoji} {c.label}
              {c.premium && <span className="ml-1 text-[10px] opacity-70">PRO</span>}
            </button>
          );
        })}
      </div>
      {slug && (
        <p className="text-[13px] text-violet-200">
          Twój krąg: {RANDKI_CIRCLES.find((c) => c.slug === slug)?.emoji}{" "}
          {RANDKI_CIRCLES.find((c) => c.slug === slug)?.label}
        </p>
      )}
      {err && <p className="text-[13px] text-rose-300">{err}</p>}
    </div>
  );
}
