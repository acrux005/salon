import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { isOdartMainHost, ODART_SITE_URL } from "@/lib/odartSite";
import {
  ODART_WP_REVALIDATE_SECONDS,
  fetchOdartWpPostBySlug,
  fetchOdartWpPosts,
} from "@/lib/odartWordpress";
import { getEnglishBlogPost } from "@/lib/odartBlogEnglish";
import { OdartBlogPostPage } from "@/components/odart/OdartBlogPostPage";

const ODART_SITE = ODART_SITE_URL.replace(/\/$/, "");

export const revalidate = ODART_WP_REVALIDATE_SECONDS;

type Props = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const posts = await fetchOdartWpPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const host = (await headers()).get("host") ?? "";
  if (!isOdartMainHost(host)) {
    return { title: "404" };
  }
  const post = await fetchOdartWpPostBySlug(params.slug);
  if (!post) {
    return { title: "404" };
  }
  const canonical = `${ODART_SITE}/blog/${params.slug}/`;
  const englishPost = getEnglishBlogPost(params.slug);
  const title = englishPost?.title ?? post.title;
  const sourceDescription = englishPost?.excerpt ?? post.excerptText;
  const description =
    sourceDescription.length > 160 ? `${sourceDescription.slice(0, 157)}...` : sourceDescription;
  return {
    title: `${title} | ODART Blog`,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      locale: "en_US",
      type: "article",
      siteName: "ODART",
    },
  };
}

export default async function BlogPostRoute({ params }: Props) {
  const host = (await headers()).get("host") ?? "";
  if (!isOdartMainHost(host)) {
    notFound();
  }
  const post = await fetchOdartWpPostBySlug(params.slug);
  if (!post) {
    notFound();
  }
  return <OdartBlogPostPage post={post} />;
}
