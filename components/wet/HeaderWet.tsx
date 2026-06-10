"use client";

import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Calendar } from "lucide-react";
import { VET_CLINIC_ROLE } from "@/lib/auth";
import { WetLink } from "@/components/wet/WetLink";
import { useIsWetPortal } from "@/contexts/WetHostContext";
import { wetInternalPath, wetPublicHref } from "@/lib/wetPaths";

export function HeaderWet() {
  const pathname = usePathname() ?? "";
  const internal = wetInternalPath(pathname);
  const isWetPortal = useIsWetPortal();
  const { data: session } = useSession();
  const role = (session?.user as { role?: string })?.role;
  const isVet = role === VET_CLINIC_ROLE;
  const panelMode =
    internal.startsWith("/wet/panel") && !internal.startsWith("/wet/panel/kreator");
  const logoutHref = wetPublicHref("/", isWetPortal);

  return (
    <header
      className={`wet-header-sticky ${panelMode ? "border-b border-slate-200/80 bg-white/90 backdrop-blur-md" : ""}`}
    >
      <div
        className={`mx-auto flex items-center justify-between gap-4 px-4 ${
          panelMode ? "max-w-[90rem] py-3" : "max-w-6xl py-4"
        }`}
      >
        <WetLink href={panelMode && isVet ? "/panel" : "/"} className="flex items-center gap-2">
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold text-white shadow-sm ${
              panelMode ? "bg-gradient-to-br from-wet-teal to-teal-600 shadow-wet-teal/25" : "rounded-lg bg-wet-teal text-lg"
            }`}
            aria-hidden
          >
            {panelMode ? "VH" : "+"}
          </span>
          <span className="text-lg font-bold tracking-tight text-wet-navy">
            Vet<span className="text-wet-teal">Harmonogram</span>
          </span>
        </WetLink>

        {panelMode && isVet ? (
          <nav className="flex items-center gap-2 sm:gap-4">
            <WetLink
              href="/panel/kalendarz"
              className="hidden items-center gap-2 rounded-xl px-3 py-2 text-[14px] font-medium text-slate-600 transition hover:bg-slate-50 hover:text-wet-navy sm:inline-flex"
            >
              <Calendar className="h-4 w-4 text-wet-teal" aria-hidden />
              Kalendarz
            </WetLink>
            <WetLink
              href="/panel/przychodnia"
              className="hidden rounded-xl px-3 py-2 text-[14px] font-medium text-slate-600 transition hover:bg-slate-50 hover:text-wet-navy md:inline-block"
            >
              Ustawienia
            </WetLink>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: logoutHref })}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-[14px] font-medium text-wet-navy shadow-sm transition hover:bg-slate-50"
            >
              Wyloguj
            </button>
          </nav>
        ) : (
          <nav className="flex flex-wrap items-center gap-4 text-[14px] font-medium text-wet-navy-muted">
            <WetLink href="/przychodnie" className="hover:text-wet-teal">
              Przychodnie
            </WetLink>
            <WetLink href="/dla-przychodni" className="hover:text-wet-teal">
              Dla przychodni
            </WetLink>
            {session ? (
              <>
                {isVet && (
                  <WetLink href="/panel" className="hover:text-wet-teal">
                    Panel
                  </WetLink>
                )}
                <button
                  type="button"
                  onClick={() => signOut({ callbackUrl: logoutHref })}
                  className="text-wet-teal-700 hover:underline"
                >
                  Wyloguj
                </button>
              </>
            ) : (
              <>
                <WetLink href="/login" className="hover:text-wet-teal">
                  Logowanie
                </WetLink>
                <WetLink
                  href="/register"
                  className="rounded-lg bg-wet-teal px-4 py-2 text-[14px] font-semibold text-white shadow-sm hover:bg-wet-teal-700"
                >
                  Rozpocznij za darmo
                </WetLink>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
