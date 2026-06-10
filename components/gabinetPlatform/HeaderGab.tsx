"use client";

import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Calendar } from "lucide-react";
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

  return (
    <header
      className={`gab-header-sticky ${panelMode ? "border-b border-slate-200/80 bg-white/90 backdrop-blur-md" : ""}`}
    >
      <div
        className={`mx-auto flex items-center justify-between gap-4 px-4 ${
          panelMode ? "max-w-[90rem] py-3" : "max-w-6xl py-4"
        }`}
      >
        <GabLink href={panelMode && isClinic ? "/panel" : "/"} className="flex items-center gap-2">
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold text-white shadow-sm ${
              panelMode ? "bg-gradient-to-br from-gab-sky to-sky-600 shadow-gab-sky/25" : "rounded-lg bg-gab-sky text-lg"
            }`}
            aria-hidden
          >
            {panelMode ? brand.short : "+"}
          </span>
          <span className="text-lg font-bold tracking-tight text-gab-navy">
            {brand.name.split("Harmonogram")[0]}
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
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[14px] font-medium text-gab-navy shadow-sm transition hover:bg-slate-50"
            >
              Wyloguj
            </button>
          </nav>
        ) : (
          <nav className="flex flex-wrap items-center gap-4 text-[14px] font-medium text-slate-600">
            <GabLink href="/gabinety" className="hover:text-gab-sky">
              Gabinety
            </GabLink>
            <GabLink href="/dla-gabinetow" className="hover:text-gab-sky">
              Dla gabinetów
            </GabLink>
            {session ? (
              <>
                {isClinic && (
                  <GabLink href="/panel" className="hover:text-gab-sky">
                    Panel
                  </GabLink>
                )}
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: logoutHref })}
                  className="text-gab-sky hover:underline"
                >
                  Wyloguj
                </button>
              </>
            ) : (
              <>
                <GabLink href="/login" className="hover:text-gab-sky">
                  Logowanie
                </GabLink>
                <GabLink
                  href="/register"
                  className="rounded-lg bg-gab-sky px-4 py-2 text-[14px] font-semibold text-white shadow-sm hover:bg-sky-600"
                >
                  Rozpocznij za darmo
                </GabLink>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
