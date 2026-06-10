import Link from "next/link";
import { RandkiClimateScene } from "@/components/randki/RandkiClimateScene";
import { climateClass } from "@/lib/randki/roomClimate";
import type { LandingPeekRoom } from "@/lib/randki/landingPeekRooms";
import { landingPeekSectionTitle } from "@/lib/randki/landingPeekRooms";
import type { DayPhase } from "@/lib/randki/dayRhythm";
import { DAY_PHASES } from "@/lib/randki/dayRhythm";
import { randkiPublicHref } from "@/lib/randkiPaths";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

function resolveUrl(url: string | null): string | null {
  if (!url) return null;
  return url.startsWith("http") ? url : `${BASE_PATH}${url}`;
}

function PeekRoomCard({ room }: { room: LandingPeekRoom }) {
  const preview = resolveUrl(room.momentUrl ?? room.auraUrl);

  return (
    <article
      className={`randki-peek-room group relative overflow-hidden rounded-2xl border border-white/10 ${climateClass(room.climateId)}`}
    >
      <RandkiClimateScene climateId={room.climateId} />
      <div className="randki-peek-room-vignette pointer-events-none absolute inset-0" aria-hidden />

      {preview && (
        <div className="randki-peek-room-glimpse pointer-events-none absolute inset-0" aria-hidden>
          <img src={preview} alt="" className="h-full w-full object-cover opacity-35 blur-2xl scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0612] via-[#0a0612]/80 to-transparent" />
        </div>
      )}

      <div className="relative flex min-h-[220px] flex-col justify-between p-4 sm:min-h-[240px] sm:p-5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/45">
            {room.climateEmoji} {room.climateLabel}
          </p>
          <h3 className="mt-1.5 text-lg font-semibold text-white/95">
            {room.firstName}
            <span className="ml-2 text-[13px] font-normal tabular-nums text-white/40">· {room.timeLabel}</span>
          </h3>
          <p className="mt-2 line-clamp-2 text-[13px] italic leading-snug text-white/72">„{room.quote}”</p>
        </div>

        <div className="mt-4 space-y-2">
          <p className="truncate text-[11px] text-violet-200/75">🎵 {room.musicLine}</p>
          <p className="text-[11px] text-amber-200/65">💡 lampka: {room.lampLabel}</p>

          <div className="randki-peek-moment overflow-hidden rounded-xl border border-white/10 bg-black/30">
            <p className="border-b border-white/8 px-2.5 py-1 text-[9px] uppercase tracking-[0.12em] text-white/35">
              daily moment
            </p>
            <div className="relative aspect-[5/2] max-h-[72px] overflow-hidden">
              {preview ? (
                <img src={preview} alt="" className="h-full w-full scale-105 object-cover blur-md brightness-75 saturate-50" />
              ) : (
                <div className="flex h-full items-center justify-center bg-violet-950/40 text-[10px] text-white/30">
                  światło · aura
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-[#0c0814]/90 via-[#0c0814]/50 to-transparent" />
              <p className="absolute bottom-1.5 left-2.5 text-[9px] text-white/45">rozmyte · bez twarzy</p>
            </div>
          </div>

          <Link
            href={randkiPublicHref("/rejestracja")}
            className="randki-peek-room-cta mt-1 inline-flex w-full items-center justify-center rounded-xl border border-white/15 bg-white/[0.06] px-4 py-2.5 text-[13px] font-medium text-white/85 transition hover:border-rose-400/35 hover:bg-rose-500/10 hover:text-white"
          >
            Zajrzyj do pokoju
          </Link>
        </div>
      </div>
    </article>
  );
}

type Props = {
  phase: DayPhase;
  rooms: LandingPeekRoom[];
};

export function RandkiLandingPeekCorridor({ phase, rooms }: Props) {
  if (rooms.length === 0) return null;
  const meta = DAY_PHASES[phase];

  return (
    <section className={`randki-peek-corridor border-y border-white/5 px-4 py-14 sm:py-16 ${meta.id ? `randki-day-phase--${phase}` : ""}`}>
      <div className="mx-auto max-w-5xl">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-300/85">
          Korytarz pokoi
        </p>
        <h2 className="mt-2 text-center text-2xl font-bold text-white sm:text-3xl">{landingPeekSectionTitle(phase)}</h2>
        <p className="mx-auto mt-3 max-w-lg text-center text-[15px] leading-relaxed text-white/55">
          Zajrzyj do świata — poczuj klimat, muzykę, obecność.{" "}
          <span className="text-white/75">Bez pełnych profili. Bez scrolla ludzi.</span>
        </p>
        <p className="mx-auto mt-2 text-center text-[12px] text-white/35">
          {meta.emoji} {meta.energy}
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <PeekRoomCard key={room.id} room={room} />
          ))}
        </div>

        <p className="mx-auto mt-8 max-w-md text-center text-[12px] italic text-white/35">
          obecność, nie performance — dopiero po wejściu poznasz człowieka.
        </p>
      </div>
    </section>
  );
}
