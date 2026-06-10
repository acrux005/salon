"use client";

import {
  FDI_QUADRANTS,
  FDI_STATE_LEGEND,
  FDI_TOOTH_STATE_STYLES,
  type FdiToothState,
  getToothState,
} from "@/lib/gabinet/fdiTeeth";

export function GabFdiDiagram({
  selected,
  onSelect,
  toothStates,
  disabled,
  showLegend = true,
  readOnly = false,
}: {
  selected?: string | null;
  onSelect?: (tooth: string) => void;
  toothStates?: Record<string, FdiToothState>;
  disabled?: boolean;
  showLegend?: boolean;
  readOnly?: boolean;
}) {
  const selectable = !readOnly && !!onSelect;

  return (
    <div className="space-y-4">
      {!readOnly && (
        <p className="text-[13px] text-slate-600">
          Kliknij ząb (numer FDI). Kolory pokazują etapy planu.
        </p>
      )}

      {showLegend && (
        <div className="flex flex-wrap gap-3 text-[11px] text-slate-600">
          {FDI_STATE_LEGEND.map((state) => (
            <span key={state} className="inline-flex items-center gap-1.5">
              <span className={`h-2.5 w-2.5 rounded-full ${FDI_TOOTH_STATE_STYLES[state].dotClass}`} />
              {FDI_TOOTH_STATE_STYLES[state].label}
            </span>
          ))}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {FDI_QUADRANTS.map((q) => (
          <div key={q.id} className="rounded-xl border border-gab-sky/15 bg-white p-3">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              {q.label}
            </p>
            <div className="flex flex-wrap gap-1">
              {q.teeth.map((n) => {
                const id = String(n);
                const state = getToothState(n, toothStates);
                const style = FDI_TOOTH_STATE_STYLES[state];
                const isSelected = selected === id;
                return (
                  <button
                    key={n}
                    type="button"
                    disabled={disabled || !selectable}
                    onClick={() => selectable && onSelect!(isSelected ? "" : id)}
                    className={`h-8 w-8 rounded-md text-[11px] font-semibold transition ${style.className} ${
                      isSelected ? "ring-2 ring-gab-sky ring-offset-1" : ""
                    } ${!selectable ? "cursor-default" : "hover:opacity-90"} disabled:opacity-50`}
                    title={`Ząb ${n} — ${style.label}`}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {selected && selectable && (
        <p className="text-[13px] font-medium text-gab-navy">Wybrany: ząb {selected}</p>
      )}
    </div>
  );
}
