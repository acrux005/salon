/**
 * Budowanie danych strony gabinetu z rekordu (multi-gabinet).
 * Zwraca obiekt w kształcie zgodnym z clinicDemo (profile, treatments, sidebar, …).
 */

import type { ClinicRecord, ProblemId, Treatment } from "./schema";
import { getTreatmentsByIdsAsync } from "./treatmentsDb";
import { getClinicTreatmentPricesAsync } from "@/lib/clinicTreatmentPrices";
import { clinicDemo } from "@/content/clinicDemo";
import type { ProblemId as ContentProblemId } from "@/content/clinicDemo";

/** Etykiety problemów (content/clinicDemo) — ProblemId w obu plikach jest zgodny. */
const PROBLEM_LABELS: Record<ProblemId, string> = {
  tradzik: "Trądzik",
  przebarwienia: "Przebarwienia",
  anti_aging: "Anti-aging",
  naczynka: "Skóra naczynkowa",
  sucha_skora: "Sucha skóra",
  zmarszczki: "Zmarszczki",
  jedrnost: "Utrata jędrności",
  owal: "Opadający owal",
  brwi_rzesy: "Brwi i rzęsy",
  makijaz: "Makijaż",
  wlosy: "Włosy",
  stopy: "Stopy",
  masaze: "Masaże",
  terapia_manualna: "Terapia manualna",
  dzwiekoterapia: "Dźwiękoterapia",
};

const DEFAULT_MATCHING_REASONS = clinicDemo.matchingReasons;

export interface ClinicPageData {
  profile: typeof clinicDemo.profile;
  hero: typeof clinicDemo.hero & { imageUrl?: string };
  matchingReasons: typeof clinicDemo.matchingReasons;
  specializations: { id: ProblemId; label: string; count: number }[];
  treatments: Treatment[];
  sidebar: typeof clinicDemo.sidebar;
  finalCta: typeof clinicDemo.finalCta;
  about: typeof clinicDemo.about;
  faq: typeof clinicDemo.faq;
  effects: typeof clinicDemo.effects;
  /** Id gabinetu (Prisma) — ulubione, lista oczekujących. */
  clinicId?: string;
  /** Slug gabinetu (dla kalendarza rezerwacji → deep link do panelu). */
  clinicSlug?: string;
  /** Domyślna kosmetyczka (cosmoStaffId) — preselekcja w modalu rezerwacji. */
  clinicCosmoStaffId?: number | null;
  /** Sesja klienta (z strony gabinetu): czy zalogowany jako klient i dane do rezerwacji. */
  sessionInfo?: {
    isClient: boolean;
    clientInfo?: { name?: string; email?: string; phone?: string };
  };
  /** Otwórz modal rezerwacji po powrocie z logowania/rejestracji (?rezerwacja=1). */
  initialOpenBooking?: boolean;
}

