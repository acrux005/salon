import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { RANDKI_ROLE } from "@/lib/auth";
import { listLikesReceived } from "@/lib/randki/matching";
import { randkiPublicHref } from "@/lib/randkiPaths";
import { INTERACTION_COPY } from "@/lib/randki/presenceInteractions";
import { resonateWithRoomAction } from "@/app/actions/randki";

async function resonateBackAction(accountId: string) {
  "use server";
  const res = await resonateWithRoomAction(accountId);
  revalidatePath("/randki/polubienia");
  revalidatePath("/randki/dopasowania");
  if (res.ok && res.matched && res.matchId) {
    redirect(randkiPublicHref(`/przestrzen/${res.matchId}`));
  }
}

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default async function RandkiPolubieniaPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role;
  const accountId = (session?.user as { datingAccountId?: string })?.datingAccountId;
  if (role !== RANDKI_ROLE || !accountId) redirect("/randki/logowanie");

  const likes = await listLikesReceived(accountId);

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold text-randki-navy">{INTERACTION_COPY.resonanceReceived}</h1>
      <p className="mt-2 text-[14px] text-randki-muted">{INTERACTION_COPY.resonanceHint}</p>
      {likes.length === 0 ? (
        <p className="mt-8 text-[14px] text-randki-muted">{INTERACTION_COPY.resonanceEmpty}</p>
      ) : (
        <ul className="mt-8 space-y-4">
          {likes.map((l) => (
            <li key={l.fromAccountId} className="bg-randki-card flex items-center gap-4 p-4">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-neutral-100">
                {l.photoUrl ? (
                  <img
                    src={l.photoUrl.startsWith("http") ? l.photoUrl : `${BASE_PATH}${l.photoUrl}`}
                    alt={l.displayName}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-randki-navy">
                  {l.displayName}, {l.age}
                </p>
                <p className="text-[13px] text-randki-muted">{l.city}</p>
              </div>
              <form action={resonateBackAction.bind(null, l.fromAccountId)}>
                <button type="submit" className="randki-btn-primary text-[13px]">
                  {INTERACTION_COPY.resonanceBack}
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
      <Link href={randkiPublicHref("/panel")} className="mt-8 inline-block text-rose-600 hover:underline">
        ← Odkrywaj
      </Link>
    </main>
  );
}
