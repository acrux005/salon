import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaPg } from "@prisma/adapter-pg";

let _prisma: PrismaClient | null = null;

function createPrisma(): PrismaClient {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set. Set it to file:./prisma/dev.db for SQLite or postgresql://... for PostgreSQL.");
  }
  if (databaseUrl.startsWith("file:")) {
    const adapter = new PrismaBetterSqlite3({ url: databaseUrl });
    return new PrismaClient({ adapter });
  }
  if (databaseUrl.startsWith("postgresql://") || databaseUrl.startsWith("postgres://")) {
    const adapter = new PrismaPg({ connectionString: databaseUrl });
    return new PrismaClient({ adapter });
  }
  throw new Error(
    "DATABASE_URL must start with file: (SQLite) or postgresql:// (PostgreSQL)."
  );
}

export function getPrisma(): PrismaClient {
  if (!_prisma) _prisma = createPrisma();
  return _prisma;
}
