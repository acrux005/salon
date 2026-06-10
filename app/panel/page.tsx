import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { RESTAURANT_ROLE, ADMIN_ROLE, CLINIC_ROLE, CLIENT_ROLE } from "@/lib/auth";
import Link from "next/link";
import { UtensilsCrossed, ClipboardList, Settings } from "lucide-react";

export default async function PanelDashboardPage() {
  const session = await getServerSession(authOptions);
  const user = session?.user as { role?: string; clinicId?: string };
  const role = user?.role;
  const clinicId = user?.clinicId;
  const name = session?.user?.name ?? "Panel";

  if (role === CLINIC_ROLE || clinicId) redirect("/portal/panel");
  if (role === CLIENT_ROLE) redirect("/portal");
  if (role !== RESTAURANT_ROLE && role !== ADMIN_ROLE) {
    redirect("/panel/logowanie?callbackUrl=/panel");
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-stone-900">Panel restauracji</h1>
      <p className="mt-1 text-stone-600">Witaj, {name}.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/panel/menu"
          className="flex items-center gap-4 rounded-xl border border-stone-200 bg-white p-6 shadow-sm transition hover:border-zamow-orange-300 hover:shadow-md"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-zamow-orange-100 text-zamow-orange-600">
            <UtensilsCrossed className="h-6 w-6" />
          </span>
          <div>
            <h2 className="font-semibold text-stone-900">Menu</h2>
            <p className="text-sm text-stone-600">Kategorie i dania — dodawaj, edytuj, ukrywaj.</p>
          </div>
        </Link>
        <Link
          href="/panel/zamowienia"
          className="flex items-center gap-4 rounded-xl border border-stone-200 bg-white p-6 shadow-sm transition hover:border-zamow-orange-300 hover:shadow-md"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-zamow-orange-100 text-zamow-orange-600">
            <ClipboardList className="h-6 w-6" />
          </span>
          <div>
            <h2 className="font-semibold text-stone-900">Zamówienia</h2>
            <p className="text-sm text-stone-600">Lista zamówień i zmiana statusu.</p>
          </div>
        </Link>
        <Link
          href="/panel/ustawienia"
          className="flex items-center gap-4 rounded-xl border border-stone-200 bg-white p-6 shadow-sm transition hover:border-zamow-orange-300 hover:shadow-md"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-zamow-orange-100 text-zamow-orange-600">
            <Settings className="h-6 w-6" />
          </span>
          <div>
            <h2 className="font-semibold text-stone-900">Ustawienia</h2>
            <p className="text-sm text-stone-600">Numery zamówień i inne opcje.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
