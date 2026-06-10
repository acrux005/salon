"use client";

import { usePathname } from "next/navigation";
import { HeaderGab } from "@/components/gabinetPlatform/HeaderGab";
import { FooterGab } from "@/components/gabinetPlatform/FooterGab";
import { gabinetInternalPath } from "@/lib/gabinetPlatform/paths";

export function GabLayoutChrome({ children }: { children: React.ReactNode }) {
  const pathname = gabinetInternalPath(usePathname() ?? "");
  const minimal = pathname.startsWith("/gabinet/panel/kreator");
  const panelApp =
    pathname.startsWith("/gabinet/panel") && !pathname.startsWith("/gabinet/panel/kreator");
  const authFlow =
    pathname === "/gabinet/login" ||
    pathname === "/gabinet/zapomniane-haslo" ||
    pathname.startsWith("/gabinet/ustaw-haslo");

  if (minimal) {
    return <>{children}</>;
  }

  if (panelApp || authFlow) {
    return (
      <>
        <HeaderGab />
        {children}
      </>
    );
  }

  return (
    <>
      <HeaderGab />
      {children}
      <FooterGab />
    </>
  );
}
