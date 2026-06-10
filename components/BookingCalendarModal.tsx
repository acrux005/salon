"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { pl } from "date-fns/locale";
import { useAvailability, type Slot } from "@/hooks/useAvailability";
import { X } from "lucide-react";

const TIMEZONE = "Europe/Warsaw";
const BASE = typeof window !== "undefined" ? (process.env.NEXT_PUBLIC_BASE_PATH ?? "") : "";
const WEEKDAY_SHORT_PL = ["nd", "pn", "wt", "śr", "czw", "pt", "sob"] as const;

function formatDatePL(date: Date): string {
  return date.toLocaleDateString("pl-PL", { weekday: "short", day: "numeric", month: "long", year: "numeric" });
}

function formatTimePL(isoStart: string): string {
  try {
    const d = new Date(isoStart);
    return d.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit", timeZone: TIMEZONE });
  } catch {
    return isoStart.slice(11, 16);
  }
}

function isoStartToTimeParam(isoStart: string): string {
  try {
    const d = new Date(isoStart);
    const h = d.getHours();
    const m = d.getMinutes();
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  } catch {
    return "09:00";
  }
}

export type BookingCalendarModalProps = {
  open: boolean;
  onClose: () => void;
  clinicSlug: string | undefined;
  /** Domyślny pracownik (Staff.id) — preselekcja w dropdownie. */
  defaultStaffId?: string | number | null;
  /** Opcjonalnie: slug zabiegu (id) do prefill w panelu. */
  serviceSlug?: string;
  /** Dane klienta (zalogowany) — wysyłane do API rezerwacji. */
  clientInfo?: { name?: string; email?: string; phone?: string };
  /** Nazwa gabinetu (do zapisu w panelu klienta). */
  clinicName?: string;
  /** Wywołane po udanej rezerwacji (np. zapis w „Moje rezerwacje”). */
  onBookingSuccess?: (data: { id?: number; clinicSlug: string; clinicName?: string; date: string; time: string; serviceName?: string }) => void;
};

type TreatmentItem = { id: string; nazwa: string };
type StaffItem = { id: string; name: string; cosmoStaffId?: number | null };

