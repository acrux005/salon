export type OwnerClinicBookingTarget = {
  slug: string;
  phone?: string | null;
  bookingPhoneOnly?: boolean;
};

/** Link do rezerwacji wizyty (online lub tel.) z portalu właściciela. */
export function buildOwnerClinicBookingUrl(clinic: OwnerClinicBookingTarget): string {
  if (clinic.bookingPhoneOnly && clinic.phone?.trim()) {
    return `tel:${clinic.phone.replace(/\s/g, "")}`;
  }
  return `/wet/przychodnia/${encodeURIComponent(clinic.slug)}?book=1`;
}

export function isPhoneBookingUrl(url: string): boolean {
  return url.startsWith("tel:");
}
