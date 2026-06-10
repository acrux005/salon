import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getPrisma } from "@/lib/db";
import { GabKlienciWiadomosciClient } from "./GabKlienciWiadomosciClient";

export default async function GabKlienciWiadomosciPage() {
  const session = await getServerSession(authOptions);
  const gabClinicId = (session?.user as { gabClinicId?: string })?.gabClinicId ?? "";

  const rows = gabClinicId
    ? await getPrisma().gabClientMessage.findMany({
        where: { gabClinicId },
        orderBy: { sentAt: "desc" },
        take: 50,
        include: { client: { select: { name: true } } },
      })
    : [];

  const history = rows.map((m) => ({
    id: m.id,
    channel: m.channel,
    status: m.status,
    body: m.body,
    subject: m.subject,
    sentAt: m.sentAt.toISOString(),
    clientName: m.client?.name ?? null,
  }));

  return <GabKlienciWiadomosciClient history={history} />;
}
