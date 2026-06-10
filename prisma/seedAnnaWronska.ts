/**
 * Seed gabinetu Permanent Studio Anna Wrońska (makijaż permanentny, mezoterapia, lipoliza).
 * Uruchom: npx tsx prisma/seedAnnaWronska.ts
 *
 * Login: anna@permanent-studio.pl
 * Hasło: Permanent2025!
 */
import "dotenv/config";
import bcrypt from "bcrypt";
import { getPrisma } from "../lib/db";

const CLINIC_SLUG = "anna-wronska-makijaz-permanentny";
const CLINIC_NAME = "Anna Wrońska Makijaż Permanentny";
const CLINIC_EMAIL = "anna@permanent-studio.pl";
const CLINIC_PASSWORD = "Permanent2025!";
const CLINIC_CITY = "Kołobrzeg";
const CLINIC_DESCRIPTION = `Permanent Studio — makijaż permanentny, mezoterapia i zabiegi estetyczne. Anna Wrońska specjalizuje się w pigmentacji brwi, ust, kreski w linii rzęs oraz mezoterapii Dermapen i lipolizie iniekcyjnej.`;

const TREATMENT_IDS = [
  "makijaz_permanentny_brwi",
  "makijaz_permanentny_usta",
  "kreska_linia_rzes",
  "kreska_dekoracyjna",
  "dopigmentowanie",
  "aureola_brodawka",
  "peeling_weglowy",
  "resurfacing",
  "peeling_weglowy_resurfacing",
  "mezoterapia_dermapen_twarz",
  "mezoterapia_dermapen_twarz_szyja_dekolt",
  "mezoterapia_dermapen_cialo",
  "mezoterapia_twarz_dives",
  "mezoterapia_neauvia",
  "mezoterapia_szyja_dekolt_dlonie",
  "lipoliza_podbrodek",
  "lipoliza_cialo_10ml",
  "lipoliza_cialo_20ml",
];

const TREATMENT_PRICES: Record<string, number> = {
  makijaz_permanentny_brwi: 800,
  makijaz_permanentny_usta: 900,
  kreska_linia_rzes: 650,
  kreska_dekoracyjna: 750,
  dopigmentowanie: 150,
  aureola_brodawka: 500,
  peeling_weglowy: 300,
  resurfacing: 200,
  peeling_weglowy_resurfacing: 350,
  mezoterapia_dermapen_twarz: 350,
  mezoterapia_dermapen_twarz_szyja_dekolt: 600,
  mezoterapia_dermapen_cialo: 300,
  mezoterapia_twarz_dives: 400,
  mezoterapia_neauvia: 600,
  mezoterapia_szyja_dekolt_dlonie: 500,
  lipoliza_podbrodek: 400,
  lipoliza_cialo_10ml: 500,
  lipoliza_cialo_20ml: 700,
};

const TREATMENT_DURATIONS: Record<string, number> = {
  makijaz_permanentny_brwi: 120,
  makijaz_permanentny_usta: 120,
  kreska_linia_rzes: 90,
  kreska_dekoracyjna: 90,
  dopigmentowanie: 60,
  aureola_brodawka: 120,
  peeling_weglowy: 45,
  resurfacing: 45,
  peeling_weglowy_resurfacing: 60,
  mezoterapia_dermapen_twarz: 60,
  mezoterapia_dermapen_twarz_szyja_dekolt: 90,
  mezoterapia_dermapen_cialo: 45,
  mezoterapia_twarz_dives: 45,
  mezoterapia_neauvia: 60,
  mezoterapia_szyja_dekolt_dlonie: 60,
  lipoliza_podbrodek: 45,
  lipoliza_cialo_10ml: 60,
  lipoliza_cialo_20ml: 90,
};

async function main() {
  const prisma = getPrisma();

  const email = process.env.ANNA_WRONSKA_EMAIL ?? CLINIC_EMAIL;
  const password = process.env.ANNA_WRONSKA_PASSWORD ?? CLINIC_PASSWORD;

  if (password.length < 10) {
    throw new Error("ANNA_WRONSKA_PASSWORD musi mieć min. 10 znaków (lub użyj domyślnego Permanent2025!)");
  }

  const hash = await bcrypt.hash(password, 10);

  const kontakt = JSON.stringify({
    email: email,
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
      specializations: JSON.stringify(["brwi_rzesy", "anti_aging", "jedrnost", "przebarwienia"]),
      matchingTags: JSON.stringify(["acne", "antiaging", "wrinkles", "pigmentation"]),
      treatmentIds: JSON.stringify(TREATMENT_IDS),
      kontakt,
      isPublished: true,
    },
    update: {
      name: CLINIC_NAME,
      city: CLINIC_CITY,
      description: CLINIC_DESCRIPTION,
      specializations: JSON.stringify(["brwi_rzesy", "anti_aging", "jedrnost", "przebarwienia"]),
      matchingTags: JSON.stringify(["acne", "antiaging", "wrinkles", "pigmentation"]),
      treatmentIds: JSON.stringify(TREATMENT_IDS),
      kontakt,
      isPublished: true,
    },
  });

  await prisma.clinicAccount.upsert({
    where: { email: email.toLowerCase().trim() },
    create: {
      email: email.toLowerCase().trim(),
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
    where: { clinicId: clinic.id, name: "Anna Wrońska" },
  });
  if (!staff) {
    staff = await prisma.staff.create({
      data: {
        clinicId: clinic.id,
        name: "Anna Wrońska",
        order: 0,
      },
    });
  }

  console.log("Gabinet utworzony:");
  console.log("  Slug:", clinic.slug);
  console.log("  Nazwa:", clinic.name);
  console.log("  Profil:", `https://salon.odart.pl/portal/gabinet/${clinic.slug}`);
  console.log("");
  console.log("Login do panelu:");
  console.log("  Email:", email);
  console.log("  Hasło:", process.env.ANNA_WRONSKA_PASSWORD ? "***" : password);
  console.log("  Panel:", "https://salon.odart.pl/portal/panel");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
