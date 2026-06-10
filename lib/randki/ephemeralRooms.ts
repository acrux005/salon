import type { DayPhase } from "@/lib/randki/dayRhythm";
import { ROTATION_SLOT_MINUTES, getRotationSlotKey } from "@/lib/randki/roomRotation";

export type EphemeralDuration = "slot_30m" | "hours_2" | "evening" | "until_sunrise";

export const EPHEMERAL_DURATION_LABELS: Record<EphemeralDuration, string> = {
  slot_30m: "30 min",
  hours_2: "2 h",
  evening: "do końca wieczoru",
  until_sunrise: "do wschodu",
};

function slotStart(at: Date): Date {
  const d = new Date(at);
  d.setSeconds(0, 0);
  d.setMinutes(Math.floor(d.getMinutes() / ROTATION_SLOT_MINUTES) * ROTATION_SLOT_MINUTES);
  return d;
}

function phaseEnd(phase: DayPhase, at: Date): Date {
  const d = new Date(at);
  d.setSeconds(0, 0);
  switch (phase) {
    case "morning":
      d.setHours(9, 0, 0, 0);
      break;
    case "day":
      d.setHours(17, 0, 0, 0);
      break;
    case "sunset":
      d.setHours(20, 0, 0, 0);
      break;
    case "evening":
      d.setDate(d.getDate() + 1);
      d.setHours(0, 0, 0, 0);
      break;
    case "night": {
      d.setHours(5, 0, 0, 0);
      if (at.getHours() >= 5) d.setDate(d.getDate() + 1);
      break;
    }
  }
  return d;
}

function nextSunrise(at: Date): Date {
  const d = new Date(at);
  d.setHours(5, 0, 0, 0);
  if (at >= d) d.setDate(d.getDate() + 1);
  return d;
}

/** Koniec bieżącego slotu rotacji (30 min). */
export function slotExpiresAt(at = new Date()): Date {
  const start = slotStart(at);
  return new Date(start.getTime() + ROTATION_SLOT_MINUTES * 60 * 1000);
}

export function resolveEphemeralExpiresAt(
  duration: EphemeralDuration,
  phase: DayPhase,
  roomSeed: string,
  at = new Date()
): Date {
  switch (duration) {
    case "slot_30m":
      return slotExpiresAt(at);
    case "hours_2": {
      const start = slotStart(at);
      return new Date(start.getTime() + 2 * 60 * 60 * 1000);
    }
    case "evening":
      return phaseEnd("evening", at);
    case "until_sunrise":
      return nextSunrise(at);
    default:
      return slotExpiresAt(at);
  }
}

export function ephemeralRoomIdFromPool(poolId: string): string {
  return `rotation-${poolId}`;
}

export function parseEphemeralPoolId(accountId: string): string | null {
  if (!accountId.startsWith("rotation-")) return null;
  return accountId.slice("rotation-".length);
}

export function msUntilExpiry(expiresAt: Date | string, at = new Date()): number {
  const exp = typeof expiresAt === "string" ? new Date(expiresAt) : expiresAt;
  return Math.max(0, exp.getTime() - at.getTime());
}

export function isEphemeralExpired(expiresAt: Date | string | null | undefined, at = new Date()): boolean {
  if (!expiresAt) return false;
  return msUntilExpiry(expiresAt, at) <= 0;
}

export function formatEphemeralCountdown(ms: number): string {
  if (ms <= 0) return "0:00";
  const totalSec = Math.ceil(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function ephemeralClosingLabel(ms: number, durationLabel: string): string {
  if (ms <= 0) return "pokój się zamyka";
  const cd = formatEphemeralCountdown(ms);
  return durationLabel === "do wschodu" || durationLabel === "do końca wieczoru"
    ? `zamyka się · ${durationLabel}`
    : `zamyka się za ${cd}`;
}

/** Stabilny klucz sesji pokoju — ten sam slot + faza + id puli. */
export function ephemeralSessionKey(poolId: string, phase: DayPhase, at = new Date()): string {
  return `${getRotationSlotKey(phase, at)}:${poolId}`;
}
