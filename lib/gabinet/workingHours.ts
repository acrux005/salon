import type { WorkingHoursDay } from "@/lib/gabinet/schema";

export function parseGabWorkingHours(raw: string | null | undefined): WorkingHoursDay[] | undefined {
  if (!raw) return undefined;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed) && parsed.length === 7) return parsed as WorkingHoursDay[];
  } catch {
    /* ignore */
  }
  return undefined;
}

export function defaultWorkingHoursWeek(): WorkingHoursDay[] {
  return Array(7)
    .fill(null)
    .map(() => ({ open: "08:00", close: "18:00" }));
}
