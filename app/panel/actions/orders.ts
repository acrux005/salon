"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { RESTAURANT_ROLE, ADMIN_ROLE } from "@/lib/auth";
import { getPrisma } from "@/lib/db";

const ALLOWED_STATUSES = ["new", "confirmed", "preparing", "ready", "completed", "cancelled"] as const;

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function updateOrderStatusAction(orderId: string, status: string): Promise<ActionResult> {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role;
  const restaurantId = (session?.user as { restaurantId?: string })?.restaurantId;
  if (role !== RESTAURANT_ROLE && role !== ADMIN_ROLE) return { ok: false, error: "Brak dostępu." };
  if (!ALLOWED_STATUSES.includes(status as (typeof ALLOWED_STATUSES)[number])) {
    return { ok: false, error: "Nieprawidłowy status." };
  }
  try {
    const prisma = getPrisma();
    const where = restaurantId ? { id: orderId, restaurantId } : { id: orderId };
    await prisma.order.updateMany({ where, data: { status } });
    revalidatePath("/panel/zamowienia");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Błąd zapisu." };
  }
}
