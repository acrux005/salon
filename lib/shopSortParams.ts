/**
 * Sortowanie sklepu: wewnętrzny klucz (WooCommerce) vs publiczny parametr URL.
 * W URL używamy konwencji jak Medusa (app.odart.pl): latest-desc, price-asc, …
 * Stare linki (?sort=date_desc) nadal działają.
 */
import type { WcProductsParams } from "./wcStoreApi";

export type SortKey =
  | "date_desc"
  | "date_asc"
  | "price_asc"
  | "price_desc"
  | "popularity"
  | "rating";

const URL_PARAM_TO_SORT: Record<string, SortKey> = {
  /* Medusa-style (kebab-case) */
  "latest-desc": "date_desc",
  "latest-asc": "date_asc",
  "price-asc": "price_asc",
  "price-desc": "price_desc",
  popularity: "popularity",
  rating: "rating",
  /* legacy (underscore) */
  date_desc: "date_desc",
  date_asc: "date_asc",
  price_asc: "price_asc",
  price_desc: "price_desc",
};

export function sortUrlParamToSortKey(param: string | null | undefined): SortKey {
  const p = String(param ?? "").trim();
  if (!p) return "date_desc";
  return URL_PARAM_TO_SORT[p] ?? "date_desc";
}

export function sortKeyToUrlParam(key: SortKey): string {
  switch (key) {
    case "date_desc":
      return "latest-desc";
    case "date_asc":
      return "latest-asc";
    case "price_asc":
      return "price-asc";
    case "price_desc":
      return "price-desc";
    case "popularity":
      return "popularity";
    case "rating":
      return "rating";
  }
}

type WcSortOrder = {
  orderby: NonNullable<WcProductsParams["orderby"]>;
  order: NonNullable<WcProductsParams["order"]>;
};

export function sortKeyToWcOrder(key: SortKey): WcSortOrder {
  switch (key) {
    case "date_asc":
      return { orderby: "date", order: "asc" };
    case "price_asc":
      return { orderby: "price", order: "asc" };
    case "price_desc":
      return { orderby: "price", order: "desc" };
    case "popularity":
      return { orderby: "popularity", order: "desc" };
    case "rating":
      return { orderby: "rating", order: "desc" };
    default:
      return { orderby: "date", order: "desc" };
  }
}
