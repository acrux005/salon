import { describe, expect, it } from "vitest";
import { buildGabPatientCalendarIcs } from "@/lib/gabinet/ical";

describe("buildGabPatientCalendarIcs", () => {
  it("generates valid VCALENDAR with events", () => {
    const ics = buildGabPatientCalendarIcs({
      calendarName: "Test",
      slotDurationMinutes: 30,
      appointments: [
        {
          id: "a1",
          date: "2026-06-01",
          time: "10:00",
          status: "confirmed",
          visitType: "konsultacja",
          patientName: "Jan",
          clinicName: "Gabinet Test",
          staffName: "Dr Kowalski",
          notes: null,
        },
      ],
    });
    expect(ics).toContain("BEGIN:VCALENDAR");
    expect(ics).toContain("BEGIN:VEVENT");
    expect(ics).toContain("Gabinet Test");
    expect(ics).toContain("END:VCALENDAR");
  });

  it("skips cancelled appointments", () => {
    const ics = buildGabPatientCalendarIcs({
      calendarName: "Test",
      slotDurationMinutes: 30,
      appointments: [
        {
          id: "a2",
          date: "2026-06-02",
          time: "11:00",
          status: "cancelled",
          visitType: null,
          patientName: "Jan",
          clinicName: "Gabinet",
          staffName: null,
          notes: null,
        },
      ],
    });
    expect(ics).not.toContain("BEGIN:VEVENT");
  });
});
