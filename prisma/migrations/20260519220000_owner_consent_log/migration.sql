-- AlterTable
ALTER TABLE "PetOwner" ADD COLUMN "marketingConsent" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "VetOwnerConsentLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "vetClinicId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "consentType" TEXT NOT NULL,
    "granted" BOOLEAN NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'panel',
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "VetOwnerConsentLog_vetClinicId_fkey" FOREIGN KEY ("vetClinicId") REFERENCES "VetClinic" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "VetOwnerConsentLog_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "PetOwner" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "VetOwnerConsentLog_vetClinicId_idx" ON "VetOwnerConsentLog"("vetClinicId");
CREATE INDEX "VetOwnerConsentLog_ownerId_idx" ON "VetOwnerConsentLog"("ownerId");
CREATE INDEX "VetOwnerConsentLog_createdAt_idx" ON "VetOwnerConsentLog"("createdAt");
