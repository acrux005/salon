import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { CLIENT_ROLE } from "@/lib/auth";
import { getPrisma } from "@/lib/db";
import { getAllClinicRecordsAsync } from "@/lib/skinmatch/clinics";
import { HeaderPortal } from "@/components/portal/HeaderPortal";
import { FooterPortal } from "@/components/portal/FooterPortal";
import { ClientPanelBookings } from "./ClientPanelBookings";

export default async function MojeRezerwacjePage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role;
  const clientId = (session?.user as { clientId?: string })?.clientId;
  if (role !== CLIENT_ROLE || !clientId) redirect("/portal/login");

  type BookingRow = {
    id: string;
    cosmoAppointmentId?: number;
    clinicSlug: string;
    clinicName: string | null;
    clinicId?: string;
    date: string;
    time: string;
    serviceName: string | null;
    status: string;
    source: "cosmo" | "portal";
  };
  let bookings: BookingRow[] = [];
  let clientInfo: { name?: string; email?: string; phone?: string } | undefined;
  let clinics: { slug: string; name: string }[] = [];
  let favoriteClinics: { slug: string; name: string }[] = [];

  try {
    const prisma = getPrisma();
    const [bookingsRaw, client, clinicsRaw, favoritesRaw] = await Promise.all([
      prisma.clientBooking.findMany({
        where: { clientId },
        orderBy: [{ date: "desc" }, { time: "desc" }],
      }),
      prisma.client.findUnique({
        where: { id: clientId },
        select: { name: true, email: true, phone: true },
      }),
      getAllClinicRecordsAsync(),
      prisma.clientFavoriteClinic.findMany({
        where: { clientId },
        include: { clinic: { select: { slug: true, name: true } } },
      }),
    ]);
    let clinicBookingsRaw: { id: string; date: string; time: string; treatmentName: string | null; status: string; clinic: { id: string; slug: string; name: string } }[] = [];
    if (client?.email?.trim()) {
      const emailRaw = client.email.trim();
      const emailLower = emailRaw.toLowerCase();
      clinicBookingsRaw = await prisma.clinicBooking.findMany({
        where: {
          OR: [{ clientEmail: emailLower }, { clientEmail: emailRaw }],
        },
        include: { clinic: { select: { id: true, slug: true, name: true } } },
        orderBy: [{ date: "desc" }, { time: "desc" }],
      });
    }
    const clinicBySlug = await prisma.clinic.findMany({
      where: { slug: { in: bookingsRaw.map((b) => b.clinicSlug) } },
      select: { id: true, slug: true },
    });
    const slugToId = new Map(clinicBySlug.map((c) => [c.slug, c.id]));

    const fromCosmo: BookingRow[] = bookingsRaw.map((b) => ({
      id: b.id,
      cosmoAppointmentId: b.cosmoAppointmentId,
      clinicSlug: b.clinicSlug,
      clinicName: b.clinicName,
      clinicId: slugToId.get(b.clinicSlug),
      date: b.date,
      time: b.time,
      serviceName: b.serviceName,
      status: b.status,
      source: "cosmo" as const,
    }));
    const fromPortal: BookingRow[] = clinicBookingsRaw.map((b) => ({
      id: b.id,
      clinicSlug: b.clinic.slug,
      clinicName: b.clinic.name,
      clinicId: b.clinic.id,
      date: b.date,
      time: b.time,
      serviceName: b.treatmentName,
      status: b.status,
      source: "portal" as const,
    }));
    bookings = [...fromCosmo, ...fromPortal].sort((a, b) => {
      const d = b.date.localeCompare(a.date);
      return d !== 0 ? d : b.time.localeCompare(a.time);
    });
    clientInfo = client
      ? {
          name: client.name ?? undefined,
          email: client.email,
          phone: client.phone ?? undefined,
        }
      : undefined;
    clinics = clinicsRaw.map((c) => ({ slug: c.slug, name: c.name }));
    favoriteClinics = favoritesRaw.map((f) => ({ slug: f.clinic.slug, name: f.clinic.name }));
  } catch (e) {
    console.error("[moje-rezerwacje]", e);
    return (
      <>
        <HeaderPortal />
        <main className="min-h-screen bg-white py-12">
          <div className="mx-auto max-w-2xl px-4">
            <Link href="/portal" className="text-[14px] font-medium text-pink-600 hover:underline">
              ← Portal
            </Link>
            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-[15px] text-amber-900">
              <p className="font-medium">Błąd ładowania panelu</p>
              <p className="mt-1">
                Nie udało się załadować danych. Spróbuj odświeżyć stronę lub wyloguj się i zaloguj ponownie.
              </p>
            </div>
          </div>
        </main>
        <FooterPortal />
      </>
    );
  }

  return (
    <>
      <HeaderPortal />
      <main className="min-h-screen bg-white py-12">
        <div className="mx-auto max-w-2xl px-4">
          <Link
            href="/portal"
            className="text-[14px] font-medium text-pink-600 hover:underline"
          >
            ← Portal
          </Link>
          <h1 className="mt-4 font-[var(--font-serif)] text-2xl font-normal text-[#1F1A1C]">
            Moje rezerwacje
          </h1>
          <p className="mt-2 font-[var(--font-sans)] text-[15px] text-[#6F5E64]">
            Twoje wizyty w jednym miejscu. Możesz też zarezerwować nowy termin.
          </p>

          <ClientPanelBookings
            bookings={bookings.map((b) => ({ ...b, clinicId: b.clinicId }))}
            clinics={clinics}
            favoriteClinics={favoriteClinics}
            clientInfo={clientInfo}
          />
        </div>
      </main>
      <FooterPortal />
    </>
  );
}
