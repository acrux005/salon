"use client";

import { useMemo, useState, useEffect } from "react";
import type { VibeMaterialRow } from "@/lib/randki/vibeMaterialTypes";
import { RandkiVibeMaterialDisplay } from "@/components/randki/RandkiVibeMaterialDisplay";
import { RandkiAuraDisplay } from "@/components/randki/RandkiAuraDisplay";
import { RandkiRoomLiveStrip } from "@/components/randki/RandkiRoomLiveStrip";
import { normalizeVibeMaterialKind } from "@/lib/randki/vibeMaterialSlots";
import { RANDKI_MOODS } from "@/lib/randki/onboarding";

import { hasAnyAuraPlaneImage, normalizeAuraPlaneImages } from "@/lib/randki/auraSilhouettes";
import type { RandkiRoomData } from "@/lib/randki/roomTypes";

export type { RandkiRoomData };

type Props = {
  room: RandkiRoomData;
  mode: "visit" | "preview";
  resolveUrl: (url: string | null) => string;
  photoRevealed?: boolean;
  onRevealPhotos?: () => void;
  fallbackPhoto?: string;
  compact?: boolean;
};

function moodLabel(value: string | null | undefined): string | null {
  if (!value) return null;
  return RANDKI_MOODS.find((m) => m.value === value)?.label ?? null;
}

function moodEmoji(value: string | null | undefined): string {
  if (!value) return "🌙";
  return RANDKI_MOODS.find((m) => m.value === value)?.emoji ?? "🌙";
}

const POLAROID_TILTS = [-2.8, 1.6, -1.2, 3.1, -0.5, 2.4];

