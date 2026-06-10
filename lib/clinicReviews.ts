export type ClinicReviewItem = {
  id: string;
  clinicId: string;
  clientId: string;
  authorName: string;
  rating: number;
  content: string;
  createdAt: Date;
};

/** Pobiera opinie o gabinecie (najnowsze pierwsze). */
export async function getClinicReviewsAsync(clinicId: string): Promise<ClinicReviewItem[]> {
  try {
    const { getPrisma } = await import("@/lib/db");
    const prisma = getPrisma();
    const rows = await prisma.clinicReview.findMany({
      where: { clinicId },
      orderBy: { createdAt: "desc" },
      select: { id: true, clinicId: true, clientId: true, authorName: true, rating: true, content: true, createdAt: true },
    });
    return rows.map((r) => ({
      id: r.id,
      clinicId: r.clinicId,
      clientId: r.clientId,
      authorName: r.authorName,
      rating: r.rating,
      content: r.content,
      createdAt: r.createdAt,
    }));
  } catch {
    return [];
  }
}
