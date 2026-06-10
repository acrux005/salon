import { PortalQuizProvider } from "@/components/portal/PortalQuizContext";
import { HeaderPortal } from "@/components/portal/HeaderPortal";
import { FooterPortal } from "@/components/portal/FooterPortal";

export default function GabinetyLayout({ children }: { children: React.ReactNode }) {
  return (
    <PortalQuizProvider>
      <div className="min-h-screen flex flex-col bg-white">
        <HeaderPortal />
        <main className="flex-1">{children}</main>
        <FooterPortal />
      </div>
    </PortalQuizProvider>
  );
}
