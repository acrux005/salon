import { resolveDayPhaseMeta } from "@/lib/randki/dayRhythm";
import { listGuestEntryRooms } from "@/lib/randki/guestRoom";
import { shouldShowDemoDiscoveryRooms } from "@/lib/randki/demoDiscoveryCards";
import { RandkiGuestLandingClient } from "@/components/randki/RandkiGuestRoomClient";
import Link from "next/link";
import { randkiPublicHref } from "@/lib/randkiPaths";

type PageProps = {
  searchParams?: { phase?: string };
};

export default function RandkiGuestPage({ searchParams }: PageProps) {
  const dayPhase = resolveDayPhaseMeta(searchParams?.phase);
  const rooms = shouldShowDemoDiscoveryRooms() ? listGuestEntryRooms(dayPhase.id) : [];

  return (
    <main className="mx-auto max-w-[1400px] px-4 py-8">
      <div className="mb-8 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-300/80">Bez profilu</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Dołącz do pokoju</h1>
        <p className="mt-2 text-[14px] text-white/45">Obecność, nie performance — {dayPhase.emoji} {dayPhase.label}</p>
      </div>

      {rooms.length > 0 ? (
        <RandkiGuestLandingClient rooms={rooms} phaseLabel={dayPhase.label} />
      ) : (
        <p className="text-center text-white/50">
          Gościnne pokoje są dostępne w trybie demo.{" "}
          <Link href={randkiPublicHref("/logowanie")} className="text-rose-300 underline">
            Zaloguj się
          </Link>
        </p>
      )}
    </main>
  );
}
