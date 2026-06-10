-- Plan profilaktyki: wpisy ręczne (badania, kontrole) + wyłączenie planu
ALTER TABLE "Pet" ADD COLUMN "preventionPlanDisabled" BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE "PetPreventionRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "petId" TEXT NOT NULL,
    "itemKey" TEXT NOT NULL,
    "doneAt" DATETIME NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PetPreventionRecord_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "PetPreventionRecord_petId_idx" ON "PetPreventionRecord"("petId");
CREATE INDEX "PetPreventionRecord_petId_itemKey_idx" ON "PetPreventionRecord"("petId", "itemKey");
