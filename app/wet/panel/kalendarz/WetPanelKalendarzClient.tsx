"use client";

import { useState } from "react";
import { WetCalendarClient } from "@/components/wet/WetCalendarClient";
import { WetReservationsList } from "@/components/wet/WetReservationsList";

export function WetPanelKalendarzClient({
  vetSlug,
  doctors,
  noOrderDays = [],
}: {
  vetSlug: string;
  doctors: { id: string; name: string }[];
  noOrderDays?: string[];
}) {
  const [staffId, setStaffId] = useState(doctors[0]?.id ?? "");
  const [listRefreshKey, setListRefreshKey] = useState(0);

  return (
    <>
      {doctors.length > 1 && (
        <div className="mb-6">
          <label className="block text-[14px] font-medium text-wet-navy">Lekarz</label>
          <select
            value={staffId}
            onChange={(e) => setStaffId(e.target.value)}
            className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-[15px]"
          >
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      )}
      <WetCalendarClient
        vetSlug={vetSlug}
        staffIdParam={staffId || undefined}
        noOrderDays={noOrderDays}
        onAfterUpdate={() => setListRefreshKey((k) => k + 1)}
      />
      <div className="mt-8">
        <WetReservationsList
          vetSlug={vetSlug}
          staffIdParam={staffId || undefined}
          refreshTrigger={listRefreshKey}
        />
      </div>
    </>
  );
}
