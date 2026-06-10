"use server";

import bcrypt from "bcrypt";
import crypto from "crypto";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { ADMIN_ROLE } from "@/lib/auth";
import { getPrisma } from "@/lib/db";
import { tryConsume } from "@/lib/rateLimit";
import { sendClinicVerificationEmail } from "@/lib/email";
import { getAllowedCities } from "@/lib/voivodeships";

const MAX_AVATAR_SIZE = 2 * 1024 * 1024; // 2 MB
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const UPLOADS_DIR = "uploads/clinics";

async function saveClinicImage(
  clinicSlug: string,
  file: File,
  suffix: string
): Promise<{ url: string; filePath: string } | { error: string }> {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return { error: "Dozwolone formaty: JPG, PNG, WebP." };
  }
  if (file.size > MAX_AVATAR_SIZE) {
    return { error: "Plik może mieć maks. 2 MB." };
  }
  const ext = file.type === "image/jpeg" ? "jpg" : file.type === "image/png" ? "png" : "webp";
  const fileName = `${clinicSlug}${suffix}.${ext}`;
  const dir = path.join(process.cwd(), "public", UPLOADS_DIR);
  const filePath = path.join(dir, fileName);
  try {
    await mkdir(dir, { recursive: true });
    const bytes = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes));
  } catch (e) {
    console.error("saveClinicImage:", e);
    return { error: "Nie udało się zapisać pliku." };
  }
  return { url: `/${UPLOADS_DIR}/${fileName}`, filePath };
}

export type RegisterResult = { ok: true; slug: string } | { ok: false; error: string };
export type VerifyClinicEmailResult = { ok: true } | { ok: false; error: string };
export type UpdateClinicResult = { ok: true; slug: string } | { ok: false; error: string };
export type UploadAvatarResult = { ok: true; url: string } | { ok: false; error: string };
export type UploadAboutImageResult = { ok: true; url: string; imageUrl: string } | { ok: false; error: string };

export type SetBookingPhoneOnlyResult = { ok: true } | { ok: false; error: string };

const slugRegex = /^[a-z0-9-]{3,}$/;
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(10, "Hasło musi mieć min. 10 znaków"),
  slug: z.string().regex(slugRegex, "Slug: małe litery, cyfry, myślniki (min. 3 znaki)"),
  name: z.string().min(1, "Nazwa jest wymagana"),
  city: z.string().min(1, "Miasto jest wymagane"),
  description: z.string(),
});

const VERIFY_EXPIRES_MS = 24 * 60 * 60 * 1000; // 24 h

export async function registerClinic(formData: FormData): Promise<RegisterResult> {
  const raw = {
    email: formData.get("email")?.toString()?.trim(),
    password: formData.get("password")?.toString(),
    slug: formData.get("slug")?.toString()?.trim()?.toLowerCase(),
    name: formData.get("name")?.toString()?.trim(),
    city: formData.get("city")?.toString()?.trim(),
    description: formData.get("description")?.toString()?.trim() ?? "",
  };
  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    const msg =
      parsed.error.flatten().fieldErrors?.password?.[0] ??
      parsed.error.flatten().fieldErrors?.slug?.[0] ??
      parsed.error.message;
    return { ok: false, error: String(msg) };
  }
  const { email, password, slug, name, city, description } = parsed.data;
  const allowedCities = new Set(getAllowedCities());
  if (!allowedCities.has(city)) {
    return { ok: false, error: "Wybierz miasto z listy (województwo i miasto)." };
  }
  const emailNorm = email.trim().toLowerCase();
  if (slug === "moj-gabinet") {
    return { ok: false, error: "Wybierz unikalny adres profilu (np. nazwa-twojego-gabinetu). Adres „moj-gabinet” jest zarezerwowany." };
  }
  const registerKey = "register:" + emailNorm;
  if (!tryConsume(registerKey, 5, 60 * 60 * 1000)) {
    return { ok: false, error: "Zbyt wiele prób rejestracji. Spróbuj za godzinę." };
  }
  try {
    const prisma = getPrisma();
    const existing = await prisma.clinic.findUnique({ where: { slug } });
    if (existing) return { ok: false, error: "Ten slug jest już zajęty." };
    const existingAccount = await prisma.clinicAccount.findUnique({ where: { email: emailNorm } });
    if (existingAccount) return { ok: false, error: "Konto z tym adresem email już istnieje." };
    const hash = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpires = new Date(Date.now() + VERIFY_EXPIRES_MS);
    const clinic = await prisma.clinic.create({
      data: {
        slug,
        name,
        city,
        description,
        specializations: "[]",
        matchingTags: "[]",
        treatmentIds: "[]",
        kontakt: "{}",
        isPublished: false,
      },
    });
    await prisma.clinicAccount.create({
      data: {
        email: emailNorm,
        passwordHash: hash,
        clinicId: clinic.id,
        verificationToken,
        verificationTokenExpires,
      },
    });
    const sent = await sendClinicVerificationEmail(emailNorm, verificationToken);
    if (sent) return { ok: true, slug };
    return {
      ok: false,
      error:
        "Konto utworzone, ale nie udało się wysłać e-maila potwierdzającego. Skontaktuj się z nami, aby aktywować konto.",
    };
  } catch (e) {
    console.error("registerClinic:", e);
    return { ok: false, error: "Błąd rejestracji. Spróbuj ponownie." };
  }
}

