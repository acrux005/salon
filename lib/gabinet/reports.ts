export type GabVisitHistoryReportRow = {
  id: string;
  date: string;
  time: string;
  status: string;
  visitType: string | null;
  patientName: string | null;
  patientPhone: string | null;
  staffName: string | null;
  notes: string | null;
};

export type GabVisitStats = {
  total: number;
  completed: number;
  cancelled: number;
  planned: number;
  confirmed: number;
  noshow: number;
};

export function computeGabVisitStats(rows: GabVisitHistoryReportRow[]): GabVisitStats {
  const stats: GabVisitStats = {
    total: rows.length,
    completed: 0,
    cancelled: 0,
    planned: 0,
    confirmed: 0,
    noshow: 0,
  };
  for (const r of rows) {
    if (r.status === "completed") stats.completed++;
    else if (r.status === "cancelled") stats.cancelled++;
    else if (r.status === "planned") stats.planned++;
    else if (r.status === "confirmed") stats.confirmed++;
    else if (r.status === "noshow") stats.noshow++;
  }
  return stats;
}
