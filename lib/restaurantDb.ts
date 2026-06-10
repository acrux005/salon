import { getPrisma } from "@/lib/db";

export type RestaurantWithMenu = Awaited<ReturnType<typeof getRestaurantBySlug>>;

export async function getRestaurantBySlug(slug: string) {
  const prisma = getPrisma();
  try {
    return await prisma.restaurant.findUnique({
      where: { slug, isPublished: true },
      include: {
        categories: {
          orderBy: { order: "asc" },
          include: {
            items: {
              where: { isAvailable: true },
              orderBy: { order: "asc" },
            },
          },
        },
      },
    });
  } catch {
    return null;
  }
}

export async function getRestaurants(city?: string) {
  const prisma = getPrisma();
  try {
    return await prisma.restaurant.findMany({
      where: { isPublished: true, ...(city ? { city } : {}) },
      orderBy: { name: "asc" },
      select: {
        id: true,
        slug: true,
        name: true,
        city: true,
        description: true,
        logoUrl: true,
        coverUrl: true,
        address: true,
      },
    });
  } catch {
    return [];
  }
}

export async function getRestaurantById(id: string) {
  const prisma = getPrisma();
  try {
    return await prisma.restaurant.findUnique({
      where: { id },
      include: {
        categories: {
          orderBy: { order: "asc" },
          include: { items: { orderBy: { order: "asc" } } },
        },
      },
    });
  } catch {
    return null;
  }
}

export async function getOrdersForRestaurant(restaurantId: string, options?: { status?: string; limit?: number }) {
  const prisma = getPrisma();
  try {
    return await prisma.order.findMany({
      where: { restaurantId, ...(options?.status ? { status: options.status } : {}) },
      orderBy: [{ scheduledDate: "desc" }, { scheduledSlot: "desc" }, { createdAt: "desc" }],
      take: options?.limit ?? 100,
      include: { items: true },
    });
  } catch {
    return [];
  }
}