export async function buildClinicPageData(record: ClinicRecord): Promise<ClinicPageData> {
  const treatments = await getTreatmentsByIdsAsync(record.treatmentIds);
  const { prices: priceOverrides, durations: durationOverrides } = await getClinicTreatmentPricesAsync(record.id);
  const treatmentsWithPrices: Treatment[] = treatments.map((t) => ({
    ...t,
    cena_od: priceOverrides[t.id] ?? t.cena_od,
    czas: durationOverrides[t.id] ?? t.czas,
  }));
  const k = record.kontakt;
  const telLabel = k?.phone ?? "—";
  const telHref = k?.phone ? `tel:${k.phone.replace(/\s/g, "")}` : "#";
  const address = k?.address ?? record.city;
  const bookHref = k?.bookingUrl ?? "/kontakt";

  const effectsConfig = record.kontakt?.effectsSection;
  const baseEffects = clinicDemo.effects;
  const effectsCards = Array.isArray(effectsConfig?.cards)
    ? effectsConfig!.cards!
        .filter((card) => card.problem || card.terapia || card.wizyty || card.efekt)
        .map((card) => ({
          problem: card.problem || "",
          terapia: card.terapia || "",
          wizyty: card.wizyty || "",
          efekt: card.efekt || "",
        }))
    : baseEffects.cards;
  const effectsEnabled = effectsConfig?.enabled !== false;
  const aboutConfig = record.kontakt?.aboutSection;
  const baseAbout = clinicDemo.about;
  const aboutParagraphs = Array.isArray(aboutConfig?.paragraphs)
    ? aboutConfig!.paragraphs!.filter((p) => p.trim().length > 0)
    : baseAbout.paragraphs;
  const faqConfig = record.kontakt?.faqSection;
  const baseFaq = clinicDemo.faq;
  const faqItems = Array.isArray(faqConfig?.items)
    ? faqConfig!.items!
        .filter((item) => item.question.trim().length > 0 || item.answer.trim().length > 0)
        .map((item) => ({
          question: item.question || "",
          answer: item.answer || "",
        }))
    : baseFaq.items;

  return {
    clinicId: record.id,
    clinicSlug: record.slug,
    profile: {
      name: record.name,
      specializations: record.specializations.map(
        (id) => PROBLEM_LABELS[id as ContentProblemId]
      ) as unknown as typeof clinicDemo.profile.specializations,
      rating: record.rating ?? 0,
      reviewCount: record.reviewCount ?? 0,
      city: record.city,
      ctaPrimary: "Umów konsultację",
      ctaPrimaryHref: bookHref,
      ctaSecondary: "Sprawdź dopasowanie do Twojej skóry",
      ctaSecondaryHref: "/portal/quiz",
    },
    hero: {
      imageAlt: `${record.name} — konsultacja`,
      imageUrl: record.avatarUrl ?? undefined,
    },
    matchingReasons: DEFAULT_MATCHING_REASONS,
    specializations: record.specializations.map((id) => {
      const problemId = id as ProblemId;
      const count = treatmentsWithPrices.filter((t) => t.problemy.includes(problemId)).length;
      return {
        id: id as ContentProblemId,
        label: PROBLEM_LABELS[id],
        count,
      };
    }),
    treatments: treatmentsWithPrices,
    sidebar: {
      title: "Rezerwacja",
      ctaBook: "Umów konsultację",
      ctaBookHref: bookHref,
      ctaTerms: "Zobacz dostępne terminy",
      ctaTermsHref: `${bookHref}#terminy`,
      telLabel,
      telHref,
      address,
    },
    finalCta: {
      title: "Masz ten problem? Zacznij od konsultacji kwalifikacyjnej.",
      ctaBook: "Umów konsultację",
      ctaBookHref: bookHref,
      ctaTerms: "Zobacz dostępne terminy",
      ctaTermsHref: `${bookHref}#terminy`,
      telLabel,
      telHref,
    },
    about: {
      ...baseAbout,
      title: aboutConfig?.title?.trim() || baseAbout.title,
      paragraphs: aboutParagraphs.length > 0 ? aboutParagraphs : baseAbout.paragraphs,
      imageAlt: aboutConfig?.imageAlt?.trim() || baseAbout.imageAlt,
      imageUrl: aboutConfig?.imageUrl?.trim() || undefined,
      enabled: aboutConfig?.enabled !== false,
    } as typeof clinicDemo.about,
    faq: {
      title: faqConfig?.title?.trim() || baseFaq.title,
      items: faqItems.length > 0 ? faqItems : baseFaq.items,
      enabled: faqConfig?.enabled !== false,
    } as typeof clinicDemo.faq,
    effects: {
      title: effectsConfig?.title?.trim() || baseEffects.title,
      subtitle: effectsConfig?.subtitle?.trim() || baseEffects.subtitle,
      cards: effectsCards.length > 0 ? effectsCards : baseEffects.cards,
      enabled: effectsEnabled,
    } as typeof clinicDemo.effects,
    clinicCosmoStaffId: record.cosmoStaffId ?? null,
  };
}
