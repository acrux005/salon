"use client";

import { useState, useTransition } from "react";
import { saveDatingRoomPhasesAction } from "@/app/actions/randki";
import { DAY_PHASE_ORDER, DAY_PHASES, type DayPhase } from "@/lib/randki/dayRhythm";
import { RANDKI_ACTIVITY_INTENTS, RANDKI_MOODS } from "@/lib/randki/onboarding";
import {
  ROOM_CLIMATE_ORDER,
  ROOM_CLIMATES,
  type RoomClimateId,
} from "@/lib/randki/roomClimate";
import {
  defaultPhaseConfig,
  serializeRoomPhasesMap,
  type UserRoomPhaseConfig,
  type UserRoomPhasesMap,
} from "@/lib/randki/roomPhases";

type Props = {
  initialPhases: UserRoomPhasesMap;
  onChange?: (phases: UserRoomPhasesMap) => void;
  onSaved?: () => void;
};

function phaseConfig(map: UserRoomPhasesMap, phase: DayPhase): UserRoomPhaseConfig {
  return map[phase] ?? {};
}

export function RandkiRoomPhaseEditor({ initialPhases, onChange, onSaved }: Props) {
  const [phases, setPhases] = useState<UserRoomPhasesMap>(initialPhases);
  const [activePhase, setActivePhase] = useState<DayPhase>("evening");
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  function patchPhase(phase: DayPhase, patch: Partial<UserRoomPhaseConfig>) {
    setPhases((prev) => {
      const next = { ...prev, [phase]: { ...phaseConfig(prev, phase), ...patch } };
      onChange?.(next);
      return next;
    });
  }

  function fillDefaults(phase: DayPhase) {
    patchPhase(phase, defaultPhaseConfig(phase));
  }

  function save() {
    start(async () => {
      setMsg("");
      setErr("");
      const res = await saveDatingRoomPhasesAction(serializeRoomPhasesMap(phases));
      if (res.ok) {
        setMsg("Pory dnia zapisane.");
        onSaved?.();
      } else setErr(res.error);
    });
  }

  const cfg = phaseConfig(phases, activePhase);
  const meta = DAY_PHASES[activePhase];
  const climate = cfg.climateId ? ROOM_CLIMATES[cfg.climateId] : null;

  return (
    <div className="randki-room-phase-editor space-y-4">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-sky-200/80">🕐 Pory dnia</p>
        <p className="mt-0.5 text-[12px] text-white/45">
          Ustaw klimat pokoju osobno na poranek, dzień, zachód, wieczór i noc — goście widzą wersję aktualnej pory.
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {DAY_PHASE_ORDER.map((phase) => {
          const pMeta = DAY_PHASES[phase];
          const configured = !!phases[phase]?.climateId || !!phases[phase]?.quote?.trim();
          return (
            <button
              key={phase}
              type="button"
              onClick={() => setActivePhase(phase)}
              className={`rounded-full border px-3 py-1.5 text-[11px] font-medium transition ${
                activePhase === phase
                  ? "border-rose-400/50 bg-rose-500/20 text-white"
                  : configured
                    ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-100/90"
                    : "border-white/12 bg-white/5 text-white/60 hover:border-white/25"
              }`}
            >
              {pMeta.emoji} {pMeta.label}
            </button>
          );
        })}
      </div>

      <div className={`rounded-xl border border-white/10 bg-black/20 p-4 ${climate ? `randki-climate--${climate.id}` : ""}`}>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="text-[13px] font-medium text-white">
            {meta.emoji} {meta.label}
            <span className="ml-2 text-[11px] font-normal text-white/40">{meta.energy}</span>
          </p>
          <button
            type="button"
            onClick={() => fillDefaults(activePhase)}
            className="text-[10px] text-violet-300/90 underline-offset-2 hover:underline"
          >
            Sugestia klimatu
          </button>
        </div>

        <label className="block text-[11px] text-white/45">Klimat pokoju</label>
        <select
          className="randki-input mt-1"
          value={cfg.climateId ?? ""}
          onChange={(e) =>
            patchPhase(activePhase, { climateId: (e.target.value as RoomClimateId) || null })
          }
        >
          <option value="">— wybierz klimat —</option>
          {ROOM_CLIMATE_ORDER.map((id) => (
            <option key={id} value={id}>
              {ROOM_CLIMATES[id].emoji} {ROOM_CLIMATES[id].label}
            </option>
          ))}
        </select>

        <label className="mt-3 block text-[11px] text-white/45">Temperatura (atmosfera)</label>
        <input
          className="randki-input mt-1"
          value={cfg.temperature ?? ""}
          placeholder={climate?.temperatures[0] ?? "np. cicho, spokojnie"}
          maxLength={48}
          onChange={(e) => patchPhase(activePhase, { temperature: e.target.value })}
        />

        <label className="mt-3 block text-[11px] text-white/45">Mikro-cytat w pokoju</label>
        <textarea
          rows={2}
          className="randki-input mt-1"
          value={cfg.quote ?? ""}
          maxLength={160}
          placeholder={`Co słychać w ${meta.label.toLowerCase()}…`}
          onChange={(e) => patchPhase(activePhase, { quote: e.target.value })}
        />

        <p className="mt-3 text-[11px] text-white/45">Vibe</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {RANDKI_MOODS.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => patchPhase(activePhase, { mood: cfg.mood === m.value ? null : m.value })}
              className={`rounded-full px-2.5 py-1 text-[10px] ${
                cfg.mood === m.value ? "bg-rose-500 text-white" : "bg-white/10 text-white/70"
              }`}
            >
              {m.emoji} {m.label}
            </button>
          ))}
        </div>

        <p className="mt-3 text-[11px] text-white/45">Aktywność</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {RANDKI_ACTIVITY_INTENTS.map((a) => (
            <button
              key={a.value}
              type="button"
              onClick={() =>
                patchPhase(activePhase, {
                  activityIntent: cfg.activityIntent === a.value ? null : a.value,
                })
              }
              className={`rounded-full px-2.5 py-1 text-[10px] ${
                cfg.activityIntent === a.value ? "bg-violet-500 text-white" : "bg-white/10 text-white/70"
              }`}
            >
              {a.emoji} {a.label}
            </button>
          ))}
        </div>

        <label className="mt-3 flex cursor-pointer items-center gap-2 text-[12px] text-white/55">
          <input
            type="checkbox"
            checked={cfg.active !== false}
            onChange={(e) => patchPhase(activePhase, { active: e.target.checked })}
          />
          Pokój aktywny w tej porze
        </label>
      </div>

      {err && <p className="text-[13px] text-rose-300">{err}</p>}
      {msg && <p className="text-[13px] text-emerald-300">{msg}</p>}

      <button type="button" disabled={pending} onClick={save} className="randki-btn-primary w-full sm:w-auto">
        {pending ? "Zapisuję…" : "Zapisz pory dnia"}
      </button>
    </div>
  );
}
