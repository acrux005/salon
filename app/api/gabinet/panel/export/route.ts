import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { GAB_CLINIC_ROLE } from "@/lib/auth";
import { getPrisma } from "@/lib/db";
import {
  buildGabAppointmentsCsv,
  buildGabCatalogCsv,
  buildGabClientsCsv,
  buildGabExportBundle,
  buildGabPatientsCsv,
  buildGabTreatmentPlansCsv,
} from "@/lib/gabinet/clinicExport";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== GAB_CLINIC_ROLE) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const gabClinicId = (session?.user as { gabClinicId?: string })?.gabClinicId;
  if (!gabClinicId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const type = request.nextUrl.searchParams.get("type") ?? "patients";
  const prisma = getPrisma();

  const [patients, clients, appointments, plans, catalogItems] = await Promise.all([
    prisma.gabPatient.findMany({ where: { gabClinicId }, orderBy: { name: "asc" } }),
    prisma.gabClient.findMany({ where: { gabClinicId }, orderBy: { name: "asc" } }),
    prisma.gabAppointment.findMany({
      where: { gabClinicId },
      orderBy: [{ date: "desc" }, { time: "desc" }],
    }),
    prisma.gabTreatmentPlan.findMany({
      where: { gabClinicId },
      include: { patient: { select: { name: true } }, _count: { select: { items: true } } },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.gabTreatmentCatalogItem.findMany({ where: { gabClinicId }, orderBy: { name: "asc" } }),
  ]);

  const exportPatients = patients.map((p) => ({
    name: p.name,
    phone: p.phone,
    email: p.email,
    pesel: p.pesel,
    birthDate: p.birthDate,
    smsConsent: p.smsConsent,
    emailConsent: p.emailConsent,
    notes: p.notes,
  }));

  const exportClients = clients.map((c) => ({
    name: c.name,
    phone: c.phone,
    email: c.email,
    smsConsent: c.smsConsent,
    emailConsent: c.emailConsent,
    notes: c.notes,
  }));

  const exportAppointments = appointments.map((a) => ({
    date: a.date,
    time: a.time,
    status: a.status,
    visitType: a.visitType,
    patientName: a.patientName,
    patientPhone: a.patientPhone,
    notes: a.notes,
  }));

  const exportPlans = plans.map((p) => ({
    title: p.title,
    patientName: p.patient.name,
    status: p.status,
    totalPln: p.totalPln,
    itemCount: p._count.items,
  }));

  const exportCatalog = catalogItems.map((c) => ({
    name: c.name,
    category: c.category,
    pricePln: c.pricePln,
    durationMinutes: c.durationMinutes,
    active: c.active,
  }));

  const date = new Date().toISOString().slice(0, 10);

  if (type === "all") {
    const bundle = buildGabExportBundle({
      patients: exportPatients,
      clients: exportClients,
      appointments: exportAppointments,
      plans: exportPlans,
      catalog: exportCatalog,
    });
    return NextResponse.json({
      exportedAt: bundle.exportedAt,
      files: {
        patients: bundle.patients,
        clients: bundle.clients,
        appointments: bundle.appointments,
        plans: bundle.plans,
        catalog: bundle.catalog,
      },
    });
  }

  let csv: string;
  let filename: string;
  switch (type) {
    case "clients":
      csv = buildGabClientsCsv(exportClients);
      filename = `gabinet-klienci-${date}.csv`;
      break;
    case "appointments":
      csv = buildGabAppointmentsCsv(exportAppointments);
      filename = `gabinet-wizyty-${date}.csv`;
      break;
    case "plans":
      csv = buildGabTreatmentPlansCsv(exportPlans);
      filename = `gabinet-plany-${date}.csv`;
      break;
    case "catalog":
      csv = buildGabCatalogCsv(exportCatalog);
      filename = `gabinet-katalog-${date}.csv`;
      break;
    default:
      csv = buildGabPatientsCsv(exportPatients);
      filename = `gabinet-pacjenci-${date}.csv`;
  }

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
