import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { isOdartMainHost } from "@/lib/odartSite";
import { OdartHotelOpsPage } from "@/components/odart/OdartHotelOpsPage";

const ODART_SITE = process.env.NEXT_PUBLIC_ODART_SITE_URL?.replace(/\/$/, "") || "https://odart.pl";
const CANONICAL = `${ODART_SITE}/hotel/`;

export async function generateMetadata(): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "";
  if (!isOdartMainHost(host)) {
    return { title: "404" };
  }
  return {
    title: {
      absolute: "Aplikacja hotelowa do awarii i housekeepingu | HotelOps",
    },
    description:
      "HotelOps to aplikacja hotelowa do zgłaszania awarii i zarządzania housekeepingiem. Jedno narzędzie, porządek i pełna kontrola. Umów demo 15 minut.",
    keywords: [
      "aplikacja hotelowa",
      "HotelOps",
      "housekeeping w hotelu",
      "awarie w hotelu",
      "harmonogram pracy pokojowej",
      "standardy housekeeping",
    ],
    alternates: { canonical: CANONICAL },
    openGraph: {
      title: "HotelOps — awarie i housekeeping w hotelu",
      description:
        "Jedno miejsce do zgłoszeń usterek, zadań housekeepingu i raportów. Demo 15 minut.",
      url: CANONICAL,
      locale: "pl_PL",
      type: "website",
      siteName: "ODART",
      images: [
        {
          url: `${ODART_SITE}/hotelops/hero-phone.png`,
          width: 792,
          height: 808,
          alt: "HotelOps — podgląd aplikacji",
        },
      ],
    },
  };
}

export default async function HotelOpsLandingRoute() {
  const host = (await headers()).get("host") ?? "";
  if (!isOdartMainHost(host)) {
    notFound();
  }
  return <OdartHotelOpsPage />;
}
