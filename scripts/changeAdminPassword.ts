/**
 * Zmiana hasła admina (tabela Admin).
 * Użycie: npx tsx scripts/changeAdminPassword.ts <email> <nowe_haslo>
 */
import "dotenv/config";
import bcrypt from "bcrypt";
import { getPrisma } from "../lib/db";

const email = process.argv[2]?.toLowerCase().trim();
const newPassword = process.argv[3];

if (!email || !newPassword) {
  console.error("Użycie: npx tsx scripts/changeAdminPassword.ts <email> <nowe_haslo>");
  process.exit(1);
}

async function main() {
  const prisma = getPrisma();
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) {
    console.error(`Nie znaleziono admina z emailem: ${email}`);
    process.exit(1);
  }
  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.admin.update({
    where: { email },
    data: { passwordHash },
  });
  console.log(`Hasło zmienione dla ${email}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
