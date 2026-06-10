"use client";

import dynamic from "next/dynamic";
import { useMemo, useRef, useState, useTransition } from "react";
import { deleteDatingPhotoAction, reorderDatingPhotoAction, saveDatingProfileAction, uploadDatingPhotoAction } from "@/app/actions/randki";
import {
  RANDKI_GENDERS,
  RANDKI_LOOKING_FOR,
  RANDKI_PROMPT_TEMPLATES,
  getPromptAnswerHint,
} from "@/lib/randki/constants";
import { buildLiveRoomPreview } from "@/lib/randki/roomTypes";
import { RandkiInterestPicker } from "@/components/randki/RandkiInterestPicker";
const RandkiProfileRoomPreview = dynamic(
  () => import("@/components/randki/RandkiProfileRoomPreview").then((m) => m.RandkiProfileRoomPreview),
  {
    ssr: false,
    loading: () => (
      <div className="randki-room-live-preview rounded-2xl border border-white/10 bg-black/20 p-8 text-center text-[13px] text-white/45">
        Ładuję podgląd pokoju…
      </div>
    ),
  }
);
import { getAllowedCities } from "@/lib/voivodeships";
import type { VibeMaterialRow } from "@/lib/randki/vibeMaterialTypes";
import type { VibeCatalogRow } from "@/lib/randki/vibeCatalogTypes";
import { RandkiVibeMaterialEditor } from "@/components/randki/RandkiVibeMaterialEditor";
import { RandkiVoiceIntroSection } from "@/components/randki/RandkiVoiceIntroSection";
import { RandkiDailyMomentBanner } from "@/components/randki/RandkiDailyMomentBanner";
import { RandkiMomentGuestPreview } from "@/components/randki/RandkiMomentGuestPreview";
import { RandkiAuraEditor } from "@/components/randki/RandkiAuraEditor";
import { RandkiRoomPhaseEditor } from "@/components/randki/RandkiRoomPhaseEditor";
import { prepareImageForUpload } from "@/lib/randki/prepareClientImage";
import { DAY_PHASE_ORDER, DAY_PHASES, type DayPhase } from "@/lib/randki/dayRhythm";
import {
  applyRoomPhaseToLivePreview,
  parseRoomPhasesJson,
  type UserRoomPhasesMap,
} from "@/lib/randki/roomPhases";
import { useRandkiDayPhase } from "@/lib/randki/useRandkiDayPhase";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const CITIES = getAllowedCities();

type PhotoItem = { id: string; url: string };

type Initial = {
  displayName: string;
  birthYear: number;
  city: string;
  gender: string;
  bio: string;
  photoUrl: string | null;
  photos: PhotoItem[];
  searchAllCities: boolean;
  profileActive: boolean;
  ageMinPref: number;
  ageMaxPref: number;
  lookingFor: string[];
  interests: string[];
  prompts: { question: string; answer: string }[];
  voiceIntroUrl: string | null;
  vibeMaterials: VibeMaterialRow[];
  vibeCatalog: VibeCatalogRow[];
  userMood: string | null;
  dailyMomentUrl: string | null;
  dailyMomentSecondaryUrl: string | null;
  hasMomentToday: boolean;
  auraImageUrl: string | null;
  auraImageUrl2: string | null;
  auraImageUrl3: string | null;
  auraCaption: string;
  auraPrompt: string;
  roomPhasesJson?: string;
};

