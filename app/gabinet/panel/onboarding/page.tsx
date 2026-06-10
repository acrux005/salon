import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { gabPrisma } from "@/lib/gabinet/prismaGab";
import { GabOnboardingClient } from "./GabOnboardingClient";

export default async function GabOnboardingPage() {
  const session = await getServerSession(authOptions);
  const gabClinicId = (session?.user as { gabClinicId?: string })?.gabClinicId ?? "";
  let step = 0;
  let done = false;
  if (gabClinicId) {
    const clinic = await gabPrisma().gabClinic.findUnique({
      where: { id: gabClinicId },
      select: { onboardingStep: true, onboardingDoneAt: true },
    });
    step = clinic?.onboardingStep ?? 0;
    done = !!clinic?.onboardingDoneAt;
  }
  return <GabOnboardingClient step={step} done={done} />;
}
