import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { isOdartMainHost, isRafalKowalkowskiPlHost, ODART_SITE_URL } from "@/lib/odartSite";
import { rafalPageCanonicalUrl } from "@/lib/rafalKowalkowskiLegacyRoutes";
import { ODART_WP_REVALIDATE_SECONDS, fetchOdartWpPosts } from "@/lib/odartWordpress";
import { OdartBlogIndexPage } from "@/components/odart/OdartBlogIndexPage";
import { OdartRafalKowalkowskiBlogIndexPage } from "@/components/odart/OdartRafalKowalkowskiBlogIndexPage";

const ODART_SITE = ODART_SITE_URL.replace(/\/$/, "");
const CANONICAL = `${ODART_SITE}/blog/`;

export const revalidate = ODART_WP_REVALIDATE_SECONDS;

export async function generateMetadata(): Promise<Metadata> {
  const hdr = await headers();
  const host = hdr.get("host") ?? "";
  if (isRafalKowalkowskiPlHost(host)) {
    const proto = hdr.get("x-forwarded-proto") ?? "https";
    const canonical = rafalPageCanonicalUrl("/blog", host, proto);
    return {
      title: { absolute: "Blog — Rafał Kowalkowski" },
      description: "Artykuły o fotografii, muzyce i produkcji — Rafał Kowalkowski, Kołobrzeg.",
      alternates: { canonical },
      openGraph: {
        title: "Blog | Rafał Kowalkowski",
        url: canonical,
        locale: "pl_PL",
        type: "website",
      },
    };
  }
  if (!isOdartMainHost(host)) {
    return { title: "404" };
  }
  return {
    title: "Web Design Blog | ODART | Kolobrzeg, Poland",
    description:
      "Articles about websites, WordPress, SEO and selected ODART projects. Practical notes on building modern websites and web systems.",
    alternates: { canonical: CANONICAL },
    openGraph: {
      title: "Blog | ODART",
      description: "Articles about websites, SEO, WordPress and selected ODART projects.",
      url: CANONICAL,
      locale: "en_US",
      type: "website",
      siteName: "ODART",
    },
  };
}

export default async function BlogPage() {
  const host = (await headers()).get("host") ?? "";
  if (isRafalKowalkowskiPlHost(host)) {
    return <OdartRafalKowalkowskiBlogIndexPage />;
  }
  if (!isOdartMainHost(host)) {
    notFound();
  }
  const posts = await fetchOdartWpPosts();
  return <OdartBlogIndexPage posts={posts} />;
}
