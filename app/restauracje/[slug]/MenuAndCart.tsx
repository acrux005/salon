"use client";

import { useCart } from "@/components/CartContext";
import type { RestaurantWithMenu } from "@/lib/restaurantDb";

type Category = NonNullable<RestaurantWithMenu>["categories"][number];
type MenuItem = Category["items"][number];

type Props = {
  restaurantId: string;
  restaurantSlug: string;
  restaurantName: string;
  categories: NonNullable<RestaurantWithMenu>["categories"];
};

export function MenuAndCart({ restaurantId, restaurantSlug, restaurantName, categories }: Props) {
  const { addItem } = useCart();

  return (
    <div className="space-y-8">
      {categories.map((cat: Category) => (
        <section key={cat.id}>
          <h2 className="mb-3 text-lg font-semibold text-stone-900">{cat.name}</h2>
          <ul className="space-y-3">
            {cat.items.map((item: MenuItem) => (
              <li
                key={item.id}
                className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-stone-200 bg-white p-4"
              >
                <div className="min-w-0 flex-1">
                  <span className="font-medium text-stone-900">{item.name}</span>
                  {item.description && (
                    <p className="mt-1 text-sm text-stone-600">{item.description}</p>
                  )}
                  <p className="mt-1 text-sm font-medium text-zamow-orange-600">
                    {item.pricePlz} zł
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
addItem(
                        {
                          menuItemId: item.id,
                          name: item.name,
                          pricePlz: item.pricePlz,
                          quantity: 1,
                        },
                        restaurantId,
                        restaurantSlug,
                        restaurantName
                      )
                  }
                  className="shrink-0 rounded-full bg-zamow-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-zamow-orange-500"
                >
                  Dodaj
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
