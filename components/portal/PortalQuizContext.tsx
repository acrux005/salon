"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type PortalQuizContextValue = {
  isOpen: boolean;
  preselectedProblem: string | null;
  openModal: () => void;
  closeModal: () => void;
  openModalWithProblem: (slug: string) => void;
};

const PortalQuizContext = createContext<PortalQuizContextValue | null>(null);

export function PortalQuizProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [preselectedProblem, setPreselectedProblem] = useState<string | null>(null);

  const openModal = useCallback(() => {
    setPreselectedProblem(null);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setPreselectedProblem(null);
  }, []);

  const openModalWithProblem = useCallback((slug: string) => {
    setPreselectedProblem(slug);
    setIsOpen(true);
  }, []);

  return (
    <PortalQuizContext.Provider
      value={{
        isOpen,
        preselectedProblem,
        openModal,
        closeModal,
        openModalWithProblem,
      }}
    >
      {children}
    </PortalQuizContext.Provider>
  );
}

export function usePortalQuiz() {
  const ctx = useContext(PortalQuizContext);
  if (!ctx) throw new Error("usePortalQuiz must be used within PortalQuizProvider");
  return ctx;
}

export function usePortalQuizOptional(): PortalQuizContextValue | null {
  return useContext(PortalQuizContext);
}