export async function verifyClinicEmailAction(token: string): Promise<VerifyClinicEmailResult> {
  if (!token?.trim()) return { ok: false, error: "Brak tokenu." };
  try {
    const prisma = getPrisma();
    const account = await prisma.clinicAccount.findFirst({
      where: {
        verificationToken: token,
        verificationTokenExpires: { gt: new Date() },
      },
    });
    if (!account) {
      return {
        ok: false,
        error: "Link wygasł lub jest nieprawidłowy. Zarejestruj gabinet ponownie albo poproś o nowy link.",
      };
    }
    await prisma.clinicAccount.update({
      where: { id: account.id },
      data: {
        emailVerifiedAt: new Date(),
        verificationToken: null,
        verificationTokenExpires: null,
      },
    });
    return { ok: true };
  } catch (e) {
    console.error("verifyClinicEmail:", e);
    return { ok: false, error: "Błąd potwierdzenia. Spróbuj ponownie." };
  }
}

/** Salon: edycja gabinetu przez admina (te same pola co updateClinicAction, po clinicId). */
export async function updateClinicByAdminAction(clinicIdParam: string, formData: FormData): Promise<UpdateClinicResult> {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== ADMIN_ROLE) return { ok: false, error: "Brak uprawnień." };

  const slug = formData.get("slug")?.toString()?.trim();
  const name = formData.get("name")?.toString()?.trim();
  const city = formData.get("city")?.toString()?.trim();
  const description = formData.get("description")?.toString()?.trim() ?? "";
  if (!slug || !name || !city) return { ok: false, error: "Adres, nazwa i miasto są wymagane." };
  if (!slugRegex.test(slug)) return { ok: false, error: "Nieprawidłowy format adresu (np. nazwa-gabinetu)." };

  let specializations: string[] = [];
  let treatmentIds: string[] = [];
  try {
    const specRaw = formData.get("specializations")?.toString();
    if (specRaw) specializations = JSON.parse(specRaw) as string[];
  } catch {
    return { ok: false, error: "Nieprawidłowy format specjalizacji." };
  }
  try {
    const idsRaw = formData.get("treatmentIds")?.toString();
    if (idsRaw) treatmentIds = JSON.parse(idsRaw) as string[];
  } catch {
    return { ok: false, error: "Nieprawidłowy format listy zabiegów." };
  }

  const treatmentPrices = parseJsonRecord(formData, "treatmentPrices");
  const treatmentDurations = parseJsonRecord(formData, "treatmentDurations");
  const isPublished = formData.get("isPublished")?.toString() === "true";
  const cosmoRaw = formData.get("cosmoStaffId")?.toString()?.trim();
  const cosmoStaffId = cosmoRaw ? parseInt(cosmoRaw, 10) : null;

  const kontaktFields = {
    phone: formData.get("kontakt.phone")?.toString()?.trim() ?? "",
    email: formData.get("kontakt.email")?.toString()?.trim() ?? "",
    address: formData.get("kontakt.address")?.toString()?.trim() ?? "",
    bookingUrl: formData.get("kontakt.bookingUrl")?.toString()?.trim() ?? "",
    instagram: formData.get("kontakt.instagram")?.toString()?.trim() ?? "",
    facebook: formData.get("kontakt.facebook")?.toString()?.trim() ?? "",
  };

  try {
    const prisma = getPrisma();
    const existing = await prisma.clinic.findUnique({
      where: { id: clinicIdParam },
      select: { slug: true, kontakt: true },
    });
    if (!existing) return { ok: false, error: "Nie znaleziono gabinetu." };

    if (slug !== existing.slug) {
      const taken = await prisma.clinic.findUnique({ where: { slug } });
      if (taken) return { ok: false, error: "Ten adres jest już zajęty." };
    }

    let kontaktObj: Record<string, unknown> = {};
    try {
      if (existing.kontakt) kontaktObj = JSON.parse(existing.kontakt) as Record<string, unknown>;
    } catch {
      // leave empty
    }
    Object.assign(kontaktObj, {
      phone: kontaktFields.phone || undefined,
      email: kontaktFields.email || undefined,
      address: kontaktFields.address || undefined,
      bookingUrl: kontaktFields.bookingUrl || undefined,
      instagram: kontaktFields.instagram || undefined,
      facebook: kontaktFields.facebook || undefined,
      treatmentPrices: Object.keys(treatmentPrices).length > 0 ? treatmentPrices : undefined,
      treatmentDurations: Object.keys(treatmentDurations).length > 0 ? treatmentDurations : undefined,
    });
    for (const key of ["phone", "email", "address", "bookingUrl", "instagram", "facebook"]) {
      if (kontaktObj[key] === "") delete kontaktObj[key];
    }

    await prisma.clinic.update({
      where: { id: clinicIdParam },
      data: {
        slug,
        name,
        city,
        description,
        specializations: JSON.stringify(specializations),
        treatmentIds: JSON.stringify(treatmentIds),
        kontakt: JSON.stringify(kontaktObj),
        isPublished,
        cosmoStaffId: Number.isNaN(cosmoStaffId) ? null : cosmoStaffId,
      },
    });
    return { ok: true, slug };
  } catch (e) {
    console.error("updateClinicByAdminAction:", e);
    return { ok: false, error: "Nie udało się zapisać. Spróbuj ponownie." };
  }
}

