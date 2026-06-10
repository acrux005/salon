"use client";

import type { LucideIcon } from "lucide-react";
import { GabLink } from "@/components/gabinetPlatform/GabLink";

export function GabPanelNavLink({
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
    <GabLink
      href={href}
      onClick={onNavigate}
      className={`group flex items-center gap-3 rounded-xl transition ${
        compact ? "px-2.5 py-2 text-[13px]" : "px-3 py-2.5 text-[14px]"
      } font-medium ${
        active
          ? "bg-gab-sky/10 text-sky-900 shadow-sm shadow-gab-sky/5 ring-1 ring-gab-sky/15"
          : "text-slate-600 hover:bg-slate-50 hover:text-gab-navy"
      }`}
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition ${
          active
            ? "bg-gab-sky text-white shadow-md shadow-gab-sky/25"
            : "bg-slate-100 text-slate-500 group-hover:bg-gab-sky/10 group-hover:text-gab-sky"
        }`}
      >
        <Icon className="h-4 w-4" aria-hidden />
      </span>
      <span className="min-w-0 truncate">{label}</span>
    </GabLink>
  );
}
