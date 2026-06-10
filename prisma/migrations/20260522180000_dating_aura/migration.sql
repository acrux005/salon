-- AlterTable
ALTER TABLE "DatingProfile" ADD COLUMN "auraImageUrl" TEXT;
ALTER TABLE "DatingProfile" ADD COLUMN "auraCaption" TEXT NOT NULL DEFAULT '';
ALTER TABLE "DatingProfile" ADD COLUMN "auraPrompt" TEXT NOT NULL DEFAULT '';
ALTER TABLE "DatingProfile" ADD COLUMN "auraStatus" TEXT NOT NULL DEFAULT 'none';
