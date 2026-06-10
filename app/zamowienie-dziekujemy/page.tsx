import Link from "next/link";
import { ZamowTopHeader } from "@/components/ZamowTopHeader";

export const metadata = {
  title: "Dziękujemy | Zamów",
  description: "Zamówienie zostało przyjęte.",
};

export default function ZamowienieDziekujemyPage({
  searchParams,
}: {
  searchParams?: { nr?: string };
}) {
  const nr = searchParams?.nr?.trim();
  return (
    <div className="min-h-dvh bg-zamow-cream">
      <ZamowTopHeader showRestauracjeNavLink />
      <div className="flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-md w-full rounded-2xl border border-stone-200 bg-white p-8 text-center">
        <h1 className="text-xl font-semibold text-stone-900">Dziękujemy za zamówienie</h1>
        {nr && (
          <p className="mt-3 text-lg font-semibold text-zamow-orange-600">
            Numer zamówienia: <span className="font-mono">{nr}</span>
          </p>
        )}
        <p className="mt-3 text-stone-600">
          Restauracja potwierdzi je wkrótce. Płatność przy odbiorze lub dostawie.
        </p>
        <Link
          href="/restauracje"
          className="mt-6 inline-block rounded-full bg-zamow-orange-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-zamow-orange-500"
        >
          Wróć do restauracji
        </Link>
      </div>
      </div>
    </div>
  );
}
