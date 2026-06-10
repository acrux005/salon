import bcrypt from "bcrypt";
import type { User } from "next-auth";
import { getPrisma } from "@/lib/db";
import {
  RESTAURANT_ROLE,
  ADMIN_ROLE,
  CLINIC_ROLE,
  CLIENT_ROLE,
  VET_CLINIC_ROLE,
  VET_OWNER_ROLE,
  GAB_CLINIC_ROLE,
  GAB_PATIENT_ROLE,
  RANDKI_ROLE,
} from "@/lib/auth";

export type LoginIntent =
  | "vet"
  | "vet_owner"
  | "gab_clinic"
  | "gab_patient"
  | "randki"
  | "clinic"
  | "client"
  | "restaurant"
  | undefined;

function parseAdminEmails(): Set<string> {
  const csv = process.env.ADMIN_EMAILS ?? "";
  return new Set(csv.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean));
}

/** Logowanie e-mail/hasło — przy tym samym mailu w wielu rolach sprawdza wszystkie dopasowania. */
export async function authorizeCredentials(
  email: string,
  password: string,
  loginAs?: LoginIntent
): Promise<User | null> {
  const prisma = getPrisma();
  const adminEmails = parseAdminEmails();

  if (loginAs === "vet") {
    return authorizeVet(prisma, email, password);
  }
  if (loginAs === "vet_owner") {
    return authorizeVetOwner(prisma, email, password);
  }
  if (loginAs === "gab_clinic") {
    return authorizeGabClinic(prisma, email, password);
  }
  if (loginAs === "gab_patient") {
    return authorizeGabPatient(prisma, email, password);
  }
  if (loginAs === "randki") {
    return authorizeDating(prisma, email, password);
  }
  if (loginAs === "clinic") {
    return authorizeClinic(prisma, email, password, adminEmails);
  }
  if (loginAs === "client") {
    return authorizeClient(prisma, email, password);
  }
  if (loginAs === "restaurant") {
    return authorizeRestaurant(prisma, email, password, adminEmails);
  }

  const adminUser = await authorizeAdmin(prisma, email, password);
  if (adminUser) return adminUser;

  const restaurantUser = await authorizeRestaurant(prisma, email, password, adminEmails);
  if (restaurantUser) return restaurantUser;

  const clinicUser = await authorizeClinic(prisma, email, password, adminEmails);
  if (clinicUser) return clinicUser;

  const clientUser = await authorizeClient(prisma, email, password);
  if (clientUser) return clientUser;

  return authorizeVet(prisma, email, password);
}

async function authorizeAdmin(
  prisma: ReturnType<typeof getPrisma>,
  email: string,
  password: string
): Promise<User | null> {
  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) return null;
  if (!(await bcrypt.compare(password, admin.passwordHash))) return null;
  return {
    id: admin.id,
    email: admin.email,
    name: "Admin",
    role: ADMIN_ROLE,
    restaurantId: "",
    restaurantSlug: "",
    clinicId: "",
    clinicSlug: "",
  } as User;
}

async function authorizeRestaurant(
  prisma: ReturnType<typeof getPrisma>,
  email: string,
  password: string,
  adminEmails: Set<string>
): Promise<User | null> {
  try {
    const account = await prisma.restaurantAccount.findUnique({
      where: { email },
      include: { restaurant: true },
    });
    if (!account?.restaurant) return null;
    if (!(await bcrypt.compare(password, account.passwordHash))) return null;
    if (!account.emailVerifiedAt) return null;
    const role = adminEmails.has(email) ? ADMIN_ROLE : RESTAURANT_ROLE;
    return {
      id: account.id,
      email: account.email,
      name: account.restaurant.name,
      role,
      restaurantId: account.restaurantId,
      restaurantSlug: account.restaurant.slug,
      clinicId: "",
      clinicSlug: "",
    } as User;
  } catch {
    return null;
  }
}

async function authorizeClinic(
  prisma: ReturnType<typeof getPrisma>,
  email: string,
  password: string,
  adminEmails: Set<string>
): Promise<User | null> {
  try {
    const clinicAccount = await prisma.clinicAccount.findUnique({
      where: { email },
      include: { clinic: true },
    });
    if (!clinicAccount?.clinic) return null;
    if (!(await bcrypt.compare(password, clinicAccount.passwordHash))) return null;
    if (!clinicAccount.emailVerifiedAt) return null;
    const role = adminEmails.has(email) ? ADMIN_ROLE : CLINIC_ROLE;
    return {
      id: clinicAccount.id,
      email: clinicAccount.email,
      name: clinicAccount.clinic.name,
      role,
      restaurantId: "",
      restaurantSlug: "",
      clinicId: clinicAccount.clinicId,
      clinicSlug: clinicAccount.clinic.slug,
    } as User;
  } catch {
    return null;
  }
}

async function authorizeClient(
  prisma: ReturnType<typeof getPrisma>,
  email: string,
  password: string
): Promise<User | null> {
  try {
    const client = await prisma.client.findUnique({ where: { email } });
    if (!client) return null;
    if (!(await bcrypt.compare(password, client.passwordHash))) return null;
    return {
      id: client.id,
      email: client.email,
      name: client.name ?? client.email,
      role: CLIENT_ROLE,
      restaurantId: "",
      restaurantSlug: "",
      clinicId: "",
      clinicSlug: "",
      clientId: client.id,
    } as User;
  } catch {
    return null;
  }
}

