-- Catalog source fields for CEIDG / Google beauty listings
ALTER TABLE "Clinic" ADD COLUMN "listingSource" TEXT;
ALTER TABLE "Clinic" ADD COLUMN "ceidgId" TEXT;
ALTER TABLE "Clinic" ADD COLUMN "nip" TEXT;
ALTER TABLE "Clinic" ADD COLUMN "googlePlaceId" TEXT;

CREATE UNIQUE INDEX "Clinic_ceidgId_key" ON "Clinic"("ceidgId");
CREATE INDEX "Clinic_listingSource_idx" ON "Clinic"("listingSource");
CREATE INDEX "Clinic_city_idx" ON "Clinic"("city");
CREATE INDEX "Clinic_isPublished_idx" ON "Clinic"("isPublished");
