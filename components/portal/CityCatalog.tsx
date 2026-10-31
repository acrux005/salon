"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Globe, MapPin, Phone, Search } from "lucide-react";
import {
  BEAUTY_CATEGORIES,
  MIN_CATEGORY_INDEX_COUNT,
  categoryPath,
  type BeautyCategorySlug,
} from "@/lib/catalog/beautyCategories";
import { CITY_PAGE_SIZE, type CityListing, type ListingTier } from "@/lib/catalog/cityListings";
import { splitCatalogClinicName } from "@/lib/catalog/clinicDisplayName";

const TIER_LABEL: Record<ListingTier, string> = {
  verified: "Potwierdzony",
  enriched: "Uzupełniony",
  basic: "Niepotwierdzony",
};

const TIER_CLASS: Record<ListingTier, string> = {
  verified: "bg-emerald-50 text-emerald-800 border-emerald-200",
  enriched: "bg-sky-50 text-sky-800 border-sky-200",
  basic: "bg-neutral-50 text-[#6F5E64] border-neutral-200",
};

function telHref(phone: string): string {
  return `tel:${phone.replace(/\s/g, "")}`;
}

function webHref(url: string): string {
  const s = url.trim();
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  return `https://${s}`;
}

function streetLine(address: string | undefined, city: string): string {
  if (!address) return city;
  const withoutCity = address.replace(new RegExp(`,?\\s*\\d{2}-\\d{3}\\s*${city}\\s*$`, "i"), "").trim();
  return withoutCity || city;
}

