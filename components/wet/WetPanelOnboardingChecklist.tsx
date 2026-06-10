import Link from "next/link";
import { Check, Circle } from "lucide-react";
import type { PanelChecklistItem } from "@/lib/vet/panelChecklist";

export function WetPanelOnboardingChecklist({ items }: { items: PanelChecklistItem[] }) {
  const doneCount = items.filter((i) => i.done).length;
  const allDone = doneCount === items.length;

  if (allDone) return null;

  return (
    <section className="rounded-2xl border border-wet-teal/20 bg-gradient-to-br from-wet-teal-50/80 to-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-[15px] font-bold text-wet-navy">Dokończ konfigurację</h2>
          <p className="mt-1 text-[13px] text-wet-navy-muted">
            {doneCount} z {items.length} zadań — możesz to zrobić w dowolnym momencie.
          </p>
        </div>
        <span className="rounded-full bg-white px-3 py-1 text-[12px] font-semibold tabular-nums text-wet-teal-800 shadow-sm">
          {Math.round((doneCount / items.length) * 100)}%
        </span>
      </div>
      <ul className="mt-4 space-y-2">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] transition ${
                item.done
                  ? "bg-white/60 text-slate-500 line-through"
                  : "bg-white text-wet-navy hover:shadow-sm"
              }`}
            >
              {item.done ? (
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-wet-teal/15 text-wet-teal">
                  <Check className="h-3.5 w-3.5" aria-hidden />
                </span>
              ) : (
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-slate-200 text-slate-300">
                  <Circle className="h-3 w-3" aria-hidden />
                </span>
              )}
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
