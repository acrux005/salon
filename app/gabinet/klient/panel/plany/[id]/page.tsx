import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { GAB_PATIENT_ROLE } from "@/lib/auth";
import { getPrisma } from "@/lib/db";
import { getGabinetRedirectPath } from "@/lib/gabinetRedirect";
import { GabPatientPlanClient } from "./GabPatientPlanClient";

export default async function GabPatientPlanPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== GAB_PATIENT_ROLE) {
    redirect(await getGabinetRedirectPath("/klient/logowanie"));
  }
  const accountId = (session?.user as { gabPatientAccountId?: string })?.gabPatientAccountId;
  if (!accountId) notFound();

  const { id } = await params;
  const plan = await getPrisma().gabTreatmentPlan.findFirst({
    where: {
      id,
      patient: { accountId },
      status: { not: "draft" },
    },
    include: {
      gabClinic: { select: { name: true } },
      items: { orderBy: { sortOrder: "asc" } },
    },
  });
  if (!plan) notFound();

  return (
    <GabPatientPlanClient
      planId={plan.id}
      title={plan.title}
      status={plan.status}
      totalPln={plan.totalPln}
      clinicName={plan.gabClinic.name}
      notes={plan.notes}
      presentedAt={plan.presentedAt?.toISOString() ?? null}
      items={plan.items}
    />
  );
}
