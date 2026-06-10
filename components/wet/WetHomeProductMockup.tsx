import type { ReactNode } from "react";
import {
  Bell,
  Calendar,
  Cat,
  Check,
  Dog,
  MessageSquare,
  PawPrint,
  Sparkles,
  Syringe,
} from "lucide-react";

const APPOINTMENTS = [
  {
    time: "09:30",
    pet: "Luna",
    species: "cat" as const,
    owner: "Anna Kowalska",
    service: "Szczepienie przeciw wściekliźnie",
    tag: "Szczepienie",
    tagClass: "bg-violet-100 text-violet-900",
    rowClass: "border-violet-100/80 bg-violet-50/40",
  },
  {
    time: "11:00",
    pet: "Burek",
    species: "dog" as const,
    owner: "Piotr Nowak",
    service: "Kontrola pooperacyjna",
    tag: "Wizyta",
    tagClass: "bg-sky-100 text-sky-900",
    rowClass: "border-sky-100/80 bg-sky-50/40",
  },
  {
    time: "14:15",
    pet: "Mruczek",
    species: "cat" as const,
    owner: "Maria Wiśniewska",
    service: "Kompleks szczepień kocięcia",
    tag: "Szczepienie",
    tagClass: "bg-violet-100 text-violet-900",
    rowClass: "border-violet-100/80 bg-violet-50/40",
  },
] as const;

