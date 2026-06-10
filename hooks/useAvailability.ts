"use client";

import { useState, useCallback } from "react";

export type Slot = {
  start: string;
  end: string;
  available: boolean;
  id: string;
};

export type DaySlots = {
  date: string;
  slots: Slot[];
  closed?: boolean;
};

type Status = "idle" | "loading" | "success" | "error";

const BASE = typeof window !== "undefined" ? (process.env.NEXT_PUBLIC_BASE_PATH ?? "") : "";

export function useAvailability(
  gabinetSlug: string | undefined,
  staffId?: number | string | null,
  treatmentId?: string | null
) {
  const [status, setStatus] = useState<Status>("idle");
  const [data, setData] = useState<DaySlots[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchRange = useCallback(
    async (from: string, to: string) => {
      if (!gabinetSlug?.trim()) {
        setError("Brak wybranego gabinetu");
        setStatus("error");
        return;
      }
      setStatus("loading");
      setError(null);
      try {
        const params = new URLSearchParams({
          gabinetSlug: gabinetSlug.trim(),
          from,
          to,
        });
        if (staffId != null && staffId !== "") {
          params.set("staffId", String(staffId));
        }
        if (treatmentId?.trim()) {
          params.set("treatmentId", treatmentId.trim());
        }
        const res = await fetch(`${BASE}/api/availability?${params}`);
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body?.error ?? `HTTP ${res.status}`);
        }
        const json: DaySlots[] = await res.json();
        setData(Array.isArray(json) ? json : []);
        setStatus("success");
      } catch (e) {
        const message = e instanceof Error ? e.message : "Nie udało się pobrać terminów";
        setError(message);
        setStatus("error");
        setData(null);
        console.error("[useAvailability]", e);
      }
    },
    [gabinetSlug, staffId, treatmentId]
  );

  const getSlotsForDate = useCallback(
    (dateStr: string): Slot[] => {
      if (!data) return [];
      const day = data.find((d) => d.date === dateStr);
      return day?.slots?.filter((s) => s.available) ?? [];
    },
    [data]
  );

  const isClosedDate = useCallback(
    (dateStr: string): boolean => {
      if (!data) return false;
      const day = data.find((d) => d.date === dateStr);
      return Boolean(day?.closed);
    },
    [data]
  );

  return { status, data, error, fetchRange, getSlotsForDate, isClosedDate };
}
