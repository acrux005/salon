/**
 * Map Prisma Clinic row to ClinicRecord shape. Used by clinics.ts adapter.
 */
import type {
  ClinicRecord,
  ClinicContact,
  ClinicEffectCard,
  ClinicEffectsSectionConfig,
  ClinicAboutSectionConfig,
  ClinicFaqItem,
  ClinicFaqSectionConfig,
  ProblemId,
  QuizTag,
  WorkingHoursDay,
} from "./schema";
/** Local type — zamow.odart.pl nie ma modelu Clinic w Prisma. */
type ClinicRow = {
  id: string;
  slug: string;
  name: string;
  city: string;
  description: string;
  rating: number | null;
  reviewCount: number | null;
  specializations: string | null;
  matchingTags: string | null;
  treatmentIds: string | null;
  avatarUrl: string | null;
  kontakt: string | null;
  cosmoStaffId: number | null;
  workingHours: string | null;
  bookingPhoneOnly: boolean;
};

function parseJson<T>(raw: string, fallback: T): T {
  try {
    const v = JSON.parse(raw);
    return (Array.isArray(v) ? v : fallback) as T;
  } catch {
    return fallback;
  }
}

function parseKontakt(raw: string): ClinicContact | undefined {
  try {
    const o = JSON.parse(raw) as Record<string, unknown>;
    if (!o || typeof o !== "object") return undefined;
    const k: ClinicContact = {};
    if (typeof o.phone === "string") k.phone = o.phone;
    if (typeof o.email === "string") k.email = o.email;
    if (typeof o.address === "string") k.address = o.address;
    if (typeof o.bookingUrl === "string") k.bookingUrl = o.bookingUrl;
    if (typeof o.instagram === "string") k.instagram = o.instagram;
    if (typeof o.facebook === "string") k.facebook = o.facebook;
    const noOrderDaysRaw = o.noOrderDays;
    if (Array.isArray(noOrderDaysRaw)) {
      const values = noOrderDaysRaw.reduce<string[]>((acc, v: unknown) => {
        if (typeof v !== "string") return acc;
        const value = v.trim();
        if (/^\d{4}-\d{2}-\d{2}$/.test(value)) acc.push(value);
        return acc;
      }, []);
      if (values.length > 0) k.noOrderDays = Array.from(new Set(values)).sort();
    }
    const effects = parseEffectsSection(o.effectsSection);
    if (effects) k.effectsSection = effects;
    const about = parseAboutSection(o.aboutSection);
    if (about) k.aboutSection = about;
    const faq = parseFaqSection(o.faqSection);
    if (faq) k.faqSection = faq;
    return Object.keys(k).length ? k : undefined;
  } catch {
    return undefined;
  }
}

function parseEffectsSection(raw: unknown): ClinicEffectsSectionConfig | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const obj = raw as Record<string, unknown>;
  const out: ClinicEffectsSectionConfig = {};
  if (typeof obj.enabled === "boolean") out.enabled = obj.enabled;
  if (typeof obj.title === "string") out.title = obj.title;
  if (typeof obj.subtitle === "string") out.subtitle = obj.subtitle;
  if (Array.isArray(obj.cards)) {
    const cards: ClinicEffectCard[] = obj.cards
      .map((item) => {
        if (!item || typeof item !== "object") return null;
        const c = item as Record<string, unknown>;
        const problem = typeof c.problem === "string" ? c.problem : "";
        const terapia = typeof c.terapia === "string" ? c.terapia : "";
        const wizyty = typeof c.wizyty === "string" ? c.wizyty : "";
        const efekt = typeof c.efekt === "string" ? c.efekt : "";
        if (!problem && !terapia && !wizyty && !efekt) return null;
        return { problem, terapia, wizyty, efekt };
      })
      .filter(Boolean) as ClinicEffectCard[];
    out.cards = cards;
  }
  return Object.keys(out).length ? out : undefined;
}

function parseAboutSection(raw: unknown): ClinicAboutSectionConfig | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const obj = raw as Record<string, unknown>;
  const out: ClinicAboutSectionConfig = {};
  if (typeof obj.enabled === "boolean") out.enabled = obj.enabled;
  if (typeof obj.title === "string") out.title = obj.title;
  if (typeof obj.imageAlt === "string") out.imageAlt = obj.imageAlt;
  if (typeof obj.imageUrl === "string") out.imageUrl = obj.imageUrl;
  if (Array.isArray(obj.paragraphs)) {
    const paragraphs = obj.paragraphs
      .map((p) => (typeof p === "string" ? p : ""))
      .filter((p) => p.trim().length > 0);
    out.paragraphs = paragraphs;
  }
  return Object.keys(out).length ? out : undefined;
}

function parseFaqSection(raw: unknown): ClinicFaqSectionConfig | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const obj = raw as Record<string, unknown>;
  const out: ClinicFaqSectionConfig = {};
  if (typeof obj.enabled === "boolean") out.enabled = obj.enabled;
  if (typeof obj.title === "string") out.title = obj.title;
  if (Array.isArray(obj.items)) {
    const items: ClinicFaqItem[] = obj.items
      .map((item) => {
        if (!item || typeof item !== "object") return null;
        const q = item as Record<string, unknown>;
        const question = typeof q.question === "string" ? q.question : "";
        const answer = typeof q.answer === "string" ? q.answer : "";
        if (!question && !answer) return null;
        return { question, answer };
      })
      .filter(Boolean) as ClinicFaqItem[];
    out.items = items;
  }
  return Object.keys(out).length ? out : undefined;
}

function parseWorkingHours(raw: string | null): WorkingHoursDay[] | undefined {
  if (!raw || !raw.trim()) return undefined;
  try {
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr) || arr.length !== 7) return undefined;
    return arr.map((item: unknown) => {
      if (!item || typeof item !== "object") return { open: "", close: "" };
      const o = item as Record<string, unknown>;
      return {
        open: typeof o.open === "string" ? o.open : "",
        close: typeof o.close === "string" ? o.close : "",
      };
    });
  } catch {
    return undefined;
  }
}

export function prismaClinicToRecord(row: ClinicRow): ClinicRecord {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    city: row.city,
    description: row.description,
    rating: row.rating ?? 0,
    reviewCount: row.reviewCount ?? 0,
    specializations: parseJson<ProblemId[]>(row.specializations ?? "", []),
    matchingTags: parseJson<QuizTag[]>(row.matchingTags ?? "", []),
    treatmentIds: parseJson<string[]>(row.treatmentIds ?? "", []),
    avatarUrl: row.avatarUrl ?? undefined,
    kontakt: parseKontakt(row.kontakt ?? ""),
    cosmoStaffId: row.cosmoStaffId ?? undefined,
    workingHours: parseWorkingHours(row.workingHours ?? null),
    bookingPhoneOnly: row.bookingPhoneOnly ?? false,
  };
}
