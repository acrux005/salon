import type { PreventionKind } from "@/lib/vet/preventionPlans";

export type PreventionKindUi = {
  emoji: string;
  label: string;
  badgeClass: string;
};

export const PREVENTION_KIND_UI: Record<PreventionKind, PreventionKindUi> = {
  szczepienie: { emoji: "💉", label: "Szczepienie", badgeClass: "bg-blue-50 text-blue-800 ring-blue-100" },
  odrobaczanie: { emoji: "🪱", label: "Odrobaczanie", badgeClass: "bg-violet-50 text-violet-800 ring-violet-100" },
  badanie: { emoji: "🩺", label: "Badanie", badgeClass: "bg-teal-50 text-teal-800 ring-teal-100" },
  kontrola: { emoji: "📋", label: "Kontrola", badgeClass: "bg-slate-50 text-slate-800 ring-slate-200" },
  profilaktyka: { emoji: "🦷", label: "Profilaktyka", badgeClass: "bg-emerald-50 text-emerald-800 ring-emerald-100" },
};

export function preventionKindUi(kind: PreventionKind): PreventionKindUi {
  return PREVENTION_KIND_UI[kind] ?? PREVENTION_KIND_UI.profilaktyka;
}
