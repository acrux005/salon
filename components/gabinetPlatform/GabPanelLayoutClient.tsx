"use client";

import { usePathname } from "next/navigation";
import { GabPanelShell } from "@/components/gabinetPlatform/GabPanelShell";

export function GabPanelLayoutClient({
  children,
  emailUnverified,
}: {
  children: React.ReactNode;
  emailUnverified?: boolean;
}) {
  const pathname = usePathname() ?? "";
  if (pathname.startsWith("/gabinet/panel/kreator") || pathname.includes("/druk")) {
    return <>{children}</>;
  }
  return <GabPanelShell emailUnverified={emailUnverified}>{children}</GabPanelShell>;
}
