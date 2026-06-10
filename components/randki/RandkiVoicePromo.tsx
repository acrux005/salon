import Link from "next/link";
import { randkiPublicHref } from "@/lib/randkiPaths";

export function RandkiVoicePromo({ isEvening }: { isEvening?: boolean }) {
  return (
    <Link
      href={randkiPublicHref("/voice-match")}
      className="randki-voice-promo group relative mb-5 block overflow-hidden rounded-2xl border border-violet-400/30 bg-gradient-to-br from-violet-600/25 via-rose-600/15 to-violet-950/40 p-4 transition hover:border-violet-300/50"
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-violet-500/25 blur-2xl transition group-hover:bg-violet-400/35" />
      <div className="relative flex items-center gap-4">
        <div className="randki-voice-promo-btn flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-rose-500 text-2xl shadow-lg shadow-violet-500/40">
          🎙
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-bold text-white">Voice match</p>
          <p className="mt-0.5 text-[12px] leading-snug text-white/60">
            {isEvening ? "Wieczorem ktoś czeka na rozmowę — 5 min, bez presji." : "Szybkie 1:1 audio. Poznaj głos, nie zdjęcie."}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-white/15 px-3 py-1.5 text-[12px] font-semibold text-white group-hover:bg-white/25">
          Start →
        </span>
      </div>
      <div className="relative mt-3 flex h-6 items-end justify-center gap-1 opacity-60">
        {Array.from({ length: 20 }).map((_, i) => (
          <span
            key={i}
            className="randki-wave-bar w-[3px] rounded-full bg-gradient-to-t from-violet-400 to-rose-300"
            style={{ animationDelay: `${(i % 8) * 0.09}s` }}
          />
        ))}
      </div>
    </Link>
  );
}
