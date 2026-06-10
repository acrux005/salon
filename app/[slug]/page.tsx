import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { OdartWpHtmlPage } from "@/components/odart/OdartWpHtmlPage";
import { getOdartPageOverride } from "@/lib/odartCustomSiteContent";
import { isOdartMainHost, ODART_SITE_URL } from "@/lib/odartSite";
import {
  ODART_WP_REVALIDATE_SECONDS,
  fetchOdartWpPageBySlug,
  isBrokenWpRestContent,
  stripHtmlToText,
} from "@/lib/odartWordpress";

const SITE = ODART_SITE_URL.replace(/\/$/, "");

const RESERVED_SLUG = new Set([
  "_next",
  "api",
  "favicon.ico",
  "robots.txt",
  "sitemap.xml",
  "icon.png",
]);

export const revalidate = ODART_WP_REVALIDATE_SECONDS;

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "";
  if (!isOdartMainHost(host)) {
    return { title: "404" };
  }
  if (RESERVED_SLUG.has(params.slug)) {
    return { title: "404" };
  }

  const ov = getOdartPageOverride(params.slug);
  if (ov && "redirectTo" in ov) {
    const to = ov.redirectTo.startsWith("http") ? ov.redirectTo : `${SITE}${ov.redirectTo}`;
    return {
      title: "ODART",
      alternates: { canonical: to },
    };
  }

  if (ov && "html" in ov) {
    const canonical = `${SITE}/${params.slug}/`;
    const raw = stripHtmlToText(ov.html);
    const description = raw.length > 160 ? `${raw.slice(0, 157)}…` : raw;
    return {
      title: `${ov.title} | ODART`,
      description,
      alternates: { canonical },
      openGraph: {
        title: ov.title,
        description,
        url: canonical,
        siteName: "ODART",
        type: "website",
        locale: "pl_PL",
      },
    };
  }

  const page = await fetchOdartWpPageBySlug(params.slug);
  if (!page) {
    return { title: "404" };
  }
  const raw = stripHtmlToText(page.contentHtml);
  const description = raw.length > 160 ? `${raw.slice(0, 157)}…` : raw;
  const canonical = `${SITE}/${params.slug}/`;
  return {
    title: `${page.title} | ODART`,
    description,
    alternates: { canonical },
    openGraph: {
      title: page.title,
      description,
      url: canonical,
      siteName: "ODART",
      type: "website",
      locale: "pl_PL",
    },
  };
}

export default async function OdartWpPageBySlug({ params }: Props) {
  const host = (await headers()).get("host") ?? "";
  if (!isOdartMainHost(host)) {
    notFound();
  }
  if (RESERVED_SLUG.has(params.slug)) {
    notFound();
  }

  const ov = getOdartPageOverride(params.slug);
  if (ov && "redirectTo" in ov) {
    redirect(ov.redirectTo);
  }

  if (ov && "html" in ov) {
    return (
      <OdartWpHtmlPage
        title={ov.title}
        contentHtml={ov.html}
        canonicalPath={`/${params.slug}/`}
        imageUrl={ov.imageUrl ?? null}
        imageAlt={ov.imageAlt ?? null}
        backHref={`${SITE}/`}
        backLabel="Strona główna"
        jsonLdName={ov.title}
        eyebrow={ov.eyebrow ?? "Strona"}
      />
    );
  }

  const page = await fetchOdartWpPageBySlug(params.slug);
  if (!page) {
    notFound();
  }

  let html = page.contentHtml;
  if (isBrokenWpRestContent(html)) {
    html = `
<p>Treść tej strony była zapisana w edytorze Divi (shortcode) i nie jest dostępna jako gotowy HTML z WordPress REST API. Jeśli potrzebujesz pełnej treści lub aktualizacji — napisz, przygotuję wersję dopasowaną do tej witryny.</p>
<p class="mt-4"><a href="${SITE}/kontakt/">Formularz kontaktowy →</a></p>
`;
  }

  return (
    <OdartWpHtmlPage
      title={page.title}
      contentHtml={html}
      canonicalPath={`/${params.slug}/`}
      imageUrl={page.imageUrl}
      imageAlt={page.imageAlt}
      backHref={`${SITE}/`}
      backLabel="Strona główna"
      jsonLdName={page.title}
      eyebrow="Strona"
    />
  );
}
