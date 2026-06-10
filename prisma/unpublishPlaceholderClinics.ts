/**
 * Wyłącza masowe placeholdery salon-piekna-* (opcja SEO 2 — tylko prawdziwi partnerzy).
 * Uruchom: npm run unpublish:placeholder-clinics
 */
import "dotenv/config";
import { getPrisma } from "../lib/db";

async function main() {
  const prisma = getPrisma();
  const result = await prisma.clinic.updateMany({
    where: { slug: { startsWith: "salon-piekna-" } },
    data: { isPublished: false },
  });
  console.log(`Wyłączono publikację ${result.count} gabinetów placeholder (salon-piekna-*).`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
