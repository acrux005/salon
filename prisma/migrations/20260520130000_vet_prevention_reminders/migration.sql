-- Przypomnienia profilaktyki: klucz pozycji + kanał e-mail
ALTER TABLE "VetScheduledReminder" ADD COLUMN "itemKey" TEXT;

CREATE INDEX "VetScheduledReminder_petId_idx" ON "VetScheduledReminder"("petId");
CREATE INDEX "VetScheduledReminder_petId_kind_itemKey_idx" ON "VetScheduledReminder"("petId", "kind", "itemKey");
