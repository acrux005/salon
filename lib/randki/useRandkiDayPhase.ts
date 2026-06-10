"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  dayPhaseClass,
  getDayPhaseMeta,
  resolveDayPhaseMeta,
  type DayPhaseMeta,
} from "@/lib/randki/dayRhythm";

/** Aktualna faza dnia — uwzględnia ?phase= (demo) i zegar. */
export function useRandkiDayPhase(): DayPhaseMeta {
  const pathname = usePathname();
  const [meta, setMeta] = useState<DayPhaseMeta>(() => getDayPhaseMeta());

  useEffect(() => {
    const sync = () => {
      const override = new URLSearchParams(window.location.search).get("phase");
      setMeta(resolveDayPhaseMeta(override));
    };
    sync();
    window.addEventListener("popstate", sync);
    const fast = setInterval(sync, 350);
    const clock = setInterval(() => {
      if (!new URLSearchParams(window.location.search).get("phase")) {
        setMeta(getDayPhaseMeta());
      }
    }, 60_000);
    return () => {
      window.removeEventListener("popstate", sync);
      clearInterval(fast);
      clearInterval(clock);
    };
  }, [pathname]);

  return meta;
}

export function useRandkiDayPhaseClass(): string {
  const phase = useRandkiDayPhase();
  return dayPhaseClass(phase.id);
}
