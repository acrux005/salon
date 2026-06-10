"use client";

import { usePathname } from "next/navigation";
import { WetLink } from "@/components/wet/WetLink";
import { wetInternalPath } from "@/lib/wetPaths";
import { ChevronDown, PawPrint, Settings, Users, Wrench } from "lucide-react";
import { WetPanelMobileMenu } from "@/components/wet/WetPanelMobileMenu";
import { WetPanelBells } from "@/components/wet/WetPanelBells";
import { WetPanelNavLink } from "@/components/wet/WetPanelNavLink";
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

export function WetPanelShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const klienciOpen = isKlienciSectionActive(pathname);
  const zwierzetaOpen = isZwierzetaSectionActive(pathname);
  const ustawieniaOpen = isUstawieniaSectionActive(pathname);
  const narzedziaOpen = isNarzedziaSectionActive(pathname);
  const [klienciExpanded, setKlienciExpanded] = useState(klienciOpen);
  const [zwierzetaExpanded, setZwierzetaExpanded] = useState(zwierzetaOpen);
  const [ustawieniaExpanded, setUstawieniaExpanded] = useState(ustawieniaOpen);
  const [narzedziaExpanded, setNarzedziaExpanded] = useState(narzedziaOpen);

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-gradient-to-br from-slate-50 via-[#f4fbfb] to-slate-100">
      <div className="mx-auto flex max-w-[90rem] gap-0 px-0 lg:gap-6 lg:px-6 lg:py-6">
        <aside className="hidden w-[17rem] shrink-0 lg:block">
          <nav className="sticky top-20 space-y-6">
            <div className="rounded-2xl border border-white/80 bg-white/90 p-3 shadow-sm shadow-slate-200/50 backdrop-blur-sm">
              <WetLink
                href="/panel"
                className="mb-3 flex items-center gap-2.5 rounded-xl px-2 py-2 transition hover:bg-slate-50"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-wet-teal to-teal-600 text-sm font-bold text-white shadow-md shadow-wet-teal/30">
                  VH
                </span>
                <span className="text-[15px] font-bold tracking-tight text-wet-navy">
                  Vet<span className="text-wet-teal">Harmonogram</span>
                </span>
              </WetLink>

              <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                Menu
              </p>
              <ul className="space-y-0.5">
                {WET_PANEL_MAIN_NAV.slice(0, 1).map((item) => (
                  <li key={item.href}>
                    <WetPanelNavLink
                      href={item.href}
                      label={item.label}
                      icon={item.icon}
                      active={isNavActive(pathname, item)}
                    />
                  </li>
                ))}
              </ul>

              <div className="mt-2 border-t border-slate-100 pt-2">
                <button
                  type="button"
                  onClick={() => setKlienciExpanded((v) => !v)}
                  className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left text-[14px] font-medium transition ${
                    klienciOpen
                      ? "bg-wet-teal/10 text-wet-teal-900"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                  aria-expanded={klienciExpanded}
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                      <Users className="h-4 w-4" aria-hidden />
                    </span>
                    Klienci
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${klienciExpanded ? "rotate-180" : ""}`}
                    aria-hidden
                  />
                </button>
                {klienciExpanded && (
                  <ul className="mt-1 space-y-0.5 pl-3">
                    {WET_PANEL_KLIENCI_NAV.map((item) => (
                      <li key={item.href}>
                        <WetPanelNavLink
                          href={item.href}
                          label={item.label}
                          icon={item.icon}
                          active={isNavActive(pathname, item)}
                          compact
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mt-2 border-t border-slate-100 pt-2">
                <button
                  type="button"
                  onClick={() => setZwierzetaExpanded((v) => !v)}
                  className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left text-[14px] font-medium transition ${
                    zwierzetaOpen
                      ? "bg-wet-teal/10 text-wet-teal-900"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                  aria-expanded={zwierzetaExpanded}
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                      <PawPrint className="h-4 w-4" aria-hidden />
                    </span>
                    Zwierzęta
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${zwierzetaExpanded ? "rotate-180" : ""}`}
                    aria-hidden
                  />
                </button>
                {zwierzetaExpanded && (
                  <ul className="mt-1 space-y-0.5 pl-3">
                    {WET_PANEL_ZWIERZETA_NAV.map((item) => (
                      <li key={item.href}>
                        <WetPanelNavLink
                          href={item.href}
                          label={item.label}
                          icon={item.icon}
                          active={isNavActive(pathname, item)}
                          compact
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mt-2 border-t border-slate-100 pt-2">
                <button
                  type="button"
                  onClick={() => setUstawieniaExpanded((v) => !v)}
                  className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left text-[14px] font-medium transition ${
                    ustawieniaOpen
                      ? "bg-wet-teal/10 text-wet-teal-900"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                  aria-expanded={ustawieniaExpanded}
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                      <Settings className="h-4 w-4" aria-hidden />
                    </span>
                    Ustawienia
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${ustawieniaExpanded ? "rotate-180" : ""}`}
                    aria-hidden
                  />
                </button>
                {ustawieniaExpanded && (
                  <ul className="mt-1 max-h-64 space-y-0.5 overflow-y-auto pl-3">
                    {WET_PANEL_USTAWIENIA_NAV.map((item) => (
                      <li key={item.href}>
                        <WetPanelNavLink
                          href={item.href}
                          label={item.label}
                          icon={item.icon}
                          active={isNavActive(pathname, item)}
                          compact
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mt-2 border-t border-slate-100 pt-2">
                <button
                  type="button"
                  onClick={() => setNarzedziaExpanded((v) => !v)}
                  className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left text-[14px] font-medium transition ${
                    narzedziaOpen
                      ? "bg-wet-teal/10 text-wet-teal-900"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                  aria-expanded={narzedziaExpanded}
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                      <Wrench className="h-4 w-4" aria-hidden />
                    </span>
                    Narzędzia
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${narzedziaExpanded ? "rotate-180" : ""}`}
                    aria-hidden
                  />
                </button>
                {narzedziaExpanded && (
                  <ul className="mt-1 space-y-0.5 pl-3">
                    {WET_PANEL_NARZEDZIA_NAV.map((item) => (
                      <li key={item.href}>
                        <WetPanelNavLink
                          href={item.href}
                          label={item.label}
                          icon={item.icon}
                          active={isNavActive(pathname, item)}
                          compact
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <ul className="mt-2 space-y-0.5 border-t border-slate-100 pt-2">
                {WET_PANEL_MAIN_NAV.slice(1).map((item) => (
                  <li key={item.href}>
                    <WetPanelNavLink
                      href={item.href}
                      label={item.label}
                      icon={item.icon}
                      active={isNavActive(pathname, item)}
                    />
                  </li>
                ))}
              </ul>
            </div>

            <WetLink
              href="/dla-przychodni"
              className="block rounded-xl border border-dashed border-slate-200 bg-white/60 px-4 py-3 text-[12px] leading-snug text-slate-500 transition hover:border-wet-teal/30 hover:bg-white hover:text-wet-teal-800"
            >
              Potrzebujesz pomocy? Zobacz poradnik dla przychodni →
            </WetLink>
          </nav>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="border-b border-slate-200/60 bg-white/80 px-4 py-3 backdrop-blur-sm lg:rounded-t-2xl lg:border lg:border-b-0 lg:border-slate-200/80">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <WetPanelMobileMenu />
              <div className="flex items-center justify-end gap-2 sm:ml-auto">
                <WetPanelBells />
              </div>
            </div>
          </div>

          <main className="min-h-[calc(100dvh-10rem)] bg-white lg:rounded-b-2xl lg:border lg:border-t-0 lg:border-slate-200/80 lg:shadow-sm lg:shadow-slate-200/40">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
