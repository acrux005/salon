import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { RANDKI_ROLE } from "@/lib/auth";
import { getPrisma } from "@/lib/db";
import { getPrivateSpaceMeta } from "@/lib/randki/presenceTraces";
import { getRoomClimateForCard } from "@/lib/randki/roomClimate";
import { getRoomDataForAccount } from "@/lib/randki/roomData";
import { resolveDayPhaseMeta } from "@/lib/randki/dayRhythm";
import { INTERACTION_COPY } from "@/lib/randki/presenceInteractions";
import { pickSharedListeningFromMaterials } from "@/lib/randki/sharedListening";
import { listVibeMaterials } from "@/lib/randki/vibeMaterial";
import { RandkiPrivateSpaceClient } from "@/components/randki/RandkiPrivateSpaceClient";
import { randkiPublicHref } from "@/lib/randkiPaths";

type PageProps = { params: { matchId: string } };

function paneFromRoom(
  room: NonNullable<Awaited<ReturnType<typeof getRoomDataForAccount>>>,
  climateId: ReturnType<typeof getRoomClimateForCard>["id"],
  climateLabel: string
) {
  return {
    name: room.displayName,
    climateId,
    climateLabel,
    quote: (room.prompts[0]?.answer ?? room.bio ?? "cisza w tle").slice(0, 100),
    auraUrl: room.auraImageUrl,
    momentUrl: room.dailyMomentUrl,
    momentAudioUrl: room.dailyMomentAudioUrl,
    momentType: room.dailyMomentType ?? null,
  };
}

export default async function RandkiPrivateSpacePage({ params }: PageProps) {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role;
  const accountId = (session?.user as { datingAccountId?: string })?.datingAccountId;
  if (role !== RANDKI_ROLE || !accountId) redirect("/randki/logowanie");

  const meta = await getPrivateSpaceMeta(params.matchId, accountId);
  if (!meta) notFound();

  const prisma = getPrisma();
  const messageCount = await prisma.datingMessage.count({ where: { matchId: params.matchId } });
  const [otherRoom, myRoom] = await Promise.all([
    getRoomDataForAccount(meta.otherId),
    getRoomDataForAccount(accountId),
  ]);
  if (!otherRoom || !myRoom) notFound();

  const [otherMaterials] = await Promise.all([listVibeMaterials(meta.otherId)]);
  const phase = resolveDayPhaseMeta();
  const listening = pickSharedListeningFromMaterials(
    otherMaterials.length ? otherMaterials : otherRoom.vibeMaterials,
    phase.id
  );

  const otherClimate = getRoomClimateForCard({
    roomClimateId: null,
    accountId: meta.otherId,
    prompts: otherRoom.prompts,
  } as never);
  const myClimate = getRoomClimateForCard({
    roomClimateId: null,
    accountId,
    prompts: myRoom.prompts,
  } as never);

  return (
    <main className="mx-auto max-w-[1400px] px-4 py-8">
      <p className="mb-6 text-center">
        <Link href={randkiPublicHref(`/czat/${params.matchId}`)} className="text-[12px] text-white/40 hover:text-white/70">
          {INTERACTION_COPY.writeQuietly} →
        </Link>
      </p>
      <RandkiPrivateSpaceClient
        matchId={params.matchId}
        other={paneFromRoom(otherRoom, otherClimate.id, otherClimate.label)}
        mine={paneFromRoom(myRoom, myClimate.id, myClimate.label)}
        otherAccountId={meta.otherId}
        listening={listening}
        privateSpaceAt={meta.privateSpaceAt?.toISOString() ?? null}
        messageCount={messageCount}
      />
    </main>
  );
}