export function BookingCalendarModal({ open, onClose, clinicSlug, defaultStaffId, serviceSlug, clientInfo, clinicName, onBookingSuccess }: BookingCalendarModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const treatmentInputRef = useRef<HTMLInputElement>(null);
  const treatmentListRef = useRef<HTMLDivElement>(null);
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [selectedTreatmentId, setSelectedTreatmentId] = useState<string>("");
  const [selectedTreatmentName, setSelectedTreatmentName] = useState<string>("");
  const [treatmentSearch, setTreatmentSearch] = useState("");
  const [treatmentDropdownOpen, setTreatmentDropdownOpen] = useState(false);
  const [treatments, setTreatments] = useState<TreatmentItem[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState<string>("");
  const [staff, setStaff] = useState<StaffItem[]>([]);
  const [treatmentsLoading, setTreatmentsLoading] = useState(false);
  const [staffLoading, setStaffLoading] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [month, setMonth] = useState<Date>(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const effectiveStaffId = selectedStaffId !== "" ? selectedStaffId : (defaultStaffId ?? undefined);
  const requiresStaffSelection = staff.length > 0 && (effectiveStaffId == null || effectiveStaffId === "");
  const { status, data, fetchRange, getSlotsForDate, isClosedDate } = useAvailability(clinicSlug, effectiveStaffId, selectedTreatmentId || null);
  const [treatmentBlockedForStaff, setTreatmentBlockedForStaff] = useState(false);
  const [treatmentCheckLoading, setTreatmentCheckLoading] = useState(false);

  useEffect(() => {
    if (!clinicSlug || !selectedTreatmentId || effectiveStaffId == null || effectiveStaffId === "") {
      setTreatmentBlockedForStaff(false);
      return;
    }
    setTreatmentCheckLoading(true);
    const params = new URLSearchParams({ clinicSlug, treatmentId: selectedTreatmentId });
    if (effectiveStaffId != null && effectiveStaffId !== "") params.set("staffId", String(effectiveStaffId));
    fetch(`${BASE}/api/booking/check-treatment?${params}`)
      .then((r) => r.json())
      .then((data) => setTreatmentBlockedForStaff(data.allowed === false))
      .catch(() => setTreatmentBlockedForStaff(false))
      .finally(() => setTreatmentCheckLoading(false));
  }, [clinicSlug, selectedTreatmentId, effectiveStaffId, staff]);

  // Zabiegi tylko oferowane przez ten gabinet; gdy wybrano pracownika — tylko te, które może wykonać.
  useEffect(() => {
    if (!open || !clinicSlug) return;
    setTreatmentsLoading(true);
    const params = new URLSearchParams({ clinicSlug });
    if (effectiveStaffId != null && effectiveStaffId !== "") params.set("staffId", String(effectiveStaffId));
    fetch(`${BASE}/api/booking/clinic-treatments?${params}`)
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data?.items) ? data.items : [];
        setTreatments(list);
        const ids = new Set(list.map((t: TreatmentItem) => t.id));
        if (serviceSlug && list.length) {
          const byId = list.find((t: TreatmentItem) => t.id === serviceSlug);
          if (byId) {
            setSelectedTreatmentId(byId.id);
            setSelectedTreatmentName(byId.nazwa);
          } else {
            setSelectedTreatmentId("");
            setSelectedTreatmentName("");
          }
        }
        setSelectedTreatmentId((prev) => {
          if (!prev || ids.has(prev)) return prev;
          setSelectedTreatmentName("");
          return "";
        });
        setTreatmentBlockedForStaff(false);
      })
      .catch(() => setTreatments([]))
      .finally(() => setTreatmentsLoading(false));
  }, [open, clinicSlug, serviceSlug, effectiveStaffId]);

  // Pracownicy z panelu gabinetu (wszyscy, także bez ID Cosmo).
  useEffect(() => {
    if (!open || !clinicSlug) return;
    setStaffLoading(true);
    fetch(`${BASE}/api/booking/clinic-staff?clinicSlug=${encodeURIComponent(clinicSlug)}`)
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.items ?? [];
        const staffList = Array.isArray(list) ? list : [];
        setStaff(staffList);
        if (defaultStaffId != null) {
          if (typeof defaultStaffId === "string") {
            const byId = staffList.find((s: StaffItem) => s.id === defaultStaffId);
            if (byId) setSelectedStaffId(byId.id);
          } else if (typeof defaultStaffId === "number") {
            const byId = staffList.find((s: StaffItem) => s.cosmoStaffId === defaultStaffId);
            if (byId) setSelectedStaffId(byId.id);
          }
        }
      })
      .catch(() => setStaff([]))
      .finally(() => setStaffLoading(false));
  }, [open, clinicSlug, defaultStaffId]);

  useEffect(() => {
    if (!open || !clinicSlug) return;
    setBookingStatus("idle");
    setBookingError(null);
    const from = new Date(month);
    from.setDate(1);
    const to = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    fetchRange(from.toISOString().slice(0, 10), to.toISOString().slice(0, 10));
  }, [open, clinicSlug, month.getFullYear(), month.getMonth(), fetchRange]);

  const selectedDateStr = selectedDay
    ? `${selectedDay.getFullYear()}-${String(selectedDay.getMonth() + 1).padStart(2, "0")}-${String(selectedDay.getDate()).padStart(2, "0")}`
    : "";
  const slotsForDay = selectedDateStr ? getSlotsForDate(selectedDateStr) : [];
  const closedDateMatchers = (data ?? [])
    .filter((d) => d.closed)
    .map((d) => new Date(`${d.date}T12:00:00`));

  useEffect(() => {
    if (!selectedDay) return;
    const dateStr = `${selectedDay.getFullYear()}-${String(selectedDay.getMonth() + 1).padStart(2, "0")}-${String(selectedDay.getDate()).padStart(2, "0")}`;
    if (!isClosedDate(dateStr)) return;
    setSelectedDay(undefined);
    setSelectedSlot(null);
  }, [selectedDay, isClosedDate]);

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, handleEscape]);

  useEffect(() => {
    if (open && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [open]);

  const handleConfirm = async () => {
    if (!selectedSlot || !selectedDay || !clinicSlug) return;
    if (requiresStaffSelection) {
      setBookingError("Wybierz pracownika, aby zarezerwować termin.");
      setBookingStatus("error");
      return;
    }
    const dateStr = `${selectedDay.getFullYear()}-${String(selectedDay.getMonth() + 1).padStart(2, "0")}-${String(selectedDay.getDate()).padStart(2, "0")}`;
    const timeStr = isoStartToTimeParam(selectedSlot.start);
    setBookingStatus("submitting");
    setBookingError(null);
    try {
      const res = await fetch(`${BASE}/api/booking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clinicSlug,
          date: dateStr,
          time: timeStr,
          ...(selectedTreatmentId && { treatmentId: selectedTreatmentId, treatmentName: selectedTreatmentName }),
          ...(effectiveStaffId != null && { staffId: effectiveStaffId }),
          ...(clientInfo?.name && { name: clientInfo.name }),
          ...(clientInfo?.email && { email: clientInfo.email }),
          ...(clientInfo?.phone && { phone: clientInfo.phone }),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { id?: number; error?: string };
      if (!res.ok) {
        setBookingError(data.error ?? "Nie udało się zarezerwować terminu.");
        setBookingStatus("error");
        return;
      }
      setBookingStatus("success");
      onBookingSuccess?.({ id: data.id, clinicSlug, clinicName, date: dateStr, time: timeStr, serviceName: selectedTreatmentName || undefined });
    } catch {
      setBookingError("Błąd połączenia. Spróbuj ponownie.");
      setBookingStatus("error");
    }
  };

  if (!open) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-calendar-title"
      aria-describedby="booking-calendar-desc"
    >
      <div
        className="absolute inset-0 bg-black/50"
        aria-hidden="true"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-neutral-200 bg-white shadow-xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-3">
          <h2 id="booking-calendar-title" className="font-[var(--font-sans)] text-lg font-semibold text-[#1F1A1C]">
            Dostępne terminy
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[#6F5E64] hover:bg-neutral-100 hover:text-[#1F1A1C] focus:outline-none focus:ring-2 focus:ring-pink-500"
            aria-label="Zamknij"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>
        <p id="booking-calendar-desc" className="sr-only">
          Wybierz pracownika (opcjonalnie), zabieg (opcjonalnie), dzień i godzinę. Rezerwacja zostanie zapisana w kalendarzu gabinetu.
        </p>
        <div className="p-4">
          {staff.length > 0 && (
            <div className="mb-4">
              <label htmlFor="booking-staff" className="block text-[14px] font-medium text-[#6F5E64]">
                Pracownik
              </label>
              <select
                id="booking-staff"
                value={selectedStaffId === "" ? "" : selectedStaffId}
                onChange={(e) => {
                  setSelectedStaffId(e.target.value === "" ? "" : e.target.value);
                  setSelectedDay(undefined);
                  setSelectedSlot(null);
                  setBookingError(null);
                  setBookingStatus("idle");
                }}
                disabled={staffLoading}
                className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 font-[var(--font-sans)] text-[15px] text-[#1F1A1C] focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 disabled:opacity-60"
              >
                <option value="">— wybierz pracownika —</option>
                {staff.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              {requiresStaffSelection && (
                <p className="mt-2 text-[13px] text-amber-700">
                  Wybierz pracownika, aby sprawdzić godziny i potwierdzić rezerwację.
                </p>
              )}
            </div>
          )}
          <div className="mb-4 relative">
            <label htmlFor="booking-treatment" className="block text-[14px] font-medium text-[#6F5E64]">
              Zabieg <span className="text-neutral-400 font-normal">(opcjonalnie)</span>
            </label>
            <div className="mt-1.5 relative">
              <input
                ref={treatmentInputRef}
                id="booking-treatment"
                type="text"
                value={selectedTreatmentId ? selectedTreatmentName : treatmentSearch}
                onChange={(e) => {
                  setTreatmentSearch(e.target.value);
                  if (selectedTreatmentId) {
                    setSelectedTreatmentId("");
                    setSelectedTreatmentName("");
                  }
                  setTreatmentDropdownOpen(true);
                }}
                onFocus={() => setTreatmentDropdownOpen(true)}
                onBlur={() => setTimeout(() => setTreatmentDropdownOpen(false), 150)}
                disabled={treatmentsLoading}
                placeholder="Wpisz min. 3 litery lub wybierz z listy"
                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 pr-10 font-[var(--font-sans)] text-[15px] text-[#1F1A1C] focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 disabled:opacity-60"
                autoComplete="off"
              />
              {selectedTreatmentId && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTreatmentId("");
                    setSelectedTreatmentName("");
                    setTreatmentSearch("");
                    treatmentInputRef.current?.focus();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-[#6F5E64] hover:bg-neutral-100 hover:text-[#1F1A1C]"
                  aria-label="Wyczyść zabieg"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              {treatmentDropdownOpen && (
                <div
                  ref={treatmentListRef}
                  className="absolute z-20 mt-1 max-h-48 w-full overflow-auto rounded-xl border border-neutral-200 bg-white shadow-lg"
                  role="listbox"
                >
                  {(() => {
                    const q = (selectedTreatmentId ? "" : treatmentSearch).trim().toLowerCase();
                    const filtered = q.length === 0
                      ? treatments
                      : treatments.filter((t) => t.nazwa.toLowerCase().includes(q));
                    if (filtered.length === 0) {
                      return (
                        <div className="px-4 py-3 text-[14px] text-[#6F5E64]">
                          {q.length > 0 && q.length < 3 ? "Wpisz min. 3 litery, żeby zawęzić wyniki" : "Brak zabiegów"}
                        </div>
                      );
                    }
                    return filtered.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        role="option"
                        onClick={() => {
                          setSelectedTreatmentId(t.id);
                          setSelectedTreatmentName(t.nazwa);
                          setTreatmentSearch("");
                          setTreatmentDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2.5 text-left font-[var(--font-sans)] text-[15px] text-[#1F1A1C] hover:bg-pink-50 focus:bg-pink-50 focus:outline-none"
                      >
                        {t.nazwa}
                      </button>
                    ));
                  })()}
                </div>
              )}
            </div>
          </div>
          <DayPicker
            mode="single"
            selected={selectedDay}
            onSelect={(d) => {
              setSelectedDay(d);
              setSelectedSlot(null);
            }}
            defaultMonth={month}
            month={month}
            onMonthChange={setMonth}
            disabled={[{ before: today }, ...closedDateMatchers]}
            locale={pl}
            weekStartsOn={1}
            formatters={{
              formatWeekdayName: (date) => WEEKDAY_SHORT_PL[date.getDay()],
            }}
            className="rdp-booking mx-auto"
            classNames={{
              root: "rdp-root",
              month: "rdp-month",
              caption: "rdp-caption",
              day: "rounded-full font-[var(--font-sans)] text-[15px] hover:bg-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-500",
              day_selected: "bg-pink-500 text-white hover:bg-pink-600",
              day_today: "font-semibold text-pink-600",
              day_disabled: "text-neutral-300 cursor-not-allowed",
              day_outside: "text-neutral-300",
              day_hidden: "invisible",
            }}
          />

          {selectedDay && (
            <div className="mt-6">
              <p className="text-[14px] text-[#6F5E64]">Termin</p>
              <p className="mt-0.5 font-[var(--font-sans)] text-[15px] font-semibold text-[#1F1A1C]">
                {formatDatePL(selectedDay)}
              </p>
              <p className="mt-3 text-[14px] font-medium text-[#1F1A1C]">Wybierz godzinę</p>
              {status === "loading" && (
                <p className="mt-2 text-[14px] text-[#6F5E64]" role="status">
                  Ładowanie dostępnych godzin…
                </p>
              )}
              {status === "error" && (
                <p className="mt-2 text-[14px] text-red-600" role="alert">
                  Nie udało się pobrać godzin. Spróbuj ponownie.
                </p>
              )}
              {status === "success" && slotsForDay.length === 0 && (
                <p className="mt-2 text-[14px] text-[#6F5E64]">Brak wolnych terminów w tym dniu. Wybierz inny dzień.</p>
              )}
              {status === "success" && slotsForDay.length > 0 && (
                <ul className="mt-2 space-y-1.5" role="list">
                  {slotsForDay.map((slot) => {
                    const isSelected = selectedSlot?.id === slot.id;
                    return (
                      <li key={slot.id}>
                        <button
                          type="button"
                          onClick={() => setSelectedSlot(slot)}
                          className={`flex w-full items-center justify-between rounded-xl border-2 px-4 py-3 font-[var(--font-sans)] text-[15px] transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 ${
                            isSelected
                              ? "border-pink-500 bg-pink-50 text-pink-800"
                              : "border-neutral-200 bg-white text-[#1F1A1C] hover:border-pink-300 hover:bg-pink-50/50"
                          }`}
                        >
                          <span className="font-medium">{formatTimePL(slot.start)}</span>
                          <span className={`rounded-full px-3 py-1 text-[13px] font-medium ${isSelected ? "bg-pink-500 text-white" : "bg-neutral-100 text-[#6F5E64]"}`}>
                            {isSelected ? "Wybrano" : "Wybierz"}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}

          <div className="mt-6 flex flex-col gap-2">
            {treatmentBlockedForStaff && (
              <p className="rounded-xl bg-amber-50 px-4 py-3 text-[14px] font-medium text-amber-800" role="alert">
                Ten zabieg nie jest dostępny u wybranego pracownika (jego podgabinet nie oferuje tego zabiegu). Wybierz innego pracownika lub inny zabieg.
              </p>
            )}
            {bookingStatus === "success" && (
              <p className="rounded-xl bg-green-50 px-4 py-3 text-[14px] font-medium text-green-800" role="status">
                Termin zarezerwowany. Gabinet skontaktuje się w razie potrzeby.
              </p>
            )}
            {bookingStatus === "error" && bookingError && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-[14px] text-red-700" role="alert">
                {bookingError}
              </p>
            )}
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!selectedSlot || bookingStatus === "submitting" || treatmentBlockedForStaff || treatmentCheckLoading || requiresStaffSelection}
              className="w-full rounded-full bg-pink-500 py-3 font-[var(--font-sans)] text-[15px] font-medium text-white hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
            >
              {bookingStatus === "submitting"
                ? "Zapisywanie…"
                : selectedSlot && selectedDay
                  ? `Potwierdź rezerwację — ${formatDatePL(selectedDay).split(", ")[0]}, ${formatTimePL(selectedSlot.start)}`
                  : "Wybierz dzień i godzinę"}
            </button>
            <p className="text-center text-[13px] text-[#6F5E64]">
              Rezerwacja trafi do kalendarza gabinetu. Zajęte godziny nie są pokazywane.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
