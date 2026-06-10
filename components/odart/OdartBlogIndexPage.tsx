import Link from "next/link";
import Image from "next/image";
import { Calendar, ChevronRight, User } from "lucide-react";
import { ODART_SITE_URL } from "@/lib/odartSite";
import type { OdartWpPostListItem } from "@/lib/odartWordpress";
import { ODART_BLOG_ENGLISH } from "@/lib/odartBlogEnglish";
import { OdartPublicShell } from "@/components/odart/OdartPublicShell";

const SITE = ODART_SITE_URL;
const CANONICAL = `${SITE}/blog/`;

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
  posts: OdartWpPostListItem[];
};

export function OdartBlogIndexPage({ posts }: Props) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${CANONICAL}#webpage`,
        url: CANONICAL,
        name: "Blog | ODART - websites and SEO",
        description: "Articles about websites, WordPress, SEO and selected projects. Kolobrzeg, Poland.",
        isPartOf: { "@id": `${SITE}/#website` },
        inLanguage: "en-US",
      },
      {
        "@type": "Blog",
        "@id": `${CANONICAL}#blog`,
        name: "Blog ODART",
        url: CANONICAL,
        blogPost: posts.map((p) => ({
          "@type": "BlogPosting",
          headline: p.title,
          url: `${SITE}/blog/${p.slug}/`,
          datePublished: p.date,
        })),
      },
    ],
  };

  return (
    <OdartPublicShell activeNav="blog" jsonLd={jsonLd} locale="en">
      <section className="border-b border-white/10 px-4 py-12 lg:px-6 lg:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-medium uppercase tracking-wide text-odart-accent">Blog</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">Web Design Blog</h1>
          <p className="mt-6 text-lg text-neutral-400 leading-relaxed">
            Articles about websites, WordPress, SEO and selected ODART projects - content from WordPress, interface in Next.js.
          </p>
        </div>
      </section>

      <section className="px-4 py-12 pb-24 lg:px-6 lg:py-16">
        <div className="mx-auto max-w-3xl">
          {posts.length === 0 ? (
            <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center text-neutral-400">
              No posts to display. Please try again later.
            </p>
          ) : (
            <ul className="space-y-10">
              {posts.map((post) => {
                const copy = ODART_BLOG_ENGLISH[post.slug];
                const title = copy?.title ?? post.title;
                const excerpt = copy?.excerpt ?? post.excerptText;
                const category = copy?.category ?? post.categoryName;

                return (
                <li key={post.id}>
                  <article className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:border-odart-accent/30">
                    <Link href={`/blog/${post.slug}/`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-odart-accent">
                      {post.imageUrl ? (
                        <div className="relative aspect-[21/9] w-full bg-neutral-900">
                          <Image
                            src={post.imageUrl}
                            alt={post.imageAlt || title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 768px"
                          />
                        </div>
                      ) : null}
                      <div className="p-6 md:p-8">
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
                        <h2 className="mt-4 text-xl font-bold text-white md:text-2xl">{title}</h2>
                        <p className="mt-3 text-sm leading-relaxed text-neutral-400 md:text-base line-clamp-4">
                          {excerpt}
                        </p>
                        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-odart-accent">
                          Read article
                          <ChevronRight className="h-4 w-4" aria-hidden />
                        </span>
                      </div>
                    </Link>
                  </article>
                </li>
                );
              })}
            </ul>
          )}

          <div className="mt-16 rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
            <p className="text-neutral-400">Have a question about a website or SEO?</p>
            <Link
              href={`${SITE}/en/#contact`}
              className="mt-4 inline-flex items-center justify-center rounded-lg bg-odart-accent px-8 py-3 font-semibold text-white hover:brightness-110"
            >
              Contact
              <ChevronRight className="ml-1 h-5 w-5" aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    </OdartPublicShell>
  );
}
