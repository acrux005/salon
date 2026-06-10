-- GabinetHarmonogram — wielobranżowa platforma gabinetów (dent, physio, …)

CREATE TABLE "GabClinic" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "vertical" TEXT NOT NULL DEFAULT 'dent',
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT,
    "nip" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "description" TEXT NOT NULL DEFAULT '',
    "logoUrl" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "workingHours" TEXT,
    "noOrderDays" TEXT,
    "bookingPhoneOnly" BOOLEAN NOT NULL DEFAULT false,
    "slotDurationMinutes" INTEGER NOT NULL DEFAULT 30,
    "onboardingStep" INTEGER NOT NULL DEFAULT 0,
    "onboardingDoneAt" DATETIME,
    "settingsJson" TEXT,
    "updatedAt" DATETIME NOT NULL
);

CREATE UNIQUE INDEX "GabClinic_slug_key" ON "GabClinic"("slug");
CREATE INDEX "GabClinic_city_idx" ON "GabClinic"("city");
CREATE INDEX "GabClinic_isPublished_idx" ON "GabClinic"("isPublished");
CREATE INDEX "GabClinic_vertical_idx" ON "GabClinic"("vertical");

CREATE TABLE "GabClinicAccount" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "emailVerifiedAt" DATETIME,
    "verificationToken" TEXT,
    "verificationTokenExpires" DATETIME,
    "gabClinicId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "GabClinicAccount_gabClinicId_fkey" FOREIGN KEY ("gabClinicId") REFERENCES "GabClinic" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "GabClinicAccount_email_key" ON "GabClinicAccount"("email");
CREATE UNIQUE INDEX "GabClinicAccount_gabClinicId_key" ON "GabClinicAccount"("gabClinicId");

CREATE TABLE "GabStaff" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "gabClinicId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "role" TEXT NOT NULL DEFAULT 'doctor',
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "GabStaff_gabClinicId_fkey" FOREIGN KEY ("gabClinicId") REFERENCES "GabClinic" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "GabStaff_gabClinicId_idx" ON "GabStaff"("gabClinicId");

CREATE TABLE "GabPatientAccount" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "emailVerifiedAt" DATETIME,
    "verificationToken" TEXT,
    "verificationTokenExpires" DATETIME,
    "activeGabClinicId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "GabPatientAccount_activeGabClinicId_fkey" FOREIGN KEY ("activeGabClinicId") REFERENCES "GabClinic" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "GabPatientAccount_email_key" ON "GabPatientAccount"("email");
CREATE INDEX "GabPatientAccount_activeGabClinicId_idx" ON "GabPatientAccount"("activeGabClinicId");

CREATE TABLE "GabClient" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "gabClinicId" TEXT NOT NULL,
    "accountId" TEXT,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "smsConsent" BOOLEAN NOT NULL DEFAULT true,
    "emailConsent" BOOLEAN NOT NULL DEFAULT true,
    "pushConsent" BOOLEAN NOT NULL DEFAULT false,
    "marketingConsent" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "GabClient_gabClinicId_fkey" FOREIGN KEY ("gabClinicId") REFERENCES "GabClinic" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "GabClient_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "GabPatientAccount" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "GabClient_accountId_gabClinicId_key" ON "GabClient"("accountId", "gabClinicId");
CREATE INDEX "GabClient_gabClinicId_idx" ON "GabClient"("gabClinicId");
CREATE INDEX "GabClient_phone_idx" ON "GabClient"("phone");

CREATE TABLE "GabPatient" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "gabClinicId" TEXT NOT NULL,
    "clientId" TEXT,
    "accountId" TEXT,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "pesel" TEXT,
    "birthDate" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "smsConsent" BOOLEAN NOT NULL DEFAULT true,
    "emailConsent" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "GabPatient_gabClinicId_fkey" FOREIGN KEY ("gabClinicId") REFERENCES "GabClinic" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "GabPatient_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "GabClient" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "GabPatient_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "GabPatientAccount" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX "GabPatient_gabClinicId_idx" ON "GabPatient"("gabClinicId");
CREATE INDEX "GabPatient_clientId_idx" ON "GabPatient"("clientId");
CREATE INDEX "GabPatient_status_idx" ON "GabPatient"("status");

CREATE TABLE "GabAppointment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "gabClinicId" TEXT NOT NULL,
    "gabStaffId" TEXT,
    "patientId" TEXT,
    "clientId" TEXT,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "patientName" TEXT,
    "patientPhone" TEXT,
    "visitType" TEXT,
    "status" TEXT NOT NULL DEFAULT 'planned',
    "notes" TEXT,
    "reminderSentAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GabAppointment_gabClinicId_fkey" FOREIGN KEY ("gabClinicId") REFERENCES "GabClinic" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "GabAppointment_gabStaffId_fkey" FOREIGN KEY ("gabStaffId") REFERENCES "GabStaff" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "GabAppointment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "GabPatient" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "GabAppointment_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "GabClient" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX "GabAppointment_gabClinicId_idx" ON "GabAppointment"("gabClinicId");
CREATE INDEX "GabAppointment_date_idx" ON "GabAppointment"("date");
CREATE INDEX "GabAppointment_patientId_idx" ON "GabAppointment"("patientId");

