import Link from "next/link";
import { notFound } from "next/navigation";
import { resolveGuestRoom } from "@/lib/randki/guestRoom";
import { readGuestSession } from "@/lib/randki/guestSession";
import { todayStateLabel } from "@/lib/randki/todayState";
import { getRoomClimateForCard } from "@/lib/randki/roomClimate";
import { resolveDayPhaseMeta } from "@/lib/randki/dayRhythm";
import { pickSharedListeningFromCard } from "@/lib/randki/sharedListening";
import { listLatestTraceByRooms } from "@/lib/randki/presenceTraces";
import { RandkiGuestRoomClient } from "@/components/randki/RandkiGuestRoomClient";
import { randkiPublicHref } from "@/lib/randkiPaths";

type PageProps = {
  params: { id: string };
  searchParams?: { phase?: string; guest?: string };
};

export default async function RandkiGuestRoomPage({ params, searchParams }: PageProps) {
  const view = await resolveGuestRoom(params.id, searchParams?.phase);
  if (!view) notFound();

  const guest = await readGuestSession();
  const climate = getRoomClimateForCard(view.card);
  const quote = view.card.prompts[0]?.answer ?? view.card.whyReason;
  const micro = todayStateLabel(view.card.todayState);
  const inRoom = guest.roomId === view.roomId;
  const phase = resolveDayPhaseMeta(searchParams?.phase);
  const listening = pickSharedListeningFromCard(view.card, phase.id);
  const traces = await listLatestTraceByRooms([view.roomId]);
  const recentTrace = traces.get(view.roomId) ?? null;

  return (
    <main className="mx-auto max-w-[1400px] px-4 py-8">
      <p className="mb-6 text-center">
        <Link href={randkiPublicHref("/gosc")} className="text-[12px] text-white/40 hover:text-white/70">
          ← inne pokoje
        </Link>
      </p>
      <RandkiGuestRoomClient
        roomId={view.roomId}
        displayName={view.card.displayName.split("·")[0]?.trim() ?? view.card.displayName}
        climateId={climate.id}
        climateLabel={climate.label}
        quote={quote}
        microState={micro}
        guestAlias={inRoom ? guest.alias : null}
        isGuest={inRoom || searchParams?.guest === "1"}
        voiceIntroUrl={view.card.voiceIntroUrl}
        listening={listening}
        recentTrace={recentTrace}
        ephemeralExpiresAt={view.card.ephemeralExpiresAt ?? null}
        ephemeralDurationLabel={view.card.ephemeralDurationLabel ?? null}
      />
    </main>
  );
}
