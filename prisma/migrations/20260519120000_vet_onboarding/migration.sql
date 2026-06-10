-- Kreator konfiguracji przychodni (wzorowany na Veterinaro)
ALTER TABLE "VetClinic" ADD COLUMN "nip" TEXT;
ALTER TABLE "VetClinic" ADD COLUMN "street" TEXT;
ALTER TABLE "VetClinic" ADD COLUMN "houseNumber" TEXT;
ALTER TABLE "VetClinic" ADD COLUMN "apartmentNumber" TEXT;
ALTER TABLE "VetClinic" ADD COLUMN "postalCode" TEXT;
ALTER TABLE "VetClinic" ADD COLUMN "vatExempt" BOOLEAN NOT NULL DEFAULT 0;
ALTER TABLE "VetClinic" ADD COLUMN "ownerIsVet" BOOLEAN NOT NULL DEFAULT 1;
ALTER TABLE "VetClinic" ADD COLUMN "onboardingStep" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "VetClinic" ADD COLUMN "onboardingDoneAt" DATETIME;
ALTER TABLE "VetClinic" ADD COLUMN "settingsJson" TEXT;

-- Istniejące przychodnie — pomijamy kreator
UPDATE "VetClinic" SET "onboardingStep" = 6, "onboardingDoneAt" = CURRENT_TIMESTAMP WHERE "onboardingStep" = 0;
