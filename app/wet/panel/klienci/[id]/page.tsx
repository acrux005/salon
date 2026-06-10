import { redirect, notFound } from "next/navigation";
import { getWetRedirectPath } from "@/lib/wetRedirect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { VET_CLINIC_ROLE } from "@/lib/auth";
import { getPrisma } from "@/lib/db";
import { WetPanelPageHeader } from "@/components/wet/WetPanelPageHeader";
import { WetClientCardView } from "@/components/wet/WetClientCardView";

type PageProps = { params: Promise<{ id: string }> };

export default async function WetClientDetailPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== VET_CLINIC_ROLE) redirect(await getWetRedirectPath("/login"));
  const vetClinicId = (session?.user as { vetClinicId?: string })?.vetClinicId;
  if (!vetClinicId) redirect(await getWetRedirectPath("/login"));

  const { id } = await params;
  const prisma = getPrisma();

  const owner = await prisma.petOwner.findFirst({
    where: { id, vetClinicId },
    include: {
      pets: { select: { id: true, name: true, species: true }, orderBy: { name: "asc" } },
      consentLogs: { orderBy: { createdAt: "desc" }, take: 50 },
    },
  });

  if (!owner) notFound();

  return (
    <>
      <WetPanelPageHeader
        title="Karta klienta"
        description={`${owner.name} · powiadomienia e-mail, SMS, push · ${owner.pets.length} zwierząt`}
      />
      <WetClientCardView
        client={{
          id: owner.id,
          name: owner.name,
          phone: owner.phone,
          email: owner.email,
          smsConsent: owner.smsConsent,
          emailConsent: owner.emailConsent,
          pushConsent: owner.pushConsent,
          marketingConsent: owner.marketingConsent,
          notes: owner.notes,
          createdAt: owner.createdAt.toISOString(),
          pets: owner.pets,
          consentLogs: owner.consentLogs.map((log) => ({
            id: log.id,
            consentType: log.consentType,
            granted: log.granted,
            source: log.source,
            note: log.note,
            createdAt: log.createdAt.toISOString(),
          })),
        }}
      />
    </>
  );
}
