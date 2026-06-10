import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { CLIENT_ROLE } from "@/lib/auth";
import { getPrisma } from "@/lib/db";
import { HeaderPortal } from "@/components/portal/HeaderPortal";
import { FooterPortal } from "@/components/portal/FooterPortal";
import { ClientSettingsForm } from "./ClientSettingsForm";

export const metadata = {
  title: "Ustawienia konta",
  description: "Zarządzaj powiadomieniami i danymi do faktury.",
};

export default async function UstawieniaPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role;
  const clientId = (session?.user as { clientId?: string })?.clientId;

  if (role !== CLIENT_ROLE || !clientId) {
    redirect("/portal");
  }

  const prisma = getPrisma();
  const client = await prisma.client.findUnique({
    where: { id: clientId },
    select: {
      name: true,
      email: true,
      phone: true,
      notifyReminders: true,
      notifyPromo: true,
      invoiceName: true,
      invoiceNip: true,
      invoiceAddress: true,
    },
  });

  if (!client) {
    redirect("/portal");
  }

  return (
    <>
      <HeaderPortal />
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="font-[var(--font-sans)] text-2xl font-semibold text-[#1F1A1C]">
            Ustawienia konta
          </h1>
          <p className="mt-1 text-[15px] text-[#6F5E64]">
            Zarządzaj danymi profilu, powiadomieniami i danymi do faktury.
          </p>
          <ClientSettingsForm
            name={client.name ?? ""}
            email={client.email}
            phone={client.phone ?? ""}
            notifyReminders={client.notifyReminders}
            notifyPromo={client.notifyPromo}
            invoiceName={client.invoiceName ?? ""}
            invoiceNip={client.invoiceNip ?? ""}
            invoiceAddress={client.invoiceAddress ?? ""}
          />
        </div>
      </main>
      <FooterPortal />
    </>
  );
}
