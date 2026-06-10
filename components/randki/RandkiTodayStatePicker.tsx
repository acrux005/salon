"use client";

import { useState, useTransition } from "react";
import { setDatingTodayStateAction } from "@/app/actions/randki";
import { TODAY_STATE_PRESETS, todayStateLabel } from "@/lib/randki/todayState";

export function RandkiTodayStatePicker({
  initialState,
  initialUpdatedAt,
}: {
  initialState: string | null;
  initialUpdatedAt?: string | null;
}) {
  const [state, setState] = useState(initialState);
  const [custom, setCustom] = useState(
    initialState && !TODAY_STATE_PRESETS.some((p) => p.id === initialState) ? initialState : ""
  );
  const [showCustom, setShowCustom] = useState(false);
  const [pending, start] = useTransition();

  const activeLabel = todayStateLabel(state);

  function save(next: string | null) {
    setState(next);
    start(async () => {
      await setDatingTodayStateAction(next);
    });
  }

  function pickPreset(id: string) {
    const next = state === id ? null : id;
    setCustom("");
    setShowCustom(false);
    save(next);
  }

  function saveCustom() {
    const trimmed = custom.trim();
    if (!trimmed) {
      save(null);
      return;
    }
    save(trimmed);
    setShowCustom(false);
  }

  return (
    <div className="randki-today-state rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-200/80">Dziś czuję…</p>
          <p className="mt-0.5 text-[10px] text-white/38">Mikro-status na 24h — zamiast bio</p>
        </div>
        {activeLabel && (
          <span className="max-w-[52%] truncate rounded-full border border-amber-400/25 bg-amber-500/10 px-2 py-0.5 text-[10px] text-amber-100/90">
            {activeLabel}
          </span>
        )}
      </div>

      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {TODAY_STATE_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            disabled={pending}
            onClick={() => pickPreset(preset.id)}
            className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
              state === preset.id
                ? "bg-amber-500/90 text-white shadow-md shadow-amber-500/25"
                : "bg-white/10 text-white/70 hover:bg-white/15"
            }`}
          >
            {preset.emoji} {preset.label}
          </button>
        ))}
        <button
          type="button"
          disabled={pending}
          onClick={() => setShowCustom((v) => !v)}
          className="rounded-full border border-dashed border-white/20 px-2.5 py-1 text-[11px] text-white/50 hover:border-white/30 hover:text-white/70"
        >
          ✏️ własne
        </button>
      </div>

      {showCustom && (
        <div className="mt-2 flex gap-2">
          <input
            type="text"
            maxLength={80}
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="np. bardziej cisza niż rozmowa"
            className="randki-input flex-1 text-[12px]"
          />
          <button type="button" disabled={pending} onClick={saveCustom} className="randki-btn-primary shrink-0 px-3 text-[12px]">
            Zapisz
          </button>
        </div>
      )}

      {initialUpdatedAt && !activeLabel && (
        <p className="mt-2 text-[9px] text-white/28">Wczorajszy status wygasł — ustaw na dziś.</p>
      )}
    </div>
  );
}
