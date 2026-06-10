import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/db";
import { createNotification } from "@/lib/notificationsDb";

/**
 * GET /api/booking/confirm-attendance?token=...
 * Potwierdza przyjście klienta na wizytę (link z maila).
 */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (!token?.trim()) {
    return NextResponse.json(
      { ok: false, error: "Brak tokenu potwierdzenia." },
      { status: 400 }
    );
  }

  try {
    const prisma = getPrisma();
    const booking = await prisma.clinicBooking.findUnique({
      where: { confirmToken: token.trim() },
      include: {
        clinic: { select: { name: true } },
      },
    });

    if (!booking) {
      return NextResponse.json({
        ok: false,
        error: "Link wygasł lub jest nieprawidłowy. Możesz potwierdzić wizytę przez portal.",
      });
    }

    const clinicName = booking.clinic?.name ?? "";

    if (booking.confirmedAt) {
      return NextResponse.json({
        ok: true,
        already: true,
        message: "Wizyta została już wcześniej potwierdzona.",
        clinicName,
      });
    }

    await prisma.clinicBooking.update({
      where: { id: booking.id },
      data: {
        confirmedAt: new Date(),
        confirmToken: null,
      },
    });

    createNotification({
      recipientType: "clinic",
      recipientId: booking.clinicId,
      type: "info",
      title: "Klient potwierdził przyjście",
      body: `${booking.date} ${booking.time} — ${booking.clientName ?? booking.clientEmail ?? "Klient"} potwierdził wizytę.`,
      link: "/portal/panel/kalendarz",
    }).catch((e) => console.error("[confirm-attendance] notification:", e));

    return NextResponse.json({
      ok: true,
      already: false,
      message: "Potwierdzono przyjście na wizytę.",
      clinicName,
    });
  } catch (e) {
    console.error("[confirm-attendance]", e);
    return NextResponse.json(
      { ok: false, error: "Błąd serwera. Spróbuj ponownie." },
      { status: 500 }
    );
  }
}
