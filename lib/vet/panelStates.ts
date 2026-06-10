/** Spójne kolory statusów w panelu wet. */
export type PanelStateKind = "active" | "overdue" | "urgent" | "neutral" | "noSms";

const STATE_STYLES: Record<
  PanelStateKind,
  { dot: string; badge: string; border: string; bg: string; text: string }
> = {
  active: {
    dot: "bg-green-500",
    badge: "bg-green-100 text-green-800",
    border: "border-green-200",
    bg: "bg-green-50",
    text: "text-green-800",
  },
  overdue: {
    dot: "bg-amber-500",
    badge: "bg-amber-100 text-amber-900",
    border: "border-amber-200",
    bg: "bg-amber-50",
    text: "text-amber-900",
  },
  urgent: {
    dot: "bg-red-500",
    badge: "bg-red-100 text-red-800",
    border: "border-red-200",
    bg: "bg-red-50",
    text: "text-red-800",
  },
  neutral: {
    dot: "bg-slate-300",
    badge: "bg-slate-100 text-slate-600",
    border: "border-slate-200",
    bg: "bg-slate-50",
    text: "text-slate-600",
  },
  noSms: {
    dot: "bg-slate-300",
    badge: "bg-slate-100 text-slate-500",
    border: "border-slate-200",
    bg: "bg-slate-50/80",
    text: "text-slate-500",
  },
};

export function panelStateClasses(kind: PanelStateKind) {
  return STATE_STYLES[kind];
}

export function vaccinationStateKind(nextDueAt: Date, now = new Date()): PanelStateKind {
  const due = nextDueAt.getTime();
  const t = now.getTime();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date(now);
  endOfToday.setHours(23, 59, 59, 999);

  if (due < startOfToday.getTime()) return "overdue";
  if (due >= startOfToday.getTime() && due <= endOfToday.getTime()) return "urgent";
  return "active";
}

export function vaccinationStateLabel(kind: PanelStateKind): string {
  if (kind === "overdue") return "Zaległe";
  if (kind === "urgent") return "Dziś";
  if (kind === "active") return "OK";
  return "—";
}
