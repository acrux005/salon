import { getPrisma } from "@/lib/db";

/** Prisma client z modelami Gab* (parent: schema + migrate). */
export function gabPrisma() {
  return getPrisma() as ReturnType<typeof getPrisma> & GabPrismaModels;
}

/** Oczekiwane modele Prisma — muszą być zgodne z migracją parent agenta. */
export type GabPrismaModels = {
  gabClinic: {
    findUnique: (args: { where: { id?: string; slug?: string }; select?: Record<string, boolean> }) => Promise<GabClinicRow | null>;
    findFirst: (args: { where: Record<string, unknown> }) => Promise<GabClinicRow | null>;
    create: (args: { data: Record<string, unknown> }) => Promise<GabClinicRow>;
    update: (args: { where: { id: string }; data: Record<string, unknown> }) => Promise<GabClinicRow>;
  };
  gabClinicAccount: {
    findUnique: (args: { where: { email: string } }) => Promise<{ id: string } | null>;
    create: (args: { data: Record<string, unknown> }) => Promise<unknown>;
  };
  gabPatient: {
    findMany: (args: Record<string, unknown>) => Promise<GabPatientRow[]>;
    count?: (args: { where: Record<string, unknown> }) => Promise<number>;
    findFirst: (args: { where: Record<string, unknown> }) => Promise<GabPatientRow | null>;
    create: (args: { data: Record<string, unknown> }) => Promise<GabPatientRow>;
    update: (args: { where: { id: string }; data: Record<string, unknown> }) => Promise<GabPatientRow>;
  };
  gabClient: {
    findMany: (args: Record<string, unknown>) => Promise<GabClientRow[]>;
    findFirst: (args: { where: Record<string, unknown> }) => Promise<GabClientRow | null>;
    create: (args: { data: Record<string, unknown> }) => Promise<GabClientRow>;
  };
  gabPatientAccount: {
    findUnique: (args: { where: { email: string } }) => Promise<{ id: string } | null>;
    create: (args: { data: Record<string, unknown> }) => Promise<unknown>;
  };
  gabAppointment: {
    count: (args: { where: Record<string, unknown> }) => Promise<number>;
    create: (args: { data: Record<string, unknown> }) => Promise<unknown>;
  };
  gabClientMessage: {
    create: (args: { data: Record<string, unknown> }) => Promise<unknown>;
  };
  gabClientSettlement: {
    create: (args: { data: Record<string, unknown> }) => Promise<unknown>;
    findMany: (args: Record<string, unknown>) => Promise<unknown[]>;
    updateMany: (args: { where: Record<string, unknown>; data: Record<string, unknown> }) => Promise<unknown>;
  };
};

export type GabClinicRow = {
  id: string;
  slug: string;
  name: string;
  city?: string;
  description?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  isPublished?: boolean;
  workingHours?: string | null;
};

export type GabPatientRow = {
  id: string;
  gabClinicId: string;
  name: string;
  phone: string;
  email?: string | null;
  pesel?: string | null;
  notes?: string | null;
  smsConsent?: boolean;
  emailConsent?: boolean;
  status?: string;
};

export type GabClientRow = {
  id: string;
  gabClinicId: string;
  name: string;
  phone: string;
  email?: string | null;
  notes?: string | null;
  smsConsent?: boolean;
};
