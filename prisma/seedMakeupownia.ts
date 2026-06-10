/**
 * Seed gabinetu Makeupownia Emilia Lorych (makijaż okolicznościowy, ślubny).
 * Uruchom: npx tsx prisma/seedMakeupownia.ts
 */
import "dotenv/config";
import bcrypt from "bcrypt";
import { getPrisma } from "../lib/db";

const CLINIC_SLUG = "makeupownia-emilia-lorych";
const CLINIC_NAME = "Makeupownia Emilia Lorych";
const CLINIC_EMAIL = process.env.MAKEUPOWNIA_EMAIL ?? "emilia@makeupownia.pl";
const CLINIC_PASSWORD = process.env.MAKEUPOWNIA_PASSWORD ?? "Makeupownia2025!";
const CLINIC_CITY = "Kołobrzeg";
const CLINIC_DESCRIPTION =
  "Profesjonalny makijaż okolicznościowy i ślubny. Emilia Lorych tworzy wyjątkowe kreacje na każdą okazję – od wieczornych wyjść po uroczystości ślubne.";

const TREATMENT_IDS = [
  "makijaz_okolicznosciowy",
  "makijaz_slubny_bez_probnego",
  "makijaz_probny_slubny",
];

const TREATMENT_PRICES: Record<string, number> = {
  makijaz_okolicznosciowy: 250,
  makijaz_slubny_bez_probnego: 300,
  makijaz_probny_slubny: 250,
};

const TREATMENT_DURATIONS: Record<string, number> = {
  makijaz_okolicznosciowy: 60,
  makijaz_slubny_bez_probnego: 90,
  makijaz_probny_slubny: 90,
};

async function main() {
  const prisma = getPrisma();

  const email = CLINIC_EMAIL.toLowerCase().trim();
  const password =
    (process.env.MAKEUPOWNIA_PASSWORD ?? CLINIC_PASSWORD).length >= 10
      ? process.env.MAKEUPOWNIA_PASSWORD ?? CLINIC_PASSWORD
      : "Makeupownia2025!";

  const hash = await bcrypt.hash(password, 10);

  const kontakt = JSON.stringify({
    email,
    treatmentPrices: TREATMENT_PRICES,
    treatmentDurations: TREATMENT_DURATIONS,
  });

  const clinic = await prisma.clinic.upsert({
    where: { slug: CLINIC_SLUG },
    create: {
      slug: CLINIC_SLUG,
      name: CLINIC_NAME,
      city: CLINIC_CITY,
      description: CLINIC_DESCRIPTION,
      specializations: JSON.stringify(["makijaz"]),
      matchingTags: JSON.stringify([]),
      treatmentIds: JSON.stringify(TREATMENT_IDS),
      kontakt,
      isPublished: true,
    },
    update: {
      name: CLINIC_NAME,
      city: CLINIC_CITY,
      description: CLINIC_DESCRIPTION,
      specializations: JSON.stringify(["makijaz"]),
      treatmentIds: JSON.stringify(TREATMENT_IDS),
      kontakt,
      isPublished: true,
    },
  });

  await prisma.clinicAccount.upsert({
    where: { email },
    create: {
      email,
      passwordHash: hash,
      clinicId: clinic.id,
      emailVerifiedAt: new Date(),
    },
    update: {
      passwordHash: hash,
      clinicId: clinic.id,
      emailVerifiedAt: new Date(),
    },
  });

  // Staff (wymagane do rezerwacji)
  let staff = await prisma.staff.findFirst({
    where: { clinicId: clinic.id, name: "Emilia Lorych" },
  });
  if (!staff) {
    staff = await prisma.staff.create({
      data: {
        clinicId: clinic.id,
        name: "Emilia Lorych",
        order: 0,
      },
    });
  }

  console.log("Gabinet Makeupownia Emilia Lorych utworzony:");
  console.log("  Slug:", clinic.slug);
  console.log("  Nazwa:", clinic.name);
  console.log("  Zabiegi: Makijaż okolicznościowy (250 zł), Makijaż ślubny bez próbnego (300 zł), Makijaż próbny ślubny (250 zł)");
  console.log("  Profil:", `https://salon.odart.pl/portal/gabinet/${clinic.slug}`);
  console.log("");
  console.log("Login do panelu (MAKEUPOWNIA_EMAIL / MAKEUPOWNIA_PASSWORD w .env):");
  console.log("  Email:", email);
  console.log("  Panel:", "https://salon.odart.pl/portal/panel");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
