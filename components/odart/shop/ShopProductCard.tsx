"use client";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Star } from "lucide-react";
import type { WcProduct } from "@/lib/wcStoreApi";
import { formatWcPrice } from "@/lib/wcStoreApi";

type Props = {
  product: WcProduct;
  baseHref?: string;
};

export function ShopProductCard({ product, baseHref = "/produkt" }: Props) {
  const img = product.images?.[0];
  const p   = product.prices;
  const hasSale = product.on_sale && p.sale_price && p.sale_price !== p.regular_price;
  const displayPrice   = hasSale ? p.sale_price : p.price;
  const originalPrice  = hasSale ? p.regular_price : null;
  const rating = parseFloat(product.average_rating);

  return (
    <Link
      href={`${baseHref}/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition-shadow hover:shadow-md"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        {img?.src ? (
          <Image
            src={img.src}
            alt={img.alt || product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-300">
            <ShoppingCart className="h-12 w-12" />
          </div>
        )}
        {hasSale && (
          <span className="absolute left-3 top-3 rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-semibold text-white">
            Promocja
          </span>
        )}
        {!product.is_in_stock && (
          <span className="absolute right-3 top-3 rounded-full bg-gray-500 px-2.5 py-0.5 text-xs font-semibold text-white">
            Niedostępny
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-4">
        {product.categories?.[0] && (
          <span className="mb-1 text-xs font-medium uppercase tracking-wider text-blue-500">
            {product.categories[0].name}
          </span>
        )}
        <h3 className="line-clamp-2 text-sm font-semibold text-gray-800 group-hover:text-blue-600">
          {product.name}
        </h3>

        {/* Rating */}
        {rating > 0 && (
          <div className="mt-1.5 flex items-center gap-1">
            {[1,2,3,4,5].map((i) => (
              <Star key={i} className={`h-3.5 w-3.5 ${i <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`}/>
            ))}
            <span className="text-xs text-gray-400">({product.review_count})</span>
          </div>
        )}

        {/* Price */}
        <div className="mt-auto pt-3 flex items-center gap-2">
          <span className="text-base font-bold text-gray-900">
            {formatWcPrice(displayPrice, p)}
          </span>
          {originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              {formatWcPrice(originalPrice, p)}
            </span>
          )}
        </div>

        {/* CTA */}
        <button
          type="button"
          onClick={(e) => e.preventDefault()}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!product.is_in_stock}
        >
          <ShoppingCart className="h-4 w-4" />
          {product.is_in_stock ? "Do koszyka" : "Niedostępny"}
        </button>
      </div>
    </Link>
  );
}