function parseJsonRecord(formData: FormData, key: string): Record<string, number> {
  const raw = formData.get(key)?.toString();
  if (!raw) return {};
  try {
    const o = JSON.parse(raw) as unknown;
    if (!o || typeof o !== "object") return {};
    const out: Record<string, number> = {};
    for (const [k, v] of Object.entries(o)) {
      if (typeof v === "number" && !Number.isNaN(v)) out[k] = v;
    }
    return out;
  } catch {
    return {};
  }
}

export async function updateClinicAction(formData: FormData): Promise<UpdateClinicResult> {
  const session = await getServerSession(authOptions);
  const clinicId = (session?.user as { clinicId?: string })?.clinicId;
  const clinicSlug = (session?.user as { clinicSlug?: string })?.clinicSlug;
  if (!clinicId || !clinicSlug) return { ok: false, error: "Brak sesji." };

  const name = formData.get("name")?.toString()?.trim();
  const city = formData.get("city")?.toString()?.trim();
  const description = formData.get("description")?.toString()?.trim() ?? "";
  if (!name || !city) return { ok: false, error: "Nazwa i miasto są wymagane." };

  let specializations: string[] = [];
  let treatmentIds: string[] = [];
  try {
    const specRaw = formData.get("specializations")?.toString();
    if (specRaw) specializations = JSON.parse(specRaw) as string[];
  } catch {
    return { ok: false, error: "Nieprawidłowy format specjalizacji." };
  }
  try {
    const idsRaw = formData.get("treatmentIds")?.toString();
    if (idsRaw) treatmentIds = JSON.parse(idsRaw) as string[];
  } catch {
    return { ok: false, error: "Nieprawidłowy format listy zabiegów." };
  }

  const treatmentPrices = parseJsonRecord(formData, "treatmentPrices");
  const treatmentDurations = parseJsonRecord(formData, "treatmentDurations");
  const isPublished = formData.get("isPublished")?.toString() === "true";
  const cosmoRaw = formData.get("cosmoStaffId")?.toString()?.trim();
  const cosmoStaffId = cosmoRaw ? parseInt(cosmoRaw, 10) : null;

  const kontaktFields = {
    phone: formData.get("kontakt.phone")?.toString()?.trim() ?? "",
    email: formData.get("kontakt.email")?.toString()?.trim() ?? "",
    address: formData.get("kontakt.address")?.toString()?.trim() ?? "",
    bookingUrl: formData.get("kontakt.bookingUrl")?.toString()?.trim() ?? "",
    instagram: formData.get("kontakt.instagram")?.toString()?.trim() ?? "",
    facebook: formData.get("kontakt.facebook")?.toString()?.trim() ?? "",
  };

  try {
    const prisma = getPrisma();
    const existing = await prisma.clinic.findUnique({
      where: { id: clinicId },
      select: { slug: true, kontakt: true },
    });
    if (!existing) return { ok: false, error: "Nie znaleziono gabinetu." };

    let kontaktObj: Record<string, unknown> = {};
    try {
      if (existing.kontakt) kontaktObj = JSON.parse(existing.kontakt) as Record<string, unknown>;
    } catch {
      // leave empty
    }
    // Merge: preserve noOrderDays, effectsSection, aboutSection, faqSection; set contact + prices/durations
    Object.assign(kontaktObj, {
      phone: kontaktFields.phone || undefined,
      email: kontaktFields.email || undefined,
      address: kontaktFields.address || undefined,
      bookingUrl: kontaktFields.bookingUrl || undefined,
      instagram: kontaktFields.instagram || undefined,
      facebook: kontaktFields.facebook || undefined,
      treatmentPrices: Object.keys(treatmentPrices).length > 0 ? treatmentPrices : undefined,
      treatmentDurations: Object.keys(treatmentDurations).length > 0 ? treatmentDurations : undefined,
    });
    // Remove keys that are explicitly empty so we don't store "undefined"
    for (const key of ["phone", "email", "address", "bookingUrl", "instagram", "facebook"]) {
      if (kontaktObj[key] === "") delete kontaktObj[key];
    }

    await prisma.clinic.update({
      where: { id: clinicId },
      data: {
        name,
        city,
        description,
        specializations: JSON.stringify(specializations),
        treatmentIds: JSON.stringify(treatmentIds),
        kontakt: JSON.stringify(kontaktObj),
        isPublished,
        cosmoStaffId: Number.isNaN(cosmoStaffId) ? null : cosmoStaffId,
      },
    });
    return { ok: true, slug: existing.slug };
  } catch (e) {
    console.error("updateClinicAction:", e);
    return { ok: false, error: "Nie udało się zapisać. Spróbuj ponownie." };
  }
}

