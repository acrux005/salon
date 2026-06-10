"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { ODART_SERVICES, type OdartServiceItem } from "@/components/odart/odartNav";

type Props = {
  isActive: boolean;
  label?: string;
  services?: readonly OdartServiceItem[];
};

export function OdartServicesDropdown({ isActive, label = "Usługi", services = ODART_SERVICES }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setOpen(true)}
        className={`flex items-center gap-1 hover:text-white whitespace-nowrap ${
          isActive ? "text-white font-semibold" : ""
        }`}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={`${label} - rozwiń menu`}
      >
        {label}
        <ChevronDown
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>
      <div
        onMouseLeave={() => setOpen(false)}
        className={`absolute left-0 top-full z-50 mt-1 min-w-[260px] overflow-hidden rounded-lg border border-white/10 bg-neutral-950 py-2 shadow-xl ${
          open ? "block" : "hidden"
        }`}
      >
        {services.map((s, i) => (
          <Link
            key={s.href}
            href={s.href}
            className={`block px-4 py-2.5 text-sm transition hover:bg-white/5 hover:text-white ${
              i === 0 ? "border-b border-white/10 font-semibold text-odart-accent" : "text-neutral-300"
            }`}
            onClick={() => setOpen(false)}
          >
            {s.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
