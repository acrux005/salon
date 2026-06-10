import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/db";
import { evaluateDpdFoodDeliveryPostal, normalizePlPostalTo5Digits } from "@/lib/dpdFoodDeliveryZone";

export const runtime = "nodejs";

type OrderItemInput = { menuItemId: string; name: string; pricePlz: number; quantity: number; options?: string };

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      restaurantId,
      customerName,
      customerPhone,
      customerEmail,
      type,
      deliveryAddress,
      deliveryPostalCode,
      scheduledDate,
      scheduledSlot,
      note,
      items,
      totalPlz,
    } = body as {
      restaurantId: string;
      customerName: string;
      customerPhone: string;
      customerEmail?: string;
      type: string;
      deliveryAddress?: string;
      deliveryPostalCode?: string;
      scheduledDate: string;
      scheduledSlot: string;
      note?: string;
      items: OrderItemInput[];
      totalPlz: number;
    };
    if (!restaurantId || !customerName?.trim() || !customerPhone?.trim() || !type || !scheduledDate || !scheduledSlot || !Array.isArray(items) || items.length === 0 || typeof totalPlz !== "number") {
      return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
    }
    if (type !== "pickup" && type !== "delivery") {
      return NextResponse.json({ error: "type must be pickup or delivery" }, { status: 400 });
    }
    let validatedDeliveryPostal = "";
    let validatedDeliveryAddressLine = "";
    if (type === "delivery") {
      if (!deliveryAddress?.trim()) {
        return NextResponse.json({ error: "Podaj adres dostawy." }, { status: 400 });
      }
      const pcRaw = typeof deliveryPostalCode === "string" ? deliveryPostalCode.trim() : "";
      if (!pcRaw) {
        return NextResponse.json({ error: "Podaj kod pocztowy dostawy." }, { status: 400 });
      }
      const zone = evaluateDpdFoodDeliveryPostal(pcRaw);
      if (!zone.ok) {
        return NextResponse.json({ error: zone.error }, { status: 400 });
      }
      validatedDeliveryPostal = pcRaw;
      validatedDeliveryAddressLine = deliveryAddress.trim();
    }
    const prisma = getPrisma();
    const restaurant = await prisma.restaurant.findUnique({ where: { id: restaurantId } });
    if (!restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 });
    }
    const computedTotal = items.reduce((s, i) => s + i.pricePlz * i.quantity, 0);
    if (computedTotal !== totalPlz) {
      return NextResponse.json({ error: "Total mismatch" }, { status: 400 });
    }
    let persistedDeliveryAddress: string | null = null;
    if (type === "delivery") {
      const digits = normalizePlPostalTo5Digits(validatedDeliveryPostal);
      if (!digits) {
        return NextResponse.json({ error: "Nieprawidłowy format kodu pocztowego." }, { status: 400 });
      }
      const formatted = `${digits.slice(0, 2)}-${digits.slice(2)}`;
      persistedDeliveryAddress = `Kod: ${formatted} — ${validatedDeliveryAddressLine}`;
    }

    const order = await prisma.$transaction(async (tx) => {
      const r = await tx.restaurant.update({
        where: { id: restaurantId },
        data: { orderNumberNext: { increment: 1 } },
        select: { orderNumberPrefix: true, orderNumberNext: true },
      });
      const seq = r.orderNumberNext - 1;
      const prefix = (r.orderNumberPrefix ?? "").trim();
      const publicNumber = prefix ? `${prefix}${seq}` : String(seq);
      return tx.order.create({
        data: {
          restaurantId,
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          customerEmail: customerEmail?.trim() || null,
          type,
          deliveryAddress: persistedDeliveryAddress,
          scheduledDate,
          scheduledSlot,
          status: "new",
          totalPlz,
          note: note?.trim() || null,
          publicNumber,
          items: {
            create: items.map((i) => ({
              menuItemId: i.menuItemId,
              name: i.name,
              pricePlz: i.pricePlz,
              quantity: i.quantity,
              options: i.options ?? null,
            })),
          },
        },
        include: { items: true },
      });
    });
    await prisma.notification.create({
      data: {
        recipientType: "restaurant",
        recipientId: restaurantId,
        type: "new_order",
        title: "Nowe zamówienie",
        body: `${order.publicNumber ?? ""} · ${customerName} · ${scheduledDate} ${scheduledSlot} · ${totalPlz} zł`,
        link: `/panel/zamowienia?id=${order.id}`,
      },
    });
    return NextResponse.json({ orderId: order.id, publicNumber: order.publicNumber, success: true });
  } catch (e) {
    console.error("POST /api/orders", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
