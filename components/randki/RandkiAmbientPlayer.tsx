"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { DayPhase } from "@/lib/randki/dayRhythm";
import { useRandkiDayPhase } from "@/lib/randki/useRandkiDayPhase";
import {
  AMBIENT_CROSSFADE_MS,
  AMBIENT_DEFAULT_VOLUME,
  AMBIENT_STORAGE_KEY,
  AMBIENT_TRACK_META,
  ambientTrackUrl,
} from "@/lib/randki/ambientTracks";

type AmbientContextValue = {
  enabled: boolean;
  toggling: boolean;
  toggle: () => void;
  meta: (typeof AMBIENT_TRACK_META)[DayPhase];
};

const AmbientContext = createContext<AmbientContextValue | null>(null);

function readStoredEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(AMBIENT_STORAGE_KEY) === "1";
}

export function RandkiAmbientProvider({ children }: { children: ReactNode }) {
  const dayPhase = useRandkiDayPhase();
  const [enabled, setEnabled] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [toggling, setToggling] = useState(false);

  const audioARef = useRef<HTMLAudioElement>(null);
  const audioBRef = useRef<HTMLAudioElement>(null);
  const activeSlot = useRef<"a" | "b">("a");
  const phaseRef = useRef<DayPhase>(dayPhase.id);
  const dayPhaseIdRef = useRef(dayPhase.id);
  dayPhaseIdRef.current = dayPhase.id;
  const enabledRef = useRef(false);
  const fadeTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setEnabled(readStoredEnabled());
    setHydrated(true);
  }, []);

  const getActiveEl = useCallback(() => {
    return activeSlot.current === "a" ? audioARef.current : audioBRef.current;
  }, []);

  const getInactiveEl = useCallback(() => {
    return activeSlot.current === "a" ? audioBRef.current : audioARef.current;
  }, []);

  const clearFade = useCallback(() => {
    if (fadeTimer.current) {
      clearInterval(fadeTimer.current);
      fadeTimer.current = null;
    }
  }, []);

  const setVolume = useCallback((el: HTMLAudioElement | null, volume: number) => {
    if (!el) return;
    el.volume = Math.max(0, Math.min(1, volume));
  }, []);

  const playPhase = useCallback(
    async (phase: DayPhase, crossfade: boolean) => {
      const inactive = getInactiveEl();
      const active = getActiveEl();
      if (!inactive) return;

      inactive.loop = true;
      inactive.src = ambientTrackUrl(phase);
      inactive.currentTime = 0;
      setVolume(inactive, crossfade ? 0 : AMBIENT_DEFAULT_VOLUME);

      try {
        await inactive.play();
      } catch {
        enabledRef.current = false;
        setEnabled(false);
        window.localStorage.setItem(AMBIENT_STORAGE_KEY, "0");
        return;
      }

      if (!crossfade || !active) {
        active?.pause();
        activeSlot.current = activeSlot.current === "a" ? "b" : "a";
        setVolume(getActiveEl(), AMBIENT_DEFAULT_VOLUME);
        return;
      }

      clearFade();
      const steps = 36;
      const stepMs = AMBIENT_CROSSFADE_MS / steps;
      let step = 0;
      fadeTimer.current = setInterval(() => {
        step += 1;
        const t = step / steps;
        setVolume(active, AMBIENT_DEFAULT_VOLUME * (1 - t));
        setVolume(inactive, AMBIENT_DEFAULT_VOLUME * t);
        if (step >= steps) {
          clearFade();
          active.pause();
          activeSlot.current = activeSlot.current === "a" ? "b" : "a";
        }
      }, stepMs);
    },
    [clearFade, getActiveEl, getInactiveEl, setVolume]
  );

  const stopAll = useCallback(() => {
    clearFade();
    audioARef.current?.pause();
    audioBRef.current?.pause();
  }, [clearFade]);

  useEffect(() => {
    enabledRef.current = enabled;
    if (!hydrated) return;

    window.localStorage.setItem(AMBIENT_STORAGE_KEY, enabled ? "1" : "0");

    if (enabled) {
      phaseRef.current = dayPhaseIdRef.current;
      void playPhase(dayPhaseIdRef.current, false);
    } else {
      stopAll();
    }
  }, [enabled, hydrated, playPhase, stopAll]);

  useEffect(() => {
    if (!enabled || !hydrated) return;
    if (phaseRef.current === dayPhase.id) return;
    phaseRef.current = dayPhase.id;
    void playPhase(dayPhase.id, true);
  }, [dayPhase.id, enabled, hydrated, playPhase]);

  useEffect(() => {
    const onVisibility = () => {
      if (!enabledRef.current) return;
      if (document.hidden) {
        audioARef.current?.pause();
        audioBRef.current?.pause();
      } else {
        void getActiveEl()?.play().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [getActiveEl]);

  const toggle = useCallback(() => {
    setToggling(true);
    setEnabled((prev) => !prev);
    window.setTimeout(() => setToggling(false), 400);
  }, []);

  const value: AmbientContextValue = {
    enabled: hydrated && enabled,
    toggling,
    toggle,
    meta: AMBIENT_TRACK_META[dayPhase.id],
  };

  return (
    <AmbientContext.Provider value={value}>
      <audio ref={audioARef} preload="none" className="hidden" aria-hidden />
      <audio ref={audioBRef} preload="none" className="hidden" aria-hidden />
      {children}
      {hydrated && enabled && (
        <div className="randki-ambient-status pointer-events-none fixed bottom-24 left-4 z-30 hidden md:block lg:bottom-6">
          <span className="randki-ambient-status-wave mr-2 inline-flex h-3 items-end gap-[2px] align-middle">
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={i} className="randki-ambient-status-bar w-[2px] rounded-full bg-violet-300/70" />
            ))}
          </span>
          <span className="text-[10px] text-white/45">
            {value.meta.label} · {value.meta.mood}
          </span>
        </div>
      )}
    </AmbientContext.Provider>
  );
}

export function useRandkiAmbient() {
  const ctx = useContext(AmbientContext);
  if (!ctx) throw new Error("useRandkiAmbient must be used within RandkiAmbientProvider");
  return ctx;
}

export function RandkiAmbientToggle({ className = "" }: { className?: string }) {
  const { enabled, toggling, toggle, meta } = useRandkiAmbient();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={enabled}
      title={enabled ? "Wyłącz ambient w tle" : "Włącz ambient w tle"}
      className={`randki-ambient-toggle rounded-full border px-2.5 py-2 text-[12px] transition ${className} ${
        enabled
          ? "randki-ambient-toggle--on border-violet-400/35 bg-violet-500/15 text-violet-100"
          : "border-white/10 text-white/40 hover:border-white/20 hover:text-white/70"
      } ${toggling ? "scale-95 opacity-80" : ""}`}
    >
      <span className="flex items-center gap-1.5">
        <span className={`text-[13px] ${enabled ? "randki-ambient-toggle-icon--on" : ""}`} aria-hidden>
          {enabled ? "🔊" : "🎧"}
        </span>
        <span className="hidden sm:inline">{enabled ? "Ambient" : "Ambient"}</span>
        <span className="sr-only">{enabled ? `Wyłącz: ${meta.mood}` : `Włącz ambient: ${meta.label}`}</span>
      </span>
    </button>
  );
}
