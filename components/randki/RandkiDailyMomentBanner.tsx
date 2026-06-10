"use client";

import { useRef, useState, useTransition } from "react";
import { uploadDailyMomentAction, uploadDailyMomentAudioAction, uploadVoiceFragmentMomentAction } from "@/app/actions/randki";
import { extractClientCaptureDate, getFileModifiedCaptureDate } from "@/lib/randki/extractClientCaptureDate";
import { prepareImageForUpload } from "@/lib/randki/prepareClientImage";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function RandkiDailyMomentBanner({
  hasMomentToday,
  momentUrl,
  momentSecondaryUrl,
  capturedAt,
  onMomentChange,
  compact = false,
}: {
  hasMomentToday: boolean;
  momentUrl: string | null;
  momentSecondaryUrl?: string | null;
  capturedAt?: string | null;
  onMomentChange?: (moment: { url: string; secondaryUrl: string | null } | null) => void;
  compact?: boolean;
}) {
  const worldRef = useRef<HTMLInputElement>(null);
  const selfieRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLInputElement>(null);
  const voiceRef = useRef<HTMLInputElement>(null);
  const [pending, start] = useTransition();
  const [url, setUrl] = useState(momentUrl);
  const [secondaryUrl, setSecondaryUrl] = useState(momentSecondaryUrl ?? null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [ts, setTs] = useState(capturedAt);
  const [worldPick, setWorldPick] = useState(false);
  const [selfiePick, setSelfiePick] = useState(false);
  const [audioPick, setAudioPick] = useState(false);
  const [voicePick, setVoicePick] = useState(false);
  const [mode, setMode] = useState<"photo" | "audio" | "voice">("photo");
  const [momentKind, setMomentKind] = useState<"photo" | "audio" | "voice">("photo");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const progress = url || hasMomentToday ? 100 : worldPick ? (selfiePick ? 90 : 50) : 0;

  function uploadAudio() {
    const audio = audioRef.current?.files?.[0];
    if (!audio) {
      setErr("Nagraj krótki fragment dźwięku.");
      return;
    }
    start(async () => {
      setErr("");
      setMsg("");
      try {
        const fd = new FormData();
        fd.set("momentAudio", audio);
        const res = await uploadDailyMomentAudioAction(fd);
        if (!res.ok) {
          setErr(res.error);
          return;
        }
        setAudioUrl(res.audioUrl);
        setUrl("/randki/moment-audio.svg");
        setMomentKind("audio");
        setTs(res.capturedAt);
        setMsg("Dźwięk chwili — widoczny 24 h.");
        onMomentChange?.({ url: "/randki/moment-audio.svg", secondaryUrl: null });
        if (audioRef.current) audioRef.current.value = "";
      } catch (e) {
        setErr(e instanceof Error ? e.message : "Nie udało się wysłać audio.");
      }
    });
  }

  function uploadVoice() {
    const voice = voiceRef.current?.files?.[0];
    if (!voice) {
      setErr("Nagraj krótki fragment głosu.");
      return;
    }
    start(async () => {
      setErr("");
      setMsg("");
      try {
        const fd = new FormData();
        fd.set("voiceFragment", voice);
        const res = await uploadVoiceFragmentMomentAction(fd);
        if (!res.ok) {
          setErr(res.error);
          return;
        }
        setAudioUrl(res.audioUrl);
        setUrl("/randki/moment-audio.svg");
        setMomentKind("voice");
        setTs(res.capturedAt);
        setMsg("Fragment głosu — widoczny 24 h.");
        onMomentChange?.({ url: "/randki/moment-audio.svg", secondaryUrl: null });
        if (voiceRef.current) voiceRef.current.value = "";
      } catch (e) {
        setErr(e instanceof Error ? e.message : "Nie udało się wysłać głosu.");
      }
    });
  }

  function upload() {
    const world = worldRef.current?.files?.[0];
    const selfie = selfieRef.current?.files?.[0];
    if (!world) {
      setErr("Zrób zdjęcie otoczenia.");
      return;
    }
    if (!selfie) {
      setErr("Selfie jest wymagane.");
      return;
    }
    start(async () => {
      setErr("");
      setMsg("");
      try {
        const [worldAt, selfieAt] = await Promise.all([
          extractClientCaptureDate(world),
          extractClientCaptureDate(selfie),
        ]);
        const worldMod = getFileModifiedCaptureDate(world);
        const selfieMod = getFileModifiedCaptureDate(selfie);
        const fd = new FormData();
        fd.set("moment", world);
        fd.set("momentSelfie", selfie);
        if (worldAt) fd.set("momentCapturedAt", worldAt.toISOString());
        if (selfieAt) fd.set("selfieCapturedAt", selfieAt.toISOString());
        if (worldMod) fd.set("momentFileModified", worldMod.toISOString());
        if (selfieMod) fd.set("selfieFileModified", selfieMod.toISOString());
        fd.set("momentFromCamera", "1");
        const res = await uploadDailyMomentAction(fd);
        if (!res.ok) {
          setErr(res.error);
          return;
        }
        setUrl(res.url);
        setSecondaryUrl(res.secondaryUrl ?? null);
        setTs(res.capturedAt);
        setMsg("Moment live — widoczny 24 h.");
        onMomentChange?.({ url: res.url, secondaryUrl: res.secondaryUrl ?? null });
        if (worldRef.current) worldRef.current.value = "";
        if (selfieRef.current) selfieRef.current.value = "";
      } catch (e) {
        const msg = e instanceof Error ? e.message : "";
        setErr(
          msg ||
            "Nie udało się wysłać zdjęć (za duży plik lub słabe połączenie). Spróbuj ponownie."
        );
      }
    });
  }

  const resolve = (u: string | null) => (u ? (u.startsWith("http") ? u : `${BASE_PATH}${u}`) : null);
  const main = resolve(url);
  const selfie = resolve(secondaryUrl);
  const posted = !!(main || audioUrl || (hasMomentToday && !url));

  return (
    <div
      id="randki-moment"
      className={`randki-moment-compact scroll-mt-24 rounded-xl border border-amber-500/15 bg-amber-500/[0.06] backdrop-blur-md ${
        compact ? "mb-2 p-2.5" : "mb-5 rounded-2xl border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-transparent p-3"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className={`font-semibold uppercase tracking-wide text-amber-300/90 ${compact ? "text-[10px]" : "text-[11px]"}`}>
            {compact ? "Fragment wieczoru" : "Daily moment"}
          </p>
          {!compact && (
            <p className="mt-0.5 text-[12px] text-white/55">Zdjęcie · dźwięk otoczenia · albo fragment głosu</p>
          )}
        </div>
        {!posted && (
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-mono text-white/50">{Math.round(progress)}%</span>
        )}
      </div>

      {!posted && !compact && (
        <div className="mt-2 flex gap-1">
          <button type="button" onClick={() => setMode("photo")} className={`rounded-lg px-2 py-1 text-[10px] ${mode === "photo" ? "bg-white/15 text-white" : "text-white/45"}`}>
            📸 zdjęcie
          </button>
          <button type="button" onClick={() => setMode("audio")} className={`rounded-lg px-2 py-1 text-[10px] ${mode === "audio" ? "bg-white/15 text-white" : "text-white/45"}`}>
            🔊 dźwięk
          </button>
          <button type="button" onClick={() => setMode("voice")} className={`rounded-lg px-2 py-1 text-[10px] ${mode === "voice" ? "bg-white/15 text-white" : "text-white/45"}`}>
            🎙 głos
          </button>
        </div>
      )}

      {!posted && (
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-rose-400 transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      )}

      {posted && main && (
        <div className={`flex gap-2 ${compact ? "mt-2 items-center" : "mt-3"}`}>
          {audioUrl ? (
            <div
              className={
                compact
                  ? "w-full"
                  : `w-full rounded-xl border p-3 ${
                      momentKind === "voice" ? "border-rose-300/25 bg-rose-950/30" : "border-violet-400/20 bg-violet-950/25"
                    }`
              }
            >
              <p className="text-[10px] text-white/55">{momentKind === "voice" ? "🎙 fragment głosu" : "🔊 dźwięk chwili"}</p>
              <audio controls preload="none" src={resolve(audioUrl) ?? audioUrl} className="mt-1 w-full" />
            </div>
          ) : (
            <>
              <div className={`relative overflow-hidden ring-1 ring-white/15 ${compact ? "h-11 w-11 shrink-0 rounded-lg" : "flex-1 rounded-xl"}`}>
                <img src={main} alt="" className={`object-cover ${compact ? "h-full w-full" : "aspect-[4/3] w-full"}`} />
                {!compact && ts && (
                  <span className="absolute bottom-1.5 left-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[9px] font-mono text-white">
                    {new Date(ts).toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                )}
              </div>
              {compact ? (
                <p className="min-w-0 flex-1 text-[11px] leading-snug text-white/55">
                  {ts
                    ? `Dziś · ${new Date(ts).toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })}`
                    : "Twój fragment dnia — widoczny 24 h"}
                </p>
              ) : (
                selfie && (
                  <div className="w-[72px] shrink-0 overflow-hidden rounded-xl ring-2 ring-violet-400/30">
                    <img src={selfie} alt="" className="aspect-[3/4] h-full w-full object-cover" />
                  </div>
                )
              )}
            </>
          )}
        </div>
      )}

      {!posted && !compact && mode === "voice" && (
        <>
          <label className="mt-3 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-rose-400/30 bg-rose-950/20 px-4 py-8">
            <input ref={voiceRef} type="file" accept="audio/*" capture="user" className="sr-only" onChange={() => setVoicePick(true)} />
            <span className="text-2xl">🎙</span>
            <span className="mt-1 text-[12px] font-medium text-white/75">Fragment głosu</span>
            <span className="text-[10px] text-white/35">dobranoc · myśl na głos · do ~15 s · bez selfie</span>
          </label>
          <button type="button" disabled={pending || !voicePick} onClick={uploadVoice} className="randki-btn-primary mt-3 w-full py-2.5 text-[13px] disabled:opacity-40">
            {pending ? "Wysyłam…" : "🎙 Opublikuj głos"}
          </button>
        </>
      )}

      {!posted && !compact && mode === "audio" && (
        <>
          <label className="mt-3 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-violet-400/25 bg-violet-950/20 px-4 py-8">
            <input ref={audioRef} type="file" accept="audio/*" capture className="sr-only" onChange={() => setAudioPick(true)} />
            <span className="text-2xl">🎙</span>
            <span className="mt-1 text-[12px] font-medium text-white/75">Nagraj chwilę dźwięku</span>
            <span className="text-[10px] text-white/35">tramwaj, deszcz, cisza — do ~10 s</span>
          </label>
          <button type="button" disabled={pending || !audioPick} onClick={uploadAudio} className="randki-btn-primary mt-3 w-full py-2.5 text-[13px] disabled:opacity-40">
            {pending ? "Wysyłam…" : "🎙 Opublikuj audio"}
          </button>
        </>
      )}

      {!posted && !compact && mode === "photo" && (
        <>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <label className="group relative flex aspect-square cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-white/15 bg-black/20 transition hover:border-amber-400/40 hover:bg-amber-500/10">
              <input
                ref={worldRef}
                type="file"
                accept="image/jpeg,image/png,image/heic,image/heif,.heic,.heif"
                capture="environment"
                className="sr-only"
                onChange={() => setWorldPick(true)}
              />
              <span className="text-2xl">🌍</span>
              <span className="mt-1 text-[11px] font-medium text-white/70">Otoczenie</span>
              <span className="text-[10px] text-white/35">tył — nie musisz być w kadrze</span>
              {worldPick && <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white">✓</span>}
            </label>
            <label className="group relative flex aspect-square cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-white/15 bg-black/20 transition hover:border-violet-400/40 hover:bg-violet-500/10">
              <input
                ref={selfieRef}
                type="file"
                accept="image/jpeg,image/png,image/heic,image/heif,.heic,.heif"
                capture="user"
                className="sr-only"
                onChange={() => setSelfiePick(true)}
              />
              <span className="text-2xl">🤳</span>
              <span className="mt-1 text-[11px] font-medium text-white/70">Selfie</span>
              <span className="text-[10px] text-white/35">wymagane</span>
              {selfiePick && <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white">✓</span>}
            </label>
          </div>
          <button
            type="button"
            disabled={pending || !worldPick || !selfiePick}
            onClick={upload}
            className="randki-btn-primary mt-3 w-full py-2.5 text-[13px] disabled:opacity-40"
          >
            {pending ? "Wysyłam…" : "📸 Opublikuj moment"}
          </button>
        </>
      )}

      {!posted && compact && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <label className="cursor-pointer rounded-lg border border-dashed border-white/15 px-2 py-1 text-[10px] text-white/60 hover:border-amber-400/40">
            <input ref={worldRef} type="file" accept="image/jpeg,image/png,image/heic,image/heif,.heic,.heif" capture="environment" className="sr-only" onChange={() => setWorldPick(true)} />
            🌍 {worldPick ? "✓" : "otoczenie"}
          </label>
          <label className="cursor-pointer rounded-lg border border-dashed border-white/15 px-2 py-1 text-[10px] text-white/60 hover:border-violet-400/40">
            <input ref={selfieRef} type="file" accept="image/jpeg,image/png,image/heic,image/heif,.heic,.heif" capture="user" className="sr-only" onChange={() => setSelfiePick(true)} />
            🤳 {selfiePick ? "✓" : "selfie"}
          </label>
          <button type="button" disabled={pending || !worldPick || !selfiePick} onClick={upload} className="rounded-lg bg-rose-500/90 px-2.5 py-1 text-[10px] font-medium text-white disabled:opacity-40">
            {pending ? "…" : "Dodaj"}
          </button>
        </div>
      )}

      {posted && !msg && !compact && <p className="mt-2 text-[12px] text-emerald-300">✓ Moment aktywny</p>}
      {msg && <p className="mt-2 text-[12px] text-emerald-300">{msg}</p>}
      {err && <p className="mt-2 text-[12px] text-rose-300">{err}</p>}
    </div>
  );
}
