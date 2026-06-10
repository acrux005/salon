import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getPrisma } from "@/lib/db";
import { GabKlientDetailClient } from "./GabKlientDetailClient";

export default async function GabKlientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const gabClinicId = (await getServerSession(authOptions))?.user as { gabClinicId?: string };
  const clinicId = gabClinicId?.gabClinicId ?? "";

  const client = await getPrisma().gabClient.findFirst({ where: { id, gabClinicId: clinicId } });
  if (!client) notFound();

  const consentLogs = await getPrisma().gabClientConsentLog.findMany({
    where: { clientId: id, gabClinicId: clinicId },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const messages = await getPrisma().gabClientMessage.findMany({
    where: { clientId: id, gabClinicId: clinicId },
    orderBy: { sentAt: "desc" },
    take: 30,
  });

  return (
    <GabKlientDetailClient
      client={client}
      consentLogs={consentLogs}
      messages={messages.map((m) => ({
        id: m.id,
        channel: m.channel,
        status: m.status,
        body: m.body,
        subject: m.subject,
        sentAt: m.sentAt.toISOString(),
      }))}
    />
  );
}