export async function uploadClinicAvatarAction(formData: FormData): Promise<UploadAvatarResult> {
  const session = await getServerSession(authOptions);
  const clinicId = (session?.user as { clinicId?: string })?.clinicId;
  const clinicSlug = (session?.user as { clinicSlug?: string })?.clinicSlug;
  if (!clinicId || !clinicSlug) return { ok: false, error: "Brak sesji." };
  const file = formData.get("avatar");
  if (!file || !(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Wybierz zdjęcie (JPG, PNG lub WebP, max 2 MB)." };
  }
  const result = await saveClinicImage(clinicSlug, file, "");
  if ("error" in result) return { ok: false, error: result.error };
  try {
    const prisma = getPrisma();
    await prisma.clinic.update({
      where: { id: clinicId },
      data: { avatarUrl: result.url },
    });
    return { ok: true, url: result.url };
  } catch (e) {
    console.error("uploadClinicAvatarAction:", e);
    return { ok: false, error: "Nie udało się zapisać zdjęcia." };
  }
}

export type ClinicHoursResult = { ok: true } | { ok: false; error: string };

function parseWorkingHoursPayload(
  raw: FormData | unknown
): { open: string; close: string }[] | null {
  if (!raw || typeof raw !== "object") return null;
  if (Array.isArray(raw) && raw.length === 7) {
    const out: { open: string; close: string }[] = [];
    for (let i = 0; i < 7; i++) {
      const item = raw[i];
      const open = item && typeof item === "object" && "open" in item ? String((item as { open?: string }).open ?? "") : "";
      const close = item && typeof item === "object" && "close" in item ? String((item as { close?: string }).close ?? "") : "";
      out.push({ open: open.trim(), close: close.trim() });
    }
    return out;
  }
  return null;
}

function parseNoOrderDaysPayload(raw: FormData | unknown): string[] | null {
  if (!Array.isArray(raw)) return null;
  return Array.from(
    new Set(
      raw
        .map((v) => (typeof v === "string" ? v.trim() : ""))
        .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d))
    )
  ).sort();
}