CREATE TABLE "GabPatientDocument" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patientId" TEXT,
    "accountId" TEXT,
    "gabClinicId" TEXT,
    "documentType" TEXT NOT NULL DEFAULT 'other',
    "fileName" TEXT,
    "extractedJson" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GabPatientDocument_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "GabPatient" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "GabPatientDocument_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "GabPatientAccount" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX "GabPatientDocument_patientId_idx" ON "GabPatientDocument"("patientId");
CREATE INDEX "GabPatientDocument_gabClinicId_idx" ON "GabPatientDocument"("gabClinicId");

CREATE TABLE "GabTreatmentCatalogItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "gabClinicId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'general',
    "pricePln" REAL NOT NULL DEFAULT 0,
    "durationMinutes" INTEGER NOT NULL DEFAULT 30,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "GabTreatmentCatalogItem_gabClinicId_fkey" FOREIGN KEY ("gabClinicId") REFERENCES "GabClinic" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "GabTreatmentCatalogItem_gabClinicId_idx" ON "GabTreatmentCatalogItem"("gabClinicId");

CREATE TABLE "GabTreatmentPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "gabClinicId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "totalPln" REAL NOT NULL DEFAULT 0,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "GabTreatmentPlan_gabClinicId_fkey" FOREIGN KEY ("gabClinicId") REFERENCES "GabClinic" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "GabTreatmentPlan_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "GabPatient" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "GabTreatmentPlan_gabClinicId_idx" ON "GabTreatmentPlan"("gabClinicId");
CREATE INDEX "GabTreatmentPlan_patientId_idx" ON "GabTreatmentPlan"("patientId");

CREATE TABLE "GabTreatmentPlanItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "planId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "toothFdi" TEXT,
    "pricePln" REAL NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'planned',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GabTreatmentPlanItem_planId_fkey" FOREIGN KEY ("planId") REFERENCES "GabTreatmentPlan" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "GabTreatmentPlanItem_planId_idx" ON "GabTreatmentPlanItem"("planId");

CREATE TABLE "GabRecallRule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "gabClinicId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "visitType" TEXT NOT NULL,
    "intervalDays" INTEGER NOT NULL,
    "channel" TEXT NOT NULL DEFAULT 'sms',
    "messageTemplate" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "GabRecallRule_gabClinicId_fkey" FOREIGN KEY ("gabClinicId") REFERENCES "GabClinic" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "GabRecallRule_gabClinicId_idx" ON "GabRecallRule"("gabClinicId");

CREATE TABLE "GabScheduledReminder" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "gabClinicId" TEXT NOT NULL,
    "patientId" TEXT,
    "clientId" TEXT,
    "kind" TEXT NOT NULL DEFAULT 'recall',
    "channel" TEXT NOT NULL DEFAULT 'sms',
    "message" TEXT NOT NULL,
    "sendAt" DATETIME NOT NULL,
    "sentAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GabScheduledReminder_gabClinicId_fkey" FOREIGN KEY ("gabClinicId") REFERENCES "GabClinic" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "GabScheduledReminder_gabClinicId_idx" ON "GabScheduledReminder"("gabClinicId");
CREATE INDEX "GabScheduledReminder_sendAt_idx" ON "GabScheduledReminder"("sendAt");

CREATE TABLE "GabClientMessage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "gabClinicId" TEXT NOT NULL,
    "clientId" TEXT,
    "channel" TEXT NOT NULL DEFAULT 'sms',
    "subject" TEXT,
    "body" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'sent',
    "sentAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GabClientMessage_gabClinicId_fkey" FOREIGN KEY ("gabClinicId") REFERENCES "GabClinic" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "GabClientMessage_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "GabClient" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE INDEX "GabClientMessage_gabClinicId_idx" ON "GabClientMessage"("gabClinicId");

CREATE TABLE "GabClientMessageSchedule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "gabClinicId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "channel" TEXT NOT NULL DEFAULT 'sms',
    "body" TEXT NOT NULL,
    "scheduleKind" TEXT NOT NULL DEFAULT 'cyclic',
    "intervalDays" INTEGER,
    "runAt" DATETIME,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "lastRunAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "GabClientMessageSchedule_gabClinicId_fkey" FOREIGN KEY ("gabClinicId") REFERENCES "GabClinic" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "GabClientMessageSchedule_gabClinicId_idx" ON "GabClientMessageSchedule"("gabClinicId");

CREATE TABLE "GabClientSettlement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "gabClinicId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "amountPln" REAL NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "dueAt" DATETIME,
    "paidAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "GabClientSettlement_gabClinicId_fkey" FOREIGN KEY ("gabClinicId") REFERENCES "GabClinic" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "GabClientSettlement_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "GabClient" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "GabClientSettlement_gabClinicId_idx" ON "GabClientSettlement"("gabClinicId");

CREATE TABLE "GabClientConsentLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "gabClinicId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "consentType" TEXT NOT NULL,
    "granted" BOOLEAN NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'panel',
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GabClientConsentLog_gabClinicId_fkey" FOREIGN KEY ("gabClinicId") REFERENCES "GabClinic" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "GabClientConsentLog_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "GabClient" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "GabClientConsentLog_gabClinicId_idx" ON "GabClientConsentLog"("gabClinicId");
