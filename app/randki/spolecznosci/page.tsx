import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { RANDKI_ROLE } from "@/lib/auth";
import { RANDKI_CIRCLES } from "@/lib/randki/circles";
import { isPremiumActive } from "@/lib/randki/premium";
import { randkiPublicHref } from "@/lib/randkiPaths";
import { RandkiCirclePicker } from "@/components/randki/RandkiCirclePicker";

export default async function RandkiSpolecznosciPage() {
  const session = await getServerSession(authOptions);
  const accountId = (session?.user as { datingAccountId?: string })?.datingAccountId;
  const isLoggedIn = (session?.user as { role?: string })?.role === RANDKI_ROLE && accountId;
  const isPremium = accountId ? await isPremiumActive(accountId) : false;

  let myCircle: string | null = null;
  if (accountId) {
    const { getPrisma } = await import("@/lib/db");
    const p = await getPrisma().datingProfile.findUnique({
      where: { accountId },
      select: { circleSlug: true },
    });
    myCircle = p?.circleSlug ?? null;
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-center text-3xl font-bold text-white">Prywatne kręgi</h1>
      <p className="mx-auto mt-3 max-w-xl text-center text-[15px] text-white/60">
        Nie globalny katalog — małe społeczności. Większe poczucie bezpieczeństwa, lepszy vibe match.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {RANDKI_CIRCLES.map((c) => (
          <article key={c.slug} className="randki-glass p-5">
            <div className="flex items-start justify-between gap-2">
              <span className="text-2xl">{c.emoji}</span>
              {c.premium && (
                <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase text-amber-300">
                  Premium
                </span>
              )}
            </div>
            <h2 className="mt-2 text-lg font-semibold text-white">{c.label}</h2>
            <p className="mt-1 text-[13px] text-white/55">{c.longDescription}</p>
            <p className="mt-2 text-[11px] uppercase tracking-wide text-white/35">{c.membersHint}</p>
          </article>
        ))}
      </div>

      {isLoggedIn ? (
        <section className="randki-glass mt-10 p-6">
          <h2 className="text-lg font-semibold text-white">Twój krąg</h2>
          <div className="mt-4">
            <RandkiCirclePicker initialSlug={myCircle} isPremium={isPremium} />
          </div>
        </section>
      ) : (
        <div className="mt-10 text-center">
          <Link href={randkiPublicHref("/rejestracja")} className="randki-btn-primary inline-block px-8 py-3">
            Dołącz, żeby wybrać krąg
          </Link>
        </div>
      )}
    </main>
  );
}