export async function updateClinicWorkingHoursAction(
  formDataOrHours: FormData | unknown
): Promise<ClinicHoursResult> {
  const session = await getServerSession(authOptions);
  const clinicId = (session?.user as { clinicId?: string })?.clinicId;
  if (!clinicId) return { ok: false, error: "Brak sesji." };
  const hours = parseWorkingHoursPayload(formDataOrHours);
  if (!hours) return { ok: false, error: "Nieprawidłowy format godzin (wymagane 7 dni)." };
  try {
    const prisma = getPrisma();
    await prisma.clinic.update({
      where: { id: clinicId },
      data: { workingHours: JSON.stringify(hours) },
    });
    return { ok: true };
  } catch (e) {
    console.error("updateClinicWorkingHoursAction:", e);
    return { ok: false, error: "Nie udało się zapisać godzin. Spróbuj ponownie." };
  }
}

export async function updateClinicNoOrderDaysAction(
  formDataOrDays: FormData | unknown
): Promise<ClinicHoursResult> {
  const session = await getServerSession(authOptions);
  const clinicId = (session?.user as { clinicId?: string })?.clinicId;
  if (!clinicId) return { ok: false, error: "Brak sesji." };
  const noOrderDays = parseNoOrderDaysPayload(formDataOrDays);
  if (noOrderDays === null) return { ok: false, error: "Nieprawidłowy format listy dat." };
  try {
    const prisma = getPrisma();
    const clinic = await prisma.clinic.findUnique({
      where: { id: clinicId },
      select: { kontakt: true },
    });
    if (!clinic) return { ok: false, error: "Nie znaleziono gabinetu." };
    let kontaktObj: Record<string, unknown> = {};
    try {
      if (clinic.kontakt) kontaktObj = JSON.parse(clinic.kontakt) as Record<string, unknown>;
    } catch {
      // leave empty
    }
    kontaktObj.noOrderDays = noOrderDays;
    await prisma.clinic.update({
      where: { id: clinicId },
      data: { kontakt: JSON.stringify(kontaktObj) },
    });
    return { ok: true };
  } catch (e) {
    console.error("updateClinicNoOrderDaysAction:", e);
    return { ok: false, error: "Nie udało się zapisać dni bez rezerwacji. Spróbuj ponownie." };
  }
}

