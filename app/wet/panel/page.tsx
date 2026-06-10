import { redirect } from "next/navigation"
import { getWetRedirectPath } from "@/lib/wetRedirect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { VET_CLINIC_ROLE } from "@/lib/auth";
import { getVetClinicByIdAsync } from "@/lib/vet/clinics";
import { getPrisma } from "@/lib/db";
import { isOnboardingComplete } from "@/lib/vet/onboarding";
import { buildPanelChecklist } from "@/lib/vet/panelChecklist";
import { getDashboardWidgets } from "@/lib/vet/dashboardData";
import { WetPanelDashboardHome } from "@/components/wet/WetPanelDashboardHome";

function hasWorkingHours(raw: string | null | undefined): boolean {
  if (!raw) return false;
  try {
    const days = JSON.parse(raw) as { open?: string; close?: string }[];
    if (!Array.isArray(days)) return false;
    return days.some((d) => Boolean(d?.open && d?.close));
  } catch {
    return false;
  }
}

export default async function WetPanelDashboardPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role;
  if (role !== VET_CLINIC_ROLE) redirect(await getWetRedirectPath("/login?callbackUrl=/wet/panel"));
  const vetClinicId = (session?.user as { vetClinicId?: string })?.vetClinicId;
  const vetClinicSlug = (session?.user as { vetClinicSlug?: string })?.vetClinicSlug;
  if (!vetClinicId || !vetClinicSlug) redirect(await getWetRedirectPath("/login"));

  const prisma = getPrisma();
  const clinicRow = await prisma.vetClinic.findUnique({
    where: { id: vetClinicId },
    select: {
      onboardingStep: true,
      onboardingDoneAt: true,
      workingHours: true,
      logoUrl: true,
      vets: { select: { name: true } },
    },
  });
  if (!clinicRow || !isOnboardingComplete(clinicRow.onboardingStep, clinicRow.onboardingDoneAt)) {
    redirect(await getWetRedirectPath("/panel/kreator"));
  }

  const clinic = await getVetClinicByIdAsync(vetClinicId);
  if (!clinic) redirect(await getWetRedirectPath("/login"));

  const today = new Date().toISOString().slice(0, 10);
  const dayStart = new Date(`${today}T00:00:00`);
  const dayEnd = new Date(`${today}T23:59:59.999`);

  const [todayVisits, overdueVaccinations, vaccinationsToday, patientCount, widgets] =
    await Promise.all([
      prisma.vetAppointment.count({
        where: { vetClinicId, date: today, status: "planned" },
      }),
      prisma.vaccination.count({
        where: {
          nextDueAt: { lt: dayStart },
          pet: { owner: { vetClinicId }, status: "active" },
        },
      }),
      prisma.vaccination.count({
        where: {
          nextDueAt: { gte: dayStart, lte: dayEnd },
          pet: { owner: { vetClinicId }, status: "active" },
        },
      }),
      prisma.pet.count({
        where: { owner: { vetClinicId } },
      }),
      getDashboardWidgets(vetClinicId),
    ]);

  const hasCustomVet = clinicRow.vets.some((v) => v.name !== "Lekarz weterynarii");

  const checklistItems = buildPanelChecklist({
    vetCount: clinicRow.vets.length,
    hasWorkingHours: hasWorkingHours(clinicRow.workingHours),
    patientCount,
    smsConfigured: false,
    hasLogo: Boolean(clinicRow.logoUrl),
  }).map((item) =>
    item.id === "doctor" ? { ...item, done: hasCustomVet || clinicRow.vets.length > 1 } : item
  );

  return (
    <WetPanelDashboardHome
      clinicName={clinic.name}
      publicProfileHref={`/wet/przychodnia/${vetClinicSlug}`}
      todayVisits={todayVisits}
      overdueVaccinations={overdueVaccinations}
      vaccinationsToday={vaccinationsToday}
      unreadMessages={widgets.unreadMessagesTotal}
      checklistItems={checklistItems}
      widgets={widgets}
    />
  );
}
