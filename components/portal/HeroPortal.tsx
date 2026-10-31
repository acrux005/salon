"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { PORTAL_SEO_CITIES } from "@/content/portalCities";

const HERO_SRC =
  process.env.NEXT_PUBLIC_PORTAL_HERO_IMAGE?.trim() || "/zabiegihero.jpg";

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/ą/g, "a")
    .replace(/ć/g, "c")
    .replace(/ę/g, "e")
    .replace(/ł/g, "l")
    .replace(/ń/g, "n")
    .replace(/ó/g, "o")
    .replace(/ś/g, "s")
    .replace(/ź|ż/g, "z")
    .trim();
}

export function HeroPortal() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");

  const citySuggestions = useMemo(() => {
    const q = normalize(city);
    if (q.length < 2) return [];
    return PORTAL_SEO_CITIES.filter(
      (c) => normalize(c.name).includes(q) || c.slug.includes(q)
    ).slice(0, 6);
  }, [city]);

  function resolveCitySlug(input: string): string | null {
    const q = normalize(input);
    if (!q) return null;
    const exact = PORTAL_SEO_CITIES.find((c) => normalize(c.name) === q || c.slug === q);
    if (exact) return exact.slug;
    const partial = PORTAL_SEO_CITIES.find(
      (c) => normalize(c.name).startsWith(q) || c.slug.startsWith(q)
    );
    return partial?.slug ?? null;
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    const citySlug = resolveCitySlug(city);
    if (citySlug) {
      const params = q ? `?q=${encodeURIComponent(q)}` : "";
      router.push(`/portal/gabinety/${citySlug}${params}`);
      return;
    }
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (city.trim()) params.set("city", city.trim());
    const qs = params.toString();
    router.push(qs ? `/portal/gabinety?${qs}` : "/portal/gabinety");
  }

  return (
    <section
      id="szukaj"
      className="border-b border-neutral-200/40 py-16 lg:py-24"
      style={{ background: "linear-gradient(to bottom, #ffffff 0%, #fef9fb 50%, #fafafa 100%)" }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <h1 className="font-[var(--font-serif)] text-3xl font-normal leading-tight text-[#1F1A1C] sm:text-4xl lg:text-[2.75rem]">
              Znajdź salon i usługi beauty w swojej okolicy
            </h1>
            <p className="mt-5 max-w-lg font-[var(--font-sans)] text-[16px] leading-relaxed text-[#6F5E64]">
              Gabinety kosmetyczne, fryzjerstwo, paznokcie, brwi i masaże. Wyszukaj salon w swoim
              mieście i poznaj jego profil.
            </p>

            <form onSubmit={onSubmit} className="mt-8 space-y-3">
              <div className="flex flex-col gap-3 sm:flex-row">
                <label className="relative min-w-0 flex-1">
                  <span className="sr-only">Salon lub usługa</span>
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6F5E64]" />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Salon lub usługa"
                    className="h-12 w-full rounded-xl border border-neutral-200 bg-white pl-10 pr-4 text-[14px] text-[#1F1A1C] outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
                  />
                </label>
                <label className="relative w-full sm:w-44">
                  <span className="sr-only">Miasto</span>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Miasto"
                    list="portal-hero-cities"
                    className="h-12 w-full rounded-xl border border-neutral-200 bg-white px-4 text-[14px] text-[#1F1A1C] outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
                    autoComplete="address-level2"
                  />
                  <datalist id="portal-hero-cities">
                    {citySuggestions.map((c) => (
                      <option key={c.slug} value={c.name} />
                    ))}
                  </datalist>
                </label>
                <button
                  type="submit"
                  className="h-12 shrink-0 rounded-xl bg-pink-500 px-6 font-[var(--font-sans)] text-[15px] font-medium text-white shadow-sm transition-colors hover:bg-pink-600"
                >
                  Szukaj
                </button>
              </div>
            </form>

            <p className="mt-5 font-[var(--font-sans)] text-[14px] text-[#4a3f42]">
              <strong className="font-semibold text-[#1F1A1C]">Prowadzisz salon?</strong>{" "}
              <Link href="/portal/dodaj-salon" className="font-medium text-pink-600 hover:underline">
                Dodaj lub przejmij bezpłatny profil →
              </Link>
            </p>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <div className="relative aspect-[4/3] w-full max-w-md overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 shadow-lg lg:max-w-none">
              <Image
                src={HERO_SRC}
                alt="Salon beauty — znajdź gabinet i usługi w swojej okolicy"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
