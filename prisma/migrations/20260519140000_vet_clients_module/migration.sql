CREATE TABLE "VetClientMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "vetClinicId" TEXT NOT NULL,
    "ownerId" TEXT,
    "channel" TEXT NOT NULL DEFAULT 'sms',
    "subject" TEXT,
    "body" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'sent',
    "sentAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "VetClientMessage_vetClinicId_fkey" FOREIGN KEY ("vetClinicId") REFERENCES "VetClinic" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "VetClientMessage_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "PetOwner" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "VetClientMessageSchedule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "vetClinicId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "channel" TEXT NOT NULL DEFAULT 'sms',
    "body" TEXT NOT NULL,
    "scheduleKind" TEXT NOT NULL DEFAULT 'cyclic',
    "intervalDays" INTEGER,
    "runAt" DATETIME,
    "active" BOOLEAN NOT NULL DEFAULT 1,
    "lastRunAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "VetClientMessageSchedule_vetClinicId_fkey" FOREIGN KEY ("vetClinicId") REFERENCES "VetClinic" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "VetClientSettlement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "vetClinicId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "amountPln" REAL NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "dueAt" DATETIME,
    "paidAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "VetClientSettlement_vetClinicId_fkey" FOREIGN KEY ("vetClinicId") REFERENCES "VetClinic" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "VetClientSettlement_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "PetOwner" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "VetClientMessage_vetClinicId_idx" ON "VetClientMessage"("vetClinicId");
CREATE INDEX "VetClientMessage_ownerId_idx" ON "VetClientMessage"("ownerId");
CREATE INDEX "VetClientMessage_sentAt_idx" ON "VetClientMessage"("sentAt");
CREATE INDEX "VetClientMessageSchedule_vetClinicId_idx" ON "VetClientMessageSchedule"("vetClinicId");
CREATE INDEX "VetClientMessageSchedule_active_idx" ON "VetClientMessageSchedule"("active");
CREATE INDEX "VetClientMessageSchedule_runAt_idx" ON "VetClientMessageSchedule"("runAt");
CREATE INDEX "VetClientSettlement_vetClinicId_idx" ON "VetClientSettlement"("vetClinicId");
CREATE INDEX "VetClientSettlement_ownerId_idx" ON "VetClientSettlement"("ownerId");
CREATE INDEX "VetClientSettlement_status_idx" ON "VetClientSettlement"("status");
