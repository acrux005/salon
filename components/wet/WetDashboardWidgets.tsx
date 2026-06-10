import Link from "next/link";
import { ArrowRight, Layers, MessageSquare, PawPrint, Syringe } from "lucide-react";
import type { DashboardWidgets } from "@/lib/vet/dashboardData";
import { panelStateClasses, vaccinationStateLabel, type PanelStateKind } from "@/lib/vet/panelStates";
import { speciesLabel } from "@/lib/vet/species";
import { WetOwnerAvatar, WetSpeciesAvatar } from "@/components/wet/WetSpeciesAvatar";

type Props = {
  widgets: DashboardWidgets;
};

function formatRelative(iso: string): string {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  if (diff < 86400000) {
    return d.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" });
  }
  return d.toLocaleDateString("pl-PL", { day: "numeric", month: "short" });
}

function WidgetShell({
  title,
  icon: Icon,
  href,
  badge,
  children,
}: {
  title: string;
  icon: typeof PawPrint;
  href: string;
  badge?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-wet-teal/10 text-wet-teal">
            <Icon className="h-4 w-4" aria-hidden />
          </span>
          <h3 className="text-[14px] font-semibold text-wet-navy">{title}</h3>
        </div>
        {badge && (
          <span className="rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-bold text-red-700">{badge}</span>
        )}
      </div>
      <div className="flex-1 divide-y divide-slate-50">{children}</div>
      <Link
        href={href}
        className="flex items-center justify-center gap-1 border-t border-slate-100 px-4 py-2.5 text-[12px] font-medium text-wet-teal hover:bg-wet-teal-50/50"
      >
        Zobacz wszystkie
        <ArrowRight className="h-3.5 w-3.5" aria-hidden />
      </Link>
    </section>
  );
}

