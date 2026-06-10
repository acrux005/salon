import type { Metadata } from "next";
import { PORTAL_SITE_URL, buildPortalJsonLdGraph } from "@/content/portalSeo";

export const metadata: Metadata = {
  metadataBase: new URL(PORTAL_SITE_URL),
  title: {
    default: "Zabiegi Odart — dobierz zabieg i gabinet w Polsce",
    template: "%s | Zabiegi Odart",
  },
  description:
    "Dobierz zabieg lub gabinet kosmetyczny w Polsce — analiza skóry, katalog usług, sprawdzone salony i artykuły eksperckie.",
  openGraph: {
    type: "website",
    siteName: "Zabiegi Odart",
    locale: "pl_PL",
    url: `${PORTAL_SITE_URL}/portal`,
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: {
    canonical: `${PORTAL_SITE_URL}/portal`,
  },
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = buildPortalJsonLdGraph();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  );
}
