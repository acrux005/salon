"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { RESTAURANT_ROLE, ADMIN_ROLE } from "@/lib/auth";
import { getPrisma } from "@/lib/db";

async function getRestaurantId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role;
  if (role !== RESTAURANT_ROLE && role !== ADMIN_ROLE) return null;
  return (session?.user as { restaurantId?: string })?.restaurantId ?? null;
}

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function createCategoryAction(name: string): Promise<ActionResult> {
  const restaurantId = await getRestaurantId();
  if (!restaurantId) return { ok: false, error: "Brak dostępu." };
  const n = (name ?? "").trim();
  if (!n) return { ok: false, error: "Nazwa kategorii jest wymagana." };
  try {
    const prisma = getPrisma();
    const max = await prisma.menuCategory.aggregate({ where: { restaurantId }, _max: { order: true } });
    await prisma.menuCategory.create({
      data: { restaurantId, name: n, order: (max._max.order ?? -1) + 1 },
    });
    revalidatePath("/panel/menu");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Błąd zapisu." };
  }
}

export async function updateCategoryAction(id: string, name: string): Promise<ActionResult> {
  const restaurantId = await getRestaurantId();
  if (!restaurantId) return { ok: false, error: "Brak dostępu." };
  const n = (name ?? "").trim();
  if (!n) return { ok: false, error: "Nazwa jest wymagana." };
  try {
    const prisma = getPrisma();
    await prisma.menuCategory.updateMany({ where: { id, restaurantId }, data: { name: n } });
    revalidatePath("/panel/menu");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Błąd zapisu." };
  }
}

export async function deleteCategoryAction(id: string): Promise<ActionResult> {
  const restaurantId = await getRestaurantId();
  if (!restaurantId) return { ok: false, error: "Brak dostępu." };
  try {
    const prisma = getPrisma();
    await prisma.menuCategory.deleteMany({ where: { id, restaurantId } });
    revalidatePath("/panel/menu");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Błąd usuwania." };
  }
}

export async function createMenuItemAction(data: {
  categoryId: string;
  name: string;
  description?: string;
  pricePlz: number;
}): Promise<ActionResult> {
  const restaurantId = await getRestaurantId();
  if (!restaurantId) return { ok: false, error: "Brak dostępu." };
  const name = (data.name ?? "").trim();
  if (!name) return { ok: false, error: "Nazwa jest wymagana." };
  const price = Number(data.pricePlz);
  if (Number.isNaN(price) || price < 0) return { ok: false, error: "Cena musi być ≥ 0." };
  try {
    const prisma = getPrisma();
    const cat = await prisma.menuCategory.findFirst({ where: { id: data.categoryId, restaurantId } });
    if (!cat) return { ok: false, error: "Kategoria nie istnieje." };
    const max = await prisma.menuItem.aggregate({ where: { categoryId: data.categoryId }, _max: { order: true } });
    await prisma.menuItem.create({
      data: {
        restaurantId,
        categoryId: data.categoryId,
        name,
        description: (data.description ?? "").trim() || null,
        pricePlz: price,
        order: (max._max.order ?? -1) + 1,
      },
    });
    revalidatePath("/panel/menu");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Błąd zapisu." };
  }
}

export async function updateMenuItemAction(
  id: string,
  data: { name?: string; description?: string; pricePlz?: number; isAvailable?: boolean }
): Promise<ActionResult> {
  const restaurantId = await getRestaurantId();
  if (!restaurantId) return { ok: false, error: "Brak dostępu." };
  try {
    const prisma = getPrisma();
    const payload: { name?: string; description?: string | null; pricePlz?: number; isAvailable?: boolean } = {};
    if (data.name !== undefined) payload.name = data.name.trim();
    if (data.description !== undefined) payload.description = data.description?.trim() || null;
    if (data.pricePlz !== undefined) {
      const p = Number(data.pricePlz);
      if (Number.isNaN(p) || p < 0) return { ok: false, error: "Cena musi być ≥ 0." };
      payload.pricePlz = p;
    }
    if (data.isAvailable !== undefined) payload.isAvailable = data.isAvailable;
    await prisma.menuItem.updateMany({ where: { id, restaurantId }, data: payload });
    revalidatePath("/panel/menu");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Błąd zapisu." };
  }
}

export async function deleteMenuItemAction(id: string): Promise<ActionResult> {
  const restaurantId = await getRestaurantId();
  if (!restaurantId) return { ok: false, error: "Brak dostępu." };
  try {
    const prisma = getPrisma();
    await prisma.menuItem.deleteMany({ where: { id, restaurantId } });
    revalidatePath("/panel/menu");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Błąd usuwania." };
  }
}
