"use client";

import { GabLink } from "@/components/gabinetPlatform/GabLink";
import { useGabinetBrand } from "@/components/gabinetPlatform/useGabinetBrand";

export function FooterGab() {
  const brand = useGabinetBrand();
  return (
    <footer className="mt-auto w-full min-w-0 border-t border-gab-sky/30 bg-gab-navy text-sky-100">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="text-lg font-bold text-white">{brand.brandName}</p>
            <p className="mt-2 max-w-sm text-[14px] text-slate-400">
              Wizyty, kalendarz, pacjenci i recall dla gabinetów.
            </p>
          </div>
          <div className="flex flex-col gap-2 text-[14px]">
            <GabLink href="/gabinety" className="inline-flex min-h-11 items-center hover:text-white">
              Znajdź gabinet
            </GabLink>
            <GabLink href="/dla-gabinetow" className="inline-flex min-h-11 items-center hover:text-white">
              Dla gabinetów
            </GabLink>
            <GabLink href="/register" className="inline-flex min-h-11 items-center hover:text-white">
              Rejestracja
            </GabLink>
            <a href="mailto:biuro@odart.pl" className="inline-flex min-h-11 items-center hover:text-white">
              biuro@odart.pl
            </a>
          </div>
        </div>
        <p className="mt-8 text-[13px] text-slate-500">
          © {new Date().getFullYear()} ODART — {brand.brandName}
          {" · "}
          <a href="https://zaamow.pl" className="hover:text-white">
            Strony WWW: zaamow.pl
          </a>
        </p>
      </div>
    </footer>
  );
}
