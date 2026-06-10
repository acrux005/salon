import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getPrisma } from "@/lib/db";
import { GabPlanDetailClient } from "./GabPlanDetailClient";

export default async function GabPlanDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const gabClinicId = (session?.user as { gabClinicId?: string })?.gabClinicId;
  if (!gabClinicId) notFound();

  const plan = await getPrisma().gabTreatmentPlan.findFirst({
    where: { id, gabClinicId },
    include: {
      patient: { select: { name: true, accountId: true } },
      items: { orderBy: { sortOrder: "asc" } },
    },
  });
  if (!plan) notFound();

  return (
    <div className="px-4 py-6 lg:px-8">
      <GabPlanDetailClient
        planId={plan.id}
        title={plan.title}
        status={plan.status}
        totalPln={plan.totalPln}
        patientName={plan.patient.name}
        patientHasPortalAccount={!!plan.patient.accountId}
        presentedAt={plan.presentedAt?.toISOString() ?? null}
        acceptedAt={plan.acceptedAt?.toISOString() ?? null}
        patientResponseNote={plan.patientResponseNote}
        items={plan.items}
      />
    </div>
  );
}