export function RandkiRoom({
  room,
  mode,
  resolveUrl,
  photoRevealed: photoRevealedProp,
  onRevealPhotos,
  fallbackPhoto,
  compact,
}: Props) {
  const [photoIdx, setPhotoIdx] = useState(0);
  const [localRevealed, setLocalRevealed] = useState(mode === "preview");
  const [polaroidReveal, setPolaroidReveal] = useState<"idle" | "lifting" | "shown">("idle");
  const photoRevealed = photoRevealedProp ?? localRevealed;

  const moodMaterial = useMemo(
    () => room.vibeMaterials.find((m) => normalizeVibeMaterialKind(m.slotType) === "mood"),
    [room.vibeMaterials]
  );
  const projectorMaterials = useMemo(
    () => room.vibeMaterials.filter((m) => normalizeVibeMaterialKind(m.slotType) !== "mood"),
    [room.vibeMaterials]
  );

  const lampText = moodMaterial?.caption || moodMaterial?.title || room.bio?.slice(0, 120) || null;
  const moodName = moodLabel(room.mood);
  const photos = room.photoUrls.length > 0 ? room.photoUrls : fallbackPhoto ? [fallbackPhoto] : [];
  const isPresent = room.isPresent ?? mode === "visit";
  const polaroidTilt = POLAROID_TILTS[photoIdx % POLAROID_TILTS.length];
  const auraUrls = normalizeAuraPlaneImages(room.auraImageUrl, room.auraImageUrl2, room.auraImageUrl3);
  const hasAura = hasAnyAuraPlaneImage(auraUrls);
  const cinematic = !compact;

  function revealPhotos() {
    if (polaroidReveal !== "idle" || photoRevealed) return;
    setPolaroidReveal("lifting");
    window.setTimeout(() => {
      if (onRevealPhotos) onRevealPhotos();
      else setLocalRevealed(true);
      setPolaroidReveal("shown");
    }, 850);
  }

  useEffect(() => {
    if (!photoRevealedProp) setPolaroidReveal("idle");
  }, [photoRevealedProp, room.displayName]);

  const lampSection =
    moodName || lampText ? (
      <section
        className={`randki-room-zone randki-room-lamp randki-room-lamp--live${isPresent ? " randki-room-lamp--present" : ""}`}
      >
        <div className="randki-room-zone-icon">{moodEmoji(room.mood)}</div>
        <div>
          <p className="randki-room-zone-label">Lampka{isPresent ? " · świeci" : ""}</p>
          {moodName && <p className="randki-room-zone-title">{moodName}</p>}
          {lampText && <p className="randki-room-zone-body">&ldquo;{lampText}&rdquo;</p>}
        </div>
      </section>
    ) : null;

  const gramophoneSection = room.voiceIntroUrl ? (
    <section className="randki-room-zone randki-room-gramophone">
      <div className="randki-room-zone-icon">🎙</div>
      <div className="min-w-0 flex-1">
        <p className="randki-room-zone-label">Gramofon</p>
        <p className="randki-room-zone-hint">Posłuchaj — zanim ocenisz wygląd</p>
        <audio controls className="randki-room-audio mt-2 w-full" src={resolveUrl(room.voiceIntroUrl)} preload="none" />
      </div>
    </section>
  ) : null;

  const auraSection = hasAura ? (
    <RandkiAuraDisplay
      imageUrls={auraUrls}
      caption={room.auraCaption}
      gender={room.gender}
      resolveUrl={resolveUrl}
      compact={compact}
      hero={cinematic}
      legacyFill={mode !== "preview"}
    />
  ) : null;

  const projectorSection =
    projectorMaterials.length > 0 ? (
      <section className="randki-room-zone randki-room-projector">
        <p className="randki-room-zone-label mb-2">📼 Projektor</p>
        <RandkiVibeMaterialDisplay materials={projectorMaterials} compact discovery />
      </section>
    ) : null;

  const windowSection = room.dailyMomentUrl || room.dailyMomentAudioUrl ? (
    <section className="randki-room-zone randki-room-window">
      <p className="randki-room-zone-label">
        Okno · {room.dailyMomentType === "voice" ? "fragment głosu" : room.dailyMomentAudioUrl ? "dźwięk chwili" : "teraz"}
      </p>
      {room.dailyMomentAudioUrl ? (
        <div
          className={`relative mt-2 overflow-hidden rounded-xl border p-4 ${
            room.dailyMomentType === "voice"
              ? "border-rose-300/25 bg-gradient-to-br from-rose-950/40 to-violet-950/30"
              : "border-violet-200/20 bg-violet-950/30"
          }`}
        >
          <p className="text-[10px] uppercase tracking-wide text-white/50">
            {room.dailyMomentType === "voice" ? "🎙 głos · bez filtra" : "🔊 otoczenie"}
          </p>
          {room.dailyMomentType === "voice" && (
            <div className="randki-voice-presence-wave mt-2 flex h-10 items-end gap-[2px]">
              {Array.from({ length: 24 }).map((_, i) => (
                <span
                  key={i}
                  className="randki-voice-presence-bar w-[3px] rounded-full bg-gradient-to-t from-rose-600/50 to-rose-100/70"
                  style={{ animationDelay: `${(i % 8) * 0.07}s` }}
                />
              ))}
            </div>
          )}
          <audio controls preload="none" src={resolveUrl(room.dailyMomentAudioUrl)} className="mt-2 w-full" />
        </div>
      ) : (
        <div className="relative mt-2 overflow-hidden rounded-xl border border-amber-200/20">
          <img src={resolveUrl(room.dailyMomentUrl!)} alt="" className="aspect-[4/3] w-full object-cover" />
          {room.dailyMomentSecondaryUrl && (
            <img
              src={resolveUrl(room.dailyMomentSecondaryUrl)}
              alt=""
              className="randki-room-polaroid-mini absolute bottom-2 left-2 h-16 w-12 object-cover"
            />
          )}
        </div>
      )}
    </section>
  ) : null;

  const stickiesSection =
    room.prompts.length > 0 ? (
      <section className="randki-room-sticky-wall">
        <p className="randki-room-zone-label mb-3">📝 Karteczki</p>
        <div className="randki-room-stickies">
          {room.prompts.map((pr, idx) => (
            <div
              key={idx}
              className="randki-room-sticky"
              style={{ transform: `rotate(${idx % 2 === 0 ? -2 : 2.5}deg)` }}
            >
              <p className="text-[10px] font-medium uppercase tracking-wide text-amber-900/70">{pr.question}</p>
              <p className="mt-1.5 text-[13px] leading-snug text-amber-950/90">{pr.answer}</p>
            </div>
          ))}
        </div>
      </section>
    ) : null;

  const shelfSection =
    room.interests.length > 0 ? (
      <section className="randki-room-zone randki-room-shelf">
        <p className="randki-room-zone-label">📚 Półka</p>
        <div className="randki-room-shelf-items">
          {room.interests.map((tag) => (
            <span key={tag} className="randki-room-shelf-tag">
              {tag}
            </span>
          ))}
        </div>
      </section>
    ) : null;

  const polaroidSection = (
    <section className="randki-room-polaroid-wall">
      <p className="randki-room-zone-label">🖼 Na ścianie</p>
      {!photoRevealed ? (
        <div className={`randki-room-polaroid-veil ${polaroidReveal === "lifting" ? "randki-room-polaroid-veil--lifting" : ""}`}>
          <p className="text-[14px] font-medium text-white/90">Polaroidy zasłonięte</p>
          <p className="mt-2 max-w-[240px] text-[12px] leading-relaxed text-white/50">
            Najpierw posłuchaj, poczytaj karteczki — potem zobacz twarz.
          </p>
          {mode === "visit" && photos.length > 0 && (
            <button
              type="button"
              disabled={polaroidReveal === "lifting"}
              onClick={revealPhotos}
              className="randki-btn-primary mt-5 text-[13px]"
            >
              {polaroidReveal === "lifting" ? "Odsłaniam…" : "Rozejrzyj się — pokaż zdjęcia"}
            </button>
          )}
          {mode === "preview" && photos.length === 0 && (
            <p className="mt-3 text-[12px] text-white/40">Dodaj polaroidy w edycji pokoju.</p>
          )}
        </div>
      ) : photos.length > 0 ? (
        <div className="randki-room-polaroids">
          <div
            className={`randki-room-polaroid-main ${polaroidReveal === "shown" ? "randki-room-polaroid-main--enter" : ""}`}
            style={{ transform: `rotate(${polaroidTilt}deg)` }}
          >
            <span className="randki-room-polaroid-pin" aria-hidden />
            <span className="randki-room-polaroid-tape randki-room-polaroid-tape--left" aria-hidden />
            <span className="randki-room-polaroid-tape randki-room-polaroid-tape--right" aria-hidden />
            <div className="randki-room-polaroid-frame">
              <img src={resolveUrl(photos[photoIdx] ?? null)} alt="" className="aspect-[4/5] w-full object-cover" />
              <span className="randki-room-polaroid-grain" aria-hidden />
            </div>
            <p className="randki-room-polaroid-hand">{room.displayName.split(" ")[0]}</p>
            {photos.length > 1 && (
              <div className="mt-1 flex justify-center gap-3">
                <button
                  type="button"
                  className="text-[12px] text-stone-500 hover:text-stone-800"
                  onClick={() => setPhotoIdx((i) => (i > 0 ? i - 1 : photos.length - 1))}
                >
                  ‹
                </button>
                <span className="randki-room-polaroid-hand text-[11px] text-stone-400">
                  {photoIdx + 1}/{photos.length}
                </span>
                <button
                  type="button"
                  className="text-[12px] text-stone-500 hover:text-stone-800"
                  onClick={() => setPhotoIdx((i) => (i + 1) % photos.length)}
                >
                  ›
                </button>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </section>
  );

  const footerSection =
    photoRevealed && (room.age || room.city) && mode === "visit" ? (
      <footer className="randki-room-footer">
        <p className="text-[13px] text-white/45">
          {room.displayName}
          {room.age ? ` · ${room.age}` : ""}
          {room.city ? ` · ${room.city}` : ""}
        </p>
        {room.circleLabel && <p className="mt-1 text-[11px] text-violet-300/80">{room.circleLabel}</p>}
      </footer>
    ) : null;

  return (
    <article
      className={`randki-room${compact ? " randki-room--compact" : " randki-room--cinematic"}${mode === "visit" ? " randki-room--visit" : ""}`}
    >
      <div className="randki-room-ambient" aria-hidden />
      <div className="randki-room-depth" aria-hidden />
      <div className="randki-room-noise" aria-hidden />
      <div className="randki-room-rain" aria-hidden />

      <header className="randki-room-header">
        <p className="randki-room-kicker">{mode === "visit" ? "Wieczór · pokój" : "Międzyczas · pokój"}</p>
        <h2 className="randki-room-title">{room.displayName}</h2>
        {room.whyReason && mode === "visit" && (
          <p className="randki-room-whisper randki-room-emotion">{room.whyReason}</p>
        )}
        {mode === "preview" && <p className="randki-room-whisper">Tak widzą Cię w Wieczorze.</p>}
      </header>

      <RandkiRoomLiveStrip
        vibeMaterials={room.vibeMaterials}
        voiceIntroUrl={room.voiceIntroUrl}
        isPresent={isPresent}
      />

      <div className="randki-room-canvas">
        <aside className="randki-room-col randki-room-col--west">
          {lampSection}
          {gramophoneSection}
        </aside>

        <div className="randki-room-col randki-room-col--center">
          {auraSection}
          {projectorSection}
          {windowSection}
        </div>

        <aside className="randki-room-col randki-room-col--east">
          {stickiesSection}
          {shelfSection}
          {polaroidSection}
          {footerSection}
        </aside>
      </div>
    </article>
  );
}

export function discoveryCardToRoom(card: {
  displayName: string;
  age: number;
  city: string;
  whyReason: string;
  mood: string | null;
  voiceIntroUrl: string | null;
  vibeMaterials: VibeMaterialRow[];
  interests: string[];
  prompts: { question: string; answer: string }[];
  photoUrls: string[];
  bio: string;
  dailyMomentUrl: string | null;
  dailyMomentSecondaryUrl: string | null;
  dailyMomentAudioUrl?: string | null;
  dailyMomentType?: "photo" | "audio" | "voice" | null;
  dailyMomentAt: Date | null;
  circleLabel: string | null;
  hasFreshMoment: boolean;
  gender?: string | null;
  auraImageUrl?: string | null;
  auraImageUrl2?: string | null;
  auraImageUrl3?: string | null;
  auraCaption?: string | null;
  recentlyActive?: boolean;
}): RandkiRoomData {
  return {
    displayName: card.displayName,
    age: card.age,
    city: card.city,
    whyReason: card.whyReason,
    mood: card.mood,
    voiceIntroUrl: card.voiceIntroUrl,
    vibeMaterials: card.vibeMaterials,
    interests: card.interests,
    prompts: card.prompts,
    photoUrls: card.photoUrls,
    bio: card.bio,
    dailyMomentUrl: card.hasFreshMoment ? card.dailyMomentUrl : null,
    dailyMomentSecondaryUrl: card.hasFreshMoment ? card.dailyMomentSecondaryUrl : null,
    dailyMomentAudioUrl: card.hasFreshMoment ? card.dailyMomentAudioUrl ?? null : null,
    dailyMomentType: card.hasFreshMoment ? card.dailyMomentType ?? null : null,
    dailyMomentAt: card.hasFreshMoment ? card.dailyMomentAt : null,
    circleLabel: card.circleLabel,
    gender: card.gender,
    auraImageUrl: card.auraImageUrl ?? null,
    auraImageUrl2: card.auraImageUrl2 ?? null,
    auraImageUrl3: card.auraImageUrl3 ?? null,
    auraCaption: card.auraCaption ?? null,
    isPresent: card.recentlyActive ?? true,
  };
}
