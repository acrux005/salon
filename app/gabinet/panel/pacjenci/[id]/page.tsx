import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getPrisma } from "@/lib/db";
import { gabPrisma } from "@/lib/gabinet/prismaGab";
import { GabPacjentDetailClient } from "./GabPacjentDetailClient";

export default async function GabPacjentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const gabClinicId = (session?.user as { gabClinicId?: string })?.gabClinicId ?? "";

  const patient = await gabPrisma().gabPatient.findFirst({
    where: { id, gabClinicId },
    include: { account: { select: { email: true } } },
  });
  if (!patient) notFound();

  const documents = await getPrisma().gabPatientDocument.findMany({
    where: { patientId: id, gabClinicId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <GabPacjentDetailClient
      patient={patient}
      documents={documents}
      linkedAccountEmail={patient.account?.email ?? null}
    />
  );
}
