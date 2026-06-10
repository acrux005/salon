import type { Metadata } from "next";
import { headers } from "next/headers";
import { DM_Sans } from "next/font/google";
import { WetLayoutChrome } from "@/components/wet/WetLayoutChrome";
import { WetHostProvider } from "@/contexts/WetHostContext";
import { getWetSiteUrl, isWetPortalHost } from "@/lib/wetHost";
import "./wet-theme.css";

const wetFont = DM_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-wet",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "";
  if (isWetPortalHost(host)) {
    return { themeColor: "#0d9488" };
  }
  return {
    metadataBase: new URL(getWetSiteUrl(host)),
    title: {
      default: "VetHarmonogram — portal dla przychodni weterynaryjnych",
      template: "%s | VetHarmonogram",
    },
    description:
      "Wizyty, kalendarz, pacjenci, wiadomości i przypomnienia o szczepieniach. System dla przychodni weterynaryjnych w Polsce.",
    themeColor: "#0d9488",
  };
}

export default async function WetLayout({ children }: { children: React.ReactNode }) {
  const host = (await headers()).get("host") ?? "";
  const isWetPortal = isWetPortalHost(host);

  return (
    <WetHostProvider isWetPortal={isWetPortal}>
      <div
        className={`wet-portal ${wetFont.variable} flex min-h-dvh flex-col bg-wet-mint font-[family-name:var(--font-wet)] text-wet-navy antialiased`}
      >
        <WetLayoutChrome>{children}</WetLayoutChrome>
      </div>
    </WetHostProvider>
  );
}
