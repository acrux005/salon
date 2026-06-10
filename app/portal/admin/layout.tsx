import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { ADMIN_ROLE } from "@/lib/auth";
import { HeaderPortal } from "@/components/portal/HeaderPortal";
import { FooterPortal } from "@/components/portal/FooterPortal";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if ((session?.user as { role?: string })?.role !== ADMIN_ROLE) redirect("/portal/login");
  return (
    <>
      <HeaderPortal />
      {children}
      <FooterPortal />
    </>
  );
}
