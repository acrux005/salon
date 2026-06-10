import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { ADMIN_ROLE } from "@/lib/auth";
import { getPrisma } from "@/lib/db";
import { AdminUsersList } from "./AdminUsersList";

export const dynamic = "force-dynamic";

export default async function AdminKlienciPage() {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== ADMIN_ROLE) {
    redirect("/portal/login?callbackUrl=/portal/admin/klienci");
  }

  const prisma = getPrisma();
  const [clients, clinicAccounts] = await Promise.all([
    prisma.client.findMany({
      orderBy: { email: "asc" },
      select: { id: true, email: true, name: true, phone: true, createdAt: true },
    }),
    prisma.clinicAccount.findMany({
      orderBy: { email: "asc" },
      include: { clinic: { select: { id: true, name: true, slug: true } } },
    }),
  ]);

  return (
    <main className="min-h-screen bg-white py-12">
      <div className="mx-auto max-w-4xl px-4">
        <Link
          href="/portal/admin"
          className="text-[14px] font-medium text-pink-600 hover:underline"
        >
          ← Panel admina
        </Link>
        <h1 className="mt-4 font-[var(--font-serif)] text-2xl font-normal text-[#1F1A1C]">
          Użytkownicy
        </h1>
        <p className="mt-2 font-[var(--font-sans)] text-[15px] text-[#6F5E64]">
          Klienci i konta gabinetów.
        </p>
        <AdminUsersList clients={clients} clinicAccounts={clinicAccounts} />
      </div>
    </main>
  );
}
