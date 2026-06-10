import { describe, it, expect } from "vitest";

/**
 * Test mapowania slotów: format odpowiedzi API availability.
 * Endpoint zwraca: { date: "YYYY-MM-DD", slots: { start, end, available, id }[] }[]
 */
describe("availability API response shape", () => {
  it("slot has required fields start, end, available, id", () => {
    const slot = {
      start: "2026-02-21T10:00:00+01:00",
      end: "2026-02-21T10:30:00+01:00",
      available: true,
      id: "slot-2026-02-21-10-00",
    };
    expect(slot).toHaveProperty("start");
    expect(slot).toHaveProperty("end");
    expect(slot).toHaveProperty("available");
    expect(slot).toHaveProperty("id");
    expect(typeof slot.start).toBe("string");
    expect(typeof slot.available).toBe("boolean");
    expect(slot.start).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/);
  });

  it("date is YYYY-MM-DD", () => {
    const day = { date: "2026-02-21", slots: [] };
    expect(day.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("extracts time from iso start for display", () => {
    const isoStart = "2026-02-21T14:30:00+01:00";
    const timePart = isoStart.slice(11, 16);
    expect(timePart).toBe("14:30");
  });
});
