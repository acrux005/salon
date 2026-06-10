-- AlterTable
ALTER TABLE "Pet" ADD COLUMN "sex" TEXT;
ALTER TABLE "Pet" ADD COLUMN "coatColor" TEXT;
ALTER TABLE "Pet" ADD COLUMN "chipDate" TEXT;
ALTER TABLE "Pet" ADD COLUMN "chipManufacturer" TEXT;
ALTER TABLE "Pet" ADD COLUMN "safeAnimalStatus" TEXT NOT NULL DEFAULT 'not_synced';
ALTER TABLE "Pet" ADD COLUMN "safeAnimalSyncedAt" DATETIME;

-- CreateIndex
CREATE INDEX "Pet_safeAnimalStatus_idx" ON "Pet"("safeAnimalStatus");
CREATE INDEX "Pet_chipNumber_idx" ON "Pet"("chipNumber");