export function RandkiProfileForm({ initial }: { initial: Initial }) {
  const [saving, startSave] = useTransition();
  const [uploading, startUpload] = useTransition();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<PhotoItem[]>(initial.photos);
  const [voiceUrl, setVoiceUrl] = useState<string | null>(initial.voiceIntroUrl);
  const [vibeMaterials, setVibeMaterials] = useState<VibeMaterialRow[]>(initial.vibeMaterials);
  const [dailyMoment, setDailyMoment] = useState({
    url: initial.dailyMomentUrl,
    secondaryUrl: initial.dailyMomentSecondaryUrl,
  });
  const [aura, setAura] = useState({
    imageUrl: initial.auraImageUrl,
    imageUrl2: initial.auraImageUrl2 ?? null,
    imageUrl3: initial.auraImageUrl3 ?? null,
    caption: initial.auraCaption,
    prompt: initial.auraPrompt,
  });
  const [photosOpen, setPhotosOpen] = useState(false);
  const [view, setView] = useState<"guest" | "edit">("guest");
  const [previewPhase, setPreviewPhase] = useState<DayPhase | null>(null);
  const liveDayPhase = useRandkiDayPhase();
  const [roomPhases, setRoomPhases] = useState<UserRoomPhasesMap>(() =>
    parseRoomPhasesJson(initial.roomPhasesJson ?? "{}")
  );
  const [form, setForm] = useState({
    displayName: initial.displayName,
    birthYear: String(initial.birthYear),
    city: initial.city,
    gender: initial.gender,
    bio: initial.bio,
    searchAllCities: initial.searchAllCities,
    profileActive: initial.profileActive,
    ageMinPref: String(initial.ageMinPref),
    ageMaxPref: String(initial.ageMaxPref),
    lookingFor: initial.lookingFor.length ? initial.lookingFor : ["woman", "man"],
    interests: initial.interests,
    promptQ1: initial.prompts[0]?.question ?? RANDKI_PROMPT_TEMPLATES[0],
    promptA1: initial.prompts[0]?.answer ?? "",
    promptQ2: initial.prompts[1]?.question ?? RANDKI_PROMPT_TEMPLATES[1],
    promptA2: initial.prompts[1]?.answer ?? "",
  });

  const previewPhaseId = previewPhase ?? liveDayPhase.id;

  const liveRoom = useMemo(() => {
    const base = buildLiveRoomPreview({
      displayName: form.displayName,
      birthYear: Number(form.birthYear) || initial.birthYear,
      city: form.city,
      bio: form.bio,
      mood: initial.userMood,
      voiceIntroUrl: voiceUrl,
      vibeMaterials,
      interests: form.interests,
      prompts: [
        { question: form.promptQ1, answer: form.promptA1 },
        { question: form.promptQ2, answer: form.promptA2 },
      ],
      photos,
      dailyMomentUrl: dailyMoment.url,
      dailyMomentSecondaryUrl: dailyMoment.secondaryUrl,
      gender: form.gender,
      auraImageUrl: aura.imageUrl,
      auraImageUrl2: aura.imageUrl2,
      auraImageUrl3: aura.imageUrl3,
      auraCaption: aura.caption,
      auraPrompt: aura.prompt,
    });
    return applyRoomPhaseToLivePreview(base, roomPhases, previewPhaseId);
  }, [
    form,
    voiceUrl,
    vibeMaterials,
    photos,
    dailyMoment,
    aura,
    initial.birthYear,
    initial.userMood,
    roomPhases,
    previewPhaseId,
  ]);

  function resolvePhoto(url: string | null) {
    if (!url) return "";
    return url.startsWith("http") ? url : `${BASE_PATH}${url}`;
  }

  function toggleLooking(value: string) {
    setForm((p) => ({
      ...p,
      lookingFor: p.lookingFor.includes(value) ? p.lookingFor.filter((x) => x !== value) : [...p.lookingFor, value],
    }));
  }

  function setInterests(interests: string[]) {
    setForm((p) => ({ ...p, interests }));
  }

  function save() {
    startSave(async () => {
      setMessage("");
      setError("");
      const fd = new FormData();
      fd.set("displayName", form.displayName);
      fd.set("birthYear", form.birthYear);
      fd.set("city", form.city);
      fd.set("gender", form.gender);
      fd.set("bio", form.bio);
      form.lookingFor.forEach((v) => fd.append("lookingFor", v));
      form.interests.forEach((v) => fd.append("interests", v));
      fd.set("promptQ1", form.promptQ1);
      fd.set("promptA1", form.promptA1);
      fd.set("promptQ2", form.promptQ2);
      fd.set("promptA2", form.promptA2);
      fd.set("searchAllCities", form.searchAllCities ? "1" : "0");
      fd.set("profileActive", form.profileActive ? "1" : "0");
      fd.set("ageMinPref", form.ageMinPref);
      fd.set("ageMaxPref", form.ageMaxPref);
      const res = await saveDatingProfileAction(fd);
      if (res.ok) setMessage("Pokój zapisany.");
      else setError(res.error);
    });
  }

  function uploadPhoto() {
    const file = fileRef.current?.files?.[0];
    if (!file) {
      setError("Wybierz zdjęcie.");
      return;
    }
    startUpload(async () => {
      setError("");
      try {
        const prepared = await prepareImageForUpload(file);
        const fd = new FormData();
        fd.set("photo", prepared);
        const res = await uploadDatingPhotoAction(fd);
        if (res.ok) {
          setPhotos((prev) => [...prev, { id: `new-${Date.now()}`, url: res.url }]);
          setMessage("Zdjęcie dodane do galerii.");
          if (fileRef.current) fileRef.current.value = "";
        } else setError(res.error);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Nie udało się przygotować zdjęcia.");
      }
    });
  }

  function removePhoto(id: string) {
    startUpload(async () => {
      if (id.startsWith("new-")) {
        setPhotos((prev) => prev.filter((p) => p.id !== id));
        return;
      }
      const res = await deleteDatingPhotoAction(id);
      if (res.ok) {
        setPhotos((prev) => prev.filter((p) => p.id !== id));
        setMessage("Zdjęcie usunięte.");
      } else setError(res.error);
    });
  }

  function movePhoto(id: string, direction: "up" | "down") {
    startUpload(async () => {
      setError("");
      const res = await reorderDatingPhotoAction(id, direction);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setPhotos((prev) => {
        const idx = prev.findIndex((p) => p.id === id);
        if (idx < 0) return prev;
        const swapIdx = direction === "up" ? idx - 1 : idx + 1;
        if (swapIdx < 0 || swapIdx >= prev.length) return prev;
        const next = [...prev];
        [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
        return next;
      });
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-1.5">
        {DAY_PHASE_ORDER.map((phase) => {
          const pMeta = DAY_PHASES[phase];
          return (
            <button
              key={phase}
              type="button"
              onClick={() => setPreviewPhase(phase === previewPhase ? null : phase)}
              className={`rounded-full border px-2.5 py-1 text-[10px] ${
                previewPhaseId === phase
                  ? "border-rose-400/40 bg-rose-500/15 text-white"
                  : "border-white/10 text-white/45"
              }`}
            >
              Podgląd: {pMeta.emoji} {pMeta.label}
            </button>
          );
        })}
      </div>

      <RandkiProfileRoomPreview
        room={liveRoom}
        resolveUrl={resolvePhoto}
        view={view}
        onViewChange={setView}
        phaseLabel={DAY_PHASES[previewPhaseId].label}
      />

      {view === "guest" ? (
        <div className="rounded-2xl border border-white/10 bg-randki-card/60 px-5 py-6 text-center">
          <p className="text-[14px] text-white/60">
            Tak widzą Cię goście — w aktualnej porze dnia ({liveDayPhase.label.toLowerCase()}).
          </p>
          <button type="button" onClick={() => setView("edit")} className="randki-btn-primary mt-4">
            Ustaw pokój
          </button>
        </div>
      ) : (
        <>
      <div className="randki-room-edit-section">
        <RandkiRoomPhaseEditor
          initialPhases={roomPhases}
          onChange={setRoomPhases}
        />
      </div>

      <div className="randki-room-edit-section">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-amber-200/70">🪟 Okno · daily moment</p>
        <p className="mt-0.5 text-[12px] text-white/45">To, co widać przez okno — tylko dziś.</p>
        <div className="mt-3">
          <RandkiDailyMomentBanner
            hasMomentToday={initial.hasMomentToday || !!dailyMoment.url}
            momentUrl={dailyMoment.url}
            momentSecondaryUrl={dailyMoment.secondaryUrl}
            onMomentChange={(m) => setDailyMoment(m ?? { url: null, secondaryUrl: null })}
          />
          {(initial.hasMomentToday || dailyMoment.url) && (
            <RandkiMomentGuestPreview
              momentUrl={dailyMoment.url}
              momentSecondaryUrl={dailyMoment.secondaryUrl}
            />
          )}
        </div>
      </div>

      <div className="randki-room-edit-section">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-violet-200/80">✨ Aura</p>
        <p className="mt-0.5 text-[12px] text-white/45">Nie zdjęcie profilowe. Raczej emocja, która świeci w pokoju.</p>
        <div className="mt-3">
          <RandkiAuraEditor
            gender={form.gender}
            initialImageUrl={initial.auraImageUrl}
            initialImageUrl2={initial.auraImageUrl2}
            initialImageUrl3={initial.auraImageUrl3}
            initialCaption={initial.auraCaption}
            initialPrompt={initial.auraPrompt}
            onChange={(data) =>
              setAura({
                imageUrl: data.imageUrls[0],
                imageUrl2: data.imageUrls[1],
                imageUrl3: data.imageUrls[2],
                caption: data.caption,
                prompt: data.prompt,
              })
            }
          />
        </div>
      </div>

      <div className="randki-room-edit-section">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-amber-200/70">🎙 Gramofon</p>
        <p className="mt-0.5 text-[12px] text-white/45">Twój głos — pierwsze, co słychać w pokoju.</p>
        <div className="mt-3">
          <RandkiVoiceIntroSection
            initialUrl={initial.voiceIntroUrl}
            onMessage={setMessage}
            onError={setError}
            onUrlChange={setVoiceUrl}
          />
        </div>
      </div>

      <div className="randki-room-edit-section">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-violet-200/70">📼 Projektor · klimat</p>
        <p className="mt-0.5 text-[12px] text-white/45">Muzyka, sceny, filmy — co leci w tle Twojego pokoju.</p>
        <div className="mt-3">
          <RandkiVibeMaterialEditor
            initialMaterials={initial.vibeMaterials}
            catalog={initial.vibeCatalog}
            userMood={initial.userMood}
            onMaterialsChange={setVibeMaterials}
          />
        </div>
      </div>

      <section className="randki-room-edit-section space-y-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-amber-100/80">📝 Karteczki na ścianie</p>
          <p className="mt-0.5 text-[13px] text-white/45">
            Fragmenty myśli — jedna scena, nie checklista cech.
          </p>
        </div>
        {(
          [
            ["promptQ1", "promptA1"],
            ["promptQ2", "promptA2"],
          ] as const
        ).map(([qk, ak], idx) => (
          <div key={qk}>
            <select
              className="randki-input"
              value={form[qk]}
              onChange={(e) => setForm((p) => ({ ...p, [qk]: e.target.value }))}
            >
              {RANDKI_PROMPT_TEMPLATES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <textarea
              rows={2}
              className="randki-input mt-2"
              value={form[ak]}
              onChange={(e) => setForm((p) => ({ ...p, [ak]: e.target.value }))}
              placeholder={getPromptAnswerHint(form[qk])}
            />
          </div>
        ))}
      </section>

      <section className="randki-room-edit-section">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-rose-100/80">📚 Półka</p>
        <p className="mt-0.5 text-[12px] text-randki-muted">Mikrotagi — rzeczy które tworzą Ciebie.</p>
        <div className="mt-3">
          <RandkiInterestPicker value={form.interests} onChange={setInterests} />
        </div>
      </section>

      <details className="randki-room-edit-section bg-randki-card/80">
        <summary>🚪 Drzwi — kto może wejść</summary>
        <div className="mt-4 space-y-4">
        <div>
          <label className="text-[13px] font-medium">Imię / pseudonim</label>
          <input className="randki-input" value={form.displayName} onChange={(e) => setForm((p) => ({ ...p, displayName: e.target.value }))} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-[13px] font-medium">Rok urodzenia</label>
            <input type="number" className="randki-input" value={form.birthYear} onChange={(e) => setForm((p) => ({ ...p, birthYear: e.target.value }))} />
          </div>
          <div>
            <label className="text-[13px] font-medium">Miasto</label>
            <select className="randki-input" value={form.city} onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}>
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="text-[13px] font-medium">Płeć</label>
          <select className="randki-input" value={form.gender} onChange={(e) => setForm((p) => ({ ...p, gender: e.target.value }))}>
            {RANDKI_GENDERS.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[13px] font-medium">Szukam</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {RANDKI_LOOKING_FOR.map((g) => (
              <label key={g.value} className="flex cursor-pointer items-center gap-2 rounded-full border border-rose-100 px-3 py-1.5 text-[13px]">
                <input type="checkbox" checked={form.lookingFor.includes(g.value)} onChange={() => toggleLooking(g.value)} />
                {g.label}
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="text-[13px] font-medium">O mnie <span className="font-normal text-randki-muted">(opcjonalnie — klimat mówi więcej)</span></label>
          <textarea rows={3} className="randki-input" value={form.bio} onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))} placeholder="Kilka zdań, jeśli chcesz…" />
        </div>
        <label className="flex cursor-pointer items-center gap-2 pt-2">
          <input
            type="checkbox"
            checked={form.searchAllCities}
            onChange={(e) => setForm((p) => ({ ...p, searchAllCities: e.target.checked }))}
          />
          <span className="text-[14px]">Szukaj też poza moim miastem (cała Polska)</span>
        </label>
        <div className="grid gap-4 pt-2 sm:grid-cols-2">
          <div>
            <label className="text-[13px] font-medium">Wiek od</label>
            <input type="number" min={18} max={99} className="randki-input" value={form.ageMinPref} onChange={(e) => setForm((p) => ({ ...p, ageMinPref: e.target.value }))} />
          </div>
          <div>
            <label className="text-[13px] font-medium">Wiek do</label>
            <input type="number" min={18} max={99} className="randki-input" value={form.ageMaxPref} onChange={(e) => setForm((p) => ({ ...p, ageMaxPref: e.target.value }))} />
          </div>
        </div>
        <label className="flex cursor-pointer items-center gap-2 pt-2">
          <input
            type="checkbox"
            checked={form.profileActive}
            onChange={(e) => setForm((p) => ({ ...p, profileActive: e.target.checked }))}
          />
          <span className="text-[14px]">Pokój otwarty — goście widzą Cię w Odkrywaj</span>
        </label>
        </div>
      </details>

      <details
        className="rounded-2xl border border-white/10 bg-randki-card/80 p-5"
        open={photosOpen}
        onToggle={(e) => setPhotosOpen((e.target as HTMLDetailsElement).open)}
      >
        <summary className="cursor-pointer list-none font-semibold text-randki-navy [&::-webkit-details-marker]:hidden">
          🖼 Polaroidy na ścianie <span className="ml-2 text-[12px] font-normal text-randki-muted">(opcjonalnie, max 6)</span>
        </summary>
        <p className="mt-2 text-[12px] text-randki-muted">Gość odkrywa je na końcu wizyty — nie na wejściu.</p>
        <div className="mt-3 flex flex-wrap gap-3">
          {photos.map((p, idx) => (
            <div key={p.id} className="relative h-24 w-24 overflow-hidden rounded-2xl bg-neutral-100">
              <img src={resolvePhoto(p.url)} alt="" className="h-full w-full object-cover" />
              <div className="absolute bottom-1 left-1 flex gap-0.5">
                {idx > 0 && (
                  <button type="button" onClick={() => movePhoto(p.id, "up")} className="rounded bg-black/50 px-1 text-[10px] text-white" title="W lewo">
                    ←
                  </button>
                )}
                {idx < photos.length - 1 && (
                  <button type="button" onClick={() => movePhoto(p.id, "down")} className="rounded bg-black/50 px-1 text-[10px] text-white" title="W prawo">
                    →
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={() => removePhoto(p.id)}
                className="absolute right-1 top-1 rounded-full bg-black/50 px-1.5 text-[11px] text-white"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif"
            capture="environment"
            className="text-[14px]"
          />
          <button type="button" onClick={uploadPhoto} disabled={uploading || photos.length >= 6} className="randki-btn-outline mt-2 text-[13px]">
            {uploading ? "Wgrywanie…" : "Dodaj zdjęcie"}
          </button>
        </div>
      </details>

      {message && <p className="text-[14px] text-green-700">{message}</p>}
      {error && <p className="text-[14px] text-red-600">{error}</p>}
      <button type="button" onClick={save} disabled={saving} className="randki-btn-primary">
        {saving ? "Zapisywanie…" : "Zapisz pokój"}
      </button>
        </>
      )}
    </div>
  );
}
