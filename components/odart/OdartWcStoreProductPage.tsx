import Link from "next/link";
import Image from "next/image";
import { ODART_SITE_URL } from "@/lib/odartSite";
import { stripHtmlToText } from "@/lib/odartWordpress";
import { OdartPublicShell } from "@/components/odart/OdartPublicShell";
import type { OdartWcStoreProduct } from "@/lib/odartWordpress";

const SITE = ODART_SITE_URL.replace(/\/$/, "");

type Props = {
  product: OdartWcStoreProduct;
};

export function OdartWcStoreProductPage({ product }: Props) {
  const canonical = product.permalink.replace(/\/$/, "") + "/";
  const img = product.images?.[0];
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: product.name,
        url: canonical,
        description: stripHtmlToText(product.short_description || product.description || ""),
        offers: product.prices?.price
          ? {
              "@type": "Offer",
              priceCurrency: product.prices.currency_code || "PLN",
              price: product.prices.price,
            }
          : undefined,
      },
    ],
  };

  const addToCartUrl = `${SITE}/cart/?add-to-cart=${product.id}`;
  const showCartCta = product.is_purchasable && product.is_in_stock;

  return (
    <OdartPublicShell jsonLd={jsonLd}>
      <article className="px-4 py-12 lg:px-6 lg:py-16">
        <div className="mx-auto max-w-3xl">
          <Link href={`${SITE}/uslugi/`} className="text-sm font-medium text-odart-accent hover:text-orange-300">
            ← Usługi
          </Link>

          <header className="mt-8 border-b border-white/10 pb-8">
            <p className="text-sm font-medium uppercase tracking-wide text-odart-accent">Produkt / usługa</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">{product.name}</h1>
            {product.price_html ? (
              <div
                className="mt-4 text-xl text-neutral-300 [&_span]:text-white"
                dangerouslySetInnerHTML={{ __html: product.price_html }}
              />
            ) : null}
          </header>

          {img?.src ? (
            <div className="relative mt-10 aspect-[21/9] w-full overflow-hidden rounded-2xl border border-white/10 bg-neutral-900">
              <Image
                src={img.src}
                alt={img.alt || product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
          ) : null}

          {product.short_description ? (
            <div
              className="prose prose-invert prose-lg mt-10 max-w-none prose-p:text-neutral-300"
              dangerouslySetInnerHTML={{ __html: product.short_description }}
            />
          ) : null}

          {product.description ? (
            <div
              className="prose prose-invert prose-lg mt-8 max-w-none prose-headings:text-white prose-p:text-neutral-300 prose-a:text-odart-accent"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          ) : null}

          <div className="mt-12 flex flex-wrap gap-4">
            {showCartCta ? (
              <a
                href={addToCartUrl}
                className="inline-flex items-center justify-center rounded-lg bg-odart-accent px-8 py-3 font-semibold text-white hover:brightness-110"
              >
                Dodaj do koszyka
              </a>
            ) : (
              <Link
                href={`${SITE}/kontakt/`}
                className="inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/[0.06] px-8 py-3 font-semibold text-white hover:bg-white/10"
              >
                Zapytaj o wycenę
              </Link>
            )}
            <Link href={`${SITE}/kontakt/`} className="inline-flex items-center text-sm text-odart-accent hover:text-orange-300">
              Kontakt
            </Link>
          </div>
        </div>
      </article>
    </OdartPublicShell>
  );
}
