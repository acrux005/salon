import { describe, expect, it } from "vitest";
import { computeGabVisitStats } from "@/lib/gabinet/reports";

describe("computeGabVisitStats", () => {
  it("counts statuses", () => {
    const stats = computeGabVisitStats([
      { id: "1", date: "2026-01-01", time: "10:00", status: "completed", visitType: null, patientName: "A", patientPhone: null, staffName: null, notes: null },
      { id: "2", date: "2026-01-02", time: "11:00", status: "cancelled", visitType: null, patientName: "B", patientPhone: null, staffName: null, notes: null },
      { id: "3", date: "2026-01-03", time: "12:00", status: "planned", visitType: null, patientName: "C", patientPhone: null, staffName: null, notes: null },
    ]);
    expect(stats.total).toBe(3);
    expect(stats.completed).toBe(1);
    expect(stats.cancelled).toBe(1);
    expect(stats.planned).toBe(1);
  });
});
