"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { ClinicPageData } from "@/lib/skinmatch/clinicData";
import { clinicDemo } from "@/content/clinicDemo";

/** Nadpisywalne dane strony gabinetu (multi-gabinet). Gdy null, używany jest clinicDemo. */
export const ClinicDataContext = createContext<Partial<ClinicPageData> | null>(null);

export function ClinicDataProvider({
  data,
  children,
}: {
  data: Partial<ClinicPageData> | null;
  children: ReactNode;
}) {
  return (
    <ClinicDataContext.Provider value={data}>
      {children}
    </ClinicDataContext.Provider>
  );
}

/** Zwraca dane gabinetu: z kontekstu (po merge z clinicDemo) albo clinicDemo. */
export function useClinicData(): ClinicPageData & typeof clinicDemo {
  const overrides = useContext(ClinicDataContext);
  if (!overrides) return clinicDemo as ClinicPageData & typeof clinicDemo;
  return {
    ...clinicDemo,
    ...overrides,
    treatments: overrides.treatments ?? clinicDemo.treatments,
  } as ClinicPageData & typeof clinicDemo;
}
