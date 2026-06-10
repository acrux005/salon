import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { ODART_SITE_URL } from "@/lib/odartSite";
import { OdartPublicShell } from "@/components/odart/OdartPublicShell";

const SITE = ODART_SITE_URL;

export type OdartWpHtmlPageProps = {
  title: string;
  contentHtml: string;
  canonicalPath: string;
  imageUrl?: string | null;
  imageAlt?: string | null;
  backHref?: string;
  backLabel?: string;
  jsonLdName?: string;
  /** Mały label nad tytułem (jak „Portfolio” na /portfolio) */
  eyebrow?: string;
};

export function OdartWpHtmlPage({
  title,
  contentHtml,
  canonicalPath,
  imageUrl,
  imageAlt,
  backHref = `${SITE}/`,
  backLabel = "Strona główna",
  jsonLdName,
  eyebrow = "Strona",
}: OdartWpHtmlPageProps) {
  const canonical = `${SITE.replace(/\/$/, "")}${canonicalPath.startsWith("/") ? canonicalPath : `/${canonicalPath}`}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${canonical}#webpage`,
        url: canonical,
        name: jsonLdName ?? title,
        isPartOf: { "@id": `${SITE}/#website` },
        inLanguage: "pl-PL",
      },
    ],
  };

  return (
    <OdartPublicShell jsonLd={jsonLd}>
      <section className="border-b border-white/10 px-4 py-12 lg:px-6 lg:py-16">
        <div className="mx-auto max-w-3xl">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-sm font-medium text-odart-accent hover:text-orange-300"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            {backLabel}
          </Link>
          <p className="mt-8 text-sm font-medium uppercase tracking-wide text-odart-accent">{eyebrow}</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">{title}</h1>
        </div>
      </section>

      <article className="px-4 py-12 pb-24 lg:px-6 lg:py-16">
        <div className="mx-auto max-w-3xl">
          {imageUrl ? (
            <div className="relative mb-12 aspect-[21/9] w-full overflow-hidden rounded-2xl border border-white/10 bg-neutral-900">
              <Image
                src={imageUrl}
                alt={imageAlt || title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
          ) : null}

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-10">
            <div
              className="odart-wp-content prose prose-invert prose-lg max-w-none prose-headings:scroll-mt-24 prose-headings:font-bold prose-headings:text-white prose-h2:mt-10 prose-h2:text-2xl prose-h3:mt-8 prose-h3:text-xl prose-p:text-neutral-300 prose-p:leading-relaxed prose-a:text-odart-accent prose-a:no-underline hover:prose-a:text-orange-300 prose-strong:text-white prose-ul:text-neutral-300 prose-li:marker:text-odart-accent/80 prose-blockquote:border-l-odart-accent prose-blockquote:text-neutral-400"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          </div>

          <div className="mt-14 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent p-8 text-center">
            <p className="text-neutral-400">Masz pytanie albo podobny projekt?</p>
            <Link
              href={`${SITE}/kontakt/`}
              className="mt-4 inline-flex items-center justify-center rounded-lg bg-odart-accent px-8 py-3 font-semibold text-white hover:brightness-110"
            >
              Kontakt
            </Link>
          </div>
        </div>
      </article>
    </OdartPublicShell>
  );
}
