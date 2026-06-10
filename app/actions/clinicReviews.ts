"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { CLIENT_ROLE } from "@/lib/auth";
import { getPrisma } from "@/lib/db";

export type SubmitClinicReviewResult = { ok: true } | { ok: false; error: string };

export async function submitClinicReviewAction(
  clinicId: string,
  _clinicSlug: string,
  rating: number,
  content: string
): Promise<SubmitClinicReviewResult> {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role;
  const clientId = (session?.user as { clientId?: string })?.clientId;
  if (role !== CLIENT_ROLE || !clientId) {
    return { ok: false, error: "Tylko zalogowani klienci mogą dodawać opinie." };
  }
  const ratingNum = Math.min(5, Math.max(1, Math.round(Number(rating))));
  const text = (typeof content === "string" ? content : "").trim();
  if (text.length < 10) return { ok: false, error: "Treść opinii musi mieć co najmniej 10 znaków." };
  if (text.length > 2000) return { ok: false, error: "Treść opinii może mieć maksymalnie 2000 znaków." };

  try {
    const prisma = getPrisma();
    const client = await prisma.client.findUnique({
      where: { id: clientId },
      select: { name: true },
    });
    const authorName = client?.name?.trim() || "Klient";

    await prisma.clinicReview.upsert({
      where: {
        clinicId_clientId: { clinicId, clientId },
      },
      create: {
        clinicId,
        clientId,
        authorName,
        rating: ratingNum,
        content: text,
      },
      update: {
        authorName,
        rating: ratingNum,
        content: text,
      },
    });

    // Aktualizuj ocenę i liczbę opinii w profilu gabinetu
    const agg = await prisma.clinicReview.aggregate({
      where: { clinicId },
      _count: { id: true },
      _avg: { rating: true },
    });
    const reviewCount = agg._count.id;
    const avgRating = agg._avg.rating ?? 0;
    await prisma.clinic.update({
      where: { id: clinicId },
      data: {
        rating: Math.round(avgRating * 10) / 10, // 1 miejsce po przecinku
        reviewCount,
      },
    });

    revalidatePath(`/portal/gabinet/${_clinicSlug}`);

    return { ok: true };
  } catch (e) {
    const err = e as { message?: string; code?: string };
    console.error("submitClinicReviewAction:", err?.message ?? e);
    if (err?.message?.includes("does not exist") || err?.message?.includes("no such table") || err?.code === "P2021") {
      return { ok: false, error: "Tabela opinii nie istnieje w bazie. Administrator musi uruchomić migrację (ClinicReview)." };
    }
    return { ok: false, error: "Nie udało się zapisać opinii. Spróbuj ponownie." };
  }
}
