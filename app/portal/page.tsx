import type { Metadata } from "next";
import { PortalPageClient } from "@/components/portal/PortalPageClient";
import { getFeaturedClinicRecordsAsync } from "@/lib/skinmatch/clinics";
import { getClaimedClinicIdSet } from "@/lib/catalogListingServer";
import { PORTAL_SITE_URL } from "@/content/portalSeo";

export const metadata: Metadata = {
  title: {
    absolute: "Znajdź salon beauty w swojej okolicy | Salon Odart",
  },
  description:
    "Gabinety kosmetyczne, fryzjerstwo, paznokcie, brwi i masaże. Znajdź salon w swoim mieście. Właściciele: bezpłatny profil i oferta stron WWW.",
  keywords: [
    "Salon Odart",
    "gabinety kosmetyczne",
    "salon beauty",
    "fryzjer",
    "paznokcie",
    "strona internetowa gabinetu",
  ],
  alternates: { canonical: `${PORTAL_SITE_URL}/portal` },
  openGraph: {
    title: "Salon Odart — znajdź salon beauty",
    description:
      "Portal gabinetów i usług beauty. Szukaj salonu w okolicy. Właściciele: profil w portalu i własne strony WWW.",
    url: `${PORTAL_SITE_URL}/portal`,
    siteName: "Salon Odart",
    locale: "pl_PL",
  },
  twitter: {
    card: "summary_large_image",
    title: "Salon Odart — salony beauty",
    description: "Znajdź salon beauty w swojej okolicy.",
  },
};

export default async function PortalPage() {
  const featuredClinics = await getFeaturedClinicRecordsAsync(12);
  const claimedIds = Array.from(await getClaimedClinicIdSet(featuredClinics.map((c) => c.id)));
  return <PortalPageClient featuredClinics={featuredClinics} claimedIds={claimedIds} />;
}
