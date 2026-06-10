-- Akceptacja planu leczenia przez pacjenta w portalu
ALTER TABLE "GabTreatmentPlan" ADD COLUMN "presentedAt" DATETIME;
ALTER TABLE "GabTreatmentPlan" ADD COLUMN "acceptedAt" DATETIME;
ALTER TABLE "GabTreatmentPlan" ADD COLUMN "patientResponseNote" TEXT;
