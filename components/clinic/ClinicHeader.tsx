"use client";

import Link from "next/link";
import { Search, ShoppingBag } from "lucide-react";
import { clinicDemo } from "@/content/clinicDemo";

export function ClinicHeader() {
  const { header, siteName, siteTagline } = clinicDemo;
  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200/80 bg-white max-lg:backdrop-blur-none lg:bg-white/95 lg:backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex flex-shrink-0 items-center gap-2">
          <span className="font-[var(--font-serif)] text-xl font-medium text-[#1F1A1C]">
            {siteName}
          </span>
          <span className="hidden text-[13px] text-neutral-500 sm:inline">
            {siteTagline}
          </span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {header.nav.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="font-[var(--font-sans)] text-[14px] font-medium text-[#4a3f42] transition-colors hover:text-pink-600"
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end gap-2 sm:gap-4 md:flex-initial">
          <div className="hidden w-36 items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50/80 px-3 py-2 sm:flex lg:w-44">
            <Search className="h-4 w-4 shrink-0 text-neutral-400" />
            <input
              type="search"
              placeholder={header.searchPlaceholder}
              className="w-full bg-transparent text-[13px] text-[#1F1A1C] placeholder:text-neutral-400 outline-none"
              aria-label="Szukaj"
            />
          </div>
          <Link
            href="/koszyk"
            className="relative flex items-center justify-center rounded-full p-2 text-[#4a3f42] hover:bg-neutral-100"
            aria-label="Koszyk"
          >
            <ShoppingBag className="h-5 w-5" />
            {header.cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-pink-500 text-[10px] font-medium text-white">
                {header.cartCount}
              </span>
            )}
          </Link>
          <Link
            href={header.ctaHref}
            className="rounded-full bg-pink-500 px-4 py-2.5 font-[var(--font-sans)] text-[14px] font-medium text-white shadow-sm transition-colors hover:bg-pink-600"
          >
            {header.ctaLabel}
          </Link>
        </div>
      </div>
    </header>
  );
}
