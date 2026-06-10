export type WorkingHoursDay = { open: string; close: string } | { open: ""; close: "" };

export type VetClinicRecord = {
  id: string;
  slug: string;
  name: string;
  city: string;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  description: string;
  logoUrl?: string | null;
  isPublished: boolean;
  workingHours?: WorkingHoursDay[];
  noOrderDays?: string[];
  bookingPhoneOnly?: boolean;
  slotDurationMinutes?: number;
};

export type VetDoctorRecord = {
  id: string;
  vetClinicId: string;
  name: string;
  phone?: string | null;
  order: number;
  active: boolean;
};
