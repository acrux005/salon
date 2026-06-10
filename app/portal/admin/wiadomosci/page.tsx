import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { ADMIN_ROLE } from "@/lib/auth";
import { HeaderPortal } from "@/components/portal/HeaderPortal";
import { FooterPortal } from "@/components/portal/FooterPortal";
import { MessagesInbox } from "@/components/portal/MessagesInbox";

export const metadata = { title: "Wiadomości | Admin" };

export default async function AdminMessagesPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as { role?: string; id?: string; name?: string } | undefined;
  if (user?.role !== ADMIN_ROLE) redirect("/portal/login");
  const adminId = user.id ?? "";
  if (!adminId) redirect("/portal/login");

  return (
    <>
      <HeaderPortal />
      <main className="min-h-screen bg-[#FAFAFA] py-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Link href="/portal/admin" className="text-[14px] font-medium text-pink-600 hover:underline">
            ← Admin
          </Link>
          <h1 className="mt-3 font-[var(--font-serif)] text-2xl font-normal text-[#1F1A1C]">
            Wiadomości
          </h1>
          <p className="mt-1 mb-6 font-[var(--font-sans)] text-[14px] text-[#6F5E64]">
            Prywatne rozmowy z gabinetami i klientami.
          </p>
          <MessagesInbox myType="admin" myId={adminId} myName="Administracja" />
        </div>
      </main>
      <FooterPortal />
    </>
  );
}
