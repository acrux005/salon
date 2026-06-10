import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { GAB_CLINIC_ROLE } from "@/lib/auth";
import { getPrisma } from "@/lib/db";
import { GabLink } from "@/components/gabinetPlatform/GabLink";
import { computeGabVisitStats, type GabVisitHistoryReportRow } from "@/lib/gabinet/reports";
import { GabVisitHistoryReportView } from "@/components/gabinet/reports/GabVisitHistoryReportView";

type PageProps = {
  searchParams: Promise<{ from?: string; to?: string; archived?: string }>;
};

function monthAgoIso(): string {
  const d = new Date();
  d.setMonth(d.getMonth() - 1);
  return d.toISOString().slice(0, 10);
}

export default async function GabVisitHistoryReportPrintPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== GAB_CLINIC_ROLE) {
    redirect("/gabinet/login");
  }
  const gabClinicId = (session?.user as { gabClinicId?: string })?.gabClinicId;
  if (!gabClinicId) redirect("/gabinet/login");

  const params = await searchParams;
  const fromDate = params.from?.match(/^\d{4}-\d{2}-\d{2}$/) ? params.from : monthAgoIso();
  const toDate = params.to?.match(/^\d{4}-\d{2}-\d{2}$/) ? params.to : new Date().toISOString().slice(0, 10);
  const includeArchived = params.archived === "1";

  const prisma = getPrisma();
  const [clinic, appointments] = await Promise.all([
    prisma.gabClinic.findUnique({ where: { id: gabClinicId }, select: { name: true } }),
    prisma.gabAppointment.findMany({
      where: {
        gabClinicId,
        date: { gte: fromDate, lte: toDate },
        ...(includeArchived ? {} : { status: { not: "cancelled" } }),
      },
      include: { gabStaff: { select: { name: true } } },
      orderBy: [{ date: "desc" }, { time: "desc" }],
    }),
  ]);

  if (!clinic) redirect("/gabinet/login");

  const rows: GabVisitHistoryReportRow[] = appointments.map((a) => ({
    id: a.id,
    date: a.date,
    time: a.time,
    status: a.status,
    visitType: a.visitType,
    patientName: a.patientName,
    patientPhone: a.patientPhone,
    staffName: a.gabStaff?.name ?? null,
    notes: a.notes,
  }));

  const stats = computeGabVisitStats(rows);

  return (
    <main className="min-h-screen bg-slate-100 py-8 print:bg-white print:py-0">
      <div className="mx-auto max-w-3xl px-4 print:max-w-none print:px-0">
        <div className="mb-4 print:hidden">
          <GabLink href="/panel/narzedzia/raporty/wizyty" className="text-[14px] font-medium text-gab-sky hover:underline">
            ← Historia wizyt
          </GabLink>
        </div>
        <GabVisitHistoryReportView
          clinicName={clinic.name}
          rows={rows}
          stats={stats}
          fromDate={fromDate}
          toDate={toDate}
          includeArchived={includeArchived}
        />
      </div>
    </main>
  );
}
