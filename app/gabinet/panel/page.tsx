import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { gabPrisma } from "@/lib/gabinet/prismaGab";
import { getPrisma } from "@/lib/db";
import { GabPanelPageHeader } from "@/components/gabinetPlatform/GabPanelPageHeader";
import { GabLink } from "@/components/gabinetPlatform/GabLink";
import { BellRing, Calendar, ClipboardList, Receipt, UserRound, Users } from "lucide-react";
import { visitTypeLabel } from "@/lib/gabinet/visitTypes";
import { PLAN_STATUS_LABELS } from "@/lib/gabinet/fdiTeeth";

export default async function GabPanelDashboardPage() {
  const session = await getServerSession(authOptions);
  const gabClinicId = (session?.user as { gabClinicId?: string })?.gabClinicId ?? "";
  const today = new Date().toISOString().slice(0, 10);

  let todayAppointments = 0;
  let patientCount = 0;
  let clientCount = 0;
  let planCount = 0;
  let pendingReminders = 0;
  let openSettlements = 0;
  let onboardingDone = true;
  let recentAppointments: { id: string; date: string; time: string; patientName: string | null; visitType: string | null }[] = [];
  let recentPlans: { id: string; title: string; status: string; updatedAt: Date }[] = [];

  try {
    const prisma = gabPrisma();
    const db = getPrisma();
    [todayAppointments, patientCount, clientCount, planCount, pendingReminders, openSettlements, recentAppointments, recentPlans] =
      await Promise.all([
        prisma.gabAppointment.count({ where: { gabClinicId, date: today, status: "planned" } }),
        prisma.gabPatient.count({ where: { gabClinicId, status: "active" } }),
        prisma.gabClient.count({ where: { gabClinicId } }),
        prisma.gabTreatmentPlan.count({ where: { gabClinicId } }),
        db.gabScheduledReminder.count({
          where: { gabClinicId, sentAt: null, sendAt: { lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } },
        }),
        db.gabClientSettlement.count({ where: { gabClinicId, status: "open" } }),
        prisma.gabAppointment.findMany({
          where: { gabClinicId, date: { gte: today } },
          orderBy: [{ date: "asc" }, { time: "asc" }],
          take: 5,
          select: { id: true, date: true, time: true, patientName: true, visitType: true },
        }),
        prisma.gabTreatmentPlan.findMany({
          where: { gabClinicId },
          orderBy: { updatedAt: "desc" },
          take: 5,
          select: { id: true, title: true, status: true, updatedAt: true },
        }),
      ]);
    const clinic = await prisma.gabClinic.findUnique({
      where: { id: gabClinicId },
      select: { onboardingDoneAt: true, onboardingStep: true },
    });
    onboardingDone = !!clinic?.onboardingDoneAt || (clinic?.onboardingStep ?? 0) >= 5;
  } catch {
    /* po migracji */
  }

  const stats = [
    { label: "Wizyty dziś", value: todayAppointments, icon: Calendar, href: "/panel/kalendarz" },
    { label: "Pacjenci", value: patientCount, icon: UserRound, href: "/panel/pacjenci/lista" },
    { label: "Klienci CRM", value: clientCount, icon: Users, href: "/panel/klienci/lista" },
    { label: "Plany leczenia", value: planCount, icon: ClipboardList, href: "/panel/plany-leczenia" },
  ];

  return (
    <>
      <GabPanelPageHeader title="Pulpit" description="Podsumowanie dnia — kalendarz, pacjenci i recall." />
      <div className="px-4 py-6 lg:px-8">
        {!onboardingDone && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50/70 px-4 py-3 text-[14px] text-amber-900">
            Dokończ konfigurację gabinetu —{" "}
            <GabLink href="/panel/onboarding" className="font-semibold text-gab-sky hover:underline">
              kreator onboarding →
            </GabLink>
          </div>
        )}
        <div className="mb-6 flex flex-wrap gap-2">
          <GabLink href="/panel/kalendarz" className="rounded-lg border border-gab-sky/25 bg-white px-4 py-2 text-[13px] font-medium hover:border-gab-sky/45">
            + Wizyta
          </GabLink>
          <GabLink href="/panel/pacjenci/nowy" className="rounded-lg border border-gab-sky/25 bg-white px-4 py-2 text-[13px] font-medium hover:border-gab-sky/45">
            + Pacjent
          </GabLink>
          <GabLink href="/panel/plany-leczenia" className="rounded-lg border border-gab-sky/25 bg-white px-4 py-2 text-[13px] font-medium hover:border-gab-sky/45">
            Plany leczenia
          </GabLink>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <GabLink
              key={s.href}
              href={s.href}
              className="rounded-xl border border-gab-sky/20 bg-white p-4 shadow-sm transition hover:border-gab-sky/40 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gab-sky/10 text-gab-sky">
                  <s.icon className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="text-[12px] font-medium uppercase tracking-wide text-slate-500">{s.label}</p>
                  <p className="text-2xl font-bold text-gab-navy">{s.value}</p>
                </div>
              </div>
            </GabLink>
          ))}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <GabLink
            href="/panel/recall"
            className="flex items-center gap-3 rounded-xl border border-gab-sky/15 bg-white p-4 hover:border-gab-sky/35"
          >
            <BellRing className="h-5 w-5 text-gab-sky" />
            <div>
              <p className="font-medium text-gab-navy">Recall w kolejce (7 dni)</p>
              <p className="text-2xl font-bold text-gab-navy">{pendingReminders}</p>
            </div>
          </GabLink>
          <GabLink
            href="/panel/klienci/rozliczenia"
            className="flex items-center gap-3 rounded-xl border border-gab-sky/15 bg-white p-4 hover:border-gab-sky/35"
          >
            <Receipt className="h-5 w-5 text-gab-sky" />
            <div>
              <p className="font-medium text-gab-navy">Nieopłacone rozliczenia</p>
              <p className="text-2xl font-bold text-gab-navy">{openSettlements}</p>
            </div>
          </GabLink>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <section className="rounded-xl border border-gab-sky/15 bg-white p-5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-semibold text-gab-navy">Nadchodzące wizyty</h2>
              <GabLink href="/panel/kalendarz" className="text-[13px] text-gab-sky hover:underline">
                Kalendarz →
              </GabLink>
            </div>
            {recentAppointments.length === 0 ? (
              <p className="mt-3 text-[14px] text-slate-500">Brak zaplanowanych wizyt.</p>
            ) : (
              <ul className="mt-3 space-y-2 text-[14px]">
                {recentAppointments.map((a) => (
                  <li key={a.id} className="rounded-lg border border-slate-100 px-3 py-2">
                    <p className="font-medium text-gab-navy">
                      {a.date} · {a.time} — {a.patientName ?? "Pacjent"}
                    </p>
                    <p className="text-slate-500">{visitTypeLabel(a.visitType)}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-xl border border-gab-sky/15 bg-white p-5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-semibold text-gab-navy">Ostatnie plany leczenia</h2>
              <GabLink href="/panel/plany-leczenia" className="text-[13px] text-gab-sky hover:underline">
                Wszystkie →
              </GabLink>
            </div>
            {recentPlans.length === 0 ? (
              <p className="mt-3 text-[14px] text-slate-500">Brak planów.</p>
            ) : (
              <ul className="mt-3 space-y-2 text-[14px]">
                {recentPlans.map((p) => (
                  <li key={p.id}>
                    <GabLink
                      href={`/panel/plany-leczenia/${p.id}`}
                      className="block rounded-lg border border-slate-100 px-3 py-2 transition hover:border-gab-sky/30"
                    >
                      <p className="font-medium text-gab-navy">{p.title}</p>
                      <p className="text-slate-500">{PLAN_STATUS_LABELS[p.status] ?? p.status}</p>
                    </GabLink>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
