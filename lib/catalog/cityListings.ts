import type { ClinicRecord } from "@/lib/skinmatch/schema";
import {
  BEAUTY_CATEGORIES,
  type BeautyCategory,
  type BeautyCategorySlug,
  inferBeautyCategories,
} from "@/lib/catalog/beautyCategories";

export type ListingTier = "verified" | "enriched" | "basic";

export type CityListing = {
  id: string;
  slug: string;
  name: string;
  city: string;
  address?: string;
  phone?: string;
  website?: string;
  avatarUrl?: string | null;
  reviewCount: number;
  rating: number;
  claimed: boolean;
  tier: ListingTier;
  categories: BeautyCategory[];
  completeness: number;
};

export function listingTier(claimed: boolean, listing: Pick<CityListing, "phone" | "address" | "website" | "categories">): ListingTier {
  if (claimed) return "verified";
  if (listing.address && listing.phone && listing.categories.length > 0) return "enriched";
  return "basic";
}

export function completenessScore(listing: Pick<CityListing, "claimed" | "phone" | "address" | "website" | "categories" | "reviewCount">): number {
  let score = 0;
  if (listing.claimed) score += 100;
  if (listing.phone) score += 20;
  if (listing.address) score += 8;
  if (listing.website) score += 16;
  if (listing.categories.length > 0) score += 10;
  score += Math.min(listing.reviewCount, 20);
  return score;
}

export function toCityListing(clinic: ClinicRecord, claimed: boolean): CityListing {
  const categories = inferBeautyCategories(clinic.name);
  const listing: CityListing = {
    id: clinic.id,
    slug: clinic.slug,
    name: clinic.name,
    city: clinic.city,
    address: clinic.kontakt?.address,
    phone: clinic.kontakt?.phone,
    website: clinic.kontakt?.website,
    avatarUrl: clinic.avatarUrl,
    reviewCount: clinic.reviewCount,
    rating: clinic.rating,
    claimed,
    categories,
    completeness: 0,
    tier: "basic",
  };
  listing.tier = listingTier(claimed, listing);
  listing.completeness = completenessScore(listing);
  return listing;
}

export function sortCityListings(listings: CityListing[]): CityListing[] {
  return [...listings].sort((a, b) => {
    if (a.claimed !== b.claimed) return a.claimed ? -1 : 1;
    if (b.completeness !== a.completeness) return b.completeness - a.completeness;
    if (b.reviewCount !== a.reviewCount) return b.reviewCount - a.reviewCount;
    return a.name.localeCompare(b.name, "pl");
  });
}

export function buildCityListings(clinics: ClinicRecord[], claimedIds: Set<string>): CityListing[] {
  return sortCityListings(clinics.map((c) => toCityListing(c, claimedIds.has(c.id))));
}

export function countByCategory(listings: CityListing[]): Record<BeautyCategorySlug, number> {
  const counts = Object.fromEntries(BEAUTY_CATEGORIES.map((c) => [c.slug, 0])) as Record<
    BeautyCategorySlug,
    number
  >;
  for (const listing of listings) {
    for (const cat of listing.categories) counts[cat.slug] += 1;
  }
  return counts;
}

function pl(n: number, one: string, few: string, many: string): string {
  if (n === 1) return `${n} ${one}`;
  return `${n} ${many}`;
}

const CATEGORY_PHRASE: Record<BeautyCategorySlug, (n: number) => string> = {
  kosmetologia: (n) => pl(n, "gabinet kosmetologiczny", "gabinety kosmetologiczne", "gabinetów kosmetologicznych"),
  paznokcie: (n) => pl(n, "salon paznokci", "salony paznokci", "salonów paznokci"),
  "rzesy-brwi": (n) => pl(n, "studio rzęs i brwi", "studia rzęs i brwi", "studiów rzęs i brwi"),
  "makijaz-permanentny": (n) =>
    pl(n, "gabinet makijażu permanentnego", "gabinety makijażu permanentnego", "gabinetów makijażu permanentnego"),
  fryzjer: (n) => pl(n, "salon fryzjerski", "salony fryzjerskie", "salonów fryzjerskich"),
  barber: (n) => pl(n, "barber", "barberów", "barberów"),
  podologia: (n) => pl(n, "gabinet podologiczny", "gabinety podologiczne", "gabinetów podologicznych"),
};

export function buildCategoryStatsSentence(cityLocative: string, listings: CityListing[]): string | null {
  if (listings.length === 0) return null;
  const counts = countByCategory(listings);
  const parts = BEAUTY_CATEGORIES.map((c) => ({ slug: c.slug, n: counts[c.slug] }))
    .filter((x) => x.n > 0)
    .map((x) => CATEGORY_PHRASE[x.slug](x.n));
  if (parts.length === 0) {
    return `W bazie Zabiegów Odart jest obecnie ${pl(listings.length, "salon urody", "salony urody", "salonów urody")} w ${cityLocative}.`;
  }
  const head = `W ${cityLocative} w bazie Zabiegów Odart jest ${pl(
    listings.length,
    "salon urody i gabinet kosmetyczny",
    "salony urody i gabinety kosmetyczne",
    "salonów urody i gabinetów kosmetycznych"
  )}`;
  if (parts.length === 1) return `${head}: ${parts[0]}.`;
  const last = parts.pop();
  return `${head}: ${parts.join(", ")} oraz ${last}.`;
}

export const CITY_PAGE_SIZE = 24;
