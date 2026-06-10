-- AlterTable: katalog usług i preparatów (ETAP 1 — bez magazynu ERP)
ALTER TABLE "VaccineType" ADD COLUMN "category" TEXT NOT NULL DEFAULT 'szczepienie';
ALTER TABLE "VaccineType" ADD COLUMN "manufacturer" TEXT;
ALTER TABLE "VaccineType" ADD COLUMN "defaultPrice" INTEGER;
ALTER TABLE "VaccineType" ADD COLUMN "defaultVisitType" TEXT;

ALTER TABLE "VetAppointment" ADD COLUMN "catalogItemId" TEXT REFERENCES "VaccineType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Vaccination" ADD COLUMN "batchExpiryDate" TEXT;

CREATE INDEX "VaccineType_vetClinicId_category_idx" ON "VaccineType"("vetClinicId", "category");
CREATE INDEX "VetAppointment_catalogItemId_idx" ON "VetAppointment"("catalogItemId");
