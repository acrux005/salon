"use client";

import { usePathname } from "next/navigation";
import { HeaderWet } from "@/components/wet/HeaderWet";
import { FooterWet } from "@/components/wet/FooterWet";
import { wetInternalPath } from "@/lib/wetPaths";

/** Ukrywa marketingowy header/footer podczas pełnoekranowego onboardingu. */
export function WetLayoutChrome({ children }: { children: React.ReactNode }) {
  const pathname = wetInternalPath(usePathname() ?? "");
  const minimal = pathname.startsWith("/wet/panel/kreator");
  const panelApp =
    pathname.startsWith("/wet/panel") && !pathname.startsWith("/wet/panel/kreator");
  const authFlow =
    pathname === "/wet/login" ||
    pathname === "/wet/zapomniane-haslo" ||
    pathname.startsWith("/wet/ustaw-haslo");

  if (minimal) {
    return <>{children}</>;
  }

  if (panelApp || authFlow) {
    return (
      <>
        <HeaderWet />
        {children}
      </>
    );
  }

  return (
    <>
      <HeaderWet />
      {children}
      <FooterWet />
    </>
  );
}