function StateBadge({ state }: { state: PanelStateKind }) {
  const cls = panelStateClasses(state);
  return (
    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${cls.badge}`}>
      {vaccinationStateLabel(state)}
    </span>
  );
}

export function WetDashboardWidgets({ widgets }: Props) {
  const vaccItems =
    widgets.vaccinationsToday.length > 0
      ? widgets.vaccinationsToday
      : widgets.overdueVaccinationsList.slice(0, 5);

  return (
    <div className="mt-8">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-[13px] font-semibold uppercase tracking-wider text-slate-400">Na dziś</h2>
          <p className="mt-0.5 text-[13px] text-wet-navy-muted">Pacjenci, szczepienia i wiadomości wymagające uwagi</p>
        </div>
        <div className="flex flex-wrap gap-2 text-[11px]">
          <LegendDot kind="active" label="Aktywne" />
          <LegendDot kind="overdue" label="Zaległe" />
          <LegendDot kind="urgent" label="Pilne / dziś" />
          <LegendDot kind="noSms" label="Brak SMS" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <WidgetShell title="Ostatnie zwierzęta" icon={PawPrint} href="/wet/panel/zwierzeta/lista">
          {widgets.recentPets.length === 0 ? (
            <p className="px-4 py-8 text-center text-[13px] text-wet-navy-muted">
              Brak pacjentów —{" "}
              <Link href="/wet/panel/zwierzeta/nowe" className="font-medium text-wet-teal hover:underline">
                dodaj pierwsze zwierzę
              </Link>
            </p>
          ) : (
            widgets.recentPets.map((p) => (
              <Link
                key={p.id}
                href={`/wet/panel/zwierzeta/${p.id}`}
                className="flex items-center gap-3 px-4 py-3 transition hover:bg-wet-mint/30"
              >
                <WetSpeciesAvatar species={p.species} name={p.name} size="md" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium text-wet-navy">{p.name}</span>
                  <span className="block truncate text-[12px] text-wet-navy-muted">
                    {speciesLabel(p.species)} · {p.ownerName}
                  </span>
                </span>
                {!p.smsConsent ? (
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${panelStateClasses("noSms").badge}`}>
                    Brak SMS
                  </span>
                ) : (
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${panelStateClasses("active").badge}`}>
                    Aktywne
                  </span>
                )}
              </Link>
            ))
          )}
        </WidgetShell>

        <WidgetShell
          title={widgets.vaccinationsToday.length > 0 ? "Szczepienia dziś" : "Zaległe szczepienia"}
          icon={Syringe}
          href="/wet/panel/szczepienia"
          badge={
            widgets.vaccinationsToday.length > 0
              ? String(widgets.vaccinationsToday.length)
              : widgets.overdueVaccinationsList.length > 0
                ? `${widgets.overdueVaccinationsList.length} zaległych`
                : undefined
          }
        >
          {vaccItems.length === 0 ? (
            <p className="px-4 py-8 text-center text-[13px] text-wet-navy-muted">
              Brak szczepień na dziś — wszystko na bieżąco 🎉
            </p>
          ) : (
            vaccItems.map((v) => (
              <Link
                key={v.id}
                href={`/wet/panel/szczepienia?petId=${v.petId}`}
                className={`flex items-center gap-3 border-l-4 px-4 py-3 transition hover:bg-wet-mint/30 ${panelStateClasses(v.state).border}`}
              >
                <WetSpeciesAvatar species={v.species} name={v.petName} size="md" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium text-wet-navy">{v.petName}</span>
                  <span className="block truncate text-[12px] text-wet-navy-muted">{v.vaccineName}</span>
                </span>
                <StateBadge state={v.state} />
              </Link>
            ))
          )}
        </WidgetShell>

        <WidgetShell
          title="Nowe wiadomości"
          icon={MessageSquare}
          href="/wet/panel/klienci/wiadomosci"
          badge={widgets.unreadMessagesTotal > 0 ? String(widgets.unreadMessagesTotal) : undefined}
        >
          {widgets.newMessages.length === 0 ? (
            <p className="px-4 py-8 text-center text-[13px] text-wet-navy-muted">
              Brak nieprzeczytanych wiadomości
            </p>
          ) : (
            widgets.newMessages.map((m) => (
              <Link
                key={m.threadId}
                href="/wet/panel/klienci/wiadomosci"
                className="flex items-center gap-3 px-4 py-3 transition hover:bg-wet-mint/30"
              >
                <WetOwnerAvatar name={m.ownerName} size="md" />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="truncate font-medium text-wet-navy">{m.ownerName}</span>
                    <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${panelStateClasses("urgent").badge}`}>
                      {m.unreadCount}
                    </span>
                  </span>
                  <span className="block truncate text-[12px] text-wet-navy-muted">{m.preview}</span>
                </span>
                <span className="shrink-0 text-[11px] text-wet-navy-muted">{formatRelative(m.lastMessageAt)}</span>
              </Link>
            ))
          )}
        </WidgetShell>

        <WidgetShell title="Hodowle do obsłużenia" icon={Layers} href="/wet/panel/zwierzeta/stada/lista">
          {widgets.herdsNeedingVisit.length === 0 ? (
            <p className="px-4 py-8 text-center text-[13px] text-wet-navy-muted">
              Wszystkie stada bez zaległości
            </p>
          ) : (
            widgets.herdsNeedingVisit.map((h) => (
              <Link
                key={h.id}
                href={`/wet/panel/zwierzeta/stada/${h.id}`}
                className={`flex items-center gap-3 border-l-4 px-4 py-3 transition hover:bg-wet-mint/30 ${
                  h.reason === "overdue_vaccinations"
                    ? panelStateClasses("overdue").border
                    : panelStateClasses("urgent").border
                }`}
              >
                <WetSpeciesAvatar species={h.species} kind="herd" size="md" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium text-wet-navy">{h.name}</span>
                  <span className="block truncate text-[12px] text-wet-navy-muted">
                    {speciesLabel(h.species, "herd")}
                    {h.location ? ` · ${h.location}` : ""}
                  </span>
                </span>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    h.reason === "overdue_vaccinations"
                      ? panelStateClasses("overdue").badge
                      : panelStateClasses("urgent").badge
                  }`}
                >
                  {h.detail}
                </span>
              </Link>
            ))
          )}
        </WidgetShell>
      </div>
    </div>
  );
}

function LegendDot({ kind, label }: { kind: "active" | "overdue" | "urgent" | "noSms"; label: string }) {
  const cls = panelStateClasses(kind);
  return (
    <span className="inline-flex items-center gap-1.5 text-wet-navy-muted">
      <span className={`h-2 w-2 rounded-full ${cls.dot}`} aria-hidden />
      {label}
    </span>
  );
}
