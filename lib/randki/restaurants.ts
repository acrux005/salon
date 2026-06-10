import { getRestaurants } from "@/lib/restaurantDb";

export type RandkiRestaurantOption = {
  id: string;
  slug: string;
  name: string;
  city: string;
  orderUrl: string;
};

/** Restauracje z Zamów do propozycji randki (filtrowane po mieście). */
export async function listRestaurantsForDating(city?: string): Promise<RandkiRestaurantOption[]> {
  const restaurants = await getRestaurants(city);
  return restaurants.map((r) => ({
      id: r.id,
      slug: r.slug,
      name: r.name,
      city: r.city,
      orderUrl: `https://zamow.odart.pl/${r.slug}`,
  }));
}
