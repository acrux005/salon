"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import {
  WET_PANEL_KLIENCI_NAV,
  WET_PANEL_MAIN_NAV,
  WET_PANEL_NARZEDZIA_NAV,
  WET_PANEL_USTAWIENIA_NAV,
  WET_PANEL_ZWIERZETA_NAV,
  isKlienciSectionActive,
  isNarzedziaSectionActive,
  isNavActive,
  isUstawieniaSectionActive,
  isZwierzetaSectionActive,
} from "@/lib/vet/panelNav";
import { WetPanelNavLink } from "@/components/wet/WetPanelNavLink";

/** Menu główne panelu na mobile (sidebar ukryty poniżej lg). */
export function WetPanelMobileMenu() {
  const pathname = usePathname() ?? "";
  const [open, setOpen] = useState(false);
  const klienciActive = isKlienciSectionActive(pathname);
  const zwierzetaActive = isZwierzetaSectionActive(pathname);
  const ustawieniaActive = isUstawieniaSectionActive(pathname);
  const narzedziaActive = isNarzedziaSectionActive(pathname);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-wet-navy shadow-sm"
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
              {WET_PANEL_MAIN_NAV.map((item) => (
                <li key={item.href}>
                  <WetPanelNavLink
                    href={item.href}
                    label={item.label}
                    icon={item.icon}
                    active={isNavActive(pathname, item)}
                    onNavigate={() => setOpen(false)}
                  />
                </li>
              ))}
            </ul>
            <p className="mt-4 px-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Klienci</p>
            <ul className="mt-2 space-y-1">
              {WET_PANEL_KLIENCI_NAV.map((item) => (
                <li key={item.href}>
                  <WetPanelNavLink
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
            <p className="mt-4 px-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Zwierzęta</p>
            <ul className="mt-2 space-y-1">
              {WET_PANEL_ZWIERZETA_NAV.map((item) => (
                <li key={item.href}>
                  <WetPanelNavLink
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
              {WET_PANEL_USTAWIENIA_NAV.map((item) => (
                <li key={item.href}>
                  <WetPanelNavLink
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
              {WET_PANEL_NARZEDZIA_NAV.map((item) => (
                <li key={item.href}>
                  <WetPanelNavLink
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

      {klienciActive && !open && (
        <nav className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {WET_PANEL_KLIENCI_NAV.map((item) => {
            const active = isNavActive(pathname, item);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-medium transition ${
                  active
                    ? "bg-wet-teal text-white shadow-sm shadow-wet-teal/20"
                    : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      )}

      {zwierzetaActive && !open && (
        <nav className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {WET_PANEL_ZWIERZETA_NAV.map((item) => {
            const active = isNavActive(pathname, item);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-medium transition ${
                  active
                    ? "bg-wet-teal text-white shadow-sm shadow-wet-teal/20"
                    : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      )}
      {ustawieniaActive && !open && (
        <nav className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {WET_PANEL_USTAWIENIA_NAV.map((item) => {
            const active = isNavActive(pathname, item);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-medium transition ${
                  active
                    ? "bg-wet-teal text-white shadow-sm shadow-wet-teal/20"
                    : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      )}

      {narzedziaActive && !open && (
        <nav className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {WET_PANEL_NARZEDZIA_NAV.map((item) => {
            const active = isNavActive(pathname, item);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-medium transition ${
                  active
                    ? "bg-wet-teal text-white shadow-sm shadow-wet-teal/20"
                    : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}
