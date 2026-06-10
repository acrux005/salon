"use client";

import type { AmbientPanelContext } from "@/lib/randki/ambientPresence";
import { climateClass } from "@/lib/randki/roomClimate";
import { RandkiClimateScene } from "@/components/randki/RandkiClimateScene";
import { useRandkiAmbient } from "@/components/randki/RandkiAmbientPlayer";
import { AMBIENT_TRACK_META } from "@/lib/randki/ambientTracks";
import type { DayPhase } from "@/lib/randki/dayRhythm";

type Props = {
  ambient: AmbientPanelContext;
};

export function RandkiAmbientPresence({ ambient }: Props) {
  const { enabled, toggle, meta } = useRandkiAmbient();
  const phaseMeta = AMBIENT_TRACK_META[ambient.phase as DayPhase];

  return (
    <section className="randki-ambient-presence mb-5 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
      <div className="border-b border-white/10 px-4 py-4 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-violet-300/85">
          Obecność systemowa
        </p>
        <h2 className="mt-1 text-lg font-semibold text-white/90">{ambient.headline}</h2>
        <p className="mt-1 text-[12px] text-white/45">{ambient.subline}</p>
        <blockquote className="mx-auto mt-3 max-w-md text-[13px] italic text-white/55">
          &ldquo;{ambient.quote}&rdquo;
        </blockquote>

        <div className="mx-auto mt-4 max-w-sm">
          <button
            type="button"
            onClick={toggle}
            aria-pressed={enabled}
            className={`randki-ambient-presence-sound w-full rounded-xl border px-4 py-3 text-[13px] transition ${
              enabled
                ? "border-violet-400/30 bg-violet-500/12 text-violet-100"
                : "border-white/12 bg-white/[0.03] text-white/65 hover:border-white/20 hover:text-white/85"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              {enabled ? (
                <>
                  <span className="randki-ambient-status-wave inline-flex h-3 items-end gap-[2px]">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <span key={i} className="randki-ambient-status-bar w-[2px] rounded-full bg-violet-300/70" />
                    ))}
                  </span>
                  {meta.mood}
                </>
              ) : (
                <>🎧 Posłuchaj klimatu — {phaseMeta.mood}</>
              )}
            </span>
          </button>
          <p className="mt-2 text-[10px] text-white/30">Dźwięk buduje obecność bez udawania ludzi</p>
        </div>
      </div>

      <div className="grid gap-2 p-3 sm:grid-cols-3">
        {ambient.vignettes.map((v) => (
          <div
            key={v.id}
            className={`relative min-h-[120px] overflow-hidden rounded-xl border border-white/8 ${climateClass(v.climateId)}`}
          >
            <RandkiClimateScene climateId={v.climateId} />
            <div className="relative flex h-full flex-col justify-between p-3">
              <div>
                <p className="text-[10px] text-white/40">
                  {v.emoji} {v.label}
                </p>
                <p className="mt-1 text-[12px] text-white/75">{v.line}</p>
              </div>
              <p className="mt-2 text-[10px] italic text-white/35">{v.trace}</p>
            </div>
          </div>
        ))}
      </div>

      {ambient.feedItems.length > 0 && (
        <ul className="border-t border-white/10 px-4 py-3">
          {ambient.feedItems.slice(0, 4).map((item) => (
            <li key={item.id} className="flex items-start gap-2 py-1.5 text-[12px] text-white/50">
              <span aria-hidden>{item.emoji}</span>
              <span>
                {item.text}
                <span className="ml-1 text-white/30">· {item.ago}</span>
              </span>
            </li>
          ))}
        </ul>
      )}

      <p className="border-t border-white/10 px-4 py-3 text-center text-[11px] text-white/35">
        Prawdziwe pokoje pojawią się, gdy ktoś zostawi ślad — portal żyje nawet w ciszy.
      </p>
    </section>
  );
}
