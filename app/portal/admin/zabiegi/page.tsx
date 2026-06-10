import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { ADMIN_ROLE } from "@/lib/auth";
import { getCatalogAsync } from "@/lib/skinmatch/treatmentsDb";
import { AdminZabiegiList } from "./AdminZabiegiList";

export const dynamic = "force-dynamic";

export default async function AdminZabiegiPage() {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== ADMIN_ROLE) {
    redirect("/portal/login?callbackUrl=/portal/admin/zabiegi");
  }

  const treatments = await getCatalogAsync();

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
          Zabiegi (katalog)
        </h1>
        <p className="mt-2 font-[var(--font-sans)] text-[15px] text-[#6F5E64]">
          Pełna lista zabiegów z katalogu. Zabiegi są definiowane w kodzie (treatmentsCatalog.ts).
          Kliknij, aby zobaczyć podstronę zabiegu.
        </p>
        <AdminZabiegiList treatments={treatments} />
      </div>
    </main>
  );
}
