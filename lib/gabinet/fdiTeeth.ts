/** Numery zębów wg FDI (dorosły) + stany kolorów na diagramie. */

export type FdiQuadrant = "upper-right" | "upper-left" | "lower-left" | "lower-right";

export type FdiToothState = "healthy" | "planned" | "in_progress" | "done" | "cancelled";

export const FDI_QUADRANTS: { id: FdiQuadrant; label: string; teeth: number[] }[] = [
  { id: "upper-right", label: "Góra prawa", teeth: [18, 17, 16, 15, 14, 13, 12, 11] },
  { id: "upper-left", label: "Góra lewa", teeth: [21, 22, 23, 24, 25, 26, 27, 28] },
  { id: "lower-left", label: "Dół lewa", teeth: [38, 37, 36, 35, 34, 33, 32, 31] },
  { id: "lower-right", label: "Dół prawa", teeth: [41, 42, 43, 44, 45, 46, 47, 48] },
];

export const ALL_FDI_TEETH = FDI_QUADRANTS.flatMap((q) => q.teeth);

export const FDI_TOOTH_STATE_STYLES: Record<
  FdiToothState,
  { className: string; label: string; dotClass: string }
> = {
  healthy: {
    className: "border border-slate-200 bg-slate-50 text-gab-navy",
    label: "Bez zabiegu",
    dotClass: "bg-slate-300",
  },
  planned: {
    className: "border border-sky-400 bg-sky-100 text-sky-900",
    label: "Zaplanowany",
    dotClass: "bg-sky-500",
  },
  in_progress: {
    className: "border border-amber-500 bg-amber-100 text-amber-900",
    label: "W trakcie",
    dotClass: "bg-amber-500",
  },
  done: {
    className: "border border-green-600 bg-green-100 text-green-900",
    label: "Wykonany",
    dotClass: "bg-green-600",
  },
  cancelled: {
    className: "border border-red-300 bg-red-50 text-red-700 line-through",
    label: "Anulowany",
    dotClass: "bg-red-400",
  },
};

export const FDI_STATE_LEGEND: FdiToothState[] = [
  "planned",
  "in_progress",
  "done",
  "cancelled",
];

const STATE_PRIORITY: Record<FdiToothState, number> = {
  healthy: 0,
  cancelled: 1,
  planned: 2,
  in_progress: 3,
  done: 4,
};

export function isValidFdiTooth(value: string | null | undefined): boolean {
  if (!value?.trim()) return true;
  const n = parseInt(value, 10);
  return ALL_FDI_TEETH.includes(n);
}

export function formatFdiLabel(tooth: string | null | undefined): string {
  if (!tooth?.trim()) return "—";
  return `Ząb ${tooth}`;
}

export function itemStatusToFdiState(status: string): FdiToothState {
  switch (status) {
    case "done":
      return "done";
    case "in_progress":
      return "in_progress";
    case "cancelled":
      return "cancelled";
    default:
      return "planned";
  }
}

/** Mapa zęb → dominujący stan (z etapów planu). */
export function buildToothStateMap(
  items: { toothFdi: string | null; status: string }[]
): Record<string, FdiToothState> {
  const map: Record<string, FdiToothState> = {};
  for (const item of items) {
    if (!item.toothFdi?.trim()) continue;
    const tooth = item.toothFdi.trim();
    const next = itemStatusToFdiState(item.status);
    const prev = map[tooth] ?? "healthy";
    if (STATE_PRIORITY[next] >= STATE_PRIORITY[prev]) {
      map[tooth] = next;
    }
  }
  return map;
}

export function getToothState(
  tooth: number | string,
  toothStates?: Record<string, FdiToothState>
): FdiToothState {
  return toothStates?.[String(tooth)] ?? "healthy";
}

export const PLAN_STATUS_LABELS: Record<string, string> = {
  draft: "Szkic",
  pending_acceptance: "Oczekuje na akceptację",
  accepted: "Zaakceptowany",
  rejected: "Odrzucony przez pacjenta",
  in_progress: "Realizacja",
  completed: "Zakończony",
  cancelled: "Anulowany",
};
