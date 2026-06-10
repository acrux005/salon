"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { Menu, X, Search, ChevronDown, User } from "lucide-react";
import { usePortalQuizOptional } from "./PortalQuizContext";
import { NotificationBell } from "./NotificationBell";
import { MessagesBell } from "./MessagesBell";

const NAV = [
  { label: "Jak to działa", href: "/portal#jak-to-dziala" },
  { label: "Zabiegi", href: "/portal#zabiegi" },
  { label: "Gabinety", href: "/portal#gabinety" },
  { label: "Artykuły", href: "/portal#artykuly" },
  { label: "Dla gabinetów", href: "/portal/dla-gabinetow" },
];

type SearchClinicItem = { id: string; slug: string; name: string; city: string };
type SearchTreatmentItem = { id: string; nazwa: string };

const BASE = typeof window !== "undefined" ? (process.env.NEXT_PUBLIC_BASE_PATH ?? "") : "";

export function HeaderPortal() {
  const quiz = usePortalQuizOptional();
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchClinics, setSearchClinics] = useState<SearchClinicItem[]>([]);
  const [searchTreatments, setSearchTreatments] = useState<SearchTreatmentItem[]>([]);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Zamknij menu przy zmianie strony
  useEffect(() => { setMobileOpen(false); setUserMenuOpen(false); }, [pathname]);

  // Zablokuj scroll body gdy menu otwarte
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    function onOutsideClick(e: MouseEvent) {
      const target = e.target as Node;
      if (searchRef.current?.contains(target)) return;
      if (userMenuRef.current?.contains(target)) return;
      setSearchOpen(false);
      setUserMenuOpen(false);
    }
    document.addEventListener("mousedown", onOutsideClick);
    return () => document.removeEventListener("mousedown", onOutsideClick);
  }, []);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setSearchClinics([]);
      setSearchTreatments([]);
      setSearchLoading(false);
      return;
    }
    const ctrl = new AbortController();
    const id = window.setTimeout(async () => {
      try {
        setSearchLoading(true);
        const res = await fetch(`${BASE}/api/search?q=${encodeURIComponent(q)}`, { signal: ctrl.signal });
        const data = (await res.json().catch(() => ({}))) as {
          clinics?: SearchClinicItem[];
          treatments?: SearchTreatmentItem[];
        };
        setSearchClinics(Array.isArray(data.clinics) ? data.clinics : []);
        setSearchTreatments(Array.isArray(data.treatments) ? data.treatments : []);
      } catch {
        setSearchClinics([]);
        setSearchTreatments([]);
      } finally {
        setSearchLoading(false);
      }
    }, 250);
    return () => {
      ctrl.abort();
      window.clearTimeout(id);
    };
  }, [query]);

  const role = (session?.user as { role?: string })?.role;
  const userName = (session?.user as { name?: string | null; email?: string | null })?.name?.trim();
  const userEmail = (session?.user as { name?: string | null; email?: string | null })?.email?.trim();
  const identityLabel = userName || userEmail || "użytkownik";
  const roleLabel = role === "admin" ? "admin" : role === "client" ? "klient" : "gabinet";
  const isClinicOrAdmin = status === "authenticated" && role !== "client";
  const isAuthenticated = status === "authenticated";

  const panelHref = role === "admin" ? "/portal/admin" : role === "client" ? "/portal/moje-rezerwacje" : "/portal/panel";
  const panelLabel = role === "admin" ? "Panel admina" : role === "client" ? "Moje rezerwacje" : "Panel";
  const notifHref = role === "admin" ? "/portal/admin/powiadomienia" : role === "client" ? "/portal/powiadomienia" : "/portal/panel/powiadomienia";
  const msgHref = role === "admin" ? "/portal/admin/wiadomosci" : role === "client" ? "/portal/wiadomosci" : "/portal/panel/wiadomosci";

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-neutral-200/80 bg-white max-lg:backdrop-blur-none lg:bg-white/95 lg:backdrop-blur-md">
        {/* Topbar */}
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

          {/* Logo */}
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

          {/* Nav desktop */}
          <nav className="hidden items-center gap-6 md:flex">
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

          {/* Prawa strona — ikony + dropdown użytkownika */}
          <div className="flex shrink-0 items-center gap-2">
            {!isAuthenticated && (
              quiz ? (
                <button
                  type="button"
                  onClick={quiz.openModal}
                  className="hidden rounded-full bg-pink-500 px-4 py-2 font-[var(--font-sans)] text-[13px] font-medium text-white shadow-sm transition-all hover:bg-pink-600 sm:block"
                >
                  Rozpocznij analizę
                </button>
              ) : (
                <Link
                  href="/portal"
                  className="hidden rounded-full bg-pink-500 px-4 py-2 font-[var(--font-sans)] text-[13px] font-medium text-white shadow-sm transition-all hover:bg-pink-600 sm:block"
                >
                  Rozpocznij analizę
                </Link>
              )
            )}
            {isAuthenticated && (
              <>
                <NotificationBell notificationsHref={notifHref} />
                <MessagesBell messagesHref={msgHref} />
                {/* Dropdown użytkownika */}
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
                    <ChevronDown className={`h-4 w-4 shrink-0 text-[#6F5E64] transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
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
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#4a3f42] hover:bg-neutral-100 md:hidden"
              aria-label={mobileOpen ? "Zamknij menu" : "Otwórz menu"}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Wyszukiwarka — długi box pod topbarem */}
        <div ref={searchRef} className="hidden border-t border-neutral-200/70 bg-white md:block">
          <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6 lg:px-8">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6F5E64]" />
              <input
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(true)}
                placeholder="Szukaj gabinetu lub zabiegu"
                className="h-11 w-full rounded-xl border border-neutral-200 bg-neutral-50/80 pl-11 pr-4 text-[14px] text-[#1F1A1C] outline-none transition placeholder:text-[#6F5E64] focus:border-pink-300 focus:bg-white focus:ring-2 focus:ring-pink-100"
              />
              {searchOpen && query.trim().length >= 2 && (
                <div className="absolute left-0 right-0 z-50 mt-2 rounded-2xl border border-neutral-200 bg-white p-3 shadow-xl">
                  {searchLoading ? (
                    <p className="px-2 py-1 text-[13px] text-[#6F5E64]">Szukam…</p>
                  ) : searchClinics.length === 0 && searchTreatments.length === 0 ? (
                    <p className="px-2 py-1 text-[13px] text-[#6F5E64]">Brak wyników.</p>
                  ) : (
                    <div className="space-y-3">
                      {searchClinics.length > 0 && (
                        <div>
                          <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-[#6F5E64]">
                            Gabinety
                          </p>
                          <div className="space-y-1">
                            {searchClinics.map((c) => (
                              <Link
                                key={c.id}
                                href={`/portal/gabinet/${c.slug}`}
                                onClick={() => setSearchOpen(false)}
                                className="block rounded-xl px-2 py-2 hover:bg-pink-50"
                              >
                                <p className="text-[14px] font-medium text-[#1F1A1C]">{c.name}</p>
                                <p className="text-[12px] text-[#6F5E64]">{c.city}</p>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                      {searchTreatments.length > 0 && (
                        <div>
                          <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-[#6F5E64]">
                            Zabiegi
                          </p>
                          <div className="space-y-1">
                            {searchTreatments.map((t) => (
                              <Link
                                key={t.id}
                                href={`/portal/gabinety?zabieg=${encodeURIComponent(t.id)}`}
                                onClick={() => setSearchOpen(false)}
                                className="block rounded-xl px-2 py-2 hover:bg-pink-50"
                              >
                                <p className="text-[14px] font-medium text-[#1F1A1C]">{t.nazwa}</p>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile menu drawer */}
      <div
        className={`fixed left-0 right-0 top-14 z-40 bg-white shadow-xl transition-transform duration-200 md:hidden ${
          mobileOpen ? "translate-y-0" : "-translate-y-full pointer-events-none"
        }`}
      >
        <nav className="flex flex-col divide-y divide-neutral-100">
          <div className="px-6 py-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6F5E64]" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Szukaj gabinetu lub zabiegu"
                className="h-10 w-full rounded-full border border-neutral-200 bg-white pl-9 pr-4 text-[13px] text-[#1F1A1C] outline-none transition focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
              />
            </div>
            {query.trim().length >= 2 && (
              <div className="mt-2 max-h-56 space-y-2 overflow-y-auto rounded-xl border border-neutral-100 bg-neutral-50 p-2">
                {searchLoading ? (
                  <p className="px-2 py-1 text-[13px] text-[#6F5E64]">Szukam…</p>
                ) : (
                  <>
                    {searchClinics.map((c) => (
                      <Link
                        key={`m-clinic-${c.id}`}
                        href={`/portal/gabinet/${c.slug}`}
                        onClick={() => setMobileOpen(false)}
                        className="block rounded-lg bg-white px-3 py-2 text-[13px] text-[#1F1A1C]"
                      >
                        {c.name} <span className="text-[#6F5E64]">({c.city})</span>
                      </Link>
                    ))}
                    {searchTreatments.map((t) => (
                      <Link
                        key={`m-treatment-${t.id}`}
                        href={`/portal/gabinety?zabieg=${encodeURIComponent(t.id)}`}
                        onClick={() => setMobileOpen(false)}
                        className="block rounded-lg bg-white px-3 py-2 text-[13px] text-[#1F1A1C]"
                      >
                        {t.nazwa}
                      </Link>
                    ))}
                    {searchClinics.length === 0 && searchTreatments.length === 0 && (
                      <p className="px-2 py-1 text-[13px] text-[#6F5E64]">Brak wyników.</p>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
          {isAuthenticated && (
            <div className="px-6 py-3">
              <p className="text-[12px] uppercase tracking-wide text-[#6F5E64]">Zalogowano jako</p>
              <p className="mt-0.5 truncate font-[var(--font-sans)] text-[14px] font-medium text-[#1F1A1C]">
                {identityLabel} <span className="text-[#6F5E64]">({roleLabel})</span>
              </p>
            </div>
          )}
          {/* Linki nawigacji */}
          {NAV.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className="px-6 py-4 font-[var(--font-sans)] text-[15px] font-medium text-[#1F1A1C] hover:bg-pink-50 hover:text-pink-600 transition-colors"
            >
              {label}
            </Link>
          ))}

          {/* Separator */}
          <div className="h-px bg-neutral-200" />

          {/* Akcje zalogowanego */}
          {isAuthenticated ? (
            <>
              <Link
                href={panelHref}
                onClick={() => setMobileOpen(false)}
                className="px-6 py-4 font-[var(--font-sans)] text-[15px] font-medium text-[#4a3f42] hover:bg-pink-50 hover:text-pink-600 transition-colors"
              >
                {panelLabel}
              </Link>
              {role === "client" && (
                <Link
                  href="/portal/ustawienia"
                  onClick={() => setMobileOpen(false)}
                  className="px-6 py-4 font-[var(--font-sans)] text-[15px] font-medium text-[#4a3f42] hover:bg-pink-50 hover:text-pink-600 transition-colors"
                >
                  Ustawienia
                </Link>
              )}
              <button
                type="button"
                onClick={() => { setMobileOpen(false); signOut({ callbackUrl: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/portal` }); }}
                className="px-6 py-4 text-left font-[var(--font-sans)] text-[15px] font-medium text-[#6F5E64] hover:bg-neutral-50 transition-colors"
              >
                Wyloguj
              </button>
            </>
          ) : (
            <>
              <Link
                href="/portal"
                onClick={() => setMobileOpen(false)}
                className="mx-4 my-4 block rounded-full bg-pink-500 px-6 py-3 text-center font-[var(--font-sans)] text-[15px] font-medium text-white hover:bg-pink-600"
              >
                Rozpocznij analizę
              </Link>
              <Link
                href="/portal/login"
                onClick={() => setMobileOpen(false)}
                className="px-6 py-4 font-[var(--font-sans)] text-[15px] font-medium text-[#6F5E64] hover:bg-neutral-50 transition-colors"
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
