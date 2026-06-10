"use client";

import type { LucideIcon } from "lucide-react";
import { WetLink } from "@/components/wet/WetLink";

export function WetPanelNavLink({
  href,
  label,
  icon: Icon,
  active,
  compact,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
  compact?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <WetLink
      href={href}
      onClick={onNavigate}
      className={`group flex items-center gap-3 rounded-xl transition ${
        compact ? "px-2.5 py-2 text-[13px]" : "px-3 py-2.5 text-[14px]"
      } font-medium ${
        active
          ? "bg-wet-teal/10 text-wet-teal-900 shadow-sm shadow-wet-teal/5 ring-1 ring-wet-teal/15"
          : "text-slate-600 hover:bg-slate-50 hover:text-wet-navy"
      }`}
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition ${
          active
            ? "bg-wet-teal text-white shadow-md shadow-wet-teal/25"
            : "bg-slate-100 text-slate-500 group-hover:bg-wet-teal/10 group-hover:text-wet-teal"
        }`}
      >
        <Icon className="h-4 w-4" aria-hidden />
      </span>
      <span className="min-w-0 truncate">{label}</span>
    </WetLink>
  );
}
