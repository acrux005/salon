import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { CLINIC_ROLE } from "@/lib/auth";
import { HeaderPortal } from "@/components/portal/HeaderPortal";
import { FooterPortal } from "@/components/portal/FooterPortal";
import { MessagesInbox } from "@/components/portal/MessagesInbox";
import { getPrisma } from "@/lib/db";

export const metadata = { title: "Wiadomości | Panel gabinetu" };

export default async function ClinicMessagesPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as { role?: string; clinicId?: string; name?: string } | undefined;
  if (user?.role !== CLINIC_ROLE) redirect("/portal/login");
  const clinicId = user?.clinicId;
  if (!clinicId) redirect("/portal/login");

  const prisma = getPrisma();
  const clinic = await prisma.clinic.findUnique({ where: { id: clinicId }, select: { name: true } });

  return (
    <>
      <HeaderPortal />
      <main className="min-h-screen bg-[#FAFAFA] py-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Link href="/portal/panel" className="text-[14px] font-medium text-pink-600 hover:underline">
            ← Panel
          </Link>
          <h1 className="mt-3 font-[var(--font-serif)] text-2xl font-normal text-[#1F1A1C]">
            Wiadomości
          </h1>
          <p className="mt-1 mb-6 font-[var(--font-sans)] text-[14px] text-[#6F5E64]">
            Prywatne rozmowy z klientami.
          </p>
          <MessagesInbox myType="clinic" myId={clinicId} myName={clinic?.name ?? "Gabinet"} />
        </div>
      </main>
      <FooterPortal />
    </>
  );
}
