"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  WET_PANEL_KLIENCI_NAV,
  WET_PANEL_NARZEDZIA_NAV,
  WET_PANEL_USTAWIENIA_NAV,
  WET_PANEL_ZWIERZETA_NAV,
  isKlienciSectionActive,
  isNarzedziaSectionActive,
  isNavActive,
  isUstawieniaSectionActive,
  isZwierzetaSectionActive,
} from "@/lib/vet/panelNav";

/** Szybka nawigacja sekcji Klienci / Zwierzęta na telefonie (sidebar ukryty poniżej lg). */
export function WetPanelMobileNav() {
  const pathname = usePathname() ?? "";
  const klienciActive = isKlienciSectionActive(pathname);
  const zwierzetaActive = isZwierzetaSectionActive(pathname);
  const narzedziaActive = isNarzedziaSectionActive(pathname);
  const ustawieniaActive = isUstawieniaSectionActive(pathname);

  if (!klienciActive && !zwierzetaActive && !ustawieniaActive && !narzedziaActive) return null;

  const items = klienciActive
    ? WET_PANEL_KLIENCI_NAV
    : zwierzetaActive
      ? WET_PANEL_ZWIERZETA_NAV
      : ustawieniaActive
        ? WET_PANEL_USTAWIENIA_NAV
        : WET_PANEL_NARZEDZIA_NAV;

  return (
    <nav className="flex gap-2 overflow-x-auto border-b border-wet-teal-100 bg-white px-4 py-2 lg:hidden">
      {items.map((item) => {
        const active = isNavActive(pathname, item);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`shrink-0 rounded-full px-3 py-1.5 text-[12px] font-medium ${
              active ? "bg-wet-teal text-white" : "bg-wet-teal-50 text-wet-teal-800"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
