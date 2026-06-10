"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { ADMIN_ROLE, RESTAURANT_ROLE } from "@/lib/auth";
import { getPrisma } from "@/lib/db";

export async function updateRestaurantOrderNumberSettingsAction(
  formData: FormData
): Promise<{ ok: true } | { ok: false; error: string }> {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role;
  const restaurantId = (session?.user as { restaurantId?: string })?.restaurantId;
  if ((role !== RESTAURANT_ROLE && role !== ADMIN_ROLE) || !restaurantId) {
    return { ok: false, error: "Brak dostępu." };
  }
  const prefixRaw = formData.get("orderNumberPrefix");
  const nextRaw = formData.get("orderNumberNext");
  const prefix = typeof prefixRaw === "string" ? prefixRaw.trim().slice(0, 32) : "";
  const next = typeof nextRaw === "string" ? parseInt(nextRaw, 10) : NaN;
  if (!Number.isFinite(next) || next < 1 || next > 99_999_999) {
    return { ok: false, error: "Następny numer musi być liczbą od 1 do 99999999." };
  }
  const prisma = getPrisma();
  await prisma.restaurant.updateMany({
    where: { id: restaurantId },
    data: { orderNumberPrefix: prefix, orderNumberNext: next },
  });
  revalidatePath("/panel/ustawienia");
  revalidatePath("/panel/zamowienia");
  return { ok: true };
}
