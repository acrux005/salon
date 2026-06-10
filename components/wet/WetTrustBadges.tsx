import { Database, Download, Lock, ShieldCheck } from "lucide-react";

const TRUST = [
  { icon: ShieldCheck, label: "Zgodność z RODO" },
  { icon: Lock, label: "Szyfrowane połączenie SSL" },
  { icon: Database, label: "Regularne kopie zapasowe" },
  { icon: Download, label: "Eksport danych na żądanie" },
] as const;

export function WetTrustBadges({ compact = false }: { compact?: boolean }) {
  return (
    <ul
      className={
        compact
          ? "mt-4 grid grid-cols-2 gap-2 text-[12px] text-wet-navy-muted"
          : "mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      }
    >
      {TRUST.map(({ icon: Icon, label }) => (
        <li
          key={label}
          className={
            compact
              ? "flex items-center gap-2"
              : "flex items-center gap-3 rounded-xl border border-wet-teal-100 bg-white/60 px-4 py-3 text-[13px] font-medium text-wet-navy"
          }
        >
          <Icon className={compact ? "h-3.5 w-3.5 shrink-0 text-wet-teal" : "h-4 w-4 shrink-0 text-wet-teal"} aria-hidden />
          {label}
        </li>
      ))}
    </ul>
  );
}
