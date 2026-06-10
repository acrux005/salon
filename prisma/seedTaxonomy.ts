/**
 * zamow.odart.pl nie używa taksonomii zabiegów (kategorie/podkategorie/tagi).
 * Skrypt pozostawiony jako no-op dla kompatybilności z npm run seed:taxonomy.
 */
import "dotenv/config";

async function run(): Promise<void> {
  console.log("seed:taxonomy — pominięte (Zamów nie używa taksonomii zabiegów).");
}

run()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
