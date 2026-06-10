import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { RESTAURANT_ROLE, ADMIN_ROLE } from "@/lib/auth";
import { getPrisma } from "@/lib/db";
import { RestaurantOrderNumberForm } from "./RestaurantOrderNumberForm";

export const dynamic = "force-dynamic";

export default async function PanelUstawieniaPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role;
  const restaurantId = (session?.user as { restaurantId?: string })?.restaurantId;

  if ((role !== RESTAURANT_ROLE && role !== ADMIN_ROLE) || !restaurantId) {
    redirect("/panel/logowanie?callbackUrl=/panel/ustawienia");
  }

  const prisma = getPrisma();
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
    select: { orderNumberPrefix: true, orderNumberNext: true },
  });

  if (!restaurant) {
    redirect("/panel/logowanie");
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-stone-900">Ustawienia restauracji</h1>
      <p className="mt-1 text-stone-600">Numeracja zamówień widoczna w panelu, w druku i dla klienta po złożeniu zamówienia.</p>

      <section className="mt-8 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-stone-900">Numery zamówień</h2>
        <p className="mt-1 text-sm text-stone-600">
          Zamiast losowego skrótu identyfikatora ustaw własny prefiks i kolejny numer. Każde nowe zamówienie dostanie ten numer i licznik
          zwiększy się automatycznie.
        </p>
        <RestaurantOrderNumberForm initialPrefix={restaurant.orderNumberPrefix} initialNext={restaurant.orderNumberNext} />
      </section>
    </div>
  );
}
