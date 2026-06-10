-- CreateTable
CREATE TABLE "VetOwnerAccount" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "emailVerifiedAt" DATETIME,
    "verificationToken" TEXT,
    "verificationTokenExpires" DATETIME,
    "activeVetClinicId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "VetOwnerAccount_activeVetClinicId_fkey" FOREIGN KEY ("activeVetClinicId") REFERENCES "VetClinic" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "VetPetDocument" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "petId" TEXT,
    "accountId" TEXT,
    "vetClinicId" TEXT,
    "documentType" TEXT NOT NULL DEFAULT 'other',
    "fileName" TEXT,
    "extractedJson" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "VetPetDocument_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "VetPetDocument_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "VetOwnerAccount" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- AlterTable
ALTER TABLE "PetOwner" ADD COLUMN "accountId" TEXT REFERENCES "VetOwnerAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Pet" ADD COLUMN "accountId" TEXT REFERENCES "VetOwnerAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Pet" ADD COLUMN "pedigreeNotes" TEXT;
ALTER TABLE "Pet" ADD COLUMN "pedigreeJson" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "VetOwnerAccount_email_key" ON "VetOwnerAccount"("email");
CREATE INDEX "VetOwnerAccount_activeVetClinicId_idx" ON "VetOwnerAccount"("activeVetClinicId");
CREATE INDEX "VetOwnerAccount_phone_idx" ON "VetOwnerAccount"("phone");
CREATE UNIQUE INDEX "PetOwner_accountId_vetClinicId_key" ON "PetOwner"("accountId", "vetClinicId");
CREATE INDEX "PetOwner_accountId_idx" ON "PetOwner"("accountId");
CREATE INDEX "Pet_accountId_idx" ON "Pet"("accountId");
CREATE INDEX "VetPetDocument_petId_idx" ON "VetPetDocument"("petId");
CREATE INDEX "VetPetDocument_accountId_idx" ON "VetPetDocument"("accountId");
CREATE INDEX "VetPetDocument_vetClinicId_idx" ON "VetPetDocument"("vetClinicId");
