import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { HeaderPortal } from "@/components/portal/HeaderPortal";
import { FooterPortal } from "@/components/portal/FooterPortal";
import { MessagesInbox } from "@/components/portal/MessagesInbox";
import { getPrisma } from "@/lib/db";

export const metadata = { title: "Wiadomości | Zabiegi Odart" };

export default async function ClientMessagesPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as { role?: string; clientId?: string; id?: string; name?: string } | undefined;
  if (!user) redirect("/portal/login");

  const clientId = user.clientId ?? user.id ?? "";
  if (!clientId) redirect("/portal/login");

  let backHref = "/portal";
  let backLabel = "← Portal";
  try {
    const prisma = getPrisma();
    const latestThread = await prisma.messageThread.findFirst({
      where: {
        OR: [
          { typeA: "client", idA: clientId, typeB: "clinic" },
          { typeB: "client", idB: clientId, typeA: "clinic" },
        ],
      },
      orderBy: { lastMessageAt: "desc" },
      select: { typeA: true, idA: true, typeB: true, idB: true },
    });
    if (latestThread) {
      const clinicId =
        latestThread.typeA === "clinic"
          ? latestThread.idA
          : latestThread.typeB === "clinic"
            ? latestThread.idB
            : null;
      if (clinicId) {
        const clinic = await prisma.clinic.findUnique({
          where: { id: clinicId },
          select: { slug: true, name: true },
        });
        if (clinic?.slug) {
          backHref = `/portal/gabinet/${clinic.slug}`;
          backLabel = `← ${clinic.name}`;
        }
      }
    }
  } catch {
    // fallback: portal
  }

  return (
    <>
      <HeaderPortal />
      <main className="min-h-screen bg-[#FAFAFA] py-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Link href={backHref} className="text-[14px] font-medium text-pink-600 hover:underline">
            {backLabel}
          </Link>
          <h1 className="mt-3 font-[var(--font-serif)] text-2xl font-normal text-[#1F1A1C]">
            Wiadomości
          </h1>
          <p className="mt-1 mb-6 font-[var(--font-sans)] text-[14px] text-[#6F5E64]">
            Twoje rozmowy z gabinetami.
          </p>
          <MessagesInbox myType="client" myId={clientId} myName={user.name ?? "Klient"} />
        </div>
      </main>
      <FooterPortal />
    </>
  );
}
