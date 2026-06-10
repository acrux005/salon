-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN "orderNumberPrefix" TEXT NOT NULL DEFAULT '';
ALTER TABLE "Restaurant" ADD COLUMN "orderNumberNext" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN "publicNumber" TEXT;
