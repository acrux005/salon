import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { ADMIN_ROLE } from "@/lib/auth";
import { getPrisma } from "@/lib/db";
import { AdminGabinetyList } from "./AdminGabinetyList";

export const dynamic = "force-dynamic";

export default async function AdminGabinetyPage() {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== ADMIN_ROLE) {
    redirect("/portal/login?callbackUrl=/portal/admin/gabinety");
  }

  const prisma = getPrisma();
  const clinics = await prisma.clinic.findMany({
    orderBy: { name: "asc" },
    include: {
      account: { select: { id: true, email: true } },
    },
  });

  return (
    <main className="min-h-screen bg-white py-12">
      <div className="mx-auto max-w-5xl px-4">
        <Link
          href="/portal/admin"
          className="text-[14px] font-medium text-pink-600 hover:underline"
        >
          ← Panel admina
        </Link>
        <h1 className="mt-4 font-[var(--font-serif)] text-2xl font-normal text-[#1F1A1C]">
          Gabinety
        </h1>
        <p className="mt-2 font-[var(--font-sans)] text-[15px] text-[#6F5E64]">
          Lista zarejestrowanych gabinetów. Edytuj — dane gabinetu; ikona klucza — nowe hasło do konta
          (e-mail + hasło).
        </p>
        <AdminGabinetyList clinics={clinics} />
      </div>
    </main>
  );
}
