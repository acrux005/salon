/**
 * @deprecated Nie używać na produkcji (opcja SEO 2). Placeholdery szkodzą SEO.
 * Jeden gabinet na miasto — tylko dev/demo.
 * Uruchom: ALLOW_PLACEHOLDER_CLINICS=1 npm run seed:portal-cities
 */
import "dotenv/config";
import { PORTAL_SEO_CITIES } from "../content/portalCities";
import { getPrisma } from "../lib/db";

const DEFAULT_TREATMENT_IDS = [
  "peeling_kawitacyjny",
  "peeling_chemiczny_aha_bha",
  "infuzja_tlenowa",
  "kwas_hialuronowy_zabieg",
  "mezoterapia_iglowa_ha",
  "zabiegi_lagodzace_bariera",
];

const DEFAULT_SPECIALIZATIONS = ["anti_aging", "tradzik", "przebarwienia", "sucha_skora"];
const DEFAULT_MATCHING_TAGS = ["antiaging", "acne", "pigmentation", "dryness", "dehydration"];

function clinicSlugForCity(citySlug: string) {
  return `salon-piekna-${citySlug}`;
}

function descriptionFor(cityName: string, locative: string) {
  return (
    `Gabinet kosmetyczny w ${locative} — zabiegi na twarz i ciało: pielęgnacja, anti-aging, oczyszczanie i nawilżanie skóry. ` +
    `Umów konsultację lub wizytę online przez portal Zabiegi Odart. Partner lokalny: ${cityName}.`
  );
}

async function main() {
  if (process.env.ALLOW_PLACEHOLDER_CLINICS !== "1") {
    console.error(
      "Odmowa: ustaw ALLOW_PLACEHOLDER_CLINICS=1 aby uruchomić (niezalecane na produkcji)."
    );
    process.exit(1);
  }
  const prisma = getPrisma();
  let created = 0;
  let skipped = 0;

  for (let i = 0; i < PORTAL_SEO_CITIES.length; i++) {
    const city = PORTAL_SEO_CITIES[i];
    const existingCount = await prisma.clinic.count({
      where: { city: city.name, isPublished: true },
    });
    if (existingCount > 0) {
      skipped++;
      console.log(`Pominięto ${city.name} — już ${existingCount} gabinet(ów)`);
      continue;
    }

    const slug = clinicSlugForCity(city.slug);
    const rating = 4.4 + (i % 6) * 0.1;
    const reviewCount = 12 + (i % 40);

    const clinic = await prisma.clinic.upsert({
      where: { slug },
      create: {
        slug,
        name: `Salon Piękna ${city.name}`,
        city: city.name,
        description: descriptionFor(city.name, city.locative),
        rating,
        reviewCount,
        specializations: JSON.stringify(DEFAULT_SPECIALIZATIONS),
        matchingTags: JSON.stringify(DEFAULT_MATCHING_TAGS),
        treatmentIds: JSON.stringify(DEFAULT_TREATMENT_IDS),
        kontakt: JSON.stringify({
          email: `kontakt+${city.slug}@zabiegi.odart.pl`,
          bookingUrl: `/portal/gabinet/${slug}?rezerwacja=1`,
        }),
        isPublished: true,
        bookingPhoneOnly: true,
      },
      update: {
        name: `Salon Piękna ${city.name}`,
        city: city.name,
        description: descriptionFor(city.name, city.locative),
        isPublished: true,
      },
    });

    const staffExists = await prisma.staff.findFirst({ where: { clinicId: clinic.id } });
    if (!staffExists) {
      await prisma.staff.create({
        data: {
          clinicId: clinic.id,
          name: `Zespół — ${city.name}`,
          order: 0,
        },
      });
    }

    created++;
    console.log(`+ ${city.name} → /portal/gabinet/${clinic.slug}`);
  }

  console.log(`\nGotowe: utworzono/zaktualizowano ${created}, pominięto ${skipped} (miały gabinety).`);
  console.log(`Miast w konfiguracji SEO: ${PORTAL_SEO_CITIES.length}`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
