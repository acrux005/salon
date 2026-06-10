"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  markPreventionItemDoneAction,
  skipPreventionItemAction,
  togglePetPreventionPlanAction,
} from "@/app/actions/vetPrevention";
import type { PreventionChecklistSummary, PreventionChecklistRow } from "@/lib/vet/preventionEngine";
import { catLifestyleLabel, normalizeCatLifestyle } from "@/lib/vet/catLifestyle";
import { preventionKindUi } from "@/lib/vet/preventionKindUi";

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
    case "skipped":
      return "bg-gray-100 text-gray-600";
    default:
      return "bg-wet-teal-50 text-wet-teal-800";
  }
}

export function WetPreventionPlanPanel({
  petId,
  species,
  checklist,
  planDisabled,
  catLifestyle,
  birthDate,
}: {
  petId: string;
  species: string;
  checklist: PreventionChecklistSummary;
  planDisabled: boolean;
  catLifestyle?: string | null;
  birthDate?: string | null;
}) {
  const router = useRouter();
  const [msg, setMsg] = useState("");
  const [loadingKey, setLoadingKey] = useState<string | null>(null);
  const [markKey, setMarkKey] = useState<string | null>(null);
  const [doneDate, setDoneDate] = useState(() => new Date().toISOString().slice(0, 10));

  const hasPlan = !!checklist.planId && checklist.items.length > 0;

  async function handleTogglePlan() {
    setMsg("");
    const result = await togglePetPreventionPlanAction(petId, !planDisabled);
    if (!result.ok) {
      setMsg(result.error);
      return;
    }
    router.refresh();
  }

  async function handleMarkDone(itemKey: string) {
    setLoadingKey(itemKey);
    setMsg("");
    const fd = new FormData();
    fd.set("petId", petId);
    fd.set("itemKey", itemKey);
    fd.set("doneAt", doneDate);
    const result = await markPreventionItemDoneAction(fd);
    setLoadingKey(null);
    if (!result.ok) {
      setMsg(result.error);
      return;
    }
    setMarkKey(null);
    router.refresh();
  }

  async function handleSkip(itemKey: string) {
    setLoadingKey(itemKey);
    setMsg("");
    const fd = new FormData();
    fd.set("petId", petId);
    fd.set("itemKey", itemKey);
    const result = await skipPreventionItemAction(fd);
    setLoadingKey(null);
    if (!result.ok) {
      setMsg(result.error);
      return;
    }
    router.refresh();
  }

  if (!hasPlan) {
    return (
      <section className="mb-8 rounded-xl border border-wet-teal-100 bg-wet-teal-50/30 px-4 py-4 text-[14px] text-wet-navy-muted">
        Brak gotowego planu profilaktyki dla tego gatunku. Ustal indywidualny protokół z właścicielem.
      </section>
    );
  }

  return (
    <section className="mb-8">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-wet-navy">Plan profilaktyki</h3>
          <p className="mt-1 text-[13px] text-wet-navy-muted">
            {checklist.planLabel}
            {checklist.lifeStage ? ` · ${checklist.lifeStage}` : ""}
            {checklist.ageWeeks != null ? ` · ${checklist.ageWeeks} tyg.` : " · brak daty urodzenia"}
            {species === "kot" && normalizeCatLifestyle(catLifestyle) ? ` · ${catLifestyleLabel(catLifestyle)}` : ""}
          </p>
          {!birthDate && (
            <p className="mt-1 text-[12px] text-amber-700">
              Uzupełnij datę urodzenia — plan pokaże tylko pozycje bez ograniczeń wiekowych.
            </p>
          )}
          {species === "kot" && normalizeCatLifestyle(catLifestyle) === "outdoor" && (
            <p className="mt-1 text-[12px] text-wet-navy-muted">
              Kot wychodzący — ukryte badania laboratoryjne (testy krwi, morfologia).
            </p>
          )}
          {species === "kot" && normalizeCatLifestyle(catLifestyle) === "indoor" && (
            <p className="mt-1 text-[12px] text-wet-navy-muted">
              Kot domowy — ukryta profilaktyka typowa dla wychodzących (pchły, FeLV, wścieklizna).
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/wet/panel/profilaktyka"
            className="rounded-lg border border-wet-teal-200 px-3 py-1.5 text-[13px] font-medium text-wet-teal hover:bg-wet-teal-50"
          >
            Wytyczne
          </Link>
          <button
            type="button"
            onClick={handleTogglePlan}
            className="rounded-lg border border-wet-teal-200 px-3 py-1.5 text-[13px] font-medium text-wet-navy-muted hover:bg-wet-teal-50"
          >
            {planDisabled ? "Włącz plan" : "Wyłącz plan"}
          </button>
        </div>
      </div>

      {planDisabled ? (
        <p className="rounded-xl border border-wet-teal-100 bg-white px-4 py-4 text-[14px] text-wet-navy-muted">
          Plan profilaktyki wyłączony dla tego zwierzęcia.
        </p>
      ) : (
        <>
          <div className="mb-4 flex flex-wrap gap-2 text-[13px]">
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 font-medium text-emerald-800">
              ✓ {checklist.done}/{checklist.total}
            </span>
            {checklist.overdue > 0 && (
              <span className="rounded-full bg-red-100 px-2.5 py-0.5 font-medium text-red-800">
                Zaległe: {checklist.overdue}
              </span>
            )}
            {checklist.dueSoon > 0 && (
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 font-medium text-amber-800">
                Wkrótce: {checklist.dueSoon}
              </span>
            )}
          </div>

          {!checklist.ageWeeks && checklist.total > 0 && (
            <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[13px] text-amber-800">
              Uzupełnij datę urodzenia, aby dokładniej wyliczyć terminy szczepień i badań.
            </p>
          )}

          <ul className="space-y-2">
            {checklist.items.map((item) => {
              const kind = preventionKindUi(item.kind);
              return (
                <li
                  key={item.key}
                  className="rounded-xl border border-wet-teal-100 bg-white px-4 py-3 shadow-sm shadow-slate-100/60"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${kind.badgeClass}`}
                        >
                          <span aria-hidden>{kind.emoji}</span>
                          {kind.label}
                        </span>
                        <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${statusBadgeClass(item.status)}`}>
                          {item.statusLabel}
                        </span>
                      </div>
                      <p className="mt-2 font-medium text-wet-navy">{item.title}</p>
                      {item.description && (
                        <p className="mt-0.5 line-clamp-2 text-[12px] text-wet-navy-muted">{item.description}</p>
                      )}
                      <p className="mt-1.5 text-[12px] text-wet-navy-muted">
                        Termin: {item.dueAt ? formatDate(item.dueAt) : item.doneAt ? formatDate(item.doneAt) : "—"}
                        {item.progress ? ` · ${item.progress}` : ""}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      {item.kind === "szczepienie" && item.status !== "done" && item.status !== "skipped" ? (
                        <Link
                          href={`/wet/panel/szczepienia?petId=${petId}`}
                          className="text-[13px] font-medium text-wet-teal hover:underline"
                        >
                          Zapisz szczepienie
                        </Link>
                      ) : item.status === "done" || item.status === "skipped" ? null : markKey === item.key ? (
                        <div className="flex flex-col items-end gap-1">
                          <input
                            type="date"
                            className="wet-input text-[12px]"
                            value={doneDate}
                            onChange={(e) => setDoneDate(e.target.value)}
                          />
                          <div className="flex gap-1">
                            <button
                              type="button"
                              disabled={loadingKey === item.key}
                              onClick={() => handleMarkDone(item.key)}
                              className="text-[12px] font-medium text-wet-teal hover:underline"
                            >
                              Zapisz
                            </button>
                            <button type="button" onClick={() => setMarkKey(null)} className="text-[12px] text-wet-navy-muted hover:underline">
                              Anuluj
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-end gap-1">
                          <button
                            type="button"
                            disabled={loadingKey === item.key}
                            onClick={() => setMarkKey(item.key)}
                            className="text-[13px] font-medium text-wet-teal hover:underline"
                          >
                            Oznacz wykonane
                          </button>
                          {item.priority === "opcjonalne" && (
                            <button
                              type="button"
                              disabled={loadingKey === item.key}
                              onClick={() => handleSkip(item.key)}
                              className="text-[12px] text-wet-navy-muted hover:underline"
                            >
                              Pomiń
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}

      {msg && <p className="mt-2 text-[13px] text-red-600">{msg}</p>}
    </section>
  );
}
