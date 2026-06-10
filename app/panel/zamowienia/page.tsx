import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { RESTAURANT_ROLE, ADMIN_ROLE } from "@/lib/auth";
import { getOrdersForRestaurant } from "@/lib/restaurantDb";
import { OrdersList } from "./OrdersList";

export const dynamic = "force-dynamic";

export default async function PanelZamowieniaPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role;
  const restaurantId = (session?.user as { restaurantId?: string })?.restaurantId;

  if ((role !== RESTAURANT_ROLE && role !== ADMIN_ROLE) || !restaurantId) {
    redirect("/panel/logowanie?callbackUrl=/panel/zamowienia");
  }

  const orders = await getOrdersForRestaurant(restaurantId);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-stone-900">Zamówienia</h1>
      <p className="mt-1 text-stone-600">Lista zamówień — zmień status po realizacji.</p>
      <OrdersList orders={orders} />
    </div>
  );
}
