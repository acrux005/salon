-- CreateTable
CREATE TABLE "ClinicTreatmentRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clinicId" TEXT NOT NULL,
    "nazwa" TEXT NOT NULL,
    "opis" TEXT NOT NULL,
    "problemIds" TEXT NOT NULL,
    "czas" INTEGER NOT NULL,
    "cena_od" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" DATETIME,
    "createdTreatmentId" TEXT,
    CONSTRAINT "ClinicTreatmentRequest_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "Clinic" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
