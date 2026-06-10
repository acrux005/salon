import Link from "next/link";
import { getRestaurants } from "@/lib/restaurantDb";
import { ZamowTopHeader } from "@/components/ZamowTopHeader";
import { MapPin, UtensilsCrossed } from "lucide-react";

type Restaurant = Awaited<ReturnType<typeof getRestaurants>>[number];

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Restauracje — zamów jedzenie online w Twoim mieście | Zamów",
  description:
    "Wybierz restaurację, sprawdź menu i zamów na wybraną godzinę. Odbiór osobisty lub dostawa — bez zbędnego klikania.",
};

function RestaurantCardImage({ r }: { r: Restaurant }) {
  const src = r.coverUrl || r.logoUrl;
  if (src) {
    return (
      <img
        src={src}
        alt={r.name}
        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
      />
    );
  }
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zamow-orange-100 to-amber-100 text-zamow-orange-600">
      <UtensilsCrossed className="h-14 w-14 opacity-80" aria-hidden />
    </div>
  );
}

export default async function RestauracjePage() {
  const restaurants = await getRestaurants();
  return (
    <div className="min-h-dvh bg-zamow-cream">
      <ZamowTopHeader showRestauracjeNavLink={false} />
      <main>
        <section className="border-b border-zamow-orange-100 bg-white">
          <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
            <h1 className="font-display text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
              Zamów jedzenie online w Twoim mieście
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-stone-600">
              Wybierz restaurację, sprawdź menu i zamów na wybraną godzinę
            </p>
            <a
              href="#lista-restauracji"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-zamow-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-zamow-orange-500"
            >
              Zobacz restauracje
            </a>
          </div>
        </section>

        <div className="mx-auto max-w-5xl px-4 py-10 sm:py-12">
          <section id="lista-restauracji" className="scroll-mt-8" aria-labelledby="restauracje-heading">
            <h2 id="restauracje-heading" className="text-xl font-semibold text-stone-900">
              Restauracje
            </h2>
            {restaurants.length === 0 ? (
              <p className="mt-6 text-stone-600">
                Jeszcze nic tu nie ma.{" "}
                <Link href="/" className="font-medium text-zamow-orange-600 hover:underline">
                  Wróć na stronę główną
                </Link>
                .
              </p>
            ) : (
              <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {restaurants.map((r: Restaurant) => (
                  <li key={r.id}>
                    <Link
                      href={`/restauracje/${r.slug}`}
                      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:border-zamow-orange-300 hover:shadow-md"
                    >
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-100">
                        <RestaurantCardImage r={r} />
                      </div>
                      <div className="flex flex-1 flex-col p-5">
                        <span className="text-lg font-semibold text-stone-900 group-hover:text-zamow-orange-600">
                          {r.name}
                        </span>
                        <p className="mt-1 flex items-start gap-1.5 text-sm text-stone-500">
                          <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                          <span>
                            {r.city}
                            {r.address ? ` · ${r.address}` : null}
                          </span>
                        </p>
                        {r.description ? (
                          <p className="mt-3 line-clamp-2 flex-1 text-sm leading-relaxed text-stone-600">
                            {r.description}
                          </p>
                        ) : (
                          <p className="mt-3 flex-1 text-sm text-stone-400">Zobacz menu i zamów online.</p>
                        )}
                        <span className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-zamow-orange-600 py-2.5 text-sm font-semibold text-white transition group-hover:bg-zamow-orange-500">
                          Zamów
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section
            className="mt-16 border-t border-zamow-orange-100 pt-12"
            aria-labelledby="jak-dziala-heading"
          >
            <h2 id="jak-dziala-heading" className="text-xl font-semibold text-stone-900">
              Jak to działa?
            </h2>
            <ol className="mt-6 space-y-4 text-stone-600">
              <li className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zamow-orange-100 text-sm font-bold text-zamow-orange-700">
                  1
                </span>
                <div>
                  <p className="font-medium text-stone-900">Wybierz restaurację</p>
                  <p className="text-sm">Przeglądaj lokale, otwórz menu i dodawaj dania do koszyka.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zamow-orange-100 text-sm font-bold text-zamow-orange-700">
                  2
                </span>
                <div>
                  <p className="font-medium text-stone-900">Wybierz dania</p>
                  <p className="text-sm">Ułóż zamówienie dokładnie tak, jak chcesz.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zamow-orange-100 text-sm font-bold text-zamow-orange-700">
                  3
                </span>
                <div>
                  <p className="font-medium text-stone-900">Ustal odbiór lub dostawę</p>
                  <p className="text-sm">Wybierz termin z kalendarza. Płatność przy odbiorze lub przy dostawie.</p>
                </div>
              </li>
            </ol>
          </section>

          <section className="mt-16 rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-stone-900">Masz restaurację? Dodaj ją do systemu</h2>
            <p className="mt-2 text-sm text-stone-600">
              Przyjmuj zamówienia online — menu, terminy i statusy w jednym panelu.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-stone-900 shadow-sm transition hover:bg-amber-300"
            >
              Dodaj restaurację
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
}
