"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Przy "Dodaj do ekranu głównego" zapisywany jest aktualny URL.
 * Ten komponent usuwa z adresu parametry (?offer=, utm_*, itp.) na /portal,
 * żeby na ekranie głównym zapisał się czysty link: .../portal
 */
export function PortalCleanUrl() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hasParams = window.location.search || window.location.hash;
    const isPortalRoot =
      pathname === "/portal" || pathname === "/portal/";
    if (isPortalRoot && hasParams) {
      try {
        window.history.replaceState(null, "", window.location.origin + "/portal");
      } catch {
        // ignore
      }
    }
  }, [pathname]);

  return null;
}
