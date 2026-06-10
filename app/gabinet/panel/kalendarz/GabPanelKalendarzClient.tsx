"use client";

import { useState } from "react";
import { GabCalendarClient } from "@/components/gabinet/GabCalendarClient";

export function GabPanelKalendarzClient({
  gabSlug,
  staff,
}: {
  gabSlug: string;
  staff: { id: string; name: string }[];
}) {
  const [staffId, setStaffId] = useState(staff[0]?.id ?? "");

  return (
    <>
      {staff.length > 1 && (
        <div className="mb-6 px-4 lg:px-8">
          <label className="block text-[14px] font-medium text-gab-navy">Personel</label>
          <select
            value={staffId}
            onChange={(e) => setStaffId(e.target.value)}
            className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-[15px]"
          >
            {staff.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </div>
      )}
      <div className="px-4 lg:px-8">
        <GabCalendarClient gabSlug={gabSlug} staffIdParam={staffId || undefined} />
      </div>
    </>
  );
}
