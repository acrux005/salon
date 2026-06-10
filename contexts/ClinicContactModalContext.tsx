"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { ClinicContactModal } from "@/components/clinic/ClinicContactModal";

type ClinicContactModalContextValue = {
  openContactModal: () => void;
};

const ClinicContactModalContext = createContext<ClinicContactModalContextValue | null>(null);

export function ClinicContactModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const openContactModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback(() => setOpen(false), []);

  return (
    <ClinicContactModalContext.Provider value={{ openContactModal }}>
      {children}
      <ClinicContactModal open={open} onClose={closeModal} />
    </ClinicContactModalContext.Provider>
  );
}

export function useClinicContactModal(): ClinicContactModalContextValue {
  const ctx = useContext(ClinicContactModalContext);
  if (!ctx) {
    return {
      openContactModal: () => {},
    };
  }
  return ctx;
}
