-- ETAP 3: minimalny stock (dawki) + powiązanie z URPL
ALTER TABLE "VaccineType" ADD COLUMN "trackStock" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "VaccineType" ADD COLUMN "stockDoses" INTEGER;
ALTER TABLE "VaccineType" ADD COLUMN "urplId" TEXT;
ALTER TABLE "VaccineType" ADD COLUMN "permitNumber" TEXT;

CREATE INDEX "VaccineType_urplId_idx" ON "VaccineType"("urplId");
