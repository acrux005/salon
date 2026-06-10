import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { OdartWpHtmlPage } from "@/components/odart/OdartWpHtmlPage";
import { getOdartProjectOverride } from "@/lib/odartCustomSiteContent";
import { isOdartMainHost, ODART_SITE_URL } from "@/lib/odartSite";
import {
  ODART_WP_REVALIDATE_SECONDS,
  fetchOdartWpProjectBySlug,
  isBrokenWpRestContent,
  stripHtmlToText,
} from "@/lib/odartWordpress";

const SITE = ODART_SITE_URL.replace(/\/$/, "");

export const revalidate = ODART_WP_REVALIDATE_SECONDS;

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "";
  if (!isOdartMainHost(host)) {
    return { title: "404" };
  }

  const custom = getOdartProjectOverride(params.slug);
  if (custom) {
    const canonical = `${SITE}/project/${params.slug}/`;
    const raw = stripHtmlToText(custom.html);
    const description = raw.length > 160 ? `${raw.slice(0, 157)}…` : raw;
    return {
      title: `${custom.title} | ODART`,
      description,
      alternates: { canonical },
      openGraph: {
        title: custom.title,
        description,
        url: canonical,
        siteName: "ODART",
        type: "article",
        locale: "pl_PL",
      },
    };
  }

  const project = await fetchOdartWpProjectBySlug(params.slug);
  if (!project) {
    return { title: "404" };
  }
  const canonical = `${SITE}/project/${params.slug}/`;
  const raw = stripHtmlToText(project.contentHtml);
  const description = raw.length > 160 ? `${raw.slice(0, 157)}…` : raw;
  return {
    title: `${project.title} | Realizacja | ODART`,
    description,
    alternates: { canonical },
    openGraph: {
      title: project.title,
      description,
      url: canonical,
      siteName: "ODART",
      type: "article",
      locale: "pl_PL",
    },
  };
}

export default async function OdartProjectWpPage({ params }: Props) {
  const host = (await headers()).get("host") ?? "";
  if (!isOdartMainHost(host)) {
    notFound();
  }

  const custom = getOdartProjectOverride(params.slug);
  if (custom) {
    return (
      <OdartWpHtmlPage
        title={custom.title}
        contentHtml={custom.html}
        canonicalPath={`/project/${params.slug}/`}
        imageUrl={custom.imageUrl ?? null}
        imageAlt={custom.imageAlt ?? null}
        backHref={`${SITE}/portfolio/`}
        backLabel="Portfolio"
        jsonLdName={custom.title}
        eyebrow={custom.eyebrow ?? "Realizacja"}
      />
    );
  }

  const project = await fetchOdartWpProjectBySlug(params.slug);
  if (!project) {
    notFound();
  }

  let html = project.contentHtml;
  if (isBrokenWpRestContent(html)) {
    html = `
<p>Opis realizacji pochodził z szablonu Divi i nie jest dostępny jako czysty HTML z API. Chcesz poznać szczegóły podobnego wdrożenia — napisz.</p>
<p class="mt-4"><a href="${SITE}/kontakt/">Kontakt →</a> · <a href="${SITE}/portfolio/">Portfolio →</a></p>
`;
  }

  return (
    <OdartWpHtmlPage
      title={project.title}
      contentHtml={html}
      canonicalPath={`/project/${params.slug}/`}
      imageUrl={project.imageUrl}
      imageAlt={project.imageAlt}
      backHref={`${SITE}/portfolio/`}
      backLabel="Portfolio"
      jsonLdName={project.title}
      eyebrow="Realizacja"
    />
  );
}
