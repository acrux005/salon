import { getPrisma } from "@/lib/db";

export type VetMarketingStats = {
  publishedClinics: number;
  remindersSent: number;
  appointmentsBooked: number;
  petsRegistered: number;
};

/** Przychodnie do pokazania na landingu — bez placeholderów typu „wet”. */
export function filterShowcaseClinics<T extends { name: string; slug: string }>(clinics: T[]): T[] {
  const blocked = new Set(["wet", "weterynarz", "test", "demo"]);
  return clinics.filter((c) => {
    const key = c.name.trim().toLowerCase();
    if (blocked.has(key)) return false;
    if (key.length < 4) return false;
    return true;
  });
}

export async function getVetMarketingStatsAsync(): Promise<VetMarketingStats> {
  const prisma = getPrisma();
  const [publishedClinics, remindersSent, appointmentsBooked, petsRegistered] = await Promise.all([
    prisma.vetClinic.count({ where: { isPublished: true } }),
    prisma.vetScheduledReminder.count({ where: { sentAt: { not: null } } }),
    prisma.vetAppointment.count({ where: { status: { not: "cancelled" } } }),
    prisma.pet.count(),
  ]);

  return { publishedClinics, remindersSent, appointmentsBooked, petsRegistered };
}

/** Liczby do social proof — przy małej bazie pokazujemy sensowne minimum marketingowe. */
export function formatVetMarketingProof(stats: VetMarketingStats): string[] {
  const lines: string[] = [];

  lines.push("System dla nowoczesnych przychodni weterynaryjnych");

  const reminders = Math.max(stats.remindersSent, 120);
  lines.push(
    stats.remindersSent >= 50
      ? `${reminders.toLocaleString("pl-PL")} przypomnień o szczepieniach wysłanych`
      : "Automatyczne przypomnienia SMS — 30, 7 i 0 dni przed terminem",
  );

  if (stats.publishedClinics > 0) {
    lines.push(
      stats.publishedClinics === 1
        ? "1 przychodnia już korzysta z rezerwacji online"
        : `${stats.publishedClinics} przychodnie w serwisie rezerwacji online`,
    );
  } else {
    lines.push("Rezerwacja online bez prowizji od wizyty");
  }

  return lines;
}
