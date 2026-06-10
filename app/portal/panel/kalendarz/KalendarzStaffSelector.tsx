"use client";

import { useState } from "react";
import { PanelKalendarzClient } from "./PanelKalendarzClient";
import type { StaffRecord } from "@/lib/skinmatch/staffDb";

type Option = { label: string; staffId: string | null };

export function KalendarzStaffSelector({
  clinicSlug,
  staff,
  noOrderDays = [],
}: {
  clinicSlug: string;
  clinicCosmoStaffId?: number | null;
  staff: StaffRecord[];
  noOrderDays?: string[];
}) {
  const options: Option[] = [{ label: "Wszyscy pracownicy", staffId: null }];
  staff.forEach((s) => {
    options.push({ label: s.name, staffId: s.id });
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = options[selectedIndex] ?? options[0];
  const effectiveStaffId = selected?.staffId ?? undefined;

  return (
    <>
      <div className="mb-6">
        <label htmlFor="kalendarz-staff" className="block text-[14px] font-medium text-[#6F5E64]">
          Pracownik
        </label>
        <select
          id="kalendarz-staff"
          value={selectedIndex}
          onChange={(e) => {
            const idx = parseInt(e.target.value, 10);
            if (idx >= 0 && options[idx]) setSelectedIndex(idx);
          }}
          className="mt-1.5 w-full max-w-sm rounded-xl border border-neutral-200 bg-white px-4 py-3 font-[var(--font-sans)] text-[15px] text-[#1F1A1C] focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
        >
          {options.map((opt, idx) => (
            <option key={idx} value={idx}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <PanelKalendarzClient
        clinicSlug={clinicSlug}
        staffId={effectiveStaffId}
        noOrderDays={noOrderDays}
      />
    </>
  );
}
