"use client";

import Link from "next/link";
import { Star, MapPin } from "lucide-react";
import { useClinicData } from "@/contexts/ClinicDataContext";

const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80";

export function ClinicHero() {
  const { profile, hero } = useClinicData();
  return (
    <section className="relative border-b border-neutral-200/60 bg-gradient-to-b from-pink-50/30 to-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
          <div>
            <h1 className="font-[var(--font-serif)] text-2xl font-normal leading-tight text-[#1F1A1C] sm:text-3xl lg:text-[2rem]">
              Gabinet {profile.name.replace(/^Gabinet\s+/i, "")}
            </h1>
            <p className="mt-3 font-[var(--font-sans)] text-[15px] text-[#6F5E64]">
              Specjalizacja: {profile.specializations.join(" | ")}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center gap-1.5 font-[var(--font-sans)] text-[15px] text-[#1F1A1C]">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden />
                {profile.rating} ({profile.reviewCount} opinii)
              </span>
              <span className="inline-flex items-center gap-1.5 font-[var(--font-sans)] text-[15px] text-[#6F5E64]">
                <MapPin className="h-4 w-4 shrink-0" aria-hidden />
                {profile.city}
              </span>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={profile.ctaPrimaryHref}
                className="inline-flex items-center rounded-full bg-pink-500 px-6 py-3 font-[var(--font-sans)] text-[15px] font-medium text-white shadow-md transition-all hover:bg-pink-600"
              >
                {profile.ctaPrimary}
              </Link>
              <Link
                href={profile.ctaSecondaryHref}
                className="inline-flex items-center rounded-full border border-pink-300 bg-white px-6 py-3 font-[var(--font-sans)] text-[15px] font-medium text-[#1F1A1C] transition-colors hover:border-pink-400 hover:bg-pink-50/50"
              >
                {profile.ctaSecondary}
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 shadow-lg">
              <img
                src={PLACEHOLDER_IMAGE}
                alt={hero.imageAlt}
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
