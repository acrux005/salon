import { Suspense } from "react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { isRafalKowalkowskiPlHost } from "@/lib/odartSite";
import { OdartRafalKowalkowskiUslugiPage } from "@/components/odart/OdartRafalKowalkowskiUslugiPage";
import { rafalPublicPathCanonicalUrl } from "@/lib/rafalKowalkowskiLegacyRoutes";
import {
  fetchWcProducts,
  fetchWcCategories,
  wcPriceToNumber,
  fetchWcAttributeFacets,
} from "@/lib/wcStoreApi";
import { sortUrlParamToSortKey, sortKeyToWcOrder } from "@/lib/shopSortParams";
import {
  mergeAttributeFiltersForApi,
  parseAttrSearchParams,
  parseCategoryIdsParam,
} from "@/lib/shopFiltersUrl";
import { ShopPage } from "@/components/odart/shop/ShopPage";

export async function generateMetadata(): Promise<Metadata> {
  const hdr = await headers();
  const host = hdr.get("host") ?? "";
  if (isRafalKowalkowskiPlHost(host)) {
    const proto = hdr.get("x-forwarded-proto") ?? "https";
    const canonical = rafalPublicPathCanonicalUrl("/sklep", host, proto);
    return {
      title: { absolute: "Sklep — Rafał Kowalkowski | ODART" },
      description: "Katalog usług: fotografia, nagrania, strony WWW i informatyka — Rafał Kowalkowski.",
      alternates: { canonical },
      openGraph: { title: "Sklep | Rafał Kowalkowski", url: canonical, locale: "pl_PL", type: "website" },
    };
  }
  return {
    title: "Sklep | ODART",
    description: "Przeglądaj wszystkie produkty. Filtry według kategorii, ceny i popularności.",
  };
}

export const revalidate = 300;

export default async function SklepPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const host = (await headers()).get("host") ?? "";
  if (isRafalKowalkowskiPlHost(host)) {
    return <OdartRafalKowalkowskiUslugiPage />;
  }

  const catIds = parseCategoryIdsParam(searchParams.cat);
  const category = catIds.length ? catIds.join(",") : undefined;

  const min  = parseInt(String(searchParams.min  ?? ""), 10);
  const max  = parseInt(String(searchParams.max  ?? ""), 10);
  const minP = !isNaN(min) && min > 0 ? min : undefined;
  const maxP = !isNaN(max) && max > 0 ? max : undefined;

  const sortKey = sortUrlParamToSortKey(String(searchParams.sort ?? ""));
  const q    = String(searchParams.q ?? "") || undefined;
  const page = parseInt(String(searchParams.page ?? "1"), 10) || 1;

  const { orderby, order } = sortKeyToWcOrder(sortKey);

  const attrRows = mergeAttributeFiltersForApi(parseAttrSearchParams(searchParams));

  const [{ products, total, totalPages }, categories, attributeFacets] = await Promise.all([
    fetchWcProducts({
      page,
      per_page: 12,
      category,
      category_operator: catIds.length > 1 ? "in" : undefined,
      min_price: minP,
      max_price: maxP,
      orderby,
      order,
      search: q,
      attributes: attrRows.length ? attrRows : undefined,
      attribute_relation: attrRows.length > 1 ? "and" : undefined,
    }),
    fetchWcCategories(),
    fetchWcAttributeFacets(),
  ]);

  let maxPriceHint = 5000;
  if (products.length > 0) {
    const top = products.reduce((mx, p) => {
      const v = wcPriceToNumber(p.prices.regular_price || p.prices.price, p.prices.currency_minor_unit);
      return v > mx ? v : mx;
    }, 0);
    if (top > 0) maxPriceHint = Math.ceil(top / 500) * 500 + 500;
  }

  return (
    <Suspense fallback={<SklepSkeleton />}>
      <ShopPage
        initialProducts={products}
        initialTotal={total}
        initialTotalPages={totalPages}
        categories={categories}
        attributeFacets={attributeFacets}
        maxPriceHint={maxPriceHint}
        baseProductHref="/produkt"
      />
    </Suspense>
  );
}

function SklepSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="h-8 w-32 rounded-lg bg-gray-200 animate-pulse"/>
          <div className="mt-2 h-4 w-48 rounded bg-gray-100 animate-pulse"/>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex gap-8">
          <div className="hidden w-72 shrink-0 md:block">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="mb-4 h-32 rounded-xl bg-white shadow-sm animate-pulse"/>
            ))}
          </div>
          <div className="flex-1 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-white shadow-sm animate-pulse">
                <div className="aspect-square bg-gray-100 rounded-t-2xl"/>
                <div className="p-4 space-y-2">
                  <div className="h-3 w-2/3 rounded bg-gray-100"/>
                  <div className="h-4 rounded bg-gray-200"/>
                  <div className="h-4 w-1/2 rounded bg-gray-100"/>
                  <div className="h-8 rounded-lg bg-gray-100"/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
