"use client";

import { usePathname } from "next/navigation";
import { WetPanelShell } from "@/components/wet/WetPanelShell";

export function WetPanelLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  if (pathname.startsWith("/wet/panel/kreator") || pathname.includes("/druk")) {
    return <>{children}</>;
  }
  return <WetPanelShell>{children}</WetPanelShell>;
}
