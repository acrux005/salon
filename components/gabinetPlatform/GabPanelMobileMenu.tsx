"use client";

import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import {
  GAB_PANEL_KLIENCI_NAV,
  GAB_PANEL_MAIN_NAV,
  GAB_PANEL_NARZEDZIA_NAV,
  GAB_PANEL_PACJENCI_NAV,
  GAB_PANEL_USTAWIENIA_NAV,
  isKlienciSectionActive,
  isNarzedziaSectionActive,
  isNavActive,
  isPacjenciSectionActive,
  isUstawieniaSectionActive,
} from "@/lib/gabinet/panelNav";
import { GabPanelNavLink } from "@/components/gabinetPlatform/GabPanelNavLink";

export function GabPanelMobileMenu() {
  const pathname = usePathname() ?? "";
  const [open, setOpen] = useState(false);
  const pacjenciActive = isPacjenciSectionActive(pathname);
  const klienciActive = isKlienciSectionActive(pathname);
  const ustawieniaActive = isUstawieniaSectionActive(pathname);
  const narzedziaActive = isNarzedziaSectionActive(pathname);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-gab-navy shadow-sm"
        aria-expanded={open}
        aria-label={open ? "Zamknij menu" : "Otwórz menu panelu"}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-[2px]"
            aria-label="Zamknij menu"
            onClick={() => setOpen(false)}
          />
          <nav className="fixed left-4 right-4 top-[4.5rem] z-50 max-h-[calc(100dvh-6rem)] overflow-y-auto rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xl shadow-slate-300/30">
            <p className="px-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Menu</p>
            <ul className="mt-2 space-y-1">
              {GAB_PANEL_MAIN_NAV.map((item) => (
                <li key={item.href}>
                  <GabPanelNavLink
                    href={item.href}
                    label={item.label}
                    icon={item.icon}
                    active={isNavActive(pathname, item)}
                    onNavigate={() => setOpen(false)}
                  />
                </li>
              ))}
            </ul>
            <p className="mt-4 px-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Pacjenci</p>
            <ul className="mt-2 space-y-1">
              {GAB_PANEL_PACJENCI_NAV.map((item) => (
                <li key={item.href}>
                  <GabPanelNavLink
                    href={item.href}
                    label={item.label}
                    icon={item.icon}
                    active={isNavActive(pathname, item)}
                    compact
                    onNavigate={() => setOpen(false)}
                  />
                </li>
              ))}
            </ul>
            <p className="mt-4 px-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Klienci</p>
            <ul className="mt-2 space-y-1">
              {GAB_PANEL_KLIENCI_NAV.map((item) => (
                <li key={item.href}>
                  <GabPanelNavLink
                    href={item.href}
                    label={item.label}
                    icon={item.icon}
                    active={isNavActive(pathname, item)}
                    compact
                    onNavigate={() => setOpen(false)}
                  />
                </li>
              ))}
            </ul>
            <p className="mt-4 px-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Ustawienia</p>
            <ul className="mt-2 space-y-1">
              {GAB_PANEL_USTAWIENIA_NAV.map((item) => (
                <li key={item.href}>
                  <GabPanelNavLink
                    href={item.href}
                    label={item.label}
                    icon={item.icon}
                    active={isNavActive(pathname, item)}
                    compact
                    onNavigate={() => setOpen(false)}
                  />
                </li>
              ))}
            </ul>
            <p className="mt-4 px-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Narzędzia</p>
            <ul className="mt-2 space-y-1">
              {GAB_PANEL_NARZEDZIA_NAV.map((item) => (
                <li key={item.href}>
                  <GabPanelNavLink
                    href={item.href}
                    label={item.label}
                    icon={item.icon}
                    active={isNavActive(pathname, item)}
                    compact
                    onNavigate={() => setOpen(false)}
                  />
                </li>
              ))}
            </ul>
          </nav>
        </>
      )}
    </div>
  );
}
