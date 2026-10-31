"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { Menu, X, ChevronDown, User } from "lucide-react";
import { NotificationBell } from "./NotificationBell";
import { MessagesBell } from "./MessagesBell";

const NAV = [
  { label: "Gabinety", href: "/portal/gabinety" },
  { label: "Usługi", href: "/portal#uslugi" },
  { label: "Poradnik", href: "/portal#artykuly" },
  { label: "Dla salonów", href: "/portal/dla-salonow" },
  { label: "Strony WWW", href: "/strona-internetowa-dla-gabinetu-kosmetycznego" },
  { label: "Przykłady", href: "/przyklady-stron" },
];

export function HeaderPortal() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    function onOutsideClick(e: MouseEvent) {
      const target = e.target as Node;
      if (userMenuRef.current?.contains(target)) return;
      setUserMenuOpen(false);
    }
    document.addEventListener("mousedown", onOutsideClick);
    return () => document.removeEventListener("mousedown", onOutsideClick);
  }, []);

  const role = (session?.user as { role?: string })?.role;
  const userName = (session?.user as { name?: string | null; email?: string | null })?.name?.trim();
  const userEmail = (session?.user as { name?: string | null; email?: string | null })?.email?.trim();
  const identityLabel = userName || userEmail || "użytkownik";
  const roleLabel = role === "admin" ? "admin" : role === "client" ? "klient" : "gabinet";
  const isAuthenticated = status === "authenticated";

  const panelHref =
    role === "admin" ? "/portal/admin" : role === "client" ? "/portal/moje-rezerwacje" : "/portal/panel";
  const panelLabel = role === "admin" ? "Panel admina" : role === "client" ? "Moje rezerwacje" : "Panel";
  const notifHref =
    role === "admin"
      ? "/portal/admin/powiadomienia"
      : role === "client"
        ? "/portal/powiadomienia"
        : "/portal/panel/powiadomienia";
  const msgHref =
    role === "admin"
      ? "/portal/admin/wiadomosci"
      : role === "client"
        ? "/portal/wiadomosci"
        : "/portal/panel/wiadomosci";

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-neutral-200/80 bg-white max-lg:backdrop-blur-none lg:bg-white/95 lg:backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/portal" className="flex shrink-0 items-center">
            <Image
              src="/logo_salon.png"
              alt="Salon Odart"
              width={140}
              height={40}
              className="h-8 w-auto sm:h-9"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-5 lg:flex">
            {NAV.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="whitespace-nowrap font-[var(--font-sans)] text-[13px] font-medium text-[#4a3f42] transition-colors hover:text-pink-600 sm:text-[14px]"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            {!isAuthenticated && (
              <Link
                href="/portal/dodaj-salon"
                className="hidden rounded-full bg-pink-500 px-4 py-2 font-[var(--font-sans)] text-[13px] font-medium text-white shadow-sm transition-all hover:bg-pink-600 sm:block"
              >
                Dodaj swój salon
              </Link>
            )}
            {isAuthenticated && (
              <>
                <NotificationBell notificationsHref={notifHref} />
                <MessagesBell messagesHref={msgHref} />
                <div ref={userMenuRef} className="relative hidden sm:block">
                  <button
                    type="button"
                    onClick={() => setUserMenuOpen((o) => !o)}
                    className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 font-[var(--font-sans)] text-[13px] font-medium text-[#1F1A1C] transition-colors hover:bg-neutral-100"
                    aria-expanded={userMenuOpen}
                    aria-haspopup="true"
                  >
                    <User className="h-4 w-4 shrink-0 text-[#6F5E64]" />
                    <span className="max-w-[140px] truncate xl:max-w-[180px]">{identityLabel}</span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-[#6F5E64] transition-transform ${userMenuOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full z-50 mt-1 min-w-[200px] rounded-xl border border-neutral-200 bg-white py-1 shadow-lg">
                      <Link
                        href={panelHref}
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2.5 font-[var(--font-sans)] text-[13px] font-medium text-[#4a3f42] hover:bg-pink-50 hover:text-pink-600"
                      >
                        {panelLabel}
                      </Link>
                      {role === "client" && (
                        <Link
                          href="/portal/ustawienia"
                          onClick={() => setUserMenuOpen(false)}
                          className="block px-4 py-2.5 font-[var(--font-sans)] text-[13px] font-medium text-[#4a3f42] hover:bg-pink-50 hover:text-pink-600"
                        >
                          Ustawienia
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setUserMenuOpen(false);
                          signOut({ callbackUrl: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/portal` });
                        }}
                        className="block w-full px-4 py-2.5 text-left font-[var(--font-sans)] text-[13px] font-medium text-[#6F5E64] hover:bg-neutral-50"
                      >
                        Wyloguj
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
            {!isAuthenticated && (
              <Link
                href="/portal/login"
                className="hidden rounded-lg px-2.5 py-2 font-[var(--font-sans)] text-[13px] font-medium text-[#6F5E64] transition-colors hover:bg-neutral-100 hover:text-[#1F1A1C] sm:block"
              >
                Zaloguj
              </Link>
            )}
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#4a3f42] hover:bg-neutral-100 lg:hidden"
              aria-label={mobileOpen ? "Zamknij menu" : "Otwórz menu"}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <div
        className={`fixed left-0 right-0 top-14 z-40 bg-white shadow-xl transition-transform duration-200 lg:hidden ${
          mobileOpen ? "translate-y-0" : "pointer-events-none -translate-y-full"
        }`}
      >
        <nav className="flex flex-col divide-y divide-neutral-100">
          {isAuthenticated && (
            <div className="px-6 py-3">
              <p className="text-[12px] uppercase tracking-wide text-[#6F5E64]">Zalogowano jako</p>
              <p className="mt-0.5 truncate font-[var(--font-sans)] text-[14px] font-medium text-[#1F1A1C]">
                {identityLabel} <span className="text-[#6F5E64]">({roleLabel})</span>
              </p>
            </div>
          )}
          {NAV.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className="px-6 py-4 font-[var(--font-sans)] text-[15px] font-medium text-[#1F1A1C] transition-colors hover:bg-pink-50 hover:text-pink-600"
            >
              {label}
            </Link>
          ))}
          <div className="h-px bg-neutral-200" />
          {isAuthenticated ? (
            <>
              <Link
                href={panelHref}
                onClick={() => setMobileOpen(false)}
                className="px-6 py-4 font-[var(--font-sans)] text-[15px] font-medium text-[#4a3f42] transition-colors hover:bg-pink-50 hover:text-pink-600"
              >
                {panelLabel}
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  signOut({ callbackUrl: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/portal` });
                }}
                className="px-6 py-4 text-left font-[var(--font-sans)] text-[15px] font-medium text-[#6F5E64] transition-colors hover:bg-neutral-50"
              >
                Wyloguj
              </button>
            </>
          ) : (
            <>
              <Link
                href="/portal/dodaj-salon"
                onClick={() => setMobileOpen(false)}
                className="mx-4 my-4 block rounded-full bg-pink-500 px-6 py-3 text-center font-[var(--font-sans)] text-[15px] font-medium text-white hover:bg-pink-600"
              >
                Dodaj swój salon
              </Link>
              <Link
                href="/portal/login"
                onClick={() => setMobileOpen(false)}
                className="px-6 py-4 font-[var(--font-sans)] text-[15px] font-medium text-[#6F5E64] transition-colors hover:bg-neutral-50"
              >
                Zaloguj
              </Link>
            </>
          )}
        </nav>
      </div>
    </>
  );
}
