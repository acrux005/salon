import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { ADMIN_ROLE, CLIENT_ROLE, CLINIC_ROLE } from "@/lib/auth";
import { HeaderPortal } from "@/components/portal/HeaderPortal";
import { FooterPortal } from "@/components/portal/FooterPortal";
import { getNotificationsAction } from "@/app/actions/notifications";
import { NotificationList } from "@/components/portal/NotificationList";

export default async function PowiadomieniaPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role;
  if (!session || !role) redirect("/portal/login");
  if (role === ADMIN_ROLE) redirect("/portal/admin/powiadomienia");
  if (role === CLINIC_ROLE) redirect("/portal/panel/powiadomienia");

  const res = await getNotificationsAction();
  const list = res.ok ? res.list : [];
  const unreadCount = res.ok ? res.unreadCount : 0;

  const backHref = role === CLIENT_ROLE ? "/portal/moje-rezerwacje" : "/portal";

  return (
    <>
      <HeaderPortal />
      <main className="min-h-screen bg-white py-12">
        <div className="mx-auto max-w-2xl px-4">
          <Link href={backHref} className="text-[14px] font-medium text-pink-600 hover:underline">
            {role === CLIENT_ROLE ? "← Moje rezerwacje" : "← Powrót"}
          </Link>
          <h1 className="mt-4 font-[var(--font-serif)] text-2xl font-normal text-[#1F1A1C]">
            Powiadomienia
          </h1>
          <p className="mt-2 font-[var(--font-sans)] text-[15px] text-[#6F5E64]">
            {unreadCount > 0
              ? `Masz ${unreadCount} nieprzeczytanych powiadomień.`
              : "Brak nieprzeczytanych powiadomień."}
          </p>
          <div className="mt-8">
            <NotificationList initialList={list} />
          </div>
        </div>
      </main>
      <FooterPortal />
    </>
  );
}
