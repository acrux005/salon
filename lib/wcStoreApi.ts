/**
 * WooCommerce Store API v1 helper
 * Docs: /wp-json/wc/store/v1/
 */
import { ODART_SITE_URL } from "./odartSite";

const BASE = ODART_SITE_URL.replace(/\/$/, "") + "/wp-json/wc/store/v1";
const REVALIDATE = 300; // 5 min

/** PLN — grosze (Store API wymaga najmniejszej jednostki waluty). */
const DEFAULT_CURRENCY_MINOR_UNIT = 2;

export function priceMajorToMinorUnits(amountZl: number, minorUnit = DEFAULT_CURRENCY_MINOR_UNIT): number {
  return Math.round(amountZl * Math.pow(10, minorUnit));
}

/* ── Types ─────────────────────────────────────────────────── */

export type WcPrice = {
  price: string;          // minor units (grosze)
  regular_price: string;
  sale_price: string;
  price_range: null | { min_amount: string; max_amount: string };
  currency_code: string;
  currency_symbol: string;
  currency_minor_unit: number;
};

export type WcImage = { id: number; src: string; thumbnail: string; alt: string };

export type WcCategory = { id: number; name: string; slug: string; count?: number };

/** Globalne atrybuty produktów (Store API). */
export type WcStoreAttribute = {
  id: number;
  name: string;
  taxonomy: string;
  type: string;
  order?: string;
  has_archives?: boolean;
};

export type WcStoreAttributeTerm = {
  id: number;
  name: string;
  slug: string;
  count?: number;
};

export type WcAttributeFacet = WcStoreAttribute & { terms: WcStoreAttributeTerm[] };

export type WcProductAttribute = {
  id: number;
  name: string;
  options: string[];
};

export type WcProduct = {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  description: string;
  short_description: string;
  on_sale: boolean;
  is_purchasable: boolean;
  is_in_stock: boolean;
  average_rating: string;
  review_count: number;
  images: WcImage[];
  prices: WcPrice;
  categories: WcCategory[];
  attributes: WcProductAttribute[];
};

export type WcProductsResponse = {
  products: WcProduct[];
  total: number;
  totalPages: number;
};

export type WcAttributeFilter = { attribute: string; slug: string };

export type WcProductsParams = {
  page?: number;
  per_page?: number;
  /** ID kategorii lub kilka po przecinku (np. "12,34") */
  category?: number | string;
  /** min/max w zł (major); konwersja do groszy w fetchWcProducts */
  min_price?: number;
  max_price?: number;
  orderby?: "popularity" | "date" | "price" | "rating" | "menu_order";
  order?: "asc" | "desc";
  search?: string;
  on_sale?: boolean;
  featured?: boolean;
  /** @deprecated użyj attributes */
  attribute?: string;
  attribute_term?: string;
  /** Filtry atrybutów — slug może zawierać wiele wartości po przecinku (OR w obrębie taksonomii). */
  attributes?: WcAttributeFilter[];
  attribute_relation?: "and" | "or";
  category_operator?: "in" | "and" | "not_in";
};

/* ── Price formatting ────────────────────────────────────────── */

export function formatWcPrice(minor: string, currency: WcPrice): string {
  const val = parseInt(minor, 10) / Math.pow(10, currency.currency_minor_unit);
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: currency.currency_code || "PLN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(val);
}

export function wcPriceToNumber(minor: string, decimals: number): number {
  return parseInt(minor, 10) / Math.pow(10, decimals);
}

/* ── API calls ───────────────────────────────────────────────── */

export async function fetchWcProducts(
  params: WcProductsParams = {}
): Promise<WcProductsResponse> {
  const qs = new URLSearchParams();
  qs.set("page", String(params.page ?? 1));
  qs.set("per_page", String(params.per_page ?? 12));
  if (params.category) qs.set("category", String(params.category));
  if (params.category_operator) qs.set("category_operator", params.category_operator);
  if (params.min_price != null && params.min_price > 0) {
    qs.set("min_price", String(priceMajorToMinorUnits(params.min_price)));
  }
  if (params.max_price != null && params.max_price > 0) {
    qs.set("max_price", String(priceMajorToMinorUnits(params.max_price)));
  }
  if (params.orderby) qs.set("orderby", params.orderby);
  if (params.order) qs.set("order", params.order);
  if (params.search) qs.set("search", params.search);
  if (params.on_sale) qs.set("on_sale", "1");
  if (params.attribute) qs.set("attribute", params.attribute);
  if (params.attribute_term) qs.set("attribute_term", params.attribute_term);
  if (params.attributes?.length) {
    params.attributes.forEach((a, i) => {
      qs.set(`attributes[${i}][attribute]`, a.attribute);
      qs.set(`attributes[${i}][slug]`, a.slug);
    });
  }
  if (params.attribute_relation) qs.set("attribute_relation", params.attribute_relation);

  const res = await fetch(`${BASE}/products?${qs}`, {
    next: { revalidate: REVALIDATE },
    headers: { Accept: "application/json" },
  });

  if (!res.ok) return { products: [], total: 0, totalPages: 0 };

  const total     = parseInt(res.headers.get("x-wp-total") ?? "0", 10);
  const totalPages = parseInt(res.headers.get("x-wp-totalpages") ?? "1", 10);
  const products  = (await res.json()) as WcProduct[];

  return { products, total, totalPages };
}

export async function fetchWcCategories(): Promise<WcCategory[]> {
  const res = await fetch(`${BASE}/products/categories?per_page=100`, {
    next: { revalidate: REVALIDATE * 12 },
    headers: { Accept: "application/json" },
  });
  if (!res.ok) return [];
  const data = (await res.json()) as WcCategory[];
  // exclude hidden root "Uncategorized"
  return data.filter((c) => c.slug !== "uncategorized");
}

export async function fetchWcStoreProductAttributes(): Promise<WcStoreAttribute[]> {
  const res = await fetch(`${BASE}/products/attributes?per_page=100`, {
    next: { revalidate: REVALIDATE * 12 },
    headers: { Accept: "application/json" },
  });
  if (!res.ok) return [];
  return (await res.json()) as WcStoreAttribute[];
}

export async function fetchWcStoreAttributeTerms(attributeId: number): Promise<WcStoreAttributeTerm[]> {
  const res = await fetch(`${BASE}/products/attributes/${attributeId}/terms?per_page=100&orderby=count`, {
    next: { revalidate: REVALIDATE * 12 },
    headers: { Accept: "application/json" },
  });
  if (!res.ok) return [];
  return (await res.json()) as WcStoreAttributeTerm[];
}

/** Atrybuty z listą wartości (tylko z count > 0 jeśli count jest w odpowiedzi). */
export async function fetchWcAttributeFacets(): Promise<WcAttributeFacet[]> {
  const attrs = await fetchWcStoreProductAttributes();
  if (!attrs.length) return [];

  const withTerms = await Promise.all(
    attrs.map(async (a) => {
      const terms = await fetchWcStoreAttributeTerms(a.id);
      const filtered = terms.filter((t) => t.count == null || t.count > 0);
      return { ...a, terms: filtered };
    })
  );

  return withTerms.filter((x) => x.terms.length > 0);
}

export async function fetchWcProductById(id: number): Promise<WcProduct | null> {
  const res = await fetch(`${BASE}/products/${id}`, {
    next: { revalidate: REVALIDATE },
    headers: { Accept: "application/json" },
  });
  if (!res.ok) return null;
  return (await res.json()) as WcProduct;
}
