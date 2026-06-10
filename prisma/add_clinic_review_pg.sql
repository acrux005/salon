-- Tabela opinii o gabinetach (PostgreSQL). Uruchom na serwerze: npx prisma db execute --file prisma/add_clinic_review_pg.sql
CREATE TABLE IF NOT EXISTS "ClinicReview" (
    "id" TEXT NOT NULL,
    "clinicId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "authorName" TEXT NOT NULL DEFAULT '',
    "rating" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ClinicReview_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "ClinicReview_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ClinicReview_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "ClinicReview_clinicId_clientId_key" ON "ClinicReview"("clinicId", "clientId");
CREATE INDEX IF NOT EXISTS "ClinicReview_clinicId_idx" ON "ClinicReview"("clinicId");
CREATE INDEX IF NOT EXISTS "ClinicReview_clientId_idx" ON "ClinicReview"("clientId");
