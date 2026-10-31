import { getAllClinicRecordsAsync } from "@/lib/skinmatch/clinics";
import { catalogCitiesFor } from "@/lib/catalog/areaCities";
import { getClaimedClinicIdSet } from "@/lib/catalogListingServer";
import { buildCityListings, countByCategory } from "@/lib/catalog/cityListings";
import { PORTAL_CITY_BY_NAME } from "@/content/portalCities";
import {
  inferBeautyCategories,
  MIN_CATEGORY_INDEX_COUNT,
  type BeautyCategorySlug,
} from "@/lib/catalog/beautyCategories";

export async function loadCityCatalog(cityName: string) {
  const clinics = await getAllClinicRecordsAsync(catalogCitiesFor(cityName));
  const claimedIds = await getClaimedClinicIdSet(clinics.map((c) => c.id));
  const listings = buildCityListings(clinics, claimedIds);
  return {
    clinics,
    listings,
    categoryCounts: countByCategory(listings),
  };
}

export async function getIndexableCityCategoryPaths(): Promise<{ citySlug: string; category: BeautyCategorySlug }[]> {
  try {
    const { getPrisma } = await import("@/lib/db");
    const rows = await getPrisma().clinic.findMany({
      where: { isPublished: true },
      select: { city: true, name: true },
    });
    const byCity = new Map<string, string[]>();
    for (const row of rows) {
      if (!row.city) continue;
      const list = byCity.get(row.city) ?? [];
      list.push(row.name);
      byCity.set(row.city, list);
    }
    const out: { citySlug: string; category: BeautyCategorySlug }[] = [];
    Array.from(byCity.entries()).forEach(([cityName, names]) => {
      const citySlug = PORTAL_CITY_BY_NAME[cityName]?.slug;
      if (!citySlug) return;
      const counts = new Map<BeautyCategorySlug, number>();
      names.forEach((name) => {
        inferBeautyCategories(name).forEach((cat) => {
          counts.set(cat.slug, (counts.get(cat.slug) ?? 0) + 1);
        });
      });
      Array.from(counts.entries()).forEach(([category, n]) => {
        if (n >= MIN_CATEGORY_INDEX_COUNT) out.push({ citySlug, category });
      });
    });
    return out;
  } catch {
    return [];
  }
}
