-- CreateTable
CREATE TABLE "ClinicTreatmentPrice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clinicId" TEXT NOT NULL,
    "treatmentId" TEXT NOT NULL,
    "cena_od" INTEGER NOT NULL,
    CONSTRAINT "ClinicTreatmentPrice_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ClinicTreatmentPrice_clinicId_treatmentId_key" ON "ClinicTreatmentPrice"("clinicId", "treatmentId");