export function CityCatalog({
  listings,
  citySlug,
  cityName,
  activeCategory,
  categoryCounts,
  initialPage = 1,
}: {
  listings: CityListing[];
  citySlug: string;
  cityName: string;
  activeCategory?: BeautyCategorySlug;
  categoryCounts: Record<BeautyCategorySlug, number>;
  initialPage?: number;
}) {
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(CITY_PAGE_SIZE);
  const page = Math.max(1, initialPage);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return listings.filter((item) => {
      if (activeCategory && !item.categories.some((c) => c.slug === activeCategory)) return false;
      if (!q) return true;
      const blob = `${item.name} ${item.address ?? ""} ${item.phone ?? ""}`.toLowerCase();
      return blob.includes(q);
    });
  }, [listings, query, activeCategory]);

  const cards =
    page > 1
      ? filtered.slice((page - 1) * CITY_PAGE_SIZE, page * CITY_PAGE_SIZE)
      : filtered.slice(0, visible);
  const remaining = page > 1 ? 0 : Math.max(0, filtered.length - cards.length);

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href={`/portal/gabinety/${citySlug}`}
          className={
            !activeCategory
              ? "rounded-full border border-pink-400 bg-pink-50 px-4 py-2 font-[var(--font-sans)] text-[13px] font-medium text-pink-700"
              : "rounded-full border border-neutral-200 bg-white px-4 py-2 font-[var(--font-sans)] text-[13px] font-medium text-[#1F1A1C] hover:border-pink-200 hover:bg-pink-50/50"
          }
        >
          Wszystkie ({listings.length})
        </Link>
        {BEAUTY_CATEGORIES.map((cat) => {
          const n = categoryCounts[cat.slug] ?? 0;
          if (n === 0) return null;
          const href =
            n >= MIN_CATEGORY_INDEX_COUNT
              ? categoryPath(citySlug, cat.slug)
              : `/portal/gabinety/${citySlug}?kategoria=${cat.slug}`;
          const isActive = activeCategory === cat.slug;
          return (
            <Link
              key={cat.slug}
              href={href}
              className={
                isActive
                  ? "rounded-full border border-pink-400 bg-pink-50 px-4 py-2 font-[var(--font-sans)] text-[13px] font-medium text-pink-700"
                  : "rounded-full border border-neutral-200 bg-white px-4 py-2 font-[var(--font-sans)] text-[13px] font-medium text-[#1F1A1C] hover:border-pink-200 hover:bg-pink-50/50"
              }
            >
              {cat.label} ({n})
            </Link>
          );
        })}
      </div>

      <label className="mb-6 flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2.5 font-[var(--font-sans)] text-[14px] text-[#1F1A1C]">
        <Search className="h-4 w-4 shrink-0 text-[#6F5E64]" aria-hidden />
        <span className="sr-only">Szukaj salonu</span>
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setVisible(CITY_PAGE_SIZE);
          }}
          placeholder={`Szukaj nazwy, ulicy lub telefonu w ${cityName}`}
          className="w-full bg-transparent outline-none placeholder:text-[#8A7F84]"
        />
      </label>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-neutral-200 bg-neutral-50/60 px-4 py-10 text-center font-[var(--font-sans)] text-[15px] text-[#6F5E64]">
          Brak salonów pasujących do wybranych filtrów.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((clinic) => {
            const { displayName } = splitCatalogClinicName(clinic.name);
            const title = displayName || clinic.name;
            return (
            <article
              key={clinic.id}
              className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-[var(--font-sans)] text-[17px] font-semibold text-[#1F1A1C]">
                  <Link href={`/portal/gabinet/${clinic.slug}`} className="hover:text-pink-700">
                    {title}
                  </Link>
                </h3>
                <span
                  className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-medium ${TIER_CLASS[clinic.tier]}`}
                >
                  {TIER_LABEL[clinic.tier]}
                </span>
              </div>
              <p className="mt-2 flex items-start gap-1.5 font-[var(--font-sans)] text-[14px] text-[#6F5E64]">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                {streetLine(clinic.address, clinic.city)}
              </p>
              {clinic.claimed && clinic.categories.length > 0 ? (
                <p className="mt-2 font-[var(--font-sans)] text-[13px] text-[#4a3f42]">
                  {clinic.categories.map((c) => c.shortLabel).join(" • ")}
                </p>
              ) : null}
              {clinic.phone ? (
                <a
                  href={telHref(clinic.phone)}
                  className="mt-2 inline-flex items-center gap-1.5 font-[var(--font-sans)] text-[14px] font-medium text-[#1F1A1C] hover:text-pink-600"
                >
                  <Phone className="h-4 w-4" aria-hidden />
                  {clinic.phone}
                </a>
              ) : (
                <p className="mt-2 font-[var(--font-sans)] text-[13px] text-[#8A7F84]">Brak publicznego telefonu</p>
              )}
              {clinic.website ? (
                <a
                  href={webHref(clinic.website)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1.5 font-[var(--font-sans)] text-[13px] font-medium text-pink-600 hover:underline"
                >
                  <Globe className="h-4 w-4" aria-hidden />
                  Strona WWW
                </a>
              ) : null}
              <p className="mt-2 font-[var(--font-sans)] text-[12px] text-[#6F5E64]">
                {clinic.phone || clinic.address ? "✓ Dane kontaktowe" : "Dane z rejestru publicznego"}
                {clinic.reviewCount > 0 ? ` · ⭐ ${clinic.rating} (${clinic.reviewCount})` : ""}
              </p>
              <Link
                href={`/portal/gabinet/${clinic.slug}`}
                className="mt-4 inline-flex w-fit rounded-full border border-pink-300 px-4 py-2 font-[var(--font-sans)] text-[14px] font-medium text-pink-600 hover:bg-pink-50"
              >
                Zobacz profil →
              </Link>
            </article>
            );
          })}
        </div>
      )}

      {remaining > 0 ? (
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => setVisible((n) => n + CITY_PAGE_SIZE)}
            className="rounded-full bg-[#1F1A1C] px-6 py-3 font-[var(--font-sans)] text-[14px] font-medium text-white hover:bg-neutral-800"
          >
            Pokaż więcej ({remaining})
          </button>
        </div>
      ) : null}

      {filtered.length > CITY_PAGE_SIZE ? (
        <nav className="mt-8 flex flex-wrap justify-center gap-2" aria-label="Paginacja katalogu">
          {Array.from({ length: Math.ceil(filtered.length / CITY_PAGE_SIZE) }, (_, i) => i + 1).map((page) => {
            const params = new URLSearchParams();
            if (page > 1) params.set("strona", String(page));
            if (activeCategory && (categoryCounts[activeCategory] ?? 0) < MIN_CATEGORY_INDEX_COUNT) {
              params.set("kategoria", activeCategory);
            }
            const qs = params.toString();
            const href = activeCategory && (categoryCounts[activeCategory] ?? 0) >= MIN_CATEGORY_INDEX_COUNT
              ? `${categoryPath(citySlug, activeCategory)}${qs ? `?${qs}` : ""}`
              : `/portal/gabinety/${citySlug}${qs ? `?${qs}` : ""}`;
            return (
              <Link
                key={page}
                href={href}
                className="rounded-full border border-neutral-200 px-3 py-1.5 font-[var(--font-sans)] text-[13px] text-[#1F1A1C] hover:border-pink-300 hover:text-pink-700"
              >
                Strona {page}
              </Link>
            );
          })}
        </nav>
      ) : null}

      <section className="mt-12 border-t border-neutral-200/70 pt-8">
        <h2 className="font-[var(--font-sans)] text-[16px] font-semibold text-[#1F1A1C]">
          Pełna lista salonów w {cityName} ({filtered.length})
        </h2>
        <p className="mt-1 font-[var(--font-sans)] text-[13px] text-[#8A7F84]">
          Wszystkie profile są dostępne pod osobnymi adresami — także te poza pierwszymi {CITY_PAGE_SIZE} wynikami.
        </p>
        <ol className="mt-4 columns-1 gap-x-8 sm:columns-2 lg:columns-3">
          {filtered.map((clinic, i) => (
            <li key={clinic.id} className="break-inside-avoid pb-1.5 font-[var(--font-sans)] text-[13px] text-[#4a3f42]">
              <Link href={`/portal/gabinet/${clinic.slug}`} className="hover:text-pink-700 hover:underline">
                {i + 1}. {clinic.name}
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
