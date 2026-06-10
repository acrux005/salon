"use client";

import { useState, useCallback, useTransition, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { SlidersHorizontal, LayoutGrid, List, ChevronDown, X, Search } from "lucide-react";
import type { WcProduct, WcCategory, WcAttributeFacet } from "@/lib/wcStoreApi";
import { formatWcPrice, priceMajorToMinorUnits } from "@/lib/wcStoreApi";
import type { SortKey } from "@/lib/shopSortParams";
import { sortUrlParamToSortKey, sortKeyToUrlParam, sortKeyToWcOrder } from "@/lib/shopSortParams";
import {
  parseCategoryIdsParam,
  mergeAttributeFiltersForApi,
  parseAttrFromUrlSearchParams,
  attrFiltersToRecord,
  flattenAttrRecordToFilters,
} from "@/lib/shopFiltersUrl";
import { ShopProductCard } from "./ShopProductCard";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "date_desc",   label: "Najnowsze" },
  { value: "date_asc",    label: "Najstarsze" },
  { value: "price_asc",   label: "Cena: rosnąco" },
  { value: "price_desc",  label: "Cena: malejąco" },
  { value: "popularity",  label: "Popularność" },
  { value: "rating",      label: "Ocena" },
];

type Props = {
  initialProducts: WcProduct[];
  initialTotal: number;
  initialTotalPages: number;
  categories: WcCategory[];
  attributeFacets?: WcAttributeFacet[];
  maxPriceHint?: number;
  baseProductHref?: string;
};

const PER_PAGE = 12;

function isColorLikeAttribute(name: string, taxonomy: string): boolean {
  const s = `${name} ${taxonomy}`.toLowerCase();
  return (
    s.includes("kolor") || s.includes("color") || s.includes("colour") || s.includes("barw")
  );
}

function colorHexForTermSlug(slug: string): string | null {
  const s = slug.toLowerCase();
  const pairs: [string, string][] = [
    ["black", "#111827"], ["czarn", "#111827"], ["bial", "#f3f4f6"], ["white", "#f3f4f6"],
    ["red", "#dc2626"], ["czerw", "#dc2626"], ["blue", "#2563eb"], ["niebies", "#2563eb"],
    ["green", "#16a34a"], ["zielon", "#16a34a"], ["yellow", "#ca8a04"], ["zolt", "#ca8a04"],
    ["gold", "#d4af37"], ["zlot", "#d4af37"], ["silver", "#94a3b8"], ["srebr", "#94a3b8"],
    ["gray", "#6b7280"], ["szar", "#6b7280"], ["pink", "#db2777"], ["roz", "#db2777"],
    ["orange", "#ea580c"], ["pomar", "#ea580c"], ["brown", "#78350f"], ["braz", "#78350f"],
    ["purple", "#7c3aed"], ["fiolet", "#7c3aed"], ["beige", "#d6c4a8"], ["bez", "#d6c4a8"],
  ];
  for (const [needle, hex] of pairs) {
    if (s.includes(needle)) return hex;
  }
  return null;
}

