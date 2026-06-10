"use client";

import { createContext, useContext } from "react";

const GabHostContext = createContext(false);

export function GabHostProvider({
  isGabinetPortal,
  children,
}: {
  isGabinetPortal: boolean;
  children: React.ReactNode;
}) {
  return <GabHostContext.Provider value={isGabinetPortal}>{children}</GabHostContext.Provider>;
}

export function useIsGabinetPortal(): boolean {
  return useContext(GabHostContext);
}
