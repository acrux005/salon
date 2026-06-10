import Link from "next/link";
import {
  Calendar,
  Syringe,
  MessageSquare,
  Users,
  Stethoscope,
  Clock,
  Settings,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import { WetPanelOnboardingChecklist } from "@/components/wet/WetPanelOnboardingChecklist";
import { WetDashboardWidgets } from "@/components/wet/WetDashboardWidgets";
import type { PanelChecklistItem } from "@/lib/vet/panelChecklist";
import type { DashboardWidgets } from "@/lib/vet/dashboardData";
import { panelStateClasses } from "@/lib/vet/panelStates";

type Props = {
  clinicName: string;
  publicProfileHref: string;
  todayVisits: number;
  overdueVaccinations: number;
  vaccinationsToday: number;
  unreadMessages: number;
  checklistItems: PanelChecklistItem[];
  widgets: DashboardWidgets;
};

type QuickAction = {
  href: string;
  label: string;
  description: string;
  icon: typeof Calendar;
  primary?: boolean;
};

const QUICK_ACTIONS: QuickAction[] = [
  {
    href: "/wet/panel/kalendarz",
    label: "Kalendarz wizyt",
    description: "Planuj i zarządzaj terminami",
    icon: Calendar,
    primary: true,
  },
  {
    href: "/wet/panel/zwierzeta/lista",
    label: "Zwierzęta",
    description: "Kartoteka pacjentów i stad",
    icon: Users,
  },
  {
    href: "/wet/panel/szczepienia",
    label: "Szczepienia",
    description: "Terminy i przypomnienia",
    icon: Syringe,
  },
  {
    href: "/wet/panel/klienci/wiadomosci",
    label: "Wiadomości",
    description: "SMS i e-mail do klientów",
    icon: MessageSquare,
  },
  {
    href: "/wet/panel/lekarze",
    label: "Zespół",
    description: "Lekarze i personel",
    icon: Stethoscope,
  },
  {
    href: "/wet/panel/godziny-pracy",
    label: "Godziny pracy",
    description: "Dostępność rezerwacji online",
    icon: Clock,
  },
  {
    href: "/wet/panel/przychodnia",
    label: "Ustawienia",
    description: "Dane przychodni i profil",
    icon: Settings,
  },
];

function formatTodayPl() {
  return new Intl.DateTimeFormat("pl-PL", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());
}

export function WetPanelDashboardHome({
  clinicName,
  publicProfileHref,
  todayVisits,
  overdueVaccinations,
  vaccinationsToday,
  unreadMessages,
  checklistItems,
  widgets,
}: Props) {
  const dateLabel = formatTodayPl();

  return (
    <div className="px-4 py-8 lg:px-10 lg:py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[13px] font-medium capitalize text-wet-teal">{dateLabel}</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-wet-navy sm:text-3xl">
            Dzień dobry, {clinicName}
          </h1>
          <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-wet-navy-muted">
            Podgląd na dziś — pacjenci, szczepienia i wiadomości w jednym miejscu.
          </p>
        </div>
        <Link
          href={publicProfileHref}
          className="inline-flex shrink-0 items-center gap-2 self-start rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-[13px] font-medium text-wet-teal-800 transition hover:border-wet-teal/30 hover:bg-wet-teal-50"
        >
          <ExternalLink className="h-4 w-4" aria-hidden />
          Profil publiczny
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Wizyty dziś" value={todayVisits} state={todayVisits > 0 ? "urgent" : "active"} href="/wet/panel/kalendarz" />
        <StatCard
          label="Szczepienia dziś"
          value={vaccinationsToday}
          state={vaccinationsToday > 0 ? "urgent" : "neutral"}
          href="/wet/panel/szczepienia"
        />
        <StatCard
          label="Zaległe szczepy"
          value={overdueVaccinations}
          state={overdueVaccinations > 0 ? "overdue" : "active"}
          href="/wet/panel/szczepienia"
        />
        <StatCard
          label="Nowe wiadomości"
          value={unreadMessages}
          state={unreadMessages > 0 ? "urgent" : "neutral"}
          href="/wet/panel/klienci/wiadomosci"
        />
      </div>

      <WetDashboardWidgets widgets={widgets} />

      <WetPanelOnboardingChecklist items={checklistItems} />

      <h2 className="mt-10 text-[13px] font-semibold uppercase tracking-wider text-slate-400">
        Szybkie akcje
      </h2>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.href}
              href={action.href}
              className={`group flex items-start gap-4 rounded-2xl border p-5 transition ${
                action.primary
                  ? "border-wet-teal/30 bg-gradient-to-br from-wet-teal-50 to-white shadow-sm shadow-wet-teal/10 hover:border-wet-teal/50 hover:shadow-md"
                  : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm"
              }`}
            >
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                  action.primary
                    ? "bg-wet-teal text-white shadow-md shadow-wet-teal/25"
                    : "bg-slate-100 text-slate-600 group-hover:bg-wet-teal/10 group-hover:text-wet-teal"
                }`}
              >
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1 font-semibold text-wet-navy">
                  {action.label}
                  <ArrowRight
                    className="h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-wet-teal"
                    aria-hidden
                  />
                </span>
                <span className="mt-0.5 block text-[13px] leading-snug text-wet-navy-muted">
                  {action.description}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  state,
  href,
}: {
  label: string;
  value: number;
  state: "active" | "overdue" | "urgent" | "neutral";
  href: string;
}) {
  const cls = panelStateClasses(state);

  return (
    <Link
      href={href}
      className={`block rounded-2xl border p-4 shadow-sm transition hover:shadow-md sm:p-5 ${cls.border} ${cls.bg}`}
    >
      <p className={`text-2xl font-bold tabular-nums sm:text-3xl ${cls.text}`}>{value}</p>
      <p className="mt-1 text-[12px] font-medium text-wet-navy-muted sm:text-[13px]">{label}</p>
    </Link>
  );
}
