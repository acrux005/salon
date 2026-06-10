import Link from "next/link";
import { getNotificationsAction } from "@/app/actions/notifications";
import { NotificationList } from "@/components/portal/NotificationList";

export default async function AdminPowiadomieniaPage() {
  const res = await getNotificationsAction();
  const list = res.ok ? res.list : [];
  const unreadCount = res.ok ? res.unreadCount : 0;

  return (
    <main className="min-h-screen bg-white py-12">
      <div className="mx-auto max-w-2xl px-4">
        <Link
          href="/portal/admin"
          className="text-[14px] font-medium text-pink-600 hover:underline"
        >
          ← Panel admina
        </Link>
        <h1 className="mt-4 font-[var(--font-serif)] text-2xl font-normal text-[#1F1A1C]">
          Powiadomienia
        </h1>
        <p className="mt-2 font-[var(--font-sans)] text-[15px] text-[#6F5E64]">
          {unreadCount > 0
            ? `Masz ${unreadCount} nieprzeczytan${unreadCount === 1 ? "e" : unreadCount < 5 ? "e" : ""} powiadomień.`
            : "Brak nieprzeczytanych powiadomień."}
        </p>
        <div className="mt-8">
          <NotificationList initialList={list} />
        </div>
      </div>
    </main>
  );
}
