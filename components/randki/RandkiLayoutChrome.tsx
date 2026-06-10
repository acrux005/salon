"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { randkiPublicHref } from "@/lib/randkiPaths";
import { RANDKI_ROLE } from "@/lib/auth";
import { isMobileLikeDevice } from "@/lib/randki/clientDevice";
import { RandkiDayPhasePortalSync } from "@/components/randki/RandkiDayPhaseDemoBar";
import { RandkiAmbientProvider, RandkiAmbientToggle } from "@/components/randki/RandkiAmbientPlayer";
import { RandkiClimateDiscoveryProvider } from "@/components/randki/RandkiClimateDiscoveryContext";
import {
  RandkiClimateDiscoveryPalette,
  RandkiClimateSearchPill,
  RandkiDriftButton,
  RandkiDriftOverlay,
} from "@/components/randki/RandkiClimateDiscoveryUI";
import { dayPhaseClass } from "@/lib/randki/dayRhythm";
import { INTERACTION_COPY } from "@/lib/randki/presenceInteractions";
import { useRandkiDayPhase } from "@/lib/randki/useRandkiDayPhase";

type NavItem = { href: string; label: string; badge?: number; emoji?: string };

export function RandkiLayoutChrome({
  children,
  isRandkiPortal,
  isLoggedInServer = false,
  likesCount = 0,
}: {
  children: React.ReactNode;
  isRandkiPortal: boolean;
  isLoggedInServer?: boolean;
  likesCount?: number;
}) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const dayPhase = useRandkiDayPhase();

  useEffect(() => {
    const root = document.documentElement;
    const sync = () => {
      if (isMobileLikeDevice()) root.classList.add("randki-mobile-static");
      else root.classList.remove("randki-mobile-static");
    };
    sync();
    const mq = window.matchMedia("(max-width: 900px)");
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  const clientLoggedIn = (session?.user as { role?: string })?.role === RANDKI_ROLE;
  const isLoggedIn = status === "authenticated" ? clientLoggedIn : isLoggedInServer;
  const href = (p: string) => randkiPublicHref(p, isRandkiPortal);

  const nav: NavItem[] = useMemo(() => {
    if (!isLoggedIn) return [];
    const items: NavItem[] = [
      { href: href("/panel"), label: dayPhase.label, emoji: dayPhase.emoji },
    ];
    if (dayPhase.voiceInNav) {
      items.push({ href: href("/voice-match"), label: dayPhase.voiceNavLabel });
    }
    items.push(
      { href: href("/spolecznosci"), label: "Kręgi" },
      { href: href("/polubienia"), label: "Rezonuje", badge: likesCount },
      { href: href("/dopasowania"), label: INTERACTION_COPY.matchesNav },
      { href: href("/profil"), label: "Pokój" }
    );
    return items;
  }, [isLoggedIn, dayPhase, likesCount, isRandkiPortal]);

  const mobileNav = nav;

  const isActive = (itemHref: string) => pathname === itemHref || pathname.startsWith(itemHref + "/");

  return (
    <RandkiAmbientProvider>
      <RandkiClimateDiscoveryProvider>
      <>
      <RandkiDayPhasePortalSync phase={dayPhase.id} />
      <RandkiClimateDiscoveryPalette />
      <RandkiDriftOverlay />
      <header
        className={`randki-nav sticky top-0 z-40 border-b border-white/10 bg-black/30 backdrop-blur-xl ${dayPhaseClass(dayPhase.id)}`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 lg:gap-6">
          <Link href={href("/")} className="group flex shrink-0 flex-col leading-none">
            <span className="bg-gradient-to-r from-rose-300 to-violet-300 bg-clip-text text-lg font-bold tracking-tight text-transparent">
              Randki Odart
            </span>
            <span className="mt-0.5 text-[10px] font-medium tracking-[0.12em] text-white/35 group-hover:text-white/50">
              {dayPhase.brandTagline}
            </span>
          </Link>

          <div className="hidden flex-1 justify-center px-2 lg:flex">
            {isLoggedIn && <RandkiClimateSearchPill />}
          </div>

          <nav className="hidden items-center gap-1 lg:flex">
            {nav.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative rounded-full px-3.5 py-2 text-[13px] font-medium transition ${
                    active
                      ? "randki-nav-active bg-white/10 text-white shadow-[0_0_20px_rgba(244,63,94,0.25)]"
                      : "text-white/55 hover:bg-white/5 hover:text-white/90"
                  }`}
                >
                  {item.emoji ? `${item.emoji} ` : ""}
                  {item.label}
                  {typeof item.badge === "number" && item.badge > 0 && (
                    <span className="ml-1 inline-flex min-w-[18px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
            <Link
              href={href("/ustawienia")}
              className={`rounded-full px-3 py-2 text-[13px] ${isActive(href("/ustawienia")) ? "text-white/90" : "text-white/40 hover:text-white/70"}`}
            >
              ⚙
            </Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {isLoggedIn && (
              <>
                <span className="lg:hidden">
                  <RandkiClimateSearchPill />
                </span>
                <RandkiDriftButton />
              </>
            )}
            <RandkiAmbientToggle />
            {isLoggedIn ? (
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: href("/") })}
                className="text-[12px] font-medium text-white/45 transition hover:text-white/80"
              >
                Wyloguj
              </button>
            ) : (
              <>
                <Link href={href("/logowanie")} className="text-[13px] font-medium text-white/55 hover:text-white">
                  Zaloguj
                </Link>
                <Link href={href("/rejestracja")} className="randki-btn-primary text-[13px]">
                  Dołącz
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {isLoggedIn && (
        <nav
          className={`fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-black/40 backdrop-blur-xl md:hidden ${dayPhaseClass(dayPhase.id)} randki-nav-mobile`}
        >
          <div className="mx-auto flex max-w-lg justify-around px-0.5 py-2">
            {mobileNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex flex-col items-center px-2 py-1 text-[10px] font-medium ${
                  isActive(item.href) ? "text-rose-300" : "text-white/45"
                }`}
              >
                {item.emoji ? (
                  <span className="text-[14px] leading-none">{item.emoji}</span>
                ) : null}
                <span className={item.emoji ? "mt-0.5" : ""}>{item.label}</span>
                {typeof item.badge === "number" && item.badge > 0 && (
                  <span className="absolute -right-0.5 top-0 flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-rose-500 px-0.5 text-[8px] text-white">
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </nav>
      )}

      <div className={isLoggedIn ? "pb-20 md:pb-0" : ""}>{children}</div>

      <footer className="randki-footer mt-auto border-t border-white/[0.06] px-4 py-4 text-center">
        <p className="text-[11px] text-white/25">© {new Date().getFullYear()} Randki Odart</p>
        <p className="mt-1.5 flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px]">
          <Link href={href("/regulamin")} className="text-white/30 hover:text-white/55">
            Regulamin
          </Link>
          <Link href={href("/polityka-prywatnosci")} className="text-white/30 hover:text-white/55">
            Prywatność
          </Link>
        </p>
      </footer>
      </>
      </RandkiClimateDiscoveryProvider>
    </RandkiAmbientProvider>
  );
}
