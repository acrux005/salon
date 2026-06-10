"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ODART_PORTFOLIO_URL } from "@/lib/odartSite";
import { useMemo, useState } from "react";

export type OpiekaPortfolioItem = {
  cat: string;
  title: string;
  href: string;
  thumb: string;
};

const FILTERS = ["Wszystkie", "Deweloper", "Aplikacje", "Kancelaria", "Gabinet", "Sklep"] as const;

export function OdartOpiekaPortfolioGrid({ items }: { items: OpiekaPortfolioItem[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("Wszystkie");

  const visible = useMemo(() => {
    if (filter === "Wszystkie") return items;
    return items.filter((x) => x.cat === filter);
  }, [filter, items]);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Portfolio</h2>
          <p className="mt-2 text-neutral-400">Wybrane realizacje</p>
        </div>
        <Link href={ODART_PORTFOLIO_URL} className="text-sm font-semibold text-odart-accent hover:text-orange-300">
          Wszystkie realizacje →
        </Link>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              filter === f
                ? "border-odart-accent bg-odart-accent/15 text-white"
                : "border-white/15 text-neutral-400 hover:border-white/30 hover:text-white"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="group overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] transition hover:border-odart-accent/30"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-900">
              <Image
                src={item.thumb}
                alt=""
                fill
                className="object-cover transition duration-300 group-hover:scale-[1.03]"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
            <div className="p-5">
              <span className="text-xs font-medium uppercase tracking-wide text-odart-accent/90">{item.cat}</span>
              <h3 className="mt-2 text-lg font-semibold text-white group-hover:text-orange-200">{item.title}</h3>
              <span className="mt-3 inline-flex items-center text-sm text-neutral-500 group-hover:text-odart-accent">
                Zobacz <ChevronRight className="ml-1 h-4 w-4" aria-hidden />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
