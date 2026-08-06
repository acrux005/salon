import bcrypt from "bcrypt";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const slugRegex = /^[a-z0-9-]{3,}$/;

function authorized(req: NextRequest): boolean {
  const key = process.env.ODART_SALON_PROVISION_KEY?.trim() || process.env.ZAAMOW_SALON_PROVISION_KEY?.trim();
  if (!key) return false;
  const header = req.headers.get("x-zaamow-provision-key")?.trim();
  return Boolean(header && header === key);
}

function uniqueSlugCandidate(base: string, n: number): string {
  if (n <= 1) return base;
  return `${base}-${n}`.slice(0, 48);
}

/**
 * Internal: zaamow → tworzy Clinic + ClinicAccount (jak registerClinic),
 * bez publicznego formularza. Wymaga x-zaamow-provision-key.
 */
export async function POST(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    name?: string;
    email?: string;
    city?: string;
    slug?: string;
    password?: string;
    description?: string;
    autoVerify?: boolean;
    orderId?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const city = String(body.city || "").trim() || "Polska";
  const description = String(body.description || "").trim();
  const password = String(body.password || "").trim();
  const autoVerify = Boolean(body.autoVerify);

  if (!name || !email || !password) {
    return NextResponse.json({ ok: false, error: "name, email, password wymagane" }, { status: 400 });
  }
  if (password.length < 10) {
    return NextResponse.json({ ok: false, error: "Hasło min. 10 znaków" }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Nieprawidłowy e-mail" }, { status: 400 });
  }

  let baseSlug = String(body.slug || name)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ł/g, "l")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  if (baseSlug.length < 3) baseSlug = `gabinet-${Date.now().toString(36)}`;
  if (baseSlug === "moj-gabinet" || baseSlug === "demo") {
    baseSlug = `${baseSlug}-klient`;
  }

  try {
    const prisma = getPrisma();
    const existingAccount = await prisma.clinicAccount.findUnique({ where: { email } });
    if (existingAccount) {
      const clinic = await prisma.clinic.findUnique({ where: { id: existingAccount.clinicId } });
      if (clinic) {
        return NextResponse.json({
          ok: true,
          slug: clinic.slug,
          clinicId: clinic.id,
          panelUrl: "https://salon.odart.pl/portal/login",
          reused: true,
        });
      }
      return NextResponse.json({ ok: false, error: "Konto e-mail już istnieje bez gabinetu." }, { status: 409 });
    }

    let slug = baseSlug;
    for (let n = 1; n <= 20; n++) {
      const candidate = uniqueSlugCandidate(baseSlug, n);
      if (!slugRegex.test(candidate)) continue;
      const taken = await prisma.clinic.findUnique({ where: { slug: candidate } });
      if (!taken) {
        slug = candidate;
        break;
      }
      if (n === 20) {
        return NextResponse.json({ ok: false, error: "Nie udało się znaleźć wolnego slug." }, { status: 409 });
      }
    }

    const hash = await bcrypt.hash(password, 10);
    const clinic = await prisma.clinic.create({
      data: {
        slug,
        name,
        city,
        description,
        specializations: "[]",
        matchingTags: "[]",
        treatmentIds: "[]",
        kontakt: JSON.stringify({ email, orderId: body.orderId || null }),
        isPublished: false,
      },
    });

    await prisma.clinicAccount.create({
      data: {
        email,
        passwordHash: hash,
        clinicId: clinic.id,
        emailVerifiedAt: autoVerify ? new Date() : null,
        verificationToken: autoVerify ? null : crypto.randomBytes(32).toString("hex"),
        verificationTokenExpires: autoVerify ? null : new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    return NextResponse.json({
      ok: true,
      slug: clinic.slug,
      clinicId: clinic.id,
      panelUrl: "https://salon.odart.pl/portal/login",
      reused: false,
    });
  } catch (e) {
    console.error("zaamow provision-clinic:", e);
    return NextResponse.json({ ok: false, error: "Błąd tworzenia gabinetu" }, { status: 500 });
  }
}
