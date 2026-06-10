-- AlterTable
ALTER TABLE "Pet" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'active';

-- CreateIndex
CREATE INDEX "Pet_status_idx" ON "Pet"("status");
