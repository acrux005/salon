"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { PreventionChecklistSummary, PreventionChecklistRow } from "@/lib/vet/preventionEngine";
import { PREVENTION_PRIORITY_LABELS, type PreventionPriority } from "@/lib/vet/preventionPlans";
import { buildOwnerClinicBookingUrl, isPhoneBookingUrl } from "@/lib/vet/ownerBooking";

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const d = iso.includes("T") ? new Date(iso) : new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("pl-PL");
}

function statusBadgeClass(status: PreventionChecklistRow["status"]): string {
  switch (status) {
    case "done":
      return "bg-emerald-100 text-emerald-800";
    case "overdue":
      return "bg-red-100 text-red-800";
    case "due_soon":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-wet-teal-50 text-wet-teal-800";
  }
}

const PRIORITY_ORDER: PreventionPriority[] = ["obowiazkowe", "zalecane", "opcjonalne"];

function needsBookingAction(status: PreventionChecklistRow["status"]): boolean {
  return status === "overdue" || status === "due_soon";
}

function PreventionItemRow({
  item,
  bookingUrl,
}: {
  item: PreventionChecklistRow;
  bookingUrl: string | null;
}) {
  const showBook = bookingUrl && needsBookingAction(item.status);

  return (
    <li className="rounded-lg border border-wet-teal-100 px-3 py-2 text-[14px]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium">{item.title}</span>
        <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${statusBadgeClass(item.status)}`}>
          {item.statusLabel}
        </span>
      </div>
      <p className="mt-1 text-[12px] text-wet-navy-muted">{item.description}</p>
      <p className="mt-1 text-[12px] text-wet-navy-muted">
        {item.kindLabel}
        {item.dueAt ? ` · termin ${formatDate(item.dueAt)}` : item.doneAt ? ` · wykonano ${formatDate(item.doneAt)}` : ""}
        {item.progress ? ` · ${item.progress}` : ""}
      </p>
      {showBook && (
        <Link
          href={bookingUrl}
          className="mt-2 inline-block text-[13px] font-medium text-wet-teal hover:underline"
        >
          {isPhoneBookingUrl(bookingUrl) ? "Zadzwoń i umów wizytę" : "Umów wizytę →"}
        </Link>
      )}
    </li>
  );
}

export function WetOwnerPreventionPlan({
  checklist,
  clinicSlug,
  clinicPhone,
  bookingPhoneOnly,
}: {
  checklist: PreventionChecklistSummary;
  clinicSlug?: string | null;
  clinicPhone?: string | null;
  bookingPhoneOnly?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  const bookingUrl = useMemo(() => {
    if (!clinicSlug) return null;
    return buildOwnerClinicBookingUrl({
      slug: clinicSlug,
      phone: clinicPhone,
      bookingPhoneOnly,
    });
  }, [clinicSlug, clinicPhone, bookingPhoneOnly]);

  const grouped = useMemo(() => {
    const groups: Record<PreventionPriority, PreventionChecklistRow[]> = {
      obowiazkowe: [],
      zalecane: [],
      opcjonalne: [],
    };
    for (const item of checklist.items) {
      groups[item.priority].push(item);
    }
    return groups;
  }, [checklist.items]);

  if (!checklist.planId || checklist.items.length === 0) {
    return (
      <section className="mt-6 rounded-xl border border-wet-teal-100 bg-wet-teal-50/30 px-4 py-4 text-[14px] text-wet-navy-muted">
        Plan profilaktyki pojawi się po uzupełnieniu gatunku i daty urodzenia zwierzęcia.
      </section>
    );
  }

  const urgentItems = checklist.items.filter((i) => needsBookingAction(i.status));
  const shown = expanded ? checklist.items : urgentItems.length > 0 ? urgentItems : checklist.items.slice(0, 8);

  return (
    <section className="mt-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-wet-navy">Plan profilaktyki</h2>
          <p className="mt-1 text-[13px] text-wet-navy-muted">
            {checklist.planLabel}
            {checklist.lifeStage ? ` · ${checklist.lifeStage}` : ""}
            {checklist.overdue > 0 ? ` · ${checklist.overdue} zaległe` : ""}
            {checklist.dueSoon > 0 ? ` · ${checklist.dueSoon} wkrótce` : ""}
          </p>
        </div>
        {bookingUrl && (checklist.overdue > 0 || checklist.dueSoon > 0) && (
          <Link href={bookingUrl} className="wet-btn-primary shrink-0 text-[13px]">
            {isPhoneBookingUrl(bookingUrl) ? "Zadzwoń" : "Umów wizytę"}
          </Link>
        )}
      </div>
      <p className="mt-2 text-[12px] text-wet-navy-muted">
        Wytyczne mają charakter informacyjny — protokół ustala lekarz weterynarii. Przypomnienia SMS/e-mail według Twoich
        ustawień powiadomień.
      </p>

      {!checklist.ageWeeks && (
        <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[12px] text-amber-900">
          Uzupełnij datę urodzenia zwierzęcia w gabinecie, aby dokładniej wyliczyć terminy.
        </p>
      )}

      {expanded ? (
        <div className="mt-4 space-y-4">
          {PRIORITY_ORDER.map((priority) => {
            const items = grouped[priority];
            if (items.length === 0) return null;
            return (
              <div key={priority}>
                <h3 className="text-[13px] font-semibold text-wet-navy">{PREVENTION_PRIORITY_LABELS[priority]}</h3>
                <ul className="mt-2 space-y-2">
                  {items.map((item) => (
                    <PreventionItemRow key={item.key} item={item} bookingUrl={bookingUrl} />
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      ) : (
        <ul className="mt-3 space-y-2">
          {shown.map((item) => (
            <PreventionItemRow key={item.key} item={item} bookingUrl={bookingUrl} />
          ))}
        </ul>
      )}

      {checklist.items.length > 8 && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-3 text-[13px] font-medium text-wet-teal hover:underline"
        >
          {expanded ? "Pokaż skrócony widok" : `Pokaż pełny plan (${checklist.items.length} pozycji)`}
        </button>
      )}
    </section>
  );
}
