-- Powiązanie zamówień z kontem klienta (Moje zamówienia, powiadomienia statusu)
ALTER TABLE "Order" ADD COLUMN "clientId" TEXT;
ALTER TABLE "Order" ADD COLUMN "discountPlz" INTEGER;
CREATE INDEX "Order_clientId_idx" ON "Order"("clientId");
