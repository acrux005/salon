"use client";

import { createContext, useContext } from "react";
import {
  GABINET_VERTICALS,
  type GabinetVerticalId,
  getGabinetVerticalConfig,
} from "@/lib/gabinetPlatform/verticals";

const GabVerticalContext = createContext<GabinetVerticalId>("dent");

export function GabVerticalProvider({
  verticalId,
  children,
}: {
  verticalId: GabinetVerticalId;
  children: React.ReactNode;
}) {
  return <GabVerticalContext.Provider value={verticalId}>{children}</GabVerticalContext.Provider>;
}

export function useGabinetVerticalId(): GabinetVerticalId {
  return useContext(GabVerticalContext);
}

export function useGabinetVerticalConfig() {
  return getGabinetVerticalConfig(useGabinetVerticalId());
}