export async function setBookingPhoneOnlyAction(
  formDataOrValue: FormData | boolean
): Promise<SetBookingPhoneOnlyResult> {
  const session = await getServerSession(authOptions);
  const clinicId = (session?.user as { clinicId?: string })?.clinicId;
  if (!clinicId) return { ok: false, error: "Brak sesji." };
  const value =
    typeof formDataOrValue === "boolean"
      ? formDataOrValue
      : formDataOrValue.get("value") === "true" || formDataOrValue.get("value") === "1";
  try {
    const prisma = getPrisma();
    await prisma.clinic.update({
      where: { id: clinicId },
      data: { bookingPhoneOnly: value },
    });
    return { ok: true };
  } catch (e) {
    console.error("setBookingPhoneOnlyAction:", e);
    return { ok: false, error: "Nie udało się zapisać. Spróbuj ponownie." };
  }
}

type SectionResult = { ok: true } | { ok: false; error: string };

function mergeKontaktSection(
  existingKontakt: string | null,
  sectionKey: string,
  sectionValue: Record<string, unknown>
): string {
  let obj: Record<string, unknown> = {};
  try {
    if (existingKontakt) obj = JSON.parse(existingKontakt) as Record<string, unknown>;
  } catch {
    // leave empty
  }
  obj[sectionKey] = sectionValue;
  return JSON.stringify(obj);
}

export async function updateClinicEffectsSectionAction(
  payload: FormData | unknown
): Promise<SectionResult> {
  const session = await getServerSession(authOptions);
  const clinicId = (session?.user as { clinicId?: string })?.clinicId;
  if (!clinicId) return { ok: false, error: "Brak sesji." };
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return { ok: false, error: "Nieprawidłowe dane." };
  }
  const p = payload as Record<string, unknown>;
  const effectsSection = {
    enabled: p.enabled !== false,
    title: typeof p.title === "string" ? p.title.trim() : "Realne efekty terapii",
    subtitle: typeof p.subtitle === "string" ? p.subtitle.trim() : "",
    cards: Array.isArray(p.cards)
      ? (p.cards as Record<string, unknown>[]).slice(0, 6).map((c) => ({
          problem: typeof c.problem === "string" ? c.problem : "",
          terapia: typeof c.terapia === "string" ? c.terapia : "",
          wizyty: typeof c.wizyty === "string" ? c.wizyty : "",
          efekt: typeof c.efekt === "string" ? c.efekt : "",
        }))
      : [],
  };
  try {
    const prisma = getPrisma();
    const clinic = await prisma.clinic.findUnique({
      where: { id: clinicId },
      select: { kontakt: true },
    });
    if (!clinic) return { ok: false, error: "Nie znaleziono gabinetu." };
    const kontakt = mergeKontaktSection(clinic.kontakt, "effectsSection", effectsSection);
    await prisma.clinic.update({
      where: { id: clinicId },
      data: { kontakt },
    });
    return { ok: true };
  } catch (e) {
    console.error("updateClinicEffectsSectionAction:", e);
    return { ok: false, error: "Nie udało się zapisać." };
  }
}

export async function updateClinicAboutSectionAction(
  payload: FormData | unknown
): Promise<SectionResult> {
  const session = await getServerSession(authOptions);
  const clinicId = (session?.user as { clinicId?: string })?.clinicId;
  if (!clinicId) return { ok: false, error: "Brak sesji." };
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return { ok: false, error: "Nieprawidłowe dane." };
  }
  const p = payload as Record<string, unknown>;
  try {
    const prisma = getPrisma();
    const clinic = await prisma.clinic.findUnique({
      where: { id: clinicId },
      select: { kontakt: true },
    });
    if (!clinic) return { ok: false, error: "Nie znaleziono gabinetu." };
    let existingAbout: Record<string, unknown> = {};
    try {
      const k = clinic.kontakt ? (JSON.parse(clinic.kontakt) as Record<string, unknown>) : {};
      const raw = k.aboutSection;
      if (raw && typeof raw === "object") existingAbout = raw as Record<string, unknown>;
    } catch {
      // leave empty
    }
    const aboutSection = {
      ...existingAbout,
      enabled: p.enabled !== false,
      title: typeof p.title === "string" ? p.title.trim() : "O mnie",
      imageAlt: typeof p.imageAlt === "string" ? p.imageAlt.trim() : existingAbout.imageAlt ?? "",
      paragraphs: Array.isArray(p.paragraphs)
        ? (p.paragraphs as string[]).map((s) => (typeof s === "string" ? s.trim() : "")).filter(Boolean)
        : (existingAbout.paragraphs as string[] | undefined) ?? [],
    };
    const kontakt = mergeKontaktSection(
      clinic.kontakt,
      "aboutSection",
      aboutSection
    );
    await prisma.clinic.update({
      where: { id: clinicId },
      data: { kontakt },
    });
    return { ok: true };
  } catch (e) {
    console.error("updateClinicAboutSectionAction:", e);
    return { ok: false, error: "Nie udało się zapisać." };
  }
}

