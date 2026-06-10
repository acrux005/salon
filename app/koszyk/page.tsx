"use client";

import Link from "next/link";
import { useCart } from "@/components/CartContext";
import { CartCheckout } from "@/components/CartCheckout";
import { ZamowTopHeader } from "@/components/ZamowTopHeader";

export default function KoszykPage() {
  const { state, updateQuantity, removeItem, totalPlz } = useCart();

  if (!state.restaurantSlug || state.items.length === 0) {
    return (
      <div className="min-h-dvh bg-zamow-cream">
        <ZamowTopHeader showRestauracjeNavLink />
        <div className="px-4 py-12">
          <div className="mx-auto max-w-lg rounded-2xl border border-stone-200 bg-white p-8 text-center">
          <p className="font-medium text-stone-700">Koszyk jest pusty</p>
          <p className="mt-2 text-sm text-stone-500">Dodaj dania z menu restauracji.</p>
          <Link
            href="/restauracje"
            className="mt-6 inline-block rounded-full bg-zamow-orange-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-zamow-orange-500"
          >
            Wybierz restaurację
          </Link>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-zamow-cream">
      <ZamowTopHeader
        showRestauracjeNavLink
        leading={
          <Link
            href={`/restauracje/${state.restaurantSlug}`}
            className="max-w-[40vw] shrink truncate text-sm text-zamow-orange-600 hover:underline sm:max-w-none"
          >
            ← {state.restaurantName}
          </Link>
        }
      />
      <div className="border-b border-zamow-orange-100 bg-zamow-cream px-4 py-2">
        <div className="mx-auto max-w-5xl">
          <span className="font-display text-lg font-semibold text-stone-900">Koszyk</span>
        </div>
      </div>
      <main className="mx-auto max-w-5xl px-4 py-6">
        <ul className="space-y-2">
          {state.items.map((i) => (
            <li
              key={`${i.menuItemId}-${i.options ?? ""}`}
              className="flex items-center justify-between gap-4 rounded-xl border border-stone-200 bg-white p-4"
            >
              <div className="min-w-0">
                <span className="font-medium text-stone-900">{i.name}</span>
                <p className="text-sm text-stone-500">{i.pricePlz} zł × {i.quantity}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateQuantity(i.menuItemId, i.quantity - 1)}
                  className="h-8 w-8 rounded-full border border-stone-300 text-stone-600 hover:bg-stone-100"
                >
                  −
                </button>
                <span className="w-6 text-center text-sm">{i.quantity}</span>
                <button
                  type="button"
                  onClick={() => updateQuantity(i.menuItemId, i.quantity + 1)}
                  className="h-8 w-8 rounded-full border border-stone-300 text-stone-600 hover:bg-stone-100"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => removeItem(i.menuItemId)}
                  className="ml-2 text-sm text-red-600 hover:underline"
                >
                  Usuń
                </button>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-right font-semibold text-stone-900">Razem: {totalPlz} zł</p>
        <CartCheckout
          restaurantId={state.restaurantId!}
          restaurantName={state.restaurantName!}
          items={state.items}
          totalPlz={totalPlz}
        />
      </main>
    </div>
  );
}
