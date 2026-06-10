import Link from "next/link";
import { OdartPublicShell } from "@/components/odart/OdartPublicShell";
import { rafalPublicHref } from "@/lib/rafalKowalkowskiLegacyRoutes";
import {
  RAFAL_KOWALKOWSKI_GATUNKI_MUZYKI_PATH,
  RAFAL_KOWALKOWSKI_KOMPOZYCJA_FOTO_PATH,
  RAFAL_KOWALKOWSKI_PRZYGODA_FOTO_PATH,
  RAFAL_KOWALKOWSKI_TELEDYSKI_PATH,
  RAFAL_KOWALKOWSKI_TROJPODZIAL_FOTO_PATH,
  RAFAL_KOWALKOWSKI_NAUKA_GITARY_PATH,
  RAFAL_KOWALKOWSKI_ZAJECIA_WOKALNE_PATH,
  RAFAL_KOWALKOWSKI_ZLOTA_PROPORCJA_PRZYKLADY_PATH,
  RAFAL_KOWALKOWSKI_ZLOTY_PODZIAL_FOTO_PATH,
} from "@/lib/rafalKowalkowskiGallery";
import { RAFAL_KOWALKOWSKI_MUZYKA_PATH } from "@/lib/rafalKowalkowskiMuzyka";

const POSTS = [
  { title: "Nauka gry na gitarze Kołobrzeg", hint: "Edukacja", href: RAFAL_KOWALKOWSKI_NAUKA_GITARY_PATH },
  { title: "Zajęcia wokalne Kołobrzeg", hint: "Edukacja", href: RAFAL_KOWALKOWSKI_ZAJECIA_WOKALNE_PATH },
  { title: "Przygoda z fotografią", hint: "Edukacja", href: RAFAL_KOWALKOWSKI_PRZYGODA_FOTO_PATH },
  { title: "Kompozycja w fotografii", hint: "Edukacja", href: RAFAL_KOWALKOWSKI_KOMPOZYCJA_FOTO_PATH },
  { title: "Kompozycja – Trójpodział", hint: "Edukacja", href: RAFAL_KOWALKOWSKI_TROJPODZIAL_FOTO_PATH },
  { title: "Złota proporcja – przykłady", hint: "Edukacja", href: RAFAL_KOWALKOWSKI_ZLOTA_PROPORCJA_PRZYKLADY_PATH },
  { title: "Złoty podział w fotografii", hint: "Edukacja", href: RAFAL_KOWALKOWSKI_ZLOTY_PODZIAL_FOTO_PATH },
  { title: "Teledyski i produkcja w regionie", hint: "Video", href: RAFAL_KOWALKOWSKI_TELEDYSKI_PATH },
  { title: "Muzyka autorska i studio", hint: "ACRUX", href: RAFAL_KOWALKOWSKI_MUZYKA_PATH },
  { title: "Gatunki muzyki", hint: "Muzyka", href: RAFAL_KOWALKOWSKI_GATUNKI_MUZYKI_PATH },
] as const;

export function OdartRafalKowalkowskiBlogIndexPage() {
  return (
    <OdartPublicShell activeNav="blog">
      <div className="mx-auto max-w-3xl px-4 py-14 lg:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-odart-accent">Blog</p>
        <h1 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Wpisy i artykuły</h1>
        <p className="mt-4 text-neutral-400">
          Edukacja fotograficzna, muzyka, produkcja wideo — wybrane teksty z portfolio Rafała Kowalkowskiego.
        </p>
        <ul className="mt-10 divide-y divide-white/10">
          {POSTS.map((post) => (
            <li key={post.href}>
              <Link
                href={rafalPublicHref(post.href)}
                className="flex flex-col gap-1 py-5 transition hover:text-odart-accent sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="text-lg font-medium text-white">{post.title}</span>
                <span className="text-sm text-neutral-500">{post.hint}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </OdartPublicShell>
  );
}
