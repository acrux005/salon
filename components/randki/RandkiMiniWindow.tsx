"use client";

import { resolveRandkiMediaUrl, type PreviewVisual } from "@/lib/randki/visualPreview";

type Props = {
  visual: PreviewVisual;
  size?: "sm" | "md";
  className?: string;
};

export function RandkiMiniWindow({ visual, size = "sm", className = "" }: Props) {
  if (visual.kind === "none") return null;

  const main = resolveRandkiMediaUrl(visual.url);
  const secondary = resolveRandkiMediaUrl(visual.secondaryUrl ?? null);
  const dim = size === "sm" ? "h-[52px] w-[44px]" : "h-[72px] w-[60px]";

  return (
    <div
      className={`randki-mini-window pointer-events-none absolute right-2.5 top-2.5 overflow-hidden rounded-lg border border-amber-200/25 bg-black/40 shadow-lg shadow-black/40 ${dim} ${className}`}
      aria-hidden
    >
      <div className="randki-mini-window-glow absolute inset-0" />
      {visual.kind === "moment-photo" && main && (
        <>
          <img src={main} alt="" className="h-full w-full object-cover" />
          {secondary && (
            <img
              src={secondary}
              alt=""
              className="absolute bottom-0.5 left-0.5 h-4 w-3 rounded-sm border border-white/30 object-cover shadow"
            />
          )}
        </>
      )}
      {visual.kind === "aura" && main && (
        <img src={main} alt="" className="h-full w-full object-cover object-top opacity-90 mix-blend-screen" />
      )}
      {(visual.kind === "moment-audio" || visual.kind === "moment-voice") && (
        <div
          className={`flex h-full w-full flex-col items-center justify-center ${
            visual.kind === "moment-voice" ? "bg-rose-950/60" : "bg-violet-950/60"
          }`}
        >
          <span className="text-[14px]">{visual.kind === "moment-voice" ? "🎙" : "🔊"}</span>
          <div className="mt-1 flex h-3 items-end gap-[1px] px-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <span
                key={i}
                className="randki-voice-presence-bar w-[2px] rounded-full bg-white/50"
                style={{ animationDelay: `${i * 0.06}s` }}
              />
            ))}
          </div>
        </div>
      )}
      <span className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-1 py-0.5 text-[7px] uppercase tracking-wider text-amber-100/70">
        okno
      </span>
    </div>
  );
}
