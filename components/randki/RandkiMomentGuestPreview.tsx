"use client";

import { resolveRandkiMediaUrl } from "@/lib/randki/visualPreview";

type Props = {
  momentUrl: string | null;
  momentSecondaryUrl?: string | null;
  momentKind?: "photo" | "audio" | "voice";
  audioUrl?: string | null;
};

export function RandkiMomentGuestPreview({ momentUrl, momentSecondaryUrl, momentKind = "photo", audioUrl }: Props) {
  const hasContent = !!(momentUrl || audioUrl);
  if (!hasContent) return null;

  const main = resolveRandkiMediaUrl(momentUrl);
  const secondary = resolveRandkiMediaUrl(momentSecondaryUrl ?? null);
  const audio = resolveRandkiMediaUrl(audioUrl ?? null);
  const isPhoto = momentKind === "photo" && main && !main.includes("moment-audio.svg");

  return (
    <div className="randki-moment-guest-preview mt-3 rounded-xl border border-amber-400/15 bg-black/25 p-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-200/75">
        Tak widzą goście · okno w pokoju
      </p>
      <div className="mt-2 overflow-hidden rounded-lg border border-amber-200/15 bg-gradient-to-b from-amber-950/20 to-black/40">
        <div className="border-b border-white/8 px-2 py-1 text-[9px] text-white/35">Wieczór · pokój · okno</div>
        {isPhoto && main ? (
          <div className="relative aspect-[4/3] max-h-[140px]">
            <img src={main} alt="" className="h-full w-full object-cover opacity-95" />
            {secondary && (
              <img
                src={secondary}
                alt=""
                className="absolute bottom-1.5 left-1.5 h-10 w-8 rounded-sm border border-white/25 object-cover"
              />
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-4">
            <span className="text-lg">{momentKind === "voice" ? "🎙" : "🔊"}</span>
            {audio && <audio controls preload="none" src={audio} className="h-8 max-w-full flex-1" />}
          </div>
        )}
      </div>
      <p className="mt-2 text-[10px] italic text-white/35">Bez liczników · znika po 24 h</p>
    </div>
  );
}
