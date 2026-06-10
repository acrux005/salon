-- CreateTable
CREATE TABLE "VetHerd" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "vetClinicId" TEXT NOT NULL,
    "ownerId" TEXT,
    "name" TEXT NOT NULL,
    "species" TEXT NOT NULL DEFAULT 'owca',
    "location" TEXT,
    "headCount" INTEGER,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "VetHerd_vetClinicId_fkey" FOREIGN KEY ("vetClinicId") REFERENCES "VetClinic" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "VetHerd_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "PetOwner" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- AlterTable
ALTER TABLE "Pet" ADD COLUMN "herdId" TEXT REFERENCES "VetHerd"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX "VetHerd_vetClinicId_idx" ON "VetHerd"("vetClinicId");

-- CreateIndex
CREATE INDEX "VetHerd_ownerId_idx" ON "VetHerd"("ownerId");

-- CreateIndex
CREATE INDEX "Pet_herdId_idx" ON "Pet"("herdId");
