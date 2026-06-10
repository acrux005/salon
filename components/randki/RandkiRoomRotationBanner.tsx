"use client";

import Link from "next/link";
import { useRandkiDayPhase } from "@/lib/randki/useRandkiDayPhase";
import { minutesUntilNextRotation, ROTATION_SLOT_MINUTES } from "@/lib/randki/roomRotation";
import { slotExpiresAt } from "@/lib/randki/ephemeralRooms";
import { RandkiEphemeralRoomTimer } from "@/components/randki/RandkiEphemeralRoomTimer";
import { randkiPublicHref } from "@/lib/randkiPaths";

export function RandkiRoomRotationBanner({ activeRooms }: { activeRooms: number }) {
  const dayPhase = useRandkiDayPhase();
  const nextMin = minutesUntilNextRotation();
  const slotEnd = slotExpiresAt().toISOString();

  return (
    <div className="randki-rotation-banner mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-violet-500/20 bg-violet-950/30 px-4 py-2.5">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-violet-200/80">
          Spotkania chwilowe · {dayPhase.label}
        </p>
        <p className="mt-0.5 text-[12px] text-white/55">
          Pokoje trwają 30 min, 2 h, wieczór lub do wschodu — potem znikają.{" "}
          <Link href={randkiPublicHref("/gosc")} className="text-violet-300 underline-offset-2 hover:underline">
            Dołącz bez profilu →
          </Link>
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="min-w-[140px]">
          <RandkiEphemeralRoomTimer expiresAt={slotEnd} durationLabel={`${ROTATION_SLOT_MINUTES} min`} compact />
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold tabular-nums text-white/90">{activeRooms}</p>
          <p className="text-[9px] text-white/40">aktywnych teraz</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-black/25 px-2.5 py-1.5">
          <p className="text-[10px] font-medium text-violet-200/90">następna rotacja</p>
          <p className="text-sm font-semibold tabular-nums text-white/85">~{nextMin} min</p>
        </div>
      </div>
    </div>
  );
}
