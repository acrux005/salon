"use client";

import { useState } from "react";
import { ClinicCalendarClient } from "./ClinicCalendarClient";
import { ReservationsList } from "./ReservationsList";

export function PanelKalendarzClient({
  clinicSlug,
  staffId,
  noOrderDays = [],
}: {
  clinicSlug: string;
  cosmoStaffId?: number | null;
  staffId?: string;
  noOrderDays?: string[];
}) {
  const [listRefreshKey, setListRefreshKey] = useState(0);
  const staffIdParam = staffId ?? undefined;

  return (
    <>
      <div className="mt-8">
        <ClinicCalendarClient
          clinicSlug={clinicSlug}
          staffIdParam={staffIdParam}
          noOrderDays={noOrderDays}
          onAfterUpdate={() => setListRefreshKey((k) => k + 1)}
        />
      </div>
      <div className="mt-8">
        <ReservationsList
          clinicSlug={clinicSlug}
          staffIdParam={staffIdParam}
          refreshTrigger={listRefreshKey}
        />
      </div>
    </>
  );
}