async function authorizeVet(
  prisma: ReturnType<typeof getPrisma>,
  email: string,
  password: string
): Promise<User | null> {
  try {
    const vetAccount = await prisma.vetClinicAccount.findUnique({
      where: { email },
      include: { vetClinic: true },
    });
    if (!vetAccount?.vetClinic) return null;
    if (!(await bcrypt.compare(password, vetAccount.passwordHash))) return null;
    if (!vetAccount.emailVerifiedAt) return null;
    return {
      id: vetAccount.id,
      email: vetAccount.email,
      name: vetAccount.vetClinic.name,
      role: VET_CLINIC_ROLE,
      restaurantId: "",
      restaurantSlug: "",
      clinicId: "",
      clinicSlug: "",
      vetClinicId: vetAccount.vetClinicId,
      vetClinicSlug: vetAccount.vetClinic.slug,
    } as User;
  } catch {
    return null;
  }
}

async function authorizeVetOwner(
  prisma: ReturnType<typeof getPrisma>,
  email: string,
  password: string
): Promise<User | null> {
  try {
    const account = await prisma.vetOwnerAccount.findUnique({ where: { email } });
    if (!account) return null;
    if (!(await bcrypt.compare(password, account.passwordHash))) return null;
    let clinicSlug = "";
    if (account.activeVetClinicId) {
      const clinic = await prisma.vetClinic.findUnique({
        where: { id: account.activeVetClinicId },
        select: { slug: true },
      });
      clinicSlug = clinic?.slug ?? "";
    }
    return {
      id: account.id,
      email: account.email,
      name: account.name,
      role: VET_OWNER_ROLE,
      restaurantId: "",
      restaurantSlug: "",
      clinicId: "",
      clinicSlug: "",
      vetOwnerAccountId: account.id,
      activeVetClinicId: account.activeVetClinicId ?? "",
      vetClinicSlug: clinicSlug,
    } as User;
  } catch {
    return null;
  }
}

async function authorizeGabClinic(
  prisma: ReturnType<typeof getPrisma>,
  email: string,
  password: string
): Promise<User | null> {
  try {
    const account = await prisma.gabClinicAccount.findUnique({
      where: { email },
      include: { gabClinic: true },
    });
    if (account?.gabClinic) {
      if (!(await bcrypt.compare(password, account.passwordHash))) return null;
      if (!account.emailVerifiedAt && process.env.GAB_AUTO_VERIFY !== "true") return null;
      return {
        id: account.id,
        email: account.email,
        name: account.gabClinic.name,
        role: GAB_CLINIC_ROLE,
        restaurantId: "",
        restaurantSlug: "",
        clinicId: "",
        clinicSlug: "",
        gabClinicId: account.gabClinicId,
        gabClinicSlug: account.gabClinic.slug,
      } as User;
    }

    const member = await prisma.gabClinicMember.findFirst({
      where: { email, active: true },
      include: { gabClinic: true },
    });
    if (!member?.gabClinic) return null;
    if (!(await bcrypt.compare(password, member.passwordHash))) return null;
    return {
      id: member.id,
      email: member.email,
      name: member.name,
      role: GAB_CLINIC_ROLE,
      restaurantId: "",
      restaurantSlug: "",
      clinicId: "",
      clinicSlug: "",
      gabClinicId: member.gabClinicId,
      gabClinicSlug: member.gabClinic.slug,
      gabMemberId: member.id,
      gabMemberRole: member.role,
    } as User;
  } catch {
    return null;
  }
}

async function authorizeGabPatient(
  prisma: ReturnType<typeof getPrisma>,
  email: string,
  password: string
): Promise<User | null> {
  try {
    const account = await prisma.gabPatientAccount.findUnique({ where: { email } });
    if (!account) return null;
    if (!(await bcrypt.compare(password, account.passwordHash))) return null;
    if (!account.emailVerifiedAt && process.env.GAB_AUTO_VERIFY !== "true") return null;
    let clinicSlug = "";
    if (account.activeGabClinicId) {
      const clinic = await prisma.gabClinic.findUnique({
        where: { id: account.activeGabClinicId },
        select: { slug: true },
      });
      clinicSlug = clinic?.slug ?? "";
    }
    return {
      id: account.id,
      email: account.email,
      name: account.name,
      role: GAB_PATIENT_ROLE,
      restaurantId: "",
      restaurantSlug: "",
      clinicId: "",
      clinicSlug: "",
      gabPatientAccountId: account.id,
      activeGabClinicId: account.activeGabClinicId ?? "",
      gabClinicSlug: clinicSlug,
    } as User;
  } catch {
    return null;
  }
}

async function authorizeDating(
  prisma: ReturnType<typeof getPrisma>,
  email: string,
  password: string
): Promise<User | null> {
  try {
    const account = await prisma.datingAccount.findUnique({ where: { email } });
    if (!account) return null;
    if (account.bannedAt) return null;
    if (!(await bcrypt.compare(password, account.passwordHash))) return null;
    if (!account.emailVerifiedAt && process.env.RANDKI_AUTO_VERIFY !== "true") return null;
    const profile = await prisma.datingProfile.findUnique({
      where: { accountId: account.id },
      select: { displayName: true },
    });
    return {
      id: account.id,
      email: account.email,
      name: profile?.displayName ?? account.email,
      role: RANDKI_ROLE,
      restaurantId: "",
      restaurantSlug: "",
      clinicId: "",
      clinicSlug: "",
      datingAccountId: account.id,
    } as User;
  } catch {
    return null;
  }
}
