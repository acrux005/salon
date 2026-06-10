import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { RANDKI_ROLE } from "@/lib/auth";
import { getPrisma } from "@/lib/db";
import { assertMatchParticipant, getMatchMessages } from "@/lib/randki/matching";
import { generateDatingDateSlots, listDateProposals } from "@/lib/randki/dateProposal";
import { getRoomDataForAccount } from "@/lib/randki/roomData";
import { RandkiChatClient } from "@/components/randki/RandkiChatClient";

export default async function RandkiChatPage({ params }: { params: { matchId: string } }) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role;
  const accountId = (session?.user as { datingAccountId?: string })?.datingAccountId;
  if (role !== RANDKI_ROLE || !accountId) redirect("/randki/logowanie");

  const ok = await assertMatchParticipant(params.matchId, accountId);
  if (!ok) notFound();

  const match = await getPrisma().datingMatch.findUnique({ where: { id: params.matchId } });
  if (!match) notFound();

  const otherAccountId = match.accountAId === accountId ? match.accountBId : match.accountAId;
  const otherProfile = await getPrisma().datingProfile.findUnique({
    where: { accountId: otherAccountId },
    select: { displayName: true, city: true },
  });
  const myProfile = await getPrisma().datingProfile.findUnique({
    where: { accountId },
    select: { city: true },
  });

  const [messages, proposals, matchMeta, otherRoom] = await Promise.all([
    getMatchMessages(params.matchId, accountId),
    listDateProposals(params.matchId, accountId),
    getPrisma().datingMatch.findUnique({
      where: { id: params.matchId },
      select: { icebreakersJson: true, compatibilityNote: true },
    }),
    getRoomDataForAccount(otherAccountId),
  ]);

  let icebreakers: string[] = [];
  try {
    icebreakers = JSON.parse(matchMeta?.icebreakersJson ?? "[]") as string[];
    if (!Array.isArray(icebreakers)) icebreakers = [];
  } catch {
    icebreakers = [];
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <RandkiChatClient
        matchId={params.matchId}
        myAccountId={accountId}
        otherAccountId={otherAccountId}
        otherName={otherProfile?.displayName ?? "Rozmowa"}
        myCity={myProfile?.city ?? otherProfile?.city ?? "Warszawa"}
        initialMessages={messages ?? []}
        initialProposals={proposals ?? []}
        initialIcebreakers={icebreakers}
        compatibilityNote={matchMeta?.compatibilityNote ?? null}
        otherRoom={otherRoom}
        dateSlots={generateDatingDateSlots()}
      />
    </main>
  );
}
