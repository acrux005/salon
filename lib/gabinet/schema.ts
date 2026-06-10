export type WorkingHoursDay = { open: string; close: string } | { open: ""; close: "" };

export type GabClinicRecord = {
  id: string;
  slug: string;
  vertical: string;
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

export type GabStaffRecord = {
  id: string;
  gabClinicId: string;
  name: string;
  phone?: string | null;
  role: string;
  order: number;
  active: boolean;
};
