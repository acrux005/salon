import type { Metadata } from "next";
import { headers } from "next/headers";
import { DM_Sans } from "next/font/google";
import { GabLayoutChrome } from "@/components/gabinetPlatform/GabLayoutChrome";
import { GabHostProvider } from "@/contexts/GabHostContext";
import { GabVerticalProvider } from "@/contexts/GabVerticalContext";
import { getGabinetSiteUrl, isGabinetPortalHost } from "@/lib/gabinetPlatform/host";
import { getGabinetVerticalConfigForHost, getGabinetVerticalFromHost } from "@/lib/gabinetPlatform/verticals";
import "./gab-theme.css";

const gabFont = DM_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-gab",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "";
  const vertical = getGabinetVerticalConfigForHost(host);
  if (isGabinetPortalHost(host)) {
    return { themeColor: "#0ea5e9" };
  }
  return {
    metadataBase: new URL(getGabinetSiteUrl(host)),
    title: {
      default: `${vertical.brandName} — portal dla gabinetów`,
      template: `%s | ${vertical.brandName}`,
    },
    description: vertical.heroSubtitle,
    themeColor: "#0ea5e9",
  };
}

export default async function GabinetLayout({ children }: { children: React.ReactNode }) {
  const host = (await headers()).get("host") ?? "";
  const isGabinetPortal = isGabinetPortalHost(host);
  const verticalId = getGabinetVerticalFromHost(host);

  return (
    <GabHostProvider isGabinetPortal={isGabinetPortal}>
      <GabVerticalProvider verticalId={verticalId}>
        <div
          className={`gab-portal ${gabFont.variable} flex min-h-dvh flex-col bg-sky-50/30 font-[family-name:var(--font-gab)] text-gab-navy antialiased`}
        >
          <GabLayoutChrome>{children}</GabLayoutChrome>
        </div>
      </GabVerticalProvider>
    </GabHostProvider>
  );
}
