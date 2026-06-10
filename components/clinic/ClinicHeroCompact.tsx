"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, MapPin } from "lucide-react";
import { useClinicData } from "@/contexts/ClinicDataContext";
import { useClinicContactModal } from "@/contexts/ClinicContactModalContext";

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80";
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function ClinicHeroCompact() {
  const { profile, hero } = useClinicData();
  const { openContactModal } = useClinicContactModal();
  const name = profile.name.replace(/^Gabinet\s+/i, "");
  const rawUrl = (hero as { imageUrl?: string })?.imageUrl;
  const avatarSrc = !rawUrl
    ? DEFAULT_AVATAR
    : rawUrl.startsWith("http")
      ? rawUrl
      : `${BASE_PATH}${rawUrl}`;

  return (
    <section className="border-b border-neutral-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 flex-1 items-center gap-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-neutral-100 sm:h-20 sm:w-20">
              <Image
                src={avatarSrc}
                alt={name}
                fill
                className="object-cover"
                sizes="80px"
                unoptimized
              />
            </div>
            <div className="min-w-0">
              <h1 className="truncate font-[var(--font-sans)] text-xl font-semibold text-[#1F1A1C] sm:text-2xl">
                {name}
              </h1>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-[14px] text-[#6F5E64]">
                {profile.reviewCount > 0 ? (
                  <Link
                    href="#opinie"
                    className="inline-flex items-center gap-1 text-[#6F5E64] transition-colors hover:text-pink-600"
                  >
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden />
                    <strong className="text-[#1F1A1C]">{profile.rating}</strong>
                    <span>({profile.reviewCount} {profile.reviewCount === 1 ? "opinia" : profile.reviewCount < 5 ? "opinie" : "opinii"})</span>
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden />
                    <strong className="text-[#1F1A1C]">{profile.rating}</strong>
                    <span>({profile.reviewCount})</span>
                  </span>
                )}
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-4 w-4 shrink-0" aria-hidden />
                  {profile.city}
                </span>
              </div>
            </div>
          </div>
          <div className="shrink-0">
            <button
              type="button"
              onClick={openContactModal}
              className="inline-flex justify-center rounded-full bg-pink-500 px-6 py-3 font-[var(--font-sans)] text-[15px] font-medium text-white shadow-sm hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
            >
              {profile.ctaPrimary}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