/** Statyczny mockup panelu — w hero (dane weterynaryjne, nie generyczny SaaS). */
export function WetHomeHeroMockup() {
  return (
    <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-amber-200/40 blur-2xl wet-home-float-slow"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-8 -left-4 h-32 w-32 rounded-full bg-wet-teal/25 blur-2xl wet-home-float-delay"
        aria-hidden
      />

      <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_28px_70px_-16px_rgba(15,23,42,0.28)] ring-1 ring-slate-900/5 transition-transform duration-500 hover:-translate-y-1">
        <div className="flex items-center gap-2 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" aria-hidden />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" aria-hidden />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" aria-hidden />
          <span className="ml-2 truncate text-[12px] font-medium text-slate-500">
            Przychodnia VetCare · Kołobrzeg
          </span>
        </div>

        <div className="grid gap-0 lg:grid-cols-5">
          <div className="border-b border-slate-100 bg-gradient-to-b from-wet-teal-950 to-teal-950 p-4 text-white lg:col-span-1 lg:border-b-0 lg:border-r">
            <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-wet-teal-200">
              <PawPrint className="h-3.5 w-3.5" aria-hidden />
              Panel wet
            </p>
            <nav className="mt-4 space-y-1 text-[13px]">
              {[
                { label: "Pulpit", active: false },
                { label: "Kalendarz", active: true },
                { label: "Szczepienia", active: false },
                { label: "Pacjenci", active: false },
              ].map((item) => (
                <div
                  key={item.label}
                  className={`rounded-lg px-3 py-2 transition-colors ${
                    item.active ? "bg-wet-teal/25 font-semibold text-white shadow-inner" : "text-slate-400"
                  }`}
                >
                  {item.label}
                </div>
              ))}
            </nav>
            <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="flex items-center gap-1.5 text-[11px] font-medium text-teal-100">
                <Bell className="h-3.5 w-3.5" aria-hidden />
                SMS jutro
              </p>
              <p className="mt-1 text-[12px] text-white/90">Luna — szczepienie za 7 dni</p>
            </div>
          </div>

          <div className="p-4 lg:col-span-4 lg:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[12px] font-medium text-wet-teal">Wtorek, 19 maja</p>
                <p className="mt-0.5 text-lg font-bold text-wet-navy">Recepcja — dzisiejsze wizyty</p>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-wet-teal/10 px-3 py-1 text-[12px] font-semibold text-wet-teal-800">
                <Sparkles className="h-3.5 w-3.5" aria-hidden />3 pacjentów
              </span>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <MiniStat label="Wizyty dziś" value="3" tone="teal" />
              <MiniStat label="Zaległe szczepy" value="2" tone="amber" />
              <MiniStat label="SMS (7 dni)" value="11" tone="slate" />
            </div>

            <ul className="mt-4 space-y-2.5">
              {APPOINTMENTS.map((row) => (
                <li
                  key={row.time}
                  className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 transition hover:shadow-md ${row.rowClass}`}
                >
                  <PetAvatar species={row.species} name={row.pet} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold text-wet-navy">
                      {row.pet} · {row.service}
                    </p>
                    <p className="truncate text-[11px] text-wet-navy-muted">
                      {row.time} · {row.owner}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${row.tagClass}`}
                  >
                    {row.tag}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function PetAvatar({ species, name }: { species: "cat" | "dog"; name: string }) {
  const Icon = species === "cat" ? Cat : Dog;
  const bg = species === "cat" ? "bg-orange-100 text-orange-700" : "bg-amber-100 text-amber-800";

  return (
    <span
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${bg}`}
      title={name}
      aria-hidden
    >
      <Icon className="h-5 w-5" />
    </span>
  );
}

function MiniStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "teal" | "amber" | "slate";
}) {
  const styles = {
    teal: "from-wet-teal-50 to-white border-teal-100/80 text-wet-teal",
    amber: "from-amber-50 to-white border-amber-100 text-amber-800",
    slate: "from-slate-50 to-white border-slate-100 text-wet-navy",
  }[tone];

  return (
    <div className={`rounded-xl border bg-gradient-to-br p-2.5 shadow-sm ${styles}`}>
      <p className="text-xl font-bold tabular-nums">{value}</p>
      <p className="mt-0.5 text-[10px] font-medium leading-tight text-wet-navy-muted">{label}</p>
    </div>
  );
}

export function WetHomePreviewCards() {
  return (
    <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
      <PreviewCard
        icon={Syringe}
        title="Harmonogram szczepień"
        caption="Zaległe terminy na pierwszy rzut oka"
        accent="amber"
        featured
      >
        <div className="space-y-2">
          {[
            { pet: "Luna", species: "cat" as const, vaccine: "Wścieklizna", status: "Za 7 dni", ok: true },
            { pet: "Reksio", species: "dog" as const, vaccine: "Nosówka", status: "Zaległe", ok: false },
            { pet: "Burek", species: "dog" as const, vaccine: "Kaszczek", status: "Za 30 dni", ok: true },
          ].map((row) => (
            <div
              key={row.pet}
              className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white px-3 py-2.5 transition hover:border-amber-200 hover:shadow-md"
            >
              <PetAvatar species={row.species} name={row.pet} />
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-wet-navy">{row.pet}</p>
                <p className="text-[11px] text-wet-navy-muted">{row.vaccine}</p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  row.ok ? "bg-emerald-100 text-emerald-900" : "bg-amber-100 text-amber-900"
                }`}
              >
                {row.status}
              </span>
            </div>
          ))}
        </div>
      </PreviewCard>

      <PreviewCard icon={Calendar} title="Kalendarz wizyt" caption="Recepcja + rezerwacja online" accent="teal">
        <div className="space-y-2">
          {APPOINTMENTS.map((row) => (
            <div
              key={row.time}
              className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 transition hover:shadow-md ${row.rowClass}`}
            >
              <PetAvatar species={row.species} name={row.pet} />
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-semibold text-wet-navy">
                  {row.time} · {row.pet}
                </p>
                <p className="truncate text-[11px] text-wet-navy-muted">{row.service}</p>
              </div>
            </div>
          ))}
        </div>
      </PreviewCard>

      <PreviewCard
        icon={MessageSquare}
        title="Start w 5 minut"
        caption="Konfiguracja bez wdrożeniowca"
        accent="navy"
      >
        <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-2 text-[11px] font-medium text-wet-navy-muted">
            <span>Etap 2 · Plan i SMS</span>
            <span className="font-semibold text-wet-teal">50%</span>
          </div>
          <div className="mx-auto h-1.5 max-w-[220px] overflow-hidden rounded-full bg-slate-200">
            <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-wet-teal to-teal-400" />
          </div>
          <ul className="mt-4 space-y-2 text-[12px]">
            <li className="flex items-center gap-2 text-wet-navy-muted">
              <Check className="h-3.5 w-3.5 text-wet-teal" aria-hidden />
              Dane przychodni
            </li>
            <li className="flex items-center gap-2 font-medium text-wet-navy">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-wet-navy text-[10px] text-white">
                2
              </span>
              Przypomnienia 30 / 7 / 0 dni
            </li>
            <li className="flex items-center gap-2 text-slate-400">Godziny otwarcia</li>
          </ul>
        </div>
      </PreviewCard>
    </div>
  );
}

function PreviewCard({
  icon: Icon,
  title,
  caption,
  accent,
  featured,
  children,
}: {
  icon: typeof Calendar;
  title: string;
  caption: string;
  accent: "teal" | "amber" | "navy";
  featured?: boolean;
  children: ReactNode;
}) {
  const iconStyles = {
    teal: "bg-wet-teal text-white shadow-lg shadow-wet-teal/30",
    amber: "bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30",
    navy: "bg-wet-navy text-white shadow-lg shadow-wet-navy/20",
  }[accent];

  return (
    <article
      className={`overflow-hidden rounded-2xl border bg-gradient-to-b from-white to-slate-50/90 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl ${
        featured
          ? "border-amber-200/80 ring-2 ring-amber-100 lg:-mt-2 lg:mb-2"
          : "border-wet-teal-100 hover:border-wet-teal/30"
      }`}
    >
      <div className="border-b border-slate-100/80 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconStyles}`}>
            <Icon className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <h3 className="font-semibold text-wet-navy">{title}</h3>
            <p className="text-[13px] text-wet-navy-muted">{caption}</p>
          </div>
        </div>
      </div>
      <div className="p-4">{children}</div>
    </article>
  );
}

export function WetHomeHeroDecor() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_20%,rgba(13,148,136,0.12),transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%230d9488' fill-opacity='0.07'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-22V8h-2v4h-4v2h4v4h2V16h4v-2h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute right-[8%] top-[18%] hidden text-wet-teal/20 lg:block wet-home-float">
        <PawPrint className="h-16 w-16" strokeWidth={1.25} aria-hidden />
      </div>
      <div className="pointer-events-none absolute bottom-[22%] left-[6%] hidden text-amber-500/15 lg:block wet-home-float-delay">
        <Syringe className="h-14 w-14" strokeWidth={1.25} aria-hidden />
      </div>
    </>
  );
}
