import { notFound } from "next/navigation";
import Link from "next/link";
import { getRestaurantBySlug } from "@/lib/restaurantDb";
import { MenuAndCart } from "./MenuAndCart";
import { CartBar } from "@/components/CartBar";
import { ZamowTopHeader } from "@/components/ZamowTopHeader";
import { MapPin } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const restaurant = await getRestaurantBySlug(slug);
  if (!restaurant) return { title: "Restauracja | Zamów" };
  return {
    title: `${restaurant.name} — menu | Zamów`,
    description: restaurant.description || `Zamów jedzenie z ${restaurant.name}.`,
  };
}

export default async function RestaurantPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const restaurant = await getRestaurantBySlug(slug);
  if (!restaurant) notFound();

  return (
    <div className="min-h-dvh bg-zamow-cream pb-24">
      <ZamowTopHeader
        sticky
        showRestauracjeNavLink
        leading={
          <Link href="/restauracje" className="shrink-0 text-sm text-zamow-orange-600 hover:underline">
            ← Restauracje
          </Link>
        }
      />
      <main className="mx-auto max-w-5xl px-4 py-6">
        <div className="mb-6 flex flex-wrap items-start gap-4">
          {restaurant.logoUrl ? (
            <img
              src={restaurant.logoUrl}
              alt=""
              className="h-20 w-20 rounded-xl object-cover"
            />
          ) : null}
          <div>
            <h1 className="text-2xl font-semibold text-stone-900">{restaurant.name}</h1>
            {(restaurant.address || restaurant.city) && (
              <p className="mt-1 flex items-center gap-1 text-sm text-stone-600">
                <MapPin className="h-4 w-4 shrink-0" />
                {[restaurant.address, restaurant.city].filter(Boolean).join(", ")}
              </p>
            )}
            {restaurant.description && (
              <p className="mt-2 text-sm text-stone-600">{restaurant.description}</p>
            )}
          </div>
        </div>
        <MenuAndCart
          restaurantId={restaurant.id}
          restaurantSlug={restaurant.slug}
          restaurantName={restaurant.name}
          categories={restaurant.categories}
        />
      </main>
      <CartBar />
    </div>
  );
}