export async function uploadClinicAboutImageAction(
  formData: FormData
): Promise<UploadAboutImageResult> {
  const session = await getServerSession(authOptions);
  const clinicId = (session?.user as { clinicId?: string })?.clinicId;
  const clinicSlug = (session?.user as { clinicSlug?: string })?.clinicSlug;
  if (!clinicId || !clinicSlug) return { ok: false, error: "Brak sesji." };
  const file = formData.get("aboutImage");
  if (!file || !(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Wybierz zdjęcie (JPG, PNG lub WebP)." };
  }
  const result = await saveClinicImage(clinicSlug, file, "-about");
  if ("error" in result) return { ok: false, error: result.error };
  try {
    const prisma = getPrisma();
    const clinic = await prisma.clinic.findUnique({
      where: { id: clinicId },
      select: { kontakt: true },
    });
    if (!clinic) return { ok: false, error: "Nie znaleziono gabinetu." };
    let obj: Record<string, unknown> = {};
    try {
      if (clinic.kontakt) obj = JSON.parse(clinic.kontakt) as Record<string, unknown>;
    } catch {
      // leave empty
    }
    const existingAbout = (obj.aboutSection && typeof obj.aboutSection === "object"
      ? obj.aboutSection
      : {}) as Record<string, unknown>;
    obj.aboutSection = { ...existingAbout, imageUrl: result.url };
    await prisma.clinic.update({
      where: { id: clinicId },
      data: { kontakt: JSON.stringify(obj) },
    });
    return { ok: true, url: result.url, imageUrl: result.url };
  } catch (e) {
    console.error("uploadClinicAboutImageAction:", e);
    return { ok: false, error: "Nie udało się zapisać zdjęcia." };
  }
}

export async function updateClinicFaqSectionAction(
  payload: FormData | unknown
): Promise<SectionResult> {
  const session = await getServerSession(authOptions);
  const clinicId = (session?.user as { clinicId?: string })?.clinicId;
  if (!clinicId) return { ok: false, error: "Brak sesji." };
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return { ok: false, error: "Nieprawidłowe dane." };
  }
  const p = payload as Record<string, unknown>;
  const faqSection = {
    enabled: p.enabled !== false,
    title: typeof p.title === "string" ? p.title.trim() : "Najczęściej zadawane pytania",
    items: Array.isArray(p.items)
      ? (p.items as Record<string, unknown>[]).slice(0, 10).map((i) => ({
          question: typeof i.question === "string" ? i.question.trim() : "",
          answer: typeof i.answer === "string" ? i.answer.trim() : "",
        }))
      : [],
  };
  try {
    const prisma = getPrisma();
    const clinic = await prisma.clinic.findUnique({
      where: { id: clinicId },
      select: { kontakt: true },
    });
    if (!clinic) return { ok: false, error: "Nie znaleziono gabinetu." };
    const kontakt = mergeKontaktSection(clinic.kontakt, "faqSection", faqSection);
    await prisma.clinic.update({
      where: { id: clinicId },
      data: { kontakt },
    });
    return { ok: true };
  } catch (e) {
    console.error("updateClinicFaqSectionAction:", e);
    return { ok: false, error: "Nie udało się zapisać." };
  }
}
