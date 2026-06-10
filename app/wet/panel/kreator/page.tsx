import { redirect } from "next/navigation"
import { getWetRedirectPath } from "@/lib/wetRedirect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { VET_CLINIC_ROLE } from "@/lib/auth";
import { getPrisma } from "@/lib/db";
import {
  parseVetClinicSettings,
  isOnboardingComplete,
  normalizeOnboardingUiStep,
} from "@/lib/vet/onboarding";
import { WetOnboardingWizard } from "@/components/wet/WetOnboardingWizard";

export const metadata = { title: "Kreator konfiguracji" };

export default async function WetPanelKreatorPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role;
  if (role !== VET_CLINIC_ROLE) redirect(await getWetRedirectPath("/login?callbackUrl=/wet/panel/kreator"));
  const vetClinicId = (session?.user as { vetClinicId?: string })?.vetClinicId;
  if (!vetClinicId) redirect(await getWetRedirectPath("/login"));

  const prisma = getPrisma();
  const clinic = await prisma.vetClinic.findUnique({
    where: { id: vetClinicId },
    include: { account: { select: { email: true } } },
  });
  if (!clinic) redirect(await getWetRedirectPath("/login"));

  if (isOnboardingComplete(clinic.onboardingStep, clinic.onboardingDoneAt)) {
    redirect(await getWetRedirectPath("/panel"));
  }

  const settings = parseVetClinicSettings(clinic.settingsJson);
  const startStep = normalizeOnboardingUiStep(clinic.onboardingStep, clinic.onboardingDoneAt);

  const street =
    [clinic.street, clinic.houseNumber].filter(Boolean).join(" ").trim() ||
    clinic.address?.split(",")[0]?.trim() ||
    "";

  return (
    <WetOnboardingWizard
      initial={{
        step: startStep,
        name: clinic.name,
        street,
        postalCode: clinic.postalCode ?? "",
        city: clinic.city,
        email: clinic.email ?? clinic.account?.email ?? "",
        phone: clinic.phone ?? "",
        settings,
      }}
    />
  );
}
