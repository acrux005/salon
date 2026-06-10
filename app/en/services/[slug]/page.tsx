import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OdartEnglishServicePage } from "@/components/odart/OdartEnglishServicePage";
import {
  ODART_ENGLISH_SERVICES,
  getEnglishServiceBySlug,
} from "@/lib/odartEnglishServices";
import { ODART_SITE_URL } from "@/lib/odartSite";

const SITE = ODART_SITE_URL;

type Props = {
  params: { slug: string };
};

export function generateStaticParams() {
  return ODART_ENGLISH_SERVICES.map((service) => ({ slug: service.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const service = getEnglishServiceBySlug(params.slug);
  if (!service) {
    return { title: "404" };
  }

  const canonical = `${SITE}/en/services/${service.slug}/`;
  return {
    title: `${service.title} | ODART`,
    description: service.description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: service.title,
      description: service.description,
      url: canonical,
      siteName: "ODART",
      locale: "en_US",
      type: "website",
    },
  };
}

export default function EnglishServiceDetailPage({ params }: Props) {
  const service = getEnglishServiceBySlug(params.slug);
  if (!service) {
    notFound();
  }

  return <OdartEnglishServicePage service={service} />;
}
