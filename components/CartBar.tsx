"use client";

import Link from "next/link";
import { useCart } from "./CartContext";

export function CartBar() {
  const { state, totalPlz } = useCart();
  const count = state.items.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-stone-200 bg-white px-4 py-3">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <span className="text-sm text-stone-600">
          {count > 0 ? (
            <>
              {count} {count === 1 ? "pozycja" : count < 5 ? "pozycje" : "pozycji"} · {totalPlz} zł
            </>
          ) : (
            "Koszyk jest pusty"
          )}
        </span>
        <Link
          href="/koszyk"
          className="rounded-full bg-zamow-orange-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-zamow-orange-500 disabled:opacity-50"
        >
          Koszyk
        </Link>
      </div>
    </div>
  );
}
