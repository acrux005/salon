import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/authOptions";
import {
  ADMIN_ROLE,
  CLINIC_ROLE,
  GAB_CLINIC_ROLE,
  VET_CLINIC_ROLE,
} from "@/lib/auth";

const unauth = () => NextResponse.json({ error: "Unauthorized" }, { status: 401 });

type PortalClinic = {
  admin: boolean;
  clinicId: string;
  clinicSlug: string;
};

type GabClinic = {
  admin: boolean;
  gabClinicId: string;
  gabClinicSlug: string;
};

type VetClinic = {
  admin: boolean;
  vetClinicId: string;
  vetClinicSlug: string;
};

export async function requirePortalClinicSession(): Promise<
  { ok: true; session: PortalClinic } | { ok: false; response: NextResponse }
> {
  const session = await getServerSession(authOptions);
  const user = session?.user as
    | { role?: string; clinicId?: string; clinicSlug?: string }
    | undefined;
  const role = user?.role ?? "";
  if (role === ADMIN_ROLE) {
    return {
      ok: true,
      session: {
        admin: true,
        clinicId: String(user?.clinicId ?? ""),
        clinicSlug: String(user?.clinicSlug ?? ""),
      },
    };
  }
  if (role === CLINIC_ROLE) {
    const clinicId = String(user?.clinicId ?? "");
    if (!clinicId) return { ok: false, response: unauth() };
    return {
      ok: true,
      session: {
        admin: false,
        clinicId,
        clinicSlug: String(user?.clinicSlug ?? ""),
      },
    };
  }
  return { ok: false, response: unauth() };
}

export async function requireGabClinicSession(): Promise<
  { ok: true; session: GabClinic } | { ok: false; response: NextResponse }
> {
  const session = await getServerSession(authOptions);
  const user = session?.user as
    | { role?: string; gabClinicId?: string; gabClinicSlug?: string }
    | undefined;
  const role = user?.role ?? "";
  if (role === ADMIN_ROLE) {
    return {
      ok: true,
      session: {
        admin: true,
        gabClinicId: String(user?.gabClinicId ?? ""),
        gabClinicSlug: String(user?.gabClinicSlug ?? ""),
      },
    };
  }
  if (role === GAB_CLINIC_ROLE) {
    const gabClinicId = String(user?.gabClinicId ?? "");
    if (!gabClinicId) return { ok: false, response: unauth() };
    return {
      ok: true,
      session: {
        admin: false,
        gabClinicId,
        gabClinicSlug: String(user?.gabClinicSlug ?? ""),
      },
    };
  }
  return { ok: false, response: unauth() };
}

export async function requireVetClinicSession(): Promise<
  { ok: true; session: VetClinic } | { ok: false; response: NextResponse }
> {
  const session = await getServerSession(authOptions);
  const user = session?.user as
    | { role?: string; vetClinicId?: string; vetClinicSlug?: string }
    | undefined;
  const role = user?.role ?? "";
  if (role === ADMIN_ROLE) {
    return {
      ok: true,
      session: {
        admin: true,
        vetClinicId: String(user?.vetClinicId ?? ""),
        vetClinicSlug: String(user?.vetClinicSlug ?? ""),
      },
    };
  }
  if (role === VET_CLINIC_ROLE) {
    const vetClinicId = String(user?.vetClinicId ?? "");
    if (!vetClinicId) return { ok: false, response: unauth() };
    return {
      ok: true,
      session: {
        admin: false,
        vetClinicId,
        vetClinicSlug: String(user?.vetClinicSlug ?? ""),
      },
    };
  }
  return { ok: false, response: unauth() };
}
