import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { RANDKI_ROLE } from "@/lib/auth";
import { listMatches } from "@/lib/randki/matching";
import { getRoomDataForAccount } from "@/lib/randki/roomData";
import { RandkiMatchesList } from "@/components/randki/RandkiMatchesList";
import { INTERACTION_COPY } from "@/lib/randki/presenceInteractions";

export default async function RandkiDopasowaniaPage() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role;
  const accountId = (session?.user as { datingAccountId?: string })?.datingAccountId;
  if (role !== RANDKI_ROLE || !accountId) redirect("/randki/logowanie");

  const matches = await listMatches(accountId);
  const rooms = await Promise.all(
    matches.map((m) => getRoomDataForAccount(m.otherAccountId, { includeDailyMoment: true }))
  );

  const items = matches.map((m, i) => ({
    matchId: m.matchId,
    displayName: m.displayName,
    photoUrl: m.photoUrl,
    city: m.city,
    lastMessage: m.lastMessage,
    compatibilityNote: m.compatibilityNote,
    vibeSnippet: m.vibeSnippet,
    room: rooms[i],
  }));

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold text-white">{INTERACTION_COPY.matchesNav}</h1>
      <p className="mt-2 text-[14px] text-white/50">Wzajemne rezonanse — najpierw wspólna przestrzeń, potem słowa.</p>
      {items.length === 0 ? (
        <p className="bg-randki-card mt-8 p-6 text-[15px] text-randki-muted">Na razie cisza — odwiedź Odkrywaj i zostaw ślad w pokoju, który rezonuje.</p>
      ) : (
        <RandkiMatchesList matches={items} />
      )}
    </main>
  );
}
