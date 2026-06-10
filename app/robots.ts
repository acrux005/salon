import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { isRafalKowalkowskiPlHost } from "@/lib/odartSite";
import { rafalKowalkowskiRobots } from "@/lib/rafalKowalkowskiSeo";
import { isRandkiPortalHost, getRandkiSiteUrl } from "@/lib/randkiHost";

export const dynamic = "force-dynamic";

const SALON_ROBOTS: MetadataRoute.Robots = {
  rules: [
    {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/portal/panel/",
        "/portal/admin/",
        "/portal/login",
        "/portal/register",
        "/portal/register-klient",
        "/portal/verify-email",
        "/portal/moje-rezerwacje",
        "/portal/ustawienia",
        "/portal/powiadomienia",
        "/portal/wiadomosci",
        "/api/",
      ],
    },
  ],
  sitemap: "https://salon.odart.pl/sitemap.xml",
  host: "https://salon.odart.pl",
};

const RANDKI_ROBOTS = (host: string): MetadataRoute.Robots => ({
  rules: [
    {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/panel",
        "/profil",
        "/dopasowania",
        "/czat",
        "/polubienia",
        "/ustawienia",
        "/logowanie",
        "/rejestracja",
        "/login",
        "/potwierdz-email",
        "/ustaw-haslo",
        "/zapomniane-haslo",
        "/api/",
      ],
    },
  ],
  sitemap: `${getRandkiSiteUrl(host)}/sitemap.xml`,
  host: getRandkiSiteUrl(host),
});

export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = (await headers()).get("host") ?? "";
  if (isRafalKowalkowskiPlHost(host)) {
    return rafalKowalkowskiRobots();
  }
  if (isRandkiPortalHost(host)) {
    return RANDKI_ROBOTS(host);
  }
  return SALON_ROBOTS;
}