/* ── Price: suwak + pola min/max (zł) ── */
function PriceRangeFilter({
  min,
  max,
  value,
  onChange,
}: {
  min: number;
  max: number;
  value: [number, number];
  onChange: (v: [number, number]) => void;
}) {
  const [local, setLocal] = useState<[number, number]>(value);

  useEffect(() => {
    setLocal(value);
  }, [value[0], value[1]]);

  const pct = (v: number) => ((v - min) / (max - min || 1)) * 100;
  const step = Math.max(1, Math.round((max - min) / 200) || 1);

  const commit = (v: [number, number]) => {
    const lo = Math.max(min, Math.min(v[0], v[1] - step));
    const hi = Math.min(max, Math.max(v[1], lo + step));
    onChange([lo, hi]);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm font-medium text-gray-600">
        <span>{local[0]} zł</span>
        <span>{local[1]} zł</span>
      </div>
      <div className="relative h-5">
        <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 rounded bg-gray-200" />
        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded bg-blue-500"
          style={{ left: `${pct(local[0])}%`, right: `${100 - pct(local[1])}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={local[0]}
          className="pointer-events-none absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:shadow"
          onChange={(e) => {
            const v = Math.min(Number(e.target.value), local[1] - step);
            setLocal([v, local[1]]);
          }}
          onMouseUp={() => commit(local)}
          onTouchEnd={() => commit(local)}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={local[1]}
          className="pointer-events-none absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:shadow"
          onChange={(e) => {
            const v = Math.max(Number(e.target.value), local[0] + step);
            setLocal([local[0], v]);
          }}
          onMouseUp={() => commit(local)}
          onTouchEnd={() => commit(local)}
        />
      </div>
      <div className="flex gap-2">
        <label className="flex flex-1 items-center gap-1 rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm">
          <span className="text-gray-400">zł</span>
          <input
            type="number"
            min={min}
            max={local[1] - step}
            value={local[0]}
            className="w-full min-w-0 border-0 bg-transparent p-0 text-gray-900 outline-none"
            onChange={(e) => {
              const v = Math.max(min, Math.min(Number(e.target.value) || 0, local[1] - step));
              setLocal([v, local[1]]);
            }}
            onBlur={() => commit(local)}
            onKeyDown={(e) => e.key === "Enter" && commit(local)}
          />
        </label>
        <label className="flex flex-1 items-center gap-1 rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm">
          <span className="text-gray-400">zł</span>
          <input
            type="number"
            min={local[0] + step}
            max={max}
            value={local[1]}
            className="w-full min-w-0 border-0 bg-transparent p-0 text-gray-900 outline-none"
            onChange={(e) => {
              const v = Math.min(max, Math.max(Number(e.target.value) || 0, local[0] + step));
              setLocal([local[0], v]);
            }}
            onBlur={() => commit(local)}
            onKeyDown={(e) => e.key === "Enter" && commit(local)}
          />
        </label>
      </div>
    </div>
  );
}

function SidebarSection({ title, children, defaultOpen = true }: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 py-4 last:border-b-0">
      <button
        type="button"
        className="flex w-full items-center justify-between text-sm font-semibold text-gray-800"
        onClick={() => setOpen((v) => !v)}
      >
        {title}
        <ChevronDown className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

export function ShopPage({
  initialProducts,
  initialTotal,
  initialTotalPages,
  categories,
  attributeFacets = [],
  maxPriceHint = 5000,
  baseProductHref = "/produkt",
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>(() =>
    parseCategoryIdsParam(searchParams.get("cat") ?? undefined)
  );
  const [attrSelection, setAttrSelection] = useState<Record<string, string[]>>(() =>
    attrFiltersToRecord(parseAttrFromUrlSearchParams(searchParams))
  );
  const [sort, setSort] = useState<SortKey>(() => sortUrlParamToSortKey(searchParams.get("sort")));
  const [priceRange, setPriceRange] = useState<[number, number]>([
    parseInt(searchParams.get("min") ?? "0", 10) || 0,
    parseInt(searchParams.get("max") ?? String(maxPriceHint), 10) || maxPriceHint,
  ]);
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [page, setPage] = useState(parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [products, setProducts] = useState<WcProduct[]>(initialProducts);
  const [total, setTotal] = useState(initialTotal);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [loading, setLoading] = useState(false);

  const fetchProducts = useCallback(
    async (params: {
      catIds?: number[];
      sort?: SortKey;
      min?: number;
      max?: number;
      q?: string;
      p?: number;
      attrs?: Record<string, string[]>;
    }) => {
      setLoading(true);
      const catIds = params.catIds ?? selectedCategoryIds;
      const s = params.sort ?? sort;
      const min = params.min ?? priceRange[0];
      const max = params.max ?? priceRange[1];
      const q = params.q ?? search;
      const p = params.p ?? 1;
      const attrs = params.attrs ?? attrSelection;

      const qs = new URLSearchParams();
      qs.set("per_page", String(PER_PAGE));
      qs.set("page", String(p));
      if (catIds.length) {
        qs.set("category", catIds.join(","));
        if (catIds.length > 1) qs.set("category_operator", "in");
      }
      const merged = mergeAttributeFiltersForApi(flattenAttrRecordToFilters(attrs));
      merged.forEach((a, i) => {
        qs.set(`attributes[${i}][attribute]`, a.attribute);
        qs.set(`attributes[${i}][slug]`, a.slug);
      });
      if (merged.length > 1) qs.set("attribute_relation", "and");

      if (min > 0) qs.set("min_price", String(priceMajorToMinorUnits(min)));
      if (max < maxPriceHint) qs.set("max_price", String(priceMajorToMinorUnits(max)));
      if (q) qs.set("search", q);
      const { orderby, order } = sortKeyToWcOrder(s);
      qs.set("orderby", orderby);
      qs.set("order", order);

      try {
        const res = await fetch(`/api/sklep/produkty?${qs}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products ?? []);
          setTotal(data.total ?? 0);
          setTotalPages(data.totalPages ?? 1);
        }
      } catch {}
      setLoading(false);
    },
    [selectedCategoryIds, sort, priceRange, search, maxPriceHint, attrSelection]
  );

  const applyFilters = useCallback(
    (overrides: Partial<{
      catIds: number[];
      sort: SortKey;
      min: number;
      max: number;
      q: string;
      p: number;
      attrs: Record<string, string[]>;
    }> = {}) => {
      const catIds = overrides.catIds !== undefined ? overrides.catIds : selectedCategoryIds;
      const s = overrides.sort !== undefined ? overrides.sort : sort;
      const min = overrides.min !== undefined ? overrides.min : priceRange[0];
      const max = overrides.max !== undefined ? overrides.max : priceRange[1];
      const q = overrides.q !== undefined ? overrides.q : search;
      const p = overrides.p !== undefined ? overrides.p : 1;
      const attrs = overrides.attrs !== undefined ? overrides.attrs : attrSelection;

      const params = new URLSearchParams();
      if (catIds.length) params.set("cat", catIds.join(","));
      if (s !== "date_desc") params.set("sort", sortKeyToUrlParam(s));
      if (min > 0) params.set("min", String(min));
      if (max < maxPriceHint) params.set("max", String(max));
      if (q) params.set("q", q);
      if (p > 1) params.set("page", String(p));
      const merged = mergeAttributeFiltersForApi(flattenAttrRecordToFilters(attrs));
      merged.forEach((a) => {
        params.append("attr", `${a.attribute}:${a.slug}`);
      });

      const url = params.size > 0 ? `${pathname}?${params}` : pathname;
      startTransition(() => router.replace(url, { scroll: false }));
      void fetchProducts({ catIds, sort: s, min, max, q, p, attrs });
      setPage(p);
    },
    [
      selectedCategoryIds,
      sort,
      priceRange,
      search,
      maxPriceHint,
      pathname,
      router,
      fetchProducts,
      attrSelection,
    ]
  );

  const resetFilters = () => {
    setSelectedCategoryIds([]);
    setAttrSelection({});
    setSort("date_desc");
    setPriceRange([0, maxPriceHint]);
    setSearch("");
    setPage(1);
    startTransition(() => router.replace(pathname, { scroll: false }));
    void fetchProducts({ catIds: [], p: 1, attrs: {}, sort: "date_desc", min: 0, max: maxPriceHint, q: "" });
  };

  const hasFilters =
    selectedCategoryIds.length > 0 ||
    Object.values(attrSelection).some((a) => a.length > 0) ||
    sort !== "date_desc" ||
    priceRange[0] > 0 ||
    priceRange[1] < maxPriceHint ||
    search !== "";

  const toggleCategory = (id: number) => {
    const next = selectedCategoryIds.includes(id)
      ? selectedCategoryIds.filter((x) => x !== id)
      : [...selectedCategoryIds, id];
    setSelectedCategoryIds(next);
    applyFilters({ catIds: next, p: 1 });
  };

  const toggleAttrSlug = (taxonomy: string, slug: string, multi: boolean) => {
    const cur = attrSelection[taxonomy] ?? [];
    let next: Record<string, string[]>;
    if (multi) {
      const has = cur.includes(slug);
      const slugs = has ? cur.filter((s) => s !== slug) : [...cur, slug];
      next = { ...attrSelection };
      if (slugs.length) next[taxonomy] = slugs;
      else delete next[taxonomy];
    } else {
      const has = cur.includes(slug);
      next = { ...attrSelection };
      if (has) delete next[taxonomy];
      else next[taxonomy] = [slug];
    }
    setAttrSelection(next);
    applyFilters({ attrs: next, p: 1 });
  };

  const Sidebar = (
    <aside className="w-full space-y-0 md:w-72 md:shrink-0">
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:sticky md:top-24 md:self-start">
        <div className="mb-4 flex items-start justify-between gap-2 border-b border-gray-200 pb-3">
          <span className="text-base font-semibold text-gray-900">Filtry</span>
          {hasFilters ? (
            <button
              type="button"
              onClick={resetFilters}
              className="shrink-0 text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              Wyczyść wszystko
            </button>
          ) : null}
        </div>

        <SidebarSection title="Szukaj">
          <div className="relative">
            <input
              type="search"
              value={search}
              placeholder="Szukaj produktów…"
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyFilters({ q: search })}
            />
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>
          <button
            type="button"
            onClick={() => applyFilters({ q: search })}
            className="mt-2 w-full rounded-lg bg-blue-600 py-1.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Szukaj
          </button>
        </SidebarSection>

        {categories.length > 0 && (
          <SidebarSection title="Kategoria">
            <ul className="space-y-2">
              <li>
                <label className="flex cursor-pointer items-center justify-between gap-2 text-sm">
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedCategoryIds.length === 0}
                      onChange={() => {
                        setSelectedCategoryIds([]);
                        applyFilters({ catIds: [], p: 1 });
                      }}
                      className="rounded border-gray-300 accent-blue-600"
                    />
                    <span className={selectedCategoryIds.length === 0 ? "font-semibold text-blue-600" : "text-gray-700"}>
                      Wszystkie produkty
                    </span>
                  </span>
                  {categories.reduce((sum, c) => sum + (c.count ?? 0), 0) > 0 && (
                    <span className="text-xs text-gray-400">
                      ({categories.reduce((sum, c) => sum + (c.count ?? 0), 0)})
                    </span>
                  )}
                </label>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <label className="flex cursor-pointer items-center justify-between gap-2 text-sm">
                    <span className="flex min-w-0 items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedCategoryIds.includes(cat.id)}
                        onChange={() => toggleCategory(cat.id)}
                        className="rounded border-gray-300 accent-blue-600"
                      />
                      <span
                        className={
                          selectedCategoryIds.includes(cat.id) ? "font-semibold text-blue-600" : "text-gray-700"
                        }
                      >
                        {cat.name}
                      </span>
                    </span>
                    {cat.count != null && <span className="shrink-0 text-xs text-gray-400">({cat.count})</span>}
                  </label>
                </li>
              ))}
            </ul>
          </SidebarSection>
        )}

        {attributeFacets.map((facet) => {
          const multi = true;
          const colorMode = isColorLikeAttribute(facet.name, facet.taxonomy);
          const selected = attrSelection[facet.taxonomy] ?? [];

          return (
            <SidebarSection key={facet.id} title={facet.name}>
              {colorMode ? (
                <div className="flex flex-wrap gap-2">
                  {facet.terms.map((t) => {
                    const on = selected.includes(t.slug);
                    const hex = colorHexForTermSlug(t.slug);
                    return (
                      <button
                        key={t.id}
                        type="button"
                        title={t.name}
                        onClick={() => toggleAttrSlug(facet.taxonomy, t.slug, multi)}
                        className={`h-8 w-8 rounded-full border-2 transition-shadow ${
                          on ? "border-blue-600 ring-2 ring-blue-200" : "border-gray-200"
                        } ${!hex ? "bg-gray-200" : ""}`}
                        style={hex ? { backgroundColor: hex } : undefined}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {facet.terms.map((t) => {
                    const on = selected.includes(t.slug);
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => toggleAttrSlug(facet.taxonomy, t.slug, multi)}
                        className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${
                          on
                            ? "border-blue-600 bg-blue-50 text-blue-800"
                            : "border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        {t.name}
                        {t.count != null && <span className="ml-1 text-gray-400">({t.count})</span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </SidebarSection>
          );
        })}

        <SidebarSection title="Cena">
          <PriceRangeFilter
            min={0}
            max={maxPriceHint}
            value={priceRange}
            onChange={(v) => {
              setPriceRange(v);
              applyFilters({ min: v[0], max: v[1] });
            }}
          />
        </SidebarSection>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
          <h1 className="text-3xl font-bold text-gray-900">Sklep</h1>
          <nav className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-500">
            <a href="/" className="hover:text-blue-600">Strona główna</a>
            <span>/</span>
            <span className="text-gray-800">Sklep</span>
            {selectedCategoryIds.length === 1 && (
              <>
                <span>/</span>
                <span className="text-gray-800">
                  {categories.find((c) => c.id === selectedCategoryIds[0])?.name}
                </span>
              </>
            )}
          </nav>
        </div>
      </div>

      <div className="sticky top-0 z-30 border-b border-gray-200 bg-white/90 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <SlidersHorizontal className="h-4 w-4" /> Filtry
            {hasFilters && <span className="h-2 w-2 rounded-full bg-blue-500" />}
          </button>
          <span className="text-sm text-gray-500">{total} produktów</span>
        </div>
        {mobileSidebarOpen && (
          <div className="max-h-[70vh] overflow-y-auto border-t border-gray-100 bg-white px-4 pb-4">
            {Sidebar}
          </div>
        )}
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="hidden md:block">{Sidebar}</div>

          <div className="min-w-0 flex-1">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-500">Sortuj:</label>
                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => {
                      const v = e.target.value as SortKey;
                      setSort(v);
                      applyFilters({ sort: v });
                    }}
                    className="appearance-none rounded-lg border border-gray-200 bg-white py-1.5 pl-3 pr-8 text-sm font-medium text-gray-700 outline-none focus:border-blue-400"
                  >
                    {SORT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">
                  {loading ? "Ładowanie…" : `Pokazano ${products.length} z ${total} produktów`}
                </span>
                <div className="flex rounded-lg border border-gray-200 p-0.5">
                  <button
                    type="button"
                    onClick={() => setView("grid")}
                    className={`rounded p-1.5 transition-colors ${view === "grid" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-gray-600"}`}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setView("list")}
                    className={`rounded p-1.5 transition-colors ${view === "list" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-gray-600"}`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {hasFilters && (
              <div className="mb-4 flex flex-wrap gap-2">
                {selectedCategoryIds.map((id) => {
                  const name = categories.find((c) => c.id === id)?.name ?? id;
                  return (
                    <span
                      key={id}
                      className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700"
                    >
                      {name}
                      <button
                        type="button"
                        onClick={() => {
                          const next = selectedCategoryIds.filter((x) => x !== id);
                          setSelectedCategoryIds(next);
                          applyFilters({ catIds: next, p: 1 });
                        }}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  );
                })}
                {Object.entries(attrSelection).flatMap(([tax, slugs]) =>
                  slugs.map((slug) => {
                    const facet = attributeFacets.find((f) => f.taxonomy === tax);
                    const label = facet?.terms.find((t) => t.slug === slug)?.name ?? slug;
                    return (
                      <span
                        key={`${tax}:${slug}`}
                        className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700"
                      >
                        {label}
                        <button
                          type="button"
                          onClick={() => {
                            const next = { ...attrSelection };
                            const cur = (next[tax] ?? []).filter((s) => s !== slug);
                            if (cur.length) next[tax] = cur;
                            else delete next[tax];
                            setAttrSelection(next);
                            applyFilters({ attrs: next, p: 1 });
                          }}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    );
                  })
                )}
                {(priceRange[0] > 0 || priceRange[1] < maxPriceHint) && (
                  <span className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                    {priceRange[0]} – {priceRange[1]} zł
                    <button
                      type="button"
                      onClick={() => {
                        setPriceRange([0, maxPriceHint]);
                        applyFilters({ min: 0, max: maxPriceHint });
                      }}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {search && (
                  <span className="flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                    &quot;{search}&quot;
                    <button type="button" onClick={() => { setSearch(""); applyFilters({ q: "" }); }}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {loading && (
              <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                Ładowanie produktów…
              </div>
            )}

            {products.length === 0 && !loading ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 py-24 text-center">
                <p className="text-lg font-semibold text-gray-500">Brak produktów</p>
                <p className="mt-1 text-sm text-gray-400">Zmień filtry lub wyczyść wyszukiwanie</p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Wyczyść filtry
                </button>
              </div>
            ) : (
              <div
                className={
                  view === "grid"
                    ? "grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    : "flex flex-col gap-3"
                }
              >
                {view === "grid"
                  ? products.map((p) => <ShopProductCard key={p.id} product={p} baseHref={baseProductHref} />)
                  : products.map((p) => <ShopListRow key={p.id} product={p} baseHref={baseProductHref} />)}
              </div>
            )}

            {totalPages > 1 && (
              <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => applyFilters({ p: page - 1 })}
                  className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40"
                >
                  ← Poprzednia
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((n) => Math.abs(n - page) <= 2 || n === 1 || n === totalPages)
                  .reduce<(number | "…")[]>((acc, n, idx, arr) => {
                    if (idx > 0 && typeof arr[idx - 1] === "number" && (n as number) - (arr[idx - 1] as number) > 1)
                      acc.push("…");
                    acc.push(n);
                    return acc;
                  }, [])
                  .map((n, i) =>
                    n === "…" ? (
                      <span key={`el-${i}`} className="px-2 text-gray-400">…</span>
                    ) : (
                      <button
                        key={n}
                        type="button"
                        onClick={() => applyFilters({ p: n as number })}
                        className={`h-9 w-9 rounded-lg text-sm font-medium ${
                          page === n ? "bg-blue-600 text-white" : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {n}
                      </button>
                    )
                  )}
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => applyFilters({ p: page + 1 })}
                  className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40"
                >
                  Następna →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ShopListRow({ product, baseHref }: { product: WcProduct; baseHref: string }) {
  const img = product.images?.[0];
  const p = product.prices;
  const hasSale = product.on_sale && p.sale_price && p.sale_price !== p.regular_price;
  const displayPrice = hasSale ? p.sale_price : p.price;
  const originalPrice = hasSale ? p.regular_price : null;

  return (
    <a
      href={`${baseHref}/${product.slug}`}
      className="group flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-100 transition-shadow hover:shadow-md"
    >
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-50">
        {img?.src ? (
          <img src={img.thumbnail || img.src} alt={img.alt || product.name} className="h-full w-full object-contain p-2" />
        ) : (
          <div className="h-full w-full bg-gray-100" />
        )}
      </div>
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div className="min-w-0 flex-1">
          <p className="mb-0.5 text-xs font-medium text-blue-500">{product.categories?.[0]?.name}</p>
          <p className="line-clamp-1 font-semibold text-gray-800 group-hover:text-blue-600">{product.name}</p>
          {product.short_description && (
            <p
              className="mt-0.5 line-clamp-1 text-xs text-gray-500"
              dangerouslySetInnerHTML={{ __html: product.short_description }}
            />
          )}
        </div>
        <div className="shrink-0 text-right">
          <p className="font-bold text-gray-900">{formatWcPrice(displayPrice, p)}</p>
          {originalPrice && <p className="text-sm text-gray-400 line-through">{formatWcPrice(originalPrice, p)}</p>}
        </div>
      </div>
    </a>
  );
}
