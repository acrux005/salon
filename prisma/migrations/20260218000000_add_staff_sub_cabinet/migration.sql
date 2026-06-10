-- CreateTable
CREATE TABLE "StaffSubCabinet" (
    "staffId" TEXT NOT NULL,
    "subCabinetId" TEXT NOT NULL,
    CONSTRAINT "StaffSubCabinet_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "StaffSubCabinet_subCabinetId_fkey" FOREIGN KEY ("subCabinetId") REFERENCES "SubCabinet" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    PRIMARY KEY ("staffId", "subCabinetId")
);

-- CreateIndex
CREATE INDEX "StaffSubCabinet_staffId_idx" ON "StaffSubCabinet"("staffId");

-- CreateIndex
CREATE INDEX "StaffSubCabinet_subCabinetId_idx" ON "StaffSubCabinet"("subCabinetId");

-- Migrate existing Staff.subCabinetId into StaffSubCabinet
INSERT INTO "StaffSubCabinet" ("staffId", "subCabinetId")
SELECT "id", "subCabinetId" FROM "Staff" WHERE "subCabinetId" IS NOT NULL;
