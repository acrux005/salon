"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { ADMIN_ROLE, CLIENT_ROLE, RESTAURANT_ROLE } from "@/lib/auth";

type ZamowTopHeaderProps = {
  /** np. „← Restauracje” lub „← nazwa restauracji” */
  leading?: React.ReactNode;
  /** Domyślnie: przyklejony (np. strona menu) */
  sticky?: boolean;
  /** Na liście restauracji drugi link „Restauracje” jest zbędny w nav */
  showRestauracjeNavLink?: boolean;
};

export function ZamowTopHeader({
  leading,
  sticky = false,
  showRestauracjeNavLink = true,
}: ZamowTopHeaderProps) {
  const { data: session, status } = useSession();
  const role = (session?.user as { role?: string })?.role;

  const showRestaurantPanel =
    status === "authenticated" &&
    role !== CLIENT_ROLE &&
    (role === RESTAURANT_ROLE || role === ADMIN_ROLE);

  const headerClass = [
    "border-b border-zamow-orange-200 bg-white",
    sticky ? "sticky top-0 z-10" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={headerClass}>
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {leading}
          <Link href="/" className="font-display shrink-0 text-lg font-semibold text-zamow-orange-600">
            Zamów
          </Link>
          {showRestauracjeNavLink && (
            <Link href="/restauracje" className="truncate text-sm font-medium text-stone-900 hover:text-zamow-orange-600">
              Restauracje
            </Link>
          )}
          <Link
            href="/sprawdz-dostawe"
            className="truncate max-w-[28vw] text-xs font-medium text-stone-700 hover:text-zamow-orange-600 sm:max-w-none sm:text-sm"
          >
            Sprawdź kod
          </Link>
        </div>
        <nav className="flex shrink-0 items-center gap-3 sm:gap-4">
          {showRestaurantPanel && (
            <>
              <Link href="/panel" className="text-sm text-stone-600 hover:text-zamow-orange-600">
                Panel
              </Link>
              <Link href="/panel/menu" className="text-sm text-stone-600 hover:text-zamow-orange-600">
                Menu
              </Link>
              <Link href="/panel/zamowienia" className="text-sm text-stone-600 hover:text-zamow-orange-600">
                Zamówienia
              </Link>
              <Link href="/panel/ustawienia" className="text-sm text-stone-600 hover:text-zamow-orange-600">
                Ustawienia
              </Link>
            </>
          )}
          {status === "authenticated" ? (
            <form action="/api/auth/signout" method="POST">
              <button
                type="submit"
                className="text-sm font-medium text-stone-600 hover:text-zamow-orange-600"
              >
                Wyloguj
              </button>
            </form>
          ) : (
            <Link
              href="/panel/logowanie"
              className="rounded-full bg-zamow-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-zamow-orange-500"
            >
              Zaloguj
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
