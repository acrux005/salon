"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deletePetHistoryEntryAction } from "@/app/actions/vetPetHistory";
import type { PetTimelineEvent } from "@/lib/vet/petTimeline";
import { petHistoryDeleteConfirmMessage } from "@/lib/vet/petHistoryDelete";

export function WetPetTimeline({
  petId,
  events,
  limit = 12,
}: {
  petId: string;
  events: PetTimelineEvent[];
  limit?: number;
}) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const visible = events.slice(0, limit);

  async function handleDelete(event: PetTimelineEvent) {
    if (!confirm(petHistoryDeleteConfirmMessage(event.type))) return;
    setDeletingId(event.id);
    setError("");
    const res = await deletePetHistoryEntryAction(petId, event.id);
    setDeletingId(null);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    router.refresh();
  }

  if (visible.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-wet-teal-200 bg-wet-teal-50/20 px-6 py-10 text-center">
        <p className="text-2xl" aria-hidden>
          📅
        </p>
        <p className="mt-2 font-medium text-wet-navy">Brak wpisów w historii</p>
        <p className="mt-1 text-[13px] text-wet-navy-muted">
          Szczepienia, wizyty i przypomnienia pojawią się tutaj automatycznie.
        </p>
      </div>
    );
  }

  return (
    <div>
      {error && <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-[13px] text-red-700">{error}</p>}
      <ol className="relative space-y-0 border-l-2 border-wet-teal-100 pl-6">
        {visible.map((event, index) => (
          <li key={event.id} className={`relative pb-6 ${index === visible.length - 1 ? "pb-0" : ""}`}>
            <span
              className="absolute -left-[calc(0.75rem+1px)] flex h-6 w-6 items-center justify-center rounded-full bg-white text-[13px] ring-2 ring-wet-teal-100"
              aria-hidden
            >
              {event.emoji}
            </span>
            <div className="rounded-xl border border-wet-teal-100 bg-white px-4 py-3 shadow-sm shadow-slate-100/80">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-medium text-wet-teal-700">
                    {event.dateLabel}
                    {event.timeLabel ? ` · ${event.timeLabel}` : ""}
                  </p>
                  <p className="mt-0.5 font-semibold text-wet-navy">{event.title}</p>
                  {event.subtitle && <p className="mt-0.5 text-[13px] text-wet-navy-muted">{event.subtitle}</p>}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {event.meta && (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                      {event.meta}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(event)}
                    disabled={deletingId === event.id}
                    className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                    aria-label="Usuń wpis z historii"
                    title="Usuń"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
