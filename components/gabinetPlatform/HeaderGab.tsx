"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Calendar, Menu, X } from "lucide-react";
import { GAB_CLINIC_ROLE } from "@/lib/auth";
import { GabLink } from "@/components/gabinetPlatform/GabLink";
import { useIsGabinetPortal } from "@/contexts/GabHostContext";
import { gabinetInternalPath, gabinetPublicHref } from "@/lib/gabinetPlatform/paths";
import { useGabinetBrand } from "@/components/gabinetPlatform/useGabinetBrand";

export function HeaderGab() {
  const pathname = usePathname() ?? "";
  const internal = gabinetInternalPath(pathname);
  const isPortal = useIsGabinetPortal();
  const { data: session } = useSession();
  const brand = useGabinetBrand();
  const role = (session?.user as { role?: string })?.role;
  const isClinic = role === GAB_CLINIC_ROLE;
  const panelMode =
    internal.startsWith("/gabinet/panel") && !internal.startsWith("/gabinet/panel/kreator");
  const logoutHref = gabinetPublicHref("/", isPortal);
  const [mobileOpen, setMobileOpen] = useState(false);
  const prefix = brand.name.split("Harmonogram")[0] || "Dent";

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (panelMode) return;
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen, panelMode]);

  const publicLinks = (
    <>
      <GabLink href="/gabinety" className="hover:text-gab-sky" onClick={() => setMobileOpen(false)}>
        Gabinety
      </GabLink>
      <GabLink href="/dla-gabinetow" className="hover:text-gab-sky" onClick={() => setMobileOpen(false)}>
        Dla gabinetów
      </GabLink>
      {session ? (
        <>
          {isClinic && (
            <GabLink href="/panel" className="hover:text-gab-sky" onClick={() => setMobileOpen(false)}>
              Panel
            </GabLink>
          )}
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: logoutHref })}
            className="text-left text-gab-sky hover:underline"
          >
            Wyloguj
          </button>
        </>
      ) : (
        <>
          <GabLink href="/login" className="hover:text-gab-sky" onClick={() => setMobileOpen(false)}>
            Logowanie
          </GabLink>
          <GabLink
            href="/register"
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-gab-sky px-4 py-2 text-[14px] font-semibold text-white shadow-sm hover:bg-sky-600"
            onClick={() => setMobileOpen(false)}
          >
            Rozpocznij za darmo
          </GabLink>
        </>
      )}
    </>
  );

  return (
    <header
      className={`gab-header-sticky min-w-0 ${
        panelMode || mobileOpen ? "border-b border-slate-200/80 bg-white/95 backdrop-blur-md" : "bg-sky-50/80 backdrop-blur-md"
      }`}
    >
      <div
        className={`mx-auto flex w-full min-w-0 max-w-full items-center justify-between gap-2 px-4 ${
          panelMode ? "max-w-[90rem] py-3" : "max-w-6xl py-3 sm:py-4"
        }`}
      >
        <GabLink
          href={panelMode && isClinic ? "/panel" : "/"}
          className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden"
          onClick={() => setMobileOpen(false)}
        >
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white shadow-sm ${
              panelMode ? "bg-gradient-to-br from-gab-sky to-sky-600 shadow-gab-sky/25" : "rounded-lg bg-gab-sky text-lg"
            }`}
            aria-hidden
          >
            {panelMode ? brand.short : "+"}
          </span>
          <span className="truncate text-[15px] font-bold tracking-tight text-gab-navy sm:text-lg">
            {prefix}
            <span className="text-gab-sky">Harmonogram</span>
          </span>
        </GabLink>

        {panelMode && isClinic ? (
          <nav className="flex items-center gap-2 sm:gap-4">
            <GabLink
              href="/panel/kalendarz"
              className="hidden items-center gap-2 rounded-xl px-3 py-2 text-[14px] font-medium text-slate-600 transition hover:bg-slate-50 hover:text-gab-navy sm:inline-flex"
            >
              <Calendar className="h-4 w-4 text-gab-sky" aria-hidden />
              Kalendarz
            </GabLink>
            <GabLink
              href="/panel/gabinet"
              className="hidden rounded-xl px-3 py-2 text-[14px] font-medium text-slate-600 transition hover:bg-slate-50 hover:text-gab-navy md:inline-block"
            >
              Ustawienia
            </GabLink>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: logoutHref })}
              className="min-h-10 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13px] font-medium text-gab-navy shadow-sm transition hover:bg-slate-50 sm:px-4 sm:text-[14px]"
            >
              Wyloguj
            </button>
          </nav>
        ) : (
          <>
            <nav className="gab-desktop-nav items-center gap-4 text-[14px] font-medium text-slate-600">
              {publicLinks}
            </nav>
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="gab-mobile-menu-btn relative z-40 h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-gab-navy shadow-sm"
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Zamknij menu" : "Otwórz menu"}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </>
        )}
      </div>

      {!panelMode && mobileOpen ? (
        <>
          <button
            type="button"
            className="gab-mobile-drawer fixed inset-0 top-[3.75rem] z-40 bg-slate-900/25"
            aria-label="Zamknij menu"
            onClick={() => setMobileOpen(false)}
          />
          <nav className="gab-mobile-drawer relative z-50 flex flex-col gap-1 border-t border-slate-100 bg-white px-4 py-3 text-[16px] font-medium text-slate-700 shadow-lg [&>a]:flex [&>a]:min-h-11 [&>a]:items-center [&>button]:flex [&>button]:min-h-11 [&>button]:items-center">
            {publicLinks}
          </nav>
        </>
      ) : null}
    </header>
  );
}
