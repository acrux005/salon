"use client";

import { useGabinetVerticalConfig } from "@/contexts/GabVerticalContext";

export function useGabinetBrand() {
  const v = useGabinetVerticalConfig();
  return {
    name: v.brandName,
    short: v.brandShort,
    brandName: v.brandName,
    brandShort: v.brandShort,
    clinicLabel: v.clinicLabel,
  };
}
