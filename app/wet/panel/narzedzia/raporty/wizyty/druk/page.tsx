import { redirect } from "next/navigation"
import { getWetRedirectPath } from "@/lib/wetRedirect";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { VET_CLINIC_ROLE } from "@/lib/auth";
import { getPrisma } from "@/lib/db";
import type { VisitHistoryReportRow } from "@/lib/vet/reports";
import { WetVisitHistoryReportView } from "@/components/wet/reports/WetVisitHistoryReportView";

type PageProps = {
  searchParams: Promise<{ from?: string; to?: string; archived?: string }>;
};

function monthAgoIso(): string {
  const d = new Date();
  d.setMonth(d.getMonth() - 1);
  return d.toISOString().slice(0, 10);
}

export default async function WetVisitHistoryReportPrintPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== VET_CLINIC_ROLE) redirect(await getWetRedirectPath("/login"));
  const vetClinicId = (session?.user as { vetClinicId?: string })?.vetClinicId;
  if (!vetClinicId) redirect(await getWetRedirectPath("/login"));

  const params = await searchParams;
  const fromDate = params.from?.match(/^\d{4}-\d{2}-\d{2}$/) ? params.from : monthAgoIso();
  const toDate = params.to?.match(/^\d{4}-\d{2}-\d{2}$/) ? params.to : new Date().toISOString().slice(0, 10);
  const includeArchived = params.archived === "1";

  const prisma = getPrisma();
  const [clinic, appointments] = await Promise.all([
    prisma.vetClinic.findUnique({ where: { id: vetClinicId }, select: { name: true } }),
    prisma.vetAppointment.findMany({
      where: {
        vetClinicId,
        date: { gte: fromDate, lte: toDate },
        ...(includeArchived ? {} : { status: { not: "cancelled" } }),
      },
      include: { vetDoctor: { select: { name: true } }, pet: { select: { name: true } } },
      orderBy: [{ date: "desc" }, { time: "desc" }],
    }),
  ]);

  if (!clinic) redirect(await getWetRedirectPath("/login"));

  const rows: VisitHistoryReportRow[] = appointments.map((a) => ({
    id: a.id,
    date: a.date,
    time: a.time,
    status: a.status,
    visitType: a.visitType,
    petName: a.pet?.name ?? a.petName,
    ownerName: a.ownerName,
    ownerPhone: a.ownerPhone,
    doctorName: a.vetDoctor?.name ?? null,
    notes: a.notes,
  }));

  return (
    <main className="min-h-screen bg-slate-100 py-8 print:bg-white print:py-0">
      <div className="mx-auto max-w-3xl px-4 print:max-w-none print:px-0">
        <div className="mb-4 print:hidden">
          <Link href="/wet/panel/narzedzia/raporty/wizyty" className="text-[14px] font-medium text-wet-teal hover:underline">
            ← Historia wizyt
          </Link>
        </div>
        <WetVisitHistoryReportView
          clinicName={clinic.name}
          rows={rows}
          fromDate={fromDate}
          toDate={toDate}
          includeArchived={includeArchived}
        />
      </div>
    </main>
  );
}
