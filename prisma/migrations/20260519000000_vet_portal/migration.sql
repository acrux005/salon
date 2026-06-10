-- CreateTable
CREATE TABLE "VetClinic" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "description" TEXT NOT NULL DEFAULT '',
    "logoUrl" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "workingHours" TEXT,
    "noOrderDays" TEXT,
    "bookingPhoneOnly" BOOLEAN NOT NULL DEFAULT false,
    "slotDurationMinutes" INTEGER NOT NULL DEFAULT 30,
    "updatedAt" DATETIME NOT NULL
);

CREATE TABLE "VetClinicAccount" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "emailVerifiedAt" DATETIME,
    "verificationToken" TEXT,
    "verificationTokenExpires" DATETIME,
    "vetClinicId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "VetClinicAccount_vetClinicId_fkey" FOREIGN KEY ("vetClinicId") REFERENCES "VetClinic" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "VetDoctor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "vetClinicId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "VetDoctor_vetClinicId_fkey" FOREIGN KEY ("vetClinicId") REFERENCES "VetClinic" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "PetOwner" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "vetClinicId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "smsConsent" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PetOwner_vetClinicId_fkey" FOREIGN KEY ("vetClinicId") REFERENCES "VetClinic" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Pet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ownerId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "species" TEXT NOT NULL DEFAULT 'pies',
    "breed" TEXT,
    "birthDate" TEXT,
    "chipNumber" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Pet_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "PetOwner" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "VetAppointment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "vetClinicId" TEXT NOT NULL,
    "vetDoctorId" TEXT,
    "petId" TEXT,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "ownerName" TEXT,
    "ownerPhone" TEXT,
    "petName" TEXT,
    "visitType" TEXT,
    "status" TEXT NOT NULL DEFAULT 'planned',
    "notes" TEXT,
    "confirmToken" TEXT,
    "confirmedAt" DATETIME,
    "reminderSentAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "VetAppointment_vetClinicId_fkey" FOREIGN KEY ("vetClinicId") REFERENCES "VetClinic" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "VetAppointment_vetDoctorId_fkey" FOREIGN KEY ("vetDoctorId") REFERENCES "VetDoctor" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "VetAppointment_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "VaccineType" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "vetClinicId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "defaultIntervalDays" INTEGER NOT NULL DEFAULT 365,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "VaccineType_vetClinicId_fkey" FOREIGN KEY ("vetClinicId") REFERENCES "VetClinic" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Vaccination" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "petId" TEXT NOT NULL,
    "vaccineTypeId" TEXT NOT NULL,
    "administeredAt" DATETIME NOT NULL,
    "nextDueAt" DATETIME NOT NULL,
    "batchNumber" TEXT,
    "vetName" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Vaccination_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Vaccination_vaccineTypeId_fkey" FOREIGN KEY ("vaccineTypeId") REFERENCES "VaccineType" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "VetScheduledReminder" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "vetClinicId" TEXT NOT NULL,
    "ownerId" TEXT,
    "petId" TEXT,
    "kind" TEXT NOT NULL,
    "channel" TEXT NOT NULL DEFAULT 'sms',
    "sendAt" DATETIME NOT NULL,
    "sentAt" DATETIME,
    "message" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "VetScheduledReminder_vetClinicId_fkey" FOREIGN KEY ("vetClinicId") REFERENCES "VetClinic" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "VetScheduledReminder_petId_fkey" FOREIGN KEY ("petId") REFERENCES "Pet" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "VetClinic_slug_key" ON "VetClinic"("slug");
CREATE UNIQUE INDEX "VetClinicAccount_email_key" ON "VetClinicAccount"("email");
CREATE UNIQUE INDEX "VetClinicAccount_vetClinicId_key" ON "VetClinicAccount"("vetClinicId");
CREATE UNIQUE INDEX "VetAppointment_confirmToken_key" ON "VetAppointment"("confirmToken");
CREATE INDEX "VetClinic_city_idx" ON "VetClinic"("city");
CREATE INDEX "VetClinic_isPublished_idx" ON "VetClinic"("isPublished");
CREATE INDEX "VetDoctor_vetClinicId_idx" ON "VetDoctor"("vetClinicId");
CREATE INDEX "PetOwner_vetClinicId_idx" ON "PetOwner"("vetClinicId");
CREATE INDEX "PetOwner_phone_idx" ON "PetOwner"("phone");
CREATE INDEX "Pet_ownerId_idx" ON "Pet"("ownerId");
CREATE INDEX "VetAppointment_vetClinicId_idx" ON "VetAppointment"("vetClinicId");
CREATE INDEX "VetAppointment_vetDoctorId_idx" ON "VetAppointment"("vetDoctorId");
CREATE INDEX "VetAppointment_petId_idx" ON "VetAppointment"("petId");
CREATE INDEX "VetAppointment_date_idx" ON "VetAppointment"("date");
CREATE INDEX "VetAppointment_status_idx" ON "VetAppointment"("status");
CREATE INDEX "VaccineType_vetClinicId_idx" ON "VaccineType"("vetClinicId");
CREATE INDEX "Vaccination_petId_idx" ON "Vaccination"("petId");
CREATE INDEX "Vaccination_nextDueAt_idx" ON "Vaccination"("nextDueAt");
CREATE INDEX "Vaccination_vaccineTypeId_idx" ON "Vaccination"("vaccineTypeId");
CREATE INDEX "VetScheduledReminder_vetClinicId_idx" ON "VetScheduledReminder"("vetClinicId");
CREATE INDEX "VetScheduledReminder_sendAt_idx" ON "VetScheduledReminder"("sendAt");
CREATE INDEX "VetScheduledReminder_sentAt_idx" ON "VetScheduledReminder"("sentAt");
