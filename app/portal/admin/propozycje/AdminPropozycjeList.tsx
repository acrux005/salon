"use client";

import { useRouter } from "next/navigation";
import {
  approveClinicTreatmentRequestAction,
  rejectClinicTreatmentRequestAction,
} from "@/app/actions/clinicTreatmentRequest";
import { PROBLEM_LABELS } from "@/content/clinicDemo";
import type { ClinicTreatmentRequestRow } from "@/lib/clinicTreatmentRequestTypes";
import { parseRequestProblemIds } from "@/lib/clinicTreatmentRequestTypes";

type Props = {
  className?: string;
  initialRequests: ClinicTreatmentRequestRow[];
};

export function AdminPropozycjeList({ className = "", initialRequests }: Props) {
  const router = useRouter();

  async function handleApprove(id: string) {
    const result = await approveClinicTreatmentRequestAction(id);
    if (result.ok) router.refresh();
    else alert(result.error);
  }

  async function handleReject(id: string) {
    if (!confirm("Na pewno odrzucić tę propozycję?")) return;
    const result = await rejectClinicTreatmentRequestAction(id);
    if (result.ok) router.refresh();
    else alert(result.error);
  }

  if (initialRequests.length === 0) {
    return (
      <div className={className}>
        <p className="rounded-xl border border-neutral-200 bg-white p-6 text-[15px] text-[#6F5E64]">
          Brak propozycji oczekujących na akceptację.
        </p>
      </div>
    );
  }

  return (
    <ul className={`space-y-4 ${className}`}>
      {initialRequests.map((r) => {
        const problemy = parseRequestProblemIds(r);
        return (
          <li
            key={r.id}
            className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-[#1F1A1C]">{r.nazwa}</p>
                <p className="mt-0.5 text-[14px] text-[#6F5E64]">{r.opis}</p>
                <p className="mt-1 text-[13px] text-neutral-500">
                  {r.czas} min · od {r.cena_od} zł
                  {problemy.length > 0 &&
                    ` · ${problemy.map((p) => PROBLEM_LABELS[p]).join(", ")}`}
                </p>
                {r.clinic && (
                  <p className="mt-1 text-[13px] text-neutral-600">
                    Gabinet: <strong>{r.clinic.name}</strong> (slug: {r.clinic.slug})
                  </p>
                )}
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => handleApprove(r.id)}
                  className="rounded-full bg-green-600 px-4 py-2 text-[14px] font-medium text-white hover:bg-green-700"
                >
                  Akceptuj
                </button>
                <button
                  type="button"
                  onClick={() => handleReject(r.id)}
                  className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-[14px] font-medium text-[#1F1A1C] hover:bg-neutral-50"
                >
                  Odrzuć
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
