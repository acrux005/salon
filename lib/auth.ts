import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id?: string;
      role?: string;
      restaurantId?: string;
      restaurantSlug?: string;
      clinicId?: string;
      clinicSlug?: string;
      clientId?: string;
      driverId?: string;
      staffId?: string;
      vetClinicId?: string;
      vetClinicSlug?: string;
      vetOwnerAccountId?: string;
      activeVetClinicId?: string;
      gabClinicId?: string;
      gabClinicSlug?: string;
      gabPatientAccountId?: string;
      activeGabClinicId?: string;
      datingAccountId?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    restaurantId?: string;
    restaurantSlug?: string;
    clinicId?: string;
    clinicSlug?: string;
    clientId?: string;
    driverId?: string;
    staffId?: string;
    vetClinicId?: string;
    vetClinicSlug?: string;
    vetOwnerAccountId?: string;
    activeVetClinicId?: string;
    gabClinicId?: string;
    gabClinicSlug?: string;
    gabPatientAccountId?: string;
    activeGabClinicId?: string;
    datingAccountId?: string;
  }
}

export const RESTAURANT_ROLE = "restaurant";
export const RESTAURANT_STAFF_ROLE = "restaurant_staff";
export const DRIVER_ROLE = "driver";
export const ADMIN_ROLE = "admin";
/** @deprecated Legacy – kept for old portal routes that are not used by zamow.odart.pl */
export const CLIENT_ROLE = "client";
/** @deprecated Legacy – kept for old portal routes that are not used by zamow.odart.pl */
export const CLINIC_ROLE = "clinic";
export const VET_CLINIC_ROLE = "vet";
export const VET_OWNER_ROLE = "vet_owner";
export { GAB_CLINIC_ROLE, GAB_PATIENT_ROLE } from "@/lib/gabinetPlatform/auth";
export const RANDKI_ROLE = "randki";
