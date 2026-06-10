"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { WetVaccinationQuickAddPanel } from "@/components/wet/WetVaccinationQuickAddPanel";
import type { VaccineOption } from "@/lib/vet/vaccinationQuickAddUtils";

export function WetPetVaccinationQuickAdd({
  petId,
  petName,
  petSpecies,
  vaccineTypes,
  ownerSmsConsent,
  ownerEmailConsent,
}: {
  petId: string;
  petName: string;
  petSpecies?: string;
  vaccineTypes: VaccineOption[];
  ownerSmsConsent: boolean;
  ownerEmailConsent: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg bg-wet-teal px-4 py-2 text-[13px] font-semibold text-white shadow-sm shadow-wet-teal/20 hover:bg-teal-700"
      >
        💉 Zapisz szczepienie
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
            aria-label="Zamknij"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-wet-teal-100 bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-wet-navy">Szybkie szczepienie</h3>
                <p className="text-[13px] text-wet-navy-muted">{petName}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-wet-navy-muted hover:text-wet-navy"
                aria-label="Zamknij"
              >
                ✕
              </button>
            </div>
            <WetVaccinationQuickAddPanel
              petId={petId}
              petName={petName}
              petSpecies={petSpecies}
              vaccineTypes={vaccineTypes}
              ownerSmsConsent={ownerSmsConsent}
              ownerEmailConsent={ownerEmailConsent}
              compact
              onSaved={() => {
                setOpen(false);
                router.refresh();
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
