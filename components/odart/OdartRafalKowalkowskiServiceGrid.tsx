"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ODART_SITE_URL } from "@/lib/odartSite";

const SITE = ODART_SITE_URL;

export type RafalService = {
  id: string;
  title: string;
  category: string;
  categorySlug: string;
  price: string;
  image: { src: string; w: number; h: number };
  /** Wewnętrzna podstrona ODART (np. pełny opis zamiast samego kontaktu). */
  detailHref?: string;
};

const FILTERS: { slug: string; label: string }[] = [
  { slug: "*", label: "Wszystko" },
  { slug: "lekcje", label: "Lekcje" },
  { slug: "foto", label: "Sesje fotograficzne" },
  { slug: "nagrania", label: "Nagrania" },
  { slug: "strony", label: "Strony internetowe" },
  { slug: "media", label: "Media społecznościowe" },
  { slug: "informatyka", label: "Informatyka" },
];

type Props = { items: RafalService[]; /** Filtr z URL legacy (np. product-category/informatyka). */ initialCategory?: string };

export function OdartRafalKowalkowskiServiceGrid({ items, initialCategory }: Props) {
  const searchParams = useSearchParams();
  const [active, setActive] = useState(
    initialCategory && FILTERS.some((f) => f.slug === initialCategory) ? initialCategory : "*",
  );

  useEffect(() => {
    const kategoria = searchParams.get("kategoria") ?? initialCategory;
    if (kategoria && FILTERS.some((f) => f.slug === kategoria)) {
      setActive(kategoria);
    }
  }, [searchParams, initialCategory]);

  const filtered = useMemo(() => {
    if (active === "*") return items;
    return items.filter((i) => i.categorySlug === active);
  }, [active, items]);

  return (
    <div>
      <div className="mb-10 flex flex-wrap justify-center gap-2 sm:gap-3">
        {FILTERS.map((f) => {
          const on = active === f.slug;
          return (
            <button
              key={f.slug}
              type="button"
              onClick={() => setActive(f.slug)}
              className={`relative pb-3 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition sm:text-sm ${
                on
                  ? "border-odart-accent bg-white/[0.06] text-white"
                  : "border-white/10 text-neutral-400 hover:border-white/25 hover:text-white"
              }`}
            >
              {f.label}
              {on ? (
                <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-odart-accent" />
              ) : null}
            </button>
          );
        })}
      </div>
      <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {filtered.map((p) => {
          const detail = p.detailHref;
          const primaryHref = detail ?? `${SITE}/kontakt/`;
          return (
            <li key={p.id}>
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition hover:border-odart-accent/40 hover:shadow-[0_0_0_1px_rgba(217,91,58,0.15)]">
                <Link href={primaryHref} className="relative block aspect-square overflow-hidden bg-neutral-900">
                  <Image
                    src={p.image.src}
                    alt=""
                    width={p.image.w}
                    height={p.image.h}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 transition group-hover:opacity-100" />
                </Link>
                <div className="flex flex-1 flex-col p-4">
                  <p className="text-xs uppercase tracking-wide text-neutral-500">{p.category}</p>
                  <h3 className="mt-1 text-base font-semibold text-white">
                    <Link href={primaryHref} className="hover:text-odart-accent">
                      {p.title}
                    </Link>
                  </h3>
                  <p className="mt-3 text-lg font-semibold text-odart-accent">{p.price}</p>
                  {detail ? (
                    <div className="mt-4 flex flex-col gap-2">
                      <Link
                        href={detail}
                        className="inline-flex w-full items-center justify-center rounded-xl bg-odart-accent py-2.5 text-sm font-semibold text-white shadow-md shadow-orange-950/25 transition hover:brightness-110"
                      >
                        Szczegóły usługi
                      </Link>
                      <Link
                        href={`${SITE}/kontakt/`}
                        className="inline-flex w-full items-center justify-center rounded-xl border border-white/15 py-2.5 text-sm font-medium text-white transition hover:border-odart-accent hover:bg-odart-accent/10"
                      >
                        Zapytaj o termin
                      </Link>
                    </div>
                  ) : (
                    <Link
                      href={`${SITE}/kontakt/`}
                      className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-white/15 py-2.5 text-sm font-medium text-white transition hover:border-odart-accent hover:bg-odart-accent/10"
                    >
                      Zapytaj o termin
                    </Link>
                  )}
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
