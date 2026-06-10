"use client";

import { createContext, useContext } from "react";

const WetHostContext = createContext(false);

export function WetHostProvider({
  isWetPortal,
  children,
}: {
  isWetPortal: boolean;
  children: React.ReactNode;
}) {
  return <WetHostContext.Provider value={isWetPortal}>{children}</WetHostContext.Provider>;
}

export function useIsWetPortal(): boolean {
  return useContext(WetHostContext);
}
