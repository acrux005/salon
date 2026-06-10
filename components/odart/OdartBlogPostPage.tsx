import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { ODART_SITE_URL } from "@/lib/odartSite";
import type { OdartWpPostFull } from "@/lib/odartWordpress";
import { getEnglishBlogPost } from "@/lib/odartBlogEnglish";
import { OdartPublicShell } from "@/components/odart/OdartPublicShell";
import { OdartBlogRealizacjeBody } from "@/components/odart/OdartBlogRealizacjeBody";
import { ODART_REALIZACJE_HERO_IMAGE } from "@/lib/odartRealizacjeBlog";

const SITE = ODART_SITE_URL;

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", { day: "numeric", month: "long", year: "numeric" }).format(
      new Date(iso),
    );
  } catch {
    return iso;
  }
}

type Props = {
  post: OdartWpPostFull;
};

export function OdartBlogPostPage({ post }: Props) {
  const canonical = `${SITE}/blog/${post.slug}/`;
  const englishPost = getEnglishBlogPost(post.slug);
  const title = englishPost?.title ?? post.title;
  const category = englishPost?.category ?? post.categoryName;
  const contentHtml = englishPost?.contentHtml || post.contentHtml;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${canonical}#webpage`,
        url: canonical,
        name: title,
        isPartOf: { "@id": `${SITE}/#website` },
        inLanguage: "en-US",
      },
      {
        "@type": "BlogPosting",
        headline: title,
        url: canonical,
        datePublished: post.date,
        author: post.authorName ? { "@type": "Person", name: post.authorName } : undefined,
        articleSection: category ?? undefined,
      },
    ],
  };

  return (
    <OdartPublicShell activeNav="blog" jsonLd={jsonLd} locale="en">
      <article className="px-4 py-12 lg:px-6 lg:py-16">
        <div className="mx-auto max-w-3xl">
          <Link
            href={`${SITE}/blog/`}
            className="inline-flex items-center gap-2 text-sm font-medium text-odart-accent hover:text-orange-300"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            All posts
          </Link>

          <header className="mt-8 border-b border-white/10 pb-10">
            <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500">
              {category ? (
                <span className="rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-0.5 font-medium text-odart-accent">
                  {category}
                </span>
              ) : null}
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" aria-hidden />
                {formatDate(post.date)}
              </span>
              {post.authorName ? (
                <span className="inline-flex items-center gap-1">
                  <User className="h-3.5 w-3.5" aria-hidden />
                  {post.authorName}
                </span>
              ) : null}
            </div>
            <h1 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">{title}</h1>
          </header>

          {post.slug === "realizacje" || post.imageUrl ? (
            <div
              className={`relative mt-10 w-full overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 ${
                post.slug === "realizacje" ? "aspect-[16/9]" : "aspect-[21/9]"
              }`}
            >
              <Image
                src={
                  post.slug === "realizacje" ? ODART_REALIZACJE_HERO_IMAGE.src : (post.imageUrl as string)
                }
                alt={
                  post.slug === "realizacje"
                    ? ODART_REALIZACJE_HERO_IMAGE.alt
                    : post.imageAlt || title
                }
                fill
                className="object-cover object-center"
                priority
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
          ) : null}

          {post.slug === "realizacje" ? (
            <OdartBlogRealizacjeBody />
          ) : (
            <div
              className="prose prose-invert prose-lg max-w-none prose-headings:scroll-mt-24 prose-headings:font-bold prose-headings:text-white prose-p:text-neutral-300 prose-a:text-odart-accent prose-a:no-underline hover:prose-a:text-orange-300 prose-strong:text-white prose-li:text-neutral-300 mt-10"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          )}

          <div className="mt-16 rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
            <p className="text-neutral-400">Need a website or a consultation?</p>
            <Link
              href={`${SITE}/en/#contact`}
              className="mt-4 inline-flex items-center justify-center rounded-lg bg-odart-accent px-8 py-3 font-semibold text-white hover:brightness-110"
            >
              Contact me - let's schedule a call
            </Link>
          </div>
        </div>
      </article>
    </OdartPublicShell>
  );
}
