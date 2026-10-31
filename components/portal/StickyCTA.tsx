"use client";

import Link from "next/link";

export function StickyCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-neutral-200 bg-white p-3 lg:hidden">
      <Link
        href="/portal/dodaj-salon"
        className="block w-full rounded-full bg-pink-500 py-3 text-center font-[var(--font-sans)] text-[15px] font-medium text-white hover:bg-pink-600"
      >
        Dodaj swój salon
      </Link>
    </div>
  );
}
