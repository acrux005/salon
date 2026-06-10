import { ODART_SITE_URL } from "./odartSite";

const SITE = ODART_SITE_URL.replace(/\/$/, "");
const WP_API = `${SITE}/wp-json/wp/v2`;

export const ODART_WP_REVALIDATE_SECONDS = 3600;

type WpEmbedded = {
  author?: { name?: string }[];
  "wp:featuredmedia"?: { source_url?: string; alt_text?: string }[];
  "wp:term"?: Array<Array<{ taxonomy?: string; name?: string }>>;
};

type WpPostRaw = {
  id: number;
  slug: string;
  date: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  _embedded?: WpEmbedded;
};

export type OdartWpPostListItem = {
  id: number;
  slug: string;
  date: string;
  title: string;
  excerptText: string;
  categoryName: string | null;
  authorName: string | null;
  imageUrl: string | null;
  imageAlt: string | null;
};

export type OdartWpPostFull = OdartWpPostListItem & {
  contentHtml: string;
};

function decodeBasicEntities(s: string): string {
  return s
    .replace(/&nbsp;/g, "\u00a0")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}

export function stripHtmlToText(html: string): string {
  return decodeBasicEntities(html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

/** REST z WP często zwraca surowe shortcode Divi zamiast HTML — w Next nie da się ich sensownie wyświetlić. */
export function isBrokenWpRestContent(html: string): boolean {
  const s = html.trim();
  if (s.length < 12) return false;
  if (/\[(et_pb_|pralnia_|booking\s|woocommerce_|wp_|contact-form)/i.test(s)) return true;
  if (s.startsWith("<p>[") && s.includes("et_pb")) return true;
  return false;
}

function stripScripts(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");
}

function stripTagsFromTitle(html: string): string {
  return decodeBasicEntities(html.replace(/<[^>]+>/g, "").trim());
}

function pickCategory(embedded?: WpEmbedded): string | null {
  const groups = embedded?.["wp:term"];
  if (!groups) return null;
  for (const group of groups) {
    for (const t of group) {
      if (t.taxonomy === "category" && t.name) return t.name;
    }
  }
  return null;
}

function pickAuthor(embedded?: WpEmbedded): string | null {
  const a = embedded?.author?.[0]?.name;
  return a ?? null;
}

function pickImage(embedded?: WpEmbedded): { url: string | null; alt: string | null } {
  const m = embedded?.["wp:featuredmedia"]?.[0];
  if (!m?.source_url) return { url: null, alt: null };
  return { url: m.source_url, alt: m.alt_text || null };
}

function mapListItem(p: WpPostRaw): OdartWpPostListItem {
  const img = pickImage(p._embedded);
  return {
    id: p.id,
    slug: p.slug,
    date: p.date,
    title: stripTagsFromTitle(p.title.rendered),
    excerptText: stripHtmlToText(p.excerpt.rendered),
    categoryName: pickCategory(p._embedded),
    authorName: pickAuthor(p._embedded),
    imageUrl: img.url,
    imageAlt: img.alt,
  };
}

/** Stare permalinki WP (/slug/) → kanoniczne /blog/slug/ w Next. */
function rewriteInternalBlogLinks(html: string, blogSlugs: string[]): string {
  if (!blogSlugs.length) return html;
  const base = SITE.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  let out = html;
  for (const slug of blogSlugs) {
    const s = slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    out = out.replace(new RegExp(`href="${base}/${s}/"`, "gi"), `href="${SITE}/blog/${slug}/"`);
    out = out.replace(new RegExp(`href='${base}/${s}/'`, "gi"), `href='${SITE}/blog/${slug}/'`);
    out = out.replace(new RegExp(`href="https://www\\.odart\\.pl/${s}/"`, "gi"), `href="${SITE}/blog/${slug}/"`);
    out = out.replace(new RegExp(`href='https://www\\.odart\\.pl/${s}/'`, "gi"), `href='${SITE}/blog/${slug}/'`);
  }
  return out;
}

async function fetchPostSlugs(): Promise<string[]> {
  const res = await fetch(`${WP_API}/posts?per_page=100&status=publish&_fields=slug`, {
    next: { revalidate: ODART_WP_REVALIDATE_SECONDS },
    headers: { Accept: "application/json" },
  });
  if (!res.ok) return [];
  const data = (await res.json()) as { slug: string }[];
  return data.map((p) => p.slug);
}

export async function fetchOdartWpPosts(): Promise<OdartWpPostListItem[]> {
  const res = await fetch(`${WP_API}/posts?per_page=100&status=publish&_embed=wp:term,author,wp:featuredmedia`, {
    next: { revalidate: ODART_WP_REVALIDATE_SECONDS },
    headers: { Accept: "application/json" },
  });
  if (!res.ok) return [];
  const data = (await res.json()) as WpPostRaw[];
  return data.map(mapListItem);
}

export async function fetchOdartWpPostBySlug(slug: string): Promise<OdartWpPostFull | null> {
  const [res, blogSlugs] = await Promise.all([
    fetch(`${WP_API}/posts?slug=${encodeURIComponent(slug)}&_embed=wp:term,author,wp:featuredmedia`, {
      next: { revalidate: ODART_WP_REVALIDATE_SECONDS },
      headers: { Accept: "application/json" },
    }),
    fetchPostSlugs(),
  ]);
  if (!res.ok) return null;
  const data = (await res.json()) as WpPostRaw[];
  const p = data[0];
  if (!p) return null;
  const base = mapListItem(p);
  const raw = rewriteInternalBlogLinks(p.content.rendered, blogSlugs);
  const contentHtml = stripScripts(raw);
  return { ...base, contentHtml };
}

type WpPageRaw = WpPostRaw;

export type OdartWpPageFull = {
  slug: string;
  title: string;
  contentHtml: string;
  imageUrl: string | null;
  imageAlt: string | null;
};

type WpProjectRaw = WpPostRaw;

export type OdartWpProjectFull = OdartWpPageFull;

export type OdartWcStoreProduct = {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  short_description: string;
  description: string;
  price_html: string;
  images: { src: string; alt?: string }[];
  prices?: {
    price: string;
    currency_code?: string;
  };
  is_purchasable: boolean;
  is_in_stock: boolean;
};

async function fetchPageSlugs(): Promise<string[]> {
  const res = await fetch(`${WP_API}/pages?per_page=100&status=publish&_fields=slug`, {
    next: { revalidate: ODART_WP_REVALIDATE_SECONDS },
    headers: { Accept: "application/json" },
  });
  if (!res.ok) return [];
  const data = (await res.json()) as { slug: string }[];
  return data.map((p) => p.slug);
}

function mapPageFull(p: WpPageRaw, blogSlugs: string[]): OdartWpPageFull {
  const img = pickImage(p._embedded);
  const raw = rewriteInternalBlogLinks(p.content.rendered, blogSlugs);
  return {
    slug: p.slug,
    title: stripTagsFromTitle(p.title.rendered),
    contentHtml: stripScripts(raw),
    imageUrl: img.url,
    imageAlt: img.alt,
  };
}

export async function fetchOdartWpPageBySlug(slug: string): Promise<OdartWpPageFull | null> {
  const [res, blogSlugs] = await Promise.all([
    fetch(`${WP_API}/pages?slug=${encodeURIComponent(slug)}&_embed=author,wp:featuredmedia`, {
      next: { revalidate: ODART_WP_REVALIDATE_SECONDS },
      headers: { Accept: "application/json" },
    }),
    fetchPostSlugs(),
  ]);
  if (!res.ok) return null;
  const data = (await res.json()) as WpPageRaw[];
  const p = data[0];
  if (!p) return null;
  return mapPageFull(p, blogSlugs);
}

export async function fetchOdartWpProjectBySlug(slug: string): Promise<OdartWpProjectFull | null> {
  const [res, blogSlugs] = await Promise.all([
    fetch(`${WP_API}/project?slug=${encodeURIComponent(slug)}&_embed=author,wp:featuredmedia`, {
      next: { revalidate: ODART_WP_REVALIDATE_SECONDS },
      headers: { Accept: "application/json" },
    }),
    fetchPostSlugs(),
  ]);
  if (!res.ok) return null;
  const data = (await res.json()) as WpProjectRaw[];
  const p = data[0];
  if (!p) return null;
  return mapPageFull(p, blogSlugs);
}

export async function fetchOdartWcStoreProductBySlug(slug: string): Promise<OdartWcStoreProduct | null> {
  const res = await fetch(`${SITE}/wp-json/wc/store/products?slug=${encodeURIComponent(slug)}`, {
    next: { revalidate: ODART_WP_REVALIDATE_SECONDS },
    headers: { Accept: "application/json" },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as OdartWcStoreProduct[];
  return data[0] ?? null;
}

/** Slugi stron WP (do statycznego generowania / diagnostyki). */
export async function fetchOdartWpPageSlugs(): Promise<string[]> {
  return fetchPageSlugs();
}
