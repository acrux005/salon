"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

type ClinicBookingContextValue = {
  calendarOpen: boolean;
  preselectedServiceSlug: string | undefined;
  openCalendar: (serviceSlug?: string) => void;
  closeCalendar: () => void;
  gateOpen: boolean;
  openGate: () => void;
  closeGate: () => void;
};

const ClinicBookingContext = createContext<ClinicBookingContextValue | null>(null);

export function ClinicBookingProvider({ children }: { children: ReactNode }) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [preselectedServiceSlug, setPreselectedServiceSlug] = useState<string | undefined>(undefined);
  const [gateOpen, setGateOpen] = useState(false);

  const openCalendar = useCallback((serviceSlug?: string) => {
    setPreselectedServiceSlug(serviceSlug);
    setCalendarOpen(true);
  }, []);

  const closeCalendar = useCallback(() => {
    setCalendarOpen(false);
    setPreselectedServiceSlug(undefined);
  }, []);

  const openGate = useCallback(() => setGateOpen(true), []);
  const closeGate = useCallback(() => setGateOpen(false), []);

  return (
    <ClinicBookingContext.Provider
      value={{
        calendarOpen,
        preselectedServiceSlug,
        openCalendar,
        closeCalendar,
        gateOpen,
        openGate,
        closeGate,
      }}
    >
      {children}
    </ClinicBookingContext.Provider>
  );
}

export function useClinicBooking(): ClinicBookingContextValue {
  const ctx = useContext(ClinicBookingContext);
  if (!ctx) {
    return {
      calendarOpen: false,
      preselectedServiceSlug: undefined,
      openCalendar: () => {},
      closeCalendar: () => {},
      gateOpen: false,
      openGate: () => {},
      closeGate: () => {},
    };
  }
  return ctx;
}
